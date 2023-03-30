import { Component, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { Ficha, Raffle } from '../../interfaces/get-fichas-response';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Group } from '../../interfaces/get-groups-response';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { GroupService } from 'src/app/services/group.service';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
 fichas: Ficha[]=[];
 raffle:Raffle;
 grupos: Group[]= [];
 forma: FormGroup;
 localId: string;
 userId: string;
 raffleId: any;
 cartones: any;
 activeRaffles: any ;

  constructor(private RaffleService: RaffleService,
              private AuthService: AuthService,
              private UserService: UserService,
              private GroupService: GroupService,
              private fb : FormBuilder) { 
              this.forma = this.fb.group({
                  grupo: ['', [Validators.required]],
                 }  );
  }
 
  ngOnInit(): void {
    this.localId = this.AuthService.getLocalId();
    if (this.localId){
      this.getInfo();
     } 

    // setTimeout(()=>{
    //   this.RaffleService.getFichas('2')
    //   .subscribe( resp => {
    //     console.log('fichas en juego component = ', resp.Fichas);
    //     this.fichas = resp.Fichas;
    //     this.raffle = resp.Raffle;
    //     console.log('raffle', resp.Raffle);
    //   }) 
    // }, 2000)
  }
  get grupoNoValido(){
    return this.forma.get('grupo')?.invalid && this.forma.get('grupo')?.touched;
  }

  async getInfo(){
    const user =  await this.UserService.getUserByLocalId(this.localId);
    this.userId = user.user[0]['id'];
    console.log('this.userId', this.userId);
    const group = await this.UserService.getGroupByUser(this.userId);
    this.grupos = group.Group;
    console.log('grupos', this.grupos );
    if (this.grupos.length > 0){
      const actiRaffle = await this.getActiveRaffle();
      this.activeRaffles = actiRaffle;
       console.log('this.activeRaffles.length ', this.activeRaffles.length ) ;
       if(this.activeRaffles.length > 0){
         this.raffleId = this.activeRaffles['raffles'][0]['id'];
         console.log('this.raffleId', this.raffleId);
         this.getFichas();
        //buscar datos del sorteo
        //cargar los cartones del sorteo para ese usuario  
        // TODO: this.cartones= this.getCardsRafflesByUser(this.userId);
       } 
    }
  }

  onChangeGrupo(){
   this.getCardsAndRaffleByGroup();
  }

  async getCardsAndRaffleByGroup(){
    const RafByGr = await this.getRafflesBygroup();
    const CaAva = await this.getCardsRafflesByUser();
  }
  async getRafflesBygroup(){
    const respuesta = await this.RaffleService.getActiveRafflesByGroupAs(this.forma.get('grupo').value);
    console.log('this.RaffleId', respuesta['raffles'][0]['id']);
    this.raffleId = respuesta['raffles'][0]['id'];
  }

   async getCardsRafflesByUser(){
     const resp = await this.RaffleService.getCardsRaffleByUserAs(this.raffleId, this.userId);
     console.log('this.cartones =', resp);
    this.cartones = resp;
   }

   async getFichas(){
     const response = await this.RaffleService.getFichasAs(this.raffle);
     //this.fichas = response.Fichas;
     //this.raffle = response.Raffle; 
   }
   async getActiveRaffle(){
     const resp =  await this.RaffleService.getActiveRafflesByUser(this.userId);
      console.log('resp', resp['raffles'][0]['id']);
     this.activeRaffles =  resp;
      
   }
   
}
