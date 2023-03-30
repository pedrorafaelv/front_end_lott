import { Component, OnInit } from '@angular/core';
import { Auth0Service } from '../../services/auth0.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(private  auth:Auth0Service) { }

  ngOnInit(): void {
    //this.auth.handleAuthCallback();
  }

}
