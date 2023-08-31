import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Group, GetGroupsResponse } from '../interfaces/get-groups-response';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl= 'http://127.0.0.1:8000/api/User';

  constructor(private  Http: HttpClient) {

   }

  getGroups(texto: string): Observable<GetGroupsResponse>{
    return this.Http.get<GetGroupsResponse>(`${this.baseUrl}/getGrupos/${texto}`);
  }
}
