const dictionary = [
    {
        word: "home",
        translation: "baan",
        multipleChoice: [
            ["puan", "เพื่อน"], ["baan", "บ้าน"], ["rongreyn", "โรงเรียน"]
        ]
    },
    {
        word: "school",
        translation: "rongreyn",
        multipleChoice: [
            ["puan", "เพื่อน"], ["rongreyn", "โรงเรียน"], ["baan", "บ้าน"]
        ]
    },
    {
        word: "friend",
        translation: "puan",
        multipleChoice: [
            ["rongreyn", "โรงเรียน"], ["puan", "เพื่อน"], ["baan", "บ้าน"]
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
 //   wordContainer.classList.add("default-button");

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
