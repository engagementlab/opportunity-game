import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HostListener } from '@angular/core';

import { environment } from '../environments/environment';
import { Observable } from 'rxjs/Observable';

import { DeactivateGuard } from './deactivate-guard';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: {'window:beforeunload':'beforeunloadHandler'}
})
export class AppComponent implements OnInit, DeactivateGuard {
  public loading: boolean;
  public isQABuild: boolean;
  title = 'Portland of Opportunity';

  constructor(private router: Router) { }
    
  ngOnInit() {
    
    this.isQABuild = environment.qa;

  }

  // @HostListener allows us to also guard against browser refresh, close, etc.
  // @HostListener('window:beforeunload')
  // canDeactivate(): Observable<boolean> | boolean {
  //   return true;
  // }
@HostListener('window:beforeunload', ['$event'])
beforeunloadHandler(event) {
    // console.log(event)
    event.preventDefault();
    return alert('By refreshing this page you may lost all data.');
}
}
