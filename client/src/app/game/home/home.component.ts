import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
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
    // window.setTimeout(() => {
    //   let pageY: number = this.mapContainer.nativeElement.offsetHeight;
    //   this.mapContainer.nativeElement.scrollTop = pageY;

    // }, 2000);
    
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

      // City animation
      if(!this._dataSvc.playerData.sawTutorial) {
        TweenLite.fromTo(document.getElementById('city-tutorial'), 1, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, delay:1, display:'block', 
         onComplete:() => {
            let scroll = {val: 0};
            TweenMax.to(scroll, 5, {val:this.mapContainer.nativeElement.scrollHeight, delay:2, ease:Sine.easeOut, onUpdate:() => {
               this.mapContainer.nativeElement.scrollTop = scroll.val;
            }});
        }});

        TweenLite.fromTo(document.getElementById('house'), 1, {autoAlpha:0, left:'-100%'}, {autoAlpha:1, left:0, delay:4, display:'block', ease:Back.easeOut});
        TweenLite.fromTo(document.getElementById('house-bubble'), 1.5, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:4.5, display:'block', ease:Elastic.easeOut});
      }
      else {
        let scroll = {val: 0};
        let scrollTarget = this.mapContainer.nativeElement.scrollHeight;
        let houseDelay = 5;

        if(!this._dataSvc.playerData.sawCityIntro) {
          TweenLite.fromTo(document.getElementById('city'), 1, {autoAlpha:0}, {autoAlpha:1, delay:1, display:'block', 
           onComplete:() => {
              TweenMax.to(scroll, 5, {val:scrollTarget, ease:Sine.easeOut, onUpdate:() => {
                 this.mapContainer.nativeElement.scrollTop = scroll.val;
                 this._dataSvc.playerData.sawCityIntro = true;
              }});
          }});
        }
        else {
          houseDelay = 3;
          document.getElementById('city').style.display = 'block';
          TweenMax.to(scroll, 2, {val:scrollTarget, ease:Sine.easeOut, onUpdate:() => {
             this.mapContainer.nativeElement.scrollTop = scroll.val;
          }});
        }

        TweenLite.fromTo(document.getElementById('house'), 1, {autoAlpha:0, left:'-100%'}, {autoAlpha:1, left:0, delay:houseDelay, ease:Back.easeOut});
        TweenLite.fromTo(document.getElementById('house-bubble'), 1.5, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:houseDelay+1, display:'block', ease:Elastic.easeOut});
      }

      this.loaded = true;

    });

    // DEBUG: If no character, get data and assign one
    if(this.character === undefined) {
      this._dataSvc.getCharacterData().subscribe(response => {
        
        // Default 
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
