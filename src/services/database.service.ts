import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class Database {
   constructor(private db: AngularFireDatabase) {
   }

   public writeToDatabase(key: string, data: any): Promise<any> {
       return new Promise((resolve, reject) => {
        this.db.database.ref('/'+key).set(data).then(() => {
            resolve();
        }).catch((error) => {
            reject();
        });
       });
       
   }

   public getFromDatabase(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
        this.db.database.ref('/'+key).once('value').then((data) => {
            resolve(data.val());
        }).catch((error) => {
            reject(error);
        });
    });
   }
   
}