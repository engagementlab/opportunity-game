import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';

import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Location } from './models/location';
import { Event } from './models/event';
import { PlayerData } from './models/playerdata';
import { Character } from './models/character';
import { Opportunity } from './models/opportunity';

import * as _ from 'underscore';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

@Injectable()
export class DataService {

    public locationData: Location[];
    public eventData: Event[];
    public isLoading: Subject<boolean> = new Subject<boolean>();

    baseUrl: string;
    index: any;

    playerDataUpdate = new EventEmitter();
    locationDataUpdate = new EventEmitter();
    endRoundUpdate = new EventEmitter();

    public playerData: PlayerData = 
    {
        round: 1,
        money: 5,
        actions: 5,
        
        commLevel: 0,
        jobLevel: 0,
        englishLevel: 0,
        
        wellnessScore: 5,

        hasTransit: false,
        hasJob: false,

        character: {
            career_ranking: 0,
            engagement_ranking: 0,
            health_ranking: 0
        },

        newRound: false,
        gotTransit: false,
        gotJob: false

    };

    constructor(private http: HttpClient) {

        this.baseUrl = (environment.production ? 'https://'+window.location.host : 'http://localhost:3000') + '/api/';

    }

    public changeCharacter(attribute: string, value: number) {

        this.playerData.character[attribute] = value;
        this.playerDataUpdate.emit(this.playerData);

    }

    public updateStats(moneyVal: number, actionVal: number = 0, commLevel: number = 0, jobLevel: number = 0, englishLevel: number = 0) {

        this.playerData.money += moneyVal;
        this.playerData.actions += actionVal;

        this.playerData.commLevel += commLevel;
        this.playerData.jobLevel += jobLevel;
        this.playerData.englishLevel += englishLevel;

        this.playerDataUpdate.emit(this.playerData);

        if(this.playerData.actions === 0)
            this.endRound();

    }

    public modifyPlayerData(key: string, value: any) {

        if(key === 'hasTransit')
            this.playerData.gotTransit = true;
        if(key === 'hasJob')
            this.playerData.gotJob = true;

        this.playerData[key] = value;

        this.playerDataUpdate.emit(this.playerData);

        this.playerData.gotJob = false;
        this.playerData.gotTransit = false;

    }

    public getLocationByUrl(locationUrl: string) {

        return _.where(this.locationData, {url: locationUrl})[0];

    }

    public updateOpportunity(opportunity: Opportunity, locationUrl: string) {

        _.each(this.locationData, (loc) => { 

            let thisOpp = _.where(loc.opportunities, {_id: opportunity._id})[0];

            if(thisOpp) {
                thisOpp.enabled = false;

                if(loc.url === locationUrl)
                    this.locationDataUpdate.emit(loc);
            }
        });

    }

    private endRound() {

        this.playerData.money = 5;
        this.playerData.actions = 5;

        this.playerData.wellnessScore = this.calcWellness();
        this.playerData.newRound = true;

        this.playerData.round++;
        this.playerDataUpdate.emit(this.playerData);

        this.playerData.newRound = false;

    }

    private calcWellness() {

        let jceLvl = 2 * (this.playerData.jobLevel + this.playerData.commLevel + this.playerData.englishLevel);
        return jceLvl + this.playerData.money;

    }

    private assembleData(newData: any) {

        this.locationData = newData.locations;
        this.eventData = newData.events;

        this.isLoading.next(false);

    }
	
    public getAllData(): Observable<any> {

        if(this.locationData !== undefined)            
            return Observable.of(this.locationData).map((d:any) => d);

        this.isLoading.next(true);
        
        return this.http.get(this.baseUrl+'get/data')
        .map((res:any)=> {
          return this.assembleData(res.data);
        })
        .catch((error:any) => { 
            this.isLoading.next(false);
            return Observable.throw(error);
        });

	}
}
