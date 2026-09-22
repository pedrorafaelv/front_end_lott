import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { AdminWithdrawalService } from '../../services/admin-withdrawal.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import {
    AdminWithdrawalFilters,
    DashboardStats,
    ViaInfo,
    WithdrawalLog,
    WithdrawalRequest,
    WithdrawalStats,
} from '../../interfaces/admin-withdrawal.interface';

@Component({
    selector: 'app-admin-withdrawals',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './admin-withdrawals.component.html',
    styleUrls: ['./admin-withdrawals.component.css']
})
export class AdminWithdrawalsComponent implements OnInit, OnDestroy {

    // ============================================
    // ESTADO
    // ============================================
    adminId: number = 0;

    // Data
    withdrawals: WithdrawalRequest[] = [];
    selectedWithdrawal: WithdrawalRequest | null = null;
    withdrawalLogs: WithdrawalLog[] = [];
    stats: WithdrawalStats | null = null;
    dashboardStats: DashboardStats | null = null;

    // Vías disponibles (para mostrar)
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
    filters: AdminWithdrawalFilters = {
        status: null,
        currency_code: null,
        user_id: null,
        date_from: null,
        date_to: null,
        search: null,
        page: 1,
        per_page: 20,
    };

    // Estados de UI
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

    private destroy$ = new Subject<void>();

    constructor(
        private adminWithdrawalService: AdminWithdrawalService,
        private authService: AuthService,
        private userService: UserService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        // Formulario de aprobación
        this.approveForm = this.fb.group({
            admin_notes: [''],
        });

        // Formulario de rechazo (notas requeridas)
        this.rejectForm = this.fb.group({
            admin_notes: ['', [Validators.required, Validators.minLength(5)]],
        });

        // Formulario de completar (referencia requerida)
        this.completeForm = this.fb.group({
            transaction_reference: ['', [Validators.required, Validators.minLength(3)]],
            admin_notes: [''],
        });
    }

    ngOnInit(): void {
        this.loadAdminUser();
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
            if (!localId) {
                console.error('❌ No hay usuario autenticado');
                return;
            }

            const user = await this.userService.getUserByLocalId(localId);
            this.adminId = user.user[0]['id'];
            console.log('👤 Admin ID:', this.adminId);

            this.loadWithdrawals();
            this.loadStats();

        } catch (error) {
            console.error('❌ Error al cargar admin:', error);
        }
    }

    // ============================================
    // CARGAR LISTADO
    // ============================================
    loadWithdrawals(): void {
        this.loading = true;

        this.adminWithdrawalService.getWithdrawals(this.filters)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success && resp.data) {
                        this.withdrawals = resp.data.withdrawals;
                        this.pagination = resp.data.pagination;
                        this.dashboardStats = resp.data.stats;

                        // Extraer vías únicas
                        const viasMap = new Map();
                        this.withdrawals.forEach(w => {
                            if (w.via && !viasMap.has(w.via.id)) {
                                viasMap.set(w.via.id, w.via);
                            }
                        });
                        this.vias = Array.from(viasMap.values());

                        // Extraer monedas únicas
                        const currenciesSet = new Set<string>();
                        this.withdrawals.forEach(w => currenciesSet.add(w.currency_code));
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

    // ============================================
    // CARGAR ESTADÍSTICAS
    // ============================================
    loadStats(): void {
        this.adminWithdrawalService.getStats()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success) {
                        this.stats = resp.data;
                    }
                },
                error: (err) => {
                    console.error('❌ Error cargando stats:', err);
                }
            });
    }

    // ============================================
    // TABS DE ESTADO
    // ============================================
    changeStatusTab(status: string): void {
        this.selectedStatusTab = status;
        this.filters.status = status === 'all' ? null : status as any;
        this.filters.page = 1;
        this.loadWithdrawals();
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
    // BÚSQUEDA
    // ============================================
    onSearch(event: any): void {
        this.filters.search = event.target.value;
        this.filters.page = 1;
        this.loadWithdrawals();
    }

    // ============================================
    // FILTROS
    // ============================================
    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    applyFilters(): void {
        this.filters.page = 1;
        this.loadWithdrawals();
    }

    clearFilters(): void {
        this.filters = {
            status: null,
            currency_code: null,
            user_id: null,
            date_from: null,
            date_to: null,
            search: null,
            page: 1,
            per_page: 20,
        };
        this.selectedStatusTab = 'all';
        this.loadWithdrawals();
    }

    // ============================================
    // PAGINACIÓN
    // ============================================
    goToPage(page: number): void {
        if (page < 1 || page > this.pagination.last_page) return;
        this.filters.page = page;
        this.loadWithdrawals();
    }

    get pages(): number[] {
        const pages: number[] = [];
        const total = this.pagination.last_page;
        const current = this.pagination.current_page;

        const start = Math.max(1, current - 2);
        const end = Math.min(total, current + 2);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }

    // ============================================
    // DETALLE DE SOLICITUD
    // ============================================
    openDetail(withdrawal: WithdrawalRequest): void {
        this.selectedWithdrawal = withdrawal;
        this.showDetailModal = true;
        this.withdrawalLogs = [];

        // Resetear formularios
        this.approveForm.reset({ admin_notes: '' });
        this.rejectForm.reset({ admin_notes: '' });
        this.completeForm.reset({ transaction_reference: '', admin_notes: '' });

        // Cargar logs
        this.loadLogs(withdrawal.id);
    }

    closeDetail(): void {
        this.showDetailModal = false;
        this.selectedWithdrawal = null;
        this.withdrawalLogs = [];
    }

    loadLogs(id: number): void {
        this.loadingDetail = true;
        this.adminWithdrawalService.getLogs(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success) {
                        this.withdrawalLogs = resp.data;
                    }
                    this.loadingDetail = false;
                },
                error: (err) => {
                    console.error('❌ Error:', err);
                    this.loadingDetail = false;
                }
            });
    }

    // ============================================
    // ACCIONES
    // ============================================
    approve(): void {
        if (!this.selectedWithdrawal) return;

        Swal.fire({
            icon: 'question',
            title: 'Aprobar solicitud',
            html: `¿Aprobar el retiro de <b>${this.formatCurrency(this.selectedWithdrawal.amount)}</b>?`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, aprobar',
            confirmButtonColor: '#3a7ebf'
        }).then((result) => {
            if (result.isConfirmed && this.selectedWithdrawal) {
                const action = {
                    admin_id: this.adminId,
                    admin_notes: this.approveForm.value.admin_notes || null,
                };

                this.adminWithdrawalService.approve(this.selectedWithdrawal.id, action)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Aprobada',
                                text: 'La solicitud ha sido aprobada',
                                timer: 1500,
                                showConfirmButton: false
                            });
                            this.closeDetail();
                            this.loadWithdrawals();
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
        if (!this.selectedWithdrawal) return;

        if (this.rejectForm.invalid) {
            this.rejectForm.markAllAsTouched();
            return;
        }

        Swal.fire({
            icon: 'warning',
            title: 'Rechazar solicitud',
            html: `¿Rechazar el retiro de <b>${this.formatCurrency(this.selectedWithdrawal.amount)}</b>?`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, rechazar',
            confirmButtonColor: '#e94560'
        }).then((result) => {
            if (result.isConfirmed && this.selectedWithdrawal) {
                const action = {
                    admin_id: this.adminId,
                    admin_notes: this.rejectForm.value.admin_notes,
                };

                this.adminWithdrawalService.reject(this.selectedWithdrawal.id, action)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Rechazada',
                                text: 'La solicitud ha sido rechazada',
                                timer: 1500,
                                showConfirmButton: false
                            });
                            this.closeDetail();
                            this.loadWithdrawals();
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
        if (!this.selectedWithdrawal) return;

        if (this.completeForm.invalid) {
            this.completeForm.markAllAsTouched();
            return;
        }

        Swal.fire({
            icon: 'question',
            title: 'Marcar como completado',
            html: `
                <div style="text-align: left;">
                    <p>Confirma que ya realizaste la transferencia de:</p>
                    <p><b>${this.formatCurrency(this.selectedWithdrawal.net_amount)}</b></p>
                    <p><small>Ref: ${this.completeForm.value.transaction_reference}</small></p>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Sí, completar',
            confirmButtonColor: '#00a843'
        }).then((result) => {
            if (result.isConfirmed && this.selectedWithdrawal) {
                const action = {
                    admin_id: this.adminId,
                    transaction_reference: this.completeForm.value.transaction_reference,
                    admin_notes: this.completeForm.value.admin_notes || null,
                };

                this.adminWithdrawalService.complete(this.selectedWithdrawal.id, action)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Completada',
                                text: 'La solicitud ha sido marcada como completada',
                                timer: 1500,
                                showConfirmButton: false
                            });
                            this.closeDetail();
                            this.loadWithdrawals();
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
    // EXPORTAR
    // ============================================
    exportData(): void {
        this.adminWithdrawalService.export(this.filters)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success) {
                        // Convertir a CSV
                        const csv = this.convertToCSV(resp.data);
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const link = document.createElement('a');
                        const url = URL.createObjectURL(blob);

                        link.setAttribute('href', url);
                        link.setAttribute('download', `retiros_${new Date().getTime()}.csv`);
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
                    console.error('❌ Error al exportar:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo exportar',
                        confirmButtonColor: '#176585'
                    });
                }
            });
    }

    private convertToCSV(data: WithdrawalRequest[]): string {
        const headers = ['ID', 'Usuario', 'Email', 'Monto', 'Comisión', 'Neto', 'Moneda', 'Estado', 'Fecha'];
        const rows = data.map(w => [
            w.id,
            w.user?.name ?? '',
            w.user?.email ?? '',
            w.amount,
            w.commission,
            w.net_amount,
            w.currency_code,
            w.status,
            this.formatDate(w.created_at),
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
        return `${symbol}${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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
            approved: 'Aprobada',
            rejected: 'Rechazada',
            completed: 'Completada',
            cancelled: 'Cancelada',
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

    trackByWithdrawalId(index: number, w: WithdrawalRequest): number {
        return w.id;
    }

    get canApprove(): boolean {
        return this.selectedWithdrawal?.status === 'pending';
    }

    get canReject(): boolean {
        return this.selectedWithdrawal?.status === 'pending';
    }

    get canComplete(): boolean {
        return this.selectedWithdrawal?.status === 'approved';
    }

    get rejectNotesInvalid(): boolean {
        const c = this.rejectForm.get('admin_notes');
        return !!c && c.invalid && c.touched;
    }

    get referenceInvalid(): boolean {
        const c = this.completeForm.get('transaction_reference');
        return !!c && c.invalid && c.touched;
    }
}