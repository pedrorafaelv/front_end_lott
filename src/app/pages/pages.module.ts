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
import { MovesComponent } from './moves/moves.component';
import { AccountComponent } from './account/account.component';
import { LogOutComponent } from './log-out/log-out.component';
import { LoginComponent } from './log-in/login.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { RaffleComponent } from './raffle/raffle.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field'; import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
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
import { ScrollingModule } from "@angular/cdk/scrolling";
import { NotImageDirective } from '../directives/not-image.directive';
import { MessageComponent } from './message/message.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { UsersComponent } from './users/users.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { FontawesomeComponent } from '../components/fontawesome/fontawesome.component';

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
    MovesComponent,
    NotImageDirective,
    MessageComponent,
    EmailConfirmationComponent,
    UsersComponent
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
    HttpClientModule,
    RouterModule,
    PipesModule,
    FontAwesomeModule,
    ScrollingModule,
    AuthModule.forRoot({
      domain: 'dev-hrhrdf6p.us.auth0.com',
      clientId: 'Q9g6JLdE0DAbnc8VBSdC7LKkJbBSehZj'
    }),
  ]
})
export class PagesModule { }
