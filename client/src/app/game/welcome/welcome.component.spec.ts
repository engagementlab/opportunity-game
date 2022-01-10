import { async, ComponentFixture, TestBed } from '../../../../node_modules/@angular/core/testing';

import { GameWelcomeComponent } from './welcome.component';

describe('GameWelcomeComponent', () => {
  let component: GameWelcomeComponent;
  let fixture: ComponentFixture<GameWelcomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameWelcomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
