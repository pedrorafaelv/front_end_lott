import { Component } from '@angular/core';
import { CartonesService } from './services/cartones.service';
import { CardResponse } from './interfaces/card-response';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lottery-app';

  constructor(private CartonesService: CartonesService){

    // this.CartonesService.getCartones()
    // .subscribe( resp => {
     // console.log(resp);
      
  // })
 }
}
