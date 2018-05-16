import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { PlayerData } from '../../models/playerdata';

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

      if(data.gotTransit || data.gotJob || data.payday) {
        
        if(data.gotJob)
          document.getElementById('job-cheevo').classList.remove('hidden');
        else if(data.gotTransit)
          document.getElementById('transit-cheevo').classList.remove('hidden');
        else if(data.payday) {
          document.getElementById('payday').classList.remove('hidden');
          document.getElementById('money').classList.add('payday');
        }

        let cheevoBanner = document.getElementById('achievement');
        let bannerY = document.getElementById('toolbar').offsetHeight;
        TweenLite.to(cheevoBanner, .5, {autoAlpha:1, bottom: bannerY+'px', ease:Back.easeOut});
        TweenLite.to(cheevoBanner, .5, {bottom:0, delay:4, ease:Back.easeIn, onComplete:() => {
          document.getElementById('job-cheevo').classList.add('hidden');
          document.getElementById('transit-cheevo').classList.add('hidden');
          document.getElementById('money').classList.remove('payday');
        }});
        TweenLite.to(cheevoBanner, .3, {autoAlpha:0, delay:4.2});

      }

  	});

   }
    

   ngOnInit() {  

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

   }

}
