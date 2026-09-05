import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { GetFichasResponse, Ficha, Raffle } from '../../interfaces/get-fichas-response';
import { PipesModule } from "../../pipes/pipes.module";
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-records',
    standalone: true,
    templateUrl: './records.component.html',
    styleUrls: ['./records.component.css'],
    imports: [PipesModule, CommonModule],
})

export class RecordsComponent implements OnInit {

 @Input() Fichas: Ficha[] = [];
 @Input() Raffle!: Raffle;
 @Input() fichaGroup: string= "";
 @ViewChild('track') track!: ElementRef;

  public color: string = 'black';
  currentIndex = 0;
  cardsPerView = 4;

  constructor(private RaffleService: RaffleService) { }

  ngOnInit(): void {
    
  }

  getFichas(texto:string){
    this.RaffleService.getFichas(texto)
    .subscribe( resp => {
      console.log('fichas en recordComponent = ', resp.Fichas);
      this.Raffle = resp.Raffle;
    })
  }

   prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarouselPosition();
    }
  }

   nextSlide(): void {
    const maxIndex = Math.max(0, this.Fichas.length - this.cardsPerView);
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

