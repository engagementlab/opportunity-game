import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameToolbarComponent } from './toolbar.component';

describe('GameToolbarComponent', () => {
  let component: GameToolbarComponent;
  let fixture: ComponentFixture<GameToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
