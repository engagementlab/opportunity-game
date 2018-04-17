import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';

import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Location } from './models/location';
import { PlayerData } from './models/playerdata';
import { Character } from './models/character';

import * as _ from 'underscore';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class DataService {

    public locationData: Location[];
    public isLoading: Subject<boolean> = new Subject<boolean>();

    baseUrl: string;
    index: any;

    playerDataUpdate = new EventEmitter();
    public playerData: PlayerData = 
    {
        money:30,
        days: 0,
        character: {
            career_ranking: 0,
            engagement_ranking: 0,
            health_ranking: 0
        }
    };

    constructor(private http: HttpClient) {

        this.baseUrl = (environment.production ? 'https://'+window.location.host : 'http://localhost:3000') + '/api/';

    }

    public changeCharacter(attribute: string, value: number) {

        this.playerData.character[attribute] = value;
        this.playerDataUpdate.emit(this.playerData);

    }

    public changeMoneyAndDays(moneyVal: number, dayVal: number) {

        this.playerData.money += moneyVal;
        this.playerData.days += dayVal;
        this.playerDataUpdate.emit(this.playerData);

    }

    public modifyPlayerData(data: PlayerData) {

        this.playerData = data;
        // this.playerDataUpdate.emit(data);

    }

    public getLocationByUrl(locationUrl: string) {

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
