import { FileHandeler } from './filehandeler.service';
import { Common } from './common.service';
import {Injectable} from '@angular/core';
const alertFileName = "alert";
@Injectable()
export class Alert {
    constructor(private file: FileHandeler, private common: Common) {

    }

    public setAlertData(data: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.writeFile(alertFileName, this.common.prepareAlertFileData(data), "config").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }

    public checkIfAlertFileExists(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readFile(alertFileName, "config").then((res) => {
                resolve(res);
            }).catch(() => {
                reject();
            });
        });
    }

    public clearAlert(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.deleteFile(alertFileName, "config").then(() => {
                resolve();
            }).catch(() => {
                reject();
            });
        });
    }
}