export interface GetFichasResponse {
    Raffle:    Raffle;
    ArrFichas: string[];
    Fichas:    Ficha[];
}

export interface Ficha {
    id:          number;
    name:        string;
    description: string;
    image:       string;
    sound:       string;
    active:      string;
    start_date:  Date;
    end_date:    null;
    created_at:  Date;
    updated_at:  Date;
    pivot:       Pivot;
}

export interface Pivot {
    raffle_id: number;
    ficha_id:  number;
}

export interface Raffle {
    id:                      number;
    name:                    string;
    description:             string;
    user_id:                 number;
    group_id:                number;
    total_amount:            null;
    card_amount:             null;
    minimun_play:            null;
    maximun_play:            null;
    maximun_user_play:       null;
    retention_percent:       null;
    retention_amount:        null;
    admin_retention_percent: null;
    admin_retention_amount:  null;
    raffle_type:             null;
    privacy:                 null;
    reward_line:             null;
    percent_line:            number;
    reward_full:             null;
    percent_full:            number;
    admin_user:              null;
    scheduled_date:          Date;
    scheduled_hour:          null;
    start_hour:              null;
    end_hour:                null;
    time_zone:               null;
    start_date:              Date;
    end_date:                Date;
    created_at:              Date;
    updated_at:              Date;
}
