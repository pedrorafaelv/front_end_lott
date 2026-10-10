import { Component,  OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
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
}