import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SandboxComponent } from './sandbox/sandbox.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from './components/components.module';
// import { PagesModule } from './pages/pages.module';
import { NotImageDirective } from './directives/not-image.directive';
import { UserPermissionsDirective } from './directives/user-permissions.directive';
import { FooterComponent } from './components/footer/footer.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({ declarations: [
        AppComponent,
        SandboxComponent,
        UserPermissionsDirective,
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        DragDropModule,
        FontAwesomeModule,
        BrowserAnimationsModule,
        ComponentsModule,
        FooterComponent,     
        SweetAlert2Module.forRoot()   
    ],
     
    providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
