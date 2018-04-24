import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../data.service';

import { Location } from '../../models/location';
import { Opportunity } from '../../models/opportunity';

import { TweenLite } from 'gsap';
import * as _ from 'underscore';


@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class GameLocationComponent implements OnInit {

	currentLocation: Location;
	
  constructor(private route: ActivatedRoute, private router: Router, private _dataSvc: DataService) { 

    this._dataSvc.locationDataUpdate.subscribe((data: Location) => {

      this.currentLocation = data;

    });

  }

  ngOnInit() {

  	let url = this.route.snapshot.params.locationUrl;
  	this.currentLocation = this._dataSvc.getLocationByUrl(url);

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

    detailsChild.style.display = 'block';
    TweenLite.to(document.getElementById('list'), 1, {top:'100%', autoAlpha:0});
    TweenLite.to(detailsParent, 1, {top:'0%', autoAlpha:1, display:'block'});

  }

  backToMap() {

      this.router.navigateByUrl('/game/home');
  }

  backToList() { 

    TweenLite.to(document.getElementById('details'), 1, {top:'100%', autoAlpha:0});
    TweenLite.to(document.getElementById('list'), 1, {top:'0%', autoAlpha:1, display:'block'});

  }

  selectOpportunity(opportunity: Opportunity) {

    this._dataSvc.updateStats(-opportunity.moneyCost, -opportunity.actionCost, opportunity.commReward, opportunity.jobReward, opportunity.englishReward);
    this._dataSvc.updateOpportunity(opportunity, this.route.snapshot.params.locationUrl);

    if(opportunity.givesTransit)
      this._dataSvc.modifyPlayerData('hasTransit', true);
    else if(opportunity.givesJob)
      this._dataSvc.modifyPlayerData('hasJob', true);

    this.backToList();


  }

}
