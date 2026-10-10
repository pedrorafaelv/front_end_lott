import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap, switchMap, BehaviorSubject } from 'rxjs';
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
// currentUserId$: any;

// 👇 Signal de admin, inicializado desde localStorage
  private _isAdmin = signal<boolean>(
    localStorage.getItem('is_admin') === 'true'
  );
  readonly isAdmin = this._isAdmin.asReadonly();

  // 👇 Signal de autenticación (para el navbar)
  private _isAuthenticated = signal<boolean>(
    !!localStorage.getItem('token') && !!localStorage.getItem('sanctum_token')
  );
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  // 👇 Computed: admin Y autenticado a la vez
  readonly isAdminAuthenticated = computed(
    () => this._isAuthenticated() && this._isAdmin()
  );

  private currentUserId$ = new BehaviorSubject<number | null>(
    Number(localStorage.getItem('user_id')) || null
  );

  constructor(private http: HttpClient) {
    this.leerToken();
  }
  

  login(email: string, pass: string): Observable<any> {
  const authData = { email, password: pass, returnSecureToken: true };

  return this.http.post<AuthResponse>(
    `${this.fbLoginUrl}${this.apiKey}`,
    authData
  ).pipe(
    tap((resp) => {
      this.guardarToken(resp.idToken);
      this.guardarProfile(resp.localId);
    }),
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
      // hoy.setSeconds( 3600 );
      hoy.setTime(hoy.getTime() + 3600 * 1000); // 1 hora en milisegundos
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
 console.log('🔄 Intercambiando token de Firebase por token de Sanctum...');
  return this.http.post<any>(`${this.apiUrl}auth/exchange`, {
    id_token: idToken
  }).pipe(
    tap((resp: any) => {
      if (resp.success && resp.token) {
        localStorage.setItem('sanctum_token', resp.token);
        localStorage.setItem('user_id', resp.user.id);       // 👈 id interno de tu BD
        localStorage.setItem('is_admin', String(resp.user.is_admin));  

        this.currentUserId$.next(resp.user.id);               // 👈 lo exponemos reactivamente
         this._isAdmin.set(resp.user.is_admin === true);                 
          this._isAuthenticated.set(true);                                
        localStorage.setItem('is_admin', resp.user.is_admin);


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
    ['token', 'expira', 'localId', 'sanctum_token', 'user_id', 'is_admin', 'refresh_token']
      .forEach(k => localStorage.removeItem(k));

    this.currentUserId$.next(null);
    this._isAdmin.set(false);            // 👈 resetear signal
    this._isAuthenticated.set(false);    // 👈 resetear signal
  }
// private currentUserId$ = new BehaviorSubject<number | null>(
//   Number(localStorage.getItem('user_id')) || null
// );

getUserId$(): Observable<number | null> {
  return this.currentUserId$.asObservable();
}

getUserId(): number | null {
  return this.currentUserId$.value;
}

}
