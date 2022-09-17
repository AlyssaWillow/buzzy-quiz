import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFactionTypeComponent } from './add-faction-type.component';

describe('AddFactionTypeComponent', () => {
  let component: AddFactionTypeComponent;
  let fixture: ComponentFixture<AddFactionTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFactionTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFactionTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
