var timerInterval = 0;

var licitationPopupContainer;
var parentOfLicitationPopUpContainer;

var tromfPopupContainer;
var parentOfTromfPopupContainer;

var canRunTimer = false;

var opacity = 0;
var intervalID = 0;

const delay = ms => new Promise(res => setTimeout(res, ms));

function createOpponentLicitationAlert(string) {
    // Create the alert element
    const alertEl = document.createElement("div");
    alertEl.textContent = string;
    alertEl.style.background = "#A52A2A";
    alertEl.style.position = "fixed";
    alertEl.style.top = "20px";
    alertEl.style.left = "50%";
    alertEl.style.transform = "translateX(-50%)";
    alertEl.style.padding = "10px";
    alertEl.style.borderRadius = "5px";
    alertEl.style.opacity = 0;
    alertEl.style.fontFamily = 'Outfit';
    alertEl.style.zIndex = 999;

    // Add the alert  to the document
    document.body.appendChild(alertEl);

    // Fade in the alert element
    alertEl.animate(
    { opacity: [0, 1] },
    { duration: 1000, fill: "forwards" }
    );

    // Fade out the alert element after 2 seconds
    setTimeout(() => {
    if (alertEl.parentNode) {
        alertEl.animate(
        { opacity: [1, 0] },
        { duration: 1000, fill: "forwards" }
        );
        setTimeout(() => {
        alertEl.remove();
        }, 1000);
    }
    }, 2000);
}

function appendTimerElement() {
    const timerCircle = document.getElementById("timer-container");
    const timerDiv = document.createElement("div");
    timerDiv.className = "timer-container circle";

    document.body.appendChild(timerDiv);

    const timerText = document.createElement("span");
    timerText.style.color = "white";
    timerText.style.fontSize = "2.5em";
    timerText.style.position = "absolute";
    timerText.style.left = "95%";
    timerText.style.top = "55%";
    timerText.style.transform = "translateX(-50%)";

    timerDiv.appendChild(timerText);

    let ss = document.getElementById('ss');
    return ss, timerText;
}

function handleTimer(duration) {
  let timeLeft = duration;
  const timerText = document.getElementById('timer');

  timerText.style.color = "black";
  timerText.style.fontSize = "2.5em";
  timerText.style.position = "absolute";
  timerText.style.left = "30%";
  timerText.style.top = "41.3%";

  return new Promise((resolve) => {
    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.textContent = timeLeft;
      if (timeLeft === 0) {
        clearInterval(timerInterval);
        resolve('Timer ended!');
      }
    }, 1000);
  });
}

function stopTimer() {
  clearInterval(timerInterval);
}


/*
function handleTimer(duration) {
    let timeLeft = duration;
  
    const timerCircle = document.getElementById("timer-container");
    const timerDiv = document.createElement("div");
    timerDiv.className = "timer-container circle";
  
    document.body.appendChild(timerDiv);
  
    const timerText = document.createElement("span");
    timerText.style.color = "black";
    timerText.style.fontSize = "2.5em";
    timerText.style.position = "absolute";
    timerText.style.left = "95.4%";
    timerText.style.top = "41.3%";
    timerText.style.transform = "translateX(-50%)";
  
    timerDiv.appendChild(timerText);
  
    let ss = document.getElementById('ss');

    return new Promise(resolve => {
      timerInterval = setInterval(() => {
        ss.style.strokeDashoffset = 440 - (440 * timeLeft) / 30;
        timerText.textContent = `0:${timeLeft < 10 ? '0' : ''}${timeLeft}`;
  
        console.log("Time left: " + timeLeft);
    
        if (timeLeft < 0) {
          clearInterval(timerInterval);
          //console.log("Timer ended!");
  
          // Check if any card has been moved
          let isCardMoved = false;
          const cardImages = document.querySelectorAll('#your-cards img');
          cardImages.forEach(cardImage => {
            if (cardImage.parentElement.id === 'wrapperDiv') {
              isCardMoved = true;
            }
          });
  
          if (!isCardMoved) {
            setTimeout(() => {
              // Select a random card to move
              const randomIndex = Math.floor(Math.random() * cardImages.length);
              const cardToMove = cardImages[randomIndex];
  
              // Move the card to the wrapper div
              cardToMove.style.position = 'absolute';
              cardToMove.style.top = '50%';
              cardToMove.style.left = '60%';
              cardToMove.style.transform = 'translate(-50%, -60%)';
              cardToMove.style.transition = 'all 0.5s linear';
  
              const wrapperDiv = document.createElement('div');
              wrapperDiv.id = "wrapperDiv";
              wrapperDiv.style.position = 'absolute';
              wrapperDiv.style.top = '50%';
              wrapperDiv.style.left = '60%';
              wrapperDiv.style.transform = 'translate(-50%, -60%)';
              document.body.appendChild(wrapperDiv);
  
              wrapperDiv.appendChild(cardToMove);
              cardToMove.setAttribute('id', 'centeredDownCardUser');
              cardToMove.style.transform = 'translate(-50%, -60%)';
              cardToMove.style.transition = 'all 0.5s linear';
              cardToMove.style.opacity = '1';
            }, 10);
          }
  
          resolve("Timer ended!");
          timerText.textContent = "";
        }
  
        timeLeft--;
        console.log(timeLeft);
      }, 1000);
    })
  }
  */
  
function waitForLicitationEvent(buttonsClassName) {
    return new Promise(resolve => {
      const buttons = document.getElementsByClassName(`${buttonsClassName}`);
      const listener = (event) => {
        for (const button of buttons) {
          button.removeEventListener('click', listener);
        }
        console.log("apasat", event);
        resolve(event);
      };
      for (const button of buttons) {
        button.addEventListener('click', listener);
      }
    });
}

async function handleLicitationPopUp() {
    await delay(4000);
    //unhide popup
    parentOfLicitationPopUpContainer.appendChild(licitationPopupContainer);

    const event = await waitForLicitationEvent("licitation-button");
    const selectedButton = event.target.textContent;

    whatUserLicitated = selectedButton;
    console.log(`Selected button: ${selectedButton}`);
    
    clearLicitationPopUp();
    return selectedButton;
}

function clearLicitationPopUp() {
    licitationPopupContainer = document.querySelector("#licitation-popup-container");
    parentOfLicitationPopUpContainer = licitationPopupContainer.parentNode;
    parentOfLicitationPopUpContainer.removeChild(licitationPopupContainer);
}

async function handleTromfPopUp() {
    await delay(1000);
    //unhide popup
    parentOfLicitationPopUpContainer.appendChild(tromfPopupContainer);
    
    const event = await waitForLicitationEvent("tromf-button");

    const chosenTromf = event.currentTarget.getAttribute('name');
    console.log(`Chosen tromf: ${chosenTromf}`);
    
    clearTromfPopUp();
    canMoveUserCards();
    return chosenTromf;
}

function clearTromfPopUp() {
    tromfPopupContainer = document.querySelector("#tromf-popup-container");
    parentOfTromfPopupContainer = tromfPopupContainer.parentNode;
    parentOfTromfPopupContainer.removeChild(tromfPopupContainer);
}

/*
function moveOpponentCards() {
    //console.log("can move cards");
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
            cardImage.setAttribute('id', 'centeredDownCardOpponent');
        });
    })
}
*/

function moveOpponentCard(card) {
    // Get the image element
    const cardImage = document.querySelector(`#opponent-cards img[alt="${card}"]`);
    //console.log('Moving ' + card);

    // Change the position of the image to the center of the screen ONCE IT IS LOADED
    cardImage.style.position = 'absolute';
    cardImage.style.top = '45%';
    cardImage.style.left = '40%';
    cardImage.style.transform = 'translate(-45%, -40%)';
    cardImage.style.transition = 'all 0.5s linear';
    cardImage.setAttribute('id', 'centeredDownCardOpponent');
    
    //change src to front
    cardImage.src = `./assets/card-faces/${card}.png`;
}


async function canMoveUserCards() {
  //console.log("can move your cards");
 
  const cardImages = document.querySelectorAll('#your-cards img');

  //make the cards scalable on hover
  //simulate this
  /*
  #your-cards img:hover {
  transform: scale(1.1);
  }
  */
  for(let i = 0; i < cardImages.length; i++) {
      const card = cardImages[i];

      card.addEventListener('mouseover', () => {
          card.style.transform = 'scale(1.1)';
        });
        
        card.addEventListener('mouseout', () => {
          card.style.transform = 'none';
        });
  }
}

function moveUserCard(card) {
  //this function gets called when user did not chose a card in time
  // Get the image element
  const cardImage = document.querySelector(`#your-cards img[alt="${card}"]`);
  //console.log('Moving ' + card);
  // Create a wrapper div
  const wrapperDiv = document.createElement('div');
  wrapperDiv.id = "wrapperDiv";
  wrapperDiv.style.position = 'absolute';
  wrapperDiv.style.top = '55%';
  wrapperDiv.style.left = '60%';
  document.body.appendChild(wrapperDiv);

  // Move the image to the wrapper div w
  cardImage.style.position = 'absolute';
  cardImage.style.top = '55%';
  cardImage.style.left = '60%';
  cardImage.style.transform = 'translate(-55%, -60%)';
  cardImage.style.transition = 'all 0.5s linear';
         
  //added a setTimeout function to delay the animation of the wrapperDiv 
  //until after the image has been moved to the wrapper div
  setTimeout(() => {
      wrapperDiv.appendChild(cardImage);
      cardImage.setAttribute('id', 'centeredDownCardUser');
      cardImage.style.transform = 'translate(-55%, -60%)';
      cardImage.style.transition = 'all 0.5s linear';
      cardImage.style.opacity = '1';
      cardImage.style.pointerEvents = "none"; /* Disable click and hover events */
    }, 10);
}

async function fadeOut () {
  //intervalID = setInterval(hide,200);

  let centeredDownCardUser = document.getElementById("centeredDownCardUser");
  let centeredDownCardOpponent = document.getElementById("centeredDownCardOpponent");
  
  centeredDownCardUser.classList.add("fade-out"); // Apply the fade-out class
  centeredDownCardOpponent.classList.add("fade-out"); // Apply the fade-out class

  setTimeout(function() {
    centeredDownCardUser.parentNode.removeChild(centeredDownCardUser); // Remove the element from the DOM after the fade-out effect is complete
    centeredDownCardOpponent.parentNode.removeChild(centeredDownCardOpponent); // Remove the element from the DOM after the fade-out effect is complete
  }, 500); // Wait for 500ms (0.5s) to match the transition duration
}

function hide() {
    //for opponent
    const imgList = document.querySelectorAll('#centeredDownCardOpponent');
    //console.log("img " + imgList);

    imgList.forEach((img) => {
        opacityString = img.style.opacity;
        opacity = Number(opacityString);
        //console.log("opacity " + opacity);
        if(opacity > 0) {
            setTimeout(() => {
            opacity = opacity - 0.1;
            img.style.opacity = opacity;
        }, 3000);
        }
        else {
            clearInterval(intervalID);
            setTimeout(() => {img.style.display = "none";}, 2000);
        }
    });

    //for user
    const imgListUser = document.querySelectorAll('#centeredDownCardUser');
    //console.log("img " + imgListUser);

    imgListUser.forEach((img) => {
        opacityString = img.style.opacity;
        opacity = Number(opacityString);
        //console.log("opacity " + opacity);
        if(opacity > 0) {
            setTimeout(() => {
            opacity = opacity - 0.1;
            img.style.opacity = opacity;
        }, 3000);
        }
        else {
            clearInterval(intervalID);
            setTimeout(() => {img.style.display = "none";}, 2000);
        }
    });
}

function revealCommentToPickCard() {
  // Get a reference to the comment-box element
  const commentBox = document.querySelector('.comment-box');
  commentBox.classList.remove('hidden');

  //console.log("APARE INDICATOR");

  //make card deck clickable
  const cardDeck = document.getElementById('remaining-card-deck');
  cardDeck.style.pointerEvents = ""; /* enable click and hover events */
}

function hideCommentToPickCard() {
  // Get a reference to the comment-box element
  const commentBox = document.querySelector('.comment-box');
  commentBox.classList.add('hidden');

  //console.log("DISPARE INDICATOR");

  //make card deck unclickable
  const cardDeck = document.getElementById('remaining-card-deck');
  cardDeck.style.pointerEvents = 'none'; /* Disable click and hover events */
}

function hideRemainingCardsDeck() {
  const cardDeck = document.getElementById('remaining-card-deck');
  cardDeck.classList.add('hidden');
}

function waitForUserToPickCard() {
  return new Promise((resolve) => {
    const remainingCardDeck = document.getElementById("remaining-card-deck");

    const clickHandler = () => {
      resolve();
      remainingCardDeck.removeEventListener("click", clickHandler);
    };

    remainingCardDeck.addEventListener("click", clickHandler);
  });
}

function updateRoundScoresInHTMLTable(opponentScore, userScore) {
  let currentOpponentPointsElement = document.getElementById("current-opponent-points");
  currentOpponentPointsElement.innerText = opponentScore;

  let currentUserPointsElement = document.getElementById("current-user-points");
  currentUserPointsElement.innerText = userScore;
}

function updateTotalScoresInHTMLTable(opponentScore, userScore) {
  let totalOpponentPointsElement = document.getElementById("total-opponent-points");
  totalOpponentPointsElement.innerText = opponentScore;

  let totalUserPointsElement = document.getElementById("total-user-points");
  totalUserPointsElement.innerText = userScore;
} 

function revealOpponentAnnouncement(announcement) {
  revealAnnouncement('opponent-announcement', announcement);
}

function revealUserAnnouncement(announcement) {
  revealAnnouncement('user-announcement', announcement);
}

function revealAnnouncement(id, announcement) {
  const announcementTag = document.getElementById(id);
  announcementTag.innerText = announcement;
  announcementTag.classList.remove('hidden');
}

function hideAnnouncementTags() {
  let announcementTag = document.getElementById('opponent-announcement');
  announcementTag.classList.add('hidden');

  announcementTag = document.getElementById('user-announcement');
  announcementTag.classList.add('hidden');
}

function showResultPopup(text) {
  console.log("intention to show result");
  let container = document.getElementById("resultContainer");
  container.style.display = "block";
  let containerText = document.getElementById('resultContainerText');
  containerText.innerText = text;
}

//module.exports = {createOpponentLicitationAlert, handleTimer, handleLicitationPopUp, clearPopUp, moveOpponentCards, moveUserCards}