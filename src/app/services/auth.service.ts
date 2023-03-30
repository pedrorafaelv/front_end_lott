import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
// crear nuevo usuario 
//  https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]

// login
// https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

//cambiar contraseña
//https://identitytoolkit.googleapis.com/v1/accounts:update?key=[API_KEY]

//enviar correo de restablecimiento de contraseña
//https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=[API_KEY]

// confirmar restablecimiento de contraseña
// https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=[API_KEY]

private url= 'https://identitytoolkit.googleapis.com/v1';
private apiKey = 'AIzaSyAB-PXIBMGdxsnw1TqIfI9ON_9GZW2D-Co';
userToken: any;
localId: string;
email: string;
localStorage: Storage;
  constructor(private http: HttpClient) { 
     this.leerToken();
  }


   login(email, pass){
    const authData={
      email: email,
      password: pass,
      returnSecureToken: true,
    };
    console.log('login', authData);
    return this.http.post(
      `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`,authData
    ).pipe(
      map( resp=>{
        // console.log('entro en el mapa de RXJS');
        this.guardarToken(  resp['idToken'] );
        this.guardarProfile(resp['localId']);
        return resp;
      })
    );
   }

   nuevoUsuario(email, pass){
    const authData ={
      email: email,
      password: pass,
      returnSecureToken: true
    };
     console.log('nuevo usuario',authData);
    return this.http.post(
      `${this.url}/accounts:signUp?key=${ this.apiKey}`,authData
    ).pipe(
      map( resp=>{
        // console.log('entro en el mapa de RXJS');
        this.guardarToken(resp['idToken'] );
        this.guardarProfile(resp['localId']);
        return resp;
      })
    );
   }

   cambiarContrasena(idToken, newPass){
    const authData ={
      idtoken: idToken,
      newPass: newPass,
      returnSecureToken: true
    };
     console.log('cambia contrasena',authData);
    return this.http.post(
      `${this.url}/accounts:update?key=${ this.apiKey}`,authData
    );    
   }

   passwordResetByemail(email){
    const authData={
      requestType: "PASSWORD_RESET",
      email: email
    };
    console.log('email restablecimiento constrasena',authData);
    return this.http.post(
      `${this.url}/accounts:sendOobCode?key=${ this.apiKey}`,authData
    );  
   }

   confirmResetPassword(resetCod, newPass){
    const authData={
      oobCode: resetCod,
      newPassword: newPass
    };
    console.log('confirmar restablecimiento constrasena',authData);
    return this.http.post(
      `${this.url}/accounts:resetPassword?key=${ this.apiKey}`,authData
    );
   } 

   private guardarToken(idToken: any){
    this.userToken =idToken;
    let hoy = new Date();
      hoy.setSeconds( 3600 );
    localStorage.setItem('expira', hoy.getTime().toString());
    localStorage.setItem('token',idToken); 
 }

  leerToken (){
   if (localStorage.getItem('token')) {
    this.userToken = localStorage.getItem('token');
   }else{
     this.userToken="";
   }
   return this.userToken;
 }
  estaAutenticado(): boolean {

   if( this.userToken.length < 2 ){
     return false;
   }

     const expira =Number(localStorage.getItem('expira'));
       const expiraDate = new Date();
       expiraDate.setTime(expira);
        if(expiraDate>new Date()){
          return true;
        }else{
          return false;
        }
   return this.userToken.length > 2;

  }
  logout(){

    // if (localStorage.getItem('token'))
    // {
      localStorage.removeItem('token');
      localStorage.removeItem('expira');

      // console.log('hola');
    // }
  }
  getEmail(){
    this.email =localStorage.getItem('email'); 
     return this.email; 
  }
  getLocalId(){
    this.localId = localStorage.getItem('localId'); 
    return this.localId; 
  }
  private guardarProfile(localId: string){
    console.log('localId en guardarProfile = ', localId );
    localStorage.setItem('localId',localId);
   }
 
}
