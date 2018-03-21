import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Injectable} from '@angular/core';
export interface Number {
    label: string;
}
@Injectable()
export class NumberService {

   constructor(public http: Http) {
   }
    public getNumberData() :Promise<Number[]> {
        var promise = this.http.get("assets/data/number.data.json").toPromise()
            .then((response) => {
                return response.json() as Number[];
            })
            .catch(this.errorHandler);
        return promise;    
    }
    private errorHandler(error: any): Promise<any> {
        return Promise.reject(error);
    }
}