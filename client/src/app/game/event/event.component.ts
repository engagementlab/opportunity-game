import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../data.service';
import { Event } from '../../models/event';
import { TweenLite } from "gsap";

@Component({
  selector: 'game-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class GameEventComponent implements OnInit {
	
  @Input() data: Event;
  @Input() type: string;
	@Input() buttons: boolean;
  
  constructor(private _dataSvc: DataService) { }

  ngOnInit() {
  }

  getCostsAndRewards() {

    let costs = [];

    if(this.data.actionCost > 0)
      costs.push({type: 'cost', icon: 'action', amt: -this.data.actionCost});
    if(this.data.moneyCost > 0)
      costs.push({type: 'cost', icon: 'money', amt: -this.data.moneyCost});

    if(this.data.commReward > 0)
      costs.push({type: 'reward', icon: 'comm', amt: this.data.commReward});
    if(this.data.jobReward > 0)
      costs.push({type: 'reward', icon: 'job', amt: this.data.jobReward});
    if(this.data.englishReward > 0)
      costs.push({type: 'reward', icon: 'english', amt: this.data.englishReward});

    return costs;

  }

  removeEvent(eventId: string) {

    let thisEl = document.getElementById(eventId).parentElement;
    TweenLite.to(thisEl, 1, {autoAlpha: 0, display:'none', oncomplete: () => {
      
      thisEl.parentNode.removeChild(thisEl);

      TweenLite.to(document.getElementById('effect-events'), 1, {autoAlpha: 0, display:'none'});
      this._dataSvc.removeEvent(eventId);

    }});
    
  }


  selectNo(eventId: string) {

    this.removeEvent(eventId);

  }
 
  selectYes(eventId: string) {
    
    this._dataSvc.updateStats(this._dataSvc.getEventById(eventId));
    this.removeEvent(eventId);

  }

}
