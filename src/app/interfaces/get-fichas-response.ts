// ============================================
// FICHA
// ============================================
export interface Ficha {
    id: number;
    name: string;
    image: string;
    groupficha_id?: number;
    active?: number;
    created_at?: string;
    updated_at?: string;
    // Pivot (relación many-to-many con Raffle)
    pivot?: {
        raffle_id: number;
        ficha_id: number;
        indice?: number;
        created_at?: string;
        updated_at?: string;
    };
}

// ============================================
// SORTEO (Raffle)
// ============================================
export interface Raffle {
    id: number;
    name: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    reward_line?: number;
    reward_full?: number;
    total_amount?: number;
    card_amount?: number;
    groupficha_id?: number;
    winner?: string | null;
    full_winner?: string | null;
    allow_promotional_bet?: boolean;
    created_at?: string;
    updated_at?: string;
    // Relaciones
    fichas_count?: number;
    fichas?: Ficha[];
}

// ============================================
// DATA DEL ENDPOINT
// ============================================
export interface GetFichasData {
    Raffle: Raffle;
    ArrFichas: string[];     // Array de nombres ("nombre@")
    Fichas: Ficha[];          // Array completo de objetos Ficha
}

// ============================================
// RESPUESTA COMPLETA
// ============================================
export interface GetFichasResponse {
    success: boolean;
    error: boolean;
    code: string;
    message: string;
    data?: GetFichasData;
    errors?: { [key: string]: string[] };
}