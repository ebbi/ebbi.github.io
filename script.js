

/*
function populateVoiceList() {
    if (typeof speechSynthesis === "undefined") {
      return;
    }
  
    const voices = speechSynthesis.getVoices();
  
    for (let i = 0; i < voices.length; i++) {
      const option = document.createElement("option");
      option.textContent = `${voices[i].name} (${voices[i].lang})`;
  
      if (voices[i].default) {
        option.textContent += " — DEFAULT";
      }
  
      option.setAttribute("data-lang", voices[i].lang);
      option.setAttribute("data-name", voices[i].name);
      document.getElementById("voiceSelect").appendChild(option);
    }
  }
  
  populateVoiceList();
  if (
    typeof speechSynthesis !== "undefined" &&
    speechSynthesis.onvoiceschanged !== undefined
  ) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  
  */
const synth = window.speechSynthesis;

const inputForm = document.querySelector("form");
const inputTxt = document.querySelector(".txt");
const voiceSelect = document.querySelector("select");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector(".pitch-value");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector(".rate-value");

let voices = [];

function populateVoiceList() {
    voices = synth.getVoices();

    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement("option");
        option.textContent = `${voices[i].name} (${voices[i].lang})`;

        if (voices[i].default) {
            option.textContent += " — DEFAULT";
        }
        if (voices[i].lang == "th") {
            option.setAttribute("data-lang", voices[i].lang);
            option.setAttribute("data-name", voices[i].name);
            voiceSelect.appendChild(option);
        }
    }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

inputForm.onsubmit = (event) => {
    event.preventDefault();

    const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    const selectedOption =
        voiceSelect.selectedOptions[0].getAttribute("data-name");
    for (let i = 0; i < voices.length; i++) {
        if (voices[i].name === selectedOption) {
            utterThis.voice = voices[i];
        }
    }
    utterThis.pitch = pitch.value;
    utterThis.rate = rate.value;
    synth.speak(utterThis);

    inputTxt.blur();
};



const dictionary = [
    {
        word: "home",
        translation: "baan",
        multipleChoice: [
            ["puan", "เพื่อน"],
            ["baan", "เพื่อน"],
            ["roon-rian", "เพื่อน"]
        ]
    },
    {
        word: "school",
        translation: "roon-rian",
        multipleChoice: [
            ["puan", "เพื่อน"],
            ["roon-rian", "เพื่อน"],
            ["baan", "เพื่อน"]
        ]
    },
    {
        word: "friend",
        translation: "puan",
        multipleChoice: [
            ["baroon-rianan", "เพื่อน"],
            ["puan", "เพื่อน"],
            ["baan", "เพื่อน"]
        ]
    }
    // Add more word pairs and options here
];

let currentWordIndex = 0;
const wordContainer = document.getElementById("word");
const choiceContainer = document.getElementById("multiple-choice");
const feedbackContainer = document.getElementById("feedback");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("prev");

function multipleChoice(index) {
    const { word, translation, multipleChoice } = dictionary[index];

    setFeedbackStyle("feedback");
    feedbackContainer.textContent = "your Click is my Command";

    wordContainer.textContent = word;
    wordContainer.classList.add("default-button");

    choiceContainer.innerHTML = "";

    multipleChoice.forEach((choice) => {

        //        console.log(choice);
        //        console.log(choice[0]);
        const choiceText = choice[0];
        const choiceThai = choice[1];

        const buttonChoiceText = document.createElement("button");
        buttonChoiceText.textContent = choiceText;
        buttonChoiceText.classList.add("default-button");
        buttonChoiceText.addEventListener("click", function () {
            checkAnswer(this, translation);
        });
        choiceContainer.appendChild(buttonChoiceText);

        const spanThai = document.createElement("span");
        spanThai.textContent = choiceThai;
        spanThai.classList.add("button");
        //   buttonChoiceSound.addEventListener("click", () => checkAnswer(choiceText, translation));
        choiceContainer.appendChild(spanThai);

    });

}

function checkAnswer(buttonChoiceTextObj, translation) {

    if (buttonChoiceTextObj.textContent === translation) {
        buttonChoiceTextObj.classList.add("correct");

        setFeedbackStyle("correct");
        feedbackContainer.textContent = "Correct.  Well done";
    } else {
        buttonChoiceTextObj.classList.add("incorrect");

        setFeedbackStyle("incorrect");
        feedbackContainer.textContent = "Incorrect.  Try again";
    }

}

function setFeedbackStyle(style) {
    feedbackContainer.classList.remove("feedback", "correct", "incorrect");
    feedbackContainer.classList.add(style);
}

prevButton.addEventListener("click", () => {
    if (currentWordIndex > 0) {
        currentWordIndex = (currentWordIndex - 1) % dictionary.length;
    } else {
        currentWordIndex = dictionary.length - 1;
    }
    multipleChoice(currentWordIndex);
});

nextButton.addEventListener("click", () => {
    currentWordIndex = (currentWordIndex + 1) % dictionary.length;
    multipleChoice(currentWordIndex);
});

multipleChoice(currentWordIndex);
