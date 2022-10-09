import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsPieComponent } from './ps-pie.component';

describe('PsPieComponent', () => {
  let component: PsPieComponent;
  let fixture: ComponentFixture<PsPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PsPieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PsPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
