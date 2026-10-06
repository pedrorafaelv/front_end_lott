import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import Swal from 'sweetalert2';
import { RaffleService } from '../../services/raffle.service';
import { ValidadoresService } from '../../services/validadores.service';
import { Group } from '../../interfaces/get-groups-response';
import { GroupfichasService } from '../../services/groupfichas.service';
import { UserService } from '../../services/user.service';
import { PublicityComponent } from '../../components/publicity/publicity.component';
import { PipesModule } from '../../pipes/pipes.module';
import { AuthService } from '../../services/auth.service';
import { LotteryNameService } from '../../services/lotery-name.services';
import { LevelConfig, UserLevel, niveles } from '../../interfaces/level';
import { Raffle} from '../../interfaces/get-last-user-raffle-response';


@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.css'],
  standalone: true,
  imports: [CommonModule,
    PublicityComponent,
    ReactiveFormsModule,
    PipesModule,
  ]
})
export class RaffleComponent implements OnInit, OnDestroy {
  /* ============================================
     ESTADO
     ============================================ */
  forma_Raffle!: FormGroup;
  showDebugInfo = false;
  loading = false;
  guardando = false;
   minDate: string = '';


  // Nivel del usuario
  userLevel: UserLevel | null = null;
  userLevelConfig: LevelConfig | null = null;
  userStats: any = null;
  userId: number =0;
  niveles: LevelConfig[]=niveles

  // Datos
  grupos: Group[] = [];
  grupofichas: any;
  grupofichaSeleccionada: string | null = null;
  grupofichaSeleccionadaInfo: any = null;

  // Cálculos automáticos
  totalCalculado = 0;
  retencionCalculada = 0;
  retencionAdminCalculada = 0;
  percentFullCalculado = 0;

  private destroy$ = new Subject<void>();

  /* ============================================
     LISTAS PARA SELECTS
     ============================================ */
  ListaYesNo = [
    { id: 0, name: 'NO' },
    { id: 1, name: 'SI' }
  ];

  listaPublicPrivate = [
    { id: 0, name: 'Público', icon: 'fa-globe' },
    { id: 1, name: 'Privado', icon: 'fa-lock' },
  ];

  listaRaffleType = [
    { id: 0, name: 'Automático', icon: 'fa-robot' },
    { id: 1, name: 'Manual', icon: 'fa-hand-pointer' }
  ];

  listaPercent = Array.from({ length: 21 }, (_, i) => ({ id: i, name: `${i}` }));

  listaPercent2 = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,100]
    .map(v => ({ id: v, name: `${v}` }));

  date = new Date();
   buscarTexto: string = '';
  hasError: boolean =false;
  message: string= "";
  raffle: Raffle|null = null;


  /* ============================================
     CONSTRUCTOR
     ============================================ */
  constructor(
    private fb: FormBuilder,
    private raffleService: RaffleService,
    private validadores: ValidadoresService,
    private groupFichasService: GroupfichasService,
    private userService: UserService,
    private authService: AuthService,
    private lotteryNameService:LotteryNameService,
  ) {
    this.crearFormulario();
    this.crearListeners();
  }

  /* ============================================
     LIFECYCLE
     ============================================ */
  ngOnInit(): void {
    this.userId = Number(this.authService.getUserId());
    this.generarNombreAleatorio();
    this.cargarNivelUsuario();
    this.cargarGrupos();
    this.cargarFichas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private generarNombreAleatorio(): void {
    const nombreBase = this.lotteryNameService.getRandomName(this.userId);
    const nombre = `${nombreBase} - ${this.formatearFecha(this.date)}`;

    this.forma_Raffle.patchValue({ nombre }, { emitEvent: false });
    // this.forma_Raffle.patchValue({ description }, { emitEvent: false });
  }

  public regenerarNombre(): void {
    this.generarNombreAleatorio();
  }

  /* ============================================
     CREACIÓN DEL FORMULARIO
     ============================================ */
  private crearFormulario(): void {
    const fechaFormateada = this.formatearFecha(this.date);

    this.forma_Raffle = this.fb.group({
      nombre: [` ${fechaFormateada}`, [Validators.required, Validators.minLength(5)]],
      description: [` ${fechaFormateada}`, [Validators.required, Validators.minLength(10)]],
      grupo: ['', [Validators.required]],
      total_amount: [{ value: 0, disabled: true }, [Validators.min(0)]],
      card_amount: [1, [Validators.required, Validators.min(0.10)]],
      minimun_play: [10, [Validators.min(1)]],
      maximun_play: [10000, [Validators.min(1)]],
      maximun_user_play: [10000, [Validators.min(1)]],
      retention_percent: [5, [Validators.min(0), Validators.max(20)]],
      retention_amount: [{ value: 0, disabled: true }],
      admin_retention_percent: [10, [Validators.min(0), Validators.max(20)]],
      admin_retention_amount: [{ value: 0, disabled: true }],
      raffle_type: [1, [Validators.required]],
      privacy: [0, [Validators.required]],
      reward_line: [1, [Validators.required]],
      percent_line: [10, [Validators.min(0), Validators.max(100)]],
      reward_full: [1, [Validators.required]],
      percent_full: [90, [Validators.min(0), Validators.max(100)]],
      scheduled_date: [this.minDate, [Validators.required, this.fechaNoPasada.bind(this)]],
      scheduled_hour: ['', [Validators.required]],
      time_zone: ['chile'],
      start_date: [this.minDate, [this.fechaNoPasada.bind(this)]],
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
    ['card_amount', 'maximun_play', 'retention_percent', 'admin_retention_percent', 'percent_line']
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
    const percentLine = Number(this.forma_Raffle.get('percent_line')?.value||0);

    const total = cardAmount * maxPlay;
    const retencion = total * (retPercent / 100);
    const retencionAdmin = total * (adminPercent / 100);
    const percentFull = 100-percentLine;

    this.totalCalculado = total;
    this.retencionCalculada = retencion;
    this.retencionAdminCalculada = retencionAdmin;
    this.percentFullCalculado = percentFull;

    this.forma_Raffle.patchValue({
      total_amount: total.toFixed(2),
      retention_amount: retencion.toFixed(2),
      admin_retention_amount: retencionAdmin.toFixed(2),
      percent_full:percentFull.toFixed(0),
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
        console.log('userlevel', resp.data.level);
        const lvl = resp.data.level;
        console.log('lvl',lvl);
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
  this.userService.getGroups((this.userId).toString())
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        this.grupos = resp.Group || [];

        // 👇 preseleccionar el primero si existe
        if (this.grupos.length > 0 && !this.forma_Raffle.get('grupo')?.value) {
          this.forma_Raffle.patchValue(
            { grupo: this.grupos[0].id },
            { emitEvent: false }
          );
        }
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
  this.groupFichasService.getGroupFichas()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        console.log(resp.data.groupfichas);
        this.grupofichas = resp.data.groupfichas;

        // 👇 preseleccionar el primero si existe
        const lista = this.grupofichas || [];
        if (lista.length > 0 && !this.forma_Raffle.get('grupoficha')?.value) {
          const primera = lista[0];
          this.forma_Raffle.patchValue(
            { grupoficha: primera.id },
            { emitEvent: false }
          );
          // si quieres que quede reflejado también en tu variable de selección:
          this.grupofichaSeleccionada = primera.id;
          this.grupofichaSeleccionadaInfo = primera;
        }
      },
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
  get grupoNoValido() { return this.esInvalido('grupoFicha'); }
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
          nombre: `${this.lotteryNameService.getRandomName(this.userId)}`,
          description: `${this.lotteryNameService.getRandomName(this.userId)}`,
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


  trackByIndex(index: number): number { return index; }
  trackByGroupId(_: number, item: any): any { return item.id; }
  trackByFicha(_: number, item: any): any { return item.groupfichas_id; }

   /* ============================================
     FECHAS
     ============================================ */
private formatearFechaISO(d: Date): string {
  const anio = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`; // formato que <input type="date"> entiende
}

 // Validador: rechaza fechas anteriores a hoy (por si el usuario la escribe manualmente,
// ya que el atributo "min" del input no bloquea el tecleo directo en todos los navegadores)
private fechaNoPasada(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;
  const hoy = this.formatearFechaISO(new Date());
  return control.value < hoy ? { fechaPasada: true } : null;
}


// Reemplaza el método construirRuta original
private construirCuerpo(): any {
  const v = this.forma_Raffle.getRawValue();
  return {
    admin_retention_amount: v.admin_retention_amount,
    admin_retention_percent: v.admin_retention_percent,
    card_amount: v.card_amount,
    description: v.description, // Ya no necesitas encodeURIComponent
    grupo: v.grupo,
    maximun_play: v.maximun_play,
    maximun_user_play: v.maximun_user_play,
    minimun_play: v.minimun_play,
    nombre: v.nombre, // Ya no necesitas encodeURIComponent
    percent_full: v.percent_full,
    percent_line: v.percent_line,
    privacy: v.privacy,
    raffle_type: v.raffle_type,
    retention_amount: v.retention_amount,
    retention_percent: v.retention_percent,
    reward_full: v.reward_full,
    reward_line: v.reward_line,
    scheduled_date: v.scheduled_date,
    scheduled_hour: v.scheduled_hour,
    time_zone: v.time_zone,
    grupoficha: this.grupofichaSeleccionada ?? '',
    // '1' // El significado de este campo debe determinarse según la lógica del backend
  };
}

// Modifica la llamada en el método guardar
guardar(): void {
  // ... La lógica de validación previa se mantiene igual ...
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
  const cuerpo = this.construirCuerpo();

  // Suponiendo que el método del servicio ya fue cambiado para aceptar el cuerpo
  this.raffleService.postRaffle(cuerpo) 
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp: any) => {
        // ... El manejo de éxito se mantiene igual ...
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
        // ... El manejo de error se mantiene igual ...
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

 duplicarUltimo(): void {
  console.log('duplicarUltimo' );
  this.loadLastRaffle();  
 }

 
loadLastRaffle(): void {
  this.loading = true;
  this.hasError = false;

  this.raffleService.getLastUserRaffle(this.userId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        this.loading = false;
        this.message = resp.message;

        if (resp.success && resp.data?.raffle) {
          this.raffle = resp.data.raffle;
          this.cargarRaffleEnFormulario(this.raffle);
        } else {
          this.raffle = null;
          this.hasError = false;
          Swal.fire({
            icon: 'info',
            title: 'Sin sorteos',
            text: resp.message || 'No hay sorteos previos para duplicar'
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.raffle = null;
        this.hasError = true;
        this.message = err?.error?.message || 'Error al conectar con el servidor';
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.message
        });
        console.error('Error getLastUserRaffle:', err);
      }
    });
}


 private cargarRaffleEnFormulario(raffle: Raffle): void {
  // Normalizar fechas para <input type="date"> (solo YYYY-MM-DD)
  const soloFecha = (valor: string | null): string => {
    if (!valor) return '';
    return valor.substring(0, 10); // "2026-10-04 01:08:43" -> "2026-10-04"
  };

  // Normalizar hora (HH:mm) desde un string tipo "15:35:02"
  const soloHora = (valor: string | null): string => {
    if (!valor) return '';
    return valor.substring(0, 5); // "15:35:02" -> "15:35"
  };

  // Nombre nuevo para no sobrescribir el original
  const nombreBase = raffle.name || this.lotteryNameService.getRandomName(this.userId);
  const nuevoNombre = `${nombreBase} (copia ${this.formatearFecha(new Date())})`;

  // Construir el patch con los nombres del FormGroup
  const patch: any = {
    nombre:               nuevoNombre,
    description:          raffle.description ?? '',
    grupo:                raffle.group_id ?? '',
    grupoficha:           raffle.groupficha_id ?? '',

    card_amount:          raffle.card_amount ?? 1,
    minimun_play:         raffle.minimun_play ?? 10,
    maximun_play:         raffle.maximun_play ?? 10000,
    maximun_user_play:    raffle.maximun_user_play ?? 10000,

    retention_percent:       raffle.retention_percent ?? 0,
    admin_retention_percent: raffle.admin_retention_percent ?? 10,

    raffle_type:   raffle.raffle_type ?? 1,
    privacy:       raffle.privacy ?? 0,
    reward_line:   raffle.reward_line ?? 1,
    percent_line:  raffle.percent_line ?? 10,
    reward_full:   raffle.reward_full ?? 1,

    scheduled_date: soloFecha(raffle.scheduled_date),
    scheduled_hour: soloHora(raffle.scheduled_hour),
    start_date:     soloFecha(raffle.start_date),
    start_hour:     soloHora(raffle.start_hour),
    end_date:       soloFecha(raffle.end_date),
    end_hour:       soloHora(raffle.end_hour),
    time_zone:      raffle.time_zone ?? 'chile',
  };

  // ⚠️ total_amount, retention_amount, admin_retention_amount y percent_full
  // están deshabilitados, pero igual los seteamos con emitEvent:false
  this.forma_Raffle.patchValue(patch, { emitEvent: false });

  // Ahora sí forzamos un recálculo para que los campos disabled se actualicen
  this.recalcularMontos();

  // Sincronizar variables externas
  this.grupofichaSeleccionada = raffle.groupficha_id != null ? String(raffle.groupficha_id) : null;
  this.grupofichaSeleccionadaInfo = null;

  // Si tienes el objeto completo de la ficha cargado, puedes buscarlo:
  // const lista = this.grupofichas?.GrupoInifichas || [];
  // this.grupofichaSeleccionadaInfo = lista.find((f: any) => f.id === raffle.groupficha_id) || null;

  Swal.fire({
    icon: 'success',
    title: 'Sorteo cargado',
    text: `Se cargó "${raffle.name}" en el formulario. Modifícalo y guarda como nuevo.`,
    timer: 2500,
    showConfirmButton: false
  });
}

 buscarSorteo(): void {
  const texto = (this.buscarTexto || '').trim();

  if (!texto) {
    Swal.fire({
      icon: 'warning',
      title: 'Búsqueda vacía',
      text: 'Escribe un ID o nombre de sorteo',
      timer: 2000,
      showConfirmButton: false
    });
    return;
  }

  this.loading = true;
  this.hasError = false;

  this.raffleService.searchRaffle(this.userId, texto)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (resp) => {
        this.loading = false;
        this.message = resp.message;

        if (resp.success && resp.data?.raffle) {
          this.raffle = resp.data.raffle;
          this.cargarRaffleEnFormulario(this.raffle);
          this.buscarTexto = '';
        } else {
          this.raffle = null;
          this.hasError = false;

          const titulo = resp.code === 'ERR-024' ? 'Sin permisos' : 'No encontrado';
          const icono  = resp.code === 'ERR-024' ? 'warning' : 'info';

          Swal.fire({
            icon: icono,
            title: titulo,
            text: resp.message,
            timer: 2500,
            showConfirmButton: false
          });
        }
      },
      error: (err) => {
        this.loading = false;
        this.raffle = null;
        this.hasError = true;
        this.message = err?.error?.message || 'Error al conectar con el servidor';
        Swal.fire({ icon: 'error', title: 'Error', text: this.message });
        console.error('Error searchRaffle:', err);
      }
    });
}
} 