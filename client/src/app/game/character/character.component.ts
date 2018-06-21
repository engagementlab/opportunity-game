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
    TweenLite.fromTo(bubble, 1.5, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:3, display:'block', ease:Elastic.easeOut});
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
  	let otherCategories = document.getElementsByClassName('buttons');
    let startBtnDesktop = document.getElementById('submit-btn-desktop');
    let startBtnMobile = document.getElementById('submit-btn-mobile');

		this.categoryData.set(category, evt.target);

    _.each(otherCategories, (el) => {

      _.each(el.children, (child) => {
        // Get radio button
        let childEl = <HTMLInputElement>child.children[0];

        // Find if value already checked in other category and uncheck
        if(evt.target.value === childEl.value && 
           childEl.getAttribute('name') !== category)
          childEl.checked = false;
  		});

  	});

    // Show/hide submit
    if(document.querySelectorAll('input[type="radio"]:checked').length === 3 && !this.showBtn) {
      TweenLite.fromTo([startBtnDesktop, startBtnMobile], 1.2, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, display:'block', ease:Elastic.easeOut});
      this.showBtn = true;
    }
    else if(this.showBtn) {
      TweenLite.to([startBtnDesktop, startBtnMobile], .6, {autoAlpha:0, scale:0, display:'none', ease:Back.easeIn});
      this.showBtn = false;
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

    // Find goal for player matching at least two of their rankings
    this.goals.forEach((goal) => {

      let matches: number = 0;

      this.categoryData.forEach((input, key, map) => {

        if(goal[key] === parseInt(input.value))
          matches++;

      });

      if(matches >= 2)
        this.assignedGoal = goal;

    });

    // If no goal matched, assign random one
    this.assignedGoal = this.goals[assignedIndex];

    let bubble = document.getElementById('bubble');
    TweenLite.to(bubble, .3, {autoAlpha:0, scale:0, display:'hide', ease:Back.easeIn});

    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('character-detail').classList.remove('hidden')
    document.querySelector('#character-detail #detail-'+assignedIndex).classList.remove('hidden');
    document.getElementById('questionnaire-mobile').style.display = 'none';

    this._dataSvc.changeCharacter(assignedIndex, this.assignedGoal);

  }

  openTutorial() {

    TweenLite.fromTo(document.getElementById('tutorial-parent'), 1.2, {autoAlpha:0}, {autoAlpha:1, delay: 1, display:'block'});
    TweenLite.fromTo(document.getElementById('screen0'), 1, {autoAlpha:0, top:'-100%'}, {autoAlpha:1, top:'0%', delay: 1.8, display:'block', ease:Back.easeOut});      
    TweenLite.fromTo(document.querySelector('#tutorial #buttons'), 1, {scale:0}, {scale:1, delay: 3.3, display:'block', ease:Elastic.easeOut});

  }

}
