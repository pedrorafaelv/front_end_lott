import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Solo para tu API: nunca añadir tu token a las llamadas a Firebase/Google
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const token = auth.getSanctumToken();

  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  return next(req.clone({ setHeaders: headers })).pipe(
    catchError((err: HttpErrorResponse) => {
      const esAuth = req.url.includes('/auth/');
      if (err.status === 401 && !esAuth) {
        auth.logoutAll();
        router.navigateByUrl('/log-in');
      }
      return throwError(() => err);
    })
  );
};