import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ValidadoresService } from '../../services/validadores.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  forma!: FormGroup;
  date = new Date();
  events: string[] = [];
  listaPublicPrivate = [
    {id: 0, name: 'Publico' },
    {id: 1, name: 'Privado' }
  ];
  ListaYesNo= [
    {id: 0, name: 'NO' },
    {id: 1, name: 'SI' }
  ];

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }
  constructor(private fb:FormBuilder,
             private validadores : ValidadoresService  ) {
    this.crearFormulario();
    this.cargarDataFormulario();
    this.crearListeners();

   }

   crearFormulario(){
   this.forma=this.fb.group({
     nombre     : ['', [Validators.required] ],
     description: ['', ,  this.validadores.existeUsuario],
     active     : ['', [Validators.required] ],
     privacy    : ['', [Validators.required] ],
     start_date : [],
     end_date   : [],
     created_at : [this.date],
     updated_at : [],
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
        name: "",
        description: "",
        active:'1',
        privacy: 1,
        start_date: this.date,
        end_date: this.date,
        created_at: this.date,
        updated_at: this.date,
    });
    
   }

  ngOnInit(): void {
    
  }
 
  get nombreNoValido(){
    return this.forma.get('nombre')!.invalid && this.forma.get('nombre')!.touched
  }

  get descriptionNoValido(){
    return this.forma.get('description')!.invalid && this.forma.get('description')!.touched
  }
 
  get activeNoValido(){
    return this.forma.get('active')!.invalid && this.forma.get('active')!.touched
  }

  get privacyNoValido(){
    return this.forma.get('privacy')!.invalid && this.forma.get('privacy')!.touched
  }
  
  get startDateNoValido(){
    return this.forma.get('start_date')!.invalid && this.forma.get('start_date')!.touched
  }

  get endDateNoValido(){
    return this.forma.get('end_date')!.invalid && this.forma.get('end_date')!.touched
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
    //  guardar
     this.forma.reset();
  }

  
}
