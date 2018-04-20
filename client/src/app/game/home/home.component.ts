import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class GameHomeComponent implements OnInit {

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
