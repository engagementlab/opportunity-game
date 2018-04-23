import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { PlayerData } from '../../models/playerdata';

@Component({
  selector: 'game-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class GameToolbarComponent implements AfterViewInit {

  round: number = 1;
  actions: number;
	money: number;
  commLevel: number;
  jobLevel: number;
  englishLevel: number;

  constructor(private _dataSvc: DataService) {

    this.money = this._dataSvc.playerData.money;
  	this.actions = this._dataSvc.playerData.actions;

    this.commLevel = this._dataSvc.playerData.commLevel;
    this.jobLevel = this._dataSvc.playerData.jobLevel;
    this.englishLevel = this._dataSvc.playerData.englishLevel;

  	this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

      this.money = data.money;
  		this.actions = data.actions;

      this.commLevel = data.commLevel;
      this.jobLevel = data.jobLevel;
      this.englishLevel = data.englishLevel;

      this.round = data.round;

  	});

   }

  ngAfterViewInit() {
  	
  }

}
