import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { ValidadoresService } from '../../services/validadores.service';
import { TermsService } from '../../services/term-cond.service';
import { PublicVersionResponse } from '../../interfaces/get-public-version-response';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  private docs = signal<PublicVersionResponse[]>([]);
  termsVersion = signal<string>('');
  privacyVersion = signal<string>('');
  versionesListas = computed(() => this.docs().length === 2);

  forma!: FormGroup;
  cargando = false;
  errorMessage = '';
  year = new Date().getFullYear();

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private validadores: ValidadoresService,
    private router: Router,
    private termsService: TermsService
  ) {
    this.crearFormulario();
  }

  ngOnInit(): void {
    forkJoin([
      this.termsService.getPublicVersion('terms'),
      this.termsService.getPublicVersion('privacy'),
    ]).subscribe({
      next: ([t, p]) => {
        this.termsVersion.set(t.version);
        this.privacyVersion.set(p.version);
        this.docs.set([t, p]);
      },
      error: () => (this.errorMessage = 'No pudimos cargar los términos. Inténtalo más tarde.'),
    });
  }

  crearFormulario(): void {
    this.forma = this.fb.group({
      usuario: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      correo: ['', [Validators.required, Validators.email]],
      pass1: ['', [Validators.required, Validators.minLength(8)]],
      pass2: ['', [Validators.required]],
      terminos: [false, [Validators.requiredTrue]]
    }, {
      validators: this.validadores.passwordsIguales('pass1', 'pass2')
    });
  }

  get usuarioNoValido(): boolean {
    const c = this.forma.get('usuario');
    return !!c && c.invalid && c.touched;
  }
  get correoNoValido(): boolean {
    const c = this.forma.get('correo');
    return !!c && c.invalid && c.touched;
  }
  get pass1NoValido(): boolean {
    const c = this.forma.get('pass1');
    return !!c && c.invalid && c.touched;
  }
  get pass2NoValido(): boolean {
    const c = this.forma.get('pass2');
    if (!c?.touched) return false;
    return this.forma.get('pass1')?.value !== c.value;
  }

  guardar(): void {
    if (this.forma.invalid || !this.versionesListas()) {
      Object.values(this.forma.controls).forEach(c => c.markAsTouched());
      return;
    }
    this.crearUsuario();
  }

  private crearUsuario(): void {
    this.cargando = true;
    this.errorMessage = '';

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Creando tu cuenta, por favor espera...',
      didOpen: () => Swal.showLoading()
    });

    const correo = String(this.forma.get('correo')!.value).trim().toLowerCase();
    const pass1 = this.forma.get('pass1')!.value;
    const usuario = String(this.forma.get('usuario')!.value).trim();

    const docs = this.docs().map(d => ({
      doc_type: d.docType,
      version: d.version,
      content_hash: d.contentHash,
    }));

    this.auth.nuevoUsuario(correo, pass1).pipe(
      switchMap(fbUser =>
        this.auth.registrarEnBackend(fbUser.idToken, usuario, docs).pipe(
          // Si el backend falla, no dejamos una cuenta huérfana en Firebase
          catchError(err =>
            this.auth.eliminarCuentaFirebase(fbUser.idToken).pipe(
              catchError(() => of(null)),
              switchMap(() => throwError(() => err))
            )
          ),
          // Un fallo al enviar el correo no debe romper el alta
          switchMap(() =>
            this.auth.enviarVerificacionEmail(fbUser.idToken).pipe(catchError(() => of(null)))
          )
        )
      )
    ).subscribe({
      next: () => {
        this.cargando = false;
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Te enviamos un correo para verificar tu cuenta. Ya puedes iniciar sesión.',
          confirmButtonText: 'Entendido',
          confirmButtonColor: '#6366f1'
        }).then(() => this.router.navigateByUrl('/log-in'));
      },
      error: (err) => {
        this.cargando = false;
        Swal.close();
        this.errorMessage = this.mensajeError(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al registrar',
          text: this.errorMessage,
          confirmButtonColor: '#6366f1'
        });
      }
    });
  }

  private mensajeError(err: any): string {
    const fb = err?.error?.error?.message;   // errores de Firebase
    if (typeof fb === 'string') {
      if (fb.startsWith('EMAIL_EXISTS')) return 'Ese correo ya está registrado.';
      if (fb.startsWith('WEAK_PASSWORD')) return 'La contraseña es demasiado débil.';
      if (fb.startsWith('TOO_MANY_ATTEMPTS')) return 'Demasiados intentos. Espera unos minutos.';
      if (fb.startsWith('INVALID_EMAIL')) return 'El correo no es válido.';
    }
    if (err?.error?.code === 'TERMS_VERSION_OUTDATED') {
      return 'Los términos se actualizaron. Recarga la página y acéptalos de nuevo.';
    }
    return err?.error?.message || 'No pudimos crear tu cuenta. Inténtalo más tarde.';
  }
}


// import { Component, OnInit, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';
// import Swal from 'sweetalert2';

// import { AuthService } from '../../services/auth.service';
// import { UserService } from '../../services/user.service';
// import { ValidadoresService } from '../../services/validadores.service';
// import { TermsService } from '../../services/term-cond.service';

// @Component({
//   selector: 'app-sign-up',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './sign-up.component.html',
//   styleUrls: ['./sign-up.component.css']
// })
// export class SignUpComponent implements OnInit {
//   termsVersion = signal<string>('');
//   privacyVersion = signal<string>('');

//   forma!: FormGroup;

//   // Estado de UI
//   cargando = false;
//   errorMessage = '';

//   // Año para el footer
//   year = new Date().getFullYear();

//   constructor(
//     private auth: AuthService,
//     private fb: FormBuilder,
//     private validadores: ValidadoresService,
//     private router: Router,
//     private user: UserService,
//     private termsService: TermsService
//   ) {
//     this.crearFormulario();
//   }

//   ngOnInit(): void {
//      this.termsService.getPublicVersion('terms').subscribe(v => {
//       this.termsVersion.set(v.version);
//     });
//     this.termsService.getPublicVersion('privacy').subscribe(v => {
//       this.privacyVersion.set(v.version);
//     });
//   }

//   // ============================================
//   // FORMULARIO
//   // ============================================
//   crearFormulario(): void {
//     this.forma = this.fb.group({
//       usuario: ['', [Validators.required, Validators.minLength(3)], this.validadores.existeUsuario],
//       correo: ['', [
//         Validators.required,
//         Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')
//       ]],
//       pass1: ['', [Validators.required, Validators.minLength(8)]],
//       pass2: ['', [Validators.required]],
//       terminos: [false, [Validators.requiredTrue]]
//     }, {
//       validators: this.validadores.passwordsIguales('pass1', 'pass2')
//     });
//   }

//   // ============================================
//   // GETTERS DE VALIDACIÓN
//   // ============================================
//   get usuarioNoValido(): boolean {
//     const control = this.forma.get('usuario');
//     return !!control && control.invalid && control.touched;
//   }

//   get correoNoValido(): boolean {
//     const control = this.forma.get('correo');
//     return !!control && control.invalid && control.touched;
//   }

//   get pass1NoValido(): boolean {
//     const control = this.forma.get('pass1');
//     return !!control && control.invalid && control.touched;
//   }

//   get pass2NoValido(): boolean {
//     const pass1 = this.forma.get('pass1')?.value;
//     const pass2 = this.forma.get('pass2')?.value;
//     const pass2Control = this.forma.get('pass2');

//     // Solo mostrar error si pass2 fue tocado y no coinciden
//     if (!pass2Control?.touched) return false;
//     return pass1 !== pass2;
//   }

//   // ============================================
//   // GUARDAR / CREAR USUARIO
//   // ============================================
//   guardar(): void {
//     if (this.forma.invalid) {
//       // Marcar todos los campos como tocados para mostrar errores
//       Object.values(this.forma.controls).forEach(control => {
//         control.markAsTouched();
//       });
//       return;
//     }

//     this.crearUsuario();
//   }

//   private crearUsuario(): void {
//     this.cargando = true;
//     this.errorMessage = '';

//     Swal.fire({
//       allowOutsideClick: false,
//       icon: 'info',
//       text: 'Creando tu cuenta, por favor espera...',
//       didOpen: () => {
//         Swal.showLoading();
//       }
//     });

//     const correo = this.forma.get('correo')!.value;
//     const pass1 = this.forma.get('pass1')!.value;
//     const usuario = this.forma.get('usuario')!.value;

//     this.auth.nuevoUsuario(correo, pass1).subscribe({
//       next: (resp) => {
//         const usuarioCreado = resp as { email: string; localId: string; idToken: string };

//         this.user.singUpUser(
//           usuarioCreado.email,
//           usuario,
//           pass1,
//           usuarioCreado.localId,
//           usuarioCreado.idToken
//         ).subscribe({
//           next: () => {
//             this.cargando = false;
//             Swal.close();

//             Swal.fire({
//               icon: 'success',
//               title: '¡Registro exitoso!',
//               text: 'Te hemos enviado un correo para confirmar tu cuenta.',
//               confirmButtonText: 'Entendido',
//               confirmButtonColor: '#6366f1'
//             }).then(() => {
//               this.router.navigateByUrl('/log-in');
//             });
//           },
//           error: (err) => {
//             this.cargando = false;
//             Swal.close();
//             this.errorMessage = err.error?.error?.message || 'No se pudo crear el usuario';
//             Swal.fire({
//               icon: 'error',
//               title: 'Error',
//               text: this.errorMessage,
//               confirmButtonColor: '#6366f1'
//             });
//           }
//         });
//       },
//       error: (err) => {
//         this.cargando = false;
//         Swal.close();
//         const mensaje = err.error?.error?.message || 'Lo sentimos, tenemos un error al registrarte. Inténtalo más tarde';
//         this.errorMessage = mensaje;
//         Swal.fire({
//           icon: 'error',
//           title: 'Error al registrar',
//           text: mensaje,
//           confirmButtonColor: '#6366f1'
//         });
//       }
//     });
//   }
// }