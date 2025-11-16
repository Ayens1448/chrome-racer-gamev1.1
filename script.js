const carA = document.getElementById('carA');
const carB = document.getElementById('carB');
const startButton = document.getElementById('startButton');
const messageDisplay = document.getElementById('message');
const mobileGoButton = document.getElementById('mobileGoButton'); // NEW

const trackWidth = 600; 
const finishLine = trackWidth - 40; 

let isRaceActive = false;
let raceInterval;

function resetRace() {
    carA.style.left = '0px';
    carB.style.left = '0px';
    messageDisplay.textContent = 'Ready! Tap GO! to move Car A.';
    startButton.disabled = false;
    startButton.textContent = 'Start Race';
    mobileGoButton.style.display = 'none'; // Hide the GO button
    isRaceActive = false;
    
    // Cleanup old listeners
    document.removeEventListener('keydown', handleKeyPress);
    mobileGoButton.removeEventListener('click', handleMobileTap);
}

// Moves the user car by tapping the GO button
function moveUserCar() {
    const move = 20; 
    let currentPos = parseInt(carA.style.left) || 0;
    let newPos = currentPos + move;

    if (newPos >= finishLine) {
        newPos = finishLine;
    }
    carA.style.left = newPos + 'px';
    return newPos;
}

// Function for the AI opponent (Car B) to move randomly
function moveAICar(carElement) {
    const move = Math.floor(Math.random() * 3) + 1; 
    let currentPos = parseInt(carElement.style.left) || 0;
    let newPos = currentPos + move * 15; 

    if (newPos >= finishLine) {
        newPos = finishLine;
    }
    carElement.style.left = newPos + 'px';
    return newPos;
}

// Function to determine the final winner message
function getWinnerMessage(posA, posB) {
    const aFinished = posA >= finishLine;
    const bFinished = posB >= finishLine;

    if (aFinished && bFinished) {
        return (posA > posB) ? '🎉 You Win! (Car A) 🎉' : 
               (posB > posA) ? '❌ AI Wins! (Car B) ❌' : 
               '🤝 It\'s a Tie!';
    } else if (aFinished) {
        return '🎉 You Win! (Car A) 🎉';
    } else if (bFinished) {
        return '❌ AI Wins! (Car B) ❌';
    }
    return 'Race still active or unknown error.';
}

// Function to stop the race and display results
function endRace() {
    clearInterval(raceInterval);
    isRaceActive = false;
    startButton.disabled = false;
    startButton.textContent = 'Play Again';
    mobileGoButton.style.display = 'none'; // Hide GO button when race ends
    
    const posA = parseInt(carA.style.left);
    const posB = parseInt(carB.style.left);
    
    messageDisplay.textContent = getWinnerMessage(posA, posB);

    // Remove event listeners
    document.removeEventListener('keydown', handleKeyPress);
    mobileGoButton.removeEventListener('click', handleMobileTap);
}

// The main race loop for the AI opponent
function raceStep() {
    const posB = moveAICar(carB);
    const posA = parseInt(carA.style.left);
    
    if (posB >= finishLine) {
        endRace();
        return;
    }
    if (posA >= finishLine) {
        endRace();
    }
}

// NEW: Handles mobile tap input
function handleMobileTap() {
    if (!isRaceActive) return;
    const posA = moveUserCar();

    if (posA >= finishLine) {
        endRace();
    }
}

// Handles desktop keyboard input (kept for desktop users)
function handleKeyPress(event) {
    if (!isRaceActive) return;

    if (event.key === 'ArrowRight' || event.keyCode === 39) {
        event.preventDefault(); 
        const posA = moveUserCar();
        
        if (posA >= finishLine) {
            endRace();
        }
    }
}

function startRace() {
    resetRace();
    startButton.disabled = true;
    messageDisplay.textContent = 'Tap GO! GO! GO! to race!';
    mobileGoButton.style.display = 'block'; // Show the GO button
    isRaceActive = true;
    
    raceInterval = setInterval(raceStep, 500); 

    // Add both the tap listener and the keyboard listener
    mobileGoButton.addEventListener('click', handleMobileTap);
    document.addEventListener('keydown', handleKeyPress);
}

startButton.addEventListener('click', startRace);

resetRace();