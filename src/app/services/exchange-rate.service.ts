import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ExchangeRate {
  currency_from: string;
  currency_to: string;
  rate: number;
  value_date: string;
  scraped_at: string;
  source: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeRateService {
  private readonly apiUrl = '/api/exchange-rate';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la tasa más reciente desde la BD.
   * Llama al backend, que a su vez consulta la tabla local.
   */
  getLatestRate(): Observable<ExchangeRate> {
    return this.http
      .get<ApiResponse<ExchangeRate>>(`${this.apiUrl}/latest`)
      .pipe(map(res => res.data));
  }

  /**
   * Fuerza una actualización desde el BCV.
   * Solo usar cuando el usuario lo solicite explícitamente.
   */
  refreshRate(): Observable<{ rate: number; message: string }> {
    return this.http
      .post<ApiResponse<{ rate: number; message: string }>>(
        `${this.apiUrl}/refresh`, 
        {}
      )
      .pipe(map(res => res.data));
  }
}