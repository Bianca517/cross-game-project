import { Injectable } from '@angular/core';
import { GlobalGameVariablesService } from './global-game-variables.service';

declare const updateRoundScoresInHTMLTable: any;

@Injectable({
  providedIn: 'root'
})
export class ScoreHandlingServiceService {

  constructor(private globalVars: GlobalGameVariablesService) { }

  getCardValue(card:string) {
    let data = card.split("-")[0];
    if(data === '9') {
        data = '0';
    }
    return parseInt(data);
  }

  getCardColor(card: String) {
    return card.split('-')[1];
  }

  addSumToWinnerOfRound(roundStarter: number, roundWinner: number,  userChosenCard: string, opponentChosenCard: string) {
    let sumOfDownCards: number = this.getCardValue(userChosenCard) + this.getCardValue(opponentChosenCard);
    //check for announcement for the first player in round
    if(roundStarter == 1) {
      this.globalVars.opponentSum += this.checkIfOpponentAnnounced(opponentChosenCard);
    }
    else {
      this.globalVars.yourSum += this.checkIfUserAnnounced(userChosenCard);
    }
    
    //opponent won round
    if(roundWinner == 1) {
      this.globalVars.opponentSum += sumOfDownCards;
    }
    //user won round
    else {
      this.globalVars.yourSum += sumOfDownCards;
    }

    updateRoundScoresInHTMLTable(this.globalVars.opponentSum, this.globalVars.yourSum);
  }

  checkIfOpponentAnnounced(opponentDownCard: string): number {
    //IF != 0 ADD ETICHETA CU ANUNTU
    return this.checkIfPlayerAnnounced(opponentDownCard, this.globalVars.opponentCards);
  }

  checkIfUserAnnounced(userDownCard: string): number {
    return this.checkIfPlayerAnnounced(userDownCard, this.globalVars.yourCards);
  }

  checkIfPlayerAnnounced(downCard: string, listOfCards: string[]): number {
    let card: string;
    for(card of listOfCards) {
      if(this.getCardColor(card) == this.getCardColor(downCard)) {
        if(this.getCardValue(card) + this.getCardValue(downCard) == 7) { //4+3 or 3+4
          if(this.getCardColor(downCard) == this.globalVars.chosenTromf) {
            return 40;
          }
          else {
            return 20;
          }
        }
      }
    }
    return 0;
  }

}
