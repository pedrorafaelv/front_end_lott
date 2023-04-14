import { Component, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { Ficha, Raffle } from '../../interfaces/get-fichas-response';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Group } from '../../interfaces/get-groups-response';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { GroupService } from 'src/app/services/group.service';
import { faUsersRectangle, faPeopleGroup} from '@fortawesome/free-solid-svg-icons';

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
 faUsersRectangle= faUsersRectangle;
 faPeopleGroup = faPeopleGroup;

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
   }

  get grupoNoValido(){
    return this.forma.get('grupo')?.invalid && this.forma.get('grupo')?.touched;
  }

  async getInfo(){
    const user =  await this.UserService.getUserByLocalId(this.localId);
    this.userId = user.user[0]['id'];
    // console.log('this.userId', this.userId);
    const group = await this.UserService.getGroupByUser(this.userId);
    this.grupos = group.Group;
    // console.log('grupos', this.grupos );
    if (this.grupos.length > 0){
      const actiRaffle = await this.getActiveRaffle();
       setTimeout(async ()=>{
         const fich = await this.getFichas();
         const cartons= await this.getCardsRafflesByUser();
       }, 500);
    }
  }

  onChangeGrupo(){
    // console.log('cambio de grupo, id = '+ this.forma.get('grupo').value);
    this.getInfoByChangeGroup();
    //this.getCardsAndRaffleByGroup();
  }

  async getCardsAndRaffleByGroup(){
    const RafByGr = await this.getRafflesBygroup();
    const CaAva = await this.getCardsRafflesByUser();
  }
  async getRafflesBygroup(){
    const respuesta = await this.RaffleService.getActiveRafflesByGroupAs(this.forma.get('grupo').value);
    // console.log('this.RaffleId', respuesta['raffles'][0]['id']);
    this.raffleId = respuesta['raffles'][0]['id'];
  }

   async getCardsRafflesByUser(){
     const resp = await this.RaffleService.getCardsRaffleByUserAs(this.raffleId, this.userId);
    //  console.log('this.cartones =', resp.Cards);
    this.cartones = resp.Cards;
   }

   async getFichas(){
    // console.log('this.raffle en get fichas = ', this.raffleId);
     const response = await this.RaffleService.getFichasAs(this.raffleId);
    //  console.log('response de getFichas', response);
     this.fichas = response.Fichas;
     this.raffle = response.Raffle; 
   }
   async getActiveRaffle(){
     const resp =  await this.RaffleService.getActiveRafflesByUser(this.userId);
      // console.log('resp', resp['raffles'][0]['id']);
     this.raffleId =  resp['raffles'][0]['id'];
      
   }
   async getInfoByChangeGroup(){
    const RafByGr = await this.getRafflesBygroup();
    const fic = await this.getFichas();
    const CaAva = await this.getCardsRafflesByUser();
   }
   getNewRecord(){
    this.RaffleService.getNextFicha( this.raffleId)
    .subscribe(data=>{
      //  console.log('data =',data);
       this.RaffleService.getFichas(this.raffleId)
       .subscribe(resp=>{
         //console.log('resp.Fichas', resp.Fichas);
         console.log('resp.Raffle', resp);
        this.fichas = resp.Fichas;
        this.raffle = resp.Raffle; 
       })
     });
  }

}
