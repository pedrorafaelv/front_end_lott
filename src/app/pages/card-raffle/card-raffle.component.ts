import { Component, Input, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { Card } from 'src/app/interfaces/get-cards-raffle-response';

@Component({
    selector: 'app-card-raffle',
    templateUrl: './card-raffle.component.html',
    styleUrls: ['./card-raffle.component.css'],
    standalone: false
})
export class CardRaffleComponent implements OnInit {

@Input() cartones: Card[]=[];
color : string = 'black';
Fichas: string[] = [];
@Input() raffleId!: string | number;
@Input() userId!: string | number;

  constructor(private RaffleService: RaffleService) {
  
   }
  ngOnInit(): void {
    if (this.raffleId && this.userId){
      this.RaffleService.getCardsRaffleByUser(String(this.raffleId), String(this.userId))
      .subscribe( resp => {
        console.log('cartones en card-raffle = ', resp.Cards);
        this.cartones = resp.Cards;
        })
      }
   }

}
