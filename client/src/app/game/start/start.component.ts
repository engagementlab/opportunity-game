import { Component, OnInit } from '@angular/core';
import { TweenLite, Back, Elastic } from 'gsap';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class GameStartComponent implements OnInit {

    constructor() { }

    ngOnInit() {

        let top = document.getElementById('top');
        let bottom = document.getElementById('bottom');
        
        TweenLite.to(top, .7, {height:'60vh', autoAlpha:1, delay:1, ease:Back.easeOut});
        TweenLite.fromTo(bottom, .7, {autoAlpha:0, bottom:'-100%'}, {autoAlpha:1, bottom:0, display:'block', delay:1.7, ease:Back.easeOut, onComplete:() => {
            TweenLite.fromTo(document.querySelector('a#enter'), 2.7, {scale:0}, {scale:1, display:'inline-block', ease:Elastic.easeOut});
        }});

    }

    newGame() {

        let start = document.getElementById('start');
        let characters = document.getElementById('characters-parent');
        let footer = document.getElementById('footer');

        TweenLite.fromTo(start, .7, {autoAlpha:1}, {autoAlpha:0, left:'-100%', display:'none', ease:Back.easeIn});
        TweenLite.fromTo(footer, .7, {autoAlpha:1}, {autoAlpha:0, display:'none'});
        TweenLite.fromTo(characters, .7, {autoAlpha:1, left:'100%'}, {autoAlpha:1, left:0, delay:.7, display:'block', ease:Back.easeOut});

    }
    
    showGame() {

        let splash = document.getElementById('splash');
        let top = document.getElementById('top');
        let enter = document.querySelector('a#enter');
        let bottom = document.getElementById('bottom');

        TweenLite.fromTo(enter, .7, {scale:1}, {scale:0, ease:Back.easeIn});
        TweenLite.fromTo(bottom, .7, {autoAlpha:1}, {autoAlpha:0, bottom:'-100%', display:'none', delay:.6, ease:Back.easeIn});
        TweenLite.to(top, .7, {height:'100%', delay:.7, ease:Back.easeIn});
        TweenLite.to(splash, .7, {autoAlpha:0, display:'none', delay:1.2});
        
        TweenLite.fromTo(document.getElementById('logo'), 1, {scale:0}, {scale:1, delay: 2, display:'block', ease:Elastic.easeOut});
        TweenLite.fromTo(document.getElementById('new'), 1, {scale:0}, {scale:1, delay: 2.5, visibility:'visible', ease:Elastic.easeOut});
        TweenLite.fromTo(document.getElementById('footer'), .5, {autoAlpha:0}, {autoAlpha:1, delay: 2.7, visibility:'visible'});
        TweenLite.fromTo(document.getElementById('bg'), 1, {alpha:0}, {alpha:1, delay: 2.7, visibility:'visible'});
    }
}
