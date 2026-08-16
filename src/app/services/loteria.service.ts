import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Carton, Celda, Jugador } from '../models/carton.model';

@Injectable({
  providedIn: 'root'
})
export class LoteriaService {
  // Figuras disponibles
  private readonly FIGURAS = [
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨',
    '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦',
    '🐤', '🐴', '🦄', '🐝', '🐞', '🦋', '🐙', '🦑', '🐬',
    '🐳', '🐊', '🦕', '🦖', '🐉', '🌺', '🌸', '🌻', '🌹',
    '🍄', '🌿', '🍀', '🌟'
  ];

  // Estado del jugador actual (simulado)
  private jugadorActual: Jugador = {
    id: 'jugador1',
    nombre: 'Jugador 1',
    cartones: []
  };

  // Lista de cartones
  private cartonesSubject = new BehaviorSubject<Carton[]>([]);
  public cartones$ = this.cartonesSubject.asObservable();

  // Cartones seleccionados por el jugador actual
  private seleccionadosSubject = new BehaviorSubject<number[]>([]);
  public seleccionados$ = this.seleccionadosSubject.asObservable();

  constructor() {
    this.inicializarCartones();
  }

  private inicializarCartones(): void {
    const cartones: Carton[] = [];
    for (let i = 1; i <= 15; i++) {
      cartones.push(this.generarCarton(i));
    }
    this.cartonesSubject.next(cartones);
  }

  private generarCarton(id: number): Carton {
    // Mezclar figuras y seleccionar 15
    const shuffled = [...this.FIGURAS].sort(() => Math.random() - 0.5);
    const figurasSeleccionadas = shuffled.slice(0, 15);
    
    // Posición del comodín
    const posLibre = Math.floor(Math.random() * 16);
    const grid: Celda[] = [];
    let idx = 0;

    for (let i = 0; i < 16; i++) {
      if (i === posLibre) {
        grid.push({ figura: '⭐', libre: true });
      } else {
        grid.push({ figura: figurasSeleccionadas[idx++], libre: false });
      }
    }

    return {
      id,
      nombre: `Cartón #${id}`,
      grid,
      disponible: true,
      seleccionadoPor: null
    };
  }

  getJugadorActual(): Jugador {
    return this.jugadorActual;
  }

  getCartonesSeleccionados(): number[] {
    return this.seleccionadosSubject.getValue();
  }

  toggleCarton(id: number): boolean {
    const cartones = this.cartonesSubject.getValue();
    const carton = cartones.find(c => c.id === id);
    
    if (!carton) return false;

    const seleccionados = this.seleccionadosSubject.getValue();
    const estaSeleccionadoPorMi = seleccionados.includes(id);

    // Si ya lo tengo seleccionado, lo deselecciono
    if (estaSeleccionadoPorMi) {
      carton.disponible = true;
      carton.seleccionadoPor = null;
      const index = seleccionados.indexOf(id);
      seleccionados.splice(index, 1);
      this.seleccionadosSubject.next([...seleccionados]);
      this.cartonesSubject.next([...cartones]);
      return true;
    }

    // Si no está disponible (seleccionado por otro)
    if (!carton.disponible) {
      return false;
    }

    // Límite de 6 cartones
    if (seleccionados.length >= 6) {
      return false;
    }

    // Seleccionar cartón
    carton.disponible = false;
    carton.seleccionadoPor = this.jugadorActual.id;
    seleccionados.push(id);
    this.seleccionadosSubject.next([...seleccionados]);
    this.cartonesSubject.next([...cartones]);
    return true;
  }

  eliminarSeleccionado(id: number): void {
    const cartones = this.cartonesSubject.getValue();
    const carton = cartones.find(c => c.id === id);
    const seleccionados = this.seleccionadosSubject.getValue();

    if (carton && seleccionados.includes(id)) {
      carton.disponible = true;
      carton.seleccionadoPor = null;
      const index = seleccionados.indexOf(id);
      seleccionados.splice(index, 1);
      this.seleccionadosSubject.next([...seleccionados]);
      this.cartonesSubject.next([...cartones]);
    }
  }

  // Simular selección de otro jugador (para demo)
  simularSeleccionOtroJugador(id: number): void {
    const cartones = this.cartonesSubject.getValue();
    const carton = cartones.find(c => c.id === id);
    
    if (carton && carton.disponible) {
      carton.disponible = false;
      carton.seleccionadoPor = 'otroJugador';
      this.cartonesSubject.next([...cartones]);
    }
  }
}