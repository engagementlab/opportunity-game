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
  filters: object[] = 
  [
      {job: 'Jobs & Training'},
      {community: 'Community'},
      {english: 'English Language'},
      {health_and_help: 'Health & Help'}
  ];

  constructor(private dataSvc: DataService) {

    this.dataSvc.getAllData().subscribe(response => {
      
      this.locations = this.dataSvc.locationData;

    });   


    console.log(this.filters)

  }

  ngOnInit() {
    
  }

  filterSelection(category: string) {

    let x, i;
    let showAll = (category === "all");
    x = document.getElementsByClassName("location");
    document.getElementById('map').classList.remove('hidden');
    document.getElementById('home').classList.add('hidden');
    
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
