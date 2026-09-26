import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { GetGroupsResponse } from '../interfaces/get-groups-response';
import { environment } from '../../environments/environment';
import { Usuario, GetUsersListResponse } from "../models/user.model";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl= `${environment.apiUrl}user/`;
  userToken: any;
  email!: string;
  localStorage!: Storage;
  constructor(private http: HttpClient) { }

  getByLocalId(localId: string ){
    return this.http.get(
      `${ this.baseUrl }getUserByFirebase/${localId}`
    );
}

updateDataFirebase(localId: string, token: string, last_connection: string){
  return this.http.post<any>(`${this.baseUrl}updateDataFirebase/${localId}/${token}/${last_connection}`, { title: 'Angular POST Request ' });
}

 async getUserByLocalId(localId: string){
   const respuesta =  await fetch(`${ this.baseUrl }getUserByFirebase/${localId}`);
   const datos =  await respuesta.json();
   console.log((`${ this.baseUrl }getUserByFirebase/${localId}`));
   console.log('getUserByLocalId', datos);
   return datos;
 }


 async getGroupByUser(userId: string){
  const respuesta =  await fetch(`${ this.baseUrl }getGrupos/${userId}`);
  const datos =  await respuesta.json();
  return datos;
}

getUserLevel(userId: number){
  return this.http.get(
    `${ this.baseUrl }getUserLevel/${userId}`
  );
}
getUserRoles(userId: string){
  return this.http.get(
    `${ this.baseUrl }getUserRoles/${userId}`
  );
}
getUserPermissions(userId: string){
  return this.http.get(
    `${ this.baseUrl }getUserPermissions/${userId}`
  );
}
async getPermissionsByUser(userId: string){

  const respuesta =  await fetch(`${ this.baseUrl }getUserPermissions/${userId}`);
  const datos =  await respuesta.json();
  return datos;

}

getGroups(id: string): Observable<GetGroupsResponse>{

  return this.http.get<GetGroupsResponse>(`${this.baseUrl}getGrupos/${id}`);

}

 singUpUser(email: string, name: string, pass: string, localid: string, token: string){
  // console.log(`${this.baseUrl}newUser/${email}/${name}/${localid}/${token}`);
   return this.http.post<any>(`${this.baseUrl}newUser/${email}/${name}/${pass}/${localid}/${token}`, { title: 'User POST Request'});
 }

 getUserEmailConfirm(correo: string){
    
  return this.http.get<GetGroupsResponse>(`${this.baseUrl}getUserEmailConfirm/${correo}`);

 }


  getUsersList(
    user: string,
    page: number = 1,
    perPage: number = 10,
    search: string = ''
  ): Observable<GetUsersListResponse> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<GetUsersListResponse>(
      `${this.baseUrl}usersList/${user}`,
      { params }
    );
  }
}