import { Component, OnInit, HostListener, Inject, 
         ViewChild,
         AfterViewInit,
         ElementRef } from '@angular/core';
import { JsonService } from '../json.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  
  getData(): void {
    /*this.jsonSvc.getAllData('index')
        .subscribe(response => {
          
          let modulesMap = response.get("modules");
          this.modules = Array.from(modulesMap.values());
          this.index = response.get("index");
          
        });*/
  }

  constructor(private jsonSvc: JsonService) { }

  ngOnInit() {
    // this.getData();
  }

}
