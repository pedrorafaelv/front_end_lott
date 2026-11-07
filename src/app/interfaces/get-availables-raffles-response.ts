import { RaffleItem } from '../models/raffle.model';

export interface RafflesData {
  /** Sorteos públicos programados en las próximas 24h */
  public_raffles: RaffleItem[];

  /** Sorteos de los grupos a los que pertenece el usuario */
  group_raffles: RaffleItem[];

  /** Sorteos creados por el usuario (cerrados o abiertos según backend) */
  user_raffles: RaffleItem[];

  /** Sorteos futuros dentro de la ventana +24h → +7 días */
  futures_raffles: RaffleItem[];
  
/** Sorteos mas proximos  */
  next_raffles: RaffleItem[];
  
  /**sorteo mas proximo  */
  next_raffle: RaffleItem;
}

export interface RafflesSuccessResponse {
  success: true;
  error: false;
  message: 'Raffles found';
  code: 'OK_001';
  data: RafflesData;
}

export interface RafflesErrorResponse {
  success: false;
  error: true;
  message: 'Raffles not found';
  code: 'ERR-006';
  data?: never;
}

export type getAvailablesRafflesResponse = RafflesSuccessResponse | RafflesErrorResponse;