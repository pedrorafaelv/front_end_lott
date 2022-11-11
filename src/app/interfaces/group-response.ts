export interface GroupResponse {
    group: Group;
}

export interface Group {
    id:          number;
    name:        string;
    description: string;
    active:      string;
    start_date:  Date;
    end_date:    null;
    created_at:  Date;
    updated_at:  Date;
}
