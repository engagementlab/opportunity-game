import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class GameStartComponent implements OnInit {

    constructor() { }

    ngOnInit() {
    /*  	particlesJS.load('parent', '../../assets/particles.json', function() {
    	  console.log('callback - particles.js config loaded');
    	});*/
    }

    showCharacters() {

        let parent = document.getElementById('parent');
        let newBtn = document.getElementById('new');
        let characters = document.getElementById('characters-parent');
        let logo = document.getElementById('logo');

        parent.classList.add('characters');
        logo.classList.add('hidden-mobile');

        let tl = new TimelineMax();
        tl.to(newBtn, .5, {autoAlpha:0, display: 'none'});
        tl.to(logo, .5, {scale:.7});
        tl.fromTo(characters, .5, {autoAlpha:0}, {scale:1, autoAlpha:1, display:'block', ease:Sine.easeOut}, '+=.2');

        tl.play();

    }

}
