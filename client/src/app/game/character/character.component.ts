import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { Character } from '../../models/character';
import * as _ from 'underscore';

@Component({
  selector: 'app-character',
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
  }

  chooseCharacter(evt) {

    evt.currentTarget.classList.add('selected');
    document.getElementById('welcome').classList.remove('hidden');
    document.getElementById('logo').classList.add('hidden');

    let buttons = document.getElementsByClassName('character');
    _.each(buttons, (btn) => {
      if(btn !== evt.currentTarget)
        btn.classList.add('hidden');
    });

  }

  goBack() {

    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('logo').classList.remove('hidden');
    
    let buttons = document.getElementsByClassName('character');
    _.each(buttons, (btn) => {
        btn.classList.remove('hidden');
        btn.classList.remove('selected');
    });

  }

  onSelectionChange(evt) {
  	let category = evt.target.parentElement.name;
  	let otherCategories = document.getElementsByTagName('fieldset');
		this.categoryData.set(category, evt.target.value);

    this._dataSvc.changeCharacter(category, parseInt(evt.target.value));

  	_.each(otherCategories, (el) => {
  		_.each(el.children, (child) => {
  		  let childEl = <HTMLInputElement>child;
  			let indexChosen = Array.from(this.categoryData.values()).includes(parseInt(childEl.value));
  			if(!indexChosen)
	  			child.removeAttribute('disabled');
  		
  		});

  		if(el.name != category) {
  			let item = el.children.item(evt.target.value);
				item.setAttribute('disabled', 'disabled');
  		}
  	});


  }

}
