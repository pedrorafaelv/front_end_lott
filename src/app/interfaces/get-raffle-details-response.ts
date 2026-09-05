export interface GetRaffleDetailsResponse {
    Cards:   RaffleDetails[];
    // Fichas: Ficha[];
}

export interface RaffleDetails {
    succes: boolean;
    error: boolean;
    code: string;
    message: string;
    data: {
        raffle: {
            id: number;
            name: string;
            description: string;
            user_id: number;
            group_id: number | null;
            groupficha_id: number;
            total_amount: number | null;
            card_amount: number | null;
            currency: string | null;
            minimun_play: number | null;
            maximun_play: number | null;
            maximun_user_play: number | null;
            retention_percent: number | null;
            retention_amount: number | null;
            admin_retention_percent: number | null;
            admin_retention_amount: number | null;
            raffle_type: string | null;
            privacy: string | null;
            reward_line: number;
            percent_line: number;
            reward_full: number;
            percent_full: number;
            admin_user: string | null;
            scheduled_date: string | null;
            scheduled_hour: string | null;
            start_hour: string | null;
            end_hour: string | null;
            time_zone: string | null;
            winner: string | null;
            full_winner: string | null;
            start_date: string;
            end_date: string;
            created_at: string;
            updated_at: string;
        };
        groupficha: {
            id: number;
            name: string;
            description: string;
            created_at: string | null;
            updated_at: string | null;
        };
    };
    date: string;
}