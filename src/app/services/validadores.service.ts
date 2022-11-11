import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from "rxjs";

interface errorValidate{
  [s:string]: boolean ;
}
@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { 

  }
  passwordsIguales(pass1Name : string, pass2Name :string){

    return(formGroup: FormGroup)=>{
      const pass1Control = formGroup.controls[pass1Name];
      const pass2Control = formGroup.controls[pass2Name];
  
      if (pass1Control.value === pass2Control.value ){
        pass2Control.setErrors(null);
      }else {
        pass2Control.setErrors({noEsIgual: true});
      }
    }

  }
  
  sumaPorcentajes(porcentaje1:string, porcentaje2:string){
    
    return(formGroup: FormGroup)=>{
      const porc1Control = formGroup.controls[porcentaje1];
      const porc2Control = formGroup.controls[porcentaje2];
      if (parseInt(porc1Control.value) + parseInt(porc2Control.value) ===100){
        porc2Control.setErrors(null);
      }else{
        porc2Control.setErrors({noSuma100: true });
      }
      
    } 

  }
  existeUsuario(control: FormControl ): Promise<any> | Observable<errorValidate>{
   
    if (!control.value){
      return Promise.resolve(false);
    }
 
     return new Promise ((resolve, reject) => {
 
       setTimeout(() => {
         if (control.value === 'strider'){
           resolve ({existe:true});
 
         }else{
           resolve(false);
         } 
       }, 3500);
     })
     }

}

function Null(Null: any): Promise<errorValidate> | Observable<errorValidate> {
  throw new Error('Function not implemented.');
}

