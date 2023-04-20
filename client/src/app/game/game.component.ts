import { Component } from '@angular/core';

declare const buildDeck:any;
declare const shuffleDeck:any;
declare const startGame:any;
declare const getValue:any;
declare const handleTimer:any;
declare const startTimer:any;
declare const handleLicitationPopUp:any;
declare const clearPopUp:any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {

  ngOnInit(): void {
    window.onload = function() {
      clearPopUp();
      buildDeck();
      shuffleDeck();
      startGame();
      handleLicitationPopUp();
    };
  }
}