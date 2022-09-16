import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsScenariosSectionComponent } from './gs-scenarios-section.component';

describe('GsScenariosSectionComponent', () => {
  let component: GsScenariosSectionComponent;
  let fixture: ComponentFixture<GsScenariosSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsScenariosSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsScenariosSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
