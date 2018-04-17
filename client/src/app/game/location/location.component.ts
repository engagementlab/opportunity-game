import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';

import { Location } from '../../models/location';
import { Service } from '../../models/service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class GameLocationComponent implements OnInit {

	currentLocation: Location;
	
  constructor(private route: ActivatedRoute, private dataSvc: DataService) { 

  }

  ngOnInit() {

  	let url = this.route.snapshot.params.locationUrl;
  	this.currentLocation = this.dataSvc.getLocationByUrl(url);

  }
  
  getServiceInfoById(id: Service["_id"]) {

        return _.where(this.currentLocation, {_id: id})[0];

  }

  selectService(money: number, days: number) {

    // let moneyCost = getServiceInfoById(id).
    this.dataSvc.changeMoney(-money);



  }

}
