import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { AuthModule } from "@auth0/auth0-angular";
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from "@angular/material/core";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Pipes y Directivas
import { PipesModule } from '../pipes/pipes.module';
import { NotImageDirective } from '../directives/not-image.directive';

// Componentes de páginas
import { HomeComponent } from './home/home.component';
import { BuscarComponent } from './buscar/buscar.component';
import { PeliculasComponent } from '../trash/peliculas/peliculas.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { JuegoComponent } from './juego/juego.component';
import { GroupsComponent } from './groups/groups.component';
import { MovesComponent } from '../trash/moves/moves.component';
import { AccountComponent } from './account/account.component';
import { LogOutComponent } from './log-out/log-out.component';
import { LoginComponent } from './log-in/login.component';
import { SingUpComponent } from './sing-up/sing-up.component';
import { RaffleComponent } from './raffle/raffle.component';
import { PoliticsComponent } from '../components/politics/politics.component';
import { PublicityComponent } from '../components/publicity/publicity.component';
import { CardRaffleComponent } from './card-raffle/card-raffle.component';
import { PersonalDataComponent } from './personal-data/personal-data.component';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';
import { MessageComponent } from './message/message.component';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';
import { UsersComponent } from './users/users.component';

// IMPORTAR ComponentsModule para usar sus componentes
import { ComponentsModule } from '../components/components.module';
import { RecordsComponent } from '../components/records/records.component';

@NgModule({
  declarations: [
    BuscarComponent,
    PeliculasComponent,
    DashboardComponent,
    AccountComponent,
    LogOutComponent,
    PoliticsComponent,
    CardRaffleComponent,
    PersonalDataComponent,
    CallbackComponent,
    MovesComponent,
    EmailConfirmationComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    ScrollingModule,
    PipesModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    GroupsComponent,
    UsersComponent,
    JuegoComponent,
    SingUpComponent,
    ProfileComponent,
    LoginComponent,
    HomeComponent,
    PublicityComponent,
    RaffleComponent,
    RecordsComponent,
    MessageComponent, 
    NotImageDirective,
    AuthModule.forRoot({
      domain: 'dev-hrhrdf6p.us.auth0.com',
      clientId: 'Q9g6JLdE0DAbnc8VBSdC7LKkJbBSehZj'
    }),
  ],
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class PagesModule { }