import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Carton } from '../../models/carton.model';
// import { CardResponse } from '../../interfaces/card-response';
// import { Observable, tap } from 'rxjs';
import { CartonesService } from '../../services/cartones.service';
import { Card } from '../../interfaces/get-cards-raffle-response';
import { CartonComponent } from '../../components/carton/carton.component';
import Swal from 'sweetalert2';
import { RaffleService } from '../../services/raffle.service';
import { GetCardAvailableRaffleResponse } from '../../interfaces/get-card-available-raffle-response';

@Component({
  selector: 'app-carrusel-cartones',
  standalone: true,
  imports: [CommonModule, CartonComponent],
  templateUrl: './carrusel-cartones.component.html',
  styleUrls: ['./carrusel-cartones.component.css']
})
export class CarruselCartonesComponent implements OnInit, AfterViewInit {
  @Input() cartones: Card[] = [];
  @Input() seleccionados: number[] = [];
  @Input() JugadorId: string = '';
  @Input() UserId: number = 0;
  @Input() raffleId: number = 0;
  @Output() seleccionar = new EventEmitter<number>();

  @ViewChild('track') track!: ElementRef;

  currentIndex = 0;
  cardsPerView = 4;
  quantityAvailableCards: number = 0;  
  paginationCards: Promise<GetCardAvailableRaffleResponse> | undefined;
  private readonly http: HttpClient;
  baseUrl = '';

  constructor(
    private CartonesService: CartonesService,
    private RaffleService: RaffleService,
    http: HttpClient
  ) {
    this.http = http;
  }

  ngOnInit(): void {
     console.log('raffleId en carrusel-cartones.component =', this.raffleId);
    //  if (this.UserId==0){
      console.log('UserId en carrusel-cartones.component =', this.UserId);
    //  }
    if (this.raffleId != 0){
      // this.getCardsAvailables();
      this.paginationCards = this.getAvailableCardsByRaffle(this.raffleId);       
      // console.log(this.getCardsAvailables());
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateCarouselPosition();
    }, 0);
  }

  

  get filteredCartones(): Card[] {
    return this.cartones;
  }

   async getCardsAvailables(){
    this.CartonesService.getAvailableCards(String(this.raffleId))
      .subscribe((resp: any) => {
          this.cartones = resp.Card;
        },
        (error: any) => {
          console.log(error);
        });
  }

 /**Obtiene los cartones disponibles para el sorteo seleccionado  vienen de la tabla cardRaffle  con user_id == null*/
  async getAvailableCardsByRaffle(raffle: number): Promise<GetCardAvailableRaffleResponse> {
    const data = await this.RaffleService.getAvailableCardsByRaffle(this.raffleId);
    // console.log('📦 Datos desde el servicio: RaffleServices en carrusel-cartones.component', data.data.Card.data);
    this.cartones = data.data.Card.data;
    this.quantityAvailableCards = this.cartones.length;

    // console.log('🔍 Data en JSON:', JSON.stringify(data, null, 2));
    return data;
  }

 seleccionarCarton(id: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Confirmar',
      text: '¿Quiere agregar este cartón a su apuesta?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#176585'
    }).then((result) => {
      if (result.isConfirmed) {
         try {
          this.RaffleService.putCard(this.raffleId,id,this.UserId)
           console.log('hacer la apuesta ');
         } catch (error) {
          console.log('no se puedo hacer la apuesta')
         }
        this.seleccionar.emit(id);
      }
    });
  }

  isSelectedByMe(id: number): boolean {
    return this.seleccionados.includes(id);
  }

  // get getCartsOfRaffle(): Card[] {
  //   return this.cartones;
  // }


  isTakenByOther(carton: Carton): boolean {
    return !carton.disponible && !this.isSelectedByMe(carton.id);
  }

  getStatusInfo(carton: Carton): { text: string, class: string } {
    if (this.isSelectedByMe(carton.id)) {
      return { text: '✓ Tuyo', class: 'selected-by-you' };
    }
    if (this.isTakenByOther(carton)) {
      return { text: '❌ Ocupado', class: 'taken' };
    }
    return { text: '✅ Disponible', class: 'available' };
  }

  getButtonInfo(carton: Carton): { text: string, disabled: boolean, class: string } {
    if (this.isSelectedByMe(carton.id)) {
      return { text: '✓ Seleccionado', disabled: false, class: 'selected-btn' };
    }
    if (this.isTakenByOther(carton)) {
      return { text: 'No disponible', disabled: true, class: '' };
    }
    return { text: 'Seleccionar', disabled: false, class: '' };
  }

  

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarouselPosition();
    }
  }

  nextSlide(): void {
    const maxIndex = Math.max(0, this.cartones.length - this.cardsPerView);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarouselPosition();
    }
  }

  private updateCarouselPosition(): void {
    if (this.track && this.track.nativeElement) {
      const cardWidth = 200;
      const offset = this.currentIndex * cardWidth;
      this.track.nativeElement.style.transform = `translateX(-${offset}px)`;
    }
  }
  
  
}