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