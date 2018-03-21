import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

let firebase;
@Injectable()
export class Database {
    private db: any;
    constructor() {
        this.db = firebase.database();
    }

    public writeToDatabase(key: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.database.ref('/' + key).set(data).then(() => {
                resolve();
            }).catch((error) => {
                reject();
            });
        });

    }

    public getFromDatabase(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.database.ref('/' + key).once('value').then((data) => {
                resolve(data.val());
            }).catch((error) => {
                reject(error);
            });
        });
    }

}