import { async, ComponentFixture, TestBed } from '../../../../node_modules/@angular/core/testing';

import { GameHomeComponent } from './home.component';

describe('GameHomeComponent', () => {
  let component: GameHomeComponent;
  let fixture: ComponentFixture<GameHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
