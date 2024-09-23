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
  Mali: ['bamako', 'bammako', 'bamacko', 'bamaco'],
  Argentine: ['buenos aires', 'buénos aires', 'buenos airés'],
  Canada: ['ottawa', 'otawa', 'otawah'],
  Venezuela: ['caracas', 'caracass', 'caraccas'],
  Syrie: ['damas', 'damascus', 'damasz'],
  Finlande: ['helsinki', 'helsinky', 'helsiki'],
  Ukraine: ['kiev', 'kyiv', 'kyev'],
  Serbie: ['belgrade', 'belgrad'],
  Sénégal: ['dakar', 'dacker', 'dakhar', 'dacar'],
  Inde: ['new delhi', 'new deli', 'new-delhi'],
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

// ! VARIABLES

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
const initialCountdownSeconds = 8;
const hintText = ['La première lettre est', 'Les deux premières lettres sont'];
const hintLettersLimit = 2;

let uniqueIndex;
let capital;
let fails = 0;
let seconds = initialCountdownSeconds;
let countdown = false;
let timerState = false;
let score = 0;

// ! FUNCTIONS

const generateUniqueIndex = () => {
  // Reset history if all countries were guessed
  if (randomIndexHistory.size >= countries.length) randomIndexHistory.clear();

  // Generate new index if already stored in randomIndexHistory
  do {
    uniqueIndex = Math.trunc(Math.random() * countries.length);
  } while (randomIndexHistory.has(uniqueIndex));

  return uniqueIndex;
};

const updateCountry = () => {
  uniqueIndex = generateUniqueIndex();
  randomIndexHistory.add(uniqueIndex);
  capital = capitals[countries[uniqueIndex]];
};

const updateUI = () => {
  inputCapital.value = '';
  inputCapital.classList.remove('correct');
  resultText.innerHTML = '';
  hint.textContent = '';
  fails = 0;
};

const updateResultText = (text, clr) => {
  resultText.textContent = text;
  resultText.style.color = clr;
};

const updateScore = () => {
  score = Math.max(score, 0);
  scoreEl.textContent = score;
};

const generateHint = (failsCount, capitalFirstLetters) => {
  const hintLetters = capitalFirstLetters.slice(0, failsCount).toUpperCase();

  return `
    <ion-icon name="bulb-outline" class="bulb"/></ion-icon>
    <span>
      ${hintText[failsCount - 1]} : <strong>${hintLetters}</strong>
    </span>
   `;
};

// Display country name and its flag
const displayCountry = () => {
  updateCountry();
  const country = countries[uniqueIndex];

  countryName.textContent = country;
  flag.innerHTML = `<img class="flag-img" src="img/${country}.png" />`;
  timerText.innerHTML = seconds = initialCountdownSeconds;

  // Clear any previous timer interval
  if (countdown) stopTimer();

  // Reactivate timer if it's running
  if (timerState) startTimer();
};
displayCountry();

const startTimer = () => {
  timerText.classList.remove('opacity-zero');
  toggleTimerBtn.classList.toggle('rotate');

  countdown = setInterval(() => {
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
  clearInterval(countdown);
  countdown = false;
};

const toggleTimer = () => {
  // Inverse state
  timerState = !timerState;

  if (timerState && !countdown) {
    // Reset countdown when timer is on
    seconds = initialCountdownSeconds;
    timerText.innerHTML = seconds;
    startTimer();
  } else {
    stopTimer();
    timerText.classList.add('opacity-zero');
    toggleTimerBtn.classList.remove('rotate');
  }
};

// ! DOM MANIPULATION
toggleTimerBtn.addEventListener('click', toggleTimer);

btnOK.addEventListener('click', () => {
  const inputValue = inputCapital.value.toLowerCase().trim();

  // Correct guess even without accents
  const correctGuess = capital.some(
    (guess) =>
      inputValue.normalize('NFD').replace(/[\u0300-\u036f]/g, '') ===
      guess.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  );

  const correctCapitalSpelling = capital[0];

  // Display guess result
  if (correctGuess) {
    stopTimer();
    inputCapital.value = correctCapitalSpelling;
    updateResultText('✅ Bien joué !', 'var(--green)');
    inputCapital.classList.add('correct');
    score++;
    hint.textContent = '';

    // Reload page after 1 sec delay
    setTimeout(() => {
      displayCountry();
      updateUI();
    }, 1000);
  } else {
    updateResultText("❌ Ce n'est pas la bonne capitale", 'red');
    fails++;
    score--;

    // Display hint text
    if (fails <= hintLettersLimit) {
      hint.innerHTML = generateHint(fails, correctCapitalSpelling);
    }
  }
  updateScore();
});

// Press enter key on btnOk
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    btnOK.click();
  }
});
