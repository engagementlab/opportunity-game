import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class GameStartComponent implements OnInit {

    constructor() { }

    ngOnInit() {
        
        TweenLite.fromTo(document.getElementById('logo'), 1, {scale:0}, {scale:1, delay: 2, display:'block', ease:Elastic.easeOut});
        TweenLite.fromTo(document.getElementById('new'), 1, {scale:0}, {scale:1, delay: 2.5, visibility:'visible', ease:Elastic.easeOut});
        TweenLite.fromTo(document.getElementById('footer'), .5, {scale:0}, {scale:1, delay: 2.7, visibility:'visible', ease:Back.easeOut});
        TweenLite.fromTo(document.getElementById('bg'), 1, {alpha:0}, {alpha:1, delay: 2.7, visibility:'visible'});

    }

    newGame() {

        let start = document.getElementById('start');
        let characters = document.getElementById('characters-parent');
        let footer = document.getElementById('footer');

        TweenLite.fromTo(start, .7, {autoAlpha:1}, {autoAlpha:0, left:'-100%', display:'none', ease:Back.easeIn});
        TweenLite.fromTo(footer, .7, {autoAlpha:1}, {autoAlpha:0, top:'100%', display:'none', ease:Back.easeIn});
        TweenLite.fromTo(characters, .7, {autoAlpha:1, left:'100%'}, {autoAlpha:1, left:0, delay:.7, display:'block', ease:Back.easeOut});

    }
}
