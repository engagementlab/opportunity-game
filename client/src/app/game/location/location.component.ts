import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { DataService } from '../../data.service';

import { GameLocation } from '../../models/gamelocation';
import { PlayerData } from '../../models/playerdata';
import { Opportunity } from '../../models/opportunity';

import * as _ from 'underscore';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class GameLocationComponent implements OnInit {

	currentLocation: GameLocation;

  actions: number;
  money: number;
  commLevel: number;
  jobLevel: number;
  englishLevel: number;

  public hasTransit: boolean;
  public hasJob: boolean;
	
  constructor(private route: ActivatedRoute, private router: Router, private location: Location, private _dataSvc: DataService) {

    this.money = this._dataSvc.playerData.money;
    this.actions = this._dataSvc.playerData.actions;

    this.commLevel = this._dataSvc.playerData.commLevel;
    this.jobLevel = this._dataSvc.playerData.jobLevel;
    this.englishLevel = this._dataSvc.playerData.englishLevel;

    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      this.money = data.money;
      this.actions = data.actions;

      this.commLevel = data.commLevel;
      this.jobLevel = data.jobLevel;
      this.englishLevel = data.englishLevel;

      if(data.gotTransit)
        this.hasTransit = true;
      else if(data.gotJob)
        this.hasJob = true;

    });

    this._dataSvc.locationDataUpdate.subscribe((data: GameLocation) => {

      this.currentLocation = data;

      _.each(data.opportunities, (thisOpp) => {
          thisOpp.stars = this.getStars();
      });

    });

  }

  ngOnInit() {

  	let url = this.route.snapshot.params.locationUrl;
  	this.currentLocation = this._dataSvc.getLocationByKey(url);

    if(this.currentLocation === undefined) {
      this.router.navigateByUrl('/game/home');
      return;
    }

    _.each(this.currentLocation.opportunities, (thisOpp) => {
        thisOpp.stars = this.getStars();
    });

  }

  viewOpportunity(id: Opportunity["_id"], enabled: boolean) {

    if(enabled === false) return;

    let detailsParent = document.getElementById('details');
    let allDetails = document.querySelector('#details').querySelectorAll('.opportunity');
    let detailsChild = (<HTMLElement>document.getElementById('detail_' + id));

    _.each(allDetails, (el) => {
      (<HTMLElement>el).style.display = 'none';
    });

    TweenLite.to(detailsParent, .5, {autoAlpha:1, display:'block'});
    TweenLite.to(document.getElementById('list'), .5, {autoAlpha:0, display:'none', oncomplete:() => {

      TweenLite.fromTo(detailsChild, 2, {autoAlpha:0}, {autoAlpha:1, delay:.5, display:'block', ease:Elastic.easeOut});
      
    
    }});

  }

  backToList(modalId: string) {
    
    TweenLite.to(document.getElementById('detail_'+modalId), 1, {autoAlpha:0, display:'none', ease: Back.easeIn, oncomplete:() => {

      TweenLite.to(document.getElementById('list'), 1, {autoAlpha:1, display:'block'});
      TweenLite.to(document.getElementById('details'), .5, {autoAlpha:0, display:'none'});
    
    }});

  }

  backToCategory() {
    
    this.location.back();

  }

  selectOpportunity(opportunity: Opportunity, modalId: string) {

    this.backToList(modalId);

    if(opportunity.givesTransit)
      this._dataSvc.modifyPlayerData('hasTransit', true);
    else if(opportunity.givesJob)
      this._dataSvc.modifyPlayerData('hasJob', true);
    
    this._dataSvc.updateStats(opportunity);
    this._dataSvc.updateOpportunity(opportunity, this.route.snapshot.params.locationUrl); 
    
    // Duration effect?
    if(opportunity.effect)
      this._dataSvc.startDurationEffect(opportunity.effect, opportunity.effectTrigger, opportunity.effectWait);

    if(opportunity.locationUnlocks !== undefined && opportunity.locationUnlocks.length > 0 && opportunity.triggerAmt === 0)
      this._dataSvc.enableLocations(opportunity.locationUnlocks);

  }

  getStars() {

    let stars = [];

    for(let i = 0; i < 3; i++) {
      stars.push({index: Math.random() >= 0.5 ? 1 : 2, nudge: (Math.floor(Math.random() * (6 - 0 + 1)) + 0)});
    }
    return stars;
  }

}
