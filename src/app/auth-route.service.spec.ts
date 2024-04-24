import { TestBed } from '@angular/core/testing';

import { AuthRouteService } from './auth-route.service';

describe('AuthRouteService', () => {
  let service: AuthRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
