import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsGameDetailsComponent } from './gs-game-details.component';

describe('GsGameDetailsComponent', () => {
  let component: GsGameDetailsComponent;
  let fixture: ComponentFixture<GsGameDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsGameDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsGameDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
