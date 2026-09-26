import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';

import { RaffleService } from '../../services/raffle.service';
import { ValidadoresService } from '../../services/validadores.service';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/get-groups-response';
import { GroupfichasService } from '../../services/groupfichas.service';
import { UserService } from '../../services/user.service';
import { PublicityComponent } from '../../components/publicity/publicity.component';
import { PipesModule } from '../../pipes/pipes.module';

/* ============================================
   INTERFACES
   ============================================ */
export interface UserLevel {
  id: number;
  name: string;
  icon: string;
  color: string;
  maxRaffles: number;
  maxAmount: number;
  maxRetentionPercent: number;
  canCreatePrivate: boolean;
  canUseAuto: boolean;
  canUseCustomFichas: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  icon: string;
  color: string;
  max_raffles_active: number;
  max_amount: number;
  max_retention_percent: number;
  can_create_private: boolean;
  can_use_auto_type: boolean;
  can_use_custom_fichas: boolean;
  min_games_played: number;
  min_days_registered: number;
  min_wins: number;
}

@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.css'],
  standalone: true,
  imports: [CommonModule, 
            PublicityComponent, 
            ReactiveFormsModule, 
            PipesModule]
})
export class RaffleComponent implements OnInit, OnDestroy {

  /* ============================================
     ESTADO
     ============================================ */
  forma_Raffle!: FormGroup;
  showDebugInfo = false;
  loading = false;
  guardando = false;

  // Nivel del usuario
  userLevel: UserLevel | null = null;
  userLevelConfig: LevelConfig | null = null;
  userStats: any = null;
  userId: number =0;

  // Datos
  grupos: Group[] = [];
  grupofichas: any;
  grupofichaSeleccionada: string | null = null;
  grupofichaSeleccionadaInfo: any = null;

  // Cálculos automáticos
  totalCalculado = 0;
  retencionCalculada = 0;
  retencionAdminCalculada = 0;

  private destroy$ = new Subject<void>();

  /* ============================================
     CONFIGURACIÓN DE NIVELES
     ============================================ */
  readonly niveles: LevelConfig[] = [
    {
      id: 1, name: 'Novato', icon: 'fa-seedling', color: '#909090',
      max_raffles_active: 0, max_amount: 0, max_retention_percent: 0,
      can_create_private: false, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 0, min_days_registered: 0, min_wins: 0
    },
    {
      id: 2, name: 'Jugador', icon: 'fa-star', color: '#3a7ebf',
      max_raffles_active: 1, max_amount: 100, max_retention_percent: 5,
      can_create_private: false, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 50, min_days_registered: 30, min_wins: 0
    },
    {
      id: 3, name: 'Avanzado', icon: 'fa-fire', color: '#f39c12',
      max_raffles_active: 3, max_amount: 500, max_retention_percent: 10,
      can_create_private: true, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 200, min_days_registered: 90, min_wins: 10
    },
    {
      id: 4, name: 'Élite', icon: 'fa-gem', color: '#00e676',
      max_raffles_active: 5, max_amount: 2000, max_retention_percent: 15,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 500, min_days_registered: 180, min_wins: 30
    },
    {
      id: 5, name: 'VIP', icon: 'fa-crown', color: '#ffd700',
      max_raffles_active: 10, max_amount: 10000, max_retention_percent: 20,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 1000, min_days_registered: 365, min_wins: 100
    },
    {
      id: 6, name: 'Admin', icon: 'fa-user-shield', color: '#ff4757',
      max_raffles_active: 999, max_amount: 999999, max_retention_percent: 100,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 0, min_days_registered: 0, min_wins: 0
    }
  ];

  /* ============================================
     LISTAS PARA SELECTS
     ============================================ */
  ListaYesNo = [
    { id: 0, name: 'NO' },
    { id: 1, name: 'SI' }
  ];

  listaPublicPrivate = [
    { id: 0, name: 'Público', icon: 'fa-globe' },
    { id: 1, name: 'Privado', icon: 'fa-lock' }
  ];

  listaRaffleType = [
    { id: 0, name: 'Automático', icon: 'fa-robot' },
    { id: 1, name: 'Manual', icon: 'fa-hand-pointer' }
  ];

  listaPercent = Array.from({ length: 21 }, (_, i) => ({ id: i, name: `${i}` }));

  listaPercent2 = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    .map(v => ({ id: v, name: `${v}` }));

  date = new Date();

  /* ============================================
     CONSTRUCTOR
     ============================================ */
  constructor(
    private fb: FormBuilder,
    private raffleService: RaffleService,
    private validadores: ValidadoresService,
    private groupService: GroupService,
    private groupFichas: GroupfichasService,
    private userService: UserService
  ) {
    this.crearFormulario();
    this.crearListeners();
  }




  
  /* ============================================
     LIFECYCLE
     ============================================ */
  ngOnInit(): void {
    this.cargarNivelUsuario();
    this.cargarGrupos();
    this.cargarFichas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ============================================
     CREACIÓN DEL FORMULARIO
     ============================================ */
  private crearFormulario(): void {
    const fechaFormateada = this.formatearFecha(this.date);

    this.forma_Raffle = this.fb.group({
      nombre: [`Sorteo ${fechaFormateada}`, [Validators.required, Validators.minLength(5)]],
      description: [`Sorteo del ${fechaFormateada}`, [Validators.required, Validators.minLength(10)]],
      grupo: ['', [Validators.required]],
      total_amount: [{ value: 0, disabled: true }, [Validators.min(0)]],
      card_amount: [1, [Validators.required, Validators.min(0.01)]],
      minimun_play: [10, [Validators.min(1)]],
      maximun_play: [10000, [Validators.min(1)]],
      maximun_user_play: [10000, [Validators.min(1)]],
      retention_percent: [0, [Validators.min(0), Validators.max(20)]],
      retention_amount: [{ value: 0, disabled: true }],
      admin_retention_percent: [10, [Validators.min(0), Validators.max(20)]],
      admin_retention_amount: [{ value: 0, disabled: true }],
      raffle_type: [1, [Validators.required]],
      privacy: [1, [Validators.required]],
      reward_line: [1, [Validators.required]],
      percent_line: [40, [Validators.min(0), Validators.max(100)]],
      reward_full: [1, [Validators.required]],
      percent_full: [0, [Validators.min(0), Validators.max(100)]],
      scheduled_date: [this.date, [Validators.required]],
      scheduled_hour: ['', [Validators.required]],
      time_zone: ['chile'],
      start_date: [''],
      start_hour: [''],
      end_date: [''],
      end_hour: [''],
      grupoficha: ['']
    }, {
      validators: [
        this.validadores.sumaPorcentajes('percent_line', 'percent_full'),
        this.validarRangoJugadas.bind(this),
        this.validarLimitesPorNivel.bind(this)
      ]
    });
  }

  /* ============================================
     VALIDADORES PERSONALIZADOS
     ============================================ */
  private validarRangoJugadas(group: AbstractControl): ValidationErrors | null {
    const min = group.get('minimun_play')?.value;
    const max = group.get('maximun_play')?.value;
    if (min != null && max != null && Number(min) > Number(max)) {
      return { rangoJugadasInvalido: true };
    }
    return null;
  }

  private validarLimitesPorNivel(group: AbstractControl): ValidationErrors | null {
    if (!this.userLevelConfig) return null;

    const total = Number(group.get('total_amount')?.value) || 0;
    const retencion = Number(group.get('retention_percent')?.value) || 0;
    const privacy = Number(group.get('privacy')?.value);
    const tipo = Number(group.get('raffle_type')?.value);

    const errores: ValidationErrors = {};

    if (total > this.userLevelConfig.max_amount) {
      errores['montoExcedeNivel'] = {
        max: this.userLevelConfig.max_amount,
        actual: total
      };
    }

    if (retencion > this.userLevelConfig.max_retention_percent) {
      errores['retencionExcedeNivel'] = {
        max: this.userLevelConfig.max_retention_percent,
        actual: retencion
      };
    }

    if (privacy === 1 && !this.userLevelConfig.can_create_private) {
      errores['privacidadNoPermitida'] = true;
    }

    if (tipo === 0 && !this.userLevelConfig.can_use_auto_type) {
      errores['tipoAutoNoPermitido'] = true;
    }

    return Object.keys(errores).length > 0 ? errores : null;
  }

  /* ============================================
     LISTENERS
     ============================================ */
  private crearListeners(): void {
    // Calcular total_amount automáticamente
    this.forma_Raffle.valueChanges
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.recalcularMontos());

    // Listener específico para card_amount y maximun_play
    ['card_amount', 'maximun_play', 'retention_percent', 'admin_retention_percent']
      .forEach(ctrl => {
        this.forma_Raffle.get(ctrl)?.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => this.recalcularMontos());
      });

    // Deshabilitar percent_line si reward_line es 0
    this.forma_Raffle.get('reward_line')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: number) => {
        const ctrl = this.forma_Raffle.get('percent_line');
        if (Number(value) === 0) {
          ctrl?.disable({ emitEvent: false });
        } else {
          ctrl?.enable({ emitEvent: false });
        }
      });
  }

  /* ============================================
     CÁLCULOS AUTOMÁTICOS
     ============================================ */
  private recalcularMontos(): void {
    const cardAmount = Number(this.forma_Raffle.get('card_amount')?.value) || 0;
    const maxPlay = Number(this.forma_Raffle.get('maximun_play')?.value) || 0;
    const retPercent = Number(this.forma_Raffle.get('retention_percent')?.value) || 0;
    const adminPercent = Number(this.forma_Raffle.get('admin_retention_percent')?.value) || 0;

    const total = cardAmount * maxPlay;
    const retencion = total * (retPercent / 100);
    const retencionAdmin = total * (adminPercent / 100);

    this.totalCalculado = total;
    this.retencionCalculada = retencion;
    this.retencionAdminCalculada = retencionAdmin;

    this.forma_Raffle.patchValue({
      total_amount: total.toFixed(2),
      retention_amount: retencion.toFixed(2),
      admin_retention_amount: retencionAdmin.toFixed(2)
    }, { emitEvent: false });
  }

  /* ============================================
     CARGA DE DATOS
     ============================================ */
  private cargarNivelUsuario(): void {
    // TODO: reemplazar con endpoint real: this.userService.getUserLevel()
  this.userService.getUserLevel(this.userId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp: any) => {
        const lvl = resp.level;
        this.userLevelConfig = {
          id: lvl.id,
          name: lvl.name,
          icon: lvl.icon,
          color: lvl.color,
          max_raffles_active: lvl.max_raffles_active,
          max_amount: lvl.max_amount,
          max_retention_percent: lvl.max_retention_percent,
          can_create_private: lvl.can_create_private,
          can_use_auto_type: lvl.can_use_auto_type,
          can_use_custom_fichas: lvl.can_use_custom_fichas,
          min_games_played: 0,
          min_days_registered: 0,
          min_wins: 0
        };
        this.userLevel = {
          id: lvl.id,
          name: lvl.name,
          icon: lvl.icon,
          color: lvl.color,
          maxRaffles: lvl.max_raffles_active,
          maxAmount: lvl.max_amount,
          maxRetentionPercent: lvl.max_retention_percent,
          canCreatePrivate: lvl.can_create_private,
          canUseAuto: lvl.can_use_auto_type,
          canUseCustomFichas: lvl.can_use_custom_fichas
        };
        this.userStats = resp.stats;
      },
      error: (err) => {
        console.error('Error al cargar nivel:', err);
        // Fallback: nivel 1 (Novato) para no romper la UI
        const config = this.niveles.find(n => n.id === 1)!;
        this.userLevelConfig = config;
        this.userLevel = {
          id: config.id, name: config.name, icon: config.icon, color: config.color,
          maxRaffles: config.max_raffles_active, maxAmount: config.max_amount,
          maxRetentionPercent: config.max_retention_percent,
          canCreatePrivate: config.can_create_private,
          canUseAuto: config.can_use_auto_type,
          canUseCustomFichas: config.can_use_custom_fichas
        };
      }
    });

  }

   
  private cargarGrupos(): void {
    this.userService.getGroups('1')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.grupos = resp.Group || [];
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar los grupos'
          });
        }
      });
  }

  private cargarFichas(): void {
    this.groupFichas.getGroupFichas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => { this.grupofichas = resp; },
        error: () => { /* silencioso */ }
      });
  }

  /* ============================================
     SELECCIÓN DE FICHA
     ============================================ */
  AddGrupofichas(gf: any): void {
    if (!this.userLevelConfig?.can_use_custom_fichas) {
      Swal.fire({
        icon: 'warning',
        title: 'Nivel insuficiente',
        text: `Necesitas nivel Élite o superior para usar fichas personalizadas. Tu nivel: ${this.userLevel?.name}`
      });
      return;
    }

    this.grupofichaSeleccionada = gf.groupfichas_id;
    this.grupofichaSeleccionadaInfo = gf;
    this.forma_Raffle.patchValue({ grupoficha: gf.groupfichas_id });
  }

  isFichaSeleccionada(gf: any): boolean {
    return this.grupofichaSeleccionada === gf.groupfichas_id;
  }

  /* ============================================
     HELPERS
     ============================================ */
  private formatearFecha(d: Date): string {
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }

  toggleDebugInfo(): void {
    this.showDebugInfo = !this.showDebugInfo;
  }

  get puedeCrearSorteo(): boolean {
    if (!this.userLevelConfig) return false;
    return this.userLevelConfig.max_raffles_active > 0;
  }

  get limiteAlcanzado(): boolean {
    if (!this.userLevelConfig || !this.userStats) return false;
    return (this.userStats.active_raffles || 0) >= this.userLevelConfig.max_raffles_active;
  }

  /* ============================================
     GETTERS DE VALIDACIÓN
     ============================================ */
  private esInvalido(campo: string): boolean {
    const c = this.forma_Raffle.get(campo);
    return !!(c?.invalid && c?.touched);
  }

  get nombreNoValido() { return this.esInvalido('nombre'); }
  get descriptionNoValido() { return this.esInvalido('description'); }
  get grupoNoValido() { return this.esInvalido('grupo'); }
  get totalAmountNoValido() { return this.esInvalido('total_amount'); }
  get cardAmountNoValido() { return this.esInvalido('card_amount'); }
  get minimunPlayNoValido() { return this.esInvalido('minimun_play'); }
  get maximunPlayNoValido() { return this.esInvalido('maximun_play'); }
  get maximunUserPlayNoValido() { return this.esInvalido('maximun_user_play'); }
  get retentionPercentNoValido() { return this.esInvalido('retention_percent'); }
  get retentionAmountNoValido() { return this.esInvalido('retention_amount'); }
  get adminRetentionPercentNoValido() { return this.esInvalido('admin_retention_percent'); }
  get adminRetentionAmountNoValido() { return this.esInvalido('admin_retention_amount'); }
  get raffleTypeNoValido() { return this.esInvalido('raffle_type'); }
  get privacyNoValido() { return this.esInvalido('privacy'); }
  get rewardLineNoValido() { return this.esInvalido('reward_line'); }
  get percentLineNoValido() { return this.esInvalido('percent_line'); }
  get rewardFullNoValido() { return this.esInvalido('reward_full'); }
  get percentFullNoValido() { return this.esInvalido('percent_full'); }
  get startDateNoValido() { return this.esInvalido('start_date'); }
  get startHourNoValido() { return this.esInvalido('start_hour'); }
  get scheduledDateNoValido() { return this.esInvalido('scheduled_date'); }
  get scheduledHourNoValido() { return this.esInvalido('scheduled_hour'); }
  get endDateNoValido() { return this.esInvalido('end_date'); }
  get endHourNoValido() { return this.esInvalido('end_hour'); }
  get grupofichasNoValido() { return this.esInvalido('grupoficha'); }

  get erroresDeNivel(): string[] {
    const errores = this.forma_Raffle.errors || {};
    const msgs: string[] = [];
    if (errores['montoExcedeNivel']) {
      msgs.push(`El monto total excede tu límite de $${errores['montoExcedeNivel'].max}`);
    }
    if (errores['retencionExcedeNivel']) {
      msgs.push(`La retención excede tu límite de ${errores['retencionExcedeNivel'].max}%`);
    }
    if (errores['privacidadNoPermitida']) {
      msgs.push('Tu nivel no permite crear sorteos privados');
    }
    if (errores['tipoAutoNoPermitido']) {
      msgs.push('Tu nivel no permite sorteos automáticos');
    }
    if (errores['rangoJugadasInvalido']) {
      msgs.push('El mínimo de jugadas no puede superar el máximo');
    }
    return msgs;
  }

  /* ============================================
     ACCIONES
     ============================================ */
  limpiarFormulario(): void {
    Swal.fire({
      title: '¿Limpiar formulario?',
      text: 'Se perderán todos los datos ingresados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ff4757'
    }).then((result) => {
      if (result.isConfirmed) {
        this.forma_Raffle.reset({
          nombre: `Sorteo ${this.formatearFecha(this.date)}`,
          description: `Sorteo del ${this.formatearFecha(this.date)}`,
          card_amount: 1,
          minimun_play: 10,
          maximun_play: 10000,
          maximun_user_play: 10000,
          retention_percent: 0,
          admin_retention_percent: 10,
          raffle_type: 1,
          privacy: 1,
          reward_line: 1,
          percent_line: 40,
          reward_full: 1,
          percent_full: 0,
          time_zone: 'chile'
        });
        this.grupofichaSeleccionada = null;
        this.grupofichaSeleccionadaInfo = null;
      }
    });
  }

  guardar(): void {
    if (this.forma_Raffle.invalid || this.limiteAlcanzado) {
      Object.values(this.forma_Raffle.controls).forEach(c => c.markAsTouched());
      if (this.limiteAlcanzado) {
        Swal.fire({
          icon: 'warning',
          title: 'Límite alcanzado',
          text: `Tu nivel ${this.userLevel?.name} permite máximo ${this.userLevel?.maxRaffles} sorteos activos`
        });
      }
      return;
    }

    this.guardando = true;
    const ruta = this.construirRuta();

    this.raffleService.putRaffle(ruta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: any) => {
          this.guardando = false;
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: '¡Sorteo creado!',
            text: resp?.message || 'El sorteo se creó correctamente'
          });
          this.limpiarFormulario();
        },
        error: (err) => {
          this.guardando = false;
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'No se pudo crear el sorteo'
          });
        }
      });
  }

  private construirRuta(): string {
    const v = this.forma_Raffle.getRawValue();
    return [
      v.admin_retention_amount,
      v.admin_retention_percent,
      v.card_amount,
      encodeURIComponent(v.description),
      v.grupo,
      v.maximun_play,
      v.maximun_user_play,
      v.minimun_play,
      encodeURIComponent(v.nombre),
      v.percent_full,
      v.percent_line,
      v.privacy,
      v.raffle_type,
      v.retention_amount,
      v.retention_percent,
      v.reward_full,
      v.reward_line,
      v.scheduled_date,
      v.scheduled_hour,
      v.time_zone,
      this.grupofichaSeleccionada ?? '',
      '1'
    ].join('/');
  }

  trackByIndex(index: number): number { return index; }
  trackByGroupId(_: number, item: any): any { return item.id; }
  trackByFicha(_: number, item: any): any { return item.groupfichas_id; }
} 