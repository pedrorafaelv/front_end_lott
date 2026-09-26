import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ValidadoresService } from '../../services/validadores.service';
import { AuthService } from '../../services/auth.service';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
 import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: true,
    imports: [ReactiveFormsModule, 
              FormsModule,
            CommonModule]
})
export class LoginComponent implements OnInit {

  forma!: FormGroup;
  recordarme =false;


  constructor(private fb:FormBuilder,
             private validadores : ValidadoresService,
             private auth: AuthService,
             private router:Router,
             private UserService: UserService) {
    this.crearFormulario();
   }

  crearFormulario() {
    this.forma = this.fb.group({
        correo: ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")]],
        usuario: [''],
        pass1: ['', [Validators.required]],
        recordarme: [false]  // <-- Agregar campo
    });
}

   crearListeners(){
    this.forma.valueChanges.subscribe((valor: any) => {
      console.log(valor);
    })
   }

   cargarDataFormulario(){
    
    this.forma.reset({
    //  this.forma.setValue({
        nombre: "",
        correo: "",
        pass1:'123',
    });
    
   }

 ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
        this.forma.patchValue({ 
            correo: email,
            recordarme: true 
        });
    }
}

  get correoNoValido(){
    return this.forma.get('correo')!.invalid && this.forma.get('correo')!.touched
  }

  get usuarioNoValido(){
    return this.forma.get('usuario')!.invalid && this.forma.get('usuario')!.touched
  }
 
  get pass1NoValido(){
    return this.forma.get('pass1')!.invalid && this.forma.get('pass1')!.touched
  }

  guardar(){

    if (this.forma.invalid ){
      Object.values(this.forma.controls).forEach (control =>{

        if (control instanceof FormGroup){

          Object.values(control.controls).forEach(control => control.markAsTouched());
        }else {
          control.markAsTouched();
        }
      });
    }
    
    this.login(this.forma);
    this.forma.reset();
  }

 login(form: FormGroup) {
  if (form.invalid) return true;

  Swal.fire({
    allowOutsideClick: false,
    icon: 'info',
    text: 'Espere por favor'
  });
  Swal.showLoading();

  const email = this.forma.get('correo')!.value;
  const password = this.forma.get('pass1')!.value;

  this.auth.login(email, password).subscribe({
    next: (resp) => {
      console.log('✅ Login Firebase OK', resp);

      // 1. Guardar email si "recordarme"
      if (this.recordarme) {
        localStorage.setItem('email', email);
      }

      // 2. Hacer el exchange con el backend (idToken → sanctum_token)
      this.auth.exchangeFirebaseToken().subscribe({
        next: (exchangeResp) => {
          console.log('✅ Exchange OK', exchangeResp);
          Swal.close();

          // 3. AHORA sí, navegar al dashboard
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          console.error('❌ Exchange error', err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo completar la autenticación',
          });
        }
      });
    },
    error: (err) => {
      console.error('❌ Login Firebase error', err);
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error al autenticar',
        text: err.error?.error?.message || 'Credenciales inválidas',
      });
    }
  });

  return true;
}
  
}
