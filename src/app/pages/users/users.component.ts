import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PublicityComponent } from "../../components/publicity/publicity.component";

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css'],
    standalone: true,
    imports: [CommonModule, 
              PublicityComponent,
              ReactiveFormsModule ]
})
export class UsersComponent implements OnInit {
  public localId: string = '';
  public usersData: any[] = [];
  public userGroups: any[] = [];
  // form_removeGroups: FormGroup;
  form_Groups: FormGroup;

  constructor( private UserService: UserService,
     private AuthService: AuthService,
    //  private modalRef: BsModalRef,
      private fb: FormBuilder,
    ) {

      this.form_Groups = this.fb.group({
       
        grupoficha             : [''],
       }, 
       ); 

     }

  ngOnInit(): void {
    this.localId = this.AuthService.getLocalId();
    if (this.localId){
    this.getInfo();
    } 
  }
  getInfo(){
    this.UserService.getUsersList(this.localId).subscribe( resp =>{
      console.log("usuarios", resp);
      this.usersData = resp;
    })
    this.usersData
    console.log('getinfo ');
  }

  getGroups(id:any){
    this.UserService.getGroups(id).subscribe((data)=>{
       console.log('data', data.Group);
       this.userGroups = data.Group;
    });

  }
  getGroupAvailable(id: string){
    this.getGroups(id);
    // const groups = this.userGroups;
  }
   addGroup(){
     console.log('agregando grupo');
     this.getGroups(1);
   }
   removeGroups() {
      console.log('removiendo grupo');
   }
   onSubmit() {
      console.log('onSubmit');
    // this.addGroupModal.hide();
   }
   onClickGroup(id: string){
      console.log('hiciste click en el grupo ', id);
   }
}
