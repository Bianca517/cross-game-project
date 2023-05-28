import { Injectable } from '@angular/core';
import { json } from 'body-parser';
import { GlobalGameVariablesService } from './global-game-variables.service';
import { OpponentAiMoveService } from './opponent-ai-move.service';
import { ScoreHandlingServiceService } from './score-handling-service.service';

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
declare const moveUserCard: any;
declare const revealCommentToPickCard: any;
declare const hideCommentToPickCard: any;
declare const waitForUserToPickCard: any;
declare const hideRemainingCardsDeck: any;
declare const hideAnnouncementTags: any;

let canRunTimer:boolean = false;
let userTurn:boolean = true;
let opponentPotentialTromf: string;

@Injectable({
  providedIn: 'root'
})
export class GameLogicService {

  constructor(private globalVars: GlobalGameVariablesService, 
    private AI: OpponentAiMoveService, 
    private ScoreHandlingService: ScoreHandlingServiceService
    ) { }
  
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

      this.handleEndOfGame();
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

  addCardForPlayer(playerCards:string[]) {
    let cardsId:string;
    if(playerCards === this.globalVars.opponentCards) {
      cardsId = 'opponent-cards';
    } else {
      cardsId = 'your-cards';
    }

    let currentCard = this.globalVars.deck.pop();

    if(currentCard) {
      playerCards.push(currentCard);
    }
    
    //display all starting cards
    //create image tag
    let cardImg = document.createElement("img");
    //cardImg.src = "./assets/card-faces/back.jpg";
    cardImg.src = "./assets/card-faces/" + currentCard + ".png";
    cardImg.alt = currentCard ?? "image"; // use the nullish coalescing operator to provide a default value
    document.getElementById(cardsId)?.append(cardImg);

    if(playerCards === this.globalVars.opponentCards) {
      //flip
      cardImg.style.transform = "rotateY(180deg)";
      this.globalVars.opponentCards = playerCards;
      //console.log("opp cards ", this.globalVars.opponentCards);
    }
    else {
      this.globalVars.yourCards = playerCards;
      //console.log("user cards ", this.globalVars.yourCards);
    }
  }

  dealCards() {
    //fiecare jucator va primi cate 8 carti
    for(let i = 0; i < 8; i++) {
      this.addCardForPlayer(this.globalVars.yourCards);
      this.addCardForPlayer(this.globalVars.opponentCards);
    }

    //console.log(opponentCards);
    //console.log(yourCards);
    //this.globalVars.yourSum = this.calculateSumUser();
    this.globalVars.opponentSum = this.calculateSumOpponent();

    //console.log("cate au mai ramas", this.globalVars.deck.length);
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
    this.globalVars.userLicitation = await handleLicitationPopUp();

    console.log("user licitation finished");
  }

  async opponentLicitation() {
    //presupunem ca ia toate mainile
    let sumWithAnunt = this.globalVars.opponentSum;
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
    for (const [key, value] of Object.entries(this.globalVars.licitationThresholds)) {
        if (value < sumWithAnunt) {
            this.globalVars.opponentLicitation = key;
        }
        else break;
    }

    createOpponentLicitationAlert(`Opponent licitated ${this.globalVars.opponentLicitation}`);
    await delay(1600);

    //reset opponent's sum
    this.globalVars.opponentSum = 0;

    if(this.globalVars.licitationThresholds[this.globalVars.opponentLicitation] < this.globalVars.licitationThresholds[this.globalVars.userLicitation]) {
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
  }

  async opponentTurnMove(userMoveOrNull: Nullable<String>) {
    await delay(1500);
    
    let opponentMove = this.AI.bestMove(userMoveOrNull);
    this.removeSelectedCard(opponentMove.toString(), 'opponent-cards')
    moveOpponentCard(opponentMove); //frontend handler -> move card down
    console.log("Opponent moved ", opponentMove);
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
    
    //console.log("Resolved with " + resolvedEvent);
    if (resolvedEvent == "Timer ended!") { //if user did not choose a card in the given time, a random card will be thrown on his behalf
      const userAllowedCards: String[] = this.AI.whatYouCanMove(downCardByOpponent, this.globalVars.yourCards);
      userChosenCard = userAllowedCards[Math.floor(Math.random() * userAllowedCards.length)];
      await moveUserCard(userChosenCard);
    }
    else {
      userChosenCard = resolvedEvent.toString();
      await moveUserCard(userChosenCard);
    }

    this.removeSelectedCard(userChosenCard.toString(), 'your-cards');
    console.log("user moved ", userChosenCard);
    return Promise.resolve(userChosenCard);
  }

  async handleRound() {
    let userChosenCard: String = "";
    let opponentChosenCard: String = "";

    //hide any announcement tags from last round
    hideAnnouncementTags();

    console.log("in handle round");
    console.log("USER TURN ", userTurn);
    if(userTurn == true) {
      //let user move
      this.turnOffOrOnUserTurn(userTurn);
      userChosenCard = await this.userTurnMove(null);
      
      userTurn = !userTurn;
      console.log("USER TURN ", userTurn);
      //let opponent move
      this.turnOffOrOnUserTurn(userTurn);
      opponentChosenCard = await this.opponentTurnMove(userChosenCard);
    }
    else {
      //let opponent move
      this.turnOffOrOnUserTurn(userTurn);
      opponentChosenCard = await this.opponentTurnMove(null);
      
      userTurn = !userTurn;
      console.log("USER TURN ", userTurn);
      //let user move
      this.turnOffOrOnUserTurn(userTurn);
      userChosenCard = await this.userTurnMove(opponentChosenCard);
    }

    return Promise.resolve([userChosenCard, opponentChosenCard]);
  }

  async handleGamePlay() {
    let promiseChain = Promise.resolve();
    const numberOfTotalRounds = 12;

    for(let i : number = 0; i < numberOfTotalRounds; i++) {
      promiseChain = promiseChain.then(async () => {
        let firstPlayerInRound = (userTurn == false) ? 1 : -1; 
        const [userChosenCard, opponentChosenCard] = await this.handleRound();
        const firstPlayerInNextRound = this.AI.checkRoundWinner(userChosenCard, opponentChosenCard, firstPlayerInRound)[0];
        //update the scores
        this.ScoreHandlingService.addSumToWinnerOfRound(firstPlayerInRound, firstPlayerInNextRound, userChosenCard.toString(), opponentChosenCard.toString());
        console.log("USER SUM: ", this.globalVars.yourSum);
        console.log("OPP SUM: ", this.globalVars.opponentSum);
        //who starts next round
        userTurn = (firstPlayerInNextRound == 1) ? false : true;
        
        //daca au mai ramas carti jos, roundWinner ia primul una si dupa urmatorul
        if(this.globalVars.deck.length > 0) {
          await this.pickCardsFromRemainingDeck(userTurn);
        }
        if(this.globalVars.deck.length == 0) {
          hideRemainingCardsDeck();
        }

        await delay(1000);
        await fadeOut(); //2 cards down => disappear
      });
    }

    await promiseChain;
  }

  async pickCardsFromRemainingDeck(userTurn: boolean) {
    if(true == userTurn) {
      //ia user
      //reveal the comment to pick a card
      revealCommentToPickCard();
      //wait for the user to click on the deck and hide again the comment
      await waitForUserToPickCard();
      hideCommentToPickCard();
      
      this.addCardForPlayer(this.globalVars.yourCards);
      //ia opponent
      this.addCardForPlayer(this.globalVars.opponentCards);

    }
    else {
      //ia opponent
      this.addCardForPlayer(this.globalVars.opponentCards);
      //ia user
      //reveal the comment to pick a card
      revealCommentToPickCard();
      //wait for the user to click on the deck and hide again the comment
      await waitForUserToPickCard();
      hideCommentToPickCard();
      this.addCardForPlayer(this.globalVars.yourCards);
    }
  }

  handleEndOfGame() {
    console.log("Game ended!");
    this.ScoreHandlingService.checkScoresAgainstLicitation();
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
    return handleTimer(100);
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
        //console.log(cardName + " was clicked!");
        cardName = cardName.split('.')[0];
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
