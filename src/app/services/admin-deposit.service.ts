import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    AdminDepositFilters,
    ApproveAction,
    CompleteAction,
    DepositDetailResponse,
    DepositsListResponse,
    ManualDepositPayload,
    RejectAction,
    StatsResponse,
    UsersSearchResponse,
} from '../interfaces/admin-deposit.interface';

@Injectable({
    providedIn: 'root'
})
export class AdminDepositService {

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // ============================================
    // LISTADO
    // ============================================
    getDeposits(filters: Partial<AdminDepositFilters>): Observable<DepositsListResponse> {
        let params = new HttpParams();

        if (filters.status) params = params.set('status', filters.status);
        if (filters.currency_code) params = params.set('currency_code', filters.currency_code);
        if (filters.user_id) params = params.set('user_id', filters.user_id.toString());
        if (filters.date_from) params = params.set('date_from', filters.date_from);
        if (filters.date_to) params = params.set('date_to', filters.date_to);
        if (filters.search) params = params.set('search', filters.search);
        if (filters.page) params = params.set('page', filters.page.toString());
        if (filters.per_page) params = params.set('per_page', filters.per_page.toString());

        return this.http.get<DepositsListResponse>(
            `${this.baseUrl}admin/deposits`,
            { params }
        );
    }

    // ============================================
    // DETALLE
    // ============================================
    getDepositDetail(id: number): Observable<DepositDetailResponse> {
        return this.http.get<DepositDetailResponse>(
            `${this.baseUrl}admin/deposits/${id}`
        );
    }

    // ============================================
    // ACCIONES
    // ============================================
    approve(id: number, action: ApproveAction): Observable<any> {
        return this.http.post(
            `${this.baseUrl}admin/deposits/${id}/approve`,
            action
        );
    }

    reject(id: number, action: RejectAction): Observable<any> {
        return this.http.post(
            `${this.baseUrl}admin/deposits/${id}/reject`,
            action
        );
    }

    complete(id: number, action: CompleteAction): Observable<any> {
        return this.http.post(
            `${this.baseUrl}admin/deposits/${id}/complete`,
            action
        );
    }

    // ============================================
    // CREAR MANUAL
    // ============================================
    createManual(payload: ManualDepositPayload): Observable<any> {
        return this.http.post(
            `${this.baseUrl}admin/deposits/manual`,
            payload
        );
    }

    // ============================================
    // ESTADÍSTICAS
    // ============================================
    getStats(dateFrom?: string, dateTo?: string): Observable<StatsResponse> {
        let params = new HttpParams();
        if (dateFrom) params = params.set('date_from', dateFrom);
        if (dateTo) params = params.set('date_to', dateTo);

        return this.http.get<StatsResponse>(
            `${this.baseUrl}admin/deposits/stats`,
            { params }
        );
    }

    // ============================================
    // EXPORTAR
    // ============================================
    export(filters: Partial<AdminDepositFilters>): Observable<any> {
        let params = new HttpParams();
        if (filters.status) params = params.set('status', filters.status);
        if (filters.currency_code) params = params.set('currency_code', filters.currency_code);
        if (filters.date_from) params = params.set('date_from', filters.date_from);
        if (filters.date_to) params = params.set('date_to', filters.date_to);

        return this.http.get<any>(
            `${this.baseUrl}admin/deposits/export`,
            { params }
        );
    }

    // ============================================
    // BUSCAR USUARIOS
    // ============================================
    searchUsers(query: string): Observable<UsersSearchResponse> {
        return this.http.get<UsersSearchResponse>(
            `${this.baseUrl}admin/users/search`,
            { params: new HttpParams().set('q', query) }
        );
    }
}