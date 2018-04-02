import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

const rootFolderName = "SmallExpensePro";

@Injectable()
export class FileHandeler {
    constructor(private file: File, private platform: Platform) {
        // this.checkAndCreateInitialDirectories().then((prepareMessageData) => {

        // }).catch(() => {
        //     this.platform.exitApp();;
        // });
        this.checkAndSetPlatform();
    }

    private checkAndSetPlatform() {
        if (this.platform.is('browser')) {
            localStorage.platform = "browser";
        } else {
            localStorage.platform = "ionic";
        }
    }

    public getCurrentDataFileName(): string {
        let today = new Date();
        let dateString: string;
        dateString = (today.getDate()).toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getFullYear().toString();
        return dateString;
    }

    public checkAndCreateInitialDirectories(): Promise<any> {
        let prepareMessageData = false;
        return new Promise((resolve, reject) => {
            this.file.checkDir(this.file.dataDirectory, rootFolderName).then(() => {
                // root directory exists
                resolve(prepareMessageData);
            }).catch(() => {
                // root directory doesnot exists, so creating
                this.file.createDir(this.file.dataDirectory, rootFolderName, false).then(() => {
                    // root directory created successfully
                    prepareMessageData = true;
                    resolve(prepareMessageData);
                }).catch((message) => {
                    // root directory creation failed
                    alert(JSON.stringify(message));
                    reject();

                });
            });


        });

    }

    private getPath() {
        return this.file.dataDirectory + "/" + rootFolderName;
    }

    public readFile(fileName): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readAsText(this.getPath(), fileName).then((value) => {
                resolve(value);
            }).catch((error) => {
                reject(error);
            });
        });

    }

    public checkIfFileExists(fileName): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readAsText(this.getPath(), fileName).then((value) => {
                resolve(value);
            }).catch(() => {
                reject();
            });
        });

    }



    public writeFile(data: string, fileName: string): Promise<any> {
        let directoryPath = this.getPath();
        return new Promise((resolve, reject) => {
            this.checkIfFileExists(fileName).then(() => {
                // file already exists, rewriting
                this.file.writeExistingFile(directoryPath, fileName, data).then(() => {
                    resolve();
                }).catch((error) => {
                    reject();
                });
            }).catch(() => {
                // file doesn't exists writing
                this.file.writeFile(directoryPath, fileName, data).then(() => {
                    resolve();
                }).catch((error) => {
                    reject();
                });
            });
        });
    }


}