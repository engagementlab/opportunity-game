import { async, ComponentFixture, TestBed } from '../../../../node_modules/@angular/core/testing';

import { GameStartComponent } from './start.component';

describe('GameStartComponent', () => {
  let component: GameStartComponent;
  let fixture: ComponentFixture<GameStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
