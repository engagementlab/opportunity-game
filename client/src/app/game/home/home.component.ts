import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import * as _ from 'underscore';

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

  filterSelection(category: string) {
    let x, i;
    let showAll = (category === "all");
    x = document.getElementsByClassName("location");
    
    // Add the "show" class to the filtered elements, and remove the "show" class from the elements that are not selected
    for (i = 0; i < x.length; i++) {
      x[i].classList.remove("show");
    
      if(showAll) {
        x[i].classList.add("show");
        continue;
      }

      if (x[i].dataset.categories.indexOf(category) > -1) 
        x[i].classList.add("show");

    }
  }

}
