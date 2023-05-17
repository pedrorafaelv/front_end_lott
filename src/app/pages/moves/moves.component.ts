import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import {  } from "module";


@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['./moves.component.css']
})
export class MovesComponent implements OnInit {

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
  }
   salir(){
    this.auth.logout();
    this.router.navigateByUrl('/log-in');
   }
}
