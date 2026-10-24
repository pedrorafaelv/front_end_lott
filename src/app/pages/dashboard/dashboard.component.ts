import { RaffleService } from '../../services/raffle.service';
import { Raffle } from '../../interfaces/get-fichas-response';
import { CommonModule } from '@angular/common';
import { SorteoService } from '../../services/sorteo.service';
import { Sorteo, Estadisticas } from '../../models/sorteo.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AccountService } from '../../services/account.service';
import Swal from 'sweetalert2';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil, interval, Subscription,timeout } from 'rxjs';
import {
    AccountSummary,
    AccountTransaction,
    Balance,
    Currency,
    TransactionFilters,
    Via,
    WithdrawalRequest,
} from '../../interfaces/account.interface';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: true,
    imports:[CommonModule ]
})

export class DashboardComponent implements OnInit {
  public raffles: any;
  sorteosEnVivo: Sorteo[] = [];
  sorteosProximos: Sorteo[] = [];  sorteosActivos: Sorteo[] = [];  estadisticas: Estadisticas = {
  activos: 0,
  jugadores: 0,
  premios: '$0'
};
userId:any;
user:any;
vias: Via[] = [];
private destroy$ = new Subject<void>();
summary: AccountSummary | null = null;
balances: Balance[] = [];
currentBalance: Balance | null = null;
transactions: AccountTransaction[] = [];
withdrawalRequests: WithdrawalRequest[] = [];
currencies: Currency[] = [];
selectedCurrency: string = 'USD';
loading = false;
currency_id = 2;
totalDebits = 0;
totalCredits = 0;
usuariosEnLinea = [
  { nombre: 'Jugador_01', apuesta: 50 },
  { nombre: 'LuckyStrike', apuesta: 120 },
  { nombre: 'AceHigh',     apuesta: 30 },
  { nombre: 'DarkHorse',   apuesta: 200 },
  { nombre: 'RedQueen',    apuesta: 75 },
  { nombre: 'CardShark',   apuesta: 150 },
  { nombre: 'NeonBet',     apuesta: 60 },
  { nombre: 'GoldRush',    apuesta: 90 },
  { nombre: 'DarkHorse',   apuesta: 200 },
  { nombre: 'RedQueen',    apuesta: 75 },
  { nombre: 'CardShark',   apuesta: 150 },
  { nombre: 'NeonBet',     apuesta: 60 },
  { nombre: 'GoldRush',    apuesta: 90 },
  
];
nextSorteo: Sorteo | null = null;
nextRaffleDate: Date | null = null;
countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
isStarting = false;
private countdownSub?: Subscription;

  // Filtros
    filters: TransactionFilters = {
        currency_id: 'USD',
        via_id: null,
        type: null,
        date_from: null,
        date_to: null,
        amount_min: null,
        amount_max: null,
        page: 1,
        per_page: 20,
    };

constructor(private RaffleService: RaffleService, 
            private sorteoService: SorteoService, 
            private router: Router,
            private authService: AuthService,
            private userService: UserService,
            private accountService:AccountService) { }

ngOnInit(): void {
     const id = this.authService.getUserId();
        if (id === null) {
             this.router.navigateByUrl('/log-in');   // sin sesión no debería estar aquí
         return;
        }
        this.userId = id;
         console.log('userId = ', this.userId);
        this.user = this.userService.currentUser();
        console.log('currentUser', this.user);
        this.loadUserData();
        setTimeout(() => this.getTotalBalance(), 1000);
        this.raffles= this.RaffleService.getDetailActiveRafflesByUser(this.userId)
        .then((datos)=>{
              this.raffles= datos;
       //console.log('this.raffles=', this.raffles );
         })
          .catch((error)=>{console.log(error)});

     // Suscribirse a los sorteos en vivo
    this.sorteoService.getSorteosEnVivo().subscribe({
      next: (sorteos) => {
        this.sorteosEnVivo = sorteos;
      },
      error: (error) => {
        console.error('Error al cargar sorteos en vivo:', error);
      }
    });

    // Suscribirse a los sorteos próximos
    this.sorteoService.getSorteosProximos().subscribe({
       next: (sorteos) => {
            this.sorteosProximos = sorteos;
            this.pickNextSorteo();
       },
  error: (error) => {
    console.error('Error al cargar sorteos próximos:', error);
  }
});

    // Suscribirse a las estadísticas
    this.sorteoService.estadisticas$.subscribe({
      next: (estadisticas) => {
        this.estadisticas = estadisticas;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });

    this.sorteoService.getSorteosPorEstado('activo').subscribe(sorteos => {
            this.sorteosActivos = sorteos;
        });

        this.sorteoService.getSorteosPorEstado('proximo').subscribe(sorteos => {
            this.sorteosProximos = sorteos;
        });

        this.sorteoService.estadisticas$.subscribe(estadisticas => {
            this.estadisticas = estadisticas;
        });
  }

  loadUserData(){
    this.userService.LoadUserData(this.userId).subscribe({
      next: (user) => {
        this.user = user.data.user;
        console.log('user', this.user);
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
      }
    });


 console.log('userdata', this.user);
  }

  // Método para jugar un sorteo
  jugarSorteo(id: number): void {
    // this.sorteoService.jugarSorteo(id);
    console.log(`Intentando jugar el sorteo con ID: ${id}`);
     this.router.navigate(['juego'], { 
        queryParams: { raffleId: id }  
    });
  }

  // Método para notificar un sorteo
  notificarSorteo(id: number): void {
    this.sorteoService.notificarSorteo(id);
  }
    //  private loadSummary(): void {
    //         this.accountService.getSummary((this.userId))
    //             .pipe(takeUntil(this.destroy$))
    //             .subscribe({
    //                 next: (resp) => {
    //                     console.log('📊 Resumen de cuenta:', resp);
    //                     if (resp.success && resp.data) {
    //                         this.summary = resp.data;
    //                         // this.currencies = resp.data.currencies;
    //                         this.vias = resp.data.vias;
    //                          this.withdrawalRequests = resp.data.withdrawal_requests;
    
    //                         // Convertir balances a array
    //                         this.balances = Object.values(resp.data.balances || {});
    
    //                         // Si hay balances y no hay moneda seleccionada, usar la primera
    //                         if (this.balances.length > 0 && !this.selectedCurrency) {
    //                             this.selectedCurrency = this.balances[0].currency_id;
    //                         }
    
    //                         // Actualizar balance actual
    //                         this.updateCurrentBalance();
    
    //                         // Cargar transacciones del balance actual
    //                         this.filters.currency_id = this.selectedCurrency;
    //                         // this.loadTransactions();
    
    //                         console.log('✅ Resumen cargado:', this.summary);
    //                     }
    //                     this.loading = false;
    //                 },
    //                 error: (err) => {
    //                     console.error('❌ Error al cargar resumen:', err);
    //                     this.loading = false;
    
    //                     Swal.fire({
    //                         icon: 'error',
    //                         title: 'Error',
    //                         text: 'No se pudo cargar la información de la cuenta',
    //                         confirmButtonColor: '#176585'
    //                     });
    //                 }
    //             });
    //     }
/** Elige el próximo sorteo (el primero cuya fecha sea futura) y arranca el countdown */
pickNextSorteo(): void {
  const futuros = this.sorteosProximos
    .filter(s => s.fechaInicio)
    .map(s => ({ sorteo: s, fecha: new Date(s.fechaInicio!) }))
    .filter(x => !isNaN(x.fecha.getTime()) && x.fecha.getTime() > Date.now())
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  if (futuros.length > 0) {
    this.nextSorteo = futuros[0].sorteo;
    this.startCountdown(futuros[0].fecha);
  } else {
    this.nextSorteo = null;
    this.nextRaffleDate = null;
    this.countdownSub?.unsubscribe();
  }
}

/** Arranca el tick de 1 segundo */
startCountdown(target: Date): void {
  this.nextRaffleDate = target;
  this.isStarting = false;
  this.updateCountdown();

  this.countdownSub?.unsubscribe();
  this.countdownSub = interval(1000)
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => this.updateCountdown());
}

/** Recalcula días/horas/min/seg */
updateCountdown(): void {
  if (!this.nextRaffleDate) return;

  const diff = this.nextRaffleDate.getTime() - Date.now();

  if (diff <= 0) {
    this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    this.isStarting = true;
    this.countdownSub?.unsubscribe();
    return;
  }

  const totalSec = Math.floor(diff / 1000);
  this.countdown = {
    days:    Math.floor(totalSec / 86400),
    hours:   Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  };
}

/** Formatea a 2 dígitos */
pad(n: number): string {
  return n.toString().padStart(2, '0');
}

getTotalBalance(){

   this.accountService.getTotals(this.userId, this.currency_id).subscribe({
      next: (total) => {
        console.log('total', total);
        const totals = total as unknown as { debits: number; credits: number };
        this.totalDebits = total?.data?.debits ?? 0;
        this.totalCredits = total?.data?.credits ?? 0;
        console.log('totalCredits', this.totalCredits);
        console.log('totalDebits', this.totalDebits);
      },
      error: (error) => {
        console.error('Error al cargar usuario:', error);
      }
    });
}

ngOnDestroy(): void {
        this.countdownSub?.unsubscribe();   // 👈 añade esto
        this.destroy$.next();
        this.destroy$.complete();
    }
    private updateCurrentBalance(): void {
        this.currentBalance = this.balances.find(
            b => b.currency_id === this.selectedCurrency
        ) || null;
    }


  }


  




