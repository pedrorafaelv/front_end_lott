import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetFichasResponse, Ficha } from '../interfaces/get-fichas-response';
import { Observable, map, tap } from 'rxjs';
import { GetCardsRaffleResponse } from '../interfaces/get-cards-raffle-response';
import { GetCardAvailableRaffleResponse } from '../interfaces/get-card-available-raffle-response';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})

export class RaffleService {
  postId: any;
  record: any; 
  fichas: Ficha[] = [];
  ficha: any;
  baseUrl = `${environment.apiUrl}raffle/`;
  constructor(private http: HttpClient) { 
  }

 putRaffle(texto:string ){
   //console.log('entrando en putRaffle', texto);
  return this.http.post(
    `${this.baseUrl}NewRaffle/${texto}`,  { title: 'Angular POST Request Example'}
  ).pipe(
    map( resp=>{
      console.log('respuesta de putRaffle', resp);
      return resp;
    })
  );
 }
 
 getFichas(texto: string):Observable<any>{
  // console.log('entrando en getFichas', texto);
  return this.http.get<GetFichasResponse>(`${ this.baseUrl }getFichas/${texto}`);
}

 getNextFicha(raffle: number) {
    return this.http.get<any>(`${this.baseUrl}getNewRecord/${raffle}`, {}).pipe(
        tap(data => {
            console.log('📦 Datos recibidos:', data);
            console.log('🔍 JSON formateado:', JSON.stringify(data, null, 2));
        }),
        tap({
            error: err => console.error('❌ Error recibido:', err)
        })
    );
}

 getCardsRaffleByUser(raffleId: string, userId: number){
  return this.http.get<GetCardsRaffleResponse>(`${this.baseUrl}getCardsRaffleByUser/${raffleId}/${userId}`)
 }
  
 getAutoRaffle(texto: string){
  return this.http.get(`${this.baseUrl}autoRaffle/${texto}`)
 }
 

 /**Asigna una carton al usario para el sorteo seleccionado  */
 putCard(raffleId: number, cardId: number, userId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/putCard/${raffleId}/${cardId}/${userId}`, {});
  }

  /**Obtiene los sorteos activos por grupo  */
  getActiveRafflesByGroup(group_id: number){
    return this.http.get(`${this.baseUrl}getActiveRafflesByGroup/${group_id}`)
  }


  async getActiveRafflesByGroupAs(group_id:number){
    const respuesta = await fetch( (`${this.baseUrl}getActiveRafflesByGroup/${group_id}`))
    const datos = await respuesta.json();
    return datos;
  }
  
  async getCardsRaffleByUserAs(raffle_id: number, user_id: number){
   const resp = await fetch ((`${this.baseUrl}getCardsRaffleByUser/${raffle_id}/${user_id}`))
   const data = await resp.json();
   return data;
  }

  async getActiveRafflesByUser(user_id: number ){
    const resp =  await fetch((`${this.baseUrl}getActiveRafflesByUser/${user_id}`))
    const data= await resp.json();
    return data;
  }

  async getDetailActiveRafflesByUser(user_id: number){
    console.log('obteniendo detalle de rifas activas por usuario', user_id);
    const resp =  await fetch((`${this.baseUrl}getDetailActiveRafflesByUser/${user_id}`))
    const data= await resp.json();
    return data;
  }

  async getFichasAs(raffle_id: number){
   const resp = await fetch((`${this.baseUrl}getFichas/${raffle_id}`))
   const fichas = resp.json();
   return  fichas; 

  }
/** Obtiene una nueva ficha para el sorteo solo lo usa el administrador del sorteo */
   async getNextRecord(raffle:number){
    const resp =  await fetch(`${this.baseUrl}getNewRecord/${raffle}`)
    const ficha = resp.json();
    console.log('obteniendo siguiente ficha para la rifa', raffle, 'ficha obtenida', ficha);
    return ficha;

   }

   /**elimina una apuesta de un carton  */
    async deleteCard(raffle_id:number, user_id:number, card_id:number) {
    const resp = await fetch(`${this.baseUrl}cancelBet/${raffle_id}/${user_id}/${card_id}`, 
      { method: 'POST' });   
      return resp.json();
    }


    /**obtiene los detalles del sorteo se usa para obtener el nombre del grupo de fichas  */
     async getRaffleDetails(raffle_id: number){
      const resp = await fetch(`${this.baseUrl}getRaffleDetails/${raffle_id}`);
      // const groupName = await resp.json();
      return resp.json();
    }

    /*Obtiene los cartones disponibles para el sorteo seleccionado */
    async getAvailableCardsByRaffle(raffle: number, user_id?: number): Promise<GetCardAvailableRaffleResponse> {
      if (user_id) {
        const resp = await fetch(`${this.baseUrl}getAvailableCardsByRaffle/${raffle}?user_id=${user_id}`);
        const data = await resp.json();
        return data;
      }
      const resp = await fetch(`${this.baseUrl}getAvailableCardsByRaffle/${raffle}`);
      const data = await resp.json();
      return data;
    }
}
         