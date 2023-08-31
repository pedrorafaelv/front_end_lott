import { Injectable } from '@angular/core';
import {  CanActivate,  Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate {
   constructor( private auth: AuthService, 
    private router: Router){

   }
  canActivate():  boolean {
    if ( this.auth.estaAutenticado() ){
      console.log('entro al guard');
       return true;
     
    }else{

      this.router.navigateByUrl('/log-in');
      return false;
    }

    return true;
  }
  
}
