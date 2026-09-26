import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient,  } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from './components/components.module';
import { NotImageDirective } from './directives/not-image.directive';
import { UserPermissionsDirective } from './directives/user-permissions.directive';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';   // 👈 añadir HTTP_INTERCEPTORS


@NgModule({ declarations: [
        AppComponent,
        // SandboxComponent,
        UserPermissionsDirective,
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        DragDropModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        ComponentsModule,
        HttpClientModule
    ],
     
    providers: [
            {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
        provideSweetAlert2(),  
    ]
})
export class AppModule { }
