import { Component, OnInit, AfterViewChecked, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

import { DataService } from '../../data.service';
import { Goal } from '../../models/goal';
import { Character } from '../../models/character';
import { PlayerData } from '../../models/playerdata';

import * as _ from 'underscore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class GameHomeComponent implements OnInit, AfterViewChecked {

  public character: Character;

  loaded: boolean;
  locations: any[];
  filters: object[] = 
  [
      {key: 'community', label: 'Community'},
      {key: 'job', label: 'Jobs & Training'},
      {key: 'english', label: 'English Language'},
      {key: 'health', label: 'Health'},
      {key: 'help', label: 'Help'},
      {key: 'discover', label: 'Discover'}
  ];
  loadCategory: boolean;
  loadedCategory: boolean;
  @ViewChild('map') mapContainer: ElementRef;

  canDeactivate() {
    return !this.loaded;
  }

  constructor(private route: ActivatedRoute, private router: Router, private _dataSvc: DataService) {
  }

  ngOnInit() {

    // Cross-browser horsegarbage
    window.setTimeout(() => {
      let pageY: number = this.mapContainer.nativeElement.offsetHeight;
      this.mapContainer.nativeElement.scrollTop = pageY;
    }, 2000);
    
    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      this.character = this._dataSvc.assignedChar;
  
    });

    this._dataSvc.getAllData().subscribe(response => {

      let locationImgIndex: number = 1;
      this.locations = this._dataSvc.locationData;
      
      // Assign image index
      _.each(this.locations, (l) => {

        if(locationImgIndex < 4) 
          locationImgIndex++;
        else if(locationImgIndex > 1) 
          locationImgIndex--;
        
        l.imageIndex = locationImgIndex;
      });

      this.loadCategory = true;
      this.character = this._dataSvc.assignedChar;
      
      TweenLite.fromTo(document.getElementById('house-bubble'), 1.5, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:2, display:'block', ease:Elastic.easeOut});

      this.loaded = true;

    });

    // DEBUG: If no goal, get data and assign one
    if(this.assignedGoal === undefined) {
      this._dataSvc.getCharacterData().subscribe(response => {
        
        // Default 
        this.assignedGoal = this._dataSvc.assignedGoal;
        this.character = this._dataSvc.assignedChar;

      });
    }
    
  }

  ngAfterViewChecked() {

    if(!this.loadCategory || this.loadedCategory)
      return;
    
    let categoryId = this.route.snapshot.queryParams.cat;
    // Load category now?
    if(categoryId)
      this.filterSelection(categoryId);

    this.loadedCategory = true;

  }

  filterSelection(category: string) {

    let x, i;
    let showAll = (category === "all");
    let label = _.where(this.filters, {key: category})[0]['label'];

    x = document.getElementsByClassName("location");
    document.getElementById('map').classList.remove('hidden');
    document.getElementById('home').classList.add('hidden');

    document.getElementById('category-label').innerHTML = label;
    
    // Add the "show" class to the filtered elements, and remove the "show" class from the elements that are not selected
    for (i = 0; i < x.length; i++) {
      x[i].classList.remove("show");
    
      if(showAll) {
        x[i].classList.add("show");
        continue;
      }

      if (x[i].dataset.categories !== undefined && x[i].dataset.categories.indexOf(category) > -1) 
        x[i].classList.add("show");

    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        cat: category,
      }
    });
    
  }

  backToHome() { 

    document.getElementById('map').classList.add('hidden');
    document.getElementById('home').classList.remove('hidden');

    const params = { ...this.route.snapshot.queryParams };
    delete params.cat;
    this.router.navigate([], { queryParams: params });
    

  }

}
