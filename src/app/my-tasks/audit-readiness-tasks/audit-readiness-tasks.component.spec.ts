import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditReadinessTasksComponent } from './audit-readiness-tasks.component';

describe('AuditReadinessTasksComponent', () => {
  let component: AuditReadinessTasksComponent;
  let fixture: ComponentFixture<AuditReadinessTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditReadinessTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditReadinessTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
