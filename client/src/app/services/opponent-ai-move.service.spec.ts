import { TestBed } from '@angular/core/testing';

import { OpponentAiMoveService } from './opponent-ai-move.service';

describe('OpponentAiMoveService', () => {
  let service: OpponentAiMoveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpponentAiMoveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
