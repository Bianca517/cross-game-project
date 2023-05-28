import { TestBed } from '@angular/core/testing';

import { ScoreHandlingServiceService } from './score-handling-service.service';

describe('ScoreHandlingServiceService', () => {
  let service: ScoreHandlingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreHandlingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
