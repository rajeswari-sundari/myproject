import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditUpdateTasksComponent } from './audit-update-tasks.component';

describe('AuditUpdateTasksComponent', () => {
  let component: AuditUpdateTasksComponent;
  let fixture: ComponentFixture<AuditUpdateTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditUpdateTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditUpdateTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
