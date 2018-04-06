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
      phoneNumber: "",
      password: ""
    }
  }

  public callDatabase() {
    this.model.phoneNumber = this.model.phoneNumber.trim();
    this.model.password = this.model.password.trim();
    if(this.model.phoneNumber === "" || this.model.password === "") {
      alert("Please provide phoneNumber and password");
    } else {
      this.user.checkIfUserExists(this.model.phoneNumber).then((valueFromDB) => {
        this.user.login(this.model.phoneNumber, this.model.password).then(() => {
          this.navCtrl.push(TabsControllerPage);
        }).catch((error)=>{
          if(typeof error == "undefined" || error === null) {
            alert("Phonenumber and password doesn't match")
          } else {
            alert("Unable to login user");
          }
        });
      }).catch((error) => {
        if(window.confirm("User doesnot exists want to join with given phoneNumber and password?")) {
          this.user.addUser(this.model.phoneNumber, this.model.password).then(() => {
            alert("User created with phoneNumber "+this.model.phoneNumber);
            this.navCtrl.push(TabsControllerPage);
          }).catch(() => {
            alert("User adition failed, please check your internet connection");
          });
        }
      });
    }
  }
  
}
