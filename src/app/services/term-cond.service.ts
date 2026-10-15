import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  AcceptTermsRequest,
  CurrentAcceptanceResponse,
  LegalDocType,
  TermsAcceptance,
  TermsStatusResponse,
} from '../models/terms-cond.model';
import { environment } from '../../environments/environment';
import {PublicVersionResponse} from '../interfaces/get-public-version-response'; 

@Injectable({ providedIn: 'root' })
export class TermsService {
  private readonly http = inject(HttpClient);
  private baseUrl= environment.apiUrl;
  private readonly api = 'terms';

  /** Cache reactiva del estado global (para guards y UI) */
  private readonly _status = signal<TermsStatusResponse | null>(null);
  readonly status = this._status.asReadonly();

  /**
   * Consulta el estado de aceptación de TODOS los documentos obligatorios.
   * Útil en el guard de rutas protegidas.
   */
  getStatus(): Observable<TermsStatusResponse> {
    return this.http
      .get<TermsStatusResponse>(`${this.baseUrl}${this.api}/status`)
      .pipe(tap((res) => this._status.set(res)));
  }

  

  /**
   * Registra la aceptación.
   * El backend captura IP, User-Agent y timestamp — NUNCA el frontend.
   */
  accept(req: AcceptTermsRequest): Observable<TermsAcceptance> {
    const payload: AcceptTermsRequest = {
      ...req,
      sourceUrl: req.sourceUrl ?? window.location.href,
    };

    return this.http
      .post<TermsAcceptance>(`${this.baseUrl}${this.api}/accept`, payload)
      .pipe(
        tap(() => {
          // Invalida la cache para forzar revalidación en el próximo guard
          this._status.set(null);
        }),
      );
  }

  /** Descarga el certificado PDF de aceptación (para el usuario) */
  downloadCertificate(acceptanceId: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}${this.api}/acceptance/${acceptanceId}/certificate`, {
      responseType: 'blob',
    });
  }

  getPublicVersion(docType: LegalDocType): Observable<PublicVersionResponse> {
    return this.http.get<PublicVersionResponse>(
    `${this.baseUrl}${this.api}/version`, { params: { docType } });
  }

  /** Consulta la aceptación vigente del usuario para un docType concreto */
 
  getCurrent(docType: LegalDocType): Observable<CurrentAcceptanceResponse> {
    return this.http.get<CurrentAcceptanceResponse>(
      `${this.baseUrl}${this.api}/current`, { params: { docType } });
  }
}