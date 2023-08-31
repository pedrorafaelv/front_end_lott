import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RaffleService } from '../../services/raffle.service';
import { Ficha, Raffle } from '../../interfaces/get-fichas-response';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Group } from '../../interfaces/get-groups-response';
import { AuthService } from '../../services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { GroupService } from 'src/app/services/group.service';
import { faUsersRectangle, faPeopleGroup} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
 fichas: Ficha[]=[];
 raffle:Raffle;
 grupos: Group[]=[];
 fichaGroupName: string;
 forma: FormGroup;
 localId: string;
 userId: string;
 raffleId: any;
 cartones: any; 
 lastRecord: any;
 activeRaffles: any ;
 faUsersRectangle= faUsersRectangle;
 faPeopleGroup = faPeopleGroup;
 existe: number;
 lineWinner: any;
 fullWinner: any; 
 public color: string = 'black';
@ViewChild('scroll') scroll: ElementRef;
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
    const group = await this.UserService.getGroupByUser(this.userId);
    this.grupos = group.Group;
    if (this.grupos.length > 0){
      const actiRaffle = await this.getActiveRaffle();
       setTimeout(async ()=>{
         const fich = await this.getFichas();
         const cartons= await this.getCardsRafflesByUser();
       }, 500);
    }
  }

  onChangeGrupo(){
    this.getInfoByChangeGroup();
  }

  async getCardsAndRaffleByGroup(){
    const RafByGr = await this.getRafflesBygroup();
    const CaAva = await this.getCardsRafflesByUser();
  }

  async getRafflesBygroup(){
    const respuesta = await this.RaffleService.getActiveRafflesByGroupAs(this.forma.get('grupo').value);
    this.raffleId = respuesta['raffles'][0]['id'];
  }

   async getCardsRafflesByUser(){
    const resp = await this.RaffleService.getCardsRaffleByUserAs(this.raffleId, this.userId);
    this.cartones = resp.Cards;
   }

   async getFichas(){
     const response = await this.RaffleService.getFichasAs(this.raffleId);
     this.fichas = response.Fichas;
     this.raffle = response.Raffle; 
   }

   async getActiveRaffle(){
     const resp =  await this.RaffleService.getActiveRafflesByUser(this.userId);
       console.log('resp', resp);
     this.raffleId =  resp['raffles'][0]['id']; 
     this.fichaGroupName= resp['raffles'][0]['groupfichas']; 
   }

   async getInfoByChangeGroup(){
    const RafByGr = await this.getRafflesBygroup();
    const fic = await this.getFichas();
    const CaAva = await this.getCardsRafflesByUser();
   }

async getNextRecord(){
   const resp = await this.RaffleService.getNextRecord(this.raffleId);
   this.lastRecord = resp.ficha; 
   this.lineWinner = resp.lineWinner;
   this.fullWinner = resp.fullWinner;
}

  async  getNewRecord(){
    this.existe = -1;
    const nf= await this.getNextRecord();
    const fs= await this.getFichas();
    this.cartones.forEach(async (carton)=>{
           this.existe = carton.desc_combTotal.indexOf(this.lastRecord.image);
           this.scroll.nativeElement.scrollTop= this.scroll.nativeElement.scrollHeight;
           if (this.existe != -1){
              console.log('existe', this.existe);
              Swal.fire({
                position: 'top-end',
                text: 'la ficha está en el(los) cartones:'+carton.id,
                imageUrl: './assets/capicon/black/'+this.lastRecord.image,
                imageWidth: 30,
                imageHeight: 30,
                imageAlt: 'Custom image',
                icon: 'success',
                showConfirmButton: false,
                timer: 1500,
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
                });
              let car = await this.getCardsRafflesByUser(); 
              if (this.lineWinner !="" && this.lineWinner!=0){
                Swal.fire({
                  icon: 'success',
                  title:'Exito ',
                  text: 'Carton ganador de linea:'+carton.id,
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#176585',
                  });
               }
           }
    }) 
  }
 
 
}
