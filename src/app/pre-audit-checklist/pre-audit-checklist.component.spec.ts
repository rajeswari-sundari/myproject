import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreAuditChecklistComponent } from './pre-audit-checklist.component';

describe('PreAuditChecklistComponent', () => {
  let component: PreAuditChecklistComponent;
  let fixture: ComponentFixture<PreAuditChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreAuditChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreAuditChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
