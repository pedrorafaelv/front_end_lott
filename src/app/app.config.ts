import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { Routes } from '@angular/router';
import { provideRouter , withComponentInputBinding } from '@angular/router';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withInterceptors  } from '@angular/common/http';
import { routes } from './app.routes';

import { authInterceptor } from './interceptors/auth.interceptor';


// const routes: Routes = [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
      provideHttpClient(withInterceptors([authInterceptor])),

    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: AuthInterceptor,
    //   multi: true,
    // },

  ]
};


