import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit {

  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];

  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];
  paises :any = [];
  constructor( private http:HttpClient

  ) { }

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
    }
  }
   

}
