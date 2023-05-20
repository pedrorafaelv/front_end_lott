import { Component, OnInit } from '@angular/core';
import { CartonesService } from '../../services/cartones.service';
import { card, CardResponse } from '../../interfaces/card-response';
import { Raffle } from '../../interfaces/get-fichas-response';
import { RaffleService } from '../../services/raffle.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public cartones:card[] =[];
  public Raffle: Raffle; 
  constructor(private CartonesService: CartonesService, 
              private RaffleService: RaffleService){  
 }

  ngOnInit():void {
    this.CartonesService.getCartones()
    .subscribe( resp => {
       console.log('resp= ', resp);
      this.cartones = resp.Card;
      
    })
  }
  putCard(card_id ): void{
    console.log('putcard home_component', card_id);
 }

}
