import { File } from '@ionic-native/file';
import {Injectable} from '@angular/core';
import { Events } from 'ionic-angular';

const rootFolderName = "SmallExpenseTracker";
const dataFolderName = "data";
const configFolderName = "config";

@Injectable()
export class FileHandeler {
    constructor(private file: File,private event: Events) {
        this.checkAndCreateDirectory()
    }
    private checkAndCreateDirectory() {
        this.file.checkDir(this.file.dataDirectory, rootFolderName).then((res) => {
            //alert("Directory exists");        
        }).catch(() => {
            this.file.createDir(this.file.dataDirectory, rootFolderName, false).then(()=>{
                this.file.createDir(this.file.dataDirectory+"/"+rootFolderName, dataFolderName , false).then(()=>{
                    //alert("data directory created");
                }).catch(() => {
                    //alert("Initial data directory building failed");    
                });
                this.file.createDir(this.file.dataDirectory+"/"+rootFolderName, configFolderName , false).then(()=>{
                    //alert(" config directory created");
                }).catch(() => {
                    //alert("Initial config directory building failed");    
                });
            },()=>{
                //alert("Initial directory building failed");
            });
        });


        
    }

    private createEmailFile() {
        this.readFile("user", "config").then(() => {

        }).catch(() => {
            
        });
    }

    public getCurrentDataFileName(): string {
        let today = new Date();
        let dateString: string;
        dateString = (today.getDate()).toString() + '-' + (today.getMonth()+1).toString() + '-' + today.getFullYear().toString();
        return dateString;
    }

    public updateFile(fileName: string, data: string, type?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if(typeof type === "undefined") {
                type = "data";
            }
            if(type === "data") {
                this.file.writeExistingFile(this.file.dataDirectory+"/"+rootFolderName+"/"+dataFolderName, fileName, data).then(() => {
                     this.event.publish('file:data:updated');
                    resolve();
                }).catch(() => {
                    reject();
                });
            } else {
                reject();
            }
        });
    }

    public writeFile(fileName: string, data: string, type: string, directoryName?: string, isImporting?: boolean): Promise<any> {
        if(typeof isImporting === "undefined") {
            isImporting = false;
        }
        if(type === "data") {
                return this.file.readAsText(this.file.dataDirectory+"/"+rootFolderName+"/"+dataFolderName, this.getCurrentDataFileName()).then((res) => {
                    //alert("file already exists, merging");
                    let dataNew = JSON.parse(res);
                    let parsedData = JSON.parse(data);
                    dataNew[parsedData.time] = parsedData;
                    //alert(data);
                    //alert(JSON.stringify(dataNew));
                    return this.file.writeExistingFile(this.file.dataDirectory+"/"+rootFolderName+"/"+dataFolderName, fileName, JSON.stringify(dataNew)).then(()=>{
                        //alert("writing done "+fileName);
                        return true;
                    }).catch(()=>{
                        //alert("unable to write file "+fileName);
                        return false;
                    });        
                }).catch(() => {
                    //alert("file not exists, creating");
                    let dataNew = {};
                    let parsedData = JSON.parse(data);
                    if(isImporting) {
                        dataNew = parsedData;
                    } else {
                        dataNew[parsedData.time] = parsedData;
                    }
                    return this.file.writeFile(this.file.dataDirectory+"/"+rootFolderName+"/"+dataFolderName, fileName, JSON.stringify(dataNew)).then(()=>{
                        //alert("writing done "+fileName);
                        return true;
                    }).catch(()=>{
                        //alert("unable to write file "+fileName);
                        return false;
                    });
                });
                
                
        }
        
        if(type==="config") {
             return this.file.readAsText(this.file.dataDirectory+"/"+rootFolderName+"/"+configFolderName, fileName).then((res) => {
                    //file exists overwriting
                    
                    return this.file.writeExistingFile(this.file.dataDirectory+"/"+rootFolderName+"/"+configFolderName, fileName, data).then(()=>{
                        //writing done
                        this.event.publish('file:config:updated');
                        return true;
                    }).catch(()=>{
                        //unable to write
                        return false;
                    });        
                }).catch(() => {
                    //file not exists, creating
                    return this.file.writeFile(this.file.dataDirectory+"/"+rootFolderName+"/"+configFolderName, fileName, data).then(()=>{
                        //writing done
                        this.event.publish('file:config:updated');
                        return true;
                    }).catch(()=>{
                        //unable to write file
                        return false;
                    });
                });
        }
        
    }
    public createDataDirectory() {
        this.file.createDir(this.file.dataDirectory+"/"+rootFolderName, dataFolderName , false).then(()=>{
            //alert("data directory created");
        }).catch(() => {
            //alert("Initial data directory building failed");    
        });
    }
    public removeFolderContents(folderName?: string): Promise<any> {
        if(typeof folderName === "undefined") {
            folderName = dataFolderName;
        }
        return new Promise((resolve, reject) => {
            this.file.removeRecursively(this.file.dataDirectory+"/"+rootFolderName, folderName).then(() => {
                this.event.publish('file:data:updated');
                resolve();
            }, () => {
                reject();
            });
        });
    }

    public getFolderContents(folderName?: string): Promise<any>{
        if(typeof folderName === "undefined") {
            folderName = "data";
        }
        return new Promise((resolve, reject) => {
            this.file.listDir(this.file.dataDirectory + "/" + rootFolderName + "/", folderName).then((response) => {
                resolve(response)
            }).catch(() => {
                reject();
            });
        });
        
    }
    public readFile(fileName: string, directoryName?: string): Promise<any> {
        if(typeof directoryName === "undefined") {
            directoryName = dataFolderName;
        }
        return this.file.readAsText(this.file.dataDirectory + "/" + rootFolderName + "/" + directoryName, fileName);
    }
    public readFileContent(fileName: string, directoryName?: string): Promise<any> {
        if(typeof directoryName === "undefined") {
            directoryName = dataFolderName;
        }
        return new Promise((resolve, reject) => {
            this.file.readAsText(this.file.dataDirectory + "/" + rootFolderName + "/" + directoryName, fileName).then((dataFromFile) => {
                resolve(dataFromFile);
            }).catch(() => {
                reject();
            });
        });
        
    }
    public deleteFile(fileName: string, directoryName?: string): Promise<any> {
        if(typeof directoryName === "undefined") {
            directoryName = dataFolderName;
        }
        return this.file.removeFile(this.file.dataDirectory + "/" + rootFolderName + "/" + directoryName, fileName);
    }
}