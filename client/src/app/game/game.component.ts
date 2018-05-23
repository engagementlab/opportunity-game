import { Component, OnInit, HostBinding, Inject, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { DOCUMENT } from "@angular/platform-browser";
import { DataService } from '../data.service';
import { slideAnimation } from '../_animations/slide';
import { TweenLite } from "gsap";

import { PlayerData } from '../models/playerdata';
import { Event } from '../models/event';
import { Goal } from '../models/goal';
import { Character } from '../models/character';

import * as _ from 'underscore';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [slideAnimation]
})
export class GameComponent implements OnInit {

  public lifeEvents: Event[];
  public effectEvents: Event[];
  public character: Character;

  eventsQueue: HTMLElement[] = [];
  
  currentWellnessScore: number;
  lastWellnessScore: number = 0;
  round: number = 1;
  newRound: number;

  commLevel: number;
  jobLevel: number;
  englishLevel: number;
  wonGame: boolean;
  assignedGoal: Goal;
  
  sfxPath: string = 'https://res.cloudinary.com/engagement-lab-home/video/upload/v1000000/opportunity-game/sfx/';

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
      ion.sound({
          sounds: [
              {
                  name: "confirm"
              }
          ],
          volume: 1,
          path: this.sfxPath,
          preload: true
      });
  }

  getData() {

    this.commLevel = this._dataSvc.playerData.commLevel;
    this.jobLevel = this._dataSvc.playerData.jobLevel;
    this.englishLevel = this._dataSvc.playerData.englishLevel;

    // DEBUG: If no goal, get data and assign one
    if(this.assignedGoal === undefined) {
      this._dataSvc.getCharacterData().subscribe(response => {

        // Default
        this.character = this._dataSvc.characterData[0];
        this.assignedGoal = this._dataSvc.goalData[0];

      });
    }

    this._dataSvc.getAllData().subscribe(response => {
      
      this.lifeEvents = _.filter(this._dataSvc.eventData, (e) => {return e.type === 'life'});
      this.effectEvents = _.filter(this._dataSvc.eventData, (e) => {return e.type === 'effect'});

      this.character = this._dataSvc.assignedChar;

    });

  }

  constructor(private router: Router, public _dataSvc: DataService) { 

    this.getData();

    router.events.subscribe((val) =>  {

      if(val instanceof NavigationEnd) {
        
        if(val.url === "/game/home")
          TweenLite.to(document.getElementById('toolbar-parent'), 1, {autoAlpha: 1, display:'block'});
        
      }
      
    });

    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      this.newRound = data.round;

      this.character = this._dataSvc.assignedChar;

      this.commLevel = data.commLevel;
      this.jobLevel = data.jobLevel;
      this.englishLevel = data.englishLevel;
      
      this.assignedGoal = this._dataSvc.assignedGoal;

      if(data.newRound) {
        
        this.currentWellnessScore = data.wellnessScore;
        this.lifeEvents = _.filter(this._dataSvc.getUpdatedEvents(), (e) => {return e.type === 'life'});
        this.wonGame = data.metGoals;
        
        let content = <HTMLElement>document.querySelector('#round-over #content');
        content.style.visibility = 'hidden';
        TweenLite.fromTo(document.getElementById('round-over'), 3, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, display:'block', ease: Sine.easeOut});
        TweenLite.to(content, 1, {autoAlpha:1, delay:3.1});

      }

    });

    this._dataSvc.effectTrigger.subscribe((events: any[]) => {

      if(!events || events.length < 1) return;

      let effectEventSel = document.getElementById('effect-events');
      _.each(events, (event, i) => {

        let eventToShow;
        eventToShow = document.getElementById(event.id);
        // Only ever show one event at once
        if(eventToShow === undefined || eventToShow === null || i > 0) {
          if(eventToShow !== undefined)
            eventToShow.classList.add('queue');
        }
        else {
          TweenLite.to(effectEventSel, 1, {autoAlpha: 1, display:'block'});
          TweenLite.to(eventToShow, 1, {autoAlpha:1, display:'block'});
        }

      });

    });

  }

  ngOnInit() {

    // let stars = document.querySelectorAll('.stars path');
    // console.log(stars)
    // TweenMax.staggerFrom(stars, .5, {autoAlpha:0, scale:0, rotation:'-=359', delay:4, ease:Elastic.easeOut}, .2);

  }

  nextRound() {

    this.router.navigateByUrl('/game/home');
    TweenLite.to(document.getElementById('round-over'), 1, {autoAlpha: 0, display:'none', onComplete:() => {

      // Save goal amt
      this._dataSvc.commGoalLast = this.commLevel;
      this._dataSvc.jobGoalLast = this.jobLevel;
      this._dataSvc.englishGoalLast = this.englishLevel;
      this._dataSvc.showPayday();

      // Update round
      this.round = this.newRound;

      // Dice roll for random event if any left
      let allEvents = document.querySelectorAll('#life-events .game-event');
      if(allEvents.length > 1 && Math.round(Math.random()) == 1) {
        
        let eventIndex = Math.floor(Math.random() * ((allEvents.length-1) - 0 + 1));
        let eventEl = allEvents[eventIndex];
        
        if(eventEl === undefined) return;

        TweenLite.to(document.getElementById('life-events'), 1, {autoAlpha: 1, display:'block'});
        TweenLite.to(eventEl, 1, {autoAlpha:1, display:'block'});

      }

    }});
    
  }

  closeCheevo() {

      TweenLite.to(document.getElementById('achievement'), 1, {autoAlpha: 0, display:'none'});

  }

  removeEvent(eventId: string) {

    let thisEl = document.getElementById('event_'+eventId);
    TweenLite.to(thisEl, 1, {autoAlpha: 0, display:'none', oncomplete: () => {
      
      thisEl.parentNode.removeChild(thisEl);

      TweenLite.to(document.getElementById('life-events'), 1, {autoAlpha: 0, display:'none'});
      this._dataSvc.removeEvent(eventId);

    }});
    
  }

  selectNo(eventId: string) {

    this.removeEvent(eventId);
    this._dataSvc.removeEvent(eventId);

  }
 
  selectYes(eventId: string) {
    
    this._dataSvc.updateStats(this._dataSvc.getEventById(eventId));
    this.removeEvent(eventId);

  }

}
