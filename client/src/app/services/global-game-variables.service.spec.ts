import { TestBed } from '@angular/core/testing';

import { GlobalGameVariablesService } from './global-game-variables.service';

describe('GlobalGameVariablesService', () => {
  let service: GlobalGameVariablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalGameVariablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
