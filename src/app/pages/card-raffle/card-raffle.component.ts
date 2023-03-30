import { Component, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { card } from '../../interfaces/card-response';
import {GetFichasResponse} from '../../interfaces/get-fichas-response'
import { Card } from 'src/app/interfaces/get-cards-raffle-response';

@Component({
  selector: 'app-card-raffle',
  templateUrl: './card-raffle.component.html',
  styleUrls: ['./card-raffle.component.css']
})
export class CardRaffleComponent implements OnInit {

cartones: Card[]=[];
color : string = 'black';
Fichas: string[] = [];

  constructor(private RaffleService: RaffleService) { }

  ngOnInit(): void {
    this.RaffleService.getCardsRaffleByUser('10/1')
    .subscribe( resp => {
      console.log('cartones en card-raffle = ', resp.Cards);
      this.cartones = resp.Cards;
    this.RaffleService.getFichas('10')
    .subscribe($resp=>{
      console.log('fichas en card-raffle = ', resp.Fichas);

      this.Fichas= $resp.Fichas
    })
  })
  }

}
