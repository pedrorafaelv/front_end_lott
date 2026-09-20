// ============================================
// MONEDAS
// ============================================
export interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
    decimals: number;
    flag: string | null;
    is_crypto: boolean;
    is_active: boolean;
    display_order: number;
}

// ============================================
// VÍAS (métodos de transacción)
// ============================================
export interface Via {
    id: number;
    code: string;
    label: string;
    icon: string | null;
    color: string | null;
    type: 'credit' | 'debit' | 'neutral';
    is_active: boolean;
    display_order: number;
}

// ============================================
// TRANSACCIONES
// ============================================
export interface AccountTransaction {
    id: number;
    user_id: number;
    currency_code: string;
    amount: number;
    balance_after: number | null;
    promo_after: number | null;
    credit: number | null;
    credit_promotion: number | null;
    deposit: number | null;
    withdrawal: number | null;
    via_id: number | null;
    raffle_id: number | null;
    description: string | null;
    comments: string | null;
    reference_type: string | null;
    reference_id: number | null;
    expires_at: string | null;
    created_at: string;
    updated_at: string;

    // Extras del JOIN
    via_code?: string;
    via_label?: string;
    via_icon?: string;
    via_color?: string;
    via_type?: 'credit' | 'debit' | 'neutral';
    raffle_name?: string;
}

// ============================================
// BALANCES
// ============================================
export interface Balance {
    currency_code: string;
    amount: number;
    credit_promotion: number;
    total: number;
}

// ============================================
// TOTALES AGREGADOS
// ============================================
export interface Totals {
    deposits: number;
    withdrawals: number;
    bets: number;
    awards: number;
    promotions: number;
}

// ============================================
// SOLICITUD DE RETIRO
// ============================================
export interface WithdrawalRequest {
    id: number;
    user_id: number;
    currency_code: string;
    amount: number;
    commission: number;
    net_amount: number;
    via_id: number | null;
    payment_data: any;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    admin_notes: string | null;
    user_notes: string | null;
    approved_by: number | null;
    approved_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;

    // Extras
    via?: Via;
}

// ============================================
// RESUMEN COMPLETO
// ============================================
export interface AccountSummary {
    balances: { [currency: string]: Balance };
    totals: Totals;
    recent_transactions: AccountTransaction[];
    withdrawal_requests: WithdrawalRequest[];
    currencies: Currency[];
    vias: Via[];
}

// ============================================
// RESPUESTAS DEL API
// ============================================
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface SummaryResponse {
    success: boolean;
    data: AccountSummary;
}

export interface TransactionsResponse {
    success: boolean;
    data: {
        transactions: AccountTransaction[];
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
    };
}

// ============================================
// FILTROS DE TRANSACCIONES
// ============================================
export interface TransactionFilters {
    currency_code: string;
    via_id: number | null;
    type: 'credit' | 'debit' | 'neutral' | null;
    date_from: string | null;
    date_to: string | null;
    amount_min: number | null;
    amount_max: number | null;
    page: number;
    per_page: number;
}

// ============================================
// FORMULARIO DE RETIRO
// ============================================
export interface WithdrawalForm {
    user_id: number;
    currency_code: string;
    amount: number;
    via_id: number;
    payment_data: any;
    user_notes: string | null;
}