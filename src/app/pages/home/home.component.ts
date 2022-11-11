import { Component, OnInit } from '@angular/core';
import { CartonesService } from '../../services/cartones.service';
import { card, CardResponse } from '../../interfaces/card-response';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public cartones:card[] =[];

  constructor(private CartonesService: CartonesService){  
 }

  ngOnInit():void {
    this.CartonesService.getCartones()
    .subscribe( resp => {
       console.log('resp= ', resp);
      this.cartones = resp.Card;
      
    })
  }
  putCard(card_id ): void{
    console.log('putcard', card_id);
 }

}
