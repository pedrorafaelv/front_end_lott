import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { card, CardResponse } from '../interfaces/card-response';
import { map, tap } from 'rxjs/operators';
import { compileNgModule } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class CartonesService {
  private cardPage=1;
  public cargando:boolean = false;
  constructor(private http: HttpClient ) {

   }
  getCartones ():Observable<CardResponse>{
      return this.http.get<CardResponse>('http://127.0.0.1:8000/api/Card');
      // .pipe( map( (resp)=>resp.card)
      
        // tap(()=>{
        //     this.cardPage += 1;
        //      this.cargando = false;
        // })
      // );
      
   }

}
