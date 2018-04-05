import { Injectable } from '@angular/core';
import { FileHandeler } from './filehandeler.service';
import {Common} from './common.service';

@Injectable()
export class ExpenseService {
    constructor(private file: FileHandeler, private common: Common) {

    }
    private getExpenseObject(amount: number, tag: string, description:string, date?: string): any {
        let object = {
            amount: amount,
            reason: tag,
            description: description,
            date: (typeof date === "undefined")?this.common.getSupprtedDateFromDateString():date
        }
        return object;
    }

    /** */
    public submitExpense(amount: number, tag: string, description: string, date?: string) {
        return new Promise((resolve, reject) => {
            let object = this.getExpenseObject(amount, tag, description, date);
            let fileName = this.file.getDataFileName(date);
            this.file.checkIfFileExists(fileName).then((dataFromFile) => {
                let dataArray = JSON.parse(dataFromFile);
                dataArray.push(object);
                this.file.writeFile(JSON.stringify(dataArray), fileName).then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                let dataArray = [];
                dataArray.push(object);
                this.file.writeFile(JSON.stringify(dataArray), fileName).then(() => {
                    // making entry for list file
                    this.file.readFile(this.file.getListFileName()).then((dataFromFile) => {
                        let array = JSON.parse(dataFromFile);
                        array.push(fileName);
                        this.file.writeFile(JSON.stringify(array), this.file.getListFileName()).then(() => {
                            resolve();
                        }).catch(() => {
                            reject();
                        });
                    }).catch(() => {
                        reject();
                    });
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        });
    }

    public getAllExpensesOfGivenDate(date?: string): Promise<any> {
        let dataFileName = this.file.getDataFileName(date);
        return new Promise((resolve, reject) => {
            this.file.readFile(dataFileName).then((dataFromFile) => {
                resolve(JSON.parse(dataFromFile));
            }).catch(() => {
                reject();
            });
        });
    }

    public getTotalExpenseOfGivenDate(date?: string): Promise<any> {
        let dataFileName = this.file.getDataFileName(date);
        return new Promise((resolve, reject) => {
            this.file.readFile(dataFileName).then((dataFromFile) => {
                let expenseData = JSON.parse(dataFromFile);
                let totalAmount = 0;
                for(let index in expenseData) {
                    totalAmount += parseInt(expenseData[index].amount);
                }
                resolve(totalAmount);
            }).catch(() => {
                reject();
            });
        });
    }
}