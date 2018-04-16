import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss']
})
export class GameCharacterComponent implements OnInit {

	// var selectedAttributes = {};
	data = new Map<string, number>();

  constructor(private _dataSvc: DataService) { }

  ngOnInit() {
  }

  onSelectionChange(evt) {
  	let category = evt.target.parentElement.name;
  	let otherCategories = document.getElementsByTagName('fieldset');
		this.data.set(category, evt.target.value);

    this._dataSvc.changeCharacter(category, parseInt(evt.target.value));

  	_.each(otherCategories, (el) => {
  		_.each(el.children, (child) => {
  		  let childEl = <HTMLInputElement>child;
  			let indexChosen = Array.from(this.data.values()).includes(parseInt(childEl.value));
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
