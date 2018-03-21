import { FileHandeler } from './filehandeler.service';
import { Common } from './common.service';
import {Injectable} from '@angular/core';

@Injectable()
export class Expense {
    constructor(private file: FileHandeler, private common: Common) {

    }

    public getExpensesByDate(date: string, requiredRaw?: boolean): Promise<any> {
        let expenseFileName: string;
        expenseFileName = date;
        return new Promise((resolve, reject) => {
            this.file.readFile(expenseFileName).then((res) => {
                if(requiredRaw) {
                    resolve(res);    
                }
                let dataArray = this.common.prepareArrayFromRawData(res);
                resolve(dataArray);
            }).catch(() => {
                reject([]);
            });
        });
    }

    public getTotalExpenseByDate(date: string): Promise<any> {
        let expense: number;
        let expenseFileName: string;
        expenseFileName = date;
        return new Promise((resolve, reject) => {
            this.file.readFile(expenseFileName).then((res) => {
                let dataArray = this.common.prepareArrayFromRawData(res);
                expense = 0;
                for(let index in dataArray) {
                    expense += parseInt(dataArray[index].amount);
                }
                resolve(expense);
            }).catch(() => {
                reject(0);
            });
        });
    }
    
    public getTodaysTotalExpense(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getTotalExpenseByDate(this.common.getTodaysDate()).then((response) => {
                resolve(response);
            }, () => {
                reject(0);
            });
        });
    }

    public storeExpense(fileName: string, data: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.updateFile(fileName, data).then(() => {
                resolve();
            }, () => {
                reject();
            });
        });
    }

    public deleteEntryFromToday(keyId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getExpensesByDate(this.common.getTodaysDate(), true).then((response) => {
                let data = JSON.parse(response);
                let keys = Object.keys(data);
                let newData = {};
                for(let index in keys) {
                    if(keys[index].toString() !== keyId.toString()) {
                        newData[keys[index]] = data[keys[index]];
                    }                    
                }
                this.storeExpense(this.common.getTodaysDate(), JSON.stringify(newData)).then(() => {
                    // data file updated
                    resolve();
                }, () => {
                    // unable to update data file
                    reject();
                });
            }, () => {
                // unable to get data
                reject();
            });
        });
        
    }

    public getTotalExpenseOfLast7DaysDatewise(): Promise<any> {
        return new Promise((resolve, reject) => {
            let datesArray = this.common.getLast7Dates();
            let promiseArray = [];
            let expensesArray = [];
            for(let index = 0; index<datesArray.length; index++) {
                promiseArray.push(new Promise((res, rej) => {
                    this.getTotalExpenseByDate(datesArray[index]).then((data) => {
                        // expenses found for the day
                        if(parseInt(data) !== 0) {
                            let exp = {
                                date: "",
                                expense: 0
                            };
                            exp.date = datesArray[index];
                            exp.expense = parseInt(data);
                            expensesArray.push(exp);
                        }
                        res();
                    }, () => {;
                        // expenses not found
                        res();
                    });
                }));
            }
            Promise.all(promiseArray).then(() => {
                resolve(expensesArray);
            }).catch(()=>{
                reject();
            });
        });
    }

    public getDaywiseTotalExpenseOfLast30Days(): Promise<any> {
        return new Promise((resolve, reject) => {
            let dateArray = this.common.getLast30Dates();
            let promiseArray = [];
            let finalArray = [];
            for(let index=0; index<dateArray.length; index++) {
                promiseArray.push(new Promise((res, rej) => {
                    this.getTotalExpenseByDate(dateArray[index]).then((response) => {
                        finalArray.push({
                            date: dateArray[index],
                            expense: response
                        });
                        res();
                    }, () => {
                        res();
                    });
                }))
            }
            Promise.all(promiseArray).then(()=>{
                resolve(finalArray);
            }, () => {
                reject();
            });
        });
    }

    public getDaywiseTotalExpenseOfLast7Days(): Promise<any> {
        return new Promise((resolve, reject) => {
            let dateArray = this.common.getLast7Dates();
            let promiseArray = [];
            let finalArray = [];
            for(let index=0; index<dateArray.length; index++) {
                promiseArray.push(new Promise((res, rej) => {
                    this.getTotalExpenseByDate(dateArray[index]).then((response) => {
                        finalArray.push({
                            date: dateArray[index],
                            expense: response
                        });
                        res();
                    }, () => {
                        res();
                    });
                }))
            }
            Promise.all(promiseArray).then(()=>{
                resolve(finalArray);
            }, () => {
                reject();
            });
        });
    }

    private getTagWiseTotalExpense(dateArray: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let promiseArray = [];
            let tagBasedData = {};
            for(let index=0; index<dateArray.length; index++) {
                promiseArray.push(new Promise((res, rej) => {
                    this.getExpensesByDate(dateArray[index]).then((response) => {
                        for(let i = 0; i<response.length; i++) {
                            let tag = response[i].reason;
                            let amount = response[i].amount;
                            if(typeof tagBasedData[tag] === "undefined") {
                                tagBasedData[tag] = parseInt(amount);
                            } else {
                                tagBasedData[tag] += parseInt(amount);
                            }
                        }
                        res();
                    }, () => {
                        res();
                    });
                }));
            }
            Promise.all(promiseArray).then(() => {
                resolve(tagBasedData);
            }, () => {
                reject();
            });
        });
    }

    public getTagWiseTotalExpenseOf30Days() {
        let dateArray = this.common.getLast30Dates();
        return this.getTagWiseTotalExpense(dateArray);
    }

    public getTagWiseTotalExpenseOf7Days(): Promise<any> {
        let dateArray = this.common.getLast7Dates();
        return this.getTagWiseTotalExpense(dateArray);
    }
 
}