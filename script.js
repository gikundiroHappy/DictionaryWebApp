// const dataContainer = document.getElementById("data-container");
// const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
// const result = document.getElementById("result");
// const btn = document.getElementById("search-btn");

// btn.addEventListener("click", () => {
//   let inputedWord = document.getElementById("inputed-word").value;
//   fetch(`${url}${inputedWord}`)
//     .then((response) => response.json())
//     .then((data) => {
//       const sound = new Audio(`https:${data[0].phonetics[0].audio}`);

//       result.innerHTML = `
//   <div class="word-sound-section">
//           <div class="word-section">
//             <h1 class="word">${inputedWord}</h1>
//             <p class="phonetics">/${data[0].phonetic}/</p>
//           </div>
//           <div class="sound-section">
//             <span id="sound"><i class="fa fa-play"></i></span>
//           </div>
//         </div>
//         <div class="noun-section">
//           <h3><span>${data[0].meanings[0].partOfSpeech}</span></h3>
//           <h4>Meaning</h4>
//           <ul>
//             <li>kkkk</li>
//             <li>kkkk</li>
//           </ul>
//           <p>Synonyms <span class="synonym">eourd huy</span></p>
//         </div>

//         <div class="verb-section">
//           <h3><span>verb</span></h3>
//           <h4>Meaning</h4>
//           <ul>
//             <li>kkkk</li>
//           </ul>
//         </div>

//         <hr />

//         <p class="source">Source: <span>httpsssss</span></p>
//   `;

//       const soundButton = document.getElementById("sound");
//       soundButton.addEventListener("click", () => {
//         sound.play();
//       });
//     });
// });

// veeee

const dataContainer = document.getElementById("data-container");
const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");
const body = document.querySelector("body");
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
            <span id="sound"><i class="fa fa-play"></i></span>
          </div>
        </div>
        <div class="noun-section">
          <h3><span>${wordData.meanings[0].partOfSpeech}</span></h3>
          <h4>Meaning</h4>
          <ul>
            ${wordData.meanings[0].definitions
              .map((definition) => `<li>${definition.definition}</li>`)
              .join("")}
          </ul>
          <p>Synonyms <span class="synonym">${wordData.meanings[0].definitions[0].synonyms.join(
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
        <p class="source">Source: <span>${wordData.origin}</span></p>
      `;

      const soundButton = document.getElementById("sound");
      soundButton.addEventListener("click", () => {
        console.log(wordData.phonetics[0].audio);
        const sound = new Audio(`https:${wordData.phonetics[0].audio}`);

        sound.play();
      });
    })
    .catch((error) => {
      result.innerHTML = `<p>${error.message}</p>`;
    });
});
