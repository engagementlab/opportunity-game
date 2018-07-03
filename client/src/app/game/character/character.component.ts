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
    TweenLite.to(bubble, .3, {autoAlpha:0, scale:0, display:'none', ease:Back.easeIn});

    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('character-detail').classList.remove('hidden')
    document.querySelector('#character-detail #detail-'+assignedIndex).classList.remove('hidden');
    document.getElementById('questionnaire-mobile').style.display = 'none';

    this._dataSvc.changeCharacter(assignedIndex, this.assignedGoal);

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
