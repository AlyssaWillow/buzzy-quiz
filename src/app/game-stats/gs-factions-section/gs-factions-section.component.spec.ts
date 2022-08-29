import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsFactionsSectionComponent } from './gs-factions-section.component';

describe('GsFactionsSectionComponent', () => {
  let component: GsFactionsSectionComponent;
  let fixture: ComponentFixture<GsFactionsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsFactionsSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsFactionsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
