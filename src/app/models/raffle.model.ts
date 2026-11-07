
export class Usermodel{

    name! : string;
    email!: string;
    password! : string;

}


/**
 * Ítem de sorteo tal como lo devuelve `DB::table(...)` en el backend.
 *
 * ⚠️ OJO: al usar el Query Builder (no Eloquent) los `decimal` viajan
 * como STRING ("1500.00"), y `scheduled_date` como DATETIME string
 * ("2026-05-15 20:00:00"), NO como ISO 8601.
 */
export interface RaffleItem {
  id: number;
  group_id: number | null;
  name: string;
  privacy: RafflePrivacy;
  card_amount: string;       // "10.00"
  total_amount: string;      // "1500.00"
  scheduled_date: string | null; // "2026-05-15 20:00:00"
  time_zone: string;  
  groupficha_id: string | null;  
  groupfichas: string;       // nombre de la groupficha
  image:string;
}

/** 0 = público, 1 = privado */
export enum RafflePrivacy {
  Public  = 0,
  Private = 1,
}