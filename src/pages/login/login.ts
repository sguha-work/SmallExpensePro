import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {UserService} from '../../services/user.service';

import { TabsControllerPage } from './../tabs-controller/tabs-controller';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  public model: any;
  constructor(public navCtrl: NavController, private user: UserService) {
    this.model = {
      email: "",
      password: ""
    }
  }

  public callDatabase() {
    this.model.email = this.model.email.trim();
    this.model.password = this.model.password.trim();
    if(this.model.email === "" || this.model.password === "") {
      alert("Please provide email and password");
    } else {
      this.user.checkIfUserExists(this.model.email).then((valueFromDB) => {
        if(this.model.password === atob(valueFromDB.password)) {
          this.navCtrl.push(TabsControllerPage);
        } else {
          alert("Username password doesn't match");
        }
      }).catch((error) => {
        if(window.confirm("User doesnot exists want to join with given email password?")) {
          this.user.addUser(this.model.email, this.model.password).then(() => {
            alert("User created with email id "+this.model.email);
            this.navCtrl.push(TabsControllerPage);
          }).catch(() => {
            alert("User adition failed, please check your internet connection");
          });
        }
      });
    }
  }
  
}
