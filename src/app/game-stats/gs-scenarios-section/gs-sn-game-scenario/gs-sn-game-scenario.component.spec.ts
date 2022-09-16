import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsSnGameScenarioComponent } from './gs-sn-game-scenario.component';

describe('GsSnGameScenarioComponent', () => {
  let component: GsSnGameScenarioComponent;
  let fixture: ComponentFixture<GsSnGameScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsSnGameScenarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsSnGameScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
