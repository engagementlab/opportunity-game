import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { DOCUMENT } from "@angular/platform-browser";
import { DataService } from '../data.service';
import { slideAnimation } from '../_animations/slide';
import { TweenLite } from "gsap";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  animations: [slideAnimation]
})
export class GameComponent implements OnInit {

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
  
  getData() {

    this.dataSvc.getAllData('data').subscribe(response => {
      // console.log(this.dataSvc.locationData)
    });

  }

  constructor(private router: Router, private dataSvc: DataService) { 

    this.getData();

  	router.events.subscribe((val) =>  {

      if(val instanceof NavigationEnd) {

        if(val.url === "/game/character")
          TweenLite.to(document.getElementById('logo'), 1, {scale:0.5});

        if(val.url === "/game/start")
          TweenLite.to(document.getElementById('logo'), 1, {scale:1});

        if(val.url === "/game/map")
          TweenLite.to(document.getElementById('toolbar'), 1, {autoAlpha: 1, display:'block'});
        
      }
      
    });

  }

  ngOnInit() {
  }

}
