import { Component, Input, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { Card } from 'src/app/interfaces/get-cards-raffle-response';

@Component({
  selector: 'app-card-raffle',
  templateUrl: './card-raffle.component.html',
  styleUrls: ['./card-raffle.component.css']
})
export class CardRaffleComponent implements OnInit {

@Input() cartones: Card[]=[];
color : string = 'black';
Fichas: string[] = [];
@Input() raffleId;
@Input() userId;

  constructor(private RaffleService: RaffleService) {
  
   }
  ngOnInit(): void {
    if (this.raffleId && this.userId){
      this.RaffleService.getCardsRaffleByUser(this.raffleId,this.userId)
      .subscribe( resp => {
        console.log('cartones en card-raffle = ', resp.Cards);
        this.cartones = resp.Cards;
        })
      }
   }

}
