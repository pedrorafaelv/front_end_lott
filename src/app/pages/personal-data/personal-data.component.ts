import { Component, OnInit } from '@angular/core';
import { FormArray,FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from 'src/app/services/auth.service';
import { ValidadoresService } from 'src/app/services/validadores.service';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css']
})
export class PersonalDataComponent implements OnInit {

  forma: FormGroup;

  constructor(private auth: AuthService, 
              private fb:FormBuilder,
             private validadores : ValidadoresService  ) {
    this.crearFormulario();
    this.cargarDataFormulario();
    this.crearListeners();
   }

   crearFormulario(){
   this.forma=this.fb.group({
     nombre  : ['', [Validators.required, Validators.minLength(5)] ],
     apellido: ['', [Validators.required, Validators.minLength(5)] ],
     phone   : ['', [Validators.required, Validators.minLength(5)] ],
     gender  : ['', [Validators.required, Validators.minLength(5)] ],
     document: ['', [Validators.required, Validators.minLength(5)] ],
     correo  : ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")] ],
     usuario: ['', ,  this.validadores.existeUsuario],
     pass1  : ['', [Validators.required] ],
     pass2  : ['', [Validators.required] ],
     politics  : ['', [Validators.required] ],
     
     direccion: this.fb.group({
      pais   : ['', [Validators.required, Validators.minLength(5)] ],
      estado : ['', [Validators.required, Validators.minLength(5)] ],
      ciudad : ['', [Validators.required, Validators.minLength(5)] ],
      address: ['', [Validators.required, Validators.minLength(5)] ]

     }),

     pasatiempos : this.fb.array([ ])

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
    //  this.forma.setValue({
        nombre: "",
        apellido: "",
        correo: "",
        pass1:'123',
        pass2:'123',
        direccion: {
          distrito: "",
          ciudad: "",
          estado: "",
        }
    });                                                                                                                                                                                                                                                                                                                                                
    
    ['comer','dormir'].forEach( valor => this.pasatiempos.push( this.fb.control(valor) ) );

   }

  ngOnInit(): void {
    
  }

  get pasatiempos(){
    return this.forma.get('pasatiempos') as FormArray;
  }

  get nombreNoValido(){
    return this.forma.get('nombre')!.invalid && this.forma.get('nombre')!.touched
  }

  get apellidoNoValido(){
    return this.forma.get('apellido')!.invalid && this.forma.get('apellido')!.touched
  }

  get correoNoValido(){
    return this.forma.get('correo')!.invalid && this.forma.get('correo')!.touched
  }

  get usuarioNoValido(){
    return this.forma.get('usuario')!.invalid && this.forma.get('usuario')!.touched
  }

  get paisNoValido(){
    return this.forma.get('direccion.pais')!.invalid && this.forma.get('direccion.pais')!.touched
  }

  get estadoNoValido(){
    return this.forma.get('direccion.estado')!.invalid && this.forma.get('direccion.estado')!.touched
  }

  get ciudadNoValido(){
    return this.forma.get('direccion.ciudad')!.invalid && this.forma.get('direccion.ciudad')!.touched
  }

  get direccionNoValido(){
    return this.forma.get('direccion.address')!.invalid && this.forma.get('direccion.address')!.touched
  }

  get telefonoNoValido(){
    return this.forma.get('telefono')!.invalid && this.forma.get('telefono')!.touched
  }

  get generoNoValido(){
    return this.forma.get('genero')!.invalid && this.forma.get('genero')!.touched
  }

  get documentNoValido(){
    return this.forma.get('document')!.invalid && this.forma.get('document')!.touched
  }

  get birthDateNoValido(){
    return this.forma.get('birth_date')!.invalid && this.forma.get('birth_date')!.touched
  }

  get politicsNoValido(){
    return this.forma.get('politics')!.invalid && this.forma.get('politics')!.touched
  }

  get pass1NoValido(){
    return this.forma.get('pass1')!.invalid && this.forma.get('pass1')!.touched
  }
  get pass2NoValido(){
    const pass1=this.forma.get('pass1')!.value;
    const pass2=this.forma.get('pass2')!.value;
    return(pass1===pass2) ? false : true ;
    

    // return this.forma.get('pass2').invalid && this.forma.get('pass2').touched
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
     this.forma.reset();
  }

  

}
