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
  private  raffle_id: string ;
  public cargando:boolean = false;
  private baseUrl = "http://127.0.0.1:8000/api";
  constructor(private http: HttpClient ) {

   }
  getCartones ():Observable<CardResponse>{
      return this.http.get<CardResponse>(`${this.baseUrl}/Card`);
      // .pipe( map( (resp)=>resp.card)
      
        // tap(()=>{
        //     this.cardPage += 1;
        //      this.cargando = false;
        // })
      // );
      
   }
   getAvailableCards(raffle: string):Observable<CardResponse>{
    return this.http.get<CardResponse>(
      `${this.baseUrl}/card/getAvailableCards/${raffle}`
    )  
 }
 getAvailableCardsByGroup(group: string):Observable<CardResponse>{
  return this.http.get<CardResponse>(
    `${this.baseUrl}/card/getAvailableCardsByGroup/${group}`
  )  
}
}
