import { Component } from '@angular/core';
import { CartonesService } from './services/cartones.service';
import { CardResponse } from './interfaces/card-response';
import { Auth0Service } from './services/auth0.service';
import { NavbarComponent } from './components/navbar/navbar.component';   // 👈 import
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    standalone: true,
    imports: [RouterOutlet, 
              NavbarComponent, 
              FooterComponent] 
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
