import { Component, Input, OnInit } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/get-groups-response';
import Swal from "sweetalert2";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CartonesService } from '../../services/cartones.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product';
import { Card } from '../../interfaces/get-cards-raffle-response';


@Component({
    selector: 'app-cartones-poster-grid',
    templateUrl: './cartones-poster-grid.component.html',
    styleUrls: ['./cartones-poster-grid.component.css'],
    standalone: false
})
export class CartonesPosterGridComponent implements OnInit {

@Input() cartones:Card[]=[];
color: string = 'black';
public grupos: Group[]= [];
public profile: any[] = [];
public localId : string = '';
public UserId: any = null;
public RaffleId: any = null;
forma: FormGroup;
public cartoness: any = [];
public Raffle:any = null;
public fichagroup: any = null;
public product: Product | null = null;
public p: any[] = [];
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
  
  const grupoControl = this.forma.get('grupo');
  const group_id = grupoControl?.value ?? '';

  if (group_id === ''){
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
       .subscribe((resp: any) => {
          console.log('raffleServicePutCard',resp);
          Swal.fire({
            icon: 'success',
            title:'Éxito',
            text: resp['message'],
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#176585',
            });
       }, (error: any) => {
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

activeRaffleBYGroup(): Promise<any> {
  const grupoControl = this.forma.get('grupo');
  const groupId = grupoControl?.value ?? null;

  if (!groupId) {
    return Promise.reject(new Error('Debe seleccionar un grupo válido'));
  }

  return new Promise((resolve, reject) => {
    this.RaffleService.getActiveRafflesByGroup(groupId)
      .subscribe({
        next: (resp) => resolve(resp),
        error: (error) => reject(error)
      });
  });
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
    // console.log('user =', user);
    // this.UserId = user.user[0]['id'];
    this.UserId= 1;
    const group = await this.UserService.getGroupByUser(this.UserId);
    this.grupos = group.Group;
}
 
}
