import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class GameMapComponent implements OnInit {

  locations: any[];

  constructor(private dataSvc: DataService) {

  	// TEMPORARY
    this.dataSvc.getAllData('data').subscribe(response => {
      
      this.locations = this.dataSvc.locationData;

    });

 }

  ngOnInit() {
  }

}
