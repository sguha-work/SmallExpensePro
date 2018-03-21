import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';
import {FileHandeler} from './filehandeler.service';
import {Database} from './database.service';
import { SimService } from './sim.service';

@Injectable()
export class ImportExport {
    
    private emailId: string;
    
    constructor(public http: Http, private file: FileHandeler, private email: EmailComposer, private db: Database, private sim: SimService) {
        this.emailId = "sguha1988.life@gmail.com";
    }

    private sendDataAsEmail(data: string, email?: string) {
        let emailObject = {
            to: (typeof email === "undefined")?this.emailId:email,
            cc: '',
            bcc: [],
            attachments: [
            ],
            subject: 'Backup data',
            body: data,
            isHtml: true
            };

            // Send a text message using default options
            this.email.open(emailObject);
    }

    private backUpToDatabase(data: string, fileName?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            //this.sendDataAsEmail(data);    
            this.sim.getUserSIM1Number().then((sim1Number) => {
                this.db.writeToDatabase(sim1Number, JSON.parse(data)).then(() => {
                    resolve();
                }, () => {
                    reject();
                });
            }, () => {
                reject();
            });
        });
    }

    private prepareConfigObject(): Promise<any> {
        
        return (new Promise((resolve, reject) => {
            this.file.getFolderContents("config").then((fileArray) => {
                if(typeof fileArray === "undefined" || fileArray.length === 0) {
                    reject({});
                } else {
                    let promiseArray = [];
                    let dataObject = {};
                    for(let index=0; index<fileArray.length; index++) {
                        promiseArray.push(new Promise((res, rej) => {
                            this.file.readFileContent(fileArray[index].name, "config").then((dataFromFile) => {
                                dataObject[fileArray[index].name] = JSON.parse(dataFromFile);
                                res();
                            }, () => {
                                dataObject[fileArray[index].name] = {};
                                res();
                            });
                        }));
                    }
                    Promise.all(promiseArray).then(() => {
                        resolve(dataObject)
                    }, () => {
                        resolve(dataObject);
                    });
                }
            });
        }));
    
    }

    private prepareDataObject(): Promise<any> {
        return (new Promise((resolve, reject) => {
            this.file.getFolderContents().then((fileArray) => {
                if(typeof fileArray === "undefined" || fileArray.length === 0) {
                    reject({});
                } else {
                    let promiseArray = [];
                    let dataObject = {};
                    for(let index=0; index<fileArray.length; index++) {
                        promiseArray.push(new Promise((res, rej) => {
                            this.file.readFileContent(fileArray[index].name).then((dataFromFile) => {
                                dataObject[fileArray[index].name] = JSON.parse(dataFromFile);
                                res();
                            }, () => {
                                dataObject[fileArray[index].name] = {};
                                res();
                            });
                        }));
                    }
                    Promise.all(promiseArray).then(() => {
                        resolve(dataObject)
                    }, () => {
                        resolve(dataObject);
                    });
                }
            });
        }));
    }

    private prepareExportObject() {
        let exportObject = {
            data: {},
            config: {}
        };
        exportObject.data = {};
        return new Promise((resolve, reject) => {
            this.prepareDataObject().then((response) => {
                exportObject.data = response;
                this.prepareConfigObject().then((response) => {
                    exportObject.config = response;
                    resolve(exportObject);
                }, () => {
                    exportObject.config = response;
                    resolve(exportObject);
                });
            }, () => {
                resolve(exportObject);
            });
        });
    }

    public export(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.getFolderContents("data").then((res) => {
                if(!res.length) {
                    reject();
                } else {
                    // data present in local so can be exported
                    this.prepareExportObject().then((response) => {
                        this.backUpToDatabase(JSON.stringify(response)).then(() => {
                            resolve();
                        }, () => {
                            reject();
                        });
                    }, (response)=>{
                        this.backUpToDatabase(JSON.stringify(response)).then(() => {
                            resolve(JSON.stringify(response));
                        }, () => {
                            reject();
                        });
                    });
                }
                
            }, () => {
                // nothing to export
                reject();
            });
            
        });
        
    }

    private writeConfigFiles(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let promiseArray = [];
            let keys = Object.keys(data);
            for(let index=0; index<keys.length; index++) {
                if(keys[index] !== "user") {
                    let promise: any;
                    promise = new Promise((res, rej) => {
                        this.file.writeFile(keys[index], JSON.stringify(data[keys[index]]), "config", "config", true).then(() => {
                            // file write success
                            res();
                        }).catch(() => {
                            // file write failed moving to next file
                            res();
                        });
                    });
                    promiseArray.push(promise); 
                }
                
            }
            Promise.all(promiseArray).then(() => {
                // all config file write done
                resolve();
            }).catch(() => {
                // not all config file written, moving on to next
                resolve();
            });
        
        });
    }

    private writeDataFiles(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
                let promiseArray = [];
                let keys = Object.keys(data);
                for(let index=0; index<keys.length; index++) {
                    let promise: any;
                    promise = new Promise((res, rej) => {
                        this.file.writeFile(keys[index], JSON.stringify(data[keys[index]]), "data","data", true).then(() => {
                            // file write success
                            res();
                        }).catch(() => {
                            // file write failed moving to next file
                            res();
                        });
                    });
                    promiseArray.push(promise);
                }
                Promise.all(promiseArray).then(() => {
                    // all data file write done
                    resolve();
                }).catch(() => {
                    // not all data file written, moving on to next
                    resolve();
                });
            
        });
    }

    createLocalFilesFromData(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            let configData = data.config;
            let expenseData = data.data;
            this.writeConfigFiles(configData).then(() => {
                this.writeDataFiles(expenseData).then(() => {
                    resolve();
                }, () => {
                    // data file write failed
                    resolve();
                });
            }, () => {
                // config file write failed
                resolve();
            });
            
        });
    }

    public import(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.getFolderContents("data").then((res) => {
                if(!res.length) {
                     // no data file present locally, import can be made
                    this.sim.getUserSIM1Number().then((sim1Number) => {
                        this.db.getFromDatabase(sim1Number).then((response) => {
                            this.createLocalFilesFromData(response).then(() => {
                                // file creation done
                                resolve();
                            }, () => {
                                // file creation failed
                                reject();
                            });
                        }, (error) => {
                            reject();
                        });
                    }, () => {
                        reject();
                    });
                } else {
                    // data folder not empty cannot import
                    reject();
                }
            }, () => {
               
            });
            
        });
    }

    
}