import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Group } from '../interfaces/get-groups-response';
import { environment } from 'src/environments/environment';

// Interface para la respuesta de putGroup
interface PutGroupResponse {
  message?: string;
  error?: string;
  grupo?: any;
  user?: any;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private baseUrl = `${environment.apiUrl}group/`;
  private baseUrlUser = `${environment.apiUrl}user/`;

  constructor(private http: HttpClient) {}

  newGroup(datos: Group): Observable<Group> {
    const url = `${this.baseUrl}NewGroup/`;
    const headers = new HttpHeaders({ 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = JSON.stringify({
      user_id: datos.user_id,
      user_admin: datos.user_admin,
      name: datos.name,
      description: datos.description || '',
      active: datos.active,
      privacy: datos.privacy,
      start_date: datos.start_date || null,
      end_date: datos.end_date || null
    });
     
    console.log('Body que se enviará:', body);
    console.log('URL completa:', url);
    
    return this.http.post<Group>(url, body, { headers }).pipe(
      map((resp: Group) => {
        console.log('Respuesta exitosa de newGroup:', resp);
        return resp;
      }),
      catchError(this.handleError)
    );
  }

  putGroupUser(user_id: number, group_id: number): Observable<PutGroupResponse> {
    const body = JSON.stringify({ 
      user_id: user_id, 
      group_id: group_id 
    });
    
    console.log('Body que se enviará en putGroupUser:', body);
    
    const url = `${this.baseUrlUser}putGroup/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    return this.http.post<PutGroupResponse>(url, body, { headers }).pipe(
      map(resp => {
        console.log('Respuesta exitosa de putGroupUser:', resp);
        return resp;
      }),
      catchError(this.handlePutGroupError) // Manejo de errores específico
    );
  }

  // Manejo de erroes específico para putGroup
  private handlePutGroupError(error: any): Observable<never> {
    console.error('Error en putGroupUser:', error);
    
    // Errores específicos del backend
    if (error.status === 401 && error.error?.error) {
      return throwError(() => new Error(
        `Error al agregar usuario al grupo: ${error.error.error}`
      ));
    }
    
    return throwError(() => new Error(
      error.error?.message || 
      error.error?.error ||
      'Error al agregar usuario al grupo; por favor, inténtelo de nuevo.'
    ));
  }

  private handleError(error: any): Observable<never> {
    console.error('Error completo en la solicitud:', error);
    
    return throwError(() => new Error(
      error.error?.message || 
      'Error en la solicitud; por favor, inténtelo de nuevo más tarde.'
    ));
  }
}




// import { Group } from '../interfaces/get-groups-response'; import { environment } from 'src/environments/environment';
// import { error } from 'console';
// // import { u } from '@angular/cdk/scrolling-module.d-ud2XrbF8';

// @Injectable({
//   providedIn: 'root'
// })

// export class GroupService {
//   private baseUrl = `${environment.apiUrl}group/`;
//   private baseUrlUser = `${environment.apiUrl}user/`;
//   newg:Group;

//   constructor(private http: HttpClient) {}

//   newGroup(datos: Group): Observable<Group> {
//      // Depuración detallada
//     // console.log('Datos recibidos en newGroup:', datos);
//     // console.log('Tipo de datos:', typeof datos);
//     // console.log('Propiedades de datos:', Object.keys(datos))

//     const url = `${this.baseUrl}NewGroup/`;
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json',
//     'Accept': 'application/json'
//     });

//       const body = JSON.stringify({
//       user_id: datos.user_id,
//       user_admin: datos.user_admin,
//       name: datos.name,
//       description: datos.description || '',
//       active: datos.active,
//       privacy: datos.privacy,
//       start_date: datos.start_date || null,
//       end_date: datos.end_date || null
//     });
     
//     console.log('Body que se enviará:', body);
//     console.log('URL completa:', url);
//     return this.http.post<Group>(url, body, { headers }).pipe(
//       map((resp: Group) => {
//         console.log('Respuesta exitosa de newGroup:', resp);
//         this.newg = resp;
//         // After creating the group, add the admin user to the group
//         this.putGroupUser({ group: resp }).subscribe(
//           addedResp => {
//             console.log('Usuario agregado al grupo exitosamente:', addedResp);
//           },
//           err => {
//             console.error('Error al agregar usuario al grupo:', err);
//           }
//         );
//         return resp;
//       }),
//       catchError(this.handleError)
//     );
//   }

//   private handleError(error: any): Observable<never> {
//     console.error('Error completo en la solicitud:', error);
//     console.error('Status:', error.status);
//     console.error('Mensaje:', error.message);
//     console.error('Body del error:', error.error);
    
//     return throwError(() => new Error(
//       error.error?.message || 
//       'Error en la solicitud; por favor, inténtelo de nuevo más tarde.'
//     ));
//   }

//  putGroupUser( group:any): Observable<any> {
//     const body2 = JSON.stringify({ 
//       user_id: group.group.group.user_admin, 
//       group_id: group.group.group.id });
//     console.log('Datos recibidos en putGroupUser:', group.group.group);
//     const url = `${this.baseUrlUser}putGroup/`;
//     console.log('URL completa para putGroupUser:', url);
//     const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      
//     setTimeout(() => {    
//     console.log('Body que se enviará en putGroupUser:', body2);

//       return this.http.post(url, body2, { headers }).pipe(
//       map(resp =>{ resp
//          console.log('Respuesta exitosa de putGroupUser:', resp);
//          return resp;
//       }),
//       // console.log('error', error),
//       catchError(this.handleError)
//       // console.log('error', error)
//     );  
//   }, 1000); // Simula un retraso de 1 segundo
//   return new Observable(); // Retorna un Observable vacío mientras tanto  
//   }
// }