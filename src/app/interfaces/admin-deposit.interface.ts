// ============================================
// SOLICITUD DE DEPÓSITO
// ============================================
export interface DepositRequest {
    id: number;
    user_id: number;
    currency_id: string;
    currency_code:string| null;
    amount: number;
    via_id: number | null;
    reference: string | null;
    voucher_path: string | null;
    status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
    user_notes: string | null;
    admin_notes: string | null;
    approved_by: number | null;
    approved_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    created_at: string;
    updated_at: string;

    // Relaciones
    user?: UserInfo;
    via?: ViaInfo;
    approved_by_user?: UserInfo;
}

// ============================================
// USUARIO (resultado de búsqueda)
// ============================================
export interface UserInfo {
    id: number;
    name: string;
    email: string;
    local_id?: string;
    balances?: { [currency: string]: UserBalance };
}

export interface UserBalance {
    currency_id: string;
    total_amount: number;
    total_promo: number;
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
export interface DepositStats {
    total_requests: number;
    total_amount: number;
    by_status: {
        pending: number;
        approved: number;
        rejected: number;
        completed: number;
        cancelled: number;
    };
    by_currency: Array<{
        currency_id: string;
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
// FILTROS
// ============================================
export interface AdminDepositFilters {
    status: string | null;
    currency_id: string | null;
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
export interface DepositsListResponse {
    success: boolean;
    data: {
        deposits: DepositRequest[];
        stats: DashboardStats;
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
    };
}

export interface DepositDetailResponse {
    success: boolean;
    data: {
        deposit: DepositRequest;
        user_balance: number;
        user_promo: number;
    };
}

export interface StatsResponse {
    success: boolean;
    data: DepositStats;
    range: { from: string; to: string };
}

export interface UsersSearchResponse {
    success: boolean;
    data: UserInfo[];
}

// ============================================
// ACCIONES
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
    admin_notes?: string;
}

export interface ManualDepositPayload {
    user_id: number;
    admin_id: number;
    currency_id: string;
    amount: number;
    via_id: number;
    reference?: string;
    description?: string;
    admin_notes?: string;
    add_promotion: boolean;
    promotion_amount?: number;
    expires_at?: string;
}
