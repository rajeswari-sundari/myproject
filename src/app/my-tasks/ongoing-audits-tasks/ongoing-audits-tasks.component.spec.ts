import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingAuditsTasksComponent } from './ongoing-audits-tasks.component';

describe('OngoingAuditsTasksComponent', () => {
  let component: OngoingAuditsTasksComponent;
  let fixture: ComponentFixture<OngoingAuditsTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OngoingAuditsTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingAuditsTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
