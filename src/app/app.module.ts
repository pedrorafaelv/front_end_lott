import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { CartonComponent } from './trash/carton/carton.component';
import { HttpClientModule } from '@angular/common/http';
import { SandboxComponent } from './sandbox/sandbox.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { CartonnComponent } from './pages/cartonn/cartonn.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentsModule } from './components/components.module';
import { PagesModule } from './pages/pages.module';
import { NotImageDirective } from './directives/not-image.directive';


@NgModule({
  declarations: [
    AppComponent,
    SandboxComponent,
    NotImageDirective,
    // CartonnComponent,
    // CartonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    HttpClientModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    ComponentsModule,
    PagesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
