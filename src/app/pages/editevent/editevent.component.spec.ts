import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditeventComponent } from './editevent.component';

describe('EditeventComponent', () => {
  let component: EditeventComponent;
  let fixture: ComponentFixture<EditeventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditeventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditeventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
