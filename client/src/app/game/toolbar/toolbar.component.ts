import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { PlayerData } from '../../models/playerdata';

@Component({
  selector: 'game-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class GameToolbarComponent implements AfterViewInit {

  days: number;
	money: number;

  constructor(private _dataSvc: DataService) {

    this.money = this._dataSvc.playerData.money;
  	this.actions = this._dataSvc.playerData.actions;

  	this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {
      this.money = data.money;
  		this.actions = data.actions;
  	});

   }

  ngAfterViewInit() {
  	
  }

}
