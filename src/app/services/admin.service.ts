import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdminService {

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * 🔍 Verifica si el usuario es admin
     */
    checkAdmin(userId: number): Observable<boolean> {
        return this.http.get<any>(
            `${this.baseUrl}user/checkAdmin`,
            { params: new HttpParams().set('user_id', userId.toString()) }
        ).pipe(
            map(resp => resp?.is_admin === true)
        );
    }
}