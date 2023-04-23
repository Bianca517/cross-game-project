import { Component, ViewEncapsulation } from '@angular/core';
import { GameLogicService } from '../services/game-logic.service'

//declare const startGame:any;
declare const clearLicitationPopUp:any;
declare const clearTromfPopUp:any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GameComponent {

  constructor(private gameLogicService: GameLogicService) {

  }
  ngOnInit(): void {
    clearLicitationPopUp();
    clearTromfPopUp();
    this.gameLogicService.startGame();
  };
}