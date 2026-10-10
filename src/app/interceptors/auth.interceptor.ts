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

    // 1. No tocar peticiones a dominios externos (Firebase, Google, etc.)
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    // 2. 👇 URLs de tu API que NO deben llevar el token Sanctum
    const excludedUrls = [
      '/auth/exchange',
      '/auth/login',
      '/auth/register',
    ];

    const isExcluded = excludedUrls.some(url => req.url.includes(url));

    if (isExcluded) {
      // Deja la petición sin Authorization, pero con Accept JSON
      const cloned = req.clone({
        setHeaders: { 'Accept': 'application/json' },
      });
      return next.handle(cloned);
    }

    // 3. Para el resto de la API, añade el token Sanctum si existe
    const sanctumToken = this.authService.getSanctumToken();

    const cloned = req.clone({
      setHeaders: {
        'Accept': 'application/json',
        ...(sanctumToken ? { 'Authorization': `Bearer ${sanctumToken}` } : {}),
      },
    });

    return next.handle(cloned);
  }
}