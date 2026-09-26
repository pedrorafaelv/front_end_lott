import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

     // 👇 No tocar peticiones a dominios externos (Firebase, Google, etc.)
    // Solo interceptar las llamadas a TU API de Laravel
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }
    // Obtener el token de Sanctum del localStorage
    const sanctumToken = this.authService.getSanctumToken();

    const cloned = req.clone({
      setHeaders: {
        'Accept': 'application/json',
        'Authorization': sanctumToken ? `Bearer ${sanctumToken}` : ''
      }
    });

    return next.handle(cloned);
  }
}