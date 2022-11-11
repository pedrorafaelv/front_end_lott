export interface GetCardsRaffleResponse {
    Cards:   Card[];
    Fichas: Ficha[];
}

export interface Card {
    id:             number;
    name:           null;
    pos01:          number;
    pos02:          number;
    pos03:          number;
    pos04:          number;
    pos05:          number;
    pos06:          number;
    pos07:          number;
    pos08:          number;
    pos09:          number;
    pos10:          number;
    pos11:          number;
    pos12:          number;
    pos13:          number;
    pos14:          number;
    pos15:          number;
    pos16:          number;
    pos17:          number;
    pos18:          number;
    pos19:          number;
    pos20:          number;
    pos21:          number;
    pos22:          number;
    pos23:          number;
    pos24:          number;
    pos25:          number;
    comb01:         string;
    comb02:         string;
    comb03:         string;
    comb04:         string;
    comb05:         string;
    comb06:         string;
    comb07:         string;
    comb08:         string;
    comb09:         string;
    comb10:         string;
    comb11:         string;
    comb12:         string;
    comb13:         string;
    comb14:         string;
    combTotal:      string;
    desc_pos01:     string;
    desc_pos02:     string;
    desc_pos03:     string;
    desc_pos04:     string;
    desc_pos05:     string;
    desc_pos06:     string;
    desc_pos07:     string;
    desc_pos08:     string;
    desc_pos09:     string;
    desc_pos10:     string;
    desc_pos11:     string;
    desc_pos12:     string;
    desc_pos13:     string;
    desc_pos14:     string;
    desc_pos15:     string;
    desc_pos16:     string;
    desc_pos17:     string;
    desc_pos18:     string;
    desc_pos19:     string;
    desc_pos20:     string;
    desc_pos21:     string;
    desc_pos22:     string;
    desc_pos23:     string;
    desc_pos24:     string;
    desc_pos25:     string;
    desc_comb01:    string;
    desc_comb02:    string;
    desc_comb03:    string;
    desc_comb04:    string;
    desc_comb05:    string;
    desc_comb06:    string;
    desc_comb07:    string;
    desc_comb08:    string;
    desc_comb09:    string;
    desc_comb10:    string;
    desc_comb11:    string;
    desc_comb12:    string;
    desc_comb13:    string;
    desc_comb14:    string;
    desc_combTotal: string;
    active:         string;
    groupFicha_id:  null;
    start_date:     Date;
    end_date:       null;
    created_at:     Date;
    updated_at:     Date;
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
