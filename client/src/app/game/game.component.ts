import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { DOCUMENT } from "@angular/platform-browser";
import { DataService } from '../data.service';
import { slideAnimation } from '../_animations/slide';
import { TweenLite } from "gsap";

import { PlayerData } from '../models/playerdata';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [slideAnimation]
})
export class GameComponent implements OnInit {

  currentWellnessScore: number;
  round: number = 1;

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
  
  getData() {

    this._dataSvc.getAllData('data').subscribe(response => {

    });

  }

  constructor(private router: Router, private _dataSvc: DataService) { 

    this.getData();

  	router.events.subscribe((val) =>  {

      if(val instanceof NavigationEnd) {

        if(val.url === "/game/character")
          TweenLite.to(document.getElementById('logo'), 1, {scale:0.5});

        if(val.url === "/game/start")
          TweenLite.to(document.getElementById('logo'), 1, {scale:1});

        if(val.url === "/game/home")
          TweenLite.to(document.getElementById('toolbar-parent'), 1, {autoAlpha: 1, display:'block'});
        
      }
      
    });

    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      if(data.newRound) {
        this.currentWellnessScore = data.wellnessScore;
        TweenLite.to(document.getElementById('round-over-parent'), 1, {autoAlpha: 1, display:'block'});
      }

      if(data.gotTransit) {
        TweenLite.to(document.getElementById('achievement'), 1, {autoAlpha: 1, display:'block'});
        TweenLite.to(document.getElementById('transit'), 1, {autoAlpha: 1, display:'block'});
      }
      else if(data.gotTransit) {
        TweenLite.to(document.getElementById('achievement'), 1, {autoAlpha: 1, display:'block'});
        TweenLite.to(document.getElementById('job'), 1, {autoAlpha: 1, display:'block'});
      }


    });

  }

  ngOnInit() {
  }

  nextRound() {

      this.router.navigateByUrl('/game/home');
      TweenLite.to(document.getElementById('round-over-parent'), 1, {autoAlpha: 0, display:'none'});
  }

  closeCheevo() {

      TweenLite.to(document.getElementById('achievement'), 1, {autoAlpha: 0, display:'none'});

  }

}
