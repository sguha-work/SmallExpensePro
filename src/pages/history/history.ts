import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import * as $ from 'jquery';

import { FileHandeler } from './../../services/filehandeler.service';
import { Common } from './../../services/common.service';
import { ExpenseService } from './../../services/expense.service';
import { TagService } from './../../services/tag.service';
import { Events } from 'ionic-angular';

@Component({
  selector: 'page-history',
  templateUrl: 'history.html'
})
export class HistoryPage {
  public model: any;
  
  constructor(private common: Common, private datePicker: DatePicker, public navCtrl: NavController, private tagService: TagService, private file: FileHandeler, private event: Events,  private expense: ExpenseService) {
    this.model = {
      expenses: []
    };
  }

  public dateSelected(date: any): void {
    this.model.date = this.common.getSupprtedDateFromDateString(date);

  }
  
  displayDatePicker(): void {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      doneButtonLabel: "OK",
      cancelButtonLabel: "Cancel",
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
    }).then((date) => {
      this.dateSelected(date);
    });
  }
}
