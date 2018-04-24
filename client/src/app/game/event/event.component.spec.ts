import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameEventComponent } from './event.component';

describe('GameEventComponent', () => {
  let component: GameEventComponent;
  let fixture: ComponentFixture<GameEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
