import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { MyApp } from './app.component';


import { StatusBar } from '@ionic-native/status-bar';
import {File} from '@ionic-native/file';
import { DatePicker } from '@ionic-native/date-picker';
import { EmailComposer } from '@ionic-native/email-composer';

// importing self created services
import { FileHandeler } from './../services/filehandeler.service';
import { TagService } from './../services/tag.service';
import { Common } from './../services/common.service';
import { ExpenseService } from './../services/expense.service';
import {UserService} from './../services/user.service';
import {DatabaseService} from './../services/database.service';


// importing self created pages
import { SmallExpenseTrackerPage } from '../pages/small-expense-tracker/small-expense-tracker';
import { HistoryPage } from '../pages/history/history';
import { AboutPage } from '../pages/about/about';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';





// let pages = [
//   MyApp,
//   SmallExpenseTrackerPage,
//   HistoryPage,
//   AboutPage,
//   TabsControllerPage,
//   LoginPage,
//   SignupPage
// ];
// export function entryComponents() {
//   return pages;
// }

@NgModule({
  declarations: [
    MyApp,
    SmallExpenseTrackerPage,
    HistoryPage,
    AboutPage,
    TabsControllerPage,
    LoginPage,
    SignupPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SmallExpenseTrackerPage,
    HistoryPage,
    AboutPage,
    TabsControllerPage,
    LoginPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    File,
    EmailComposer,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TagService,
    
    FileHandeler,
    UserService,
    DatabaseService,
    Common,
    ExpenseService,
    DatePicker,
    Events
  ]
})


export class AppModule { }