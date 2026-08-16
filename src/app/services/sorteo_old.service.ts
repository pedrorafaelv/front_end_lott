import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Sorteo {
  id: number;
  nombre: string;
  imagen: string;
  estado: 'en_vivo' | 'proximo' | 'finalizado';
  jugadores: number | string;
  premio: string;
  valorCarton: string;
  fechaInicio?: string;
}

export interface Estadisticas {
  activos: number;
  jugadores: number;
  premios: string;
}

@Injectable({
  providedIn: 'root'
})
export class SorteoService {
  private sorteosSubject = new BehaviorSubject<Sorteo[]>([]);
  public sorteos$ = this.sorteosSubject.asObservable();

  private estadisticasSubject = new BehaviorSubject<Estadisticas>({
    activos: 12,
    jugadores: 548,
    premios: '$12,580'
  });
  public estadisticas$ = this.estadisticasSubject.asObservable();

  constructor() {
    this.inicializarSorteos();
  }

  private inicializarSorteos(): void {
    const sorteos: Sorteo[] = [
      // Sorteos en vivo
      {
        id: 1,
        nombre: 'Sorteo de Animales',
        imagen: 'https://images.unsplash.com/photo-1635320184824-5416c8f0c5e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'en_vivo',
        jugadores: 35,
        premio: '$1,250',
        valorCarton: '$5.00'
      },
      {
        id: 2,
        nombre: 'Sorteo de Frutas',
        imagen: 'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'en_vivo',
        jugadores: 28,
        premio: '$980',
        valorCarton: '$3.50'
      },
      {
        id: 3,
        nombre: 'Sorteo de Deportes',
        imagen: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'proximo',
        jugadores: 'Próximamente',
        premio: '-',
        valorCarton: '$4.00',
        fechaInicio: 'Próximamente'
      },
      {
        id: 4,
        nombre: 'Sorteo de Películas',
        imagen: 'https://images.unsplash.com/photo-1575311373936-6e9f028c59e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'en_vivo',
        jugadores: 42,
        premio: '$2,150',
        valorCarton: '$7.50'
      },
      {
        id: 5,
        nombre: 'Sorteo de Música',
        imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'en_vivo',
        jugadores: 19,
        premio: '$850',
        valorCarton: '$4.50'
      },
      // Sorteos próximos
      {
        id: 6,
        nombre: 'Sorteo de Música',
        imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'proximo',
        jugadores: 'Próximamente',
        premio: '-',
        valorCarton: '$6.00',
        fechaInicio: '2 días, 4 horas'
      },
      {
        id: 7,
        nombre: 'Sorteo de Viajes',
        imagen: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
        estado: 'proximo',
        jugadores: 'Próximamente',
        premio: '-',
        valorCarton: '$8.50',
        fechaInicio: '3 días, 12 horas'
      }
    ];

    this.sorteosSubject.next(sorteos);
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

  jugarSorteo(id: number): void {
    const sorteos = this.sorteosSubject.getValue();
    const sorteo = sorteos.find(s => s.id === id);
    if (sorteo && sorteo.estado === 'en_vivo') {
      if (typeof sorteo.jugadores === 'number') {
        sorteo.jugadores += 1;
        this.sorteosSubject.next([...sorteos]);
        alert(`¡Te has unido al ${sorteo.nombre}!`);
      }
    } else {
      alert('Este sorteo no está disponible actualmente');
    }
  }

  notificarSorteo(id: number): void {
    const sorteo = this.sorteosSubject.getValue().find(s => s.id === id);
    if (sorteo) {
      alert(`Te notificaremos cuando "${sorteo.nombre}" comience`);
    }
  }
}