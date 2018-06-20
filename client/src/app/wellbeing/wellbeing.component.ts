import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { PlayerData } from '../models/playerdata';

@Component({
  selector: 'app-wellbeing',
  templateUrl: './wellbeing.component.html',
  styleUrls: ['./wellbeing.component.scss']
})
export class WellbeingComponent implements OnInit {
  
  currentWellnessScore: number;
  wellnessGoal: number;

  wellnessFill: HTMLElement;

  constructor(public _dataSvc: DataService) { }

  ngOnInit() {

  	this.wellnessFill = document.getElementById('inner');

    this._dataSvc.playerDataUpdate.subscribe((data: PlayerData) => {

    	this.currentWellnessScore = (data.wellnessScore / data.wellnessGoal);
    	this.wellnessFill.style.width = (this.currentWellnessScore * data.wellnessGoal) + "%";
      console.log(this.currentWellnessScore)
      console.log(this.currentWellnessScore * data.wellnessGoal)

    });

  }

}
