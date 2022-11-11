import { Component, Input, OnInit } from '@angular/core';
import { card } from '../../interfaces/card-response';

@Component({
  selector: 'app-cartones-poster-grid',
  templateUrl: './cartones-poster-grid.component.html',
  styleUrls: ['./cartones-poster-grid.component.css']
})
export class CartonesPosterGridComponent implements OnInit {
@Input() cartones:card[]=[];
color: string = 'black';
  constructor() { }

  ngOnInit(): void {
    // console.log(this.cartones);
  }

  putCard(card_id ): void{
    console.log('putcard', card_id);
 }

}
