import {Injectable} from '@angular/core';
import { Sim } from '@ionic-native/sim';
import {FileHandeler} from './filehandeler.service';

@Injectable()
export class SimService {
   constructor(private sim: Sim, private file: FileHandeler) {
   }

   private getSimInfo(): Promise<any> {
       return new Promise((resolve, reject) => {
        this.sim.getSimInfo().then(
            (info) => {
                if(info.phoneNumber.toString() === "") {
                    resolve(info.cards[0].phoneNumber);
                } else {
                    resolve(info.phoneNumber)
                }
            },
            (err) => {
                reject();
            }
        );
       });
       
   }

   public checkAndPrepareSimInfoIfNotExists() {
       this.file.readFile("user", "config").then(() => {
           // good, user file exists
       }).catch(() => {
            this.sim.requestReadPermission().then(() => {
                this.getSimInfo().then((phoneNumber) => {
                    let user = {};
                    user["phoneNumber"] = phoneNumber;
                        this.file.writeFile("user", JSON.stringify(user), "config");
                }, () => {
                    alert("Permission denied. Import/export will not work");
                });
            }).catch(() => {
                alert("Permission denied. Import/export will not work");
            });
       });
       
    
   } 

   public getUserSIM1Number(): Promise<any> {
    return new Promise((resolve, reject) => {
        this.file.readFile("user", "config").then((data) => {
            let userData = JSON.parse(data);
            resolve(userData.phoneNumber);
        }).catch(() => {
            alert("cannot get user sim1 number. Import/export will not work");
            reject();
        });
    });
   }
   
}