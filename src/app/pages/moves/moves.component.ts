import { Component, OnInit, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
// import {  } from "module";
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-moves',
  templateUrl: './moves.component.html',
  styleUrls: ['./moves.component.css']
})
export class MovesComponent implements OnInit {


  public balance: any;
  public localId: string;
  public userId: string;
  public usuario;
  public currency ='1';
  constructor(private auth: AuthService,
              private router: Router,
              private accountService: AccountService,
              private  userService: UserService) {
  

               }
  ngOnInit(): void {
     this.localId = this.auth.getLocalId();
      if(this.localId){
        this.getInfo(this.localId);
        console.log('localId en ngOninit', this.localId);
      }
  }

  async getInfo(Id){
   
        this.accountService.getBalance(this.userId, this.currency)
          .then((data)=>{
            console.log('balance', data);
        this.balance= data['balance']})
        .catch((datos)=>{
          console.error("Error al obtener el saldo", datos);
        })
  
  }
   
}
