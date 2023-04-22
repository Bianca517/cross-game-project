var opponentSum = 0;
var yourSum = 0;

var deck = []; 

var opponentCards = [];
var yourCards = [];

var timerInterval = 0;

var userTurn = false;

var popupContainer;
var parentOfPopUpContainer;

var canRunTimer = false;

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

function startGame() {
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
}

function getValue(card) {
    let data = card.split("-");
    return parseInt(data);
}

function handleTimer(duration, display) {
    var timer = duration, minutes, seconds;
  
    const timerDiv = document.createElement("div");
    timerDiv.className = "timer-container circle";
  
    display.appendChild(timerDiv);
    document.getElementById("timer-container").style.display = "flex";
  
    const timerText = document.createElement("span");
    timerText.textContent = "start";
  
    timerDiv.appendChild(timerText);
  
    let ss = document.getElementById('ss');
  
    const timerInterval = setInterval(function () {
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);
  
      ss.style.strokeDashoffset = 440- (440*seconds)/30;
  
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
  
      timerText.textContent = seconds;
  
      if (--timer < 0) {
        clearInterval(timerInterval);
        userTurn = !userTurn;
        console.log("User turn: " + userTurn);
        console.log("Timer ended!");
        startTimer();
      }
    }, 1000);
  }
  
function startTimer() {
    if(canRunTimer == true) {
        handleTimer(5, document.body);
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

async function handleLicitationPopUp() {
    await delay(4000);
    //unhide popup
    parentOfPopUpContainer.appendChild(popupContainer);
    
    const licitationButtons = document.getElementsByClassName("licitation-button");

    [].forEach.call(licitationButtons, function(button) {
        button.addEventListener("click", 
        function(event) {
            const selectedButton = event.target.textContent;
            console.log(`Selected button: ${selectedButton}`);
          
            clearPopUp();
            canRunTimer = true;
            moveOpponentCards();
            moveUserCards();
        })
    })
}

function clearPopUp() {
    popupContainer = document.querySelector("#popup-container");
    parentOfPopUpContainer = popupContainer.parentNode;
    parentOfPopUpContainer.removeChild(popupContainer);
}

function canChooseCard() {
    return userTurn;
}

function moveOpponentCards() {
    console.log("can move cards");
    // Get the image element
    const cardImages = document.querySelectorAll('#opponent-cards img');

    cardImages.forEach(cardImage => {
        // Add a click event listener to the image
        cardImage.addEventListener('click', () => {
            // Change the position of the image to the center of the screen
            cardImage.style.position = 'absolute';
            cardImage.style.top = '45%';
            cardImage.style.left = '40%';
            cardImage.style.transform = 'translate(-45%, -40%)';
            // Add an ID to the image to apply the centered style
            //cardImage.setAttribute('id', 'centeredDownCardOpponent');
        });
    })
}

function moveUserCards() {
    console.log("can move your cards");
   
    const cardImages = document.querySelectorAll('#your-cards img');

    // Create a wrapper div
    const wrapperDiv = document.createElement('div');
    wrapperDiv.id = "wrapperDiv";
    wrapperDiv.style.position = 'absolute';
    wrapperDiv.style.top = '50%';
    wrapperDiv.style.left = '60%';
    wrapperDiv.style.transform = 'translate(-50%, -60%)';
    document.body.appendChild(wrapperDiv);

    // Move the images to the wrapper div when they are clicked
    cardImages.forEach(img => {
        img.addEventListener('click', () => {
            img.style.position = 'absolute';
            img.style.top = '50%';
            img.style.left = '60%';
            img.style.transform = 'translate(-50%, -60%)';
            img.style.transition = 'all 0.5s linear';
            
            //added a setTimeout function to delay the animation of the wrapperDiv 
            //until after the image has been moved to the wrapper div
            setTimeout(() => {
                wrapperDiv.appendChild(img);
                img.style.transform = 'translate(-50%, -60%)';
                img.style.transition = 'all 0.5s linear';
              }, 10);
        });
    });
}