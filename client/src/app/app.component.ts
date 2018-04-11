import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { environment } from '../environments/environment';

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

  }
}
