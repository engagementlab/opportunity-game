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

  constructor(private _dataSvc: DataService) { }

  ngOnInit() {
  }

  removeEvent() {

  	// console.log .(this.data._id)
  	let thisEl = document.getElementById(this.data._id);
    TweenLite.to(thisEl.parentNode, 1, {autoAlpha: 0, display:'none'});
  	thisEl.parentNode.removeChild(thisEl);
    

  }

  selectNo() {

  	this.removeEvent();

  }
 
  selectYes() {
  	
  	this._dataSvc.updateStats(this.data.moneyCost, this.data.actionCost);
  	this.removeEvent();

  }

}
