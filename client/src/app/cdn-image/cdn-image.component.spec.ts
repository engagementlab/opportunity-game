import { async, ComponentFixture, TestBed } from '../../../node_modules/@angular/core/testing';

import { CdnImageComponent } from './cdn-image.component';

describe('CdnImageComponent', () => {
  let component: CdnImageComponent;
  let fixture: ComponentFixture<CdnImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CdnImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdnImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
