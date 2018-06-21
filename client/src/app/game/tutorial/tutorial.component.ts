import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router'
import { DOCUMENT } from '@angular/platform-browser';

@Component({
  selector: 'game-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {

	currentScreen: number = 0;

  constructor(@Inject(DOCUMENT) private document: Document, private router: Router) { }

  ngOnInit() {

  }

  nextScreen() {

  	this.document.documentElement.scrollTop = 0;
    TweenLite.fromTo(document.getElementById('buttons'), .4, {scale:1}, {scale:0, display:'none', ease:Back.easeIn});

		TweenLite.fromTo(document.getElementById('screen'+this.currentScreen), 1, {autoAlpha:1}, {autoAlpha:1, top:'-100%', display:'none', ease:Back.easeIn});    
  	this.currentScreen++;  
		TweenLite.fromTo(document.getElementById('screen'+this.currentScreen), 1, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:'0%', delay: 1.8, display:'block', ease:Back.easeOut, onComplete:() => {

			if(this.currentScreen === 2) {
				document.getElementById('continue-btn').remove();
				document.getElementById('start-btn').style.display = 'block';
			}

	    TweenLite.fromTo(document.getElementById('buttons'), 1, {scale:0}, {scale:1, delay: .3, display:'block', ease:Elastic.easeOut});

		}});      

  }

  close() {
   
    TweenLite.fromTo(document.getElementById('tutorial'), 1, {autoAlpha:1}, {autoAlpha:0, display:'none'}); 
    this.router.navigateByUrl('/game/home');

  }

}
