import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormGroup,
  ReactiveFormsModule,
  FormControl,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';

import { ValidadoresService } from '../../services/validadores.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/get-groups-response';
import { ComponentsModule } from '../../components/components.module';
import { PublicityComponent } from '../../components/publicity/publicity.component';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    PublicityComponent
  ],
})
export class GroupsComponent implements OnInit, OnDestroy {

  /* ============================================
     ESTADO
     ============================================ */
  forma!: FormGroup;
  loading = false;
  guardando = false;
  showDebugInfo = false;

  date = new Date();
  events: string[] = [];

  public userId!: string;
  public localId!: string;
  public user!: string;
  public usuario: any;

  private destroy$ = new Subject<void>();

  /* ============================================
     LISTAS
     ============================================ */
  ListaYesNo = [
    { id: '0', name: 'NO' },
    { id: '1', name: 'SI' }
  ];

  listaPublicPrivate = [
    { id: '0', name: 'Público', icon: 'fa-globe' },
    { id: '1', name: 'Privado', icon: 'fa-lock' }
  ];

  /* ============================================
     CONSTRUCTOR
     ============================================ */
  constructor(
    private fb: FormBuilder,
    private validadores: ValidadoresService,
    private authService: AuthService,
    private userService: UserService,
    private groupService: GroupService
  ) {
    this.crearFormulario();
    this.crearListeners();
  }

  /* ============================================
     LIFECYCLE
     ============================================ */
  ngOnInit(): void {
    this.localId = this.authService.getLocalId();
    if (this.localId) {
      this.getInfo();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ============================================
     FORMULARIO
     ============================================ */
  private crearFormulario(): void {
    this.forma = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      active: ['1', [Validators.required]],
      privacy: ['1', [Validators.required]],
      start_date: [this.formatDateForInput(this.date)],
      end_date: [this.formatDateForInput(this.date)],
      created_at: [this.date],
      updated_at: [this.date]
    }, {
      validators: this.validarFechas.bind(this)
    });

    this.cargarDataFormulario();
  }

  private validarFechas(group: AbstractControl): ValidationErrors | null {
    const start = group.get('start_date')?.value;
    const end = group.get('end_date')?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return { fechasInvalidas: true };
    }
    return null;
  }

  private crearListeners(): void {
    this.forma.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((valor) => {
        // console.log('Form value:', valor);
      });
  }

  private cargarDataFormulario(): void {
    this.forma.reset({
      name: '',
      description: '',
      active: '1',
      privacy: '1',
      start_date: this.formatDateForInput(this.date),
      end_date: this.formatDateForInput(this.date),
      created_at: this.date,
      updated_at: this.date
    });
  }

  private formatDateForInput(d: Date): string {
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${anio}-${mes}-${dia}`;
  }

  /* ============================================
     CARGA DE USUARIO
     ============================================ */
  async getInfo(): Promise<void> {
    try {
      const user$ = await this.userService.getByLocalId(this.localId);
      user$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (resp: any) => {
          this.usuario = resp;
          this.userId = resp?.user?.[0]?.id;
        },
        error: (err) => {
          console.error('Error al obtener usuario:', err);
        }
      });
    } catch (err) {
      console.error('Error en getInfo:', err);
    }
  }

  /* ============================================
     GETTERS DE VALIDACIÓN
     ============================================ */
  private esInvalido(campo: string): boolean {
    const c = this.forma.get(campo);
    return !!(c?.invalid && c?.touched);
  }

  get nameNoValido() { return this.esInvalido('name'); }
  get descriptionNoValido() { return this.esInvalido('description'); }
  get activeNoValido() { return this.esInvalido('active'); }
  get privacyNoValido() { return this.esInvalido('privacy'); }
  get startDateNoValido() { return this.esInvalido('start_date'); }
  get endDateNoValido() { return this.esInvalido('end_date'); }

  get fechasInvalidas(): boolean {
    return !!(this.forma.errors?.['fechasInvalidas'] && this.forma.touched);
  }

  get puedeGuardar(): boolean {
    return this.forma.valid && !this.guardando;
  }

  /* ============================================
     ACCIONES
     ============================================ */
  toggleDebugInfo(): void {
    this.showDebugInfo = !this.showDebugInfo;
  }

  limpiarFormulario(): void {
    Swal.fire({
      title: '¿Limpiar formulario?',
      text: 'Se perderán todos los datos ingresados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, limpiar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ff4757',
      background: '#1a1a2e',
      color: '#e8e8e8'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cargarDataFormulario();
        this.forma.markAsUntouched();
      }
    });
  }

  guardar(): void {
    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(ctrl => ctrl.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
      return;
    }

    this.guardando = true;

    const groupData = {
      ...this.forma.value,
      user_id: this.userId,
      user_admin: this.userId,
      active: this.forma.get('active')?.value === '1',
      privacy: this.forma.get('privacy')?.value
    };

    this.groupService.newGroup(groupData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.guardando = false;
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            title: '¡Grupo creado!',
            text: 'El grupo se creó correctamente',
            background: '#1a1a2e',
            color: '#e8e8e8',
            confirmButtonColor: '#ffd700'
          });
          this.cargarDataFormulario();
          this.forma.markAsUntouched();
        },
        error: (err) => {
          this.guardando = false;
          Swal.fire({
            allowOutsideClick: false,
            icon: 'error',
            title: 'Error',
            text: err?.error?.message || 'No se pudo crear el grupo',
            background: '#1a1a2e',
            color: '#e8e8e8',
            confirmButtonColor: '#ff4757'
          });
        }
      });
  }
}