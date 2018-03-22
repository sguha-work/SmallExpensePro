import { Injectable } from '@angular/core';
import { FileHandeler } from './filehandeler.service';
import { Platform } from 'ionic-angular';

@Injectable()
export class TagService {

    constructor(private file: FileHandeler, private platform: Platform) {

    }
    public getTagData(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.file.readFile("tag-data-json", "config").then((response) => {
                // file exists returning data from file
                resolve(JSON.parse(response));
            }, () => {
                // file not exists, returning default data and creating the file
                let data = `[{
                    "name": "Travel",
                    "icon": ""
                },
                {
                    "name": "Petrol",
                    "icon": ""
                },
                {
                    "name": "Medic",
                    "icon": ""
                },
                {
                    "name": "lunch",
                    "icon": ""
                }, {
                    "name": "Dinner",
                    "icon": ""
                },
                {
                    "name": "Smoking",
                    "icon": ""
                },
                {
                    "name": "Misc",
                    "icon": ""
                },
                {
                    "name": "Misc 2",
                    "icon": ""
                },
                {
                    "name": "Misc 3",
                    "icon": ""
                },
                {
                    "name": "Misc 4",
                    "icon": ""
                },
                {
                    "name": "Misc 5",
                    "icon": ""
                },
                {
                    "name": "Misc 6",
                    "icon": ""
                }
            
            ]`;
                this.file.writeFile("tag-data-json", data, "config", "config").then(() => {
                    // file write done
                    resolve(JSON.parse(data));
                }, () => {
                    // unable to write file
                    reject();
                })

            });
        });
    }

    private errorHandler(error: any): Promise<any> {
        return Promise.reject(error);
    }

    public updateTagName(oldTagName: string, newTagName: string): Promise<any> {
        newTagName = newTagName.charAt(0).toUpperCase() + newTagName.slice(1).toLowerCase()
        return new Promise((resolve, reject) => {
            this.file.readFile("tag-data-json", "config").then((response) => {
                let presentTagData = JSON.parse(response);
                for (let index = 0; index < presentTagData.length; index++) {
                    if (presentTagData[index].name === oldTagName) {
                        presentTagData[index].name = newTagName;
                    }
                }
                this.file.writeFile("tag-data-json", JSON.stringify(presentTagData), "config", "config").then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                reject();
            });
        });
    }

}