import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { MatCardModule } from '@angular/material/card';
import { faAnchor, faCoffee, faGuitar, faAmbulance} from '@fortawesome/free-solid-svg-icons';
import { Card } from 'src/app/interfaces/get-cards-raffle-response';

@Component({
  selector: 'app-carton',
  templateUrl: './carton.component.html',
  styleUrls: ['./carton.component.css']
})
export class CartonComponent implements OnInit {

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  
  carton : Card;
  color: string='black';
 
  // imagenes = ['faguitar', 'faCoffee','imagen3','imagen4','imagen5','imagen6','imagen7','imagen8','imagen9'];
  
  paises :any = [];
  faCoffee = faCoffee;
  faGuitar = faGuitar;
  faAnchor= faAnchor;
  faAlicorn= faAmbulance;
  
  constructor( private http:HttpClient  ) { }
   
  ngOnInit(): void {

    this.http.get('https://restcountries.com/v3.1/lang/spa')
    .subscribe(paises => this.paises= paises)
     console.log('paises = ', this.paises);

  }

  drop(event: CdkDragDrop <string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
         
      );
      console.log('item = ', event.previousIndex);
      console.log('previouscontainer.data = ', event.previousContainer.id);
      console.log('item = ', event.currentIndex);
      console.log('container.data = ', event.container.id);
    }
  }
   

}
