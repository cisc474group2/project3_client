import { TestBed } from '@angular/core/testing';

import { MasterDateTimeService } from './master-date-time.service';

describe('MasterDateTimeService', () => {
  let service: MasterDateTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterDateTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
