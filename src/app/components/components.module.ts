import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { FontawesomeComponent } from './fontawesome/fontawesome.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from "@angular/platform-browser";
import { PipesModule } from '../pipes/pipes.module';
import { CartonesPosterGridComponent } from './cartones-poster-grid/cartones-poster-grid.component';
import { FormsModule, ReactiveFormsModule  } from "@angular/forms";
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { TotalComponent } from './total/total.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SlideshowComponent,
    FontawesomeComponent,
    CartonesPosterGridComponent,
    FooterComponent,
    CartComponent,
    TotalComponent,
  ],
   exports:[
     NavbarComponent,
     SlideshowComponent,
     FontawesomeComponent,
     CartonesPosterGridComponent,
     FooterComponent
   ],

  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    BrowserModule,
    PipesModule,
    FormsModule, ReactiveFormsModule
  ]
})
export class ComponentsModule { }
