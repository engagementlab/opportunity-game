import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { PlayerData } from '../../models/playerdata';

@Component({
  selector: 'game-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class GameToolbarComponent implements AfterViewInit {

	money: number;

  constructor(private _dataSvc: DataService) {

  	this.money = this._dataSvc.playerData.money;

  	this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {
  		this.money = data.money;
  	});

   }

  ngAfterViewInit() {
  	
  }

}
