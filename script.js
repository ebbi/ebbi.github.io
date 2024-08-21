const dictionary = 
[
    {
        word: "home", translation: "baan",
        multipleChoice: [["puan", "เพื่อน"], ["baan", "บ้าน"], ["rongreyn", "โรงเรียน"]]
    },
    {
        word: "school", translation: "rongreyn",
        multipleChoice: [["puan", "เพื่อน"], ["rongreyn", "โรงเรียน"], ["baan", "บ้าน"]]
    },
    { 
        word: "coffee", translation: "gaa-fee",
        multipleChoice: [["rongreyn", "โรงเรียน"], ["gaa-fee", "กาแฟ"], ["baan", "บ้าน"]]
    },
    { 
        word: "food", translation: "aa-haan",
        multipleChoice: [["rongreyn", "โรงเรียน"], ["puan", "ร้านอาหาร"], ["aa-haan", "อาหาร"]]
    },
    {
        word: "sleep",translation: "noon-lap",
        multipleChoice: [["noon-lap", "นอน"], ["puan", "เพื่อน"], ["baan", "บ้าน"]]
    },
    { 
        word: "banana", translation: "gluay",
        multipleChoice: [["rongreyn", "โรงเรียน"], ["puan", "เพื่อน"], ["gluay", "กล้วย"]]
    },
    { 
        word: "dog", translation: "maa",
        multipleChoice: [["gluay", "กล้วย"], ["maa", "หมา"], ["baan", "บ้าน"]]
    },
    { 
        word: "books", translation: "nan-sww",
        multipleChoice: [["nan-sww", "หนังสือ"], ["gluay", "กล้วย"], ["baan", "บ้าน"]]
    }
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
    feedbackContainer.textContent = "select Thai word for translation";

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
        spanThai.lang = "th";
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
