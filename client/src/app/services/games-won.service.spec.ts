import { TestBed } from '@angular/core/testing';

import { GamesWonService } from './games-won.service';

describe('GamesWonService', () => {
  let service: GamesWonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GamesWonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
