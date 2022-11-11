import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ValidadoresService } from 'src/app/services/validadores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['./sing-up.component.css']
})
export class SingUpComponent implements OnInit {

  forma: FormGroup;

  constructor(private auth: AuthService, 
              private fb:FormBuilder,
              private validadores : ValidadoresService,
              private router : Router ) {
    this.crearFormulario();
    // this.cargarDataFormulario();
    // this.crearListeners();
   }
   ngOnInit(): void {
    
  }

   crearFormulario(){
   this.forma=this.fb.group({
     correo  : ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")] ],
     usuario: ['', ,  this.validadores.existeUsuario],
     pass1  : ['', [Validators.required] ],
     pass2  : ['', [Validators.required] ],
   },   {
        validators: this.validadores.passwordsIguales('pass1', 'pass2')
   });

   }

   crearListeners(){
    this.forma.valueChanges.subscribe((valor: any) => {
      console.log(valor);
    })

  //  this.forma.statusChanges.subscribe(status => console.log({status}));
    this.forma.get('nombre')!.valueChanges.subscribe(console.log);
   }

   cargarDataFormulario(){
    
    this.forma.reset({
        nombre: "",
        correo: "",
        pass1:'123',
        pass2:'123',
    });                                                                                                                                                                                                                                                                                                                                                 
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
  get pass2NoValido(){
    const pass1=this.forma.get('pass1')!.value;
    const pass2=this.forma.get('pass2')!.value;
    return(pass1===pass2) ? false : true ;
   
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

     console.log('formulario valido en guardar ');
     this.crearUsuario(this.forma);    
    //  this.forma.reset();

  }

 crearUsuario(form: FormGroup){
  Swal.fire({
    allowOutsideClick: false,
    icon: 'info',
    text:'Espere por favor'
    });
     Swal.showLoading();
  this.auth.nuevoUsuario(this.forma.get('correo').value, this.forma.get('pass1').value)
    .subscribe(resp =>{
      Swal.close();
      console.log(resp);
    }, (err)=>{

      console.log(err.error.error.message);
      Swal.fire({
        icon: 'error',
        title:'Lo sentimos, tenemos un error al registrarte, intentalo más tarde',
        text: err.error.error.message,
        });
    });
 }
  
}
