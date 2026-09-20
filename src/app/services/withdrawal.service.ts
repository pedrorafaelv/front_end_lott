import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse, WithdrawalForm, WithdrawalRequest } from '../interfaces/account.interface';

@Injectable({
    providedIn: 'root'
})
export class WithdrawalService {

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * 💸 Solicitar un retiro
     */
    requestWithdrawal(form: WithdrawalForm): Observable<ApiResponse<WithdrawalRequest>> {
        return this.http.post<ApiResponse<WithdrawalRequest>>(
            `${this.baseUrl}account/requestWithdrawal`,
            form
        );
    }

    /**
     * 📋 Obtener mis solicitudes de retiro
     */
    myWithdrawals(userId: number): Observable<ApiResponse<WithdrawalRequest[]>> {
        return this.http.get<ApiResponse<WithdrawalRequest[]>>(
            `${this.baseUrl}account/myWithdrawals`,
            { params: new HttpParams().set('user_id', userId.toString()) }
        );
    }

    /**
     * ❌ Cancelar una solicitud de retiro
     */
    cancelWithdrawal(withdrawalId: number, userId: number): Observable<ApiResponse<any>> {
        return this.http.post<ApiResponse<any>>(
            `${this.baseUrl}account/cancelWithdrawal`,
            { withdrawal_id: withdrawalId, user_id: userId }
        );
    }
}