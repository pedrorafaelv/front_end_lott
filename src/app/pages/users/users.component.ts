import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

// import { GroupService } from '../../services/group.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  public localId: string;
  public usersData;
  public userGroups;
  // form_removeGroups: FormGroup;
  form_Groups: FormGroup;

  constructor( private UserService: UserService,
     private AuthService: AuthService,
    //  private modalRef: BsModalRef,
    //  private GroupService: GroupService,
    ) { }

  ngOnInit(): void {
    this.localId = this.AuthService.getLocalId();
    if (this.localId){
    this.getInfo();
    } 
  }
  getInfo(){
    this.UserService.getUsersList(this.localId).subscribe( resp =>{
      console.log("usuarios", resp['usuarios']);
      this.usersData=resp['usuarios'];
    })
    this.usersData
    console.log('getinfo ');
  }

  getGroups(id){
    this.UserService.getGroups(id).subscribe((data)=>{
       console.log('data', data.Group);
       this.userGroups = data.Group;

    });

  }
  getGroupAvailable(id: string){
    this.getGroups(id)

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
}
