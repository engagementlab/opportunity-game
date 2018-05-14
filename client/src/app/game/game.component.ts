import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { DOCUMENT } from "@angular/platform-browser";
import { DataService } from '../data.service';
import { slideAnimation } from '../_animations/slide';
import { TweenLite } from "gsap";

import { PlayerData } from '../models/playerdata';
import { Event } from '../models/event';

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
  
  currentWellnessScore: number;
  lastWellnessScore: number = 0;
  round: number = 1;
  newRound: number;

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
  
  getData() {

    this._dataSvc.getAllData().subscribe(response => {
      
      this.lifeEvents = _.filter(this._dataSvc.eventData, (e) => {return e.type === 'random'});
      this.effectEvents = _.filter(this._dataSvc.eventData, (e) => {return e.type === 'effect'});

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
        TweenLite.fromTo(document.getElementById('round-over'), 1, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:0, display:'block', ease: Back.easeOut});
      }

      this.newRound = data.round;


    });

    this._dataSvc.effectTrigger.subscribe((eventId: string) => {

        let effectEventSel = document.getElementById('effect-events');
        let eventToShow =  document.getElementById(eventId);
        
        TweenLite.to(effectEventSel, 1, {autoAlpha: 1, display:'block'});
        TweenLite.to(eventToShow, 1, {autoAlpha:1, display:'block'});

    });

  }

  ngOnInit() {
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

      // Update round
      this.round = this.newRound;

  }

  closeCheevo() {

      TweenLite.to(document.getElementById('achievement'), 1, {autoAlpha: 0, display:'none'});

  }

}
