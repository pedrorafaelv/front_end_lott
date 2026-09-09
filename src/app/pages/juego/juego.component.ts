import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RaffleService } from '../../services/raffle.service';
import { Ficha, Raffle } from '../../interfaces/get-fichas-response';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Group } from '../../interfaces/get-groups-response';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { faUsersRectangle, faPeopleGroup} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { CartonesService } from '../../services/cartones.service';
import { Card } from '../../interfaces/get-cards-raffle-response';
import{ RaffleDetails } from '../../interfaces/get-raffle-details-response';
import { DirectivesModule } from '../../directives/directives.module';
import { CarruselCartonesComponent } from '../../components/carrusel-cartones/carrusel-cartones.component';
// import { CartonSeleccionadoComponent } from '../../components/carton-seleccionado/carton-seleccionado.component';
import { PublicityComponent } from '../../components/publicity/publicity.component';
import { RecordsComponent } from '../../components/records/records.component';
// import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { PipesModule } from "../../pipes/pipes.module";
import { CartonComponent } from '../../components/carton/carton.component';
import { GetCardAvailableRaffleResponse } from '../../interfaces/get-card-available-raffle-response';

@Component({
    selector: 'app-juego',
    standalone: true, 
    imports: [
    CommonModule,
    DirectivesModule,
    CartonComponent,
    CarruselCartonesComponent,
    PublicityComponent,
    RecordsComponent,
    PipesModule,
    // CartonSeleccionadoComponent
],
    templateUrl: './juego.component.html',
    styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {
 raffleId: number = 0;
 fichas: Ficha[]=[];
 raffle!: Raffle;
 grupos: Group[]=[];
 cartones: Card[]=[];
 MyCards: Card[]=[];
 fichaGroupName: string = '';
 forma: FormGroup;
 localId: string = '';
 userId: number= 0;
 lastRecord: any;
 activeRaffles: any ;
 faUsersRectangle= faUsersRectangle;
 faPeopleGroup = faPeopleGroup;
 existe: number = -1;
 lineWinner: any;
 fullWinner: any; 
 RaffleDetails: RaffleDetails | undefined;
 public color: string = 'black';
@ViewChild('scroll') scroll!: ElementRef;
@Output() eliminar = new EventEmitter<number>();

  constructor(private RaffleService: RaffleService,
              private AuthService: AuthService,
              private UserService: UserService,
              private fb : FormBuilder,
              private Cartones:CartonesService,
              private route: ActivatedRoute) { 
              this.forma = this.fb.group({
                  grupo: ['', [Validators.required]],
                 }  );
  }
 
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.raffleId = params['raffleId'];
      // console.log('ID del sorteo en componente juego:', this.raffleId);
      });
    this.localId = this.AuthService.getLocalId();
    if (this.localId){
      this.getInfo();
     } 
    // console.log('raffleId', this.raffleId);
    if (this.raffleId != 0){
      this.getFichas();
      // this.getCardsRafflesByUser();
      // this.getCardsAvailables();
      this.getAvailableCardsByRaffle();
      this.getRaffleDetails();
    }
  }

async getAvailableCardsByRaffle(): Promise<GetCardAvailableRaffleResponse> {
    const data = await this.RaffleService.getAvailableCardsByRaffle(this.raffleId, this.userId);
    console.log('📦 Datos desde el servicio: RaffleServices en juego.component', data.data.Card.data);
    this.MyCards = data.data.Card.data;

    // console.log('🔍 Data en JSON:', JSON.stringify(data, null, 2));
    return data;
  }
  async getRaffleDetails(): Promise<RaffleDetails | undefined> {
    try {
        const response = await this.RaffleService.getRaffleDetails(this.raffleId);
        this.RaffleDetails = response;
        // console.log('✅ Detalles del sorteo:', this.RaffleDetails);
        // console.log('this.RaffleDetails?.data.groupficha.name:', this.RaffleDetails?.data.groupficha.name);
        this.fichaGroupName = this.RaffleDetails?.data.groupficha.name || '';
        return this.RaffleDetails;
    } catch (error) {
        console.error('❌ Error en getRaffleDetails:', error);
      return undefined;
    }
}

  get grupoNoValido(){
    return this.forma.get('grupo')?.invalid && this.forma.get('grupo')?.touched;
  }

  async getInfo(){
    const user =  await this.UserService.getUserByLocalId(this.localId);
    this.userId = user.user[0]['id'];
    console.log('userId', this.userId);
    if(this.userId){
      const MyCards = await this.getAvailableCardsByRaffle();
      console.log('MyCards', MyCards);
    }
    // const group = await this.UserService.getGroupByUser(this.userId);
    // this.grupos = group.Group;
    // if (this.grupos.length > 0){
    //   const actiRaffle = await this.getActiveRaffle();
    //    setTimeout(async ()=>{
    //      const fich = await this.getFichas();
    //      const cartons= await this.getCardsRafflesByUser();
    //    }, 500);
    // }
  }

  // onChangeGrupo(){
  //   this.getInfoByChangeGroup();
  // }

  async getCardsAndRaffleByGroup(){
    const RafByGr = await this.getRafflesBygroup();
    const CaAva = await this.getCardsRafflesByUser();
  }

  async getRafflesBygroup(){
    const respuesta = await this.RaffleService.getActiveRafflesByGroupAs(this.forma.get('grupo')?.value);
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
     console.log('fichas', this.fichas);
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

async getCardsAvailables(){
    this.Cartones.getAvailableCards(String(this.raffleId))
      .subscribe((resp: any) => {
          this.cartones = resp.Card;
        },
        (error: any) => {
          console.log(error);
        });
  }

   eliminarCarton(id:number): void {
    Swal.fire({
          icon: 'question',
          title: 'Confirmar',
          text: '¿Quieres Eliminar este cartón de esta mano?',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#176585'
        }).then((result) => {
          if (result.isConfirmed) {
             try {
              this.eliminar.emit(id);
              this.RaffleService.deleteCard(this.raffleId,this.userId,id)
               console.log('carton eliminado');
             } catch (error) {
              console.log('no se puedo hacer eliminar el cartón')
             }
          }
        });

  }
  async  getNewRecord(){
    console.log('getNewRecord');
    this.existe = -1;
    const nf= await this.getNextRecord();
    const fs= await this.getFichas();
    this.cartones.forEach(async (carton: any)=>{
           this.existe = carton.desc_combTotal.indexOf(this.lastRecord.image);
          //  this.scroll.nativeElement.scrollTop= this.scroll.nativeElement.scrollHeight;
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
