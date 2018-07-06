import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HostListener } from '@angular/core';

import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';

import { DeactivateGuard } from './deactivate-guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loading: boolean;
  public isQABuild: boolean;
  title = 'Portland of Opportunity';

  constructor(private router: Router) { }
    
  ngOnInit() {
    
    this.isQABuild = environment.qa;
    setTimeout(() => {

      TweenLite.fromTo(document.getElementById('qa-build'), .7, {autoAlpha:0, bottom:'-100%'}, {autoAlpha:1, bottom:0, ease:Expo.easeOut});
      TweenLite.fromTo(document.querySelector('#qa-build img'), .7, {autoAlpha:0, scale:0}, {autoAlpha:1, scale:1, delay:.7, ease:Back.easeOut});
      TweenLite.fromTo(document.querySelector('#qa-build #text'), .7, {autoAlpha:0, left:'-100%'}, {autoAlpha:1, left:0, delay:.9, ease:Back.easeOut});
      TweenLite.fromTo(document.getElementById('qa-build'), .7, {autoAlpha:1, bottom:0}, {autoAlpha:0, bottom:'-100%', delay:4, ease:Expo.easeIn});
    }, 2000);


  }

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    return false;
  }

}