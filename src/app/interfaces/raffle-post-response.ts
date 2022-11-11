export interface RafflePostResponse {
        name:                    string;
        description:             string;
        user_id:                 string;
        group_id:                string;
        total_amount:            number;
        card_amount:             string;
        minimun_play:            string;
        maximun_play:            string;
        maximun_user_play:       string;
        retention_percent:       string;
        retention_amount:        string;
        admin_retention_percent: string;
        admin_retention_amount:  string;
        raffle_type:             string;
        privacy:                 string;
        reward_line:             string;
        percent_line:            string;
        reward_full:             string;
        percent_full:            string;
        admin_user:              string;
        scheduled_date:          null;
        start_date:              Date;
        end_date:                null;
        updated_at:              Date;
        created_at:              Date;
        id:                      number;
}
