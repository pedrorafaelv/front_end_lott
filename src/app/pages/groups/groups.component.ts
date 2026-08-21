import { Component, OnInit } from '@angular/core';
import {  FormBuilder, Validators, FormGroup, ReactiveFormsModule, FormControl } from "@angular/forms";
// import { switchMap, catchError } from 'rxjs/operators';
// import { of } from 'rxjs';
import { ValidadoresService } from '../../services/validadores.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
// import { Permissions } from '../../interfaces/get-user-permissions-response';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/get-groups-response';
import Swal from "sweetalert2";
import { ComponentsModule } from '../../components/components.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.css'],
    standalone: true,
    imports:[ ReactiveFormsModule, 
            ComponentsModule,
            CommonModule
     ],
})
export class GroupsComponent implements OnInit {
  groupData!: Group;
  loading = false;
  errorMessage = '';
  successMessage = '';

  forma!: FormGroup;
  date = new Date();
  events: string[] = [];
  listaPublicPrivate = [
    {id: "0", name: 'Publico' },
    {id: "1", name: 'Privado' }
  ];
  ListaYesNo= [
    {id: "0", name: 'NO' },
    {id: "1", name: 'SI' }
  ];
   public userId!: string;
   public localId!: string;
   public user!:    string;
   public usuario: any;

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${type}: ${event.value}`);
  }
  constructor(private fb:FormBuilder,
            private validadores : ValidadoresService,
            private AuthService: AuthService,
            private UserService: UserService,
            private GroupService: GroupService ) {
    this.crearFormulario();
    this.cargarDataFormulario();
    this.crearListeners();

   }

   crearFormulario(){
   this.forma=this.fb.group({
     name     : ['', [Validators.required] ],
     description: ['', ,  this.validadores.existeUsuario],
     active     : ['1', [Validators.required] ],
     privacy    : ['1', [Validators.required] ],
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
        name: "",
        description: "",
        active:'1',
        privacy: '1',
        start_date: this.date,
        end_date: this.date,
        created_at: this.date,
        updated_at: this.date,
    });
    
   }

  ngOnInit(): void {
    //  console.log('Permissions en pagina de creacion de grupos =', this.localId);

    this.localId = this.AuthService.getLocalId();
    if (this.localId){
    this.getInfo();

    } 
  }
  async getInfo(){
          //  console.log('ngOniInit?groups ', this.localId);

  const user = await this.UserService.getByLocalId(this.localId);
  user.subscribe(
    resp => {
      this.usuario = resp;
      this.userId = this.usuario.user[0]['id'];
      // console.log('Usuario ID:', this.userId);
      
      // Actualiza los campos del formulario con el user_id
      this.forma.patchValue({
        user_id: this.userId,
        user_admin: this.userId
      });
    },
    error => {
      console.log(error);
    }
  );
}
  get nameNoValido(){
    return this.forma.get('name')!.invalid && this.forma.get('name')!.touched
  }

  get adminNoValido(){
    return this.forma.get('user_admin')!.invalid && this.forma.get('user_admin')!.touched
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
  if (this.forma.invalid){
    this.getInfo();
    Object.values(this.forma.controls).forEach(control => {
      if (control instanceof FormGroup){
        Object.values(control.controls).forEach(ctrl => ctrl.markAsTouched());
      } else {
        control.markAsTouched();
      }
    });
    return; // Importante: salir si el formulario es inválido
  }

  // Prepara los datos con TODOS los campos requeridos
  const groupData = {
    ...this.forma.value,
    user_id: this.userId, // Asegúrate de que esto tenga valor
    user_admin: this.userId, // Normalmente el admin es el mismo user_id
    name: this.forma.get('name')?.value, // Usa 'name' no 'nombre'
    active: this.forma.get('active')?.value === '1', // Convertir a boolean si es necesario
    privacy: this.forma.get('privacy')?.value
  };

  // console.log('Datos que se enviarán:', groupData); // Verifica en consola

  this.GroupService.newGroup(groupData).subscribe(
    resp => {
      Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text: 'Grupo creado correctamente',  
      });
      this.forma.reset(); // Reset después del éxito
    },
    (err) => {            
      Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        text: err.error.message,
      });
    }
  );
}

 
}
