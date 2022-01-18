import { Component, OnInit, HostBinding, Inject, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { DOCUMENT } from "@angular/common";
import { DataService } from '../data.service';
import { slideAnimation } from '../_animations/slide';
import { Back, Elastic, Sine, TweenLite, TweenMax } from "gsap";

import { PlayerData } from '../models/playerdata';
import { Event } from '../models/event';
import { Goal } from '../models/goal';
import { Character } from '../models/character';

import { environment } from '../../environments/environment';
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
  public atHome: boolean = false;
  public wonGame: boolean = false;
  public currentWellnessScore: number = 0;
  public surveyUrl: string;

  eventsQueue: HTMLElement[] = [];
  
  lastWellnessScore: number = 0;
  round: number = 1;
  cheatKeyDown: boolean;
  gameEnded: boolean;

  assignedGoal: Goal;
  
  sfxPath: string = 'https://res.cloudinary.com/engagement-lab-home/video/upload/v1000000/opportunity-game/sfx/';

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
 
  // Cheaters prosper!
  @HostListener('window:keydown', ['$event'])
  keyDownEvent(event: KeyboardEvent) {

    if(environment.production) return;
    
    if(event.keyCode === 16)
      this.cheatKeyDown = true;

  }
  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {

    if(environment.production) return;

    if(this.cheatKeyDown) {

      if(event.key === 'J')
        this._dataSvc.playerData.jobLevel += 1;
      else if(event.key === 'C')
        this._dataSvc.playerData.commLevel += 1;
      else if(event.key === 'E')
        this._dataSvc.playerData.englishLevel += 1;
      else if(event.key === '+')
        this._dataSvc.playerData.wellnessScore += 5;

      this._dataSvc.playerDataUpdate.emit(this._dataSvc.playerData);

    }
  }

  @HostListener('document:click', ['$event.target'])
  onClick(targetElement) {
      ion.sound({
          sounds: [
            {
              name: "confirm"
            },
            {
              name: "music-tutorial",        
              ready_callback: (obj) => {  
                setTimeout(() => 
                  { ion.sound.play('music-tutorial', {loop: true}) },
                  500);
              }
            },
            {
              name: "music-base"
            },
            {
              name: "click"
            },
            {
              name: "transition"
            },
            {
              name: "accept"
            },
            {
              name: "decline"
            },
            {
              name: "level-up"
            }
          ],
          volume: 1,
          path: this.sfxPath,
          preload: true
      });
  }

  getData() {

    // DEBUG: If no goal, get data and assign one
    if(this.assignedGoal === undefined) {
      this._dataSvc.getCharacterData().subscribe(response => {

        // Default
        this.character = this._dataSvc.characterData[0];

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

    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      this.character = this._dataSvc.assignedChar;
      this.surveyUrl = this._dataSvc.surveyUrl + '?priority=' + this._dataSvc.playerPriority;

      if(data.gameEnded) {
        
        this.gameEnded = true;
        this.currentWellnessScore = Math.round((data.wellnessScore / data.wellnessGoal) * data.wellnessGoal);
        if(this.currentWellnessScore > 100) this.currentWellnessScore = 100;

        this.wonGame = data.wellnessScore >= data.wellnessGoal;
        (<HTMLElement>document.querySelector('#game-over #inner')).style.width = (this.currentWellnessScore >= 96) ? '96' : this.currentWellnessScore + "%";

        this.lifeEvents = _.filter(this._dataSvc.getUpdatedEvents(), (e) => {return e.type === 'life'});
        
        let content = <HTMLElement>document.querySelector('#game-over #content');
        let radius = {val: 0};
        content.style.visibility = 'hidden';

        TweenLite.to(document.getElementById('wellbeing'), 1, {autoAlpha:0, display:'none'});
        TweenLite.fromTo(document.getElementById('game-over'), 2, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, display:'block', ease:Sine.easeOut, onComplete: () => {

          let charImg = <HTMLElement>document.querySelector('#game-over .character img');
          TweenLite.to(content, .2, {autoAlpha:1, delay:.2});

          TweenLite.fromTo(document.querySelector('#game-over #header'), .7, {autoAlpha:0, top:'-140px'}, {autoAlpha:1, top:0, delay:.2, display:'block', ease:Back.easeOut});

          TweenMax.to(radius, 1, {val:45, delay:1, ease:Back.easeOut, 
            onUpdate:() => {
             charImg.style.clipPath = 'circle('+radius.val+'% at 50% 50%)';
            }
          });
          TweenLite.fromTo(document.getElementById('wellbeing-score'), 1, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, delay:2, display:'flex', ease:Back.easeOut});
          TweenLite.fromTo(document.getElementById('share'), 1, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:3, display:'block', ease:Elastic.easeOut});
          TweenLite.fromTo(document.getElementById('play-again'), 1, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, delay:3.2, display:'inline-flex', ease:Sine.easeOut});

        }});

      }

    });

    this._dataSvc.effectTrigger.subscribe((events: any[]) => {

      if(!events || events.length < 1 || this.gameEnded) return;

      _.each(events, (event, i) => {

        let eventToShow = document.getElementById(event.id);
        
        // Only ever show one event at once or if a life event shows
        let multipleEvents = (eventToShow === undefined || eventToShow === null || i > 0);
        let lifeEvent = document.querySelectorAll('#life-events .game-event.show').length > 0;

        if(multipleEvents || lifeEvent) {
          if(eventToShow !== undefined)
            eventToShow.classList.add('queue');
        }
        else {
          TweenLite.to(document.getElementById('events-modal'), 1, {autoAlpha: 1, display:'block'});
          TweenLite.to(eventToShow, 1, {autoAlpha:1, display:'block'});
          eventToShow.classList.add('show');
        }

      });

    });

    this._dataSvc.lifeEventTrigger.subscribe(() => {

      if(this.gameEnded) return;

      // Show only if any left
      let allEvents = document.querySelectorAll('#life-events .game-event');
      if(allEvents.length > 0) {
          
        let eventIndex = Math.floor(Math.random() * ((allEvents.length-1) - 0 + 1));
        let eventEl = allEvents[eventIndex];
        
        if(eventEl === undefined) return;

        // Queue if events showing
        let otherEvents = document.querySelectorAll('.game-event.show');
        if(otherEvents && otherEvents.length > 0) {
          eventEl.classList.add('queue');
          return;
        }

        TweenLite.to(document.getElementById('events-modal'), 1, {autoAlpha: 1, display:'block'});
        TweenLite.to(eventEl, 1, {autoAlpha:1, display:'block'});
        eventEl.classList.add('show');
        
      }
    });

    router.events.subscribe((val) =>  {

      if(this.gameEnded) return;

      if(val instanceof NavigationEnd) {
        
        if(val.url.indexOf("/game/home") > -1) {
          TweenLite.to(document.getElementById('toolbar-parent'), 1, {autoAlpha: 1, display:'block'});
          TweenLite.to(document.getElementById('wellbeing'), 1, {autoAlpha: 1, display:'block'});

          this.atHome = true;
        }
        
      }
      
    });

  }

  ngOnInit() {

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

  startOver() {

    window.location.href = '/';

  }

}
