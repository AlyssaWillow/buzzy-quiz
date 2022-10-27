import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GsVideosComponent } from './gs-videos.component';

describe('GsVideosComponent', () => {
  let component: GsVideosComponent;
  let fixture: ComponentFixture<GsVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GsVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GsVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
