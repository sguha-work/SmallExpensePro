import { Injectable } from '@angular/core';
import { FileHandeler } from './filehandeler.service';

@Injectable()
export class ExpenseService {
    constructor(private file: FileHandeler) {

    }
    private getExpenseObject(amount: number, tag: string): any {
        let object = {
            amount: amount,
            reason: tag,
            dateTime: Date.now()
        }
        return object;
    }

    /** */
    public submitExpense(amount: number, tag: string) {
        return new Promise((resolve, reject) => {
            let object = this.getExpenseObject(amount, tag);
            let fileName = this.file.getDataFileName();
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
                    resolve();
                }).catch(() => {
                    reject();
                });
            });
        });
    }

    public getTotalExpenseOfGivenDate() {

    }

    public getAllExpensesOfGivenDate() {

    }
}