const capitals = {
  facile: {
    Allemagne: ['berlin', 'bérlin'],
    Pologne: ['varsovie', 'warsaw', 'varsoie'],
    Suède: ['stockholm', 'stokholm', 'stocolm'],
    Tunisie: ['tunis', 'tunice'],
    Canada: ['ottawa', 'otawa', 'otawah'],
    Grèce: ['athènes', 'athens'],
    Chine: ['pékin', 'beijing'],
    Brésil: ['brasilia', 'brazilia'],
    'Pays-Bas': ['amsterdam', 'amstérdam', 'amsterdan'],
    Russie: ['moscou', 'moscow', 'moskva'],
    Japon: ['tokyo', 'toquio'],
    Portugal: ['lisbonne', 'lisbon', 'lisbone'],
    Irlande: ['dublin', 'doblin'],
    Mexique: ['mexico', 'mejico'],
  },
  moyen: {
    'Corée du Sud': ['séoul', 'seoul'],
    Australie: ['canberra', 'camberra', 'canbera', 'cambera'],
    Égypte: ['le caire', 'cairo', 'el caire'],
    Thaïlande: ['bangkok', 'bangcok', 'bankok', 'bancok'],
    Liban: ['beyrouth', 'beirut', 'beyrout'],
    Cuba: ['la havane', 'havana', 'havanne', 'havane'],
    Argentine: ['buenos aires', 'buénos aires', 'buenos airés'],
    Hongrie: ['budapest', 'budapeste', 'budapesht'],
    Israël: ['jérusalem', 'yerushalaim'],
    Ukraine: ['kiev', 'kyiv', 'kyev'],
  },
  difficile: {
    Chili: ['santiago', 'santiaggo', 'san tiago'],
    Mali: ['bamako', 'bammako', 'bamacko', 'bamaco'],
    Venezuela: ['caracas', 'caracass', 'caraccas'],
    Sénégal: ['dakar', 'dacker', 'dakhar', 'dacar'],
    Syrie: ['damas', 'damascus', 'damasz'],
    Finlande: ['helsinki', 'helsinky', 'helsiki'],
    Serbie: ['belgrade', 'belgrad'],
    Inde: ['new delhi', 'new deli', 'new-delhi'],
    Estonie: ['tallinn', 'talin', 'tallin'],
  },
};

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
const scoreEl = document.querySelector('.score');
const randomIndexHistory = new Set();
const initialCountdownSeconds = 8;
const hintText = ['La première lettre est', 'Les deux premières lettres sont'];
const hintLettersLimit = 2;
const modeBtns = document.querySelectorAll('.mode-btn');

let mode = 'facile'; // Initial mode
let countries = Object.keys(capitals[mode]);
let uniqueIndex;
let capital;
let fails = 0;
let seconds = initialCountdownSeconds;
let countdown = false;
let timerState = false;
let score = 0;

// Define difficulty mode
modeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    mode = btn.textContent.toLowerCase();
    countries = Object.keys(capitals[mode]);

    if (!btn.classList.contains('active')) {
      randomIndexHistory.clear();
      displayCountry();
      updateUI();
    }

    const activeBtn = document.querySelector('.mode-btn.active');
    if (activeBtn) activeBtn.classList.remove('active');
    btn.classList.add('active');

    return mode;
  });
});

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
  capital = capitals[mode][countries[uniqueIndex]];
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
