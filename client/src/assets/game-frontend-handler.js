var timerInterval = 0;

var popupContainer;
var parentOfPopUpContainer;

var canRunTimer = false;

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
  
const delay = ms => new Promise(res => setTimeout(res, ms));

function waitForLicitationEvent() {
    return new Promise(resolve => {
      const licitationButtons = document.getElementsByClassName('licitation-button');
      const listener = (event) => {
        for (const button of licitationButtons) {
          button.removeEventListener('click', listener);
        }
        resolve(event);
      };
      for (const button of licitationButtons) {
        button.addEventListener('click', listener);
      }
    });
}

async function handleLicitationPopUp() {
    await delay(4000);
    //unhide popup
    parentOfPopUpContainer.appendChild(popupContainer);
    
    const licitationButtons = document.getElementsByClassName("licitation-button");

    const event = await waitForLicitationEvent();
    const selectedButton = event.target.textContent;
    whatUserLicitated = selectedButton;
    console.log(`Selected button: ${selectedButton}`);
    clearPopUp();
    setTimeout(() => { moveOpponentCards(); moveUserCards();}, 1000);
    return selectedButton;
}

function clearPopUp() {
    popupContainer = document.querySelector("#popup-container");
    parentOfPopUpContainer = popupContainer.parentNode;
    parentOfPopUpContainer.removeChild(popupContainer);
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
            cardImage.setAttribute('id', 'centeredDownCardOpponent');
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
    cardImages.forEach(cardImage => {
        cardImage.addEventListener('click', () => {
            cardImage.style.position = 'absolute';
            cardImage.style.top = '50%';
            cardImage.style.left = '60%';
            cardImage.style.transform = 'translate(-50%, -60%)';
            cardImage.style.transition = 'all 0.5s linear';
            
            //added a setTimeout function to delay the animation of the wrapperDiv 
            //until after the image has been moved to the wrapper div
            setTimeout(() => {
                wrapperDiv.appendChild(cardImage);
                cardImage.setAttribute('id', 'centeredDownCardUser');
                cardImage.style.transform = 'translate(-50%, -60%)';
                cardImage.style.transition = 'all 0.5s linear';
              }, 10);
        });
    });
}

//module.exports = {createOpponentLicitationAlert, handleTimer, handleLicitationPopUp, clearPopUp, moveOpponentCards, moveUserCards}