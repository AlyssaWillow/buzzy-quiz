import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeastPlayedComponent } from './least-played.component';

describe('LeastPlayedComponent', () => {
  let component: LeastPlayedComponent;
  let fixture: ComponentFixture<LeastPlayedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeastPlayedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeastPlayedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
