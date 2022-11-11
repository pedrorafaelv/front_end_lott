import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetFichasResponse, Ficha } from '../interfaces/get-fichas-response';
import { Observable } from 'rxjs';
import { GetCardsRaffleResponse } from '../interfaces/get-cards-raffle-response';

@Injectable({
  providedIn: 'root'
})

export class RaffleService {
  postId: any;
  record: any; 
  fichas: Ficha[];
  ficha: any;
  baseUrl = 'http://127.0.0.1:8000/api/Raffle/';
  constructor(private http: HttpClient) { 

  }

 putRaffle(texto:string ){
   console.log('entrando en putRaffle', texto);
   return this.http.post<any>(this.baseUrl+'NewRaffle/'+texto,  { title: 'Angular POST Request Example' })
   .subscribe(data => {this.postId = data.id;
  })
 }
 
 getFichas(texto: string):Observable<any>{
  console.log('entrando en getFichas', texto);
  return this.http.get<GetFichasResponse>(this.baseUrl+'getFichas/'+ texto);

}

 nextFicha(raffle: number){
   console.log('obteniendo una nueva ficha');
   return this.http.get<any>(this.baseUrl+'Ficha/'+raffle)
   .subscribe(data=>{this.ficha= data});
 }

 getCardsRaffle(texto: string){
  return this.http.get<GetCardsRaffleResponse>(this.baseUrl+'getCardsRaffle/'+texto)
 }
  
 getAutoRaffle(texto: string){
  return this.http.get(this.baseUrl+'autoRaffle/'+texto)
 }
}
