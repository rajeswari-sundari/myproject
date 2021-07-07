import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailRemindersComponent } from './email-reminders.component';

describe('EmailRemindersComponent', () => {
  let component: EmailRemindersComponent;
  let fixture: ComponentFixture<EmailRemindersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailRemindersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailRemindersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
