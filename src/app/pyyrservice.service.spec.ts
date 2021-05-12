import { TestBed } from '@angular/core/testing';

import { PyyrserviceService } from './pyyrservice.service';

describe('PyyrserviceService', () => {
  let service: PyyrserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PyyrserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
