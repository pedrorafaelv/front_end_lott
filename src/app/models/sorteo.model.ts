import { Carton,Jugador } from "./carton.model";

export interface Sorteo {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen: string;
  estado: 'en_vivo'|'activo' | 'proximo' | 'finalizado';
  jugadores: number;
  fechaInicio?: string;
  premioTotal: number;
  valorCarton: number;
  categoria?: string;
  figuras?: string[];
  cartonesDisponibles?: number| undefined;
  // Nuevas propiedades para el juego
  figurasReveladas?: string[]| undefined;
  cartones?: Carton[]; // Cartones disponibles para este sorteo
  estadoJuego?: 'esperando' | 'en_curso' | 'finalizado';
  figurasSorteadas?: string[];
  limiteFiguras?: number; // Límite de figuras reveladas para permitir entrada
}
 export interface Estadisticas {
  activos: number;
  jugadores: number;
  premios: string;
}
