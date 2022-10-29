import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepareForGnComponent } from './prepare-for-gn.component';

describe('PrepareForGnComponent', () => {
  let component: PrepareForGnComponent;
  let fixture: ComponentFixture<PrepareForGnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrepareForGnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepareForGnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
