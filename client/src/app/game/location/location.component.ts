import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { DataService } from '../../data.service';

import { GameLocation } from '../../models/gamelocation';
import { Opportunity } from '../../models/opportunity';

import * as _ from 'underscore';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class GameLocationComponent implements OnInit {

	currentLocation: GameLocation;
	
  constructor(private route: ActivatedRoute, private router: Router, private _location: Location, private _dataSvc: DataService) { 

    this._dataSvc.locationDataUpdate.subscribe((data: GameLocation) => {

      this.currentLocation = data;

    });

  }

  ngOnInit() {

  	let url = this.route.snapshot.params.locationUrl;
  	this.currentLocation = this._dataSvc.getLocationByKey(url);

    if(this.currentLocation === undefined)
      this.router.navigateByUrl('/game/home');

  }

  getCosts(opportunity: Opportunity) {

    let costs = [];

    if(opportunity.actionCost > 0)
      costs.push({icon: 'action', amt: opportunity.actionCost});
    if(opportunity.moneyCost > 0)
      costs.push({icon: 'money', amt: opportunity.moneyCost});

    return costs;

  }

  viewOpportunity(id: Opportunity["_id"]) {

    let detailsParent = document.getElementById('details');
    let allDetails = document.querySelector('#details').querySelectorAll('.opportunity');
    let detailsChild = (<HTMLElement>document.getElementById('detail_' + id));

    _.each(allDetails, (el) => {
      (<HTMLElement>el).style.display = 'none';
    });

    detailsParent.style.display = 'block';
    TweenLite.to(document.getElementById('list'), .5, {autoAlpha:0, display:'none', oncomplete:() => {

      TweenLite.fromTo(detailsChild, 2, {scale:0}, {scale:1, autoAlpha:1, display:'block', ease: Elastic.easeOut});
    
    }});

  }

  backToMap() {

      this._location.back();

  }

  backToList(modalId: string) { 
    
    TweenLite.fromTo(document.getElementById('detail_'+modalId), 1, {scale:1}, {scale:0, autoAlpha:0, display:'none', ease: Back.easeIn, oncomplete:() => {

      TweenLite.to(document.getElementById('list'), 1, {autoAlpha:1, display:'block'});
      document.getElementById('details').style.display = 'none';
    
    }});

  }

  selectOpportunity(opportunity: Opportunity, modalId: string) {

    this._dataSvc.updateOpportunity(opportunity, this.route.snapshot.params.locationUrl);
    this.backToList(modalId);

    if(opportunity.locationUnlocks !== undefined && opportunity.locationUnlocks.length > 0) {
      this._dataSvc.enableLocations(opportunity.locationUnlocks);
      return;
    }
    
    this._dataSvc.updateStats(-opportunity.moneyCost, -opportunity.actionCost, opportunity.commReward, opportunity.jobReward, opportunity.englishReward, opportunity.triggerAmt);

    if(opportunity.givesTransit)
      this._dataSvc.modifyPlayerData('hasTransit', true);
    else if(opportunity.givesJob)
      this._dataSvc.modifyPlayerData('hasJob', true);
    
    // Duration effect?
    if(opportunity.effect)
      this._dataSvc.startDurationEffect(opportunity.effect, opportunity.effectTrigger, opportunity.effectWait);

  }

}
