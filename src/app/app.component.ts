import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


import { FileHandeler } from './../services/filehandeler.service';
import { UserService } from './../services/user.service';

import { SmallExpenseTrackerPage } from '../pages/small-expense-tracker/small-expense-tracker';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html' 
})
export class MyApp {
  @ViewChild(Nav) navCtrl: Nav;
  public rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private file: FileHandeler, private user: UserService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.file.checkAndCreateInitialDirectories().then(() => {
          this.user.checkIfUserFileExistsInLocal().then(() => {
            this.rootPage = TabsControllerPage;
          }).catch(() => {
            this.rootPage = LoginPage;
          });
      }).catch(() => {
        alert("Cannot start application due to error");
      });
    });
  }
  
}
