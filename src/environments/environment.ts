// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api/',
  Firebase_apiKey: "AIzaSyCY8stzMT8SVuqJYp24v0mpmWppXkYewjM",
};

export const firebaseUrl={
  //login
  login: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=',

   //nuevo usuario
  newUser:'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=',

  //cambiar contraseña
  changePasswd: 'https://identitytoolkit.googleapis.com/v1/accounts:update?key=',

  //enviar correo de restablecimiento de contraseña
  emailConfirmPassw: 'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=',
  
  // confirmar restablecimiento de contraseña
   confirmRestorePasswd:'https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=[API_KEY]'
}

 export const firebaseConfig = {
  apiKey: "AIzaSyCY8stzMT8SVuqJYp24v0mpmWppXkYewjM",
  authDomain: "lotteapp-d4cba.firebaseapp.com",
  projectId: "lotteapp-d4cba",
  storageBucket: "lotteapp-d4cba.firebasestorage.app",
  messagingSenderId: "372154165741",
  appId: "1:372154165741:web:6f23fe9249cb531f909fe4",
  measurementId: "G-BC17K6J8Q5"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
