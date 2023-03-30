import { Component } from '@angular/core';
import { CartonesService } from './services/cartones.service';
import { CardResponse } from './interfaces/card-response';
import { Auth0Service } from './services/auth0.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'lottery-app';

  constructor(private CartonesService: CartonesService, private auth0: Auth0Service ){

    // this.CartonesService.getCartones()
    // .subscribe( resp => {
     // console.log(resp);
      
  // })
 }
}
