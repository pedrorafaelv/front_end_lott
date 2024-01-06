import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GetGroupsResponse } from '../interfaces/get-groups-response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl= 'http://127.0.0.1:8000/api/Group/';

  constructor(private  Http: HttpClient) {

   }

  // getGroups(texto: string): Observable<GetGroupsResponse>{
  //   return this.Http.get<GetGroupsResponse>(`${this.baseUrl}/User/getGrupos/${texto}`);
  // }

   newGroup(datos){
    return this.Http.post(
      `${this.baseUrl}NewGroup/${datos}`,  { title: 'Angular POST Request Example'}
    ).pipe(
      map( resp=>{
         console.log('resp newgruoup en groupService', resp );
        return resp;
      })
    );
   }

  }

