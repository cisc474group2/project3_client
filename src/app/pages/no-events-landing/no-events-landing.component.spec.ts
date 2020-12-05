import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoEventsLandingComponent } from './no-events-landing.component';

describe('NoEventsLandingComponent', () => {
  let component: NoEventsLandingComponent;
  let fixture: ComponentFixture<NoEventsLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoEventsLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoEventsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
