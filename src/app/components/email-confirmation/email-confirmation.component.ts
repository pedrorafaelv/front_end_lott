import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router} from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-email-confirmation',
    templateUrl: './email-confirmation.component.html',
    styleUrls: ['./email-confirmation.component.css'],
    standalone: true,
    imports:[ReactiveFormsModule, CommonModule]
})
export class EmailConfirmationComponent implements OnInit {
 forma!:FormGroup;
  constructor(private fb:FormBuilder,
    private auth: AuthService,
    private router:Router,
    private validadores: Validators) { }

  ngOnInit(): void {
  }
  crearFormulario(){
    this.forma=this.fb.group({
      correo  : ['', [Validators.required, Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$")] ],
      });
    }
   guardar(){}

   cargarDataFormulario(){
    
    this.forma.reset({
    //  this.forma.setValue({
        nombre: "",
        correo: "",
        pass1:'123',
    });
    
   }
   get correoNoValido(){
    return this.forma.get('correo')!.invalid && this.forma.get('correo')!.touched
  }

}
