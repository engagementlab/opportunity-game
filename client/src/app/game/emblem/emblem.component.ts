import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'game-emblem',
  templateUrl: './emblem.component.html',
  styleUrls: ['./emblem.component.scss']
})
export class GameEmblemComponent implements OnInit {

	@Input() text: string;
	@Input() imageName: string;

  constructor() { }

  ngOnInit() {
  }

}
