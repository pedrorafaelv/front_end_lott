import { Injectable } from '@angular/core';
import { HttpClient, } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, shareReplay } from 'rxjs';
import { GetCurrenciesResponse } from '../interfaces/currency-response.interface';


@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
   private baseUrl = environment.apiUrl;
   private cache$: { [key: string]: Observable<any> } = {};
  constructor(private http: HttpClient) { }

    /**
        * Obtener currencies dque pueden ser vistos por el usuario 
        */
       getCurrenciesCanBeSeeByUser(): Observable<GetCurrenciesResponse> {
           if (!this.cache$['currencies']) {
               this.cache$['currencies'] = this.http.get<GetCurrenciesResponse>(
                   `${this.baseUrl}currencies/canBeSeeByUser`
               ).pipe(shareReplay(1));
           }
           return this.cache$['currencies'];
       }
   

}
