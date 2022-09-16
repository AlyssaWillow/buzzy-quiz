import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsFnGameFactionComponent } from './gs-fn-game-faction.component';

describe('GsFnGameFactionComponent', () => {
  let component: GsFnGameFactionComponent;
  let fixture: ComponentFixture<GsFnGameFactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsFnGameFactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsFnGameFactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
