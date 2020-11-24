import { TestBed } from '@angular/core/testing';

import { UserGeolocationService } from './user-geolocation.service';

describe('UserGeolocationService', () => {
  let service: UserGeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserGeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
