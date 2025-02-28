const dictionaryTest = [
    { word_th: 'กัน', sound_th: './assets/sound/thai_vowels/together.mp3' },
    { word_th: 'banana', sound_th: './assets/sound/thai_vowels/aa.mp3' },
    { word_th: 'orange', sound_th: './assets/sound/thai_vowels/bite.mp3' }
    // Add more words and sound paths as needed
    //   { word_en: "aa", word_th: "า", pronunciation: "aa", sound_th: "thai_vowels/aa.wav" },

];

//const divReadAloud = document.getElementById('readAloud');

let stopAudio = false;
// let pausedWordIndex = 0;
let playWordIndex = 0;
let delayRead = 1000; // millisecond

document.getElementById('buttonPlayAll').addEventListener('click', function () {

    let wordSpans = document.querySelectorAll('#wordContainer span');
    // let wordSpans = document.querySelectorAll('#wordContainer [lang = "TH"]');

    stopAudio = false;

    function playNextWord() {

        if (playWordIndex < wordSpans.length) {

            let wordSpan = wordSpans[playWordIndex];

            if (playWordIndex > 0) {
                const previousWordSpan = wordSpans[playWordIndex - 1];
                previousWordSpan.classList.remove('highlight');
                previousWordSpan.classList.remove('highlight-paused');
                previousWordSpan.classList.remove('highlight-red');
            }

            playWord(wordSpan.textContent, wordSpan.dataset.sound_th);
            wordSpan.classList.add('highlight');
            playWordIndex++;

            setTimeout(function () {

                if (stopAudio == false) {
                    playNextWord();
                    return;
                }

            }, delayRead); // Highlight duration in milliseconds

        }

    }

    if (playWordIndex == wordSpans.length) {
        playWordIndex = 0;
        wordSpans.forEach(function (wordSpan) {
            wordSpan.classList.remove('highlight');
            wordSpan.classList.remove('highlight-paused');
            wordSpan.classList.remove('highlight-red');
        });
    }
    playNextWord();
});

function playWord(word, sound_th) {

    const soundPath = "./assets/sound/";

    let audio = new Audio();
    audio.src = soundPath + sound_th;
    audio.play();

    /*
        // Speak word
    var synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(word);
    synth.speak(utterThis);
    */

}

const addTranslation = document.querySelector("#addTranslation");
let addTranslationCheckbox = false;

addTranslation.addEventListener("change", () => {

    if (addTranslation.checked) {
        addTranslationCheckbox = true;
    } else {
        addTranslationCheckbox = false;
    }
    readAloud(currentDictionary);

});

document.getElementById("inputDelay").addEventListener("change", (event) => {

    delayRead = event.target.value;
    if (delayRead > 0 && delayRead < 11) {
        delayRead = delayRead * 1000;
    } else {
        delayRead = 1000;
    }

});

document.getElementById('buttonPause').addEventListener('click', function () {

    //    let pauseWordIndex = 0;
    const wordSpans = document.querySelectorAll('#wordContainer span');

    if (wordSpans.length > 0) {

        stopAudio = true;
        let wordSpan = "";

        wordSpan = wordSpans[playWordIndex];
        console.log(playWordIndex);
        console.log(wordSpan);
        wordSpan.classList.add('highlight-paused');

        /*
                if (addTranslationCheckbox) {
                    wordSpan = wordSpans[pauseWordIndex];
                } else {
                    wordSpan = wordSpans[playWordIndex];
                }
        */
    }
});

document.getElementById('buttonStop').addEventListener('click', function () {
    stopAudio = true;
    //    pausedWordIndex = 0;
    playWordIndex = 0;
    addTranslationCheckbox = false;
    document.getElementById('wordContainer').innerText = "";
});

function readAloud(dictionary) {
    //    const wordContainer = document.getElementById('wordContainer');

    wordContainer.innerText = "";

    dictionary.forEach(function (item) {

        const wordSpan_th = document.createElement('span');
        wordSpan_th.textContent = item.word_th;
        wordSpan_th.lang = "TH";
        wordSpan_th.dataset.sound_th = item.sound_th;

        wordContainer.appendChild(wordSpan_th);
        wordContainer.appendChild(document.createTextNode(' ')); // Add space between words

        wordSpan_th.addEventListener('click', function () {
            playWord(item.word_th, item.sound_th);
            wordSpan_th.classList.add('highlight-red');
        });

        if (addTranslationCheckbox) {
            const wordSpan_en = document.createElement('span');
            wordSpan_en.textContent = " (" + item.word_en + ") ";
            wordSpan_en.classList.add('font-size-small');

            wordContainer.appendChild(wordSpan_en);
            wordContainer.appendChild(document.createTextNode(' ')); // Add space between words
        }

    });
}


// Call the function to display words
// readAloud(dictionaryTest);