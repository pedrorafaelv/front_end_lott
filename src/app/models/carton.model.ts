import { card } from "../interfaces/card-response";

export interface Celda {
  figura: string;
  libre: boolean;
  marcada?: boolean;
}

export interface Carton {
  id: number;
  nombre: string;
  grid: Celda[];
  disponible: boolean;
  seleccionadoPor: string | null;
  jugadorId?: string;
}

export interface Jugador {
  id: string;
  nombre: string;
  cartones: number[];
}

export interface Carton_Sorteo{
  id: number;
  nombre: string;
  grid: Celda[];
  disponible: boolean;
  seleccionadoPor: string | null;
  jugadorId?: string;
  card?: card
}