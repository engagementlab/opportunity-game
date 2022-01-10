import { async, ComponentFixture, TestBed } from '../../../../node_modules/@angular/core/testing';

import { GameCharacterComponent } from './character.component';

describe('GameCharacterComponent', () => {
  let component: GameCharacterComponent;
  let fixture: ComponentFixture<GameCharacterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameCharacterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCharacterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
