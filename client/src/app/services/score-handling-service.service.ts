import { Injectable } from '@angular/core';
import { GlobalGameVariablesService } from './global-game-variables.service';
import { last } from 'rxjs';

declare const updateRoundScoresInHTMLTable: any;
declare const revealOpponentAnnouncement: any;
declare const revealUserAnnouncement: any;
declare const updateTotalScoresInHTMLTable: any;

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
      let opponentAnnouncement = this.checkIfOpponentAnnounced(opponentChosenCard);
      if(0 != opponentAnnouncement) {
        this.globalVars.opponentSum += opponentAnnouncement;
        revealOpponentAnnouncement("+" + opponentAnnouncement.toString());
      }
    }
    else {
      let userAnnouncement = this.checkIfUserAnnounced(userChosenCard);
      if(0 != userAnnouncement) {
        this.globalVars.yourSum += userAnnouncement;
        revealUserAnnouncement("+" + userAnnouncement.toString());
      }
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

  checkScoresAgainstLicitation() {
    let opponentResult = this.checkScoresAgainstLicitationForEachPlayer(this.globalVars.opponentSum, this.globalVars.opponentLicitation);
    let userResult = this.checkScoresAgainstLicitationForEachPlayer(this.globalVars.yourSum, this.globalVars.userLicitation);
    this.globalVars.totalOpponentPoints += opponentResult;
    this.globalVars.totalUserPoints += userResult;
    updateTotalScoresInHTMLTable(this.globalVars.totalOpponentPoints, this.globalVars.totalUserPoints);
  }

  checkScoresAgainstLicitationForEachPlayer(playerSum: number, whatPlayerLicitated: string) {
    let roundVerdict: number = 0;
    //get player's threshold sum
    let thresholdSum = this.globalVars.licitationThresholds[whatPlayerLicitated];
    //if player did not fulfill licitation
    if( thresholdSum > playerSum) {
      roundVerdict = -1 * Number(whatPlayerLicitated)
    }
    else {
      let lastSmallerValue: [string, number] = ['Pas', 0];
      //find the greatest threshold lower than player sum
      for (const [key, value] of Object.entries(this.globalVars.licitationThresholds)) {
        if (value < playerSum) {
          lastSmallerValue = [key, value];
        }
        else {
          break;
        }
      }

      if(lastSmallerValue[0] == 'Pas') {
        roundVerdict = 0;
      }
      else {
        roundVerdict = Number(lastSmallerValue[0]);
      }
    }
    return roundVerdict;
  }

}
