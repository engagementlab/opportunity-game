import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';

import { Subject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Character } from './models/character';
import { GameLocation } from './models/gamelocation';
import { Event } from './models/event';
import { PlayerData } from './models/playerdata';
import { Opportunity } from './models/opportunity';

import * as _ from 'underscore';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';

enum DurationEffectTrigger {
    actions = 0,
    rounds = 1
};
interface DurationEffect {
   id: string,
   trigger: DurationEffectTrigger,
   triggerWait: number,
   triggerCount: number
};
interface DelayedReward {     
    commReward: number,
    jobReward: number,
    englishReward: number,
    triggerWait: number,
    triggerCount: number
};

@Injectable()
export class DataService {

    public locationData: GameLocation[];
    public characterData: Character[];
    public eventData: Event[];
    public isLoading: Subject<boolean> = new Subject<boolean>();

    public assignedCharIndex: number = 1;

    baseUrl: string;
    index: any;

    durationEffectQueue = [];
    delayedRewardQueue = [];

    playerDataUpdate = new EventEmitter();
    locationDataUpdate = new EventEmitter();
    endRoundUpdate = new EventEmitter();
    effectTrigger = new EventEmitter();

    public playerData: PlayerData = 
    {
        round: 1,
        money: 30,
        actions: 50,
        
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

    public changeCharacter(index: number) {

        // this.playerData.character[attribute] = value;
        this.assignedCharIndex = index;
        this.playerDataUpdate.emit(this.playerData);

    }

    public updateStats(moneyVal: number, actionVal: number = 0, commLevel: number = 0, jobLevel: number = 0, englishLevel: number = 0, triggerAmt: number = 0) {

        this.playerData.money += moneyVal;
        this.playerData.actions += actionVal;

        // Trigger duration effects or delayed rewards? (if actions being removed)
        if(actionVal < 0)
        { 
            for(let i = 0; i < this.durationEffectQueue.length; i++) {
                let effect = this.durationEffectQueue[i];
    
                if(effect.trigger === DurationEffectTrigger.actions) {
                    effect.triggerCount -= actionVal;
    
                    if(effect.triggerCount >= effect.triggerWait) {
                        this.effectTrigger.emit(effect.id);
    
                        this.durationEffectQueue.splice(i, 1);
                        break;
                    }
                }
            }

            let e = 0;
            while(e < this.delayedRewardQueue.length) {
            
                let reward = this.delayedRewardQueue[e];
                reward.triggerCount -= actionVal;

                if(reward.triggerCount >= reward.triggerWait) {

                    this.playerData.commLevel += reward.commReward;
                    this.playerData.jobLevel += reward.jobReward;
                    this.playerData.englishLevel += reward.englishReward;

                    this.delayedRewardQueue.splice(e, 1);
                    break;
                }

                e++;
            
            }
        }

        // Reward now or later?
        if(triggerAmt === 0) {
            this.playerData.commLevel += commLevel;
            this.playerData.jobLevel += jobLevel;
            this.playerData.englishLevel += englishLevel;
        }
        else {
            let delayedReward: DelayedReward = {
                                                    commReward: commLevel,
                                                    jobReward: jobLevel,
                                                    englishReward: englishLevel,
                                                    triggerWait: triggerAmt, 
                                                    triggerCount: 0
                                               };
            this.delayedRewardQueue.push(delayedReward);
        }

        this.playerDataUpdate.emit(this.playerData);

        if(this.playerData.actions <= 0)
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

    public getLocationByKey(locationKey: string) {

        return _.where(this.locationData, {key: locationKey})[0];

    }

    public updateOpportunity(opportunity: Opportunity, locationKey: string) {

        _.each(this.locationData, (loc) => { 

            let thisOpp = _.where(loc.opportunities, {_id: opportunity._id})[0];

            if(thisOpp) {
                thisOpp.enabled = false;

                if(loc.key === locationKey)
                    this.locationDataUpdate.emit(loc);
            }
        }); 
    }

    public enableLocations(locationIds: string[]) {

        _.each(locationIds, (id) => { 

            let thisLoc = _.where(this.locationData, {_id: id})[0];

            if(thisLoc)
                thisLoc.enabled = true;
        }); 
    }

    public startDurationEffect(effectId: string, trigger: string, triggerWait: number) {

        let triggerType = (trigger === 'actions') ? DurationEffectTrigger.actions : DurationEffectTrigger.rounds;
        let effect: DurationEffect = { id: effectId, trigger: triggerType, triggerWait: triggerWait, triggerCount: 0 };
        this.durationEffectQueue.push(effect);

    }

    private endRound() {

        this.playerData.money = 5;
        this.playerData.actions = 5;

        this.playerData.wellnessScore = this.calcWellness();
        this.playerData.newRound = true;

        this.playerData.round++;
        this.playerDataUpdate.emit(this.playerData);

        this.playerData.newRound = false;

        // DEBUG ONLY
         _.each(this.locationData, (loc) => {

            _.each(loc.opportunities, (thisOpp) => {

            if(!thisOpp.enabled)
                thisOpp.enabled = undefined;

            }); 

            this.locationDataUpdate.emit(loc);
        }); 

    }

    private calcWellness() {

        let jceLvl = 2 * (this.playerData.jobLevel + this.playerData.commLevel + this.playerData.englishLevel);
        return jceLvl + this.playerData.money;

    }

    private assembleCharacterData(newData: any) {
        
        this.characterData = newData;

        this.isLoading.next(false);

    }

    private assembleData(newData: any) {

        this.locationData = newData.locations;
        this.eventData = newData.events;

        this.isLoading.next(false);

    }
    
    public getCharacterData(): Observable<any> {

        this.isLoading.next(true);
        
        return this.http.get(this.baseUrl+'get/characters')
        .map((res:any)=> {
          return this.assembleCharacterData(res.data);
        })
        .catch((error:any) => { 
            this.isLoading.next(false);
            return Observable.throw(error);
        });

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
