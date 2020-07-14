import { Injectable } from "@angular/core";
import { HttpClient,HttpHeaders,HttpErrorResponse } from "@angular/common/http";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Injectable()
export class AccessProviders{
    //
    server: string = 'http://192.168.0.16/tutorial/api/';

    constructor(
        public  http: HttpClient,
      ) { }

        postData(body, file){
            let headers = new HttpHeaders({
                'Content-type':'application/json; charset=UTF-8'
            });
            let options = {
                headers : headers
            }

            return this.http.post(this.server + file, JSON.stringify(body), options)
            .timeout(59000) // 59 segundos de time out
            .map(res => res);
        }

}