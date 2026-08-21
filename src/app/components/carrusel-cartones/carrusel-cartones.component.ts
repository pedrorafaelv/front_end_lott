import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Carton } from '../../models/carton.model';
import { CardResponse } from '../../interfaces/card-response';
import { Observable, tap } from 'rxjs';
import { CartonesService } from '../../services/cartones.service';
@Component({
  selector: 'app-carrusel-cartones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel-cartones.component.html',
  styleUrls: ['./carrusel-cartones.component.css']
})
export class CarruselCartonesComponent implements OnInit, AfterViewInit {
  @Input() cartones: Carton[] = [];
  @Input() seleccionados: number[] = [];
  @Input() jugadorId: string = '';
  @Output() seleccionar = new EventEmitter<number>();

  @ViewChild('track') track!: ElementRef;

  currentIndex = 0;
  cardsPerView = 4;
  private readonly http: HttpClient;
  baseUrl = '';

  constructor(
    private cartonesService: CartonesService,
    http: HttpClient
  ) {
    this.http = http;
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateCarouselPosition();
    }, 0);
  }

  get filteredCartones(): Carton[] {
    return this.cartones;
  }

  getAvailableCards(raffle: string): Observable<CardResponse> {
  return this.http.get<CardResponse>(`${this.baseUrl}/card/getAvailableCards/${raffle}`)
    .pipe(
      tap((data: CardResponse) => {
        console.log('📦 Datos desde el servicio: getAvailableCards', data);
        console.log('🔍 Data en JSON:', JSON.stringify(data, null, 2));
      })
    );
}
  isSelectedByMe(id: number): boolean {
    return this.seleccionados.includes(id);
  }

  get getCartsOfRaffle(): Carton[] {
    return this.cartones;
  }


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

  seleccionarCarton(id: number): void {
    this.seleccionar.emit(id);
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