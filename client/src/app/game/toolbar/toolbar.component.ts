import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../data.service';
import { PlayerData } from '../../models/playerdata';

@Component({
  selector: 'game-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class GameToolbarComponent implements AfterViewInit {

  constructor(private _dataSvc: DataService) {

  	this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {
  		console.log(data)
  	});

   }

  ngAfterViewInit() {
  	
  }

}
