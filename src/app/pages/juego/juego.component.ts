import { Component, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { Ficha, Raffle } from '../../interfaces/get-fichas-response';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
 Fichas: Ficha[]=[];
 Raffle:Raffle;
  constructor(private RaffleService: RaffleService) { }
  
  ngOnInit(): void {
    this.RaffleService.getFichas('2')
    .subscribe( resp => {
      console.log('fichas en juego component = ', resp.Fichas);
      this.Fichas = resp.Fichas;
      this.Raffle = resp.Raffle;
    }) 
  }
   
}
