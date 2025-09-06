// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Group, GetGroupsResponse } from '../interfaces/get-groups-response';
// import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Group } from '../interfaces/get-groups-response';

@Injectable({
  providedIn: 'root'
})

// @Injectable({
//   providedIn: 'root'
// })
// export class GroupService {
//   private baseUrl= 'http://127.0.0.1:8000/api/Group/';

//   constructor(private  Http: HttpClient) {

//    }

  

//    newGroup(datos){
//     return this.Http.post(
//       `${this.baseUrl}NewGroup/${datos}`,  { title: 'Angular POST Request Example'}
//     ).pipe(
//       map( resp=>{
//          console.log('resp newgruoup en groupService', resp );
//         return resp;
//       })
//     );
//    }

//   }



export class GroupService {
  private baseUrl = 'http://127.0.0.1:8000/api/group/';

  constructor(private http: HttpClient) {}

  newGroup(datos: Group): Observable<any> {
    const url = `${this.baseUrl}newGroup`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post(url, datos, { headers }).pipe(
      map(resp => {
        console.log('Respuesta de newGroup en GroupService:', resp);
        return resp;
      }),
      catchError(this.handleError) // Manejo de errores
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error); // Log del error
    return throwError(() => new Error('Error en la solicitud; por favor, inténtelo de nuevo más tarde.'));
  }
}