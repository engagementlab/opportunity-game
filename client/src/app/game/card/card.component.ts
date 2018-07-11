import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'game-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() homeButton: boolean = false;
  @Input() data: any;
  @Input() type: string;
  @Input() clickData: any;

  @Output() clickEvent = new EventEmitter<any>();
  @Output() clickNoEvent = new EventEmitter<any>();

  constructor(private router: Router) { }

  ngOnInit() {

  }

  backToList() {
    
    TweenLite.to(document.getElementById('detail_'+this.data._id), 1, {autoAlpha:0, display:'none', ease: Back.easeIn, oncomplete:() => {

      TweenLite.to(document.getElementById('list'), 1, {autoAlpha:1, display:'block'});
      TweenLite.to(document.getElementById('details'), .5, {autoAlpha:0, display:'none'});
    
    }});

  }

  backToHome() { 

    ion.sound.play('click');
    this.router.navigateByUrl('/game/home');

  }

  clickHandler(data: any) {

    this.clickEvent.emit(data);

  }

  clickNo(data: any) {

    ion.sound.play('decline');    
    this.clickNoEvent.emit(data);

  }
}
