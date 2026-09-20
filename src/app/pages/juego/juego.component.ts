import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RaffleService } from '../../services/raffle.service';
import { Ficha, Raffle } from '../../interfaces/get-fichas-response';
import { NewFicha } from '../../interfaces/get-new-record-response';
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
import { PublicityComponent } from '../../components/publicity/publicity.component';
import { RecordsComponent } from '../../components/records/records.component';
import { PipesModule } from "../../pipes/pipes.module";
import { CartonComponent } from '../../components/carton/carton.component';
import { GetCardAvailableRaffleResponse } from '../../interfaces/get-card-available-raffle-response';
import { NewRecordResponse } from '../../interfaces/get-new-record-response';
import { CANCEL_BET_MESSAGES, CancelBetResponse, isCancelBetError, isCancelBetSuccess } from '../../interfaces/cancel-bet-response';
import { BouncingBallComponent } from '../../components/bouncing-ball/bouncing-ball.component';

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
    BouncingBallComponent
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
 activeRaffles: any ;
 faUsersRectangle= faUsersRectangle;
 faPeopleGroup = faPeopleGroup;
 existe: number = -1;
 lineWinner: any;
 fullWinner: any; 
 saldo: number = 0;
 recordGroup: string= 'primer'
 RaffleDetails: RaffleDetails | undefined;
 public color: string = 'black';
 sorteoCerrado: boolean = false;
 imagenUrl:string="";
 lastRecord: NewFicha | undefined;
 nombreFichaActual:string ="";
 imagenFichaActual:string ="";
 baseUrlImage:string = './assets/images/full_circle_cari_ia/';
    // ⭐ Trigger para actualizar marcas (cambia cada vez que se presiona el botón)
  triggerActualizarMarcas: number = 0;

  
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
      this.getAvailableCardsByRaffle();
      this.getRaffleDetails();
    }
  }

 /**
     * Array de nombres de fichas reveladas (se usa en el cartón)
     */
    get fichasReveladasArray(): string[] {
        return this.fichas?.map(f => f.image) ?? [];
    }

  // Escuchar eventos del hijo
  onDatosActualizados(event: any): void {
    console.log('Datos actualizados:', event);
    // Aquí puedes actualizar otros componentes
  }

  onActualizarSaldo(nuevoSaldo: number): void {
    console.log('Nuevo saldo:', nuevoSaldo);
    // Actualizar la variable de saldo en el padre
    this.saldo = nuevoSaldo;
  }
  
  onActualizarMisCartones(misCartones: any[]): void {
    console.log('Mis cartones actualizados:', misCartones);
    // Actualizar la lista de mis cartones en el padre
    this.getAvailableCardsByRaffle();
  }

async getAvailableCardsByRaffle(): Promise<GetCardAvailableRaffleResponse> {
    const data = await this.RaffleService.getAvailableCardsByRaffle(this.raffleId, this.userId);
    console.log('📦 Datos desde el servicio: RaffleServices en juego.component', data.data.Card.data);
    this.MyCards = data.data.Card.data;

    // console.log('🔍 Data en JSON:', JSON.stringify(data, null, 2));
    return data;
  }

  // get fichasReveladasArray(): string[] {
  //     // Opción 1: Si 'fichas' contiene las fichas que ya salieron
  //     return this.fichas.map(f => f.image);
      
  //     // Opción 2: Si tienes un array separado de fichas reveladas
  //     // return this.fichasReveladas.map(f => f.image);
  // } 

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

  async getInfo(){
    const user =  await this.UserService.getUserByLocalId(this.localId);
    this.userId = user.user[0]['id'];
    // console.log('userId', this.userId);
    if(this.userId){
      const MyCards = await this.getAvailableCardsByRaffle();
      // console.log('MyCards', MyCards);
    }
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
            this.RaffleService.deleteCard(this.raffleId, this.userId, id).subscribe(
              (resp: any) => {
                // console.log('resp en deleteCard', resp);
                const cancelBetResponse = resp as CancelBetResponse;
                if (isCancelBetSuccess(cancelBetResponse)) {
                  Swal.fire({
                    icon: 'success',
                    title: 'Cartón eliminado',
                    text: `Se eliminó el cartón correctamente.`,
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#176585'
                  });
                  return;
                }

                if (isCancelBetError(cancelBetResponse)) {
                  Swal.fire({
                    icon: 'error',
                    title: 'No se pudo eliminar',
                    text: CANCEL_BET_MESSAGES[cancelBetResponse.code] || cancelBetResponse.message,
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#176585'
                  });
                }
              },
              (error: any) => {
                console.error('Error al eliminar el cartón:', error);
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: error?.message || 'No se pudo eliminar el cartón.',
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#176585'
                });
              }
            );
//              try {
//               // this.eliminar.emit(id);

//               this.RaffleService.deleteCard(this.raffleId, this.userId, id).subscribe({
//                 next: (response) => {
//             const cancelBetResponse = response as unknown as CancelBetResponse;
//         // ✅ Type Guard - Éxito
//             if (isCancelBetSuccess(cancelBetResponse)) {
//             Swal.fire({
//                 icon: 'success',
//                 title: 'Apuesta cancelada',
//                 text: `Se reembolsaron $${cancelBetResponse.data.refunded_amount}. Nuevo saldo: $${cancelBetResponse.data.new_amount}`,
//                 footer: `ID: ${cancelBetResponse.meta.request_id}`
//             });
//             return;
//           }

//         // ❌ Type Guard - Error
//             if (isCancelBetError(cancelBetResponse)) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: CANCEL_BET_MESSAGES[cancelBetResponse.code] || cancelBetResponse.message,
//                 footer: `ID: ${cancelBetResponse.meta.request_id}`
//             });
//         }
//     },
//     error: (error) => {
//         // Errores HTTP no controlados (500, 404, etc.)
//         const errorResponse = error.error as CancelBetResponse;
//         Swal.fire({
//             icon: 'error',
//             title: 'Error de conexión',
//             text: errorResponse?.message || 'No se pudo conectar con el servidor'
//         });
//     }
// });
//               this.RaffleService.deleteCard(this.raffleId,this.userId,id)
//                console.log('carton eliminado');
//              } catch (error) {
//               console.log('no se puedo hacer eliminar el cartón')
//              }
          }
        });

  }
  
  async getNextRecord(){
    const resp = this.RaffleService.getNextRecord(this.raffleId).subscribe({
      next: (resp: NewRecordResponse) => { 
        this.lastRecord= resp.data?.ficha;
        this.lineWinner = resp.data?.winners.line;
        this.fullWinner = resp.data?.winners.full;
        this.imagenFichaActual= this.baseUrlImage +(resp.data?.ficha?.image ?? "");
        // this.imagenFichaActual= this.baseUrlImage + "376_p.png";
        this.nombreFichaActual =  resp.data?.ficha?.name ?? "";
        console.log('resp en getnetxRecord', resp);

     },
     error: (error: any) => {
      console.error('Error al obtener la siguiente ficha:', error);
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,            
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#176585'
       }); 
     }
     //  this.lastRecord = resp.ficha; 
   })
}

  async  getNewRecord(){
    // console.log('getNewRecord');
    this.existe = -1;
    const nf= await this.getNextRecord();
    const fs= await this.getFichas();
    // console.log('fichas en getnewrecord', this.fichas);
    const currentRecordImage = this.lastRecord?.image ?? '';

    this.cartones.forEach(async (carton: any)=>{
           this.existe = carton?.desc_combTotal?.indexOf(currentRecordImage) ?? -1;
          //  this.scroll.nativeElement.scrollTop= this.scroll.nativeElement.scrollHeight;
           if (this.existe != -1){
              console.log('existe', this.existe);
              Swal.fire({
                position: 'top-end',
                text: 'la ficha está en el(los) cartones:'+carton.id,
                imageUrl: './assets/capicon/black/'+currentRecordImage,
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
   /**
     * Muestra mensaje de error genérico
     */
    private mostrarError(mensaje: string) {
        Swal.fire({
            icon: 'warning',
            title: 'Aviso',
            text: mensaje,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#176585'
        });
    }

    /**
     * Maneja errores HTTP (el backend envía el mensaje)
     */
    private manejarErrorHttp(error: any) {
        console.error('Error HTTP:', error);

        // Extraer mensaje de la respuesta del backend
        const mensaje = error.message || 'Error al obtener la ficha';
        const codigo = error.code || 'ERR-UNKNOWN';
        const status = error.status || 500;

        // Personalizar título según el código de error
        let titulo = 'Error';
        let icono: 'error' | 'warning' | 'info' = 'error';

        switch (codigo) {
            case 'ERR-009':
                titulo = 'Sorteo finalizado';
                icono = 'info';
                break;
            case 'ERR-023':
                titulo = 'Sorteo no iniciado';
                icono = 'warning';
                break;
            case 'ERR-024':
                titulo = 'Ganador de línea';
                icono = 'info';
                break;
            case 'ERR-025':
                titulo = 'Cartón lleno';
                icono = 'info';
                break;
            case 'ERR-026':
                titulo = 'Sin premios habilitados';
                icono = 'warning';
                break;
            case 'ERR-002':
                titulo = 'Sin fichas disponibles';
                icono = 'warning';
                break;
            case 'ERR-006':
                titulo = 'Sorteo no encontrado';
                icono = 'error';
                break;
        }

        Swal.fire({
            icon: icono,
            title: titulo,
            text: mensaje,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#176585'
        });

        // Si el sorteo terminó, actualizar el estado local
        if (codigo === 'ERR-009' || codigo === 'ERR-024' || codigo === 'ERR-025') {
            this.sorteoCerrado = true;
        }
    }

    /**
     * Muestra mensaje cuando hay ganador de línea y el sorteo continúa
     */
    private mostrarGanadorLinea(ganador: any) {
        Swal.fire({
            icon: 'success',
            title: '¡Ganador de Línea!',
            html: `El cartón <b>#${ganador}</b> ha ganado la línea.<br>
                   <small>El sorteo continúa hasta que haya cartón lleno.</small>`,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#176585'
        });
    }

    /**
     * Muestra mensaje cuando el sorteo finaliza
     */
    private mostrarMensajeCierre(mensaje: string, data: any) {
        let html = mensaje;

        if (data.winners.full) {
            html += `<br><br><strong>🏆 Ganador de Cartón Lleno:</strong> Cartón #${data.winners.full}`;
        }
        if (data.winners.line && !data.winners.full) {
            html += `<br><br><strong>🎯 Ganador de Línea:</strong> Cartón #${data.winners.line}`;
        }

        Swal.fire({
            icon: 'success',
            title: '🎉 Sorteo Finalizado',
            html: html,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#176585'
        });
    }

    /**
     * Verifica si la ficha obtenida está en los cartones del usuario
     */
    private verificarFichaEnCartones(ficha: any) {
        this.MyCards.forEach((carton: any) => {
            const existe = carton.desc_combTotal.indexOf(ficha.image);
            
            if (existe !== -1) {
                console.log('✅ La ficha está en el cartón:', carton.id);
                
                Swal.fire({
                    position: 'top-end',
                    text: `La ficha está en el cartón: #${carton.id}`,
                    imageUrl: `./assets/capicon/black/${ficha.image}`,
                    imageWidth: 30,
                    imageHeight: 30,
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
            }
        });
    }

   /**
     *  Se ejecuta al presionar el botón de "Actualizar Marcas"
     */
    actualizarMarcasCartones(): void {
        this.triggerActualizarMarcas++;
        console.log('🎯 Actualizando marcas. Trigger:', this.triggerActualizarMarcas);
        console.log('📋 Fichas reveladas:', this.fichasReveladasArray);
    }
  // get grupoNoValido(){
  //   return this.forma.get('grupo')?.invalid && this.forma.get('grupo')?.touched;
  // }

  

  // onChangeGrupo(){
  //   this.getInfoByChangeGroup();
  // }

  // async getCardsAndRaffleByGroup(){
  //   const RafByGr = await this.getRafflesBygroup();
  //   const CaAva = await this.getCardsRafflesByUser();
  // }

  // async getRafflesBygroup(){
  //   const respuesta = await this.RaffleService.getActiveRafflesByGroupAs(this.forma.get('grupo')?.value);
  //   this.raffleId = respuesta['raffles'][0]['id'];
  // }

 

  //  async getInfoByChangeGroup(){
  //   const RafByGr = await this.getRafflesBygroup();
  //   const fic = await this.getFichas();
  //   const CaAva = await this.getCardsRafflesByUser();
  //  }

// @Component({
//     selector: 'app-juego',
//     standalone: true,
//     imports: [CommonModule],
//     templateUrl: './juego.component.html',
//     styleUrls: ['./juego.component.css']
// })
// export class JuegoComponent implements OnInit {
    // raffleId: number = 0;
    // raffleInfo: any = null;
    // lastRecord: any = null;
    // lineWinner: any = null;
    // fullWinner: any = null;
    // sorteoCerrado: boolean = false;
    // fichasRestantes: number = 0;

    // constructor(private RaffleService: RaffleService) {}

    // ngOnInit(): void {
        // ... cargar raffleId
    // }
    // async getNewRecord() {
    //     try {
    //         // 1. Llamar al servicio (ahora usa el tipado correcto)
    //         const response: NewRecordResponse = await this.RaffleService
    //             .getNextRecord(this.raffleId)
    //             .toPromise() as NewRecordResponse;

    //         // 2. Verificar si la respuesta es exitosa
    //         if (!response.success) {
    //             this.mostrarError(response.message);
    //             return;
    //         }

    //         // 3. Procesar la respuesta exitosa
    //         const data = response.data!;
            
    //         // Guardar la ficha obtenida
    //         this.lastRecord = data.ficha;

    //         // Actualizar información del sorteo
    //         this.raffleInfo = data.raffle;
    //         this.lineWinner = data.raffle.line_winner;
    //         this.fullWinner = data.raffle.full_winner;
    //         this.sorteoCerrado = data.raffle.is_closed;

    //         // 4. Verificar si el sorteo se cerró
    //         if (data.raffle.is_closed) {
    //             this.mostrarMensajeCierre(response.message, data);
    //         }
    //         // 5. Verificar si hay ganador de línea pero el sorteo continúa
    //         else if (data.winners.line && !data.raffle.is_closed) {
    //             this.mostrarGanadorLinea(data.winners.line);
    //         }

    //         // 6. Verificar si la ficha está en algún cartón del usuario
    //         this.verificarFichaEnCartones(data.ficha);

    //         // 7. Recargar las fichas del sorteo
    //         await this.getFichas();

    //     } catch (error: any) {
    //         // Manejar errores HTTP (409, 404, 500, etc.)
    //         this.manejarErrorHttp(error);
    //     }
    // }

    
    /**
     * Recarga las fichas del sorteo
     */
    // async getFichas() {
    //     const response = await this.RaffleService.getFichasAs(this.raffleId);
    //     this.fichas = response.Fichas;
    //     this.raffle = response.Raffle;
    // }
// }

}
