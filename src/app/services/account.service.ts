import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    AccountSummary,
    AccountTransaction,
    ApiResponse,
    SummaryResponse,
    TransactionFilters,
    TransactionsResponse,
} from '../interfaces/account.interface';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * 📊 Obtener resumen completo del usuario
     */
    getSummary(userId: number): Observable<SummaryResponse> {
        return this.http.get<SummaryResponse>(
            `${this.baseUrl}account/summary`,
            { params: new HttpParams().set('user_id', userId.toString()) }
        );
    }

    /**
     * 📋 Obtener listado de transacciones con filtros y paginación
     */
    getTransactions(userId: number, filters: Partial<TransactionFilters>): Observable<TransactionsResponse> {
        let params = new HttpParams().set('user_id', userId.toString());

        if (filters.currency_code) params = params.set('currency_code', filters.currency_code);
        if (filters.via_id) params = params.set('via_id', filters.via_id.toString());
        if (filters.type) params = params.set('type', filters.type);
        if (filters.date_from) params = params.set('date_from', filters.date_from);
        if (filters.date_to) params = params.set('date_to', filters.date_to);
        if (filters.amount_min) params = params.set('amount_min', filters.amount_min.toString());
        if (filters.amount_max) params = params.set('amount_max', filters.amount_max.toString());
        if (filters.page) params = params.set('page', filters.page.toString());
        if (filters.per_page) params = params.set('per_page', filters.per_page.toString());

        return this.http.get<TransactionsResponse>(
            `${this.baseUrl}account/transactions`,
            { params }
        );
    }

    /**
     * 💰 Verificar si el usuario puede apostar
     */
    checkBet(userId: number, raffleId: number, currencyCode: string): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}account/checkBet`, {
            user_id: userId,
            raffle_id: raffleId,
            currency_code: currencyCode,
        });
    }

    /**
     * 📥 Registrar una transacción genérica
     */
    store(transaction: Partial<AccountTransaction>): Observable<ApiResponse<AccountTransaction>> {
        return this.http.post<ApiResponse<AccountTransaction>>(
            `${this.baseUrl}account/store`,
            transaction
        );
    }
}