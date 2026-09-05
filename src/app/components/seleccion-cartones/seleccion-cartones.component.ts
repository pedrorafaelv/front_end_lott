import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoteriaService } from '../../services/loteria.service';
import { CarruselCartonesComponent } from '../carrusel-cartones/carrusel-cartones.component';
import { CartonSeleccionadoComponent } from '../carton-seleccionado/carton-seleccionado.component';
import { Card } from '../../interfaces/get-cards-raffle-response';
import { Carton } from '../../models/carton.model';
import { CardResponse } from '../../interfaces/card-response';
import { RaffleService } from '../../services/raffle.service';
import { CartonesService } from '../../services/cartones.service';

@Component({
  selector: 'app-seleccion-cartones',
  standalone: true,
  imports: [CommonModule, CarruselCartonesComponent, CartonSeleccionadoComponent],
  templateUrl: './seleccion-cartones.component.html',
  styleUrls: ['./seleccion-cartones.component.css']
})
export class SeleccionCartonesComponent implements OnInit {
  cartones: Carton[] = [];
  cards: Card[]=[];
  seleccionados: number[] = [];
  @Input() jugadorId: string = '';
  @Input() raffleId:string = "";
  
  constructor(private loteriaService: LoteriaService, 
    private  RaffleService:RaffleService,
    private Cartonesservice:CartonesService
  ) {}
  
  ngOnInit(): void {
    
    this.Cartonesservice.getAvailableCards(String(this.raffleId)).subscribe(
      (resp: CardResponse) => {
        this.cards = resp.Card;
      },
      (error: any) => {
        console.log(error);
      }
    );

    // this.loteriaService.seleccionados$.subscribe(seleccionados => {
    //   this.seleccionados = seleccionados;
    // });

    // this.jugadorId = this.loteriaService.getJugadorActual().id;
  }

  

  onSeleccionarCarton(id: number): void {
    const exito = this.loteriaService.toggleCarton(id);
    if (!exito) {
      const carton = this.cartones.find(c => c.id === id);
      if (carton && !carton.disponible && !this.seleccionados.includes(id)) {
        alert(`El ${carton.nombre} ya fue seleccionado por otro jugador.`);
      } else if (this.seleccionados.length >= 6) {
        alert('Ya has seleccionado 6 cartones. No puedes agregar más.');
      }
    }
  }

  onEliminarSeleccionado(id: number): void {
    this.loteriaService.eliminarSeleccionado(id);
  }

  getCartonById(id: number): Carton {
    return this.cartones.find(c => c.id === id)!;
  }

  simularOtroJugador(): void {
    const disponibles = this.cartones.filter(c => c.disponible);
    if (disponibles.length > 0) {
      const randomIndex = Math.floor(Math.random() * disponibles.length);
      const carton = disponibles[randomIndex];
      this.loteriaService.simularSeleccionOtroJugador(carton.id);
    }
  }
   async getCardsAvailables(){
    this.Cartonesservice.getAvailableCards(String(this.raffleId))
      .subscribe((resp: any) => {
          this.cartones = resp.Card;
        },
        (error: any) => {
          console.log(error);
        });
  }
}