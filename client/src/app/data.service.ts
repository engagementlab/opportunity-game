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
import { Goal } from './models/goal';

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
    opportunity: Opportunity,
    triggerWait: number,
    triggerCount: number
};

@Injectable()
export class DataService {

    public locationData: GameLocation[];
    public characterData: Character[];
    public goalData: Goal[];
    public eventData: Event[];

    public isLoading: Subject<boolean> = new Subject<boolean>();

    public assignedChar: Character;
    public assignedGoal: Goal;

    public commGoalLast: number = 0;
    public jobGoalLast: number = 0;
    public englishGoalLast: number = 0;

    baseUrl: string;
    index: any;

    durationEffectQueue = [];
    delayedRewardQueue = [];

    playerDataUpdate = new EventEmitter();
    locationDataUpdate = new EventEmitter();
    endRoundUpdate = new EventEmitter();
    effectTrigger = new EventEmitter();
    rewardTrigger = new EventEmitter();
    paydayTrigger = new EventEmitter();

    public playerData: PlayerData = 
    {
        round: 1,
        money: (environment.dev === undefined && environment.dev === true) ? 20 : 3,
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
        gotJob: false,
        metGoals: false

    };

    constructor(private http: HttpClient) {

        this.baseUrl = (environment.production ? 'https://'+window.location.host : 'http://localhost:3000') + '/api/';

    }

    public changeCharacter(index: number, goal: Goal) {

        this.assignedChar = this.characterData[index];
        this.assignedGoal = goal;
        
        this.playerDataUpdate.emit(this.playerData);

    }

    public updateStats(opportunity: any) {

        this.playerData.money -= opportunity.moneyCost;
        this.playerData.actions -= opportunity.actionCost;

        // Trigger duration effects or delayed rewards? (if actions being removed)
        if(opportunity.actionCost > 0)
        { 
            let i = 0;
            let effectsToRemove = [];
            while(i < this.durationEffectQueue.length) {
                let effect = this.durationEffectQueue[i];
    
                if(effect.trigger === DurationEffectTrigger.actions) {
                    effect.triggerCount += opportunity.actionCost;

                    if(effect.triggerCount >= effect.triggerWait) {
                        effectsToRemove.push(effect);
                    }
                }

                i++;
            }

            let e = 0;
            while(e < this.delayedRewardQueue.length) {
            
                let reward = this.delayedRewardQueue[e];
                reward.triggerWait -= opportunity.actionCost;

                if(reward.triggerWait <= 0) {

                    this.playerData.commLevel += reward.opportunity.commReward;
                    this.playerData.jobLevel += reward.opportunity.jobReward;
                    this.playerData.englishLevel += reward.opportunity.englishReward;
                    
                    this.playerData.money += reward.opportunity.moneyReward;         
                    this.playerData.actions += reward.opportunity.actionReward;
                    
                    this.rewardTrigger.emit({type: 'opportunity', opp: reward.opportunity});
                    this.playerDataUpdate.emit(this.playerData);

                    this.delayedRewardQueue.splice(e, 1);
                    break;

                }

                e++;
            
            }

            // Remove used effects
            this.effectTrigger.emit(effectsToRemove);
            this.durationEffectQueue = _.difference(this.durationEffectQueue, effectsToRemove);
        }

        // Reward now or later?
        if(opportunity.triggerAmt === 0) {

            this.playerData.commLevel += opportunity.commReward;
            this.playerData.jobLevel += opportunity.jobReward;
            this.playerData.englishLevel += opportunity.englishReward;
            
            this.playerData.money += opportunity.moneyReward;            
            this.playerData.actions += opportunity.actionReward;

        }
        else {

            let delayedReward: DelayedReward = {
                                                    opportunity: opportunity,
                                                    triggerWait: opportunity.triggerAmt, 
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

    }

    public getLocationByKey(locationKey: string) {

        let currentLoc = _.where(this.locationData, {key: locationKey})[0];
        if(currentLoc === undefined) return undefined;
        
        // Update costs
        _.each(currentLoc.opportunities, (thisOpp) => {
            thisOpp.costs = this.getCosts(thisOpp);
            thisOpp.locked = _.some(thisOpp.costs, (opp) => {
                                  return opp['has'] !== undefined && opp['has'] === false;
                                });
        });

        return currentLoc;

    }

    public getUpdatedEvents() {

        // Update availability
        _.each(this.eventData, (thisEvt) => {
            let canBuy = false;
            if(thisEvt.moneyCost > 0 && thisEvt.actionCost > 0)
                canBuy = (this.playerData.money >= thisEvt.moneyCost && this.playerData.actions >= thisEvt.actionCost);
            else if(thisEvt.moneyCost > 0 && thisEvt.actionCost < 1)
                canBuy = (this.playerData.money >= thisEvt.moneyCost);
            else if(thisEvt.actionCost > 0 && thisEvt.moneyCost < 1)
                canBuy = (this.playerData.actions >= thisEvt.actionCost);
            
            thisEvt.available = canBuy;
            thisEvt.reward = this.getEventReward(thisEvt);
            thisEvt.triggerAmt = 0;

        });

        return this.eventData;

    }

    public getEventById(id: string) {
        
        return _.findWhere(this.eventData, { _id: id } );

    }

    public removeEvent(id: string) {
        
        this.eventData = _.without(this.eventData, _.findWhere(this.eventData, {
                          _id: id
                        }));

    }

    public updateOpportunity(opportunity: Opportunity, locationKey: string) {

        _.each(this.locationData, (loc) => { 

            let thisOpp = _.where(loc.opportunities, {_id: opportunity._id})[0];

            // Update costs
            _.each(loc.opportunities, (thisOpp) => {
                thisOpp.costs = this.getCosts(thisOpp);
                thisOpp.locked = _.some(thisOpp.costs, (opp) => {
                                      return opp['has'] !== undefined && opp['has'] === false;
                                    });
            });

            if(thisOpp) {
                thisOpp.enabled = false;

                if(loc.key === locationKey)
                    this.locationDataUpdate.emit(loc);
            }
        }); 
    }

    public enableLocations(locationIds: string[]) {

        let enabledLocations = [];
        _.each(locationIds, (id) => { 

            let thisLoc = _.where(this.locationData, {_id: id})[0];

            if(thisLoc) {
                thisLoc.enabled = true;
                enabledLocations.push(thisLoc);
            }

        }); 

        this.rewardTrigger.emit({type: 'location', location: enabledLocations});
    }

    public startDurationEffect(effectId: string, trigger: string, triggerWait: number) {

        let triggerType = (trigger === 'actions') ? DurationEffectTrigger.actions : DurationEffectTrigger.rounds;

        let effect: DurationEffect = { id: effectId, trigger: triggerType, triggerWait: triggerWait, triggerCount: 0 };
        this.durationEffectQueue.push(effect);

    }

    public showPayday() {

        // Only if player has job
        if(this.playerData.hasJob === true)
            this.paydayTrigger.emit();

    }

    private endRound() {

        // Only if player has job
        if(this.playerData.hasJob === true)
            this.playerData.money += environment.dev ? 20 : 3;
        
        this.playerData.actions += 5;

        // DEBUG ONLY
        if(environment.dev) {
            _.each(this.locationData, (loc) => {
                _.each(loc.opportunities, (thisOpp) => {

                  thisOpp.enabled = undefined;
                  thisOpp.locked = undefined;

                }); 

                this.locationDataUpdate.emit(loc);
            }); 
        }

        this.playerData.newRound = true;
        this.playerData.metGoals = this.metGoals();
        this.playerData.round++;

        this.playerDataUpdate.emit(this.playerData);

        this.playerData.newRound = false;

    }

    private metGoals() {

        return (this.playerData.commLevel >= this.assignedGoal.commGoal) && 
               (this.playerData.jobLevel >= this.assignedGoal.jobGoal) &&
               (this.playerData.englishLevel >= this.assignedGoal.englishGoal);

    }

    private assembleCharacterData(newData: any) {
        
        this.characterData = newData.characters;
        this.goalData = newData.goals;

        this.assignedGoal = this.goalData[0];
        this.assignedChar = this.characterData[0];

        this.isLoading.next(false);

    }

    private assembleData(newData: any) {

        this.locationData = newData.locations;
        this.eventData = newData.events;

        _.each(this.locationData, (loc) => {

            _.each(loc.opportunities, (thisOpp) => {
                thisOpp.reward = this.getReward(thisOpp);
                thisOpp.costs = this.getCosts(thisOpp);
                thisOpp.locked = _.some(thisOpp.costs, (opp) => {
                                      return opp['has'] !== undefined && opp['has'] === false;
                                    });
            });

        }); 
        _.each(this.eventData, (thisEvt) => {
            thisEvt.reward = this.getReward(thisEvt);
            thisEvt.costs = this.getCosts(thisEvt);
            // console.log(thisEvt.costs)
            thisEvt.locked = _.some(thisEvt.costs, (evt) => {
                                  return evt['has'] !== undefined && evt['has'] === false;
                                });
        });


        this.isLoading.next(false);

    }

    private getEventReward(evt: Event) {

        let rewardToShow = {icon: 'none'};

        if(evt.commReward > 0)
          rewardToShow.icon = 'community';

        else if(evt.jobReward > 0)
          rewardToShow.icon = 'training-color';

        else if(evt.englishReward > 0)
          rewardToShow.icon = 'english';

        else if(evt.actionReward > 0)
          rewardToShow.icon = 'action-cost';

        else if(evt.moneyCost > 0)
          rewardToShow.icon = 'money';

        return rewardToShow;

    }

    private getReward(opportunity: any) {

        let rewardToShow = {icon: 'none', iconDetail: 'none', badges: []};

        if(opportunity.givesTransit)
          rewardToShow = {icon: 'transit-opportunity', iconDetail: 'transit', badges: []};
        
        else if(opportunity.givesJob)
          rewardToShow = {icon: 'job-opportunity', iconDetail: 'job', badges: []};

        else if(opportunity.moneyReward > 0)
          rewardToShow = {icon: 'money-opportunity', iconDetail: 'money', badges: []};

        else if(opportunity.actionReward > 0)
          rewardToShow = {icon: 'action-opportunity', iconDetail: 'action', badges: []};

        else if(opportunity.commReward > 0)
          rewardToShow = {icon: 'community-opportunity', iconDetail: 'community', badges: ['gold_levelup']};

        else if(opportunity.jobReward > 0)
          rewardToShow = {icon: 'training-opportunity', iconDetail: 'training-color', badges: ['gold_levelup']};

        else if(opportunity.englishReward > 0)
          rewardToShow = {icon: 'english-opportunity', iconDetail: 'english', badges: ['gold_levelup']};

        else if(opportunity.locationUnlocks && opportunity.locationUnlocks.length > 0)
          rewardToShow = {icon: 'map-opportunity', iconDetail: 'map', badges: ['gold_unlock']};

        if((opportunity.effect && opportunity.effectWait > 0) || opportunity.triggerAmt > 0) {
            rewardToShow.badges.push('gold_clock');
        }

        return rewardToShow;

    }

    private getCosts(opportunity: any) {

        let costs = [];

        if(opportunity.actionCost > 0)
          costs.push({icon: 'action', amt: opportunity.actionCost, has: opportunity.actionCost<=this.playerData.actions});
        if(opportunity.moneyCost > 0)
          costs.push({icon: 'money', amt: opportunity.moneyCost, has: opportunity.moneyCost<=this.playerData.money});
        if(opportunity.commCost > 0)
          costs.push({icon: 'community', amt: opportunity.commCost, has: opportunity.commCost<=this.playerData.commLevel, isLvl: true});
        if(opportunity.jobCost > 0)
          costs.push({icon: 'training', amt: opportunity.jobCost, has: opportunity.jobCost<=this.playerData.jobLevel, isLvl: true});
        if(opportunity.englishCost > 0)
          costs.push({icon: 'english', amt: opportunity.englishCost, has: opportunity.englishCost<=this.playerData.englishLevel, isLvl: true});
        if(opportunity.requiresTransit === true)
          costs.push({icon: 'transit', has: this.playerData.hasTransit});
        if(opportunity.requiresJob === true)
          costs.push({icon: 'job', has: this.playerData.hasJob});

        return costs;

    }
    
    public getCharacterData(): Observable<any> {

        if(this.characterData !== undefined)            
            return Observable.of(this.characterData).map((d:any) => d);

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
