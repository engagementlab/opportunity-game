import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Character } from '../../models/character';
import { Goal } from '../../models/goal';
import * as _ from 'underscore';

@Component({
  selector: 'game-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class GameCharacterComponent implements OnInit {

  public assignedGoal: Goal;
  public textObject: Array<Object>;

  characters: Character[];
  goals: Goal[];

  categoryData = new Map<string, HTMLInputElement>();
  showBtn: boolean;
  wellbeingGoal: number;

  constructor(private _dataSvc: DataService) {

    this._dataSvc.getCharacterData().subscribe(response => {

      this.characters = this._dataSvc.characterData;
      this.goals = this._dataSvc.goalData;

      // Default 
      this.assignedGoal = this.goals[0];

    });
  }

  ngOnInit() {
    
    let bubble = document.getElementById('bubble');
    TweenLite.fromTo(bubble, 1.5, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:2, display:'block', ease:Elastic.easeOut});

    let waitHeader = document.querySelector('#wait h2');
    let textArr = 'Choosing\nYour\nCharacter'.split('');
    let colors = ['9fe2a2', 'dda812', 'ff5500', 'ffaee4'];

    this.textObject = new Array<Object>();
    let colorInd = 0;
    for(let i = 0; i < textArr.length; i++) {
      colorInd++;
      if(colorInd > 3) colorInd = 0;

      this.textObject.push({color:colors[colorInd], string:textArr[i]});
    }
  }

  goBack() {

    document.getElementById('characters').classList.remove('hidden');
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('character-detail').classList.add('hidden');
    
    let details = document.getElementsByClassName('detail');
    _.each(details, (detail) => {
        detail.classList.add('hidden');
    });

  }

  onSelectionChange(evt) {
    
  	let category = evt.target.name;
  	let otherCategories = document.getElementsByClassName('input');
    let startBtn = document.getElementById('submit-btn');

    _.each(otherCategories, (el) => {
      
      if(el !== evt.target) {
        TweenLite.to(document.getElementById((<HTMLInputElement>el).name), .5, {scale:1, ease:Back.easeOut});
        (<HTMLInputElement>el).checked = false;
      }
      else {
        TweenLite.to(document.getElementById(evt.target.name), .5, {scale:1.2, ease:Elastic.easeOut});
        this._dataSvc.playerPriority = evt.target.value;
      }

  	});

    // Show
    if(!this.showBtn) {
      this.showBtn = true;
      TweenLite.fromTo(startBtn, 1.2, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, display:'block', ease:Elastic.easeOut});
    }
  }

  chooseCharacter(index: number) {

    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('logo').classList.add('hidden');

    document.getElementById('characters').classList.add('hidden');
    document.getElementById('character-detail').classList.remove('hidden')
    document.querySelector('#character-detail #detail-'+index).classList.remove('hidden');

  }

  assignCharacter() {

    let assignedIndex = (Math.floor(Math.random() * (3 - 0 + 1)) + 0);
    this.wellbeingGoal = this._dataSvc.playerData.wellnessGoal;

    let bubble = document.getElementById('bubble');

    this._dataSvc.changeCharacter(assignedIndex, this.assignedGoal);

    let letters = document.querySelectorAll('.letter');
    let ellipses = document.getElementById('ellipses');

    TweenLite.fromTo(document.getElementById('wait'), .5, {autoAlpha:0, left:'-100%'}, {autoAlpha:1, left:0, delay: 1, display:'block', ease:Back.easeOut, onComplete:() => {
      
      TweenMax.staggerFromTo(letters, .4, {autoAlpha:0, top:'30px'}, {autoAlpha:1, top:0, visibility:'visible', ease:Sine.easeOut}, .05, () => {

        let spacing = {val: 0};

        TweenLite.fromTo(ellipses, .1, {autoAlpha:0}, {autoAlpha:1, display:'block'});
        TweenMax.to(spacing, .5, {val:.3, yoyo:true, repeat:-1, ease:Sine.easeOut, onUpdate:() => {
          ellipses.style.letterSpacing = spacing.val + 'em';
        }});

      });

      setTimeout(() =>  {

        bubble.style.display = 'none';

        TweenLite.to(document.getElementById('wait'), .5, {autoAlpha:0, left:'100%', display:'none', ease:Back.easeOut});

        document.getElementById('welcome').classList.remove('hidden');
        document.getElementById('character-detail').classList.remove('hidden')
        document.querySelector('#character-detail #detail-'+assignedIndex).classList.remove('hidden');
        document.getElementById('questionnaire-mobile').style.display = 'none';

      }, 5000);

    }});

  }

  openTutorial() {

    let scroll  = {val: 0};

    TweenLite.fromTo(document.getElementById('tutorial-parent'), .7, {autoAlpha:0}, {autoAlpha:1, display:'block'});
    TweenLite.fromTo(document.getElementById('screen0'), .7, {autoAlpha:0, left:'-100%'}, {autoAlpha:1, left:0, delay: 1, display:'block', ease:Back.easeOut});      
    TweenLite.fromTo(document.querySelector('#tutorial #buttons'), 1, {scale:0}, {scale:1, delay:2, display:'block', ease:Elastic.easeOut});

    TweenMax.to(scroll, 2, {val:97, ease:Sine.easeOut, delay:2, onUpdate:() => {
      (<HTMLElement>document.querySelector('#tutorial #inner')).style.width = scroll.val + '%';
    }});

  }

}
