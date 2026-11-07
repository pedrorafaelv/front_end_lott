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
import { Subject, takeUntil, interval, Subscription, timeout } from 'rxjs';
import {
    AccountSummary,
    AccountTransaction,
    Balance,
    Currency,
    TransactionFilters,
    Via,
    WithdrawalRequest,
} from '../../interfaces/account.interface';
import{getAvailablesRafflesResponse} from '../../interfaces/get-availables-raffles-response';
import{RaffleItem} from '../../models/raffle.model';


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
nextSorteo: RaffleItem | null = null;
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

usersOnLine: { id: number; name: string; last_seen_at: string }[] = [];
onlineCount = 0;
private onlinePolling?: any;
trackByUserId(_: number, u: any): any { return u.id; }
groupRaffles: RaffleItem[]  | undefined ;
publicRaffles: RaffleItem[] | undefined;
userRaffles:  RaffleItem[]  | undefined ;
futureRaffles: RaffleItem[] | undefined ;
nextRaffles: RaffleItem[] | undefined ;
nextRaffle: RaffleItem | undefined;


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
        //  console.log('userId = ', this.userId);
        this.user = this.userService.currentUser();
        // console.log('currentUser', this.user);
        this.loadUserData();
        setTimeout(() => this.getTotalBalance(), 1000);
        this.getAvailablesRaffles();
        // this.raffles= this.RaffleService.getDetailActiveRafflesByUser(this.userId)
        // .then((datos)=>{
        //       this.raffles= datos;
        //  })
        //   .catch((error)=>{console.log(error)});

     // Suscribirse a los sorteos en vivo
      // this.sorteoService.getSorteosEnVivo().subscribe({
      //   next: (sorteos) => {
      //     this.sorteosEnVivo = sorteos;
      //   },
      //   error: (error) => {
      //     console.error('Error al cargar sorteos en vivo:', error);
      //   }
      // });
              // this.pickNextSorteo();

      // Suscribirse a los sorteos próximos
      this.RaffleService.getSorteosProximos(this.userId).subscribe({
        next: (raffles) => {
          console.log('Sorteos próximos recibidos:', raffles.data?.['next_raffles']);
              this.nextRaffles = raffles.data?.next_raffles;
              console.log('nextRaffles', this.nextRaffles);
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

        // this.sorteoService.getSorteosPorEstado('activo').subscribe(sorteos => {
        //         this.sorteosActivos = sorteos;
        //     });

        this.sorteoService.getSorteosPorEstado('proximo').subscribe(sorteos => {
            this.sorteosProximos = sorteos;
        });

        // this.sorteoService.estadisticas$.subscribe(estadisticas => {
        //     this.estadisticas = estadisticas;
        // });
        this.loadOnlineUsers();
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
    
/** Elige el próximo sorteo (el primero cuya fecha sea futura) y arranca el countdown */
pickNextSorteo(): void {
  console.log('futuros', this.nextRaffles);
  const futuros = (this.nextRaffles ?? [])
  .filter(s => s.scheduled_date)
  .map(s => ({ raffle: s, fecha: new Date(s.scheduled_date!) }))
  .filter(x => !isNaN(x.fecha.getTime()) && x.fecha.getTime() > Date.now())
  .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());

  if (futuros.length > 0) {
    this.nextSorteo = futuros[0].raffle;
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


private updateCurrentBalance(): void {
    this.currentBalance = this.balances.find(
        b => b.currency_id === this.selectedCurrency
    ) || null;
}

loadOnlineUsers(): void {
    this.userService.getOnlineUsers({ window: 2, limit: 30 })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
              console.log ('loadOnlineUsers', resp);
                this.onlineCount     = resp.data?.count ?? 0;
                this.usersOnLine = resp.data?.users ?? [];
            },
            error: (err) => console.error('online users', err),
        });
  }
  
  getAvailablesRaffles(){
      this.RaffleService.getAvailablesRaffles(this.userId).subscribe({
        next:(resp)=>{
          console.log('availableRaffles = ',resp);
          this.publicRaffles = resp.data?.['public_raffles'];
          this.futureRaffles = resp.data?.futures_raffles;
          this.userRaffles = resp.data?.user_raffles;
          this.groupRaffles = resp.data?.group_raffles;
          this.nextRaffles = resp.data?.next_raffles;
          this.nextRaffle = resp.data?.next_raffle;
        }
      });
  }

  ngOnDestroy(): void {
        this.countdownSub?.unsubscribe();   // 👈 añade esto
        this.destroy$.next();
        this.destroy$.complete();
        if (this.onlinePolling) clearInterval(this.onlinePolling);   

  }


  }


  




