const dictionaryGreetings = [
    { en_word: "hello", th_word: "สวัสดี", pronunciation: "sà-wàt-dii", ex_en: "hello", ex_pronunciation: "sà-wàt-dii-khráp", ex_th: "สวัสดีครับ" },
    { en_word: "thank you", th_word: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun", en_ex: "", ex_th: "" },
    { en_word: "never mind", th_word: "ไม่เป็นไร", pronunciation: "mâi-bpen-rai", en_ex: "", ex_th: "" },
    { en_word: "sorry; excuse me", th_word: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot", en_ex: "", ex_th: "" },
    { en_word: "nice to meet you", th_word: "ยินดีทีได้รู้จัก", pronunciation: "yin-dii tîi dâai rúu-jàk", en_ex: "", ex_th: "" },
    { en_word: "how about you?", th_word: "(แล้ว) คุณล่ะ", pronunciation: "khun la", en_ex: "", ex_th: "" },
    { en_word: "he; she", th_word: "เขา", pronunciation: "khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "we; us", th_word: "พวกเรา", pronunciation: "phûak-raw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "they; them", th_word: "พวกเขา", pronunciation: "phûak-khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "belong to or of", th_word: "ของ", pronunciation: "khɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "my; mine for male", th_word: "ของผม", pronunciation: "(khɔ̌ɔŋ) phǒm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "my; mine for female", th_word: "ของฉัน", pronunciation: "(khɔ̌ɔŋ) chǎn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "your; yours", th_word: "ของคุณ", pronunciation: "(khɔ̌ɔŋ) khun", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "his; her; hers", th_word: "ของเขา", pronunciation: "(khɔ̌ɔŋ) khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "our; ours", th_word: "ของพวกเรา", pronunciation: "(khɔ̌ɔŋ) phûak-raw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "their; theirs", th_word: "ของพวกเขา", pronunciation: "khɔ̌ɔŋ phûak-khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "name", th_word: "ชือ", pronunciation: "chʉ̂ʉ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "first name", th_word: "ชื#อจริง", pronunciation: "chʉ̂ʉ jiŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "surname", th_word: "นามสกุล", pronunciation: "naam-sà-gun", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "nickname", th_word: "อเล่น", pronunciation: "chʉ̂ʉ lên", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fine", th_word: "สบายดี", pronunciation: "sà-baay-dii", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "pretty good", th_word: "ก็ดี", pronunciation: "gɔ̂ɔ dii", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "so so", th_word: "เฉย เฉย", pronunciation: "chə̌əy-chə̌əy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eat already", th_word: "กินแล้ว", pronunciation: "gin lɛ́ɛw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "no", th_word: "ยัง", pronunciation: "yaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "come", th_word: "มา", pronunciation: "maa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "from", th_word: "จาก", pronunciation: "jàak", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "where", th_word: "ทีไหน", pronunciation: "thîi-nǎi", ex_en: "Where are you from?", ex_pronunciation: "khun maa jàak thîi-nǎi khráp", ex_th: "คุณมาจากทีxไหนครับ" },
    { en_word: "to eat", th_word: "กิน", pronunciation: "gin", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to drink", th_word: "ดืxม", pronunciation: "dʉ̀ʉm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to watch", th_word: "ดู", pronunciation: "duu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to listen", th_word: "ฟัง", pronunciation: "faŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to wake up", th_word: "ตืxน", pronunciation: "dtɯ̀ ɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to lie down or sleep", th_word: "นอน", pronunciation: "nɔɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to walk", th_word: "เดิน", pronunciation: "dəən", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to speak", th_word: "พูด", pronunciation: "phûut", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to study", th_word: "เรียน", pronunciation: "rian", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to write", th_word: "เขียน", pronunciation: "khǐan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to read", th_word: "อ่าน", pronunciation: "àan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to take a shower", th_word: "อาบนํ âา", pronunciation: "àap-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to play", th_word: "เล่น", pronunciation: "lên", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to exercise", th_word: "ออกกําลังกาย", pronunciation: "ɔ̀ɔk-gam-lang-gaai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to go", th_word: "ไป", pronunciation: "bpai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to do or make", th_word: "ทํา", pronunciation: "tham", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //    { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
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
            choiceContainer.appendChild(spanChoiceWordTh);

        });


    const exampleContainer = document.getElementById("example");
    exampleContainer.innerHTML = "";

    const spanExampleEn = document.createElement("span");
    spanExampleEn.textContent = dictionary[questionWordIndex].ex_en;
    exampleContainer.appendChild(spanExampleEn);

    const spanExamplePronunciation = document.createElement("span");
    spanExamplePronunciation.textContent = dictionary[questionWordIndex].ex_pronunciation;
    exampleContainer.appendChild(spanExamplePronunciation);

    const spanExampleTh = document.createElement("span");
    spanExampleTh.lang = "th";
    spanExampleTh.textContent = dictionary[questionWordIndex].ex_th;
    exampleContainer.appendChild(spanExampleTh);


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

