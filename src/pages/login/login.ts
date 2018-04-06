import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController, private user: UserService) {
    
  }
  
}
