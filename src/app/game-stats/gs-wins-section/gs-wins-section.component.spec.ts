import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsWinsSectionComponent } from './gs-wins-section.component';

describe('GsWinsSectionComponent', () => {
  let component: GsWinsSectionComponent;
  let fixture: ComponentFixture<GsWinsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsWinsSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsWinsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
