import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { Platform } from 'ionic-angular';

const rootFolderName = "SmallExpensePro";
const dataListFileName = "FileList.list";

@Injectable()
export class FileHandeler {
    constructor(private file: File, private platform: Platform) {
        this.checkAndSetPlatform();
    }

    public getListFileName(): string {
        return dataListFileName;
    }

    private checkAndSetPlatform() {
        if (this.platform.is('browser')) {
            localStorage.platform = "browser";
        } else {
            localStorage.platform = "ionic";
        }
    }

    public getDataFileName(date?: string): string {
        let today = new Date();
        let dateString: string;
        if(typeof date === "undefined") {
            dateString = (today.getDate()).toString() + '-' + (today.getMonth() + 1).toString() + '-' + today.getFullYear().toString()+".data";
        } else {
            let dateObject = new Date(date);
            dateString = (dateObject.getMonth()+1).toString() + '-' + (dateObject.getDate()).toString() + '-' + dateObject.getFullYear().toString()+".data";
        }
        
        return dateString;
    }

    public checkAndCreateInitialDirectories(): Promise<any> {
        let prepareMessageData = false;
        return new Promise((resolve, reject) => {
            this.file.checkDir(this.file.dataDirectory, rootFolderName).then(() => {
                // root directory exists
                resolve();
            }).catch(() => {
                // root directory doesnot exists, so creating
                this.file.createDir(this.file.dataDirectory, rootFolderName, false).then(() => {
                    this.file.writeFile(this.getPath(), dataListFileName, "[]").then(() => {
                        resolve();
                    }).catch(() => {
                        reject();
                    });
                    // root directory created successfully
                    
                }).catch((message) => {
                    // root directory creation failed
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