const dict_phonetics = [
    { en_word: "hello", th_word: "สวัสดี", pronunciation: "sà-wàt-dii" },
    { en_word: "thank you", th_word: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun" },
    { en_word: "never mind", th_word: "ไม่เป็นไร", pronunciation: "mâi-bpen-rai" },
    { en_word: "sorry; excuse me", th_word: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot" }
    { en_word: "nice to meet you", th_word: "ยินดีที:ได้รู้จัก", pronunciation: "yin-dii tîi dâai rúu-jàk" },
    { en_word: "how about you?", th_word: "(แล้ว) คุณล่ะ", pronunciation: "khun la" }
];
const book1_phonetics =
    [
        {
            word: "home", translation: "baan",
            multipleChoice: [
                ["puan", "เพื่อน"],
                ["baan", "บ้าน"],
                ["rongreyn", "โรงเรียน"]
            ]
        },
        {
            word: "school", translation: "rongreyn",
            multipleChoice: [
                ["puan", "เพื่อน"],
                ["rongreyn", "โรงเรียน"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "coffee", translation: "gaa_fee",
            multipleChoice: [
                ["rongreyn", "โรงเรียน"],
                ["gaa_fee", "กาแฟ"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "food", translation: "aa_haan",
            multipleChoice: [
                ["rongreyn", "โรงเรียน"],
                ["puan", "ร้านอาหาร"],
                ["aa_haan", "อาหาร"]
            ]
        },
        {
            word: "sleep", translation: "noon_lap",
            multipleChoice: [
                ["noon_lap", "นอน"],
                ["puan", "เพื่อน"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "banana", translation: "gluay",
            multipleChoice: [
                ["rongreyn", "โรงเรียน"],
                ["puan", "เพื่อน"],
                ["gluay", "กล้วย"]
            ]
        },
        {
            word: "family", translation: "khroop_khrua",
            multipleChoice: [
                ["khroop_khrua", "ครอบครัว"],
                ["puan", "เพื่อน"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "dog", translation: "maa",
            multipleChoice: [
                ["gluay", "กล้วย"],
                ["maa", "หมา"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "books", translation: "nan_sww",
            multipleChoice: [
                ["nan_sww", "หนังสือ"],
                ["gluay", "กล้วย"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "father", translation: "por",
            multipleChoice: [
                ["nan_sww", "หนังสือ"],
                ["gluay", "กล้วย"],
                ["por", "พ่อ"]
            ]
        },
        {
            word: "child", translation: "luuk",
            multipleChoice: [
                ["nan_sww", "หนังสือ"],
                ["luuk", "กล้วย"],
                ["por", "พ่อ"]
            ]
        },
        {
            word: "hot", translation: "roon",
            multipleChoice: [
                ["roon", "ร้อน"],
                ["luuk", "กล้วย"],
                ["por", "พ่อ"]
            ]
        },
        {
            word: "horse", translation: "maa",
            multipleChoice: [
                ["roon", "ร้อน"],
                ["luuk", "กล้วย"],
                ["maa", "ม้า"]
            ]
        },
        {
            word: "friend", translation: "phwan",
            multipleChoice: [
                ["phwan", "เพื่อน"],
                ["luuk", "กล้วย"],
                ["maa", "ม้า"]
            ]
        }
    ];

const book1_lesson1_greetings =
    [
        {
            word: "hello", translation: "sa_wat_dii",
            multipleChoice: [
                ["sa_wat_dii", "สวัสดี"],
                ["khoop_khun", "ขอบคุณ"],
                ["mai_bpen_rai", "ไม่เป็นไร"]
            ]
        },
        {
            word: "thank you", translation: "khoop_khun",
            multipleChoice: [
                ["sa_wat_dii", "สวัสดี"],
                ["khoop_khun", "ขอบคุณ"],
                ["khoo_thoot", "ขอโทษ"],
            ],
        },
        {
            word: "never mind", translation: "mai_bpen_rai",
            multipleChoice: [
                ["sa_wat_dii", "สวัสดี"],
                ["khoop_khun", "ขอบคุณ"],
                ["mai_bpen_rai", "ไม่เป็นไร"],
            ]
        },
        {
            word: "sorry", translation: "khoo_thoot",
            multipleChoice: [
                ["khoo_thoot", "ขอโทษ"],
                ["khoop_khun", "ขอบคุณ"],
                ["mai_bpen_rai", "ไม่เป็นไร"],
            ]
        },
        {
            word: "nice to meet you", translation: "yin_dii thii daay ruu_jak",
            multipleChoice: [
                ["khoo_thoot", "ขอโทษ"],
                ["yin_dii thii daay ruu_jak", "ยินดีที่ได้รู้จัก"],
                ["mai_bpen_rai", "ไม่เป็นไร"],
            ]
        },
        {
            word: "how about you", translation: "leew_khun_la",
            multipleChoice: [
                ["khoo_thoot", "ขอโทษ"],
                ["yin_dii thii daay ruu_jak", "ยินดีที่ได้รู้จัก"],
                ["leew_khun_la", "(แล้ว) คุณล่ะ"],
            ]
        }
    ];

const book1_lesson3_selectDictionary_1 =
    [
        {
            word: "small", translation: "lek",
            multipleChoice: [
                ["lek", "เพื่อน"],
                ["baan", "บ้าน"],
                ["rongreyn", "โรงเรียน"]
            ]
        },
        {
            word: "big/large", translation: "yai",
            multipleChoice: [
                ["puan", "เพื่อน"],
                ["yai", "โรงเรียน"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "short (length)", translation: "san",
            multipleChoice: [
                ["san", "โรงเรียน"],
                ["gaa_fee", "กาแฟ"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "long (length)", translation: "yaaw",
            multipleChoice: [
                ["rongreyn", "โรงเรียน"],
                ["puan", "ร้านอาหาร"],
                ["yaaw", "อาหาร"]
            ]
        },
        {
            word: "short (height)", translation: "dtia",
            multipleChoice: [
                ["noon_lap", "นอน"],
                ["dtia", "เพื่อน"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "tall (height)", translation: "suung",
            multipleChoice: [
                ["rongreyn", "โรงเรียน"],
                ["puan", "เพื่อน"],
                ["suung", "กล้วย"]
            ]
        },
        {
            word: "Good", translation: "dii",
            multipleChoice: [
                ["gluay", "กล้วย"],
                ["maa", "หมา"],
                ["dii", "บ้าน"]
            ]
        },
        {
            word: "bad/terrible", translation: "yee",
            multipleChoice: [
                ["yee", "หนังสือ"],
                ["gluay", "กล้วย"],
                ["baan", "บ้าน"]
            ]
        },
        {
            word: "roon", translation: "roon",
            multipleChoice: [
                ["nan_sww", "หนังสือ"],
                ["gluay", "กล้วย"],
                ["roon", "พ่อ"]
            ]
        },
        {
            word: "cool/iced", translation: "yen",
            multipleChoice: [
                ["yen", "หนังสือ"],
                ["luuk", "กล้วย"],
                ["por", "พ่อ"]
            ]
        },
        {
            word: "cold", translation: "naaw",
            multipleChoice: [
                ["roon", "ร้อน"],
                ["luuk", "กล้วย"],
                ["naaw", "พ่อ"]
            ]
        },
        {
            word: "cheap", translation: "thuuk",
            multipleChoice: [
                ["roon", "ร้อน"],
                ["luuk", "กล้วย"],
                ["maa", "ม้า"]
            ]
        },
        {
            word: "expensive", translation: "pheeng",
            multipleChoice: [
                ["phwan", "เพื่อน"],
                ["luuk", "กล้วย"],
                ["maa", "ม้า"]
            ]
        },
        {
            word: "slow", translation: "chaa",
            multipleChoice: [
                ["phwan", "เพื่อน"],
                ["luuk", "กล้วย"],
                ["maa", "ม้า"]
            ]
        },
        {
            word: "fast", translation: "rew",
            multipleChoice: [
                ["phwan", "เพื่อน"],
                ["luuk", "กล้วย"],
                ["maa", "ม้า"]
            ]
        },
        {
            word: "beautiful/pretty", translation: "suay",
            multipleChoice: [
                ["phwan", "เพื่อน"],
                ["luuk", "กล้วย"],
                ["maa", "ม้า"]
            ]
        },
        {
            word: "handsome", translation: "loo",
            multipleChoice: [
                ["phwan", "เพื่อน"],
                ["luuk", "กล้วย"],
                ["maa", "ม้า"]
            ]
        }
    ];

const dictionarySelect = document.getElementById("selectDictionary");
const feedbackContainer = document.getElementById("feedback");
const buttonNextWord = document.getElementById("next");
const buttonPreviousWord = document.getElementById("prev");

let incorrectAnswers = [];
let incorrectWordIndex = 0;

let dictionary = book1_phonetics; // default dictionary
let dictionaryName = "Book 1 Phonetics";
let wordIndex = 0;

let noOfAttemptedAnswer = 0;
let noOfCorrectAnswer = 0;
let noOfIncorrectAnswer = 0;

setDictionary();

buttonPreviousWord.addEventListener("click", () => {

    if (wordIndex > 0) {
        wordIndex = (wordIndex - 1) % dictionary.length;
    } else {
        wordIndex = dictionary.length - 1;
    }
    multipleChoice();
    setFeedback("default");
});

buttonNextWord.addEventListener("click", () => {

    if (wordIndex < dictionary.length) {
        wordIndex = (wordIndex + 1) % dictionary.length;
    } else {
        wordIndex = dictionary.length;
    }
    multipleChoice();
    setFeedback(":");
});

dictionarySelect.addEventListener("change", () => {

    setDictionary();

});

function multipleChoice() {

    const { word, translation, multipleChoice } = dictionary[wordIndex];

    const wordContainer = document.getElementById("word");
    const choiceContainer = document.getElementById("multipleChoice");

    wordContainer.textContent = word;

    choiceContainer.innerHTML = "";

    multipleChoice.forEach((choice) => {

        //        console.log(choice);
        //        console.log(choice[0]);
        const choiceText = choice[0];
        const choiceThai = choice[1];

        const buttonChoiceText = document.createElement("button");
        buttonChoiceText.textContent = choiceText;
        buttonChoiceText.classList.add("default_button");
        buttonChoiceText.addEventListener("click", function () {
            checkAnswer(this, translation);
        });
        choiceContainer.appendChild(buttonChoiceText);

        const spanThai = document.createElement("span");
        spanThai.textContent = choiceThai;
        spanThai.lang = "th";
        spanThai.classList.add("button");
        choiceContainer.appendChild(spanThai);

    });

}

function checkAnswer(buttonChoiceTextObj, translation) {

    noOfAttemptedAnswer++;

    if (buttonChoiceTextObj.textContent === translation) {
        buttonChoiceTextObj.classList.add("correct");
        noOfCorrectAnswer++;
        setFeedback("correct answer");
    } else if (buttonChoiceTextObj.textContent != translation) {
        buttonChoiceTextObj.classList.add("incorrect");
        noOfIncorrectAnswer++;
        setFeedback("incorrect answer");
        if (dictionaryName != " Incorrect answers ") {
            incorrectAnswers.push(dictionary[incorrectWordIndex]);
            incorrectWordIndex++;
        }
    }
}

function setFeedback(message) {
    let feedbackMessage = "";
    feedbackContainer.classList.remove("correct", "incorrect");
    feedbackContainer.classList.add("feedback");

    if (message === "correct answer") {
        feedbackMessage = " Correct, well done.  ";
        feedbackContainer.classList.add("correct");
    } else if (message === "incorrect answer") {
        //        noOfIncorrectAnswer++;
        feedbackMessage = " Incorrect, try again.  ";
        feedbackContainer.classList.add("incorrect");
    } else if (message === "incorrectAnswersIsEmpty") {
        feedbackMessage = " There are no incorrect answers.  Try making mistakes to add to incorrect answers. "
        feedbackContainer.classList.add("feedback");
    } else {
        feedbackMessage = dictionaryName;
    }

    feedbackContainer.textContent =
        feedbackMessage
        + noOfAttemptedAnswer.toString() + " attempts. "
        + noOfCorrectAnswer.toString() + " correct "
        + noOfIncorrectAnswer.toString() + " incorrect.  "
        + (wordIndex + 1).toString() + " of " + dictionary.length + " words from "
        + dictionaryName
}

function setDictionary() {

    if (dictionarySelect.value === "incorrect_answers") {
        if (incorrectAnswers.length != 0) {
            dictionary = incorrectAnswers;
            dictionaryName = " Incorrect answers "
            setFeedback(" Selected incorrect answers. ")
        } else {
            setFeedback("incorrectAnswersIsEmpty");
        }
    } else if (dictionarySelect.value === "book1_phonetics") {
        dictionary = book1_phonetics;
        dictionaryName = " Book 1 Phonetics ";
        setFeedback(" Selected book 1 phonetics word set ");
    } else if (dictionarySelect.value === "book1_lesson1_greetings") {
        dictionary = book1_lesson1_greetings;
        dictionaryName = " Book 1 Lesson 1 Greetings "
        setFeedback(" Selectd book 1 greetings word set. ")
    } else {
        dictionary = book1_lesson1_greetings;
        dictionaryName = " Book 1 Lesson 1 Greetings "
        setFeedback(" Selectd default book 1 greetings word set. ")
    }

    wordIndex = 0;

    multipleChoice();

}
