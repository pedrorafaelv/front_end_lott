export interface Raffle {
  id: number;
  name: string;
  description: string;
  user_id: number;
  group_id: number | null;
  groupficha_id: number | null;
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
  reward_line: number | null;
  percent_line: number | null;
  reward_full: number | null;
  allow_promotional_bet: number;
  percent_full: number | null;
  admin_user: number | null;
  scheduled_date: string | null;
  scheduled_hour: string | null;
  start_hour: string | null;
  end_hour: string | null;
  time_zone: string | null;
  winner: number | null;
  full_winner: number | null;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

// ✅ raffle puede ser null (no array vacío)
export interface GetLastRaffleData {
  raffle: Raffle | null;
}

export interface GetLastRaffleResponse {
  message: string;
  success: boolean;
  error: boolean;
  code: string;
  date: string;
  data: GetLastRaffleData;
}