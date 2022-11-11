import { Component, OnInit } from '@angular/core';
import { faUsersRectangle, faHouseChimneyUser, faChessBoard, faHatWizard, faFloppyDisk, faCommentsDollar, faDice, 
         faUserPlus, faDoorOpen, faUserCheck, faUserGear } from '@fortawesome/free-solid-svg-icons';

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
  
constructor() { }

  ngOnInit(): void {
  }

}
