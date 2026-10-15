import { Via } from './via.interface';

export interface DepositRequest {
    id: number;
    user_id: number;
    currency_id: string;
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
    via?: Via;
}

export interface DepositPayload {
    user_id: number;
    currency_id: string;
    amount: number;
    via_id: number;
    reference?: string;
    user_notes?: string;
    voucher?: File | null;
}
