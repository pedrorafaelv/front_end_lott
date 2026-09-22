import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    AdminWithdrawalFilters,
    ApiResponse,
    ApproveAction,
    CompleteAction,
    LogsResponse,
    RejectAction,
    StatsResponse,
    WithdrawalDetailResponse,
    WithdrawalRequest,
    WithdrawalsListResponse,
} from '../interfaces/admin-withdrawal.interface';

@Injectable({
    providedIn: 'root'
})
export class AdminWithdrawalService {

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * 📋 Listar todas las solicitudes con filtros
     */
    getWithdrawals(filters: Partial<AdminWithdrawalFilters>): Observable<WithdrawalsListResponse> {
        let params = new HttpParams();

        if (filters.status) params = params.set('status', filters.status);
        if (filters.currency_code) params = params.set('currency_code', filters.currency_code);
        if (filters.user_id) params = params.set('user_id', filters.user_id.toString());
        if (filters.date_from) params = params.set('date_from', filters.date_from);
        if (filters.date_to) params = params.set('date_to', filters.date_to);
        if (filters.search) params = params.set('search', filters.search);
        if (filters.page) params = params.set('page', filters.page.toString());
        if (filters.per_page) params = params.set('per_page', filters.per_page.toString());

        return this.http.get<WithdrawalsListResponse>(
            `${this.baseUrl}admin/withdrawals`,
            { params }
        );
    }

    /**
     * 🔍 Ver detalle de una solicitud
     */
    getWithdrawalDetail(id: number): Observable<WithdrawalDetailResponse> {
        return this.http.get<WithdrawalDetailResponse>(
            `${this.baseUrl}admin/withdrawals/${id}`
        );
    }

    /**
     * ✅ Aprobar solicitud
     */
    approve(id: number, action: ApproveAction): Observable<ApiResponse<WithdrawalRequest>> {
        return this.http.post<ApiResponse<WithdrawalRequest>>(
            `${this.baseUrl}admin/withdrawals/${id}/approve`,
            action
        );
    }

    /**
     * ❌ Rechazar solicitud
     */
    reject(id: number, action: RejectAction): Observable<ApiResponse<WithdrawalRequest>> {
        return this.http.post<ApiResponse<WithdrawalRequest>>(
            `${this.baseUrl}admin/withdrawals/${id}/reject`,
            action
        );
    }

    /**
     * 💰 Marcar como completado (pago realizado)
     */
    complete(id: number, action: CompleteAction): Observable<ApiResponse<WithdrawalRequest>> {
        return this.http.post<ApiResponse<WithdrawalRequest>>(
            `${this.baseUrl}admin/withdrawals/${id}/complete`,
            action
        );
    }

    /**
     * 📊 Estadísticas
     */
    getStats(dateFrom?: string, dateTo?: string): Observable<StatsResponse> {
        let params = new HttpParams();
        if (dateFrom) params = params.set('date_from', dateFrom);
        if (dateTo) params = params.set('date_to', dateTo);

        return this.http.get<StatsResponse>(
            `${this.baseUrl}admin/withdrawals/stats`,
            { params }
        );
    }

    /**
     * 📜 Logs de una solicitud
     */
    getLogs(id: number): Observable<LogsResponse> {
        return this.http.get<LogsResponse>(
            `${this.baseUrl}admin/withdrawals/${id}/logs`
        );
    }

    /**
     * 📥 Exportar listado
     */
    export(filters: Partial<AdminWithdrawalFilters>): Observable<any> {
        let params = new HttpParams();
        if (filters.status) params = params.set('status', filters.status);
        if (filters.currency_code) params = params.set('currency_code', filters.currency_code);
        if (filters.date_from) params = params.set('date_from', filters.date_from);
        if (filters.date_to) params = params.set('date_to', filters.date_to);

        return this.http.get<any>(
            `${this.baseUrl}admin/withdrawals/export`,
            { params }
        );
    }
}