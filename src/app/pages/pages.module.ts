import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { CartonesComponent } from './cartones/cartones.component';
import { BuscarComponent } from './buscar/buscar.component';
import { ComponentsModule } from '../components/components.module';
import { PeliculasComponent } from './peliculas/peliculas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JuegoComponent } from './juego/juego.component';
import { GroupsComponent } from './groups/groups.component';
//  import { MovesComponent } from './moves/moves.component';
import { AccountComponent } from './account/account.component';
import { LogOutComponent } from './log-out/log-out.component';
import { LoginComponent } from './log-in/login.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { RaffleComponent } from './raffle/raffle.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";
import { MatNativeDateModule } from "@angular/material/core";
import { RouterModule } from '@angular/router';
import { PoliticsComponent } from './politics/politics.component';
import { PublicityComponent } from './publicity/publicity.component';
import { RecordsComponent } from './records/records.component';
import { CardRaffleComponent } from './card-raffle/card-raffle.component';
import { PipesModule } from '../pipes/pipes.module';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { AuthModule } from "@auth0/auth0-angular";
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

 
@NgModule({
  declarations: [
    HomeComponent,
    CartonesComponent,
    BuscarComponent,
    PeliculasComponent,
    DashboardComponent,
    JuegoComponent,
    GroupsComponent,
    AccountComponent,
    LogOutComponent,
    LoginComponent,
    SingUpComponent ,
    RaffleComponent,
    PoliticsComponent,
    PublicityComponent,
    RecordsComponent,
    CardRaffleComponent,
    PersonalDataComponent,
    CallbackComponent,
    ProfileComponent,
],
  imports: [
    CommonModule,
    ComponentsModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    RouterModule,
    PipesModule,
    FontAwesomeModule,
    AuthModule.forRoot({
      domain: 'dev-hrhrdf6p.us.auth0.com',
      clientId: 'Q9g6JLdE0DAbnc8VBSdC7LKkJbBSehZj'
    }),
  ]
})
export class PagesModule { }
