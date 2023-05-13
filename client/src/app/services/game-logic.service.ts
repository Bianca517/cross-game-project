import { Injectable } from '@angular/core';
import { json } from 'body-parser';

declare const delay:any;
declare const handleLicitationPopUp:any;
declare const handleTromfPopUp:any;
declare const clearLicitationPopUp:any;
declare const clearTromfPopUp:any;
declare const handleTimer:any;
declare const createOpponentLicitationAlert:any;
declare const waitForEvent:any;
declare const stopTimer:any;
declare const moveOpponentCard:any;

let opponentSum:number = 0;
let yourSum:number = 0;

let deck:string[] = []; 

let opponentCards:string[] = [];
let yourCards:string[] = [];
let canRunTimer:boolean = false;

const licitationThresholds: {[key: string]: number} = {
    "Pas" : 0,
    "1" : 33,
    "2" : 66,
    "3" : 99,
    "4" : 132,
    "5" : 165,
    "6" : 198
}

let whatUserLicitated:string;
let chosenTromf:string;
let userTurn:boolean = true;

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
      await delay(1000);
      await this.opponentLicitation();

      //the one who licitated more gets to choose the tromf
      await this.chooseTromf();
      
      //after this, userTurn is set for the first round
      await this.handleGamePlay();
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
        cardImg.alt = currentCard ?? "image"; // use the nullish coalescing operator to provide a default value
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
        cardImg.alt = currentCard ?? "image"; // use the nullish coalescing operator to provide a default value
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

  async opponentLicitation() {
    //presupunem ca ia toate mainile
    let sumWithAnunt = opponentSum;
    let whatOpponentLicitated = 'Pas';
    //console.log("opponent sum without anunt" + sumWithAnunt);
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

    //console.log("opponent sum with anunt" + sumWithAnunt);
    //find the smallest licitation threshold
    for (const [key, value] of Object.entries(licitationThresholds)) {
        if (value < sumWithAnunt) {
            whatOpponentLicitated = key;
        }
        else break;
    }

    createOpponentLicitationAlert(`Opponent licitated ${whatOpponentLicitated}`);
    await delay(1000);

    if(licitationThresholds[whatOpponentLicitated] < licitationThresholds[whatUserLicitated]) {
      userTurn = true;
    }
    else {
      userTurn = false;
    }
    console.log("user turn" + userTurn);
  }

  async chooseTromf() {
    chosenTromf = await handleTromfPopUp();
    console.log("tromf chosed");
  }

  async handleTurns() {
    let cardsId = "";
    this.turnOffOrOnUserTurn(userTurn);

    if(userTurn == true) {
      cardsId = "your-cards";
    }
    else {
      cardsId = "opponent-cards"
    }

    if(userTurn == true) {
      //daca user/opponent a ales o carte sau timer ended => switch turns
      const cardWasChosen = this.waitForCardChosenEvent(cardsId);
      const timerHasExpired = this.startTimer();

      await Promise.race([timerHasExpired, cardWasChosen]);
      
      stopTimer();
      //console.log("Resolved with " + value);
    }
    else {
      await delay(1500);
      this.moveOpponent();
      await delay(1500);
    }

    userTurn = !userTurn;
    //console.log(yourCards);
    console.log("Can switch users turn!");
  }

  async handleGamePlay() {
    let promiseChain = Promise.resolve();

    for (let i = 0; i < 16; i++) {
      promiseChain = promiseChain.then(() => this.handleTurns());
    }

    await promiseChain;
  }

  moveOpponent() {
    this.moveOpponentWhenOpponentFirst();
  }

  moveOpponentWhenOpponentFirst() {
    let randomIndex:number = Math.floor(Math.random() * opponentCards.length);
    moveOpponentCard(opponentCards[randomIndex])
    this.removeSelectedCard(opponentCards[randomIndex], "opponent-cards");
  }

  moveOpponentWhenOpponentSecond() {

  }

  turnOffOrOnUserTurn(isUserTurn:boolean) {
    if(isUserTurn === true) {
        //ungray user cards
        const userCards = document.getElementById('your-cards')?.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
        for(let i = 0; i < userCards.length; i++) {
          const card = userCards[i];
          card.style.opacity = ""; 
          card.style.pointerEvents = ""; /* Disable click and hover events */
        }

        //gray out opponent cards
        const opponentCards = document.getElementById('opponent-cards')?.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
        for(let i = 0; i < opponentCards.length; i++) {
          const card = opponentCards[i];
          card.style.opacity = "0.5"; 
          card.style.pointerEvents = "none"; /* Disable click and hover events */
        }
    }
    else {
        //ungray opponent cards
        const opponentCards = document.getElementById('opponent-cards')?.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
        for(let i = 0; i < opponentCards.length; i++) {
          const card = opponentCards[i];
          card.style.opacity = ""; 
          card.style.pointerEvents = ""; /* Disable click and hover events */
        }

        //gray out user cards
        const userCards = document.getElementById('your-cards')?.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
        for(let i = 0; i < userCards.length; i++) {
          const card = userCards[i];
          card.style.opacity = "0.5"; 
          card.style.pointerEvents = "none"; /* Disable click and hover events */
        }
    }
  }

  async startTimer() {
    console.log("Start timer!");
    const timerContainer = document.getElementById("timer-container");
    if (timerContainer !== null) {
      timerContainer.style.display = "flex";
    }
    return handleTimer(3);
  }

  async waitForCardChosenEvent(idCards:string) {
    return new Promise(resolve => {
      const cards =  document.getElementById(`${idCards}`)?.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
      
      const listener = (event:MouseEvent) => {
        for (let i:number = 0; i < cards.length; i++) {
          const card = cards[i];
          card.removeEventListener('click', listener);
        }
        const clickedCard = event.target as HTMLImageElement;
        const cardName = clickedCard.src.split("/").pop()!;
        console.log(cardName + " was clicked!");

        //remove the selected card from user's/opponent's hand
        this.removeSelectedCard(cardName, idCards);
        resolve(cardName);
      };

      for (let i:number = 0; i < cards.length; i++) {
        const card = cards[i];
        card.addEventListener('click', listener);
      }
    });
  }

  removeSelectedCard(card:string, cardsId:string) {
    card = card.split('.')[0];
    if(cardsId === 'your-cards') {
      const index = yourCards.indexOf(card, 0);
      if (index > -1) {
        yourCards.splice(index, 1);
      }
    }
    else {
      const index = opponentCards.indexOf(card, 0);
      if (index > -1) {
        opponentCards.splice(index, 1);
      }
    }
  }

}
