import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

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
	@Input() autoFormat: boolean;

  public widthCss: string;

  constructor(private _sanitizer: DomSanitizer) { }

  ngOnInit() {

    if(this.width)
      this.widthCss = this._sanitizer.bypassSecurityTrustStyle('max-width:' + this.width+'px');

  }

}
