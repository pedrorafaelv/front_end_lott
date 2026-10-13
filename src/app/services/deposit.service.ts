import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DepositPayload, DepositRequest } from '../interfaces/deposit.interface';

@Injectable({
    providedIn: 'root'
})
export class DepositService {

    private baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    /**
     * 📥 Usuario reporta un nuevo depósito
     * Usa FormData para poder enviar el comprobante
     */
    requestDeposit(payload: DepositPayload): Observable<any> {
        const formData = new FormData();

        formData.append('user_id', payload.user_id.toString());
        formData.append('currency_id', payload.currency_id.toString());
        formData.append('amount', payload.amount.toString());
        formData.append('via_id', payload.via_id.toString());

        if (payload.reference) formData.append('reference', payload.reference);
        if (payload.user_notes) formData.append('user_notes', payload.user_notes);
        if (payload.voucher) formData.append('voucher', payload.voucher);

        return this.http.post<any>(
            `${this.baseUrl}account/requestDeposit`,
            formData
        );
    }

    /**
     * ❌ Cancelar solicitud de depósito pendiente
     */
    cancelDeposit(depositId: number, userId: number): Observable<any> {
        return this.http.post<any>(
            `${this.baseUrl}account/cancelDeposit`,
            { deposit_id: depositId, user_id: userId }
        );
    }

    /**
     * 📋 Listar mis depósitos activos
     */
    myDeposits(userId: number): Observable<{ success: boolean; data: DepositRequest[] }> {
        return this.http.get<{ success: boolean; data: DepositRequest[] }>(
            `${this.baseUrl}account/myDeposits`,
            { params: new HttpParams().set('user_id', userId.toString()) }
        );
    }

    /**
     * 📋 Listar todos los depósitos (admin)
     */
    getAll(filters: any = {}): Observable<any> {
        let params = new HttpParams();
        if (filters.status) params = params.set('status', filters.status);
        if (filters.currency_code) params = params.set('currency_code', filters.currency_code);
        if (filters.user_id) params = params.set('user_id', filters.user_id.toString());
        if (filters.date_from) params = params.set('date_from', filters.date_from);
        if (filters.date_to) params = params.set('date_to', filters.date_to);
        if (filters.search) params = params.set('search', filters.search);
        if (filters.page) params = params.set('page', filters.page.toString());
        if (filters.per_page) params = params.set('per_page', filters.per_page.toString());

        return this.http.get(`${this.baseUrl}admin/deposits`, { params });
    }

    /**
     * 🔍 Detalle de un depósito (admin)
     */
    getDetail(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}admin/deposits/${id}`);
    }

    /**
     * ✅ Aprobar (admin)
     */
    approve(id: number, data: { admin_id: number; admin_notes?: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}admin/deposits/${id}/approve`, data);
    }

    /**
     * ❌ Rechazar (admin)
     */
    reject(id: number, data: { admin_id: number; admin_notes: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}admin/deposits/${id}/reject`, data);
    }

    /**
     * 💰 Completar (admin) - acredita al balance
     */
    complete(id: number, data: { admin_id: number; admin_notes?: string }): Observable<any> {
        return this.http.post(`${this.baseUrl}admin/deposits/${id}/complete`, data);
    }

    /**
     * 📊 Estadísticas (admin)
     */
    getStats(dateFrom?: string, dateTo?: string): Observable<any> {
        let params = new HttpParams();
        if (dateFrom) params = params.set('date_from', dateFrom);
        if (dateTo) params = params.set('date_to', dateTo);
        return this.http.get(`${this.baseUrl}admin/deposits/stats`, { params });
    }

    /**
     * 📥 Exportar (admin)
     */
    export(filters: any = {}): Observable<any> {
        let params = new HttpParams();
        if (filters.status) params = params.set('status', filters.status);
        if (filters.currency_code) params = params.set('currency_code', filters.currency_code);
        if (filters.date_from) params = params.set('date_from', filters.date_from);
        if (filters.date_to) params = params.set('date_to', filters.date_to);
        return this.http.get(`${this.baseUrl}admin/deposits/export`, { params });
    }
}