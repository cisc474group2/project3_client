import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PosteventComponent } from './postevent.component';

describe('PosteventComponent', () => {
  let component: PosteventComponent;
  let fixture: ComponentFixture<PosteventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PosteventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosteventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
