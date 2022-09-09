import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddScenarioComponent } from './add-scenario.component';

describe('AddPlayComponent', () => {
  let component: AddScenarioComponent;
  let fixture: ComponentFixture<AddScenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddScenarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
