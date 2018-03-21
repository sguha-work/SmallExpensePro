import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SmallExpenseTrackerPage } from '../small-expense-tracker/small-expense-tracker';
import { HistoryPage } from '../history/history';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-tabs-controller',
  templateUrl: 'tabs-controller.html'
})
export class TabsControllerPage {

  tab1Root: any = SmallExpenseTrackerPage;
  tab2Root: any = HistoryPage;
  tab3Root: any = AboutPage;
  constructor(public navCtrl: NavController) {
  }
  
}
