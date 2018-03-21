import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Injectable} from '@angular/core';
import {FileHandeler} from './filehandeler.service';
export interface Tag {
    name: string;
    icon: string;
}
@Injectable()
export class TagService {

    constructor(public http: Http, private file: FileHandeler) {

    }
    public getTagData() :Promise<Tag[]> {
        return new Promise((resolve, reject) => {
            this.file.readFile("tag-data-json", "config").then((response) => {
                // file exists returning data from file
                resolve(JSON.parse(response));
            }, () => {
                // file not exists, returning default data and creating the file
                this.http.get("assets/data/tag.data.json").toPromise().then((response) => {
                    this.file.writeFile("tag-data-json", JSON.stringify(response.json() as Tag[]), "config", "config").then(() => {
                        // file write done
                        resolve(response.json() as Tag[]);
                    }, () => {
                        // unable to write file
                        reject();
                    })
                }).catch(() => {
                    reject();
                });
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
                for(let index=0; index<presentTagData.length; index++) {
                    if(presentTagData[index].name === oldTagName) {
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