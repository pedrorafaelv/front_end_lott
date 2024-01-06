import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = 'http://127.0.0.1:8000/api/Account/';

  constructor(private http: HttpClient) { }


  async getBalance(userId: string, currency : string ){
    //  this.http.get<any>(`${this.baseUrl}getBalanceJson/${userId}`)
    const respuesta =  await fetch(`${ this.baseUrl }getBalanceJson/${userId}/${currency}`);
     console.log('respuesta = en getBalance', respuesta);
    const datos =  await respuesta.json();
    return datos;
  }
}
