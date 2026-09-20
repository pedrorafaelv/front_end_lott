import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { AccountService } from '../../services/account.service';
import { WithdrawalService } from '../../services/withdrawal.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

import {
    AccountSummary,
    AccountTransaction,
    Balance,
    Currency,
    TransactionFilters,
    Via,
    WithdrawalRequest,
} from '../../interfaces/account.interface';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit, OnDestroy {

    // ============================================
    // ESTADO
    // ============================================
    userId: number = 0;
    selectedCurrency: string = 'USD';

    // Data
    summary: AccountSummary | null = null;
    balances: Balance[] = [];
    currentBalance: Balance | null = null;
    transactions: AccountTransaction[] = [];
    withdrawalRequests: WithdrawalRequest[] = [];
    currencies: Currency[] = [];
    vias: Via[] = [];

    // Paginación
    pagination = {
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1,
    };

    // Filtros
    filters: TransactionFilters = {
        currency_code: 'USD',
        via_id: null,
        type: null,
        date_from: null,
        date_to: null,
        amount_min: null,
        amount_max: null,
        page: 1,
        per_page: 20,
    };

    // Estados de UI
    loading = false;
    loadingTransactions = false;
    showWithdrawalModal = false;
    showFilters = false;
    Math = Math;

    // Formulario de retiro
    withdrawalForm: FormGroup;

    // Destruir suscripciones
    private destroy$ = new Subject<void>();

    constructor(
        private accountService: AccountService,
        private withdrawalService: WithdrawalService,
        private authService: AuthService,
        private userService: UserService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef
    ) {
        this.withdrawalForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(1)]],
            via_id: ['', Validators.required],
            payment_data: ['', Validators.required],
            user_notes: [''],
        });
    }

    ngOnInit(): void {
        this.loadUserAndData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // ============================================
    // CARGA INICIAL
    // ============================================
    private async loadUserAndData(): Promise<void> {
        this.loading = true;

        try {
            const localId = this.authService.getLocalId();

            if (!localId) {
                console.error('❌ No hay usuario autenticado');
                this.loading = false;
                return;
            }

            // Obtener el ID del usuario
            const user = await this.userService.getUserByLocalId(localId);
            this.userId = user.user[0]['id'];

            console.log('👤 Usuario ID:', this.userId);

            // Cargar resumen completo
            await this.loadSummary();

        } catch (error) {
            console.error('❌ Error al cargar usuario:', error);
            this.loading = false;
        }
    }

    // ============================================
    // CARGAR RESUMEN
    // ============================================
    private loadSummary(): void {
        this.accountService.getSummary(this.userId)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success && resp.data) {
                        this.summary = resp.data;
                        this.currencies = resp.data.currencies;
                        this.vias = resp.data.vias;
                        this.withdrawalRequests = resp.data.withdrawal_requests;

                        // Convertir balances a array
                        this.balances = Object.values(resp.data.balances || {});

                        // Si hay balances y no hay moneda seleccionada, usar la primera
                        if (this.balances.length > 0 && !this.selectedCurrency) {
                            this.selectedCurrency = this.balances[0].currency_code;
                        }

                        // Actualizar balance actual
                        this.updateCurrentBalance();

                        // Cargar transacciones del balance actual
                        this.filters.currency_code = this.selectedCurrency;
                        this.loadTransactions();

                        console.log('✅ Resumen cargado:', this.summary);
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('❌ Error al cargar resumen:', err);
                    this.loading = false;

                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo cargar la información de la cuenta',
                        confirmButtonColor: '#176585'
                    });
                }
            });
    }

    // ============================================
    // CARGAR TRANSACCIONES
    // ============================================
    loadTransactions(): void {
        this.loadingTransactions = true;

        this.accountService.getTransactions(this.userId, this.filters)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    if (resp.success && resp.data) {
                        this.transactions = resp.data.transactions;
                        this.pagination = resp.data.pagination;
                        console.log('📋 Transacciones:', this.transactions);
                    }
                    this.loadingTransactions = false;
                },
                error: (err) => {
                    console.error('❌ Error:', err);
                    this.loadingTransactions = false;
                }
            });
    }

    // ============================================
    // CAMBIAR MONEDA
    // ============================================
    changeCurrency(currencyCode: string): void {
        this.selectedCurrency = currencyCode;
        this.filters.currency_code = currencyCode;
        this.filters.page = 1;
        this.updateCurrentBalance();
        this.loadTransactions();
    }

    private updateCurrentBalance(): void {
        this.currentBalance = this.balances.find(
            b => b.currency_code === this.selectedCurrency
        ) || null;
    }

    // ============================================
    // FILTROS
    // ============================================
    toggleFilters(): void {
        this.showFilters = !this.showFilters;
    }

    applyFilters(): void {
        this.filters.page = 1;
        this.loadTransactions();
    }

    clearFilters(): void {
        this.filters = {
            currency_code: this.selectedCurrency,
            via_id: null,
            type: null,
            date_from: null,
            date_to: null,
            amount_min: null,
            amount_max: null,
            page: 1,
            per_page: 20,
        };
        this.loadTransactions();
    }

    filterByVia(viaId: number | null): void {
        this.filters.via_id = viaId;
        this.filters.page = 1;
        this.loadTransactions();
    }

    // ============================================
    // PAGINACIÓN
    // ============================================
    goToPage(page: number): void {
        if (page < 1 || page > this.pagination.last_page) return;
        this.filters.page = page;
        this.loadTransactions();
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
    // MODAL DE RETIRO
    // ============================================
    openWithdrawalModal(): void {
        if (!this.currentBalance || this.currentBalance.amount <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Sin saldo',
                text: 'No tienes saldo disponible para retirar en esta moneda',
                confirmButtonColor: '#176585'
            });
            return;
        }

        this.withdrawalForm.reset({
            amount: '',
            via_id: '',
            payment_data: '',
            user_notes: '',
        });

        this.showWithdrawalModal = true;
    }

    closeWithdrawalModal(): void {
        this.showWithdrawalModal = false;
    }

    submitWithdrawal(): void {
        if (this.withdrawalForm.invalid) {
            this.withdrawalForm.markAllAsTouched();
            return;
        }

        const formValue = this.withdrawalForm.value;

        // Verificar que el monto no exceda el saldo
        if (formValue.amount > (this.currentBalance?.amount ?? 0)) {
            Swal.fire({
                icon: 'error',
                title: 'Monto excedido',
                text: `El monto no puede superar tu saldo de $${this.currentBalance?.amount}`,
                confirmButtonColor: '#176585'
            });
            return;
        }

        // Confirmación
        Swal.fire({
            icon: 'question',
            title: 'Confirmar retiro',
            html: `
                <div style="text-align: left; padding: 10px;">
                    <p><b>Monto:</b> ${this.formatCurrency(formValue.amount)}</p>
                    <p><b>Comisión estimada:</b> ${this.formatCurrency(this.estimateCommission(formValue.amount))}</p>
                    <p><b>Recibirás:</b> ${this.formatCurrency(formValue.amount - this.estimateCommission(formValue.amount))}</p>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Solicitar retiro',
            confirmButtonColor: '#176585'
        }).then((result) => {
            if (result.isConfirmed) {
                this.processWithdrawal(formValue);
            }
        });
    }

    private estimateCommission(amount: number): number {
        // Comisión estimada del 3%
        return amount * 0.03;
    }

    private processWithdrawal(formValue: any): void {
        const payload = {
            user_id: this.userId,
            currency_code: this.selectedCurrency,
            amount: formValue.amount,
            via_id: formValue.via_id,
            payment_data: { details: formValue.payment_data },
            user_notes: formValue.user_notes,
        };

        this.withdrawalService.requestWithdrawal(payload)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (resp) => {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Solicitud enviada!',
                        text: 'Tu solicitud de retiro está pendiente de aprobación',
                        confirmButtonColor: '#176585'
                    });

                    this.closeWithdrawalModal();
                    this.loadSummary();  // Recargar
                },
                error: (err) => {
                    console.error('❌ Error:', err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: err.error?.error || 'No se pudo procesar el retiro',
                        confirmButtonColor: '#176585'
                    });
                }
            });
    }

    // ============================================
    // CANCELAR RETIRO
    // ============================================
    cancelWithdrawal(withdrawal: WithdrawalRequest): void {
        Swal.fire({
            icon: 'question',
            title: 'Cancelar solicitud',
            text: `¿Quieres cancelar la solicitud de retiro #${withdrawal.id}?`,
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonText: 'Sí, cancelar',
            confirmButtonColor: '#e94560'
        }).then((result) => {
            if (result.isConfirmed) {
                this.withdrawalService.cancelWithdrawal(withdrawal.id, this.userId)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            Swal.fire({
                                icon: 'success',
                                title: 'Cancelado',
                                text: 'La solicitud ha sido cancelada',
                                timer: 1500,
                                showConfirmButton: false
                            });
                            this.loadSummary();
                        },
                        error: (err) => {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: err.error?.error || 'No se pudo cancelar',
                                confirmButtonColor: '#176585'
                            });
                        }
                    });
            }
        });
    }

    // ============================================
    // HELPERS
    // ============================================
    formatCurrency(amount: number, currencyCode: string = this.selectedCurrency): string {
        const currency = this.currencies.find(c => c.code === currencyCode);
        const symbol = currency?.symbol || '$';
        const decimals = currency?.decimals || 2;

        return `${symbol}${amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
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

    getViaInfo(viaId: number | null): Via | null {
        if (!viaId) return null;
        return this.vias.find(v => v.id === viaId) || null;
    }

    getTransactionSign(transaction: AccountTransaction): string {
        if (transaction.via_type === 'credit') return '+';
        if (transaction.via_type === 'debit') return '-';
        return '';
    }

    getTransactionClass(transaction: AccountTransaction): string {
        if (transaction.via_type === 'credit') return 'credit';
        if (transaction.via_type === 'debit') return 'debit';
        return 'neutral';
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

    trackByTransactionId(index: number, transaction: AccountTransaction): number {
        return transaction.id;
    }

    // ============================================
    // VALIDACIONES DEL FORMULARIO
    // ============================================
    get amountInvalid(): boolean {
        const control = this.withdrawalForm.get('amount');
        return !!control && control.invalid && control.touched;
    }

    get viaInvalid(): boolean {
        const control = this.withdrawalForm.get('via_id');
        return !!control && control.invalid && control.touched;
    }

    get paymentDataInvalid(): boolean {
        const control = this.withdrawalForm.get('payment_data');
        return !!control && control.invalid && control.touched;
    }
}