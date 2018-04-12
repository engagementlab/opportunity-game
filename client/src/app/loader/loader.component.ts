import { Component, OnInit, Injectable, Input } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})

@Injectable()
export class LoaderComponent implements OnInit {

	isLoading: boolean;
  constructor(private jsonSvc: DataService) {
		
		this.jsonSvc.isLoading.subscribe( value => {
        this.isLoading = value;
    } );
  
  }

  ngOnInit() {
  }

  startLoading() {

  	this.isLoading = true;

  }

  stopLoading() {

  }


}
