import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCountdownComponent } from './add-countdown.component';

describe('AddCountdownComponent', () => {
  let component: AddCountdownComponent;
  let fixture: ComponentFixture<AddCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddCountdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
