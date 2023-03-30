import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl= 'http://127.0.0.1:8000/api/User/';
  private apiKey = 'AIzaSyAB-PXIBMGdxsnw1TqIfI9ON_9GZW2D-Co';
  userToken: any;
  email: string;
  localStorage: Storage;
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
  //  console.log('datos en userservices', );
   return datos;
    // return datos;
 }
 async getGroupByUser(userId: string){
  const respuesta =  await fetch(`${ this.baseUrl }getGrupos/${userId}`);
  const datos =  await respuesta.json();
  return datos;
}

}
