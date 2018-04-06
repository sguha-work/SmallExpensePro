import { Injectable } from '@angular/core';
import { FileHandeler } from './filehandeler.service';
import { DatabaseService } from './database.service';
import { Platform } from 'ionic-angular';

const userFileName = "user.json";

@Injectable()
export class UserService {
    constructor(private file: FileHandeler, private database: DatabaseService) {
        
    }

    public checkIfUserExists(phoneNumber: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.get(phoneNumber+"/active/").then((value) => {
                if(value==null) {
                    reject();
                } else {
                    resolve(value);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public login(phoneNumber: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.get(phoneNumber+"/password/").then((dataFromDB) => {
                if(dataFromDB==null) {
                    reject();
                } else {
                    if(password == atob(dataFromDB)) {
                        let userObject = {
                            "phoneNumber": phoneNumber,
                            "password": btoa(password),
                            "active": true
                        };
                        this.file.writeFile(JSON.stringify(userObject), userFileName).then(() => {
                            resolve();
                        }).catch(() => {
                            reject();
                        });
                        
                    } else {
                        reject();
                    }
                }
            }).catch((error) => {
                reject(error);
            });
        });
    }

    public checkIfUserFileExistsInLocal(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.checkIfFileExists(userFileName).then(() => {
                resolve();
              }).catch(() => {
                  reject();
              })
        });
    }

    public addUser(phoneNumber: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // adding user to database
            this.database.set(phoneNumber, {"password": btoa(password), "active": true}).then(() => {
                let userObject = {
                    "phoneNumber": phoneNumber,
                    "password": btoa(password),
                    "active": true
                };
                this.file.writeFile(JSON.stringify(userObject), userFileName).then(() => {
                    resolve();
                }).catch((error) => { 
                    reject(error);
                });
            }).catch((error) => {
                reject(error);
            });
        });
    }


    

}