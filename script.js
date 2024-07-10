const capitals = {
  Australie: "canberra",
  Allemagne: "berlin",
  Égypte: "le caire",
  Thaïlande: "bangkok",
  Pologne: "varsovie",
  Liban: "beyrouth",
  Chili: "santiago",
  Suède: "stockholm",
  Tunisie: "tunis",
  Cuba: "la havane",
  Mali: "bamako",
  Argentine: "buenos aires",
  Canada: "ottawa",
  Venezuela: "caracas",
  Syrie: "damas",
  Finlande: "helsinki",
  Ukraine: "kiev",
  Serbie: "belgrade",
  Sénégal: "dakar",
  Inde: "new delhi",
  Grèce: "athènes",
  Chine: "pékin",
  Brésil: "brasilia",
  Russie: "moscou",
  Israël: "jérusalem",
  Japon: "tokyo",
  Portugal: "lisbonne",
  Irlande: "dublin",
  Mexique: "mexico",
  Hongrie: "budapest",
  "Corée du Sud": "séoul",
  "Pays-Bas": "amsterdam",
};

// todo : ajouter rubrique difficulté (facile, moyen, difficile)
// todo : bar progression en fonction du score
// todo : trouver le + de capitales en l'espace de 30 secondes

// ! VARIABLES //////////////////////////////////////

// Query selectors
const countryName = document.querySelector(".country-name");
const flag = document.querySelector(".flag-container");
const resultText = document.querySelector(".result-text");
const inputCapital = document.querySelector(".input-capital");
const btnOK = document.querySelector(".button-ok");
const btnNext = document.querySelector(".next-button");
const hint = document.querySelector(".hint-container");
const toggleTimerBtn = document.querySelector(".toggle-timer-btn");
const timerText = document.querySelector(".timer");
const countries = Object.keys(capitals);
const scoreEl = document.querySelector(".score");

const randomIndexHistory = new Set();

// Dynamic variables
let uniqueIndex;
let capital;
let fails = 0;
let seconds = 8;
let timerInterval = false;
let timerState = false;
let score = 0;

// ! FUNCTIONS //////////////////////////////////////

const generateUniqueIndex = () => {
  // reset history if all countries were guessed
  if (randomIndexHistory.size >= countries.length) randomIndexHistory.clear();

  // * La boucle do...while garantit que le bloc de code à l'intérieur est exécuté au moins une fois avant de vérifier la condition.

  // Generate new index if already stored in 'randomIndexHistory'
  do {
    uniqueIndex = Math.trunc(Math.random() * countries.length);
  } while (randomIndexHistory.has(uniqueIndex));

  return uniqueIndex;
};

// Update country
const updateCountry = () => {
  // Generate unique random index then push it to the set
  uniqueIndex = generateUniqueIndex();
  randomIndexHistory.add(uniqueIndex);
  console.log(randomIndexHistory);

  capital = capitals[countries[uniqueIndex]];
};

// Reset UI when new country
const updateUI = () => {
  inputCapital.value = "";
  inputCapital.classList.remove("correct");
  resultText.innerHTML = "";
  hint.textContent = "";
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

  // Clear previous country and flag
  flag.innerHTML = "";

  // Create img element
  const img = document.createElement("img");
  img.className = "flag-img";

  // Define img path
  img.src = `img/${country}.png`;

  // Append img in DOM
  flag.appendChild(img);

  // Display country name
  countryName.textContent = country;

  // Reset timer and interval when displaying a new country
  timerText.innerHTML = seconds = 8;

  // Clear any previous timer interval
  if (timerInterval) stopTimer();

  // Reactivate timer if it's running
  if (timerState) startTimer();
};
displayCountry();

// Timer functions
const startTimer = () => {
  timerText.classList.remove("opacity-zero");
  toggleTimerBtn.classList.toggle("rotate");

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
      seconds = 8;
      timerText.innerHTML = seconds;
      startTimer();
    }
  } else {
    stopTimer();
    timerText.classList.add("opacity-zero");
    toggleTimerBtn.classList.remove("rotate");
  }
};

const updateScore = () => {
  score <= 0 ? (score = 0) : score;
  scoreEl.textContent = score;
};

// ! DOM MANIPULATION ////////////////////////

// Activate timer button on click
toggleTimerBtn.addEventListener("click", toggleTimer);

// Display guesses
btnOK.addEventListener("click", () => {
  const inputValue = inputCapital.value.toLowerCase().trim();

  // Correct guess even without accents
  const correctGuess =
    inputValue.normalize("NFD").replace(/[\u0300-\u036f]/g, "") ===
    capital.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (correctGuess) {
    // Hide hint text
    hint.textContent = "";

    // Display correct text
    updateResultText("✅ Bien joué !", "var(--green)");

    // Apply CSS dynamic styles
    inputCapital.classList.add("correct");

    score++;
    updateScore();

    // Reload page after 0.5 sec
    setTimeout(() => {
      displayCountry();
      updateUI();
    }, 500);
  } else {
    // Display fail text
    updateResultText("❌ Ce n'est pas la bonne capitale", "red");

    // Increment fails
    fails++;

    // Update and block score if below 0
    score--;
    updateScore();

    // Generate hint HTML
    const generateHintText = (count, letters) => {
      const hintDescriptions = [
        "La première lettre est",
        "Les deux premières lettres sont",
      ];

      return `
        <ion-icon name="bulb-outline" class="bulb"></ion-icon>
        <span>
          ${
            hintDescriptions[count - 1]
          } : <strong>${letters.toUpperCase()}</strong>
        </span>
      `;
    };

    // Display first letters based on fails count
    const hintLetters = capital.slice(0, fails);

    // Display hint text
    if (fails <= 2) hint.innerHTML = generateHintText(fails, hintLetters);
  }
});

// Press enter key on btnOk
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    btnOK.click();
  }
});
