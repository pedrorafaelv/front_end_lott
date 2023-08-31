import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscarComponent } from './pages/buscar/buscar.component';
import { CartonesComponent } from './pages/cartones/cartones.component';
import { HomeComponent } from './pages/home/home.component';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JuegoComponent } from './pages/juego/juego.component';
import { GroupsComponent } from './pages/groups/groups.component';
import { RaffleComponent } from './pages/raffle/raffle.component';
import { AccountComponent } from './pages/account/account.component';
import { MovesComponent } from './pages/moves/moves.component';
import { LoginComponent } from './pages/log-in/login.component';
import { LogOutComponent } from './pages/log-out/log-out.component';
import { SingUpComponent } from './pages/sing-up/sing-up.component';
import { PoliticsComponent } from './pages/politics/politics.component';
import { AuthGuard } from './guards/auth.guard';
import { CallbackComponent } from './pages/callback/callback.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { 
    path: 'home',  component: HomeComponent, canActivate:[AuthGuard]
  },
  { 
    path: 'cards',  component: CartonesComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'my-cards',  component: CartonesComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'groups',  component: GroupsComponent, canActivate: [AuthGuard, AdminGuard]
  },
  { 
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'play', component: JuegoComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'search/:texto',  component: BuscarComponent
  },
  { 
    path: 'raffle',  component: RaffleComponent, canActivate: [AuthGuard,AdminGuard]
  },
  
  { 
    path: 'account', component: AccountComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'moves', component: MovesComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'log-in', component: LoginComponent
  },
  { 
    path: 'log-out', 
    component: LogOutComponent, canActivate: [AuthGuard]
  },
  { 
    path: 'sing-up', component: SingUpComponent
  },
  { 
    path: 'politics', component: PoliticsComponent
  },
  { 
    path: 'profile', component: ProfileComponent
  },
  { 
    path:'callback', component: CallbackComponent 
  }, 
  {
    path: '**',  redirectTo: 'home'
  },
  

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
