const dictionaryTest = [
    { word_th: 'กัน', sound_th: './assets/sound/thai_vowels/together.mp3' },
    { word_th: 'banana', sound_th: './assets/sound/thai_vowels/aa.mp3' },
    { word_th: 'orange', sound_th: './assets/sound/thai_vowels/bite.mp3' }
    // Add more words and sound paths as needed
    //   { word_en: "aa", word_th: "า", pronunciation: "aa", sound_th: "thai_vowels/aa.wav" },

];

//const divReadAloud = document.getElementById('readAloud');

let stopAudio = false;
let pausedWordIndex = 0;
let playWordIndex = 0;
//const buttonPause = document.getElementById('buttonPause');

document.getElementById('buttonPlayAll').addEventListener('click', function () {

    let wordSpans = document.querySelectorAll('#wordContainer span');

    stopAudio = false;

    function playNextWord() {

        if (playWordIndex < wordSpans.length) {
            let wordSpan = wordSpans[playWordIndex];
            playWord(wordSpan.textContent, wordSpan.dataset.sound_th);
            wordSpan.classList.add('highlight');
            playWordIndex++;

            setTimeout(function () {

                wordSpan.classList.remove('highlight');

                if (stopAudio == false) {
                    playNextWord();
                    return;
                }

            }, 1500); // Highlight duration in milliseconds

        }
    }

    playNextWord();
});

document.getElementById('buttonPause').addEventListener('click', function () {
    stopAudio = true;
    pausedWordIndex = playWordIndex;

    const wordSpans = document.querySelectorAll('#wordContainer span');
    if (wordSpans.length > 0 && playWordIndex > 0) {
        const wordSpan = wordSpans[playWordIndex - 1];
        wordSpan.classList.add('highlight-paused');
    }
});

document.getElementById('buttonStop').addEventListener('click', function () {
    stopAudio = true;
    pausedWordIndex = 0;
    playWordIndex = 0;
    document.getElementById('wordContainer').innerText = "";
});

function readAloud(dictionary) {
    //    const wordContainer = document.getElementById('wordContainer');

    dictionary.forEach(function (item) {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = item.word_th;
        wordSpan.dataset.sound_th = item.sound_th;
        wordSpan.addEventListener('click', function () {
            playWord(item.word_th, item.sound_th);
        });
        wordContainer.appendChild(wordSpan);
        wordContainer.appendChild(document.createTextNode(' ')); // Add space between words
    });
}

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


// Call the function to display words
// readAloud(dictionaryTest);