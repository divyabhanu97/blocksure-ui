import { TestBed } from '@angular/core/testing';

import { ExtractionServiceService } from './extraction-service.service';

describe('ExtractionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExtractionServiceService = TestBed.get(ExtractionServiceService);
    expect(service).toBeTruthy();
  });
});
