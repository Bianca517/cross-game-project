/******************* GLOBALS *******************/

var opponentSum = 0;
var yourSum = 0;

var deck = []; 

var opponentCards = [];
var yourCards = [];

var licitationThresholds = {
    "Pas" : 0,
    "1" : 33,
    "2" : 66,
    "3" : 99,
    "4" : 132,
    "5" : 165,
    "6" : 198
}
var whatUserLicitated;

var tromf;

var userTurn = false;

/******************* END - GLOBALS *******************/

/******************* FUNCTIONS *******************/

function startGame() {
    console.log("start game");
    buildDeck();
    shuffleDeck();
    dealCards();

    //user licitation
    handleLicitationPopUp();
    clearPopUp();

    //opponent licitation
    opponentLicitation();
}

function buildDeck() {
    const values = ['2', '3', '4', '9', '10', '11'];
    const types = ['R', 'D', 'V', 'G'];

    for(let i = 0; i < types.length; i++) {
        for(let j = 0; j < values.length; j++) {
            deck.push(values[j] + '-' + types[i]);
        }
    }
    //console.log(deck);
}

function shuffleDeck() {
    for(let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 24
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    //console.log(deck);
}

function dealCards() {
    //fiecare jucator va primi cate 8 carti
    for(let i = 0; i < 8; i++) {
        let currentCard = deck.pop();
        opponentCards.push(currentCard);
        //display all starting cards
        //create image tag
        let cardImg = document.createElement("img");
        cardImg.src = "./assets/card-faces/" + currentCard + ".png";
        document.getElementById("opponent-cards").append(cardImg);
    }

    for(let i = 0; i < 8; i++) {
        let currentCard = deck.pop();
        yourCards.push(currentCard);
        //display all starting cards
        //create image tag
        let cardImg = document.createElement("img");
        cardImg.src = "./assets/card-faces/" + currentCard + ".png";
        document.getElementById("your-cards").append(cardImg);
    }
   
    //console.log(opponentCards);
    //console.log(yourCards);
    yourSum = calculateSumUser();
    opponentSum = calculateSumOpponent();
}

function getValue(card) {
    let data = card.split("-")[0];
    if(data === '9') {
        data = '0';
    }
    return parseInt(data);
}

function calculateSumUser() {
    let sum = 0;
    for(let i = 0; i < 8; i++) {
        sum += getValue(yourCards[i]);
    }
    console.log("user score" + sum);
    return sum;
}

function calculateSumOpponent() {
    let sum = 0;
    for(let i = 0; i < 8; i++) {
        sum += getValue(opponentCards[i]);
    }
    console.log("opponent score" + sum);
    return sum;
}

function opponentLicitation() {
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
        turnOffOrOnUserTurn("ON");
    }
    else {
        turnOffOrOnUserTurn("OFF");
    }
}

function turnOffOrOnUserTurn(string) {
    if(string === "ON") {
        userTurn = true;
        //gray out opponent cards
        const opponentCards = document.querySelectorAll('#opponent-cards img');
        opponentCards.forEach( card => {
            card.style.opacity = 0.5; 
            card.style.pointerEvents = "none"; /* Disable click and hover events */
        })
    }
    else {
        userTurn = false;
        //gray out user cards
        const userCards = document.querySelectorAll('#your-cards img');
        userCards.forEach( card => {
            card.style.opacity = 0.5; 
            card.style.pointerEvents = "none"; /* Disable click and hover events */
        })
    }
}

function startTimer() {
    if(canRunTimer == true) {
        handleTimer(5, document.body);
    }
}

function canChooseCard() {
    return userTurn;
}
