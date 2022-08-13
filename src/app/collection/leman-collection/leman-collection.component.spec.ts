import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LemanCollectionComponent } from './leman-collection.component';

describe('LemanCollectionComponent', () => {
  let component: LemanCollectionComponent;
  let fixture: ComponentFixture<LemanCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LemanCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LemanCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
