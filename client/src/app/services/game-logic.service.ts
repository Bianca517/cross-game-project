import { Injectable } from '@angular/core';

declare const handleLicitationPopUp:any;
declare const clearPopUp:any;
declare const handleTimer:any;
declare const createOpponentLicitationAlert:any;
declare const waitForEvent:any;

var opponentSum:number = 0;
var yourSum:number = 0;

var deck:string[] = []; 

var opponentCards:string[] = [];
var yourCards:string[] = [];
var canRunTimer:boolean = false;

const licitationThresholds: {[key: string]: number} = {
    "Pas" : 0,
    "1" : 33,
    "2" : 66,
    "3" : 99,
    "4" : 132,
    "5" : 165,
    "6" : 198
}

var whatUserLicitated:string;
var tromf:string;
var userTurn:boolean = false;

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {

  constructor() { }
  
  async startGame() {
      console.log("start game");
      this.buildDeck();
      this.shuffleDeck();
      this.dealCards();

      //user licitation
      await this.userLicitation();

      //opponent licitation
      setTimeout(() => this.opponentLicitation(), 1000);
  }

  buildDeck() {
    const values = ['2', '3', '4', '9', '10', '11'];
    const types = ['R', 'D', 'V', 'G'];

    for(let i = 0; i < types.length; i++) {
        for(let j = 0; j < values.length; j++) {
            deck.push(values[j] + '-' + types[i]);
        }
    }
    //console.log(deck);
  }

  shuffleDeck() {
    for(let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 24
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    //console.log(deck);
  }

  dealCards() {
    //fiecare jucator va primi cate 8 carti
    for(let i = 0; i < 8; i++) {
        let currentCard = deck.pop();

        if(currentCard) {
          opponentCards.push(currentCard);
        }
        
        //display all starting cards
        //create image tag
        let cardImg = document.createElement("img");
        cardImg.src = "./assets/card-faces/" + currentCard + ".png";
        document.getElementById("opponent-cards")?.append(cardImg);
    }

    for(let i = 0; i < 8; i++) {
        let currentCard = deck.pop();

        if(currentCard) {
          yourCards.push(currentCard);
        }

        //display all starting cards
        //create image tag
        let cardImg = document.createElement("img");
        cardImg.src = "./assets/card-faces/" + currentCard + ".png";
        document.getElementById("your-cards")?.append(cardImg);
    }
 
    //console.log(opponentCards);
    //console.log(yourCards);
    yourSum = this.calculateSumUser();
    opponentSum = this.calculateSumOpponent();
  }

  getValue(card:string) {
    let data = card.split("-")[0];
    if(data === '9') {
        data = '0';
    }
    return parseInt(data);
  }

  calculateSumUser() {
    let sum = 0;
    for(let i = 0; i < 8; i++) {
        sum += this.getValue(yourCards[i]);
    }
    console.log("user score" + sum);
    return sum;
  }

  calculateSumOpponent() {
    let sum = 0;
    for(let i = 0; i < 8; i++) {
        sum += this.getValue(opponentCards[i]);
    }
    console.log("opponent score" + sum);
    return sum;
  }

  async userLicitation() {
    whatUserLicitated = await handleLicitationPopUp();

    console.log("user licitation finished");
  }

  opponentLicitation() {
    //presupunem ca ia toate mainile
    let sumWithAnunt = opponentSum;
    let whatOpponentLicitated = 'Pas';
    console.log("opponent sum without anunt" + sumWithAnunt);
    //search for anunt
    if("3-D" in opponentCards && "4-D" in opponentCards) {
        sumWithAnunt += 20;
    }
    if("3-G" in opponentCards && "4-G" in opponentCards) {
        sumWithAnunt += 20;
    }
    if("3-R" in opponentCards && "4-D" in opponentCards) {
        sumWithAnunt += 20;
    }
    if("3-V" in opponentCards && "4-D" in opponentCards) {
        sumWithAnunt += 20;
    }

    console.log("opponent sum with anunt" + sumWithAnunt);
    //find the smallest licitation threshold
    for (const [key, value] of Object.entries(licitationThresholds)) {
        if (value < sumWithAnunt) {
            whatOpponentLicitated = key;
        }
        else break;
    }
    createOpponentLicitationAlert(`Opponent licitated ${whatOpponentLicitated}`);

    if(licitationThresholds[whatOpponentLicitated] < licitationThresholds[whatUserLicitated]) {
        this.turnOffOrOnUserTurn("ON");
    }
    else {
        this.turnOffOrOnUserTurn("OFF");
    }
  }

  turnOffOrOnUserTurn(command:string) {
    if(command === "ON") {
        userTurn = true;
        //gray out opponent cards
        const opponentCards = document.getElementById('opponent-cards')?.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
        for(let i = 0; i < opponentCards.length; i++) {
          const card = opponentCards[i];
          card.style.opacity = "0.5"; 
          card.style.pointerEvents = "none"; /* Disable click and hover events */
        }
    }
    else {
        userTurn = false;
        //gray out user cards
        const userCards = document.getElementById('your-cards')?.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
        for(let i = 0; i < userCards.length; i++) {
          const card = userCards[i];
          card.style.opacity = "0.5"; 
          card.style.pointerEvents = "none"; /* Disable click and hover events */
        }
    }
  }

  startTimer() {
    if(canRunTimer == true) {
        handleTimer(5, document.body);
    }
  }

  canChooseCard() {
    return userTurn;
  }

}
