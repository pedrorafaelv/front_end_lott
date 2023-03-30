import { Component, Input, OnInit } from '@angular/core';
import { RaffleService } from 'src/app/services/raffle.service';
import { card } from '../../interfaces/card-response';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/get-groups-response';
import Swal from "sweetalert2";
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CartonesService } from 'src/app/services/cartones.service';

@Component({
  selector: 'app-cartones-poster-grid',
  templateUrl: './cartones-poster-grid.component.html',
  styleUrls: ['./cartones-poster-grid.component.css']
})
export class CartonesPosterGridComponent implements OnInit {
@Input() cartones:card[]=[];
color: string = 'black';
public grupos: Group[]= [];
public profile: [];
public localId : string;
public UserId: any;
public RaffleId: any;
forma: FormGroup;
public cartoness: any;

  constructor(public RaffleService: RaffleService, 
    private GroupService: GroupService,
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private UserService: UserService,
    private cartonesS: CartonesService
    ) { 
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
  
  putCard(card_id: any): any{
    if (!this.AuthService.estaAutenticado()){
        this.router.navigateByUrl('/home');
       }
  
  let group_id = this.forma.get('grupo').value;
  if (group_id ==""){
      Swal.fire({
        icon: 'error',
        title:'Error',
        text: 'Debe seleccionar un grupo con sorteo activo para participar con el carton',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#176585',
        });
    }else{
       console.log('putcard en cartones-poster-grid, id = ', card_id+' group_id = '+group_id+' localId= '+this.UserId);
       this.RaffleService.putCard(this.RaffleId, card_id, this.UserId)
       .subscribe(resp =>{
          // console.log('raffleServicePutCard',resp);
          Swal.fire({
            icon: 'success',
            title:'Éxito',
            text: resp['message'],
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#176585',
            });
       }, error =>{
        Swal.fire({
          icon: 'error',
          title:'Error',
          text: error['error']['message'],
          confirmButtonText: 'Aceptar',
           confirmButtonColor: '#176585',
          });
       });
    }
 }
 get grupoNoValido(){
  return this.forma.get('grupo')?.invalid && this.forma.get('grupo')?.touched;
}
onChangeGrupo(){
  console.log('cambio de grupo, id = '+ this.forma.get('grupo').value);
  this.getRafflesBygroup();
  setTimeout(()=>{
    this.getCardsAvailables();
  }, 1000); 
  }

  
activeRaffleBYGroup(){
   return new Promise ((resolve,reject)=>{
    this.RaffleService.getActiveRafflesByGroup(this.forma.get('grupo').value)
    .subscribe(resp=>{
       resolve(resp['raffles'][0]['id']);
     },(error)=>{
       reject(error);
     });
   })
}
   async getRafflesBygroup(){
    this.RaffleId = await this.activeRaffleBYGroup();
       console.log('this.RaffleId', this.RaffleId);
   }

   async getCardsAvailables(){
    this.cartoness = await  this.cartonesS.getAvailableCards(this.RaffleId)
    .subscribe(resp=>{
       console.log(resp);
       this.cartones = resp.Card;
    },
      error=>{
        console.log(error);
      });
   }


  async getInfo(){
    const user =  await this.UserService.getUserByLocalId(this.localId);
    this.UserId = user.user[0]['id'];
    console.log('this.userId', this.UserId);
    const group = await this.UserService.getGroupByUser(this.UserId);
    this.grupos = group.Group;
}
}
