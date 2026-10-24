import { computed, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom, map, Observable } from 'rxjs';
import { GetGroupsResponse } from '../interfaces/get-groups-response';
import { environment } from '../../environments/environment';
import { GetUsersListResponse } from "../models/user.model";
import { User } from '@auth0/auth0-angular';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl= `${environment.apiUrl}user/`;
  userToken: any;
  email!: string;
  localStorage!: Storage;
  id!: string;
  user:any;

  // Signal privado para el estado del usuario
  private userSignal = signal<User | null>(null);
  
  // Signal público de solo lectura para que los componentes lean el usuario
  public readonly currentUser = this.userSignal.asReadonly();

  // Computed para obtener el ID fácilmente (si se necesita mucho)
  public readonly userId = computed(() => this.userSignal() ? this.id : undefined);

  constructor(private http: HttpClient) { }

 getUserByLocalId(localId: string) {
   return this.http.get(`${this.baseUrl}getUserByFirebase/${localId}`);
 }

getGroupByUser(userId: string) {
  return firstValueFrom(this.http.get<any>(`${this.baseUrl}getGrupos/${userId}`));
}

getPermissionsByUser(userId: string) {
  return firstValueFrom(this.http.get<any>(`${this.baseUrl}getUserPermissions/${userId}`));
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

getUserPermissions(userId: number){
  return this.http.get(
    `${ this.baseUrl }getUserPermissions/${userId}`
  );
}


getGroups(id: string): Observable<GetGroupsResponse>{
  return this.http.get<GetGroupsResponse>(`${this.baseUrl}getGrupos/${id}`);
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

LoadUserData(id: number): Observable<any>{
   let params = new HttpParams()
      .set('id', id.toString())

    return this.http.get<any>(`${this.baseUrl}getUserData`, { params });

}

getUserPersonalData(id:number){
  return this.http.get<any>(`${this.baseUrl}userData/${id}`);
}


//  singUpUser(email: string, name: string, pass: string, localid: string, token: string){
//   // console.log(`${this.baseUrl}newUser/${email}/${name}/${localid}/${token}`);
//    return this.http.post<any>(`${this.baseUrl}newUser/${email}/${name}/${pass}/${localid}/${token}`, { title: 'User POST Request'});
//  }

//  getUserEmailConfirm(correo: string){
    
//   return this.http.get<GetGroupsResponse>(`${this.baseUrl}getUserEmailConfirm/${correo}`);

//  }


  
}