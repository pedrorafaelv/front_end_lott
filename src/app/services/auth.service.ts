import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, switchMap } from 'rxjs';
import { environment, firebaseUrl } from '../../environments/environment';

interface AuthResponse {
  idToken: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private fbLoginUrl= firebaseUrl.login;
  private fbNewUserUrl=firebaseUrl.newUser;
  private fbChangePasswdUrl=firebaseUrl.changePasswd;
  private fbemailConfirmPasswUrl=firebaseUrl.emailConfirmPassw;
  private fbconfirmRestorePasswdUrl = firebaseUrl.confirmRestorePasswd;
  private apiKey =environment.Firebase_apiKey;

userToken: any;
localId!: string;
email!: string;
localStorage!: Storage;
  constructor(private http: HttpClient) { 
     this.leerToken();
  }


  //  login(email:string, pass:string){
  //   const authData={
  //     email: email,
  //     password: pass,
  //     returnSecureToken: true,
  //   };
  //   return this.http.post<AuthResponse>(
  //     `${this.url}/accounts:signInWithPassword?key=${this.apiKey}`,authData
  //   ).pipe(
  //     map( resp=>{
  //       this.guardarToken(resp.idToken);
  //       this.guardarProfile(resp.localId);
  //       console.log('respuesta de login', resp);
  //       return resp;
  //     })
  //   );
  //  }


  login(email: string, pass: string): Observable<any> {
  const authData = {
    email,
    password: pass,
    returnSecureToken: true,
  };

  return this.http.post<AuthResponse>(
    `${this.fbLoginUrl}${this.apiKey}`,
    authData
  ).pipe(
    tap((resp) => {
      this.guardarToken(resp.idToken);
      this.guardarProfile(resp.localId);
    }),
    // 👇 Encadenar el exchange para obtener el token de Sanctum
    switchMap(() => this.exchangeFirebaseToken())
  );
}
   nuevoUsuario(email:string, pass:string){
    const authData ={
      email: email,
      password: pass,
      returnSecureToken: true
    };
    return this.http.post<AuthResponse>(
      `${this.fbNewUserUrl}${ this.apiKey}`,authData
    ).pipe(
      map( resp=>{
        this.guardarToken(resp.idToken);
        this.guardarProfile(resp.localId);
        return resp;
      })
    );
   }

   cambiarContrasena(idToken:string, newPass:string){
    const authData ={
      idtoken: idToken,
      newPass: newPass,
      returnSecureToken: true
    };
    return this.http.post(
      `${this.fbChangePasswdUrl}${ this.apiKey}`,authData
    );    
   }

   passwordResetByemail(email:string){
    const authData={
      requestType: "PASSWORD_RESET",
      email: email
    };
    return this.http.post(
      `${this.fbemailConfirmPasswUrl}${ this.apiKey}`,authData
    );  
   }

   confirmResetPassword(resetCod:string, newPass:string){
    const authData={
      oobCode: resetCod,
      newPassword: newPass
    };
    console.log('confirmar restablecimiento constrasena',authData);
    return this.http.post(
      `${this.fbconfirmRestorePasswdUrl}${ this.apiKey}`,authData
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
    // }
  }
  getEmail(): string {
    this.email = localStorage.getItem('email') ?? '';
    return this.email;
  }

  getLocalId(): string {
    this.localId = localStorage.getItem('localId') ?? '';
    return this.localId;
  }

  private guardarProfile(localId: string){
    localStorage.setItem('localId', localId);
  }
 
  /**
 * Intercambia el idToken de Firebase por un token de Sanctum.
 * Devuelve un Observable con la respuesta.
 */
exchangeFirebaseToken(): Observable<any> {
  const idToken = localStorage.getItem('token');   // el de Firebase

  return this.http.post<any>(`${this.apiUrl}auth/exchange`, {
    id_token: idToken
  }).pipe(
    tap((resp: any) => {
      if (resp.success && resp.token) {
        localStorage.setItem('sanctum_token', resp.token);
        console.log('✅ Token de Sanctum guardado');
      }
    })
  );
}

/**
 * Obtiene el token de Sanctum para las peticiones API.
 */
getSanctumToken(): string {
  return localStorage.getItem('sanctum_token') ?? '';
}

/**
 * Limpia los tokens al hacer logout.
 */
logoutAll(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('expira');
  localStorage.removeItem('localId');
  localStorage.removeItem('sanctum_token');
}


}
