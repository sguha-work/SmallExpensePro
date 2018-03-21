import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { SmallExpenseTrackerPage } from '../pages/small-expense-tracker/small-expense-tracker';
import { HistoryPage } from '../pages/history/history';
import { AboutPage } from '../pages/about/about';
import { TabsControllerPage } from '../pages/tabs-controller/tabs-controller';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';



import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

let pages = [
  MyApp,
  SmallExpenseTrackerPage,
  HistoryPage,
  AboutPage,
  TabsControllerPage,
  LoginPage,
  SignupPage
];
export function entryComponents() {
  return pages;
}

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
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})


export class AppModule { }