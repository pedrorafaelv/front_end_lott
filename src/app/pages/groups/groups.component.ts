import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ValidadoresService } from '../../services/validadores.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Permissions } from '../../interfaces/get-user-permissions-response';
import { GroupService } from '../../services/group.service';
import Swal from "sweetalert2";

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
   public userId: string;
   public localId: string;
   public user:    string;
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
     console.log('Permissions en pagina de creacion de grupos =', Permissions);
    this.localId = this.AuthService.getLocalId();
    if (this.localId){
    this.getInfo();
    } 
  }
  async  getInfo(){
    // const user =  await this.UserService.getUserByLocalId(this.localId);
    const user = await this.UserService.getByLocalId(this.localId);
    user.subscribe(resp=>{
        this.usuario = resp;
        this.userId = this.usuario.user[0]['id'];
        console.log('usuario', this.usuario.user[0]['id']);
     },
     error=>{
         console.log(error);
     });
    // console.log('user en groups.component = ',user);
    // this.userId = user.user[0]['id'];
    // const group = await this.UserService.getGroupByUser(this.UserId);
    // this.grupos = group.Group;
  }
  get nombreNoValido(){
    return this.forma.get('nombre')!.invalid && this.forma.get('nombre')!.touched
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
//  this.userId 
    if (this.forma.invalid ){
      Object.values(this.forma.controls).forEach (control =>{

        if (control instanceof FormGroup){

          Object.values(control.controls).forEach(control => control.markAsTouched());
        }else {
          
          control.markAsTouched();
        }
      });
    }
    const ruta = this.userId +'/'+ this.userId+'/'+this.forma.get('nombre')?.value +'/'+this.forma.get('description')?.value 
    +'/'+this.forma.get('active')?.value +'/'+this.forma.get('privacy')?.value +'/'+this.forma.get('start_date')?.value 
    +'/'+this.forma.get('end_date')?.value;
     this.forma.reset();
   this.GroupService.newGroup(ruta).subscribe(resp=>{
    Swal.close();
      Swal.fire({
        allowOutsideClick: false,
        icon: 'success',
        text: resp['message'],  
      });
   },(err)=>{            
    Swal.fire({
        allowOutsideClick: false,
        icon: 'error',
        text: err.error.message,
      });
  })
  }

 
}
