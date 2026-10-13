import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';
import { Via, ViasResponse} from '../interfaces/via.interface';

@Injectable({
    providedIn: 'root'
})
export class ViaService {

    private baseUrl = environment.apiUrl;
    private cache$: { [key: string]: Observable<any> } = {};

    constructor(private http: HttpClient) { }

    /**
     * Obtener todas las vías activas
     */
    getAll(): Observable<ViasResponse> {
        if (!this.cache$['all']) {
            this.cache$['all'] = this.http.get<ViasResponse>(
                `${this.baseUrl}vias`
            ).pipe(shareReplay(1));
        }
        return this.cache$['all'];
    }

    /**
     * Obtener vías de tipo credit (para depósitos)
     */
    getCredits(): Observable<ViasResponse> {
        if (!this.cache$['credits']) {
            this.cache$['credits'] = this.http.get<ViasResponse>(
                `${this.baseUrl}vias/credits`
            ).pipe(shareReplay(1));
        }
        return this.cache$['credits'];
    }

    /**
     * Obtener vías de tipo debit (para retiros)
     */
    getDebits(): Observable<ViasResponse> {
        if (!this.cache$['debits']) {
            this.cache$['debits'] = this.http.get<ViasResponse>(
                `${this.baseUrl}vias/debits`
            ).pipe(shareReplay(1));
        }
        return this.cache$['debits'];
    }


    /**
     * Obtener vías de tipo debit (para retiros que pueden ser vistos por el usuario )
     */
    getDebitsCanBeSeeByUser(): Observable<ViasResponse> {
        if (!this.cache$['debits']) {
            this.cache$['debits'] = this.http.get<ViasResponse>(
                `${this.baseUrl}vias/debitsCanBeSeeByUser`
            ).pipe(shareReplay(1));
        }
        return this.cache$['debits'];
    }

    /**
     * Obtener vías de tipo debit (para retiros que pueden ser vistos por el usuario )
     */
    getCreditsCanBeSeeByUser(): Observable<ViasResponse> {
        if (!this.cache$['credits']) {
            this.cache$['credits'] = this.http.get<ViasResponse>(
                `${this.baseUrl}vias/creditsCanBeSeeByUser`
            ).pipe(shareReplay(1));
        }
        return this.cache$['credits'];
    }


    /**
     * Obtener vías por código específico
     */
    getByCode(code: string): Observable<{ data: Via }> {
        return this.http.get<{ data: Via }>(
            `${this.baseUrl}vias/code/${code}`
        );
    }

    /**
     * Limpiar caché
     */
    clearCache(): void {
        this.cache$ = {};
    }
}