import { Component, OnInit, Input } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { GetFichasResponse, Ficha, Raffle } from '../../interfaces/get-fichas-response';

@Component({
  selector: 'app-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.css']
})

export class RecordsComponent implements OnInit {

 @Input() Fichas: Ficha[] = [];
  public color: string = 'black';
  public Raffle: Raffle;
  constructor(private RaffleService: RaffleService) { }

  ngOnInit(): void {
  //  this.getFichas('2');
    
  }

  getFichas(texto:string){
    this.RaffleService.getFichas(texto)
    .subscribe( resp => {
      console.log('fichas en recordComponent = ', resp.Fichas);
      // this.Fichas = resp.Fichas;
      this.Raffle = resp.Raffle;
    })
  }
}
