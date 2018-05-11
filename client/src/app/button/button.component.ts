import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  @Input() id: string;
	@Input() label: string;
	@Input() route: string;
  @Input() href: string;
	@Input() class: string;
	@Input() ariaLabel: string;
	@Input() newWindow: boolean;
  @Input() clickData: any;

  @Output() clickEvent = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  	
  }

  clickHandler(data: any) {

    this.clickEvent.emit(data);

  }

}
