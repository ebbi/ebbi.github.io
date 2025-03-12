let stopAudio = false;
let playWordIndex = 0;
let delayRead = 1500; // millisecond

const addTranslation = document.querySelector("#addTranslation");
let addTranslationCheckbox = false;

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

            let soundFileName = wordSpan.dataset.word_en.replace(' ', '_');
            soundFileName = soundFileName.toString().toLowerCase();
            const soundFilePathname = "../assets/sound/th/" + soundFileName + ".mp3";

            playWord(soundFilePathname);

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
        /*
        console.log(playWordIndex);
        console.log(wordSpan);
        */
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
/*
document.getElementById('buttonStop').addEventListener('click', function () {
    stopAudio = true;
    //    pausedWordIndex = 0;
    playWordIndex = 0;
    addTranslationCheckbox = false;
    document.getElementById('wordContainer').innerText = "";
});
*/
function readAloud(dictionary) {
    //    const wordContainer = document.getElementById('wordContainer');

    wordContainer.innerText = "";

    dictionary.forEach(function (item) {

        const wordSpan_th = document.createElement('span');
        wordSpan_th.textContent = item.word_th;
        wordSpan_th.lang = "TH";
        wordSpan_th.dataset.word_en = item.word_en;

        wordContainer.appendChild(wordSpan_th);
        wordContainer.appendChild(document.createTextNode(' ')); // Add space between words

        wordSpan_th.addEventListener('click', function () {

            let soundFileName = item.word_en.replace(' ', '_');
            soundFileName = soundFileName.toString().toLowerCase();
            const soundFilePathname = "../assets/sound/th/" + soundFileName + ".mp3";

            playWord(soundFilePathname);
            wordSpan_th.classList.add('highlight-red');
        });

        if (addTranslationCheckbox) {
            const wordSpan_en = document.createElement('span');
            wordSpan_en.textContent = " (" + item.word_en + ") ";
            wordSpan_en.classList.add('font-size-small');

            // word_en used for sound pathname
            wordSpan_en.dataset.word_en = item.word_en;

            wordContainer.appendChild(wordSpan_en);
            wordContainer.appendChild(document.createTextNode(' ')); // Add space between words

            wordSpan_en.addEventListener('click', function () {

                let soundFileName = item.word_en.replace(' ', '_');
                soundFileName = soundFileName.toString().toLowerCase();
                const soundFilePathname = "../assets/sound/th/" + soundFileName + ".mp3";

                playWord(soundFilePathname);
                wordSpan_en.classList.add('highlight-red');
            });


        }

    });
}

function playWord(soundFile) {

    //   const soundPath = "./assets/sound/" + sound_th;
    if (soundFile != undefined) {
        let audio = new Audio(soundFile);
        audio.play();
    }
    /*
        // Speak word
    var synth = window.speechSynthesis;
    var utterThis = new SpeechSynthesisUtterance(word);
    synth.speak(utterThis);
    */

}

