import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'cdn-image',
  templateUrl: './cdn-image.component.html',
  styleUrls: ['./cdn-image.component.scss']
})
export class CdnImageComponent implements OnInit {

	@Input() cloudinaryId: string;
	@Input() alt: string;
	@Input() width: number;
  @Input() quality: number;
	@Input() autoFormat: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
