import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsExpansionsComponent } from './gs-expansions.component';

describe('GsExpansionsComponent', () => {
  let component: GsExpansionsComponent;
  let fixture: ComponentFixture<GsExpansionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsExpansionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsExpansionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
