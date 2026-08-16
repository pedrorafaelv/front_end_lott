import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sorteo,Estadisticas  } from '../models/sorteo.model';
import{Carton,Celda, Jugador} from '../models/carton.model';

@Injectable({
    providedIn: 'root'
})
export class SorteoService {
    private sorteosSubject = new BehaviorSubject<Sorteo[]>([]);
    public sorteos$ = this.sorteosSubject.asObservable();

    private sorteoActualSubject = new BehaviorSubject<Sorteo | null>(null);
    public sorteoActual$ = this.sorteoActualSubject.asObservable();
     private estadisticasSubject = new BehaviorSubject<Estadisticas>({
         activos: 12,
         jugadores: 548,
         premios: '$12,580'
       });
       public estadisticas$ = this.estadisticasSubject.asObservable();

    private readonly FIGURAS = [
        '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨',
        '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦',
        '🐤', '🐴', '🦄', '🐝', '🐞', '🦋', '🐙', '🦑', '🐬',
        '🐳', '🐊', '🦕', '🦖', '🐉', '🌺', '🌸', '🌻', '🌹',
        '🍄', '🌿', '🍀', '🌟'
    ];

    public maximoFigurasReveladas = 3; // Límite de figuras reveladas para permitir entrada

    constructor() {
        this.inicializarSorteos();
    }

    private inicializarSorteos(): void {
        const sorteos: Sorteo[] = [
            {
                id: 1,
                nombre: 'Sorteo de Animales',
                descripcion: '¡Gana increíbles premios con los animales más divertidos!',
                imagen: 'https://images.unsplash.com/photo-1635320184824-5416c8f0c5e3?auto=format&fit=crop&w=600&q=80',
                estado: 'activo',
                jugadores: 35,
                premioTotal: 1250,
                valorCarton: 5.00,
                categoria: 'animales',
                figuras: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'],
                cartonesDisponibles: 15,
                figurasReveladas: [],
                cartones: this.generarCartones(15, 1),
                estadoJuego: 'esperando',
                figurasSorteadas: [],
                limiteFiguras: 3
            },
            {
                id: 2,
                nombre: 'Sorteo de Frutas',
                descripcion: 'Dulces premios te esperan en este sorteo de frutas',
                imagen: 'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?auto=format&fit=crop&w=600&q=80',
                estado: 'activo',
                jugadores: 28,
                premioTotal: 980,
                valorCarton: 3.50,
                categoria: 'frutas',
                figuras: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥝', '🍈'],
                cartonesDisponibles: 20,
                figurasReveladas: [],
                cartones: this.generarCartones(20, 2),
                estadoJuego: 'esperando',
                figurasSorteadas: [],
                limiteFiguras: 3
            },
            {
        id: 3,
        nombre: 'Sorteo de Animales',
        imagen: 'https://images.unsplash.com/photo-1635320184824-5416c8f0c5e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'en_vivo',
        jugadores: 35,
        premioTotal: 1250,
        valorCarton: 5
      },
      {
        id: 4,
        nombre: 'Sorteo de Frutas',
        imagen: 'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'en_vivo',
        jugadores: 28,
        premioTotal: 980,
        valorCarton: 3.50
      },
      {
        id: 5,
        nombre: 'Sorteo de Deportes',
        imagen: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'proximo',
        jugadores: 0,
        premioTotal: 0,
        valorCarton: 4.00,
        fechaInicio: 'Próximamente'
      },
      {
        id: 6,
        nombre: 'Sorteo de Películas',
        imagen: 'https://images.unsplash.com/photo-1575311373936-6e9f028c59e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'en_vivo',
        jugadores: 42,
        premioTotal: 2150,
        valorCarton: 7.50
      },
      {
        id: 7,
        nombre: 'Sorteo de Música',
        imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'en_vivo',
        jugadores: 19,
        premioTotal: 850,
        valorCarton: 4.50
      },
      // Sorteos próximos
      {
        id: 8,
        nombre: 'Sorteo de Música',
        imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'proximo',
        jugadores: 0,
        premioTotal: 0,
        valorCarton: 6.00,
        fechaInicio: '2 días, 4 horas'
      },
      {
        id: 9,
        nombre: 'Sorteo de Viajes',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'proximo',
        jugadores: 0,
        premioTotal: 0,
        valorCarton: 8.50,
        fechaInicio: '3 días, 12 horas'
      }
            
            // ... más sorteos
        ];

        this.sorteosSubject.next(sorteos);
    }

    private generarCartones(cantidad: number, sorteoId: number): Carton[] {
        const cartones: Carton[] = [];
        for (let i = 1; i <= cantidad; i++) {
            cartones.push(this.generarCarton(i, sorteoId));
        }
        return cartones;
    }

    private generarCarton(id: number, sorteoId: number): Carton {
        const shuffled = [...this.FIGURAS].sort(() => Math.random() - 0.5);
        const figurasSeleccionadas = shuffled.slice(0, 15);
        const posLibre = Math.floor(Math.random() * 16);
        const grid: Celda[] = [];
        let idx = 0;

        for (let i = 0; i < 16; i++) {
            if (i === posLibre) {
                grid.push({ figura: '⭐', libre: true, marcada: false });
            } else {
                grid.push({ figura: figurasSeleccionadas[idx++], libre: false, marcada: false });
            }
        }

        return {
            id: id,
            nombre: `Cartón #${id}`,
            grid: grid,
            disponible: true,
            seleccionadoPor: null
        };
    }

    // Método para obtener un sorteo por ID
    getSorteoPorId(id: number): Sorteo | undefined {
        return this.sorteosSubject.getValue().find(s => s.id === id);
    }

    // Método para jugar un sorteo (redirige al juego)
    jugarSorteo(id: number): Sorteo | null {
        const sorteo = this.getSorteoPorId(id);
        
        if (!sorteo) {
            return null;
        }

        // Verificar si el sorteo está activo
        if (sorteo.estado !== 'activo') {
            alert('Este sorteo no está activo actualmente');
            return null;
        }

        // Verificar si el sorteo tiene menos de 3 figuras reveladas
        if ((sorteo.figurasReveladas?.length ?? 0) >= 3) {
            alert('Este sorteo ya tiene 3 o más figuras reveladas. No puedes unirte.');
            return null;
        }

        // Verificar si hay cartones disponibles
        const cartonesDisponibles = (sorteo.cartones ?? []).filter(c => c.disponible);
        if (cartonesDisponibles.length === 0) {
            alert('No hay cartones disponibles para este sorteo');
            return null;
        }

        // Asignar un cartón al jugador
        const cartonAsignado = cartonesDisponibles[0];
        cartonAsignado.disponible = false;
        cartonAsignado.seleccionadoPor = 'jugador1';

        // Actualizar el sorteo
        const sorteos = this.sorteosSubject.getValue();
        const index = sorteos.findIndex(s => s.id === id);
        if (index !== -1) {
            sorteos[index].jugadores += 1;
            sorteos[index].cartonesDisponibles = Math.max(0, (sorteos[index].cartonesDisponibles ?? 0) - 1);
            this.sorteosSubject.next([...sorteos]);
        }

        // Establecer el sorteo actual
        this.sorteoActualSubject.next(sorteo);

        return sorteo;
    }

    // Método para revelar una figura (simula el sorteo)
    revelarFigura(sorteoId: number): string | null {
        const sorteos = this.sorteosSubject.getValue();
        const sorteo = sorteos.find(s => s.id === sorteoId);
        
        if (!sorteo) return null;

        // Verificar si ya se revelaron todas las figuras
        if ((sorteo.figurasReveladas?.length ?? 0) >= (sorteo.figuras?.length ?? 0)) {
            return null;
        }

        // Seleccionar una figura aleatoria que no haya sido revelada
        const figurasDisponibles = (sorteo.figuras ?? [])
            .filter(f => !(sorteo.figurasReveladas ?? []).includes(f));

        if (figurasDisponibles.length === 0) {
            return null;
        }

        const figuraSeleccionada = figurasDisponibles[
            Math.floor(Math.random() * figurasDisponibles.length)
        ];

        // Agregar la figura a las reveladas
        const index = sorteos.findIndex(s => s.id === sorteoId);
        if (index !== -1) {
            const sorteoActual = sorteos[index];
            if (!sorteoActual) return null;
            sorteoActual.figurasReveladas = sorteoActual.figurasReveladas ?? [];
            sorteoActual.figurasReveladas.push(figuraSeleccionada);
            sorteoActual.figurasSorteadas = sorteoActual.figurasSorteadas ?? [];
            sorteoActual.figurasSorteadas.push(figuraSeleccionada);
            this.sorteosSubject.next([...sorteos]);
        }

        return figuraSeleccionada;
    }

    // Método para verificar si un sorteo acepta nuevos jugadores
    puedeUnirse(sorteoId: number): boolean {
        const sorteo = this.getSorteoPorId(sorteoId);
        if (!sorteo) return false;
        return (sorteo.figurasReveladas?.length ?? 0) < (sorteo.limiteFiguras ?? this.maximoFigurasReveladas) && 
               sorteo.estado === 'activo' &&
               (sorteo.cartonesDisponibles ?? 0) > 0;
    }

    // Método para obtener los cartones del jugador en un sorteo
    getCartonesJugador(sorteoId: number, jugadorId: string): Carton[] {
        const sorteo = this.getSorteoPorId(sorteoId);
        if (!sorteo) return [];
        return (sorteo.cartones ?? []).filter(c => c.seleccionadoPor === jugadorId);
    }

getSorteosEnVivo(): Observable<Sorteo[]> {
    return new Observable(observer => {
      this.sorteos$.subscribe(sorteos => {
        const filtrados = sorteos.filter(s => s.estado === 'en_vivo');
        observer.next(filtrados);
      });
    });
  }
  getSorteosProximos(): Observable<Sorteo[]> {
      return new Observable(observer => {
        this.sorteos$.subscribe(sorteos => {
          const filtrados = sorteos.filter(s => s.estado === 'proximo');
          observer.next(filtrados);
        });
      });
    }

    notificarSorteo(id: number): void {
    const sorteo = this.sorteosSubject.getValue().find(s => s.id === id);
    if (sorteo) {
      alert(`Te notificaremos cuando "${sorteo.nombre}" comience`);
    }
  }
    getSorteosPorEstado(estado: 'activo' | 'proximo' | 'finalizado'): Observable<Sorteo[]> {
        return new Observable(observer => {
            this.sorteos$.subscribe(sorteos => {
                const filtrados = sorteos.filter(s => s.estado === estado);
                observer.next(filtrados);
            });
        });
    }

}