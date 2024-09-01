const dictionaryGreetings = [
    { en_word: "hello", th_word: "สวัสดี", pronunciation: "sà-wàt-dii" },
    { en_word: "thank you", th_word: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun" },
    { en_word: "never mind", th_word: "ไม่เป็นไร", pronunciation: "mâi-bpen-rai" },
    { en_word: "sorry; excuse me", th_word: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot" },
    { en_word: "nice to meet you", th_word: "ยินดีที:ได้รู้จัก", pronunciation: "yin-dii tîi dâai rúu-jàk" },
    { en_word: "how about you?", th_word: "(แล้ว) คุณล่ะ", pronunciation: "khun la" }
];

const dictionaryIncorrectAnswers = [];

let wordIndex = 0;
let dictionary = dictionaryGreetings;
let lastDictionary = dictionary;
let NoAnswerChoices = 3;
let correctAnswerCount = 0;
let incorrectAnswerCount = 0;
let attemptAnswerCount = 0;

const selectDictionary = document.getElementById("selectDictionary");
const incorrectAnswersOnly = document.getElementById("incorrectAnswersOnly");

initialize();
function initialize() {

    if (selectDictionary.value === "dictionaryIncorrectAnswers"
        && incorrectAnswerCount > NoAnswerChoices) {  // 4 words for 1 multiple choice Q/A
        setDictionary();
    } else if (selectDictionary.value != "dictionaryIncorrectAnswers") {
        setDictionary();
    }

}

previousWord.addEventListener("click", () => {

    if (wordIndex > 0) {
        wordIndex = (wordIndex - 1) % dictionary.length;
    } else {
        wordIndex = dictionary.length - 1;
    }
    htmlMultipleChoice(wordIndex);

});

nextWord.addEventListener("click", () => {

    if (wordIndex < dictionary.length) {
        wordIndex = (wordIndex + 1) % dictionary.length;
    } else {
        wordIndex = dictionary.length;
    }
    htmlMultipleChoice(wordIndex);

});

selectDictionary.addEventListener("change", () => {

    if (selectDictionary.value === "dictionaryIncorrectAnswers"
        && incorrectAnswerCount > NoAnswerChoices) {  // 4 words for 1 multiple choice Q/A
        setDictionary();
    } else if (selectDictionary.value != "dictionaryIncorrectAnswers") {
        setDictionary();
    }

});

incorrectAnswersOnly.addEventListener("click", () => {
    //    e.preventDefault();
    if (incorrectAnswersOnly.checked) {
        console.log("checked");

        if (dictionaryIncorrectAnswers.length > NoAnswerChoices) {
            lastDictionary = dictionary; // restore last dictionary if unchecked
            dictionary = dictionaryIncorrectAnswers;

            wordIndex = 0;
            htmlMultipleChoice(wordIndex);

        } else {
            incorrectAnswersOnly.checked = false;
        }

    } else {
        dictionary = lastDictionary;
    }

});

function setDictionary() {

    if (selectDictionary.value === "dictionaryIncorrectAnswers") {
        dictionary = dictionaryIncorrectAnswers;
        dictionaryName = " Incorrect answers ";
    } else if (selectDictionary.value === "dictionaryGreetings") {
        dictionary = dictionaryGreetings;
        dictionaryName = " Greetings ";
    } else {
        dictionary = dictionaryGreetings;
        dictionaryName = " Default Greetings ";
    }

    wordIndex = 0;
    htmlMultipleChoice(wordIndex);

}

/* multiple choice exercise for Thai dictionary words.
loop a dictionary
for each word:
    loop until random numbers are unique and different from word number
    display answer choices 
    handle click events to check the answer
    display feedback
*/

function htmlMultipleChoice(questionWordIndex) {
    let randomWordIndexes = [];

    const wordContainer = document.getElementById("word");
    const choiceContainer = document.getElementById("choiceWords");
    choiceContainer.innerHTML = "";

    wordContainer.textContent = dictionary[questionWordIndex].en_word;

    // get multiple choice word indexes, add index for correct answer, shuffle the array
    randomWordIndexes = getRandomIntArray(questionWordIndex, dictionary.length);
    randomWordIndexes.push(questionWordIndex); // add index for correct word
    let shuffledWordIndex = [];
    shuffledWordIndex = shuffle(randomWordIndexes);

    shuffledWordIndex.forEach(
        (userSelectedIndex) => {
            const buttonChoiceWord = document.createElement("button");
            buttonChoiceWord.textContent = dictionary[userSelectedIndex].pronunciation;
            choiceContainer.appendChild(buttonChoiceWord);
            buttonChoiceWord.addEventListener("click", function () {
                if (dictionary[questionWordIndex].pronunciation === dictionary[userSelectedIndex].pronunciation) {
                    buttonChoiceWord.classList.add("correct");
                    correctAnswerCount++;
                } else {
                    buttonChoiceWord.classList.add("incorrect");
                    incorrectAnswerCount++;
                    const found = dictionaryIncorrectAnswers.find(
                        ({ pronunciation }) => pronunciation === dictionary[questionWordIndex].pronunciation);
                    if (!found) {
                        dictionaryIncorrectAnswers.push(dictionary[questionWordIndex]);
                        // unhide 
                        if (dictionaryIncorrectAnswers.length > NoAnswerChoices) {
                            document.getElementById("incorrectAnswersOnlyDiv").hidden = false;
                        }
                    }
                }
                attemptAnswerCount++;
                feedback();
            });

            const spanChoiceWordTh = document.createElement("span");
            spanChoiceWordTh.textContent = dictionary[userSelectedIndex].th_word;
            spanChoiceWordTh.lang = "th";
            spanChoiceWordTh.classList.add("button");

            spanChoiceWordTh.textContent = dictionary[userSelectedIndex].th_word;
            choiceContainer.appendChild(spanChoiceWordTh);

        });
}

function feedback() {
    const buttonCorrect = document.getElementById("correctAnswer");
    buttonCorrect.textContent = correctAnswerCount;

    const buttonIncorrect = document.getElementById("incorrectAnswer");
    buttonIncorrect.textContent = incorrectAnswerCount;

    const buttonFeedback = document.getElementById("attemptedAnswer");
    buttonFeedback.textContent = parseInt((correctAnswerCount / attemptAnswerCount) * 100) + "%";
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function getRandomIntArray(wordIndex, dictionaryLength) {
    let randomNumbers = [];

    if (dictionaryLength > NoAnswerChoices) {
        n = 0;
        while (n < NoAnswerChoices) {
            r = getRandomInt(0, dictionaryLength);
            if (!randomNumbers.includes(r) && r != wordIndex) {
                randomNumbers.push(r);
                n++;
            }
        }
    }
    return randomNumbers;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

