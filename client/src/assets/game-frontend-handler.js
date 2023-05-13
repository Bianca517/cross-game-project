var timerInterval = 0;

var licitationPopupContainer;
var parentOfLicitationPopUpContainer;

var tromfPopupContainer;
var parentOfTromfPopupContainer;

var canRunTimer = false;
var timerInterval;

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
    
    //let ss, timerText = appendTimerElement();
    const timerCircle = document.getElementById("timer-container");
    const timerDiv = document.createElement("div");
    timerDiv.className = "timer-container circle";

    document.body.appendChild(timerDiv);

    const timerText = document.createElement("span");
    timerText.style.color = "black";
    timerText.style.fontSize = "2.5em";
    timerText.style.position = "absolute";
    timerText.style.left = "95.5%";
    timerText.style.top = "41%";
    timerText.style.transform = "translateX(-50%)";

    timerDiv.appendChild(timerText);

    let ss = document.getElementById('ss');

    return new Promise( resolve => {
        timerInterval = setInterval( () => {

            ss.style.strokeDashoffset = 440 - (440 * timeLeft)/30;
            timerText.textContent = "0" + ":" + timeLeft;
            
            console.log("Time left: " + timeLeft);

            timeLeft--;
            console.log(timeLeft);
            if(timeLeft <= 0) {
                clearInterval(timerInterval);
                //console.log("Timer ended!");
                resolve("Timer ended!");
                timerText.textContent = "";
            }
        }, 1000);
    })
}

function stopTimer() {
    clearInterval(timerInterval);
}

function waitForLicitationEvent(buttonsClassName) {
    return new Promise(resolve => {
      const buttons = document.getElementsByClassName(`${buttonsClassName}`);
      const listener = (event) => {
        for (const button of buttons) {
          button.removeEventListener('click', listener);
        }
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

    const chosenTromf = event.target.getAttribute("name");
    console.log(`Chosen tromf: ${chosenTromf}`);
    
    clearTromfPopUp();
    moveUserCards();
    //setTimeout(() => {moveOpponentCards(); moveUserCards();}, 1000);
    //setTimeout(() => { moveUserCards();}, 1000);
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
    console.log('Moving ' + card);

    // Change the position of the image to the center of the screen ONCE IT IS LOADED
    cardImage.style.position = 'absolute';
    cardImage.style.top = '45%';
    cardImage.style.left = '40%';
    cardImage.style.transform = 'translate(-45%, -40%)';
    cardImage.style.transition = 'all 0.5s linear';
    cardImage.setAttribute('id', 'centeredDownCardOpponent');
}

function moveUserCards() {
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
                cardImage.style.opacity = '1';
              }, 10);
        });
    });
}

var opacity = 0;
var intervalID = 0;

function fadeOut () {
    intervalID = setInterval(hide,200);
}

function hide() {
    //for opponent
    const imgList = document.querySelectorAll('#centeredDownCardOpponent');
    console.log("img " + imgList);

    imgList.forEach((img) => {
        opacityString = img.style.opacity;
        opacity = Number(opacityString);
        console.log("opacity " + opacity);
        if(opacity > 0) {
            setTimeout(() => {
            opacity = opacity - 0.1;
            img.style.opacity = opacity;
        }, 0);
        }
        else {
            clearInterval(intervalID);
        }
    });

    //for user
    const imgListUser = document.querySelectorAll('#centeredDownCardUser');
    console.log("img " + imgListUser);

    imgListUser.forEach((img) => {
        opacityString = img.style.opacity;
        opacity = Number(opacityString);
        console.log("opacity " + opacity);
        if(opacity > 0) {
            setTimeout(() => {
            opacity = opacity - 0.1;
            img.style.opacity = opacity;
        }, 3000);
        }
        else {
            clearInterval(intervalID);
        }
    });
}

//module.exports = {createOpponentLicitationAlert, handleTimer, handleLicitationPopUp, clearPopUp, moveOpponentCards, moveUserCards}