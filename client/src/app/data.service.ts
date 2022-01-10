import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '@angular/http';

import { Subject ,  Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../environments/environment';

import { Character } from './models/character';
import { GameLocation } from './models/gamelocation';
import { Event } from './models/event';
import { PlayerData } from './models/playerdata';
import { Opportunity } from './models/opportunity';
import { Goal } from './models/goal';

import * as _ from 'underscore';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';


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
    public playerPriority: number = 1;
    public surveyUrl: string;

    currentLocation: GameLocation;

    baseUrl: string;
    index: any;
    actionsUntilLifeEvent: number = 2;
    paydayWaitActions: number;
    actionsUntilPayday: number;
    paydayMoney: number;

    durationEffectQueue = [];
    delayedRewardQueue = [];

    playerDataUpdate = new EventEmitter();
    locationDataUpdate = new EventEmitter();
    endRoundUpdate = new EventEmitter();
    effectTrigger = new EventEmitter();
    lifeEventTrigger = new EventEmitter();
    rewardTrigger = new EventEmitter();
    paydayTrigger = new EventEmitter();

    public playerData: PlayerData = 
    {
        round: 1,
        money: 0,
        actions: 0,
        
        commLevel: 0,
        jobLevel: 0,
        englishLevel: 0,
        
        wellnessScore: 0,
        wellnessGoal: 0,

        hasTransit: false,
        hasJob: false,

        character: {
            career_ranking: 0,
            engagement_ranking: 0,
            health_ranking: 0
        },

        gameEnded: false,
        gotTransit: false,
        gotJob: false,
        sawTutorial: false,
        sawCityIntro: false

    };

    constructor(private http: HttpClient) {

        this.baseUrl = (environment.production ? 'https://'+window.location.host : 'http://localhost:3000') + '/api/';

    }

    public changeCharacter(index: number) {

        this.assignedChar = this.characterData[index];
        
        this.playerDataUpdate.emit(this.playerData);

    }

    public updateStats(opportunity: any) {

        this.playerData.money -= opportunity.moneyCost;
        if(this.playerData.money <= 0)
            this.playerData.money = 0;

        this.playerData.actions -= opportunity.actionCost;
        if(this.playerData.actions <= 0)
            this.playerData.actions = 0;

        this.actionsUntilLifeEvent -= opportunity.actionCost;

        // Only if player has job
        if(this.playerData.hasJob === true) {
            this.actionsUntilPayday -= opportunity.actionCost;
            if(this.actionsUntilPayday <= 0)
            {
                this.actionsUntilPayday = this.paydayWaitActions;
                this.playerData.money += this.paydayMoney;
                this.showPayday();
            }
        }

        // Reward now or later (undefined if life event)
        if(opportunity.triggerAmt === 0 || !opportunity.triggerAmt) {

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

        this.playerData.wellnessScore = this.calcWellness();

        // Show life events and process opportunity effects only if not game over
        if(this.playerData.actions <= 0 || this.playerData.money <= 0 || (this.playerData.wellnessScore >= this.playerData.wellnessGoal))
            this.endGame();
        else {            
            if(this.actionsUntilLifeEvent === 0)
            {
                this.actionsUntilLifeEvent = 6;
                this.lifeEventTrigger.emit();
            }

            // Trigger duration effects or delayed rewards? (if actions being removed)
            if(opportunity.actionCost > 0)
            { 
                let i = 0;
                let effectsToRemove = [];
                while(i < this.durationEffectQueue.length) {
                    let effect = this.durationEffectQueue[i];
        
                    if(effect.trigger === DurationEffectTrigger.actions) {
                        effect.triggerCount += opportunity.actionCost;

                        if(effect.triggerCount >= effect.triggerWait)
                            effectsToRemove.push(effect);
                    }

                    i++;
                }

                let e = 0;
                while(e < this.delayedRewardQueue.length) {

                    let reward = this.delayedRewardQueue[e];

                    // Prevent counting opp just taken towards delayed trigger
                    if(reward.opportunity !== opportunity) {
                
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
                    }

                    e++;
                
                }

                // Calculate again in case delayed reward was given
                this.playerData.wellnessScore = this.calcWellness();

                // Remove used effects
                this.effectTrigger.emit(effectsToRemove);
                this.durationEffectQueue = _.difference(this.durationEffectQueue, effectsToRemove);
            }
        }

        this.playerDataUpdate.emit(this.playerData);

        // Update location player is at, if any
        if(this.currentLocation !== undefined) {
            this.updateCurrentLocation(this.currentLocation);
            this.locationDataUpdate.emit(this.currentLocation);
        }

    }

    public modifyPlayerData(key: string, value: any) {

        if(key === 'hasTransit')
            this.playerData.gotTransit = true;
        if(key === 'hasJob')
            this.playerData.gotJob = true;

        this.playerData[key] = value;
        this.playerDataUpdate.emit(this.playerData);
        
        this.playerData.gotTransit = false;
        this.playerData.gotJob = false;

    }

    public getLocationByKey(locationKey: string) {

        this.currentLocation = _.where(this.locationData, {key: locationKey})[0];
        if(this.currentLocation === undefined) return undefined;
        
        // Update costs
        _.each(this.currentLocation.opportunities, (thisOpp) => {
            thisOpp.costs = this.getCosts(thisOpp);
            thisOpp.reqs = this.getReqs(thisOpp);
            thisOpp.locked = _.some(thisOpp.costs.concat(thisOpp.reqs), (opp) => {
                                      return opp['has'] !== undefined && opp['has'] === false;
                                });
        });

        return this.currentLocation;

    }

    public unsetLocation() {
        
        this.currentLocation = undefined;

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

            this.updateCurrentLocation(loc);

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

        this.paydayTrigger.emit();

    }

    private updateCurrentLocation(loc: GameLocation) {

        // Update costs of locations' opportunities
        _.each(loc.opportunities, (thisOpp) => {
            thisOpp.costs = this.getCosts(thisOpp);
            thisOpp.reqs = this.getReqs(thisOpp);

            thisOpp.locked = _.some(thisOpp.costs.concat(thisOpp.reqs), (opp) => {
                                  return opp['has'] !== undefined && opp['has'] === false;
                                });

        });

    }

    private endGame() {

        // Only if player has job
        // if(this.playerData.hasJob === true)
        //     this.playerData.money += environment.dev ? 20 : 3;

        this.playerData.gameEnded = true;
        this.playerDataUpdate.emit(this.playerData);

    }

    private calcWellness() {

        let jceLvl = (6*this.playerData.jobLevel) + (6*this.playerData.commLevel) + (6*this.playerData.englishLevel);
        
        if(this.playerData.hasJob)
            jceLvl += 15;
        if(this.playerData.hasTransit)
            jceLvl += 15;

        return jceLvl;

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

        // Default config values
        this.playerData.money = newData.config.startingMoney;
        this.playerData.actions = newData.config.startingActions;
        this.playerData.wellnessGoal = newData.config.wellnessGoal;
        this.paydayMoney = newData.config.paydayMoney;

        this.actionsUntilPayday = newData.config.paydayWaitActions; 
        this.paydayWaitActions = newData.config.paydayWaitActions;

        this.surveyUrl = newData.config.surveyUrl;

        this.playerDataUpdate.emit(this.playerData);

        this.locationData = newData.locations;
        this.eventData = newData.events;

        _.each(this.locationData, (loc) => {

            _.each(loc.opportunities, (thisOpp) => {
                thisOpp.reward = this.getReward(thisOpp);
                thisOpp.costs = this.getCosts(thisOpp);
                thisOpp.reqs = this.getReqs(thisOpp);

                thisOpp.locked = _.some(thisOpp.costs.concat(thisOpp.reqs), (opp) => {
                                      return opp['has'] !== undefined && opp['has'] === false;
                                    });
            });

        }); 

        _.each(this.eventData, (thisEvt) => {
            thisEvt.reward = this.getReward(thisEvt);
            thisEvt.costs = this.getCosts(thisEvt);
            thisEvt.reqs = this.getReqs(thisEvt);

            thisEvt.locked = _.some(thisEvt.costs.concat(thisEvt.reqs), (evt) => {
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

        if(opportunity.triggerAmt > 0) {
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

        return costs;

    }

    private getReqs(opportunity: any) {

        let reqs = [];

        if(opportunity.commCost > 0)
          reqs.push({icon: 'community', amt: opportunity.commCost, has: opportunity.commCost<=this.playerData.commLevel, isLvl: true});
        if(opportunity.jobCost > 0)
          reqs.push({icon: 'training', amt: opportunity.jobCost, has: opportunity.jobCost<=this.playerData.jobLevel, isLvl: true});
        if(opportunity.englishCost > 0)
          reqs.push({icon: 'english', amt: opportunity.englishCost, has: opportunity.englishCost<=this.playerData.englishLevel, isLvl: true});
        if(opportunity.requiresTransit === true)
          reqs.push({icon: 'transit', has: this.playerData.hasTransit});
        if(opportunity.requiresJob === true)
          reqs.push({icon: 'job', has: this.playerData.hasJob});

        return reqs;

    }
    
    public getCharacterData(): Observable<any> {

        return this.http.get(this.baseUrl+'get/characters').pipe(
            map((res:any)=> {
          return this.assembleCharacterData(res.data);
        }));

    }
	
    public getAllData(): Observable<any> {

        return this.http.get(this.baseUrl+'get/data').pipe(
            map((res:any)=> {
          return this.assembleData(res.data);
        }))

	}
}
