import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import * as _ from 'underscore';

import { Location } from './models/location';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class DataService {

    baseUrl: string;
    index: any;
    public gameData = new Map<string, any>();
    public locationData: Location[];

    public isLoading: Subject<boolean> = new Subject<boolean>();

    constructor(private http: HttpClient) {

        this.baseUrl = (environment.production ? 'https://'+window.location.host : 'http://localhost:3000') + '/api/';

    }

    public getLocationByUrl(locationUrl: string) {

        // console.log(_.where(this.locationData, {url: locationUrl}))
        return _.where(this.locationData, {url: locationUrl})[0];

    }

    private assembleData(newData: any, type: string) {

        this.locationData = newData[0];
        // this.gameData.set('game', newData[0][0]);

/*        switch(type) {
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
*/
        this.isLoading.next(false);

        return this.gameData;
    }
	
    public getAllData(type: string): Observable<any> {

        this.isLoading.next(true);
        
        return this.http.get(this.baseUrl+'get/'+type)
        .map((res:any)=> {
          return this.assembleData(res.data, type);
        })
        .catch((error:any) => { 
            this.isLoading.next(false);
            return Observable.throw(error);
        });

	}
}
