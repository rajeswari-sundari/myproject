import { TestBed } from '@angular/core/testing';

import { PreAuditChecklistService } from './pre-audit-checklist.service';

describe('PreAuditChecklistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreAuditChecklistService = TestBed.get(PreAuditChecklistService);
    expect(service).toBeTruthy();
  });
});
