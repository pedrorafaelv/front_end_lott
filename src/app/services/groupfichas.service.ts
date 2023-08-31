import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupfichasService {
  private baseUrl= 'http://127.0.0.1:8000/api/GroupFicha';

  constructor( private Http: HttpClient) { }
  
  getGroupFichas(){
    return this.Http.get(`${this.baseUrl}`);

  }
  
  getGroupFicha(id:string){
    return this.Http.get(`${this.baseUrl}/getGroupFicha/${id}`);
  }

}
