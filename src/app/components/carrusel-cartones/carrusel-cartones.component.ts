import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Carton } from '../../models/carton.model';
// import { CardResponse } from '../../interfaces/card-response';
// import { Observable, tap } from 'rxjs';
import { CartonesService } from '../../services/cartones.service';
import { Card } from '../../interfaces/get-cards-raffle-response';
import { CartonComponent } from '../../components/carton/carton.component';
import Swal from 'sweetalert2';
import { RaffleService } from '../../services/raffle.service';
import { GetCardAvailableRaffleResponse } from '../../interfaces/get-card-available-raffle-response';

@Component({
  selector: 'app-carrusel-cartones',
  standalone: true,
  imports: [CommonModule, CartonComponent],
  templateUrl: './carrusel-cartones.component.html',
  styleUrls: ['./carrusel-cartones.component.css']
})

export class CarruselCartonesComponent implements OnInit, AfterViewInit {
  @Input() cartones: Card[] = [];
  @Input() seleccionados: number[] = [];
  @Input() JugadorId: string = '';
  @Input() UserId: number = 0;
  @Input() raffleId: number = 0;
  @Input() recordGroup: string = 'primer';

  @Output() seleccionar = new EventEmitter<number>();
  @Output() actualizarSaldo = new EventEmitter<number>();
  @Output() actualizarMisCartones = new EventEmitter<any[]>();
  // @Output() datosActualizados = new EventEmitter<any>();
  @ViewChild('track') track!: ElementRef;

  currentIndex = 0;
  cardsPerView = 4;
  quantityAvailableCards: number = 0;
  paginationCards: Promise<GetCardAvailableRaffleResponse> | undefined;
  private readonly http: HttpClient;
  baseUrl = '';
  isLoading: boolean = false;
  myCards: any[] = [];
  slideWidth = 190; // ← Ancho del slide (180px) + gap (10px)

  constructor(
    private CartonesService: CartonesService,
    private RaffleService: RaffleService,
    http: HttpClient
  ) {
    this.http = http;
  }

  ngOnInit(): void {
    this.cargarDatosiniciales();
    

  }
  
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateCarouselPosition();
    }, 0);
  }
  
    cargarDatosiniciales() {
      //  console.log('raffleId en carrusel-cartones.component =', this.raffleId);
      //  if (this.UserId==0){
        // console.log('UserId en carrusel-cartones.component =', this.UserId);
      //  }
      if (this.raffleId != 0){
        // this.getCardsAvailables();
        this.paginationCards = this.getAvailableCardsByRaffle(this.raffleId);       
        // console.log(this.getCardsAvailables());
      }
  }

   async getCardsAvailables(){
    this.CartonesService.getAvailableCards(String(this.raffleId))
      .subscribe((resp: any) => {
          this.cartones = resp.Card;
        },
        (error: any) => {
          console.log(error);
        });
  }

 /**Obtiene los cartones disponibles para el sorteo seleccionado  vienen de la tabla cardRaffle  con user_id == null*/
  async getAvailableCardsByRaffle(raffle: number): Promise<GetCardAvailableRaffleResponse> {
    const data = await this.RaffleService.getAvailableCardsByRaffle(this.raffleId);
    // console.log('📦 Datos desde el servicio: RaffleServices en carrusel-cartones.component', data.data.Card.data);
    this.cartones = data.data.Card.data;
    this.quantityAvailableCards = this.cartones.length;

    // console.log('🔍 Data en JSON:', JSON.stringify(data, null, 2));
    return data;
  }


seleccionarCarton(id: number): void {
  console.log('id_carton', id);
  Swal.fire({
    icon: 'question',
    title: 'Confirmar',
    text: '¿Quiere agregar este cartón a su apuesta?',
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#176585'
  }).then((result) => {
    if (result.isConfirmed) {
      // Mostrar loading
      Swal.fire({
        title: 'Procesando...',
        text: 'Realizando la apuesta, por favor espere.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.RaffleService.putCard(this.raffleId, id, this.UserId).subscribe({
        next: (response: any) => {
          // ✅ ÉXITO
          Swal.fire({
            icon: 'success',
            title: '¡Apuesta realizada!',
            text: response.message || 'El cartón ha sido agregado exitosamente.',
            confirmButtonColor: '#176585'
          });
          
          this.seleccionar.emit(id);
          
          // Recargar datos actualizados
          this.cargarDatosiniciales();
          this.actualizarSaldo.emit(this.UserId);
          this.actualizarMisCartones.emit(this.myCards);
        },
        error: (error: any) => {
          this.manejarErrorApuesta(error);
        }
      });
    }
  });
}

/**
 * Manejar errores de apuesta
 */
private manejarErrorApuesta(error: any): void {
  let title = 'Error al realizar la apuesta';
  let message = 'No se pudo realizar la apuesta. Intenta nuevamente.';
  let icon: 'error' | 'warning' = 'error';

  // Obtener código y mensaje del error
  const errorResponse = error.error;
  const errorCode = errorResponse?.code || '';
  const errorMessage = errorResponse?.message || error.message || '';

  // Mapear códigos de error a mensajes
  const errorMap: { [key: string]: { message: string; title?: string; icon?: 'error' | 'warning' } } = {
    'ERR-006': {
      title: 'Sorteo no encontrado',
      message: 'El sorteo al que intentas apostar no existe.'
    },
    'ERR-009': {
      title: 'Sorteo finalizado',
      message: 'El sorteo ya ha finalizado. No se pueden realizar más apuestas.'
    },
    'ERR-010': {
      title: 'Saldo insuficiente',
      message: 'No tienes suficiente saldo para realizar esta apuesta. Por favor, recarga tu cuenta.'
    },
    'ERR-011': {
      title: 'Cartón no disponible',
      message: 'Este cartón ya está asignado a otro usuario. Por favor, selecciona otro.'
    },
    'ERR-023': {
      title: 'Sorteo no iniciado',
      message: 'El sorteo aún no ha comenzado. Espera a que inicie para apostar.'
    },
    'ERR-027': {
      title: 'Error al agregar cartón',
      message: 'No se pudo agregar el cartón al sorteo. Intenta nuevamente.'
    },
    'ERR-029': {
      title: 'Cuenta no encontrada',
      message: 'El usuario no tiene una cuenta activa. Contacta con soporte.'
    },
    'ERR-030': {
      title: 'Error en la transacción',
      message: 'La transacción no pudo completarse. Por favor, intenta nuevamente.'
    },
    'ERR-500': {
      title: 'Error del servidor',
      message: 'Ocurrió un error en el servidor. Intenta más tarde.'
    }
  };

  // Buscar mensaje personalizado para el código de error
  if (errorCode && errorMap[errorCode]) {
    const errorInfo = errorMap[errorCode];
    title = errorInfo.title || title;
    message = errorInfo.message || message;
    icon = errorInfo.icon || 'error';
  } else if (errorMessage) {
    // Si no hay código específico, usar el mensaje del backend
    message = errorMessage;
  }

  // Mostrar error
  Swal.fire({
    icon: icon,
    title: title,
    text: message,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Entendido'
  });

  // Log del error para depuración
  console.error('Error al hacer la apuesta:', {
    code: errorCode,
    message: errorMessage,
    fullError: error
  });
}

cargarMisCartones(): void {
    this.RaffleService.getCardsRaffleByUser(this.raffleId, this.UserId).subscribe({
      next: (response: any) => {
        // Verificar la estructura de la respuesta
        if (response.success && response.data?.Card) {
          this.myCards = response.data.Card;
        } else if (response.Card) {
          this.myCards = response.Card;
        } else if (response.data) {
          this.myCards = response.data;
        } else {
          this.myCards = [];
        }
        
        // Opcional: Emitir evento para actualizar otro componente
        this.actualizarMisCartones.emit(this.myCards);
      },
      error: (error) => {
        console.error('Error al cargar mis cartones:', error);
        this.myCards = [];
      }
    });
  }

  //  nextSlide(): void {
  //       const maxIndex = Math.max(0, this.cartones.length - this.cardsPerView);
  //       if (this.currentIndex < maxIndex) {
  //           this.currentIndex++;
  //       }
  //   }

  //   prevSlide(): void {
  //       if (this.currentIndex > 0) {
  //           this.currentIndex--;
  //       }
  //   }



/**
 * Actualizar datos después de una apuesta exitosa
 */
  private actualizarDatos(): void {
  // Recargar cartones disponibles
    // this.cargarCartonesDisponibles();
  
  // // Recargar saldo del usuario
  //    this.cargarSaldoUsuario();
  
  // Recargar mis cartones
    // this.cargarMisCartones();
  }

  // get filteredCartones(): Card[] {
    //   return this.cartones;
    // }
    
  // isSelectedByMe(id: number): boolean {
  //   return this.seleccionados.includes(id);
  // }

  // isTakenByOther(carton: Carton): boolean {
  //   return !carton.disponible && !this.isSelectedByMe(carton.id);
  // }

  // getStatusInfo(carton: Carton): { text: string, class: string } {
  //   if (this.isSelectedByMe(carton.id)) {
  //     return { text: '✓ Tuyo', class: 'selected-by-you' };
  //   }
  //   if (this.isTakenByOther(carton)) {
  //     return { text: '❌ Ocupado', class: 'taken' };
  //   }
  //   return { text: '✅ Disponible', class: 'available' };
  // }

  // getButtonInfo(carton: Carton): { text: string, disabled: boolean, class: string } {
  //   if (this.isSelectedByMe(carton.id)) {
  //     return { text: '✓ Seleccionado', disabled: false, class: 'selected-btn' };
  //   }
  //   if (this.isTakenByOther(carton)) {
  //     return { text: 'No disponible', disabled: true, class: '' };
  //   }
  //   return { text: 'Seleccionar', disabled: false, class: '' };
  // }

  

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarouselPosition();
    }
  }

  nextSlide(): void {
    const maxIndex = Math.max(0, this.cartones.length - this.cardsPerView);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarouselPosition();
    }
  }

  private updateCarouselPosition(): void {
    if (this.track && this.track.nativeElement) {
      const cardWidth = 200;
      const offset = this.currentIndex * cardWidth;
      this.track.nativeElement.style.transform = `translateX(-${offset}px)`;
    }
  }
  
  
}

function subscribe(arg0: { next: (response: any) => void; error: (error: any) => void; }) {
  throw new Error('Function not implemented.');
}
