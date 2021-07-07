import { TestBed } from '@angular/core/testing';

import { MetricsDefinitionService } from './metrics-definition.service';

describe('MetricsDefinitionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MetricsDefinitionService = TestBed.get(MetricsDefinitionService);
    expect(service).toBeTruthy();
  });
});
