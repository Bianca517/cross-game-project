import { TestBed } from '@angular/core/testing';
import { GameLogicService } from './game-logic.service';

describe('GameLogicService', () => {
  let service: GameLogicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameLogicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build a deck of cards', () => {
    service.buildDeck();
    expect(service.deck.length).toBe(24);
  });

  it('should shuffle the deck', () => {
    const initialDeck = [...service.deck];
    service.shuffleDeck();
    expect(service.deck).not.toEqual(initialDeck);
  });

  it('should deal 8 cards to both players', () => {
    service.buildDeck();
    service.shuffleDeck();
    service.dealCards();
    expect(service.opponentCards.length).toBe(8);
    expect(service.yourCards.length).toBe(8);
  });

  it('should return the correct value of a card', () => {
    const card = '2-D';
    const value = service.getValue(card);
    expect(value).toBe(2);
  });

  it('should calculate the sum of user cards', () => {
    service.yourCards = ['2-D', '3-D', '4-D', '9-D', '10-D', '11-D', '2-G', '3-G'];
    const sum = service.calculateSumUser();
    expect(sum).toBe(36);
  });
});
