export interface NewRecordResponse {
    success: boolean;
    error: boolean;
    code: string;
    message: string;
    data?: NewRecordData;
}

export interface NewRecordData {
    raffle: RaffleInfo;
    ficha: NewFicha;
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

export interface NewFicha {
    id: number;
    image: string;
    name?: string;
    active:string;
    created_at:Date; 
    description:string; 
    end_date?:Date; 
    sound?: string;
    start_date:Date;
    updated_at:Date;
}

export interface Winners {
    line: any;
    full: any;
}