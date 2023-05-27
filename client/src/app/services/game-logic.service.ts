import { Injectable } from '@angular/core';
import { json } from 'body-parser';
import { GlobalGameVariablesService } from './global-game-variables.service';
import { OpponentAiMoveService } from './opponent-ai-move.service';

type Nullable<T> = T | null;

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
declare const fadeOut: any;

let canRunTimer:boolean = false;
let whatUserLicitated:string;
let userTurn:boolean = true;
let opponentPotentialTromf: string;

const licitationThresholds: {[key: string]: number} = {
    "Pas" : 0,
    "1" : 33,
    "2" : 66,
    "3" : 99,
    "4" : 132,
    "5" : 165,
    "6" : 198
}

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {

  constructor(private globalVars: GlobalGameVariablesService, private AI: OpponentAiMoveService) { }
  
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
            this.globalVars.deck.push(values[j] + '-' + types[i]);
        }
    }
    //console.log(deck);
  }

  shuffleDeck() {
    for(let i = 0; i < this.globalVars.deck.length; i++) {
        let j = Math.floor(Math.random() * this.globalVars.deck.length); // (0-1) * 24
        let temp = this.globalVars.deck[i];
        this.globalVars.deck[i] = this.globalVars.deck[j];
        this.globalVars.deck[j] = temp;
    }
    //console.log(deck);
  }

  dealCards() {
    //fiecare jucator va primi cate 8 carti
    for(let i = 0; i < 8; i++) {
        let currentCard = this.globalVars.deck.pop();

        if(currentCard) {
          this.globalVars.opponentCards.push(currentCard);
        }
        
        //display all starting cards
        //create image tag
        let cardImg = document.createElement("img");
        //cardImg.src = "./assets/card-faces/back.jpg";
        cardImg.src = "./assets/card-faces/" + currentCard + ".png";
        cardImg.alt = currentCard ?? "image"; // use the nullish coalescing operator to provide a default value
        document.getElementById("opponent-cards")?.append(cardImg);

        //flip
        cardImg.style.transform = "rotateY(180deg)";
    }

    for(let i = 0; i < 8; i++) {
        let currentCard = this.globalVars.deck.pop();

        if(currentCard) {
          this.globalVars.yourCards.push(currentCard);
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
    this.globalVars.yourSum = this.calculateSumUser();
    this.globalVars.opponentSum = this.calculateSumOpponent();
  }

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

  calculateSumUser() {
    let sum = 0;
    for(let i = 0; i < 8; i++) {
        sum += this.getCardValue(this.globalVars.yourCards[i]);
    }
    console.log("user score" + sum);
    return sum;
  }

  calculateSumOpponent() {
    let sum = 0;
    for(let i = 0; i < 8; i++) {
        sum += this.getCardValue(this.globalVars.opponentCards[i]);
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
    let sumWithAnunt = this.globalVars.opponentSum;
    let whatOpponentLicitated = 'Pas';
    let opponentAnnouncements:string[] = [];
    //console.log("opponent sum without anunt" + sumWithAnunt);

    console.log(this.globalVars.opponentCards);
    //search for anunt
    for (let cardType of ['D', 'G', 'R', 'V']) {
      let treiar = "3-" + cardType;
      let patrar = "4-" + cardType;

      if((this.globalVars.opponentCards.includes(treiar)) && (this.globalVars.opponentCards.includes(patrar))) {
        //THIS LOGIC MUST BE ENHANCED!!!!
        opponentAnnouncements.push(cardType);
        if(this.globalVars.chosenTromf == cardType) {
          sumWithAnunt += 40;
        }
        else {
          sumWithAnunt += 20;
        }
      } 
    }

    console.log("opponent sum with anunt" + sumWithAnunt);

    opponentPotentialTromf = this.AI.chooseTromf(opponentAnnouncements);
    //find the smallest licitation threshold
    for (const [key, value] of Object.entries(licitationThresholds)) {
        if (value < sumWithAnunt) {
            whatOpponentLicitated = key;
        }
        else break;
    }

    createOpponentLicitationAlert(`Opponent licitated ${whatOpponentLicitated}`);
    await delay(1600);

    if(licitationThresholds[whatOpponentLicitated] < licitationThresholds[whatUserLicitated]) {
      userTurn = true;
    }
    else {
      userTurn = false;
    }
    console.log("user turn" + userTurn);
  }

  async chooseTromf() {
    if(true == userTurn) {
      this.globalVars.chosenTromf = await handleTromfPopUp();
    }
    else {
      createOpponentLicitationAlert(`Opponent chose tromf ${opponentPotentialTromf}`);
      await delay(1500);
    }
    
    console.log("tromf chosed");
  }

  async opponentTurnMove(userMoveOrNull: Nullable<String>) {
    await delay(1500);
    
    console.log("calling best move");
    let opponentMove = this.AI.bestMove(userMoveOrNull);
    console.log("end best move");
    this.removeSelectedCard(opponentMove.toString(), 'opponent-cards')
    console.log("Opponend moved: ", opponentMove);
    //console.log("new opp cards: ", this.globalVars.opponentCards);
    await delay(1500);
    return opponentMove;
  }

  async userTurnMove(downCardByOpponent: Nullable<String>): Promise<String> {
    let userChosenCard: String;
    //if user chose a card or the timer ended => switch turns
    const userChoseCard = this.waitForCardChosenEvent('your-cards');
    const timerHasExpired = this.startTimer();
    const resolvedEvent = await Promise.race([timerHasExpired, userChoseCard]);
    stopTimer();
    
    console.log("Resolved with " + resolvedEvent);
    if (resolvedEvent == "Timer ended!") { //if user did not choose a card in the given time, a random card will be thrown on his behalf
      console.log("da random");
      const userAllowedCards: String[] = this.AI.whatYouCanMove(downCardByOpponent, this.globalVars.yourCards);
      console.log("ce are voie sa dea user", userAllowedCards);
      userChosenCard = userAllowedCards[Math.floor(Math.random() * userAllowedCards.length)];
      console.log("ce o dat user random", userChosenCard);
    }
    else {
      userChosenCard = resolvedEvent.toString();
    }

    this.removeSelectedCard(userChosenCard.toString(), 'your-cards');
    console.log(this.globalVars.yourCards);
    return Promise.resolve(userChosenCard);
  }

  async handleRound() {
    let userChosenCard: String = "";
    let opponentChosenCard: String = "";

    console.log("in handle round");
    if(userTurn == true) {
      //let user move
      this.turnOffOrOnUserTurn(userTurn);
      userChosenCard = await this.userTurnMove(null);
      
      //let opponent move
      this.turnOffOrOnUserTurn(!userTurn);
      opponentChosenCard = await this.opponentTurnMove(userChosenCard);
    }
    else {
      //let opponent move
      this.turnOffOrOnUserTurn(userTurn);
      opponentChosenCard = await this.opponentTurnMove(null);

      //let user move
      this.turnOffOrOnUserTurn(!userTurn);
      userChosenCard = await this.userTurnMove(opponentChosenCard);
    }

    return Promise.resolve([userChosenCard, opponentChosenCard]);
  }

  async handleGamePlay() {
    let promiseChain = Promise.resolve();

    for(let i : number = 0; i < this.globalVars.yourCards.length; i++) {
      promiseChain = promiseChain.then(async () => {
        console.log("USER TURN ", userTurn);
        let firstPlayerInRound = (userTurn == false) ? 1 : -1; 
        const [userChosenCard, opponentChosenCard] = await this.handleRound();
        const firstPlayerInNextRound = this.AI.checkRoundWinner(userChosenCard, opponentChosenCard, firstPlayerInRound)[0];
        userTurn = (firstPlayerInNextRound == 1) ? false : true;
        await fadeOut(); //2 cards down => disappear
      });
    }

    await promiseChain;
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
    return new Promise((resolve, reject) => {
      const cards =  document.getElementById(`${idCards}`)?.getElementsByTagName('img') as HTMLCollectionOf<HTMLElement>;
      
      const listener = (event:MouseEvent) => {
        for (let i:number = 0; i < cards.length; i++) {
          const card = cards[i];
          card.removeEventListener('click', listener);
        }
        const clickedCard = event.target as HTMLImageElement;
        let cardName = clickedCard.src.split("/").pop()!;
        console.log(cardName + " was clicked!");
        cardName = cardName.split('.')[0];
        //remove the selected card from user's/opponent's hand
        this.removeSelectedCard(cardName, idCards);
        resolve(cardName);
      };

      for (let i:number = 0; i < cards.length; i++) {
        const card = cards[i];
        card.addEventListener('click', listener);
      }

      setTimeout(() => {
        reject("Timeout");
      }, 5000); // reject after 5 seconds if the promise hasn't resolved yet
    });
  }

  removeSelectedCard(card:string, cardsId:string) {
    card = card.split('.')[0];
    if(cardsId === 'your-cards') {
      const index = this.globalVars.yourCards.indexOf(card, 0);
      if (index > -1) {
        this.globalVars.yourCards.splice(index, 1);
      }
    }
    else {
      const index = this.globalVars.opponentCards.indexOf(card, 0);
      if (index > -1) {
        this.globalVars.opponentCards.splice(index, 1);
      }
    }
  }

}
