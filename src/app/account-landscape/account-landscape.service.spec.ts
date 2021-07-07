import { TestBed } from '@angular/core/testing';

import { AccountLandscapeService } from './account-landscape.service';

describe('AccountLandscapeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountLandscapeService = TestBed.get(AccountLandscapeService);
    expect(service).toBeTruthy();
  });
});
