import { Component, OnInit, Input } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { GetFichasResponse, Ficha, Raffle } from '../../interfaces/get-fichas-response';
import { PipesModule } from "../../pipes/pipes.module";
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-records',
    standalone: true,
    templateUrl: './records.component.html',
    styleUrls: ['./records.component.css'],
    imports: [PipesModule, CommonModule],
})

export class RecordsComponent implements OnInit {

 @Input() Fichas: Ficha[] = [];
 @Input() Raffle!: Raffle;
 @Input() fichaGroup: string | undefined;

  public color: string = 'black';
  //public Raffle: Raffle;
  constructor(private RaffleService: RaffleService) { }

  ngOnInit(): void {
    
  }

  getFichas(texto:string){
    this.RaffleService.getFichas(texto)
    .subscribe( resp => {
      console.log('fichas en recordComponent = ', resp.Fichas);
      this.Raffle = resp.Raffle;
    })
  }
}
