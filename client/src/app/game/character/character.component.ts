import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Character } from '../../models/character';
import * as _ from 'underscore';

@Component({
  selector: 'game-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class GameCharacterComponent implements OnInit {

  characters: Character[];
	categoryData = new Map<string, string>();
  showBtn: boolean;

  constructor(private _dataSvc: DataService) {

    this._dataSvc.getCharacterData().subscribe(response => {

      this.characters = this._dataSvc.characterData;


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
    let startBtn = document.getElementById('submit-btn');

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
      TweenLite.fromTo(startBtn, 1.2, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, display:'block', ease:Elastic.easeOut});
      this.showBtn = true;
    }
    else if(this.showBtn) {
      TweenLite.to(startBtn, .6, {autoAlpha:0, scale:0, display:'none', ease:Back.easeIn});
      this.showBtn = false;
    }

  }

  chooseCharacter(index: number) {

    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('logo').classList.add('hidden');

    document.getElementById('characters').classList.add('hidden');
    document.getElementById('character-detail').classList.remove('hidden')
    document.querySelector('#character-detail #detail-'+index).classList.remove('hidden');

    document.getElementById('questionnaire').style.display = 'none';

  }

  assignCharacter() {

    this.assignedIndex = (Math.floor(Math.random() * (3 - 0 + 1)) + 0);

    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('logo').classList.add('hidden');

    document.getElementById('characters').classList.add('hidden');
    document.getElementById('character-detail').classList.remove('hidden')
    document.querySelector('#character-detail #detail-'+this.assignedIndex).classList.remove('hidden');

    document.getElementById('questionnaire-desktop').style.display = 'none';
    document.getElementById('questionnaire-mobile').style.display = 'none';
    // this._dataSvc.assignedCharIndex

    this._dataSvc.changeCharacter(this.assignedIndex+1);



  }

}
