import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomGameGeneratorComponent } from './random-game-generator.component';

describe('RandomGameGeneratorComponent', () => {
  let component: RandomGameGeneratorComponent;
  let fixture: ComponentFixture<RandomGameGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RandomGameGeneratorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomGameGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
