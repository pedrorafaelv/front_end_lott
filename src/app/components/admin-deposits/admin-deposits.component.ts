import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

import { AdminDepositService } from '../../services/admin-deposit.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import {
    AdminDepositFilters,
    DashboardStats,
    DepositRequest,
    DepositStats,
    UserInfo,
    ViaInfo,
} from '../../interfaces/admin-deposit.interface';

@Component({
    selector: 'app-admin-deposits',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './admin-deposits.component.html',
    styleUrls: ['./admin-deposits.component.css']
})
export class AdminDepositsComponent implements OnInit, OnDestroy {

    // ============================================
    // ESTADO
    // ============================================
    adminId: number = 0;

    // Tabs
    activeTab: 'requests' | 'create' | 'history' = 'requests';

    // ============================================
    // TAB 1: SOLICITUDES
    // ============================================
    deposits: DepositRequest[] = [];
    selectedDeposit: DepositRequest | null = null;
    selectedDepositDetail: any = null;

    // Stats
    dashboardStats: DashboardStats | null = null;
    stats: DepositStats | null = null;

    // Vías y monedas
    vias: ViaInfo[] = [];
    currencies: string[] = [];

    // Paginación
    pagination = {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1,
    };

    // Filtros
    filters: AdminDepositFilters = {
        status: null,
        currency_id: null,
        user_id: null,
        date_from: null,
        date_to: null,
        search: null,
        page: 1,
        per_page: 20,
    };

    // UI
    loading = false;
    loadingDetail = false;
    showDetailModal = false;
    showFilters = false;
    showStatsPanel = false;
    selectedStatusTab: string = 'all';
    Math = Math;

    // Formularios
    approveForm: FormGroup;
    rejectForm: FormGroup;
    completeForm: FormGroup;

    // Tabs de estado
    statusTabs = [
        { key: 'all', label: 'Todas', icon: 'fas fa-list', color: '#ffffff' },
        { key: 'pending', label: 'Pendientes', icon: 'fas fa-clock', color: '#f39c12' },
        { key: 'approved', label: 'Aprobadas', icon: 'fas fa-check', color: '#3a7ebf' },
        { key: 'completed', label: 'Completadas', icon: 'fas fa-check-double', color: '#00e676' },
        { key: 'rejected', label: 'Rechazadas', icon: 'fas fa-times', color: '#ff4757' },
        { key: 'cancelled', label: 'Canceladas', icon: 'fas fa-ban', color: '#909090' },
    ];

    // ============================================
    // TAB 2: CREAR DEPÓSITO
    // ============================================
    searchUserQuery: string = '';
    searchUserResults: UserInfo[] = [];
    searchingUsers = false;
    selectedUser: UserInfo | null = null;
    userCurrentBalance: number = 0;
    userCurrentPromo: number = 0;

    depositForm: FormGroup;
    submittingDeposit = false;

    private searchSubject = new Subject<string>();

    private destroy$ = new Subject<void>();

    constructor(
        private adminDepositService: AdminDepositService,
        private authService: AuthService,
        private userService: UserService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private router:Router
    ) {
        // Formulario de aprobación
        this.approveForm = this.fb.group({
            admin_notes: [''],
        });

        // Formulario de rechazo
        this.rejectForm = this.fb.group({
            admin_notes: ['', [Validators.required, Validators.minLength(5)]],
        });

        // Formulario de completar
        this.completeForm = this.fb.group({
            admin_notes: [''],
        });

        // Formulario de crear depósito
        this.depositForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(0.01)]],
            currency_id: ['USD', Validators.required],
            via_id: ['', Validators.required],
            reference: [''],
            description: [''],
            admin_notes: [''],
            add_promotion: [false],
            promotion_amount: [''],
            expires_at: [''],
        });
    }

    ngOnInit(): void {
        const id = this.authService.getUserId();
        if (id === null) {
             this.router.navigateByUrl('/log-in');   // sin sesión no debería estar aquí
         return;
        }
        this.adminId = id;
        this.loadAdminUser();
        this.setupUserSearch();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // ============================================
    // CARGA INICIAL
    // ============================================
    private async loadAdminUser(): Promise<void> {
        try {
            const localId = this.authService.getLocalId();
            if (!localId) return;

            const user = await this.userService.getUserByLocalId(localId);
            // console.log('👤 Admin ID:', this.adminId);

            this.loadDeposits();
            this.loadStats();
            this.loadVias();

        } catch (error) {
            console.error('❌ Error al cargar admin:', error);
        }
    }

    private loadVias(): void {
        // Vías por defecto para depósitos
        this.vias = [
            { id: 1, code: 'transfer', label: 'Transferencia', icon: 'fas fa-exchange-alt', color: '#3a7ebf', type: 'credit' },
            { id: 6, code: 'deposit', label: 'Depósito', icon: 'fas fa-arrow-down', color: '#00e676', type: 'credit' },
            { id: 5, code: 'other', label: 'Otro', icon: 'fas fa-circle', color: '#909090', type: 'neutral' },
        ];
    }

    // ============================================
    // TABS
    // ============================================
    changeTab(tab: 'requests' | 'create' | 'history'): void {
        this.activeTab = tab;
    }

    // ============================================
    // CARGAR DEPÓSITOS
    // ============================================
    loadDeposits(): void {
        this.loading = true;

        this.adminDepositService.getDeposits(this.filters)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    console.log('adminsDepositServices.getDeposits', resp);
                    if (resp.success && resp.data) {
                        this.deposits = resp.data.deposits;
                        this.pagination = resp.data.pagination;
                        this.dashboardStats = resp.data.stats;

                        // Extraer vías únicas
                        const viasMap = new Map();
                        this.deposits.forEach(d => {
                            if (d.via && !viasMap.has(d.via.id)) {
                                viasMap.set(d.via.id, d.via);
                            }
                        });
                        if (viasMap.size > 0) {
                            this.vias = Array.from(viasMap.values());
                        }

                        // Extraer monedas únicas
                        const currenciesSet = new Set<string>();
                        this.deposits.forEach(d => currenciesSet.add(d.currency_id));
                        this.currencies = Array.from(currenciesSet);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('❌ Error:', err);
                    this.loading = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron cargar las solicitudes',
                        confirmButtonColor: '#176585'
                    });
                }
            });
    }

    loadStats(): void {
        this.adminDepositService.getStats()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success) {
                        this.stats = resp.data;
                    }
                },
                error: (err) => console.error('❌ Error stats:', err)
            });
    }

    // ============================================
    // TABS DE ESTADO
    // ============================================
    changeStatusTab(status: string): void {
        this.selectedStatusTab = status;
        this.filters.status = status === 'all' ? null : status;
        this.filters.page = 1;
        this.loadDeposits();
    }

    getStatusCount(status: string): number {
        if (!this.dashboardStats && !this.stats) return 0;

        if (status === 'pending') return this.stats?.by_status?.pending ?? this.dashboardStats?.pending_count ?? 0;
        if (status === 'approved') return this.stats?.by_status?.approved ?? 0;
        if (status === 'completed') return this.stats?.by_status?.completed ?? 0;
        if (status === 'rejected') return this.stats?.by_status?.rejected ?? 0;
        if (status === 'cancelled') return this.stats?.by_status?.cancelled ?? 0;
        if (status === 'all') return this.stats?.total_requests ?? this.pagination.total ?? 0;
        return 0;
    }

    // ============================================
    // BÚSQUEDA Y FILTROS
    // ============================================
    onSearch(event: any): void {
        this.filters.search = event.target.value;
        this.filters.page = 1;
        this.loadDeposits();
    }

    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    applyFilters(): void {
        this.filters.page = 1;
        this.loadDeposits();
    }

    clearFilters(): void {
        this.filters = {
            status: null,
            currency_id: null,
            user_id: null,
            date_from: null,
            date_to: null,
            search: null,
            page: 1,
            per_page: 20,
        };
        this.selectedStatusTab = 'all';
        this.loadDeposits();
    }

    // ============================================
    // PAGINACIÓN
    // ============================================
    goToPage(page: number): void {
        if (page < 1 || page > this.pagination.last_page) return;
        this.filters.page = page;
        this.loadDeposits();
    }

    get pages(): number[] {
        const pages: number[] = [];
        const total = this.pagination.last_page;
        const current = this.pagination.current_page;
        const start = Math.max(1, current - 2);
        const end = Math.min(total, current + 2);
        for (let i = start; i <= end; i++) pages.push(i);
        return pages;
    }

    // ============================================
    // DETALLE
    // ============================================
    openDetail(deposit: DepositRequest): void {
        this.selectedDeposit = deposit;
        this.showDetailModal = true;

        this.approveForm.reset({ admin_notes: '' });
        this.rejectForm.reset({ admin_notes: '' });
        this.completeForm.reset({ admin_notes: '' });

        // Cargar detalle completo
        this.loadingDetail = true;
        this.adminDepositService.getDepositDetail(deposit.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success) {
                        this.selectedDepositDetail = resp.data;
                    }
                    this.loadingDetail = false;
                },
                error: (err) => {
                    console.error('❌ Error:', err);
                    this.loadingDetail = false;
                }
            });
    }

    closeDetail(): void {
        this.showDetailModal = false;
        this.selectedDeposit = null;
        this.selectedDepositDetail = null;
    }

    // ============================================
    // ACCIONES: APROBAR / RECHAZAR / COMPLETAR
    // ============================================
    approve(): void {
        if (!this.selectedDeposit) return;

        Swal.fire({
            icon: 'question',
            title: 'Aprobar depósito',
            html: `¿Aprobar el depósito de <b>${this.formatCurrency(this.selectedDeposit.amount)}</b>?`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, aprobar',
            confirmButtonColor: '#3a7ebf'
        }).then((result) => {
            if (result.isConfirmed && this.selectedDeposit) {
                const action = {
                    admin_id: this.adminId,
                    admin_notes: this.approveForm.value.admin_notes || null,
                };

                this.adminDepositService.approve(this.selectedDeposit.id, action)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Aprobado',
                                text: 'La solicitud ha sido aprobada',
                                timer: 1500,
                                showConfirmButton: false
                            });
                            this.closeDetail();
                            this.loadDeposits();
                            this.loadStats();
                        },
                        error: (err) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: err.error?.error || 'No se pudo aprobar',
                                confirmButtonColor: '#176585'
                            });
                        }
                    });
            }
        });
    }

    reject(): void {
        if (!this.selectedDeposit) return;

        if (this.rejectForm.invalid) {
            this.rejectForm.markAllAsTouched();
            return;
        }

        Swal.fire({
            icon: 'warning',
            title: 'Rechazar depósito',
            html: `¿Rechazar el depósito de <b>${this.formatCurrency(this.selectedDeposit.amount)}</b>?`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, rechazar',
            confirmButtonColor: '#e94560'
        }).then((result) => {
            if (result.isConfirmed && this.selectedDeposit) {
                const action = {
                    admin_id: this.adminId,
                    admin_notes: this.rejectForm.value.admin_notes,
                };

                this.adminDepositService.reject(this.selectedDeposit.id, action)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Rechazado',
                                text: 'La solicitud ha sido rechazada',
                                timer: 1500,
                                showConfirmButton: false
                            });
                            this.closeDetail();
                            this.loadDeposits();
                            this.loadStats();
                        },
                        error: (err) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: err.error?.error || 'No se pudo rechazar',
                                confirmButtonColor: '#176585'
                            });
                        }
                    });
            }
        });
    }

    complete(): void {
        if (!this.selectedDeposit) return;

        Swal.fire({
            icon: 'question',
            title: 'Completar depósito',
            html: `
                <div style="text-align: left;">
                    <p>Confirma que ya recibiste el pago de:</p>
                    <p><b>${this.formatCurrency(this.selectedDeposit.amount)}</b></p>
                    <p><small>El monto se acreditará al balance del usuario</small></p>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, completar',
            confirmButtonColor: '#00a843'
        }).then((result) => {
            if (result.isConfirmed && this.selectedDeposit) {
                const action = {
                    admin_id: this.adminId,
                    admin_notes: this.completeForm.value.admin_notes || null,
                };

                this.adminDepositService.complete(this.selectedDeposit.id, action)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Completado',
                                text: 'El monto ha sido acreditado al usuario',
                                timer: 1500,
                                showConfirmButton: false
                            });
                            this.closeDetail();
                            this.loadDeposits();
                            this.loadStats();
                        },
                        error: (err) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: err.error?.error || 'No se pudo completar',
                                confirmButtonColor: '#176585'
                            });
                        }
                    });
            }
        });
    }

    // ============================================
    // TAB 2: BUSCAR USUARIOS
    // ============================================
    private setupUserSearch(): void {
        this.searchSubject.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            takeUntil(this.destroy$)
        ).subscribe(query => {
            if (query && query.length >= 2) {
                this.searchUsers(query);
            } else {
                this.searchUserResults = [];
            }
        });
    }

    onUserSearchInput(event: any): void {
        const query = event.target.value;
        this.searchUserQuery = query;
        this.searchSubject.next(query);
    }

    private searchUsers(query: string): void {
        this.searchingUsers = true;
        this.adminDepositService.searchUsers(query)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success) {
                        this.searchUserResults = resp.data;
                    }
                    this.searchingUsers = false;
                },
                error: (err) => {
                    console.error('❌ Error búsqueda:', err);
                    this.searchingUsers = false;
                }
            });
    }

    selectUser(user: UserInfo): void {
        this.selectedUser = user;
        this.searchUserResults = [];
        this.searchUserQuery = '';

        // Buscar balance del usuario
        const balances = user.balances || {};
        const usdBalance = balances['USD'] as any;
        this.userCurrentBalance = usdBalance?.total_amount ?? 0;
        this.userCurrentPromo = usdBalance?.total_promo ?? 0;

        // Actualizar moneda del formulario si hay balance
        const currencyCodes = Object.keys(balances);
        if (currencyCodes.length > 0) {
            this.depositForm.patchValue({ currency_id: currencyCodes[0] });
        }
    }

    clearSelectedUser(): void {
        this.selectedUser = null;
        this.userCurrentBalance = 0;
        this.userCurrentPromo = 0;
        this.depositForm.reset({
            amount: '',
            currency_id: 'USD',
            via_id: '',
            reference: '',
            description: '',
            admin_notes: '',
            add_promotion: false,
            promotion_amount: '',
            expires_at: '',
        });
    }

    // ============================================
    // TAB 2: CREAR DEPÓSITO
    // ============================================
    submitManualDeposit(): void {
        if (!this.selectedUser) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin usuario',
                text: 'Selecciona un usuario primero',
                confirmButtonColor: '#176585'
            });
            return;
        }

        if (this.depositForm.invalid) {
            this.depositForm.markAllAsTouched();
            return;
        }

        const formValue = this.depositForm.value;

        // Validar bono si está activo
        if (formValue.add_promotion && (!formValue.promotion_amount || formValue.promotion_amount <= 0)) {
            Swal.fire({
                icon: 'warning',
                title: 'Bono inválido',
                text: 'Ingresa un monto válido para el bono',
                confirmButtonColor: '#176585'
            });
            return;
        }

        // Confirmación
        Swal.fire({
            icon: 'question',
            title: 'Confirmar depósito',
            html: `
                <div style="text-align: left; padding: 10px;">
                    <p><b>Usuario:</b> ${this.selectedUser.name}</p>
                    <p><b>Monto:</b> ${this.formatCurrency(formValue.amount, formValue.currency_id)}</p>
                    ${formValue.add_promotion ? `<p><b>Bono:</b> ${this.formatCurrency(formValue.promotion_amount, formValue.currency_id)}</p>` : ''}
                    <p><b>Balance actual:</b> ${this.formatCurrency(this.userCurrentBalance, formValue.currency_id)}</p>
                    <p><b>Nuevo balance:</b> ${this.formatCurrency(this.userCurrentBalance + Number(formValue.amount), formValue.currency_id)}</p>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, crear depósito',
            confirmButtonColor: '#00a843'
        }).then((result) => {
            if (result.isConfirmed) {
                this.processManualDeposit(formValue);
            }
        });
    }

    private processManualDeposit(formValue: any): void {
        this.submittingDeposit = true;

        const payload = {
            user_id: this.selectedUser!.id,
            admin_id: this.adminId,
            currency_id: formValue.currency_id,
            amount: Number(formValue.amount),
            via_id: Number(formValue.via_id),
            reference: formValue.reference || null,
            description: formValue.description || 'Depósito manual',
            admin_notes: formValue.admin_notes || null,
            add_promotion: formValue.add_promotion || false,
            promotion_amount: formValue.add_promotion ? Number(formValue.promotion_amount) : 0,
            expires_at: formValue.expires_at || null,
        };

        this.adminDepositService.createManual(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    this.submittingDeposit = false;

                    Swal.fire({
                        icon: 'success',
                        title: '¡Depósito creado!',
                        html: `
                            <p>El monto ha sido acreditado</p>
                            <p><b>Nuevo balance:</b> ${this.formatCurrency(resp.new_balance, formValue.currency_id)}</p>
                        `,
                        confirmButtonColor: '#176585'
                    });

                    this.clearSelectedUser();
                },
                error: (err) => {
                    this.submittingDeposit = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: err.error?.error || 'No se pudo crear el depósito',
                        confirmButtonColor: '#176585'
                    });
                }
            });
    }

    // ============================================
    // EXPORTAR
    // ============================================
    exportData(): void {
        this.adminDepositService.export(this.filters)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success) {
                        const csv = this.convertToCSV(resp.data);
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        const url = URL.createObjectURL(blob);
                        link.setAttribute('href', url);
                        link.setAttribute('download', `depositos_${new Date().getTime()}.csv`);
                        link.style.visibility = 'hidden';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);

                        Swal.fire({
                            icon: 'success',
                            title: 'Exportado',
                            text: 'El archivo se ha descargado',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    }
                },
                error: (err) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo exportar',
                        confirmButtonColor: '#176585'
                    });
                }
            });
    }

    private convertToCSV(data: DepositRequest[]): string {
        const headers = ['ID', 'Usuario', 'Email', 'Monto', 'Moneda', 'Método', 'Estado', 'Fecha'];
        const rows = data.map(d => [
            d.id,
            d.user?.name ?? '',
            d.user?.email ?? '',
            d.amount,
            d.currency_id,
            d.via?.label ?? '',
            d.status,
            this.formatDate(d.created_at),
        ]);
        return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }

    // ============================================
    // HELPERS
    // ============================================
    formatCurrency(amount: number, currencyCode: string = 'USD'): string {
        const symbols: { [key: string]: string } = {
            USD: '$', EUR: '€', VES: 'Bs', USDT: '₮'
        };
        const symbol = symbols[currencyCode] || '$';
        return `${symbol}${Number(amount).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }

    getStatusClass(status: string): string {
        const classes: { [key: string]: string } = {
            pending: 'status-pending',
            approved: 'status-approved',
            rejected: 'status-rejected',
            completed: 'status-completed',
            cancelled: 'status-cancelled',
        };
        return classes[status] || '';
    }

    getStatusLabel(status: string): string {
        const labels: { [key: string]: string } = {
            pending: 'Pendiente',
            approved: 'Aprobado',
            rejected: 'Rechazado',
            completed: 'Completado',
            cancelled: 'Cancelado',
        };
        return labels[status] || status;
    }

    getStatusIcon(status: string): string {
        const icons: { [key: string]: string } = {
            pending: 'fas fa-clock',
            approved: 'fas fa-check',
            rejected: 'fas fa-times',
            completed: 'fas fa-check-double',
            cancelled: 'fas fa-ban',
        };
        return icons[status] || 'fas fa-circle';
    }

    trackByDepositId(index: number, d: DepositRequest): number {
        return d.id;
    }

    // ============================================
    // GETTERS
    // ============================================
    get canApprove(): boolean {
        return this.selectedDeposit?.status === 'pending';
    }
    get canReject(): boolean {
        return this.selectedDeposit?.status === 'pending';
    }
    get canComplete(): boolean {
        return this.selectedDeposit?.status === 'approved';
    }

    get rejectNotesInvalid(): boolean {
        const c = this.rejectForm.get('admin_notes');
        return !!c && c.invalid && c.touched;
    }

    get amountInvalid(): boolean {
        const c = this.depositForm.get('amount');
        return !!c && c.invalid && c.touched;
    }

    get viaInvalid(): boolean {
        const c = this.depositForm.get('via_id');
        return !!c && c.invalid && c.touched;
    }

    get newBalancePreview(): number {
        const amount = Number(this.depositForm.value.amount) || 0;
        return this.userCurrentBalance + amount;
    }
}