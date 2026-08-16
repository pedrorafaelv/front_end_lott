import { Component, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { Raffle } from '../../interfaces/get-fichas-response';
import { CommonModule } from '@angular/common';
import { SorteoService } from '../../services/sorteo.service';
import { Sorteo,Estadisticas } from 'src/app/models/sorteo.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})

export class DashboardComponent implements OnInit {
public raffles: any;
sorteosEnVivo: Sorteo[] = [];
  sorteosProximos: Sorteo[] = [];  sorteosActivos: Sorteo[] = [];  estadisticas: Estadisticas = {
    activos: 0,
    jugadores: 0,
    premios: '$0'
  };
  constructor(private RaffleService: RaffleService, private sorteoService: SorteoService, private router: Router) { }

  ngOnInit(): void {
  this.raffles= this.RaffleService.getDetailActiveRafflesByUser(1)
    .then((datos)=>{
     // console.log('datos = ',datos);
      this.raffles= datos;
       //console.log('this.raffles=', this.raffles );
    })
    .catch((error)=>{console.log(error)});

     // Suscribirse a los sorteos en vivo
    this.sorteoService.getSorteosEnVivo().subscribe({
      next: (sorteos) => {
        this.sorteosEnVivo = sorteos;
      },
      error: (error) => {
        console.error('Error al cargar sorteos en vivo:', error);
      }
    });

    // Suscribirse a los sorteos próximos
    this.sorteoService.getSorteosProximos().subscribe({
      next: (sorteos) => {
        this.sorteosProximos = sorteos;
      },
      error: (error) => {
        console.error('Error al cargar sorteos próximos:', error);
      }
    });

    // Suscribirse a las estadísticas
    this.sorteoService.estadisticas$.subscribe({
      next: (estadisticas) => {
        this.estadisticas = estadisticas;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });

    this.sorteoService.getSorteosPorEstado('activo').subscribe(sorteos => {
            this.sorteosActivos = sorteos;
        });

        this.sorteoService.getSorteosPorEstado('proximo').subscribe(sorteos => {
            this.sorteosProximos = sorteos;
        });

        this.sorteoService.estadisticas$.subscribe(estadisticas => {
            this.estadisticas = estadisticas;
        });
  }

  // Método para jugar un sorteo
  jugarSorteo(id: number): void {
    // this.sorteoService.jugarSorteo(id);
    console.log(`Intentando jugar el sorteo con ID: ${id}`);
    this.router.navigate(['/juego', id]);
  }

  // Método para notificar un sorteo
  notificarSorteo(id: number): void {
    this.sorteoService.notificarSorteo(id);
  }



  }


  




