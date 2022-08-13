import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HendricksonCollectionComponent } from './hendrickson-collection.component';

describe('HendricksonCollectionComponent', () => {
  let component: HendricksonCollectionComponent;
  let fixture: ComponentFixture<HendricksonCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HendricksonCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HendricksonCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
