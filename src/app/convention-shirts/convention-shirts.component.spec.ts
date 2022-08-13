import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConventionShirtsComponent } from './convention-shirts.component';

describe('ConventionShirtsComponent', () => {
  let component: ConventionShirtsComponent;
  let fixture: ComponentFixture<ConventionShirtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConventionShirtsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConventionShirtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
