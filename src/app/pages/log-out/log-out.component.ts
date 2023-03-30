import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-log-out',
  templateUrl: './log-out.component.html',
  styleUrls: ['./log-out.component.css']
})
export class LogOutComponent implements OnInit {

  constructor(public auth: AuthService,
              private router: Router) { 
  }

  ngOnInit(): void {
    this.logout();
  }
  logout(){
    this.auth.logout();
    this.router.navigateByUrl('/log-in');
  }
}
