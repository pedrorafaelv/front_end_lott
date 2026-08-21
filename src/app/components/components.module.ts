import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserModule } from "@angular/platform-browser";
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Componentes
import { NavbarComponent } from './navbar/navbar.component';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { FontawesomeComponent } from './fontawesome/fontawesome.component';
import { CartonesPosterGridComponent } from './cartones-poster-grid/cartones-poster-grid.component';
import { FooterComponent } from './footer/footer.component';
import { CartComponent } from './cart/cart.component';
import { TotalComponent } from './total/total.component';
import { SeleccionCartonesComponent } from './seleccion-cartones/seleccion-cartones.component';
import { CarruselCartonesComponent } from "./carrusel-cartones/carrusel-cartones.component";

// SOLO UN CartonComponent - El que está en pages/carton
import { CartonComponent } from './carton/carton.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SlideshowComponent,
    FontawesomeComponent,
    CartonesPosterGridComponent,
    CartComponent,
    TotalComponent, 
  ],
  exports: [
    NavbarComponent,
    SlideshowComponent,
    FontawesomeComponent,
    CartonesPosterGridComponent,
    CartComponent,
    TotalComponent,
    FooterComponent,
    SeleccionCartonesComponent,
    CarruselCartonesComponent,
    CartonComponent,  // <-- Exportar para usar en otros módulos
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    BrowserModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    FooterComponent,
    SeleccionCartonesComponent,
    CarruselCartonesComponent,
    CartonComponent,  // <-- Solo una vez
  ]
})
export class ComponentsModule { }