import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { PlayerData } from '../../models/playerdata';
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

  public hasTransit: boolean;
  public hasJob: boolean;
  public playerIndex: number = 2;

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

      this.playerIndex = this._dataSvc.assignedCharIndex;

      if(data.gotTransit || data.gotJob || data.round) {
        
        if(data.gotJob)
          document.getElementById('job-cheevo').classList.add('show');
        else if(data.gotTransit)
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

    this._dataSvc.rewardTrigger.subscribe((opp: Opportunity) => {

      this.rewardOpportunities.push(opp);

      setTimeout(() => {

        document.getElementById('reward_'+opp._id).classList.add('show');
        this.showNotification();

      }, 1000);


    });

   }
    

   ngOnInit() {  
    
    this.cheevoBanner = <HTMLElement>document.getElementById('achievement');

   }

   showNotification() {

    let bannerY = -document.getElementById('toolbar').offsetHeight;
    let notifications = Array.from(document.querySelectorAll('#notifications .row.show'));

    TweenMax.staggerFromTo(notifications, .4, {autoAlpha:0, bottom:bannerY}, {autoAlpha:1, bottom:0, display:'inline-flex', ease:Back.easeOut}, .4, () => {

      _.each(notifications, (n, i) => {
        n.style.zIndex = i;
        
        setTimeout(() => {n.classList.add('remove');  }, 2000*(i+1));
        setTimeout(() => {n.remove();  }, 2700*(i+1));

      });

    });

   }

   showLvlUp(stat: string, amount: number) {

      let elem = <HTMLElement>document.querySelector('#'+stat+'-lvl .notification');
      let elemAmt = <HTMLElement>document.querySelector('#'+stat+'-lvl .amt');
      let bottomAmt = document.getElementById('open-btn').classList.contains('open') ? '18%' : '6%';

      elemAmt.innerText = '+'+amount;
      ion.sound.play('confirm');

      elem.style.visibility = 'visible';
      TweenLite.to(elem, .5, {bottom:bottomAmt, ease:Back.easeOut});
      TweenLite.to(elem, .5, {autoAlpha:0, delay: 1.5, onComplete:() =>{
        TweenLite.set(elem, {clearProps:'all'});
        elem.style.visibility = 'hidden';
      }});

   }

   openDrawer() {
    
    document.getElementById('mobile-drawer').classList.toggle('open');
    document.getElementById('drawer').classList.toggle('open');
    document.getElementById('open-btn').classList.toggle('open');
    // document.getElementById('transit-cheevo').classList.remove('hidden');


    // let elem2 = document.getElementById('transit-cheevo');
    // elem2.style.zIndex = 6;
    // // let job = document.getElementById('job-cheevo');
    
    // let bannerY = -document.getElementById('toolbar').offsetHeight;
    // // TweenLite.fromTo(elem2, .5, {autoAlpha:0, bottom:bannerY}, {autoAlpha:1, bottom:0, display:'inline-flex', ease:Back.easeOut});
    // // // TweenLite.fromTo(job, .5, {autoAlpha:0, bottom:bannerY}, {autoAlpha:1, bottom:0, delay: 1.5, display:'inline-flex', ease:Back.easeOut});
    
    // // setTimeout(() => {elem2.classList.add('remove');  }, 4000);
    // // setTimeout(() => {elem2.remove();  }, 4700);

    // let notifications = Array.from(document.querySelectorAll('#notifications .row'));

    // // TweenLite.fromTo(n, .5, {autoAlpha:0, bottom:bannerY}, {autoAlpha:1, bottom:0, display:'inline-flex', ease:Back.easeOut});
    // TweenMax.staggerFromTo(notifications, .5, {autoAlpha:0, bottom:bannerY}, {autoAlpha:1, bottom:0, display:'inline-flex', ease:Back.easeOut}, .4, () => {

    //   _.each(notifications, (n, i) => {
    //     n.style.zIndex = i;
        
    //     setTimeout(() => {n.classList.add('remove');  }, 2000*(i+1));
    //     setTimeout(() => {n.remove();  }, 2700*(i+1));

    //   });

    // });

      // this.showNotification();
   }

}
