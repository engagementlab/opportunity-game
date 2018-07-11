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

    TweenLite.fromTo(document.querySelector('#flavor h2'), 1, {autoAlpha:0, top:-47}, {autoAlpha:1, top:0, delay:.7, ease:Back.easeOut});
    TweenLite.fromTo(document.querySelector('#flavor div'), 1, {autoAlpha:0, top:-47}, {autoAlpha:1, top:0, delay:1, ease:Back.easeOut});
    // TweenLite.fromTo(document.getElementById('back'), 1, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:1.9, ease:Elastic.easeOut});
    setTimeout(() => {
      TweenMax.staggerFromTo(document.querySelectorAll('#list button'), .4, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, display:'block', ease:Back.easeOut}, .08);
    }, 2000);

  }

  viewOpportunity(id: Opportunity["_id"], enabled: boolean) {

    if(enabled === false) {
      TweenMax.fromTo(document.getElementById('listing_'+id), 0.15, {x:-20}, {x:20, repeat:2, yoyo:true, ease:Sine.easeInOut, onComplete:function(){
        TweenMax.to(this.target, 1.5, {x:0, ease:Elastic.easeOut});
      }});
      return;
    } 

    let detailsParent = document.getElementById('details');
    let detailsChild = (<HTMLElement>document.getElementById('detail_' + id));
    let allDetails = document.querySelector('#details').querySelectorAll('.opportunity');

    _.each(allDetails, (el) => {
      (<HTMLElement>el).style.display = 'none';
    });

    TweenLite.to(detailsParent, .5, {autoAlpha:1, display:'block'});
    TweenLite.to(document.getElementById('list'), .3, {autoAlpha:0, display:'none', oncomplete:() => {

      TweenLite.fromTo(detailsChild, 1, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:.3, display:'block', ease:Back.easeOut});
    
    }});

  }

  backToList(modalId: string) {
    
    TweenLite.fromTo(document.getElementById('detail_'+modalId), .5, {autoAlpha:1, scale:1}, {autoAlpha:0, scale:0, display:'none', ease:Back.easeIn});
    TweenLite.to(document.getElementById('list'), .3, {autoAlpha:1, delay:.5, display:'block'});
    TweenLite.to(document.getElementById('details'), .5, {autoAlpha:0, delay:.5, display:'none'});

  }

  backToCategory() {

    ion.sound.play('click');
    
    this.location.back();

  }

  selectOpportunity(opportunity: Opportunity, modalId: string) {

    // Hide buttons
    TweenLite.to(document.querySelector('#detail_'+modalId+' .buttons'), .001, {alpha:0});

    // Show 'go home' modal?
    if(this.currentLocation.key === 'your-new-apartment') {
      TweenLite.fromTo(document.getElementById('detail_'+modalId), .5, {autoAlpha:1, scale:1}, {autoAlpha:0, scale:0, display:'none', ease:Back.easeIn});
      TweenLite.to(document.getElementById('details'), .5, {autoAlpha:0, delay:.5, display:'none'});
      TweenLite.fromTo(document.getElementById('details-home'), 1, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:.7, display:'block', ease:Back.easeOut});
    }  
    else
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
    
    if(!this._dataSvc.playerData.sawTutorial) {
      this._dataSvc.playerData.sawTutorial = true;

      let newVolume = 1;
      let fadeOut = setInterval(() => {
        
        ion.sound.volume('music-tutorial', {volume: newVolume});
        newVolume -= .05;

        if(newVolume <= 0) {
          clearInterval(fadeOut);

          ion.sound.stop('music-tutorial');
          ion.sound.play('music-base', {loop: true, volume:newVolume});
          
          let fadeIn = setInterval(() => {
            newVolume += .05;
            ion.sound.volume('music-base', {volume: newVolume});
            if(newVolume >= 1)
              clearInterval(fadeIn);

          }, 100);

        }

      }, 100);
    
    }


  }

  getStars() {

    let stars = [];

    for(let i = 0; i < 3; i++) {
      stars.push({index: Math.random() >= 0.5 ? 1 : 2, nudge: (Math.floor(Math.random() * (6 - 0 + 1)) + 0)});
    }
    return stars;
  }

}
