import { Component, OnInit, HostBinding, Inject, HostListener } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { DOCUMENT } from "@angular/platform-browser";
import { DataService } from '../data.service';
import { slideAnimation } from '../_animations/slide';
import { TweenLite } from "gsap";

import { PlayerData } from '../models/playerdata';
import { Event } from '../models/event';
import { Goal } from '../models/goal';

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
  public playerIndex: number;
  
  currentWellnessScore: number;
  lastWellnessScore: number = 0;
  round: number = 1;
  newRound: number;

  commLevel: number;
  jobLevel: number;
  englishLevel: number;
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
        this.assignedGoal = this._dataSvc.goalData[0];
      });
    }

    this._dataSvc.getAllData().subscribe(response => {
      
      this.lifeEvents = _.filter(this._dataSvc.eventData, (e) => {return e.type === 'random'});
      this.effectEvents = _.filter(this._dataSvc.eventData, (e) => {return e.type === 'effect'});

      this.playerIndex = this._dataSvc.assignedCharIndex;

    });

  }

  constructor(private router: Router, private _dataSvc: DataService) { 

    this.getData();

  	router.events.subscribe((val) =>  {

      if(val instanceof NavigationEnd) {
        
        if(val.url === "/game/home")
          TweenLite.to(document.getElementById('toolbar-parent'), 1, {autoAlpha: 1, display:'block'});
        
      }
      
    });

    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      if(data.newRound) {
        this.currentWellnessScore = data.wellnessScore;
        let content = <HTMLElement>document.querySelector('#round-over #content');
        content.style.visibility = 'hidden';
        TweenLite.fromTo(document.getElementById('round-over'), 1, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, display:'block', ease: Sine.easeOut});
        TweenLite.to(content, 1, {autoAlpha:1, delay:1});
      }

      this.newRound = data.round;

      this.playerIndex = this._dataSvc.assignedCharIndex;

      this.commLevel = data.commLevel;
      this.jobLevel = data.jobLevel;
      this.englishLevel = data.englishLevel;
      
      this.assignedGoal = this._dataSvc.assignedGoal;

    });

    this._dataSvc.effectTrigger.subscribe((eventId: string) => {

        let effectEventSel = document.getElementById('effect-events');
        let eventToShow =  document.getElementById(eventId);
        
        TweenLite.to(effectEventSel, 1, {autoAlpha: 1, display:'block'});
        TweenLite.to(eventToShow, 1, {autoAlpha:1, display:'block'});

    });

  }

  ngOnInit() {

    // let stars = document.querySelectorAll('.stars path');
    // console.log(stars)
    // TweenMax.staggerFrom(stars, 10, {autoAlpha: 0, scale: 0});

  }

  nextRound() {

      this.router.navigateByUrl('/game/home');
      TweenLite.to(document.getElementById('round-over'), 1, {autoAlpha: 0, display:'none'});

      // Dice roll for random event
      if(Math.round(Math.random()) == 1) {
        
        let lifeEventSel = document.querySelector('#life-events');
        let allEvents = lifeEventSel.children;
        let eventIndex = Math.floor(Math.random() * ((allEvents.length-1) - 0 + 1));
        
        TweenLite.to(lifeEventSel, 1, {autoAlpha: 1, display:'block'});
        TweenLite.to(allEvents[eventIndex], 1, {autoAlpha:1, display:'block'});

      }

      // Update last score 
      this.lastWellnessScore = this.currentWellnessScore;

      // Save goal amt
      this._dataSvc.commGoalLast = this.commLevel;
      this._dataSvc.jobGoalLast = this.jobLevel;
      this._dataSvc.englishGoalLast = this.englishLevel;

      // Update round
      this.round = this.newRound;

  }

  closeCheevo() {

      TweenLite.to(document.getElementById('achievement'), 1, {autoAlpha: 0, display:'none'});

  }

}
