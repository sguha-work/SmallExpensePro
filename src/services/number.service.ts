import { Injectable } from '@angular/core';
import { FileHandeler } from './filehandeler.service';
import { Platform } from 'ionic-angular';

@Injectable()
export class NumberService {

    constructor(private file: FileHandeler, private platform: Platform) {
        this.platform.ready().then(() => {

        });
    }


    public getNumberData(): Promise<any> {
        let promise = new Promise((resolve, reject) => {
            resolve(JSON.parse(`[{
                "label": "0"
            },
            {
                "label": "1"
            },
            {
                "label": "2"
            },
            {
                "label": "3"
            },
            {
                "label": "4"
            },
            {
                "label": "5"
            },
            {
                "label": "6"
            },
            {
                "label": "7"
            },
            {
                "label": "8"
            },
            {
                "label": "9"
            }
        ]`));
        });
        return promise;
    }
    private errorHandler(error: any): Promise<any> {
        return Promise.reject(error);
    }
}