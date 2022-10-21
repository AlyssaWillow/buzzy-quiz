import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsEExansionGameComponent } from './gs-e-exansion-game.component';

describe('GsEExansionGameComponent', () => {
  let component: GsEExansionGameComponent;
  let fixture: ComponentFixture<GsEExansionGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsEExansionGameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsEExansionGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
