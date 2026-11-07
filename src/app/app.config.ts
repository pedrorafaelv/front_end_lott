import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { Routes } from '@angular/router';
import { provideRouter , withComponentInputBinding } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withInterceptors  } from '@angular/common/http';
import { routes } from './app.routes';

import { authInterceptor } from './interceptors/auth.interceptor';
import { TimezoneInterceptor } from './interceptors/timezone.interceptor';


// const routes: Routes = [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withInterceptors([authInterceptor])),
    // TimezoneInterceptor is class-based and is registered through DI below.

    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimezoneInterceptor,
      multi: true,
    },

  ]
};


