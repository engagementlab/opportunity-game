import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class JsonService {

    baseUrl: string;
    public isLoading: Subject<boolean> = new Subject<boolean>();

    constructor(private http: HttpClient) {

        this.baseUrl = (environment.production ? 'https://'+window.location.host : 'http://localhost:3000') + '/api/';

    }

    index: any;
    data = new Map<string, any>();
    modules = new Map<string, any>();

    assembleData(newData: any, type: string) {

        if(type.indexOf('module/') > -1) {
            this.modules.set(newData.url, newData);
            this.isLoading.next(false);

            return this.modules;
        }

        switch(type) {
            case 'index':
                this.data.set("index", newData[0]);

                newData[1].forEach((element) => {
                    this.modules.set(element.url, element);
                });
                this.data.set("modules", this.modules);
                break;
            case 'guides':
                newData[0].forEach((element) => {
                    this.modules.set(element.url, element);
                });
                break;
            case 'about':
                this.data.set("about", newData[0]);
                break;
        }

        this.isLoading.next(false);

        return this.data;
    }

    haveData(type: string) {

        let have: boolean;

        if(type.indexOf('module/') > -1 && this.modules.has(type.replace('module/','')))
            return true;
        
        switch(type) {
            case 'index':
                have = this.data.get("index") !== undefined && this.data.get("modules") !== undefined && this.data.get("modules").length > 1;
                break;
            case 'guides':
                have = this.modules.size > 1;
                break;
            case 'about':
                have = this.data.get("about") !== undefined;
                break;
        }

        return have;

    }
	
    getAllData(type: string): Observable<any> {


        if(type.indexOf('module/') > -1 && this.haveData(type))
            return Observable.of(this.modules).map((d:any) => d);
        else if(this.haveData(type)) {
            return Observable.of(this.data).map((d:any) => d);
        }
        else  {
            this.isLoading.next(true);
            return this.http.get(this.baseUrl+'get/'+type)
            .map((res:any)=> {
              return this.assembleData(res.data, type);
            })
            .catch((error:any) => { 
                this.isLoading.next(false);
                return Observable.throw(error);
            })

        }
	}
}
