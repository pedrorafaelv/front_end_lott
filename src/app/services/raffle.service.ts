import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetFichasResponse, Ficha } from '../interfaces/get-fichas-response';
import { Observable, map } from 'rxjs';
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
   //console.log('entrando en putRaffle', texto);
  return this.http.post(
    `${this.baseUrl}NewRaffle/${texto}`,  { title: 'Angular POST Request Example' }
  ).pipe(
    map( resp=>{
      return resp;
    })
  );
 }
 
 getFichas(texto: string):Observable<any>{
  // console.log('entrando en getFichas', texto);
  return this.http.get<GetFichasResponse>(`${ this.baseUrl }getFichas/${texto}`);

}

 getNextFicha(raffle: number){
  //  console.log('obteniendo una nueva ficha');
   return this.http.get<any>(`${this.baseUrl}getNewRecord/${raffle}`)
   
 }

 getCardsRaffleByUser(raffleId: string, userId: string){
  return this.http.get<GetCardsRaffleResponse>(`${this.baseUrl}getCardsRaffleByUser/${raffleId}/${userId}`)
 }
  
 getAutoRaffle(texto: string){
  return this.http.get(`${this.baseUrl}autoRaffle/${texto}`)
 }

  putCard(raffle: string, card_id : string, localId: string): any {
   // console.log('asignando un carton al usuario');
   return this.http.post(`${this.baseUrl}putCard/+${raffle}/${card_id}/${localId}`, {title:'put card post service'})
  
  }

  getActiveRafflesByGroup(group_id){
    return this.http.get(`${this.baseUrl}getActiveRafflesByGroup/${group_id}`)
  }

  async getActiveRafflesByGroupAs(group_id){
    const respuesta = await fetch( (`${this.baseUrl}getActiveRafflesByGroup/${group_id}`))
    const datos = await respuesta.json();
    return datos;

  }
  async getCardsRaffleByUserAs(raffle_id, user_id ){
   const resp = await fetch ((`${this.baseUrl}getCardsRaffleByUser/${raffle_id}/${user_id}`))
   const data = await resp.json();
   return data;
  }

  async getActiveRafflesByUser(user_id){
    const resp =  await fetch((`${this.baseUrl}getActiveRafflesByUser/${user_id}`))
    const data= await resp.json();
    return data;
  }

  async getFichasAs(raffle_id){
   const resp = await fetch((`${this.baseUrl}getFichas/${raffle_id}`))
   const fichas = resp.json();
   return  fichas; 

  }
   async getNextRecord(raffle:number){

    const resp =  await fetch(`${this.baseUrl}getNewRecord/${raffle}`)
    const ficha = resp.json();
    return ficha;

   }
}
