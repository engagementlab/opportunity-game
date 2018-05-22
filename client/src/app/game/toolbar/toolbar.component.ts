import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { PlayerData } from '../../models/playerdata';
import { GameLocation } from '../../models/gamelocation';
import { Opportunity } from '../../models/opportunity';

import * as _ from 'underscore';

@Component({
  selector: 'game-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class GameToolbarComponent implements OnInit {

  round: number = 1;
  actions: number;
	money: number;
  commLevel: number;
  jobLevel: number;
  englishLevel: number;

  cheevoBanner: HTMLElement;
  rewardOpportunities: Opportunity[] = [];
  rewardLocations: GameLocation[] = [];

  public hasTransit: boolean;
  public hasJob: boolean;
  
  constructor(private _dataSvc: DataService) {

    this.money = this._dataSvc.playerData.money;
  	this.actions = this._dataSvc.playerData.actions;

    this.commLevel = this._dataSvc.playerData.commLevel;
    this.jobLevel = this._dataSvc.playerData.jobLevel;
    this.englishLevel = this._dataSvc.playerData.englishLevel;

    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      if(this.commLevel < data.commLevel)
        this.showLvlUp('community', data.commLevel - this.commLevel);
      if(this.jobLevel < data.jobLevel)
        this.showLvlUp('job', data.jobLevel - this.jobLevel);
      if(this.englishLevel < data.englishLevel)
        this.showLvlUp('english', data.englishLevel - this.englishLevel);

      this.money = data.money;
      this.actions = data.actions;

      this.commLevel = data.commLevel;
      this.jobLevel = data.jobLevel;
      this.englishLevel = data.englishLevel;
      this.round = data.round;

      if(data.gotTransit)
        this.hasTransit = true;
      else if(data.gotJob)
        this.hasJob = true;

     if(data.gotTransit || data.gotJob) {
        
        if(data.gotJob && document.getElementById('job-cheevo') !== undefined)
          document.getElementById('job-cheevo').classList.add('show');
        else if(data.gotTransit && document.getElementById('transit-cheevo') !== undefined)
          document.getElementById('transit-cheevo').classList.add('show');

        this.showNotification();

      }

  	});

    this._dataSvc.paydayTrigger.subscribe(() => {

      document.getElementById('payday').classList.add('show');
      document.getElementById('money').classList.add('payday');
      
      this.showNotification();

      setTimeout(() => {
        document.getElementById('money').classList.remove('payday');
      }, 2000);

    });

    this._dataSvc.rewardTrigger.subscribe((data: {type: string, opp: Opportunity, location: GameLocation}) => {

      let elemId: string;

      if(data.type === 'opportunity') {
        this.rewardOpportunities.push(data.opp);

        setTimeout(() => {

          _.each(this.rewardOpportunities, (opp) => {
            if(document.getElementById('reward_'+opp._id) !== null)
              document.getElementById('reward_'+opp._id).classList.add('show');
          })
          this.showNotification();

        }, 100);
      }
      else if(data.type === 'location') {
        Array.prototype.push.apply(this.rewardLocations, data.location);
        // this.rewardLocations.push(data.location);
        elemId = data.location._id;

        setTimeout(() => {

          _.each(this.rewardLocations, (location) => {
            if(document.getElementById('loc_'+location._id) !== null)
              document.getElementById('loc_'+location._id).classList.add('show');
          })
          this.showNotification();

        }, 100);
      }



    });

   }
    

   ngOnInit() {  
    
    this.cheevoBanner = <HTMLElement>document.getElementById('achievement');

   }

   showNotification() {

    let bannerY = -document.getElementById('toolbar').offsetHeight;
    let notifications = Array.from(document.querySelectorAll('#notifications .row.show:not(.done)'));

    TweenMax.staggerFromTo(notifications, .4, {autoAlpha:0, bottom:bannerY}, {autoAlpha:1, bottom:0, display:'inline-flex', ease:Back.easeOut}, .4, () => {

      _.each(notifications, (n, i) => {
        (<HTMLElement>n).style.zIndex = i+'';
        
        setTimeout(() => {n.classList.add('remove');  }, 2000*(i+1));

        if(n.classList.contains('reward'))
          setTimeout(() => {
            // console.log(this.rewardLocations.indexOf(n))
            (<HTMLElement>n).style.display = 'none';
            (<HTMLElement>n).classList.remove('show');
            (<HTMLElement>n).classList.add('done');
            // this.rewardLocations.splice(this.rewardLocations.length, 1);
          }, 2400*(i+1));
        else
          setTimeout(() => { (<HTMLElement>n).style.display = 'none'; }, 2400*(i+1));

      });

    });

   }

   showLvlUp(stat: string, amount: number) {

      let elem = <HTMLElement>document.querySelector('#'+stat+'-lvl');
      let elemAmt = <HTMLElement>document.querySelector('#'+stat+'-lvl .amt');
      let bottomAmt = document.getElementById('open-btn').classList.contains('open') ? '18%' : '6%';

      elemAmt.innerText = '+'+amount;
      ion.sound.play('confirm');
      
      TweenLite.to(elem, .2, {scale:1.4, ease:Elastic.easeOut});
      TweenLite.to(elem, .2, {scale:1, delay: .3});
      
      TweenLite.fromTo(elemAmt, .5, {autoAlpha:0}, {autoAlpha:1});
      TweenLite.fromTo(elemAmt, 1, {scale:.4}, {scale:1.4, ease:Back.easeOut});
      TweenLite.to(elemAmt, .3, {autoAlpha:0, delay:1});

   }

   openDrawer() {
    
    document.getElementById('mobile-drawer').classList.toggle('open');
    document.getElementById('drawer').classList.toggle('open');
    document.getElementById('open-btn').classList.toggle('open');
    
   }

}
