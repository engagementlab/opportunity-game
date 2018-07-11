import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'

import { DataService } from '../../data.service';
import { Goal } from '../../models/goal';
import { Character } from '../../models/character';
import { PlayerData } from '../../models/playerdata';

import * as _ from 'underscore';
import { ScrollEvent } from 'ngx-scroll-event';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class GameHomeComponent implements OnInit, AfterViewChecked {

  public character: Character;

  loaded: boolean;
  locations: any[];
  discoverLocations: any[];
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

  public mapScrolled(event: ScrollEvent) {
    console.log('scroll', event.originalEvent);
  }

  canDeactivate() {
    return !this.loaded;
  }

  constructor(private route: ActivatedRoute, private router: Router, private _dataSvc: DataService) {
  }

  ngOnInit() {
    
    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      this.character = this._dataSvc.assignedChar;
  
    });

    this._dataSvc.getAllData().subscribe(response => {

      let locationImgIndex: number = 1;
      this.locations = _.filter(this._dataSvc.locationData, (loc) => { return loc.categoriesStr !== 'discover'; });
      this.discoverLocations = _.where(this._dataSvc.locationData, { categoriesStr: 'discover' });

      // Assign image index
      _.each(this.locations, (l) => {

        if(locationImgIndex < 4) 
          locationImgIndex++;
        else if(locationImgIndex > 1) 
          locationImgIndex--;
        
        l.imageIndex = locationImgIndex;
      });
      _.each(this.discoverLocations, (l, i) => { l.imageIndex = i+1; });

      this.loadCategory = true;
      this.character = this._dataSvc.assignedChar;

      this.loaded = true;


      let categoryId = this.route.snapshot.queryParams.cat;
      if(!categoryId)
        this.screenAnimation();
      
      setTimeout(() => {

      }, 2000);
      
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
      this.filterSelection(categoryId, true);

    this.loadedCategory = true;

  }

  screenAnimation() {
    
    let houseDelay = 2;
    let isTutorial = false;

    // City animation
    if(!this._dataSvc.playerData.sawTutorial) {
      isTutorial = true;

      TweenLite.fromTo(document.getElementById('tutorial-header'), .7, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, delay:1, ease:Expo.easeOut});  
      TweenLite.fromTo(document.getElementById('city-tutorial'), 1, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, delay:1.3, display:'block', 
       onComplete:() => {
          let scroll = {val: 0};
          TweenMax.to(scroll, 5, {val:this.mapContainer.nativeElement.getBoundingClientRect().top, delay:2, ease:Sine.easeOut, onUpdate:() => {
             this.mapContainer.nativeElement.scrollTop = scroll.val;
          }});
      }});
    }
    else {
      let scroll = {val: 0};
      let scrollTarget;
      (<HTMLElement>document.querySelector('.bubble.categories')).style.display = 'block';
      
      if(!this._dataSvc.playerData.sawCityIntro) {
        houseDelay = 5;
        TweenLite.fromTo(document.getElementById('city'), 1, {autoAlpha:0}, {autoAlpha:1, delay:1, display:'block', 
         onComplete:() => {
            scrollTarget = document.getElementById('house').offsetTop;
            TweenMax.to(scroll, 4, {val:scrollTarget, ease:Sine.easeOut, onUpdate:() => {
               this.mapContainer.nativeElement.scrollTop = scroll.val;
               this._dataSvc.playerData.sawCityIntro = true;
            }});

        }});
      }
      else {
        houseDelay = 5;
        document.getElementById('city').style.display = 'block';
        scrollTarget = document.getElementById('house').offsetTop;
        TweenMax.to(scroll, 2, {val:scrollTarget, ease:Sine.easeOut, onUpdate:() => {
           this.mapContainer.nativeElement.scrollTop = scroll.val;
        }});
      }
    }

    TweenLite.fromTo(document.getElementById('house'), 1, {autoAlpha:0, left:'-100%'}, {autoAlpha:1, left:0, delay:houseDelay, display:'block', ease:Back.easeOut});
    TweenLite.fromTo(document.querySelector('#house .bubble' + (isTutorial ? '.tutorial' : '.categories')), 1.5, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:houseDelay+1, display:'block', ease:Elastic.easeOut});

  }

  filterSelection(category: string, onLoad: boolean=false) {

    ion.sound.play('click');

    let x, i;
    let showAll = (category === "all");
    let label = _.where(this.filters, {key: category})[0]['label'];
    let locationsShown = [];

    x = document.getElementsByClassName("location");
    document.getElementById('category-label').innerHTML = label;
    
    // Add the "show" class to the filtered elements, and remove the "show" class from the elements that are not selected
    for (i = 0; i < x.length; i++) {
      x[i].style.display = 'none';
    
      if(showAll) {
        x[i].classList.add("show");
        continue;
      }

      if (x[i].dataset.categories !== undefined && x[i].dataset.categories.indexOf(category) > -1)
        locationsShown.push(x[i]);
    }

    if(!onLoad) {
      TweenLite.to(document.getElementById('tutorial-header'), .7, {autoAlpha:0, top:'-100%', ease:Expo.easeIn});
      TweenLite.fromTo(document.getElementById('home'), .7, {autoAlpha:1, left:0}, {autoAlpha:0, left:'-100%', display:'none', delay:.7, ease:Back.easeIn});
    }
    else
      document.getElementById('home').style.display = 'none';

    TweenLite.fromTo(document.getElementById('map'), .7, {autoAlpha:1, left:'100%'}, {autoAlpha:1, left:0, delay:(!onLoad ? 1.7 : 1), display:'block', ease:Back.easeOut});
    TweenMax.staggerFromTo(locationsShown, .3, {scale:0}, {scale:1, delay:2, display:'block', ease:Back.easeOut, onComplete: () => {

        
        let list = document.getElementById('list');
        let toolbar = document.getElementById('toolbar');
        list.style.height = (toolbar.offsetTop - list.offsetTop) + 'px';
    }}, .2);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        ...this.route.snapshot.queryParams,
        cat: category,
      }
    });
    
  }

  backToHome() { 

    ion.sound.play('click');

    if(this.loadedCategory) {
      
      document.getElementById('city-tutorial').style.top = '-100%';
      document.getElementById('house').style.opacity = '0'; 

      TweenLite.fromTo(document.getElementById('map'), .7, {autoAlpha:1, left:0}, {autoAlpha:0, left:'100%', display:'none', ease:Back.easeIn});
      TweenLite.fromTo(document.getElementById('home'), .7, {autoAlpha:0, left:'-100%'}, {autoAlpha:1, left:0, delay:.7, display:'block', ease:Back.easeOut, onComplete: () => {
        this.screenAnimation();
      }});

    }
    else {
      

      TweenLite.fromTo(document.getElementById('tutorial-header'), .7, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, ease:Expo.easeOut});
      TweenLite.fromTo(document.getElementById('map'), .7, {autoAlpha:1, left:0}, {autoAlpha:0, left:'100%', display:'none', ease:Back.easeIn});
      TweenLite.fromTo(document.getElementById('home'), .7, {autoAlpha:0, left:'-100%'}, {autoAlpha:1, left:0, delay:.7, display:'block', ease:Back.easeOut});

    }

    const params = { ...this.route.snapshot.queryParams };
    delete params.cat;
    this.router.navigate([], { queryParams: params });

  }

}
