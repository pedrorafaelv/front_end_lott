export interface ViasResponse {
    data: Via[];
    meta: {
        total: number;
        credits: number;
        debits: number;
        neutral: number;
    };
}


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