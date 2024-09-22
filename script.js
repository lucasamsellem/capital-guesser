const capitals = {
  Australie: ['canberra', 'camberra', 'canbera', 'cambera'],
  Allemagne: ['berlin', 'bérlin'],
  Égypte: ['le caire', 'cairo', 'el caire'],
  Thaïlande: ['bangkok', 'bangcok', 'bankok', 'bancok'],
  Pologne: ['varsovie', 'warsaw', 'varsoie'],
  Liban: ['beyrouth', 'beirut', 'beyrout'],
  Chili: ['santiago', 'santiaggo', 'san tiago'],
  Suède: ['stockholm', 'stokholm', 'stocolm'],
  Tunisie: ['tunis', 'tunice'],
  Cuba: ['la havane', 'havana', 'havanne'],
  Mali: ['bamako', 'bammako', 'bamacko'],
  Argentine: ['buenos aires', 'buénos aires', 'buenos airés'],
  Canada: ['ottawa', 'otawa', 'otawah'],
  Venezuela: ['caracas', 'caracass', 'caraccas'],
  Syrie: ['damas', 'damascus', 'damasz'],
  Finlande: ['helsinki', 'helsinky', 'helsiki'],
  Ukraine: ['kiev', 'kyiv', 'kyev'],
  Serbie: ['belgrade', 'belgrad'],
  Sénégal: ['dakar', 'dacker', 'dakhar', 'dacar'],
  Inde: ['new delhi', 'new deli', 'neu delhi'],
  Grèce: ['athènes', 'athens'],
  Chine: ['pékin', 'beijing'],
  Brésil: ['brasilia', 'brazilia'],
  Russie: ['moscou', 'moscow', 'moskva'],
  Israël: ['jérusalem', 'yerushalaim'],
  Japon: ['tokyo', 'toquio'],
  Portugal: ['lisbonne', 'lisbon', 'lisbone'],
  Irlande: ['dublin', 'doblin'],
  Mexique: ['mexico', 'mejico'],
  Hongrie: ['budapest', 'budapeste', 'budapesht'],
  'Corée du Sud': ['séoul', 'seoul'],
  'Pays-Bas': ['amsterdam', 'amstérdam', 'amsterdan'],
};

// todo : ajouter rubrique difficulté (facile, moyen, difficile)
// todo : bar progression en fonction du score
// todo : trouver le + de capitales en l'espace de 30 secondes

// ! VARIABLES //////////////////////////////////////

// Query selectors
const countryName = document.querySelector('.country-name');
const flag = document.querySelector('.flag-container');
const resultText = document.querySelector('.result-text');
const inputCapital = document.querySelector('.input-capital');
const btnOK = document.querySelector('.button-ok');
const btnNext = document.querySelector('.next-button');
const hint = document.querySelector('.hint-container');
const toggleTimerBtn = document.querySelector('.toggle-timer-btn');
const timerText = document.querySelector('.timer');
const countries = Object.keys(capitals);
const scoreEl = document.querySelector('.score');
const randomIndexHistory = new Set();
const timerSeconds = 8;

// Dynamic variables
let uniqueIndex;
let capital;
let fails = 0;
let seconds = timerSeconds;
let timerInterval = false;
let timerState = false;
let score = 0;

// ! FUNCTIONS //////////////////////////////////////

const generateUniqueIndex = () => {
  // reset history if all countries were guessed
  if (randomIndexHistory.size >= countries.length) randomIndexHistory.clear();

  // Generate new index if already stored in 'randomIndexHistory'
  do {
    uniqueIndex = Math.trunc(Math.random() * countries.length);
  } while (randomIndexHistory.has(uniqueIndex));

  return uniqueIndex;
};

// Update country
const updateCountry = () => {
  uniqueIndex = generateUniqueIndex();
  randomIndexHistory.add(uniqueIndex);
  capital = capitals[countries[uniqueIndex]];
};

// Reset UI when new country
const updateUI = () => {
  inputCapital.value = '';
  inputCapital.classList.remove('correct');
  resultText.innerHTML = '';
  hint.textContent = '';
  fails = 0;
};

// Update results texts
const updateResultText = (message, clr) => {
  resultText.textContent = message;
  resultText.style.color = clr;
};

// Display country and flag
const displayCountry = () => {
  updateCountry();
  const country = countries[uniqueIndex];

  flag.innerHTML = '';

  const img = document.createElement('img');
  img.className = 'flag-img';

  img.src = `img/${country}.png`;

  flag.appendChild(img);

  countryName.textContent = country;

  // Reset timer and interval when displaying a new country
  timerText.innerHTML = seconds = timerSeconds;

  // Clear any previous timer interval
  if (timerInterval) stopTimer();

  // Reactivate timer if it's running
  if (timerState) startTimer();
};
displayCountry();

const startTimer = () => {
  timerText.classList.remove('opacity-zero');
  toggleTimerBtn.classList.toggle('rotate');

  timerInterval = setInterval(() => {
    if (seconds === 0) {
      stopTimer();
      updateUI();
      displayCountry();
      score--;
      updateScore();
      return;
    }

    seconds--;

    timerText.innerHTML = seconds;
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
  timerInterval = false;
};

// Function to toggle the timer on button click
const toggleTimer = () => {
  // Inverse state
  timerState = !timerState;

  if (timerState) {
    if (!timerInterval) {
      seconds = timerSeconds;
      timerText.innerHTML = seconds;
      startTimer();
    }
  } else {
    stopTimer();
    timerText.classList.add('opacity-zero');
    toggleTimerBtn.classList.remove('rotate');
  }
};
toggleTimerBtn.addEventListener('click', toggleTimer);

const updateScore = () => {
  score <= 0 ? (score = 0) : score;
  scoreEl.textContent = score;
};

// ! DOM MANIPULATION ////////////////////////

// Display guesses
btnOK.addEventListener('click', () => {
  const inputValue = inputCapital.value.toLowerCase().trim();

  // Correct guess even without accents
  const correctGuess = capital.some(
    (guess) =>
      inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '') ===
      guess.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  );

  if (correctGuess) {
    hint.textContent = '';
    updateResultText('✅ Bien joué !', 'var(--green)');
    inputCapital.classList.add('correct');
    score++;
    updateScore();

    // Reload page after 0.5 sec
    setTimeout(() => {
      displayCountry();
      updateUI();
    }, 500);
  } else {
    updateResultText("❌ Ce n'est pas la bonne capitale", 'red');
    fails++;
    score--;
    updateScore();

    // Generate hint HTML
    const generateHintText = (failsCount, letters) => {
      const hintDescriptions = [
        'La première lettre est',
        'Les deux premières lettres sont',
      ];

      const hintText = letters.slice(0, failsCount).toUpperCase();

      return `
        <ion-icon name="bulb-outline" class="bulb"></ion-icon>
        <span>
          ${hintDescriptions[failsCount - 1]} : <strong>${hintText}</strong>
        </span>
       `;
    };

    // Display hint text
    if (fails <= 2) {
      hint.innerHTML = generateHintText(fails, capital[0]);
    }
  }
});

// Press enter key on btnOk
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    btnOK.click();
  }
});
