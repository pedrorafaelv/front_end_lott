import { Component,  OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { SocialAuthService, SocialResult } from '../../services/social-auth.service';

// en el constructor:


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    CommonModule,
  ],
})
export class LoginComponent implements OnInit {
  cargando = false;
  errorMessage = '';
  forma!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private social: SocialAuthService,
  ) {
    this.crearFormulario();
  }

  // ============================================
  // FORMULARIO
  // ============================================
  crearFormulario(): void {
    this.forma = this.fb.group({
      correo: ['', [
        Validators.required,
        Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$'),
      ]],
      usuario: [''],
      pass1: ['', [Validators.required]],
      recordarme: [false],
    });
  }

  ngOnInit(): void {
    // Auto-rellenar email si "recordarme" estaba activo
    const email = localStorage.getItem('email');
    if (email) {
      this.forma.patchValue({
        correo: email,
        recordarme: true,
      });
    }
  }

  // ============================================
  // GETTERS DE VALIDACIÓN
  // ============================================
  get correoNoValido(): boolean {
    const ctrl = this.forma.get('correo')!;
    return ctrl.invalid && ctrl.touched;
  }

  get usuarioNoValido(): boolean {
    const ctrl = this.forma.get('usuario')!;
    return ctrl.invalid && ctrl.touched;
  }

  get pass1NoValido(): boolean {
    const ctrl = this.forma.get('pass1')!;
    return ctrl.invalid && ctrl.touched;
  }

  // ============================================
  // SUBMIT
  // ============================================
  guardar(): void {
    // Si el formulario es inválido, marcar todos los campos como touched

    if (this.forma.invalid) {
      Object.values(this.forma.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(c => c.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
      return;   // 👈 NO llamar a login si es inválido
    }

    const email = this.forma.get('correo')!.value;
    const password = this.forma.get('pass1')!.value;
    const recordarme = this.forma.get('recordarme')!.value;

    this.cargando = true;
    this.errorMessage = '';

    // Guardar email si "recordarme" está activo
    if (recordarme) {
      localStorage.setItem('email', email);
    } else {
      localStorage.removeItem('email');
    }

    this.login(email, password);
  }

  // ============================================
  // LOGIN
  // ============================================
  login(email: string, password: string): void {
    this.cargando = true;

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor',
    });
    Swal.showLoading();

    // 👇 auth.login() YA hace el exchange internamente (por el switchMap)
    // No hace falta llamarlo otra vez
    this.auth.login(email, password).subscribe({
      next: (resp) => {
        console.log('✅ Login + Exchange OK', resp);
        Swal.close();
        this.cargando = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        console.error('❌ Login error', err);
        Swal.close();
        this.cargando = false;

        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err?.error?.error?.message
              ?? err?.error?.error
              ?? 'Credenciales inválidas. Intenta de nuevo.',
        });
      },
    });
  }
   
  get year() {
    return new Date().getFullYear();
  }

  async loginConGoogle(): Promise<void> {  let social: SocialResult | null = null;
//  console.log('login con google ');
  try {
    social = await this.social.signInWithGoogle();
    // console.log('▶️ [3] social =', social);
    // console.log('▶️ [4] idToken?', !!social?.idToken, 'localId?', social?.localId);

    // console.log('▶️ [5] llamando backend iniciarSesionConIdToken…');
    // await firstValueFrom(this.auth.iniciarSesionConIdToken(social.idToken, social.localId));
    const resp = await firstValueFrom(
      this.auth.iniciarSesionConIdToken(social.idToken, social.localId)
    );
        //  console.log('▶️ [6] resp backend =', resp);
    //  console.log('▶️ [7] discard…');

    await this.social.discard(false);
        //  console.log('▶️ [8] navegando a /');

    this.router.navigateByUrl('/dashboard');   // ajusta a tu pantalla principal
        // console.log('▶️ [9] FIN OK');

  } catch (err: any) {
  // console.error('LOGIN GOOGLE ERROR:', JSON.stringify(err, null, 2));
  // console.error('code:', err?.code);
  // console.error('status:', err?.status);
  // console.error('error:', err?.error);
  // console.error('message:', err?.message);
  // console.error('stack:', err?.stack);
    const code = err?.code as string | undefined;

    // El usuario cerró la ventana: no es un error
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      await this.social.discard(false);
      return;
    }

    // Entró con Google, pero no tiene cuenta en nuestro sistema
    if (err?.status === 404 && err?.error?.code === 'USER_NOT_REGISTERED') {
      // Firebase acaba de crear una cuenta que no usaremos: la borramos si es nueva
      await this.social.discard(!!social?.isNewUser);
      this.router.navigateByUrl('/sign-up');   // ajusta la ruta
      return;
    }

    await this.social.discard(false);
    // muestra tu error habitual, por ejemplo con Swal
  }
}
}