import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { courseOwnerGuardGuard } from './course-owner-guard-guard';

describe('courseOwnerGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => courseOwnerGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
