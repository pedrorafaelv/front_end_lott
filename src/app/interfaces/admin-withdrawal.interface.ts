// ============================================
// SOLICITUD DE RETIRO (Admin)
// ============================================
export interface WithdrawalRequest {
    id: number;
    user_id: number;
    currency_code: string;
    amount: number;
    commission: number;
    net_amount: number;
    via_id: number | null;
    payment_data: {
        details?: string;
        transaction_reference?: string;
        completed_at?: string;
    } | null;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    admin_notes: string | null;
    user_notes: string | null;
    approved_by: number | null;
    approved_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;

    // Relaciones
    user?: AdminUserInfo;
    via?: ViaInfo;
    approved_by_user?: AdminUserInfo;
}

// ============================================
// INFO DEL USUARIO (para admin)
// ============================================
export interface AdminUserInfo {
    id: number;
    name: string;
    email: string;
    local_id?: string;
}

// ============================================
// VÍA
// ============================================
export interface ViaInfo {
    id: number;
    code: string;
    label: string;
    icon: string | null;
    color: string | null;
    type: 'credit' | 'debit' | 'neutral';
}

// ============================================
// ESTADÍSTICAS
// ============================================
export interface WithdrawalStats {
    total_requests: number;
    total_amount: number;
    total_commission: number;
    total_net: number;
    by_status: {
        pending: number;
        approved: number;
        rejected: number;
        completed: number;
        cancelled: number;
    };
    by_currency: Array<{
        currency_code: string;
        count: number;
        total: number;
    }>;
    daily: Array<{
        date: string;
        count: number;
        total: number;
    }>;
}

export interface DashboardStats {
    pending_count: number;
    pending_amount: number;
    approved_today: number;
    completed_today: number;
    rejected_today: number;
}

// ============================================
// LOGS
// ============================================
export interface WithdrawalLog {
    id: number;
    withdrawal_request_id: number;
    admin_id: number | null;
    action: string;
    notes: string | null;
    data: any;
    created_at: string;
    admin?: AdminUserInfo;
}

// ============================================
// FILTROS
// ============================================
export interface AdminWithdrawalFilters {
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | null;
    currency_code: string | null;
    user_id: number | null;
    date_from: string | null;
    date_to: string | null;
    search: string | null;
    page: number;
    per_page: number;
}

// ============================================
// RESPUESTAS DEL API
// ============================================
export interface WithdrawalsListResponse {
    success: boolean;
    data: {
        withdrawals: WithdrawalRequest[];
        stats: DashboardStats;
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
    };
}

export interface WithdrawalDetailResponse {
    success: boolean;
    data: {
        withdrawal: WithdrawalRequest;
        user_balance: number;
    };
}

export interface StatsResponse {
    success: boolean;
    data: WithdrawalStats;
    range: {
        from: string;
        to: string;
    };
}

export interface LogsResponse {
    success: boolean;
    data: WithdrawalLog[];
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    error?: string;
    data?: T;
}

// ============================================
// ACCIONES ADMIN
// ============================================
export interface ApproveAction {
    admin_id: number;
    admin_notes?: string;
}

export interface RejectAction {
    admin_id: number;
    admin_notes: string;
}

export interface CompleteAction {
    admin_id: number;
    transaction_reference: string;
    admin_notes?: string;
}