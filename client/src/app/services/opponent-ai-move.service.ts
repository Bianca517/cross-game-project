import { Injectable } from '@angular/core';
import { GlobalGameVariablesService } from './global-game-variables.service';

type Nullable<T> = T | null;

let scores: { [key: string]: number } = {
  'User' : -1,
  'Opp' : 1
}

@Injectable({
  providedIn: 'root'
})
export class OpponentAiMoveService {

  constructor(private globalVars: GlobalGameVariablesService) { }

  opponentSumForCardType(cardType: string) {
    let sum:number = 0;

    for(let oppCard of this.globalVars.opponentCards) {
      if(this.getCardColor(oppCard) == cardType) {
        sum += this.getCardValue(oppCard);
      }
    }

    return sum;
  }

  chooseTromf(opponentAnnouncements:string[]) {
    let cardsStatistics: { [key: string]: number } = {'D':0, 'G':0, 'R':0, 'V':0};
    //face suma pe culori de carti si apoi ordoneaza descrescator
    for(let cardType of ['D', 'G', 'R', 'V']) {
      let sumForCardType:number = this.opponentSumForCardType(cardType);
      cardsStatistics[cardType] = sumForCardType;
    }
    
    // Create items array
    let items:[string, number][]= Object.keys(cardsStatistics).map(key => [key, cardsStatistics[key]]);

    // Sort the array based on the second element
    items.sort(function(first, second) {
      return second[1] - first[1];
    });

    let potentialTromf:string = '';
    //daca nu are anunt deloc => cartea cu suma cea mai mare e tromf
    if(opponentAnnouncements.length == 0) {
      potentialTromf = items[0][0];
    }
    else {
      //daca are anunt pe o culoare si mai are si >=1 carti pe acea culoare => asta e tromful
      for (let [cardType, sumForCardType] of items) {
        if(opponentAnnouncements.includes(cardType) && sumForCardType >= 7) { //7 = 3+4
          potentialTromf = cardType;
          break;
        }
      }
    }
    return potentialTromf;
  }

  getCardValue(card:String) {
    let data = card.split("-")[0];
    if(data === '9') {
        data = '0';
    }
    return parseInt(data);
  }

  getCardColor(card: String) {
    return card.split('-')[1];
  }

  bestMove(downCard: Nullable<String>) {
    let score = 0;
    let bestScore = -10000000;
    let bestMove: String = "";

    //down card null => i will iterate through opp cards, 
    //choose one and call minimax func with it => user turn => isMaximizing = false
    const isMaximizing = downCard === "" ? false : true;

    let allowedOpponentCards;
    if (downCard == null) {
      allowedOpponentCards = this.globalVars.opponentCards; //opp moves first
    } else {
      allowedOpponentCards = this.whatYouCanMove(downCard, this.globalVars.opponentCards);
    }
    //console.log("ALLOWED: ", allowedOpponentCards);

    if (downCard === null) {
        for (let i = 0; i < allowedOpponentCards.length; i++) {
            score = this.minimax(this.globalVars.opponentCards[i], 0, isMaximizing);
            if (score > bestScore) {
                bestScore = score;
                bestMove = allowedOpponentCards[i];
            }
        }
    } else {
        for (let i = 0; i < allowedOpponentCards.length; i++) {
            score = this.minimax(downCard, 0, isMaximizing);
            if (score > bestScore) {
                bestScore = score;
                bestMove = allowedOpponentCards[i];
            }
        }
    }
    return bestMove;
  }

  minimax(downCard: String, depth: number, isMaximizing: boolean) {
    let result = this.checkWinner();
    if ((result !== null) || (depth > 90000000000000000000000000000000000000000000000000000000000000000)) {
        let score = scores[result];
        return score;
    }

    if (isMaximizing) {
        let bestScore = -1000000;
        let allowedOpponentCards = this.whatYouCanMove(downCard, this.globalVars.opponentCards);

        for (let i = 0; i < allowedOpponentCards.length; i++) {
            //set the current move
            let move = allowedOpponentCards[i];
            //remove it from the array of cards
            this.globalVars.opponentCards.splice(this.globalVars.opponentCards.indexOf(move.toString()), 1);
            //calculate the result for the current move
            let [winner, sumWinner] = this.checkRoundWinner(downCard, move, -1);
            this.globalVars.opponentSum = winner === 1 ? this.globalVars.opponentSum + sumWinner : this.globalVars.opponentSum;
            //call function recursively
            let score = this.minimax(move, depth + 1, false);
            //undo the before operations to not alter global vars
            this.globalVars.opponentCards.push(move.toString());
            this.globalVars.opponentSum = winner === 1 ? this.globalVars.opponentSum - sumWinner : this.globalVars.opponentSum;
            if (bestScore < score) {
                bestScore = score;
            }
        }
        return bestScore;
    } else {
        let bestScore = 1000000;
        let allowedUserCards = this.whatYouCanMove(downCard, this.globalVars.yourCards);

        for (let i = 0; i < allowedUserCards.length; i++) {
            //set the current move
            let move = allowedUserCards[i];
            //remove it from the array of cards
            this.globalVars.yourCards.splice(this.globalVars.yourCards.indexOf(move.toString()), 1);
            //calculate the result for the current move
            let [winner, sumWinner] = this.checkRoundWinner(downCard, move, 1);
            this.globalVars.yourSum = winner === -1 ? this.globalVars.yourSum + sumWinner : this.globalVars.yourSum;
            //call function recursively
            let score = this.minimax(move, depth + 1, true);
            //undo the before operations to not alter global vars
            this.globalVars.yourCards.push(move.toString());
            this.globalVars.yourSum = winner === -1 ? this.globalVars.yourSum - sumWinner : this.globalVars.yourSum;
            if (bestScore > score) {
                bestScore = score;
            }
        }
        return bestScore;
    }
  }

  whatYouCanMove(downCard: Nullable<String>, cards: String[]) {
    let newCards:string[] = [];
    if (downCard == null) {
      return cards;
    } 
    else {
      // to match the color
      for (let card of cards) {
        if (this.getCardColor(card) == this.getCardColor(downCard)) { // if the color matches
            newCards.push(card.toString());
        }
      }
      // if no card of that color is present, move anything
      if (newCards.length ===  0) {
        return cards;
      }
      return newCards;
    }
  }

  checkWinner(): string {
    if (this.globalVars.yourSum > this.globalVars.opponentSum) {
      return 'User';
    } else {
      return 'Opp';
    }
  }

  checkRoundWinner(userMove: String, opponentMove: String, firstPlayerInRound: number) {
    let winner = 0;
    let winnerSum = 0;
    let firstPlayerInRoundSum = 0;
    let firstPlayerInRoundCardColor = '';
    let firstPlayerInRoundCardValue : number;
    let secondPlayerInRoundSum = 0;
    let secondPlayerInRoundCardColor = '';
    let secondPlayerInRoundCardValue : number;
    let cardsOfTheFirstPlayerInRound:string[] = [];

    if (firstPlayerInRound === 1) {
      firstPlayerInRoundSum = this.globalVars.opponentSum;
      firstPlayerInRoundCardColor = this.getCardColor(opponentMove);
      firstPlayerInRoundCardValue = this.getCardValue(opponentMove);
      secondPlayerInRoundSum = this.globalVars.yourSum;
      secondPlayerInRoundCardColor = this.getCardColor(userMove);
      secondPlayerInRoundCardValue = this.getCardValue(userMove);
      cardsOfTheFirstPlayerInRound = this.globalVars.opponentCards;
    } else {
      firstPlayerInRoundSum = this.globalVars.yourSum;
      firstPlayerInRoundCardColor = this.getCardColor(userMove);
      firstPlayerInRoundCardValue = this.getCardValue(userMove);
      secondPlayerInRoundSum = this.globalVars.opponentSum;
      secondPlayerInRoundCardColor = this.getCardColor(opponentMove);
      secondPlayerInRoundCardValue = this.getCardValue(opponentMove);
      cardsOfTheFirstPlayerInRound = this.globalVars.yourCards;
    }

    let downCardsSum = firstPlayerInRoundCardValue + secondPlayerInRoundCardValue;

    // check for announcements
    let announcement = this.checkAnnouncement(firstPlayerInRoundCardColor, firstPlayerInRoundCardValue, cardsOfTheFirstPlayerInRound);

    if (firstPlayerInRoundCardColor === secondPlayerInRoundCardColor) {
      if (firstPlayerInRoundCardValue > secondPlayerInRoundCardValue) {
        winnerSum = firstPlayerInRoundSum + downCardsSum;
        winner = firstPlayerInRound;
      } else {
        winnerSum = secondPlayerInRoundSum + downCardsSum;
        winner = -1 * firstPlayerInRound;
      }
    } else { // different colors => if 2nd player did not move tromf, then first player wins
      if (firstPlayerInRoundCardColor === this.globalVars.chosenTromf) { // different colors, first card is tromf => second card != tromf
        winnerSum = firstPlayerInRoundSum + downCardsSum;
        winner = firstPlayerInRound;
      } else if (secondPlayerInRoundCardColor === this.globalVars.chosenTromf) {
        winnerSum = secondPlayerInRoundSum + downCardsSum;
        winner = -1 * firstPlayerInRound;
      } else { // if no tromfs => first one wins the round
        winnerSum = firstPlayerInRoundSum + downCardsSum;
        winner = firstPlayerInRound;
      }
    }

    winnerSum = winnerSum + announcement;

    return [winner, winnerSum];
  }

  checkAnnouncement(movedCardColor: String, movedCardValue: number, cards: String[]) {
    let announcement = 0;
    for (let i = 0; i < cards.length; i++) {
      let card = cards[i];
      if (this.getCardColor(card) == movedCardColor && this.getCardValue(card) != movedCardValue) {
        if (this.getCardValue(card) + movedCardValue == 7) {
          if (movedCardColor == this.globalVars.chosenTromf) {
            announcement = 40;
          } else {
            announcement = 20;
          }
          break;
        }
      }
    }
    return announcement;
  }
  
}
