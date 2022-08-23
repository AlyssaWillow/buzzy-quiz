import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsPlaysSectionComponent } from './gs-plays-section.component';

describe('GsPlaysSectionComponent', () => {
  let component: GsPlaysSectionComponent;
  let fixture: ComponentFixture<GsPlaysSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsPlaysSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsPlaysSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
