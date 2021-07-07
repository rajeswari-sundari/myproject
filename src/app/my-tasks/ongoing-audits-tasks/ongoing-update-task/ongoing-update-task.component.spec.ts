import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingUpdateTaskComponent } from './ongoing-update-task.component';

describe('OngoingUpdateTaskComponent', () => {
  let component: OngoingUpdateTaskComponent;
  let fixture: ComponentFixture<OngoingUpdateTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingUpdateTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingUpdateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
