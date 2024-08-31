const dictionaryGreetings = [
    { en_word: "hello", th_word: "สวัสดี", pronunciation: "sà-wàt-dii" },
    { en_word: "thank you", th_word: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun" },
    { en_word: "never mind", th_word: "ไม่เป็นไร", pronunciation: "mâi-bpen-rai" },
    { en_word: "sorry; excuse me", th_word: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot" },
    { en_word: "nice to meet you", th_word: "ยินดีที:ได้รู้จัก", pronunciation: "yin-dii tîi dâai rúu-jàk" },
    { en_word: "how about you?", th_word: "(แล้ว) คุณล่ะ", pronunciation: "khun la" }
];
let wordIndex = 0;
let dictionary = dictionaryGreetings;

previousWord.addEventListener("click", () => {

    if (wordIndex > 0) {
        wordIndex = (wordIndex - 1) % dictionary.length;
    } else {
        wordIndex = dictionary.length - 1;
    }
    htmlMultipleChoice(wordIndex);
    //    setFeedback("default");
});

nextWord.addEventListener("click", () => {

    if (wordIndex < dictionary.length) {
        wordIndex = (wordIndex + 1) % dictionary.length;
    } else {
        wordIndex = dictionary.length;
    }
    htmlMultipleChoice(wordIndex);
    //    setFeedback(":");
});

/* multiple choice exercise for Thai dictionary words.
loop a dictionary
for each word:
    loop until random numbers are unique and different from word number
    display and handle click events on each word
    display feedback
*/

htmlMultipleChoice(0);

function htmlMultipleChoice(questionWordIndex) {
    //    const dictionary = dictionaryGreetings;
    let randomWordIndexes = [];
    //   const wordIndex = 0;

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
        (randomIndex) => {
            const buttonChoiceWord = document.createElement("button");
            buttonChoiceWord.textContent = dictionary[randomIndex].pronunciation;
            choiceContainer.appendChild(buttonChoiceWord);

            const buttonChoiceWordTh = document.createElement("button");
            buttonChoiceWordTh.textContent = dictionary[randomIndex].th_word;
            choiceContainer.appendChild(buttonChoiceWordTh);

        });
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function getRandomIntArray(wordIndex, dictionaryLength) {
    const choices = 3;
    let randomNumbers = [];

    n = 0;
    while (n < choices) {
        r = getRandomInt(0, dictionaryLength);
        if (!randomNumbers.includes(r) && r != wordIndex) {
            randomNumbers.push(r);
            n++;
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

