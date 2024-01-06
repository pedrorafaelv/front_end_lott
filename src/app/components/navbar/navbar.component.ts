import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../../services/auth0.service';
import { faUsersRectangle, faHouseChimneyUser, faChessBoard, faHatWizard, faFloppyDisk, faCommentsDollar, faDice, 
         faUserPlus, faDoorOpen, faUserCheck, faUserGear, faMoneyBill1Wave, faPeopleGroup,  faIdBadge, faSquareEnvelope, 
         faBars, faCircleDot, faCircleUser} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

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
constructor(public auth0: Auth0Service) { }

  ngOnInit(): void {
  }

}
