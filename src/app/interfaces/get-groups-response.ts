export interface GetGroupsResponse {
    User:  null;
    Group: Group[];
}

export interface Group {
    id:           number;
    name:         string;
    user_id:      number;
    user_admin:   number;
    description?: string;
    active:       boolean;
    privacy:      string;
    start_date:   Date;
    end_date:     Date | null;
    created_at:   Date;
    updated_at:   Date | null;
    pivot:        Pivot;
}

export interface Pivot {
    user_id:  number;
    group_id: number;
}

