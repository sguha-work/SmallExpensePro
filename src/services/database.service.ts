import { Injectable } from '@angular/core';
import { FileHandeler } from './filehandeler.service';
import { Platform } from 'ionic-angular';

let firebase;

@Injectable()
export class DatabaseService {
    private db: any;
    constructor(private file: FileHandeler, private platform: Platform) {
        platform.ready().then(() => {
            this.db = firebase.database();
        });
        
    }


    public set(key: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.ref('/'+key).set(data).then(() => {
                resolve();
            }).catch((error) => {
                reject();
            });
       });
    }

    public update(key: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.ref('/'+key).update(data).then(() => {
                resolve();
            }).catch((error) => {
                reject();
            });
       });
    }

    public get(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.ref('/'+key).once('value').then((data) => {
                resolve(data.val());
            }).catch((error) => {
                reject(error);
            });
        });
    }


}