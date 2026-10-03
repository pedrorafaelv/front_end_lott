import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GroupFichasResponse } from '../interfaces/get-groupficha-get-group';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupfichasService {
  private baseUrl= `${environment.apiUrl}groupFicha`;

  constructor( private Http: HttpClient) { }
  
  getGroupFicha(){
     return this.Http.get(`${this.baseUrl}/getGroupFicha`);
  }
  
  getGroupFichas():Observable<GroupFichasResponse>{
    return this.Http.get<GroupFichasResponse>(`${this.baseUrl}/getGroups`);
  }

}
