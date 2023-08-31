import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Permissions } from '../interfaces/get-user-permissions-response';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
private   localId: string;
private usrName: string;
public permission: Permissions;
public UserId: string;



  constructor(private auth : AuthService,
    private router: Router,
    private usr: UserService,

     private Auth: AuthService ){
    
  }
  canActivate():  boolean {
    if ( this.auth.estaAutenticado() ){
      this.localId = this.Auth.getLocalId();
      console.log('entro al admin guard');
      this.usr.getUserByLocalId(this.localId).then
     ((res)=>{
      this.UserId = res.user[0]['id'];
      this.getInfoPermissions();
      console.log('this.permissions => ', this.permission);
      // this.usr.getUserPermissions(res.user[0].id)
      //  .subscribe(resp=>{
      //   console.log(resp);
      //  });
      
     }, error=>{

      console.error("Error en el servicio de usuario");
      return false;

     });
       return true;
     
    }else{

      this.router.navigateByUrl('/log-in');
      return false;
    }
  
  }
  async getInfoPermissions(){
    const user =  await this.usr.getUserByLocalId(this.localId);
    this.UserId = user.user[0]['id'];
    const Permissions = await this.usr.getPermissionsByUser(this.UserId);
    //console.log('this.permission= ',this.permission);
   return  this.permission = Permissions.Permissions;

}
  
}
