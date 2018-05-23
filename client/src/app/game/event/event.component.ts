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

  removeEvent(eventId: string) {

    let thisEl = document.getElementById(eventId);
      
    // Close events only if others not showing
    let otherEvents = document.querySelectorAll('#effect-events .game-event.queue');
    // debugger;
    if(otherEvents && otherEvents.length > 0) {
      TweenLite.to(thisEl, 1, {left:'100%', autoAlpha:0, ease:Back.easeIn, onComplete: () => {
        thisEl.remove();
        this._dataSvc.removeEvent(eventId);

        otherEvents[0].classList.remove('queue');
        TweenLite.fromTo(otherEvents[0], 1, {left:'-100%', autoAlpha:0}, {left:0, autoAlpha:1, display:'block', ease:Back.easeOut});
      }});
    }

    else {
      TweenLite.to(thisEl, 1, {autoAlpha: 0, display:'none', onComplete: () => {
        thisEl.parentNode.removeChild(thisEl);
        this._dataSvc.removeEvent(eventId);
        TweenLite.to(document.getElementById('effect-events'), 1, {autoAlpha: 0, display:'none'});
      }});
    }

    
  }


  selectNo(eventId: string) {

    this.removeEvent(eventId);
    // this._dataSvc.removeEvent(eventId);  

  }
 
  selectYes(eventId: string) {
    
    this._dataSvc.updateStats(this._dataSvc.getEventById(eventId));
    this.removeEvent(eventId);

  }

}
