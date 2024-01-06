import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm } from "@angular/forms";
import { ValidadoresService } from 'src/app/services/validadores.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from "sweetalert2";
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  forma: FormGroup;
  recordarme =false;


  constructor(private fb:FormBuilder,
             private validadores : ValidadoresService,
             private auth: AuthService,
             private router:Router,
             private UserService: UserService) {
    this.crearFormulario();
   }

   crearFormulario(){
   this.forma=this.fb.group({
     correo  : ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")] ],
     usuario : ['', ],
     pass1   : ['', [Validators.required] ]
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
    if(localStorage.getItem('email')){
      this.forma.setValue({'correo': localStorage.getItem('email')});
      this.recordarme = true; 
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

  login(form: FormGroup){
     if(form.invalid){return true;}

     Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text:'Espere por favor'
      });
       Swal.showLoading();

     this.auth.login(this.forma.get('correo').value, this.forma.get('pass1').value)
    .subscribe(resp =>{
      Swal.close();
      console.log('se debe  validar  la confirmación del email  = '+ resp);
      this.UserService.getUserEmailConfirm(this.forma.get('correo').value)
      .subscribe(resp=>{
        console.log("esta es la respuesta de la confirmacion "+ resp);
      },
       (err)=>{
        console.log('no esta confirmado el email');
       }
      )
     if (this.recordarme){
      localStorage.setItem('email', this.forma.get('correo').value);
     }

      this.router.navigateByUrl('/dashboard');
      console.log(resp);
    }, (err)=>{
       console.log(err.error.error.message);
       Swal.fire({
        icon: 'error',
        title:'Error al autenticar',
        text: err.error.error.message,
        });
    });
  return true;
   }
    loginUser(){
       this.UserService.getByLocalId('1');
    }
  
}
