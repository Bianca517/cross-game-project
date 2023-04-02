import { Component } from '@angular/core';

interface Card {
  suit: string;
  value: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent {

  //creating the deck of 32 cards
  deck: Card[] = [];

  constructor() {
    const suits = ['rosu', 'duba', 'verde', 'ghinda'];
    const values = ['2', '3', '4', '9', '10', 'A'];

    for (const suit of suits) {
      for (const value of values) {
        this.deck.push({suit, value});
      }
    }
    console.log(this.deck);
  }
}