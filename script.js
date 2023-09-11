const dataContainer = document.getElementById("data-container");
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");
const body = document.querySelector("body");

/* Switching between serif, sans serif, and monospace fonts */
const fontSelector = document.getElementById("font-selector");
const elementsToStyle = document.getElementsByTagName("body")[0];

fontSelector.addEventListener("change", () => {
  const selectedFont = fontSelector.value;
  elementsToStyle.style.fontFamily = selectedFont;
});

// toggle dark/light mode
const toggle = document.querySelector(".toggle");

let getMode = localStorage.getItem("mode");
if (getMode && getMode === "dark") {
  toggle.classList.add("active");
  body.classList.add("dark");
}

toggle.addEventListener("click", () => {
  toggle.classList.toggle("active");
});

toggle.addEventListener("click", () => {
  body.classList.toggle("dark");

  if (!body.classList.contains("dark")) {
    return localStorage.setItem("mode", "light");
  }
  localStorage.setItem("mode", "dark");
});

// getting word audio
function getVoice() {
  const wordVoice = document.querySelector("#word-voice");
  if (wordVoice) {
    wordVoice.play();
  }
}
// seaching a word in dictionary web app
btn.addEventListener("click", () => {
  let inputedWord = document.getElementById("inputed-word").value;
  fetch(`${url}${inputedWord}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Word not found");
      }
      return response.json();
    })
    .then((data) => {
      if (data.length === 0) {
        throw new Error("No definitions found");
      }

      const wordData = data[0];

      result.innerHTML = `
        <div class="word-sound-section">
          <div class="word-section">
            <h1 class="word">${inputedWord}</h1>
            <p class="phonetics">/${wordData.phonetics[0].text}/</p>
          </div>
          <div class="sound-section">
            <span id="sound" onclick="getVoice()"><i class="fa fa-play"  ></i></span>
          </div>
          <audio controls id="word-voice">
              <source src="${wordData.phonetics[0].audio}" type="audio/mpeg">
              Your browser does not support the audio element.
          </audio>
        </div>
        <div class="noun-section">
          <h3><span>${wordData.meanings[0].partOfSpeech}</span></h3>
          <h4>Meaning</h4>
          <ul>
            ${wordData.meanings[0].definitions
              .map((definition) => `<li>${definition.definition}</li>`)
              .join("")}
          </ul>
          <p>Synonyms <span class="synonym">${wordData.meanings[1].definitions[0].synonyms.join(
            ", "
          )}</span></p>
        </div>
        <div class="verb-section">
          <h3><span>${wordData.meanings[1].partOfSpeech}</span></h3>
          <h4>Meaning</h4>
          <ul>
            ${wordData.meanings[1].definitions
              .map((definition) => `<li>${definition.definition}</li>`)
              .join("")}
          </ul>
        </div>
        <hr />
        <p class="source">Source: <span><a href="${wordData.sourceUrls}">${
        wordData.sourceUrls
      }</a></span></p>
      `;
    })
    .catch((error) => {
      result.innerHTML = `<p class="respo">Couldn't find the word</p>`;
    });
});
