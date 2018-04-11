import { Component, OnInit } from '@angular/core';
import * as ismobile from 'ismobilejs';

@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.scss']
})
export class AppNavbarComponent implements OnInit {

  isMobile: boolean; 

  constructor() {
  }

  ngOnInit() {

    this.isMobile = ismobile.tablet || ismobile.phone;
    console.log(this.isMobile)

  }

}
