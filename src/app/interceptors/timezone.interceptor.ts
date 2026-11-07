import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';

@Injectable()
export class TimezoneInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Si no es tu API, no tocar (evita romper Firebase/CORS)
    if (!req.url.startsWith(environment.apiUrl)) {
      return next.handle(req);
    }

    const tz = this.detectTimezone();   // ← ahora sí existe
    return next.handle(req.clone({
      setHeaders: { 'X-Timezone': tz },
    }));
  }

  private detectTimezone(): string {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return detected || environment.defaultTimezone;
    } catch {
      return environment.defaultTimezone;
    }
  }
}