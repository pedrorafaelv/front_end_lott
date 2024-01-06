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
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product';

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
public Raffle:any;
public fichagroup ;
public product: Product;
public p: [];
  constructor(public RaffleService: RaffleService, 
    private GroupService: GroupService,
    private fb: FormBuilder,
    private AuthService: AuthService,
    private router: Router,
    private UserService: UserService,
    private cartonesS: CartonesService,
    private CartService:CartService
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
       console.log('card_id = ',card_id);      
      this.CartService.addNewProduct(this.UserId,this.RaffleId, card_id, 1);
       this.RaffleService.putCard(this.RaffleId, card_id, this.UserId)
       .subscribe(resp =>{
          console.log('raffleServicePutCard',resp);
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
  this.getRafflesBygroup();
  setTimeout(()=>{
    this.getCardsAvailables();
  }, 1000); 
}

activeRaffleBYGroup(){
   return new Promise ((resolve,reject)=>{
    this.RaffleService.getActiveRafflesByGroup(this.forma.get('grupo').value)
    .subscribe(resp=>{
       resolve(resp);
     },(error)=>{
       reject(error);
     });
   })
}
async getRafflesBygroup(){
    this.Raffle = await this.activeRaffleBYGroup();
    this.RaffleId = this.Raffle['raffles'][0]['id'];
    this.fichagroup= this.Raffle['raffles'][0]['groupfichas'];
}

async getCardsAvailables(){
    this.cartoness = await  this.cartonesS.getAvailableCards(this.RaffleId)
    .subscribe(resp=>{
       this.cartones = resp.Card;
    },
    error=>{
        console.log(error);
    });
}

async getInfo(){
    const user =  await this.UserService.getUserByLocalId(this.localId);
    this.UserId = user.user[0]['id'];
    const group = await this.UserService.getGroupByUser(this.UserId);
    this.grupos = group.Group;
}
 
}
