import {Http} from '@angular/http';
import {Injectable} from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';
@Injectable()
export class Email {
    
    private email: string;
    
    constructor(public http: Http) {
        this.email = "sguha1988.life@gmail.com";
    }

    public open(data: string,email?: string) {

    }
}