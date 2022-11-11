import { Component, Input, OnInit } from '@angular/core';
import { Card } from 'src/app/interfaces/get-cards-raffle-response';

@Component({
  selector: 'app-cartones',
  templateUrl: './cartones.component.html',
  styleUrls: ['./cartones.component.css']
})
export class CartonesComponent implements OnInit {
 @Input() carton: Card;
  // carton : Card;
color: string='black';
  constructor() { }

  ngOnInit(): void {
  }

}
