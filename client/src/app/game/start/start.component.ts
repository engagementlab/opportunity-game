import { Component, OnInit } from '@angular/core';
import { CSSPlugin } from 'gsap';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class GameStartComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	/*particlesJS.load('parent', '../../assets/particles.json', function() {
		  console.log('callback - particles.js config loaded');
		});*/
  }

  showCharacters() {

    let parent = document.getElementById('parent');
    let newBtn = document.getElementById('new');
    let characters = document.getElementById('characters-parent');
    let logo = document.getElementById('logo');
    // let bubble = document.getElementById('bubble');

    parent.classList.add('characters');
    logo.classList.add('hidden-mobile');

    let tl = new TimelineMax();

    tl.to(newBtn, .5, {autoAlpha:0, display: 'none');
    tl.to(logo, .5, {scale:.7});
    tl.fromTo(characters, .5, {autoAlpha:0}, {scale:1, autoAlpha:1, marginTop:0 display:'block', ease:Sine.easeOut}, '+=.2');
    // tl.to(logo, 1, { marginTop:'5%'}, '-=1');
    
    tl.play();

  }

}
