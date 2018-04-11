import { Component, OnInit, HostBinding, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router'
import { DOCUMENT } from "@angular/platform-browser";;
import { slideAnimation } from '../_animations/slide';
import { TweenLite } from "gsap";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
  animations: [slideAnimation]
})
export class GameComponent implements OnInit {

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }

  constructor(private router: Router) { 

  	router.events.subscribe((val) => 

			if(val instanceof NavigationEnd) {

        if(val.url === "/game/character")
          TweenLite.to(document.getElementById('logo'), 1, {scale:0.5})

        if(val.url === "/game/start")
          TweenLite.to(document.getElementById('logo'), 1, {scale:1})
        
			}

  	);

  }

  ngOnInit() {
  }

}
