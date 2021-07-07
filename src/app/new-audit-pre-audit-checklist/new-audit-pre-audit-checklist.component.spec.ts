import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAuditPreAuditChecklistComponent } from './new-audit-pre-audit-checklist.component';

describe('NewAuditPreAuditChecklistComponent', () => {
  let component: NewAuditPreAuditChecklistComponent;
  let fixture: ComponentFixture<NewAuditPreAuditChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAuditPreAuditChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAuditPreAuditChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
