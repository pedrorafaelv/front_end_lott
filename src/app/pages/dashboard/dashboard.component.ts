import { Component, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { Raffle } from '../../interfaces/get-fichas-response';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
public raffles: any;

  constructor(private RaffleService: RaffleService) { }

  ngOnInit(): void {
  this.raffles= this.RaffleService.getDetailActiveRafflesByUser(1)
    .then((datos)=>{
     // console.log('datos = ',datos);
      this.raffles= datos;
       //console.log('this.raffles=', this.raffles );
    })
    .catch((error)=>{console.log(error)});
  }

}
