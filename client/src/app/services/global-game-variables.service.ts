import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalGameVariablesService {
  opponentSum:number = 0;
  yourSum:number = 0;
  deck:string[] = []; 
  opponentCards:string[] = [];
  yourCards:string[] = [];
  chosenTromf:string = "";
  userLicitation:string = 'Pas';
  opponentLicitation:string = 'Pas';
  totalOpponentPoints:number = 0;
  totalUserPoints:number = 0;
  firstRoundPassed: boolean = false;
  licitationThresholds: {[key: string]: number} = {
    "Pas" : 0,
    "1" : 33,
    "2" : 66,
    "3" : 99,
    "4" : 132,
    "5" : 165,
    "6" : 198
}
}
