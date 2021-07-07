import { TestBed } from '@angular/core/testing';

import { MyTasksService } from './my-tasks.service';

describe('MyTasksService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyTasksService = TestBed.get(MyTasksService);
    expect(service).toBeTruthy();
  });
});
