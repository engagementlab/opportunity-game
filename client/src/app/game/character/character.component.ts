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
	categoryData = new Map<string, number>();

  constructor(private _dataSvc: DataService) {

    this._dataSvc.getCharacterData().subscribe(response => {

      this.characters = this._dataSvc.characterData;


    });
  }

  ngOnInit() {
    
    let bubble = document.getElementById('bubble');
    TweenLite.fromTo(bubble, 1.5, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:3, display:'block', ease:Elastic.easeOut});
  }

  chooseCharacter(index: number) {

    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('logo').classList.add('hidden');

    document.getElementById('characters').classList.add('hidden');
    document.getElementById('character-detail').classList.remove('hidden')
    document.querySelector('#character-detail #detail-'+index).classList.remove('hidden');

    document.getElementById('questionnaire').style.display = 'none';

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

		this.categoryData.set(category, evt.target.value);
    this._dataSvc.changeCharacter(category, evt.target.value);

  	_.each(otherCategories, (el) => {

      _.each(el.children, (child) => {
        let childEl = <HTMLInputElement>child.children[0];
        let indexChosen = Array.from(this.categoryData.values()).includes(childEl.value);
        console.log(this.categoryData.values())
        console.log(childEl.value)
        if(!indexChosen)
	  			childEl.removeAttribute('disabled');
  		});

      let input = el.children[evt.target.value].children[0];
      if(input.name !== category)
        input.setAttribute('disabled', 'disabled');

  	});

  }

}
