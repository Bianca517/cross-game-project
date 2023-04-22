import { Component, ViewEncapsulation } from '@angular/core';

declare const buildDeck:any;
declare const shuffleDeck:any;
declare const dealCards:any;
declare const getValue:any;
declare const handleTimer:any;
declare const startTimer:any;
declare const handleLicitationPopUp:any;
declare const clearPopUp:any;
declare const moveCards:any;

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class GameComponent {

  ngOnInit(): void {
      buildDeck();
      shuffleDeck();
      dealCards();
      handleLicitationPopUp();
      clearPopUp();
    };
}