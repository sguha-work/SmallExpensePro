import { Injectable } from '@angular/core';
import { FileHandeler } from './filehandeler.service';
import { DatabaseService } from './database.service';
import { Platform } from 'ionic-angular';

const userFileName = "user.json";

@Injectable()
export class UserService {
    constructor(private file: FileHandeler, private database: DatabaseService) {
        
    }

    public checkIfUserExists(email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.get("users/"+email).then((value) => {
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

    public checkIfUserFileExistsInLocal(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.checkIfFileExists(userFileName).then(() => {
                resolve();
              }).catch(() => {
                  reject();
              })
        });
    }

    public addUser(email: string, password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            // adding user to database
            this.database.set("users/"+email, {"password": btoa(password)}).then(() => {
                let userObject = {
                    "email": email,
                    "password": btoa(password) 
                };
                this.file.writeFile(JSON.stringify(userObject), userFileName).then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            }).catch((error) => {
                reject();
            });
        });
    }


    

}