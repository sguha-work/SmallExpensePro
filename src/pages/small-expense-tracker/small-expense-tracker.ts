import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { FileHandeler } from './../../services/filehandeler.service';
import { TagService } from './../../services/tag.service';
import { Events } from 'ionic-angular';

//let $:any;

@Component({
  selector: 'page-small-expense-tracker',
  templateUrl: 'small-expense-tracker.html'
})
export class SmallExpenseTrackerPage implements AfterViewInit {

  public tagData: any;
  public numberData: any;
  private model: any;
  private alert: any;
  constructor(public navCtrl: NavController, private tagService: TagService, private file: FileHandeler, private event: Events) {
    
    this.model = {
      reason: "",
      amount: "",
      description: "",
      time: ""
    };
    this.alert = {};
    this.alert.safeAmount = 0;
    this.event.subscribe('file:data:updated', () => {
      this.refreshHomePageView();
    });
    this.event.subscribe('file:config:updated', () => {
      this.refreshHomePageView();
    });
    //this.checkAndCreateSimInfoFileIfNotExists();
  }



  private refreshHomePageView() {
    this.getTodaysTotalExpense();
    this.checkIfAlertExistsAndMakechanges();
  }

  private loadNumbers() {

    this.numberData = JSON.parse(`[{
          "label": "0"
      },
      {
          "label": "1"
      },
      {
          "label": "2"
      },
      {
          "label": "3"
      },
      {
          "label": "4"
      },
      {
          "label": "5"
      },
      {
          "label": "6"
      },
      {
          "label": "7"
      },
      {
          "label": "8"
      },
      {
          "label": "9"
      }
    ]`);
  }

  private loadTags(): void {
    this.tagService.getTagData().then((data) => {
      this.tagData = data;
    }, (data) => {
      this.tagData = data;
    }).catch(() => {
      alert("Error occured");
    });
  }

  private checkAndPrepareDescription(): void {
    if (this.model.reason !== "" && this.model.amount !== "") {
      let date = Date();
      this.model.description = "Spent Rs " + this.model.amount + " in " + this.model.reason + " on " + date;
      this.model.time = Date.now();
    }
  }



  public tagClicked(event): void {
    $("ion-item[data-item='tag']").removeClass('active');
    $(event.currentTarget).addClass('active');
    this.model.reason = $(event.currentTarget).text().trim();
    this.checkAndPrepareDescription();
  }

  public numberClicked(): void {
    if (this.model.amount === "") {
      this.model.amount = 0;
    }
    this.model.amount = (this.model.amount * 10) + parseInt($(event.currentTarget).text());
    this.checkAndPrepareDescription();
  }

  public resetInputs(): void {
    this.model.amount = "";
    $("ion-item[data-item='tag']").removeClass('active');
    this.model.reason = "";
    this.model.description = "";
  }

  private getTodaysTotalExpense() {

  }



  public submitInput() {
    if (this.model.description !== "") {
      this.file.writeFile(this.file.getCurrentDataFileName(), JSON.stringify(this.model)).then((res) => {
        if (res) {
          alert("Succesfully submitted data");
          this.resetInputs();
          this.getTodaysTotalExpense();
          this.checkIfAlertExistsAndMakechanges();
        } else {
          alert("Data submit failed");
        }

      }, () => {
        alert("Data submit failed");
      });
    } else {
      alert("Nothing to submit");
    }
  }

  public checkIfAlertExistsAndMakechanges(): void {

  }

  private prepareAlertData(textData: string): void {
    let data = JSON.parse(textData);
    this.alert.alertAmount = parseInt(data.alertAmount);
    this.alert.safeAmount = parseInt(data.alertAmount) - parseInt(this.model.todaysTotalExpense);
    if (this.alert.safeAmount < 0) {
      this.alert.showAlert = true;
      this.alert.extraSpent = this.alert.safeAmount * (-1);
    } else {
      this.alert.showAlert = false;
      this.alert.extraSpent = 0;
    }
    if (isNaN(this.alert.safeAmount)) {
      this.alert.safeAmount = 0;
    }
  }

  public changeTagTitle(tagName: string) {
    let newTagName = window.prompt("Enter new tag name. Previous was " + tagName);
    if (newTagName.trim() !== "" && newTagName.toLowerCase() !== tagName.toLowerCase()) {
      this.tagService.updateTagName(tagName, newTagName).then(() => {
        alert("Tag updated");
        this.loadTags();
      }, () => {
        alert("Tag updation failed");
      });
    }
  }

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.file.checkAndCreateInitialDirectories().then(() => {
        alert("success");
      }).catch(() => {
        alert("failed");
      });
    }, 1000);
    window.setTimeout(() => {
      this.getTodaysTotalExpense();
      this.checkIfAlertExistsAndMakechanges();
      this.loadTags();
      this.loadNumbers();
    }, 2000);

  }

}
