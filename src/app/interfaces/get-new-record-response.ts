export interface NewRecordResponse {
    success: boolean;
    error: boolean;
    code: string;
    message: string;
    data?: NewRecordData;
}

export interface NewRecordData {
    raffle: RaffleInfo;
    ficha: Ficha;
    winners: Winners;
}

export interface RaffleInfo {
    id: number;
    name: string;
    status: 'active' | 'closed';
    reward_line: number;
    reward_full: number;
    line_winner: any;
    full_winner: any;
    total_fichas: number;
    is_closed: boolean;
}

export interface Ficha {
    id: number;
    image: string;
    name?: string;
    // ... otras propiedades
}

export interface Winners {
    line: any;
    full: any;
}