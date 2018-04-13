import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data.service';

import { Location } from '../../models/location';

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

}
