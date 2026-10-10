import { Component, OnInit, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth0Service } from '../../services/auth0.service';
import { faUsersRectangle, faHouseChimneyUser, faChessBoard, faHatWizard, faFloppyDisk, faCommentsDollar, faDice, 
         faUserPlus, faDoorOpen, faUserCheck, faUserGear, faMoneyBill1Wave, faPeopleGroup,  faIdBadge, faSquareEnvelope, 
         faBars, faCircleDot, faCircleUser} from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [RouterLink,
      CommonModule,
      FontAwesomeModule, 
      RouterLinkActive,
    ]


})
export class NavbarComponent implements OnInit {

  // 👇 inyecta el AuthService público
  public auth = inject(AuthService);


faUsersRectangle= faUsersRectangle;
faHouseChimneyUser = faHouseChimneyUser;
faChessBoard = faChessBoard;
faHatWizard = faHatWizard;
faFloppyDisk= faFloppyDisk;
faCommentsDollar = faCommentsDollar;
faDice = faDice;
faUserplus = faUserPlus;
faDoorOpen = faDoorOpen;
faUserCheck = faUserCheck;
faUserGear = faUserGear;
faPeopleGroup = faPeopleGroup;
faMoneyBill1Wave= faMoneyBill1Wave;
faIdBadge=faIdBadge;
faSquareEnvelope= faSquareEnvelope;
faBars= faBars;
faCircleDot=faCircleDot;
faCircleUser=faCircleUser;
userId!: number;
level: number = 0;



constructor(public auth0: Auth0Service,
  private authService: AuthService,
  private userService: UserService) { }


  ngOnInit(): void {
 
  }
   logout() {
    this.auth.logoutAll();
    // opcional: redirigir
    // this.router.navigateByUrl('/log-in');
  }

}
