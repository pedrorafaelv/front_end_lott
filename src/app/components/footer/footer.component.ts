import { Component } from '@angular/core';
import { faCoffee, faSquareEnvelope } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
    faCoffee = faCoffee;
    faSquareEnvelope = faSquareEnvelope;

  currentYear: number = new Date().getFullYear();
}
