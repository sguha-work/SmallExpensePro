import {Injectable} from '@angular/core';
@Injectable()
export class Common {
    public convertTimeStampToTime(timeStamp: string): string {
        let date = new Date(parseInt(timeStamp));
        let hours = date.getHours();
        let hoursString: string;
        if(hours>12) {
        hours = hours-12;
        hoursString =" PM"
        } else {
        hoursString =" AM"
        }
        let minutes = "0" + date.getMinutes();
        let formattedTime = hours + ':' + minutes.substr(-2) + ':' + hoursString;
        return formattedTime;
    }

    public prepareArrayFromRawData(rawData: string): any {
      let data = JSON.parse(rawData);
      let keys = Object.keys(data);
      let dataArray = [];
      for(let index in keys) {
        data[keys[index]].rawTime = data[keys[index]].time;
        data[keys[index]].time = this.convertTimeStampToTime(data[keys[index]].time);
        dataArray.push(data[keys[index]]);
      }
      return dataArray;
    }

    public getTodaysDate() {
      let today = new Date();
      let dateString: string;
      dateString = (today.getDate()).toString() + '-' + (today.getMonth()+1).toString() + '-' + today.getFullYear().toString();
      return dateString;
    }
    public getYesterdaysDate() {
      let today = new Date();
      let yesterday = new Date(today);
      let dateString: string;
      yesterday.setDate(today.getDate() - 1);
      dateString = (yesterday.getDate()).toString() + '-' + (yesterday.getMonth()+1).toString() + '-' + yesterday.getFullYear().toString();
      return dateString;
    }
    public prepareAlertFileData(amount: string): string {
      let alertObject: any;
      alertObject = {};
      alertObject.alertAmount = amount;
      let data: string;
      data = JSON.stringify(alertObject);
      return data;
    }

    public getSupprtedDateFromDateString(date: string): string {
      let supportedDate: string;
      let today = new Date(date);
      supportedDate = (today.getDate()).toString() + '-' + (today.getMonth()+1).toString() + '-' + today.getFullYear().toString();
      return supportedDate;
    }

    public getLast7Dates():any {
      let datesArray = [];
      for(let index=0; index<7; index++) {
        let date = new Date();
        let ts = date.getTime();
        let obtainedDay = ts - (index * 24 * 60 * 60 * 1000);
        date = new Date(obtainedDay);
        let dateString = this.getSupprtedDateFromDateString(date.toString());
        datesArray.push(dateString)
      }
      return datesArray;
    }
    public getLast30Dates():any {
      let datesArray = [];
      for(let index=0; index<30; index++) {
        let date = new Date();
        let ts = date.getTime();
        let obtainedDay = ts - (index * 24 * 60 * 60 * 1000);
        date = new Date(obtainedDay);
        let dateString = this.getSupprtedDateFromDateString(date.toString());
        datesArray.push(dateString)
      }
      return datesArray;
    }
    public getCurrentMonthName(): string {
      let monthNames = ["January", "February", "March", "Aprill", "May", "Jun",
      "July", "August", "Septembar", "October", "November", "December"
      ];
      let date = new Date();
      return monthNames[date.getMonth()];
    }
}