import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFactionComponent } from './add-faction.component';

describe('AddPlayComponent', () => {
  let component: AddFactionComponent;
  let fixture: ComponentFixture<AddFactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
