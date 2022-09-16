import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAllComponent } from './add-all.component';

describe('AddAllComponent', () => {
  let component: AddAllComponent;
  let fixture: ComponentFixture<AddAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
