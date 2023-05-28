import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameConfigurationService {
  gameMode: string = 'Easy';
  gameTotalPoints: number = 7;
  constructor() { }
}
