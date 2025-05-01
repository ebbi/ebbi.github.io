// This script handles the display of book details and audio playback for a language learning application.
const books = [
    {
        "title": "Book LS - 1",
        "lessons": [
            {
                "name": "Greetings",
                "vocabulary": [
                    { en: "house", th: "บ้าน", hint: "bâan" },
                    { en: "school", th: "โรงเรียน", hint: "rooŋ-rian" },
                    { en: "coffee", th: "กาแฟ", hint: "gaa-fɛɛ" },
                    { en: "food", th: "อาหาร", hint: "aa-hǎan" },
                    { en: "sleep", th: "นอน", hint: "nɔɔn" },
                    { en: "banana", th: "กล้วย", hint: "gluay" },
                    { en: "family", th: "ครอบครัว", hint: "khroop-khrua" },
                    { en: "dog", th: "หมา", hint: "H̄mā" },
                    { en: "lonely", th: "เหงา", hint: "H̄engā" },
                    { en: "book", th: "หนังสือ", hint: "nǎŋ-sɯ̌ɯ" },
                    { en: "woman", th: "ผู้หญิง", hint: "P̄hū̂ ỵing" },
                    { en: "hot", th: "ร้อน", hint: "rɔ́ɔn" },
                    { en: "horse", th: "ม้า", hint: "M̂ā" },
                    { en: "friend", th: "เพื่อน", hint: "phɯ̂an" },
                    { en: "hello", th: "สวัสดี", hint: "sà-wàt-dii" },
                    { en: "thank you", th: "ขอบคุณ", hint: "kɔ̀ɔp-kun" },
                    { en: "never mind", th: "ไม่เป็นไร", hint: "mâi-bpen-rai" },
                    { en: "excuse me", th: "ขอโทษ", hint: "kɔ̌ɔ-tôot" },
                    { en: "nice to meet you", th: "ยินดีทีได้รู้จัก", hint: "yin-dii tîi dâai rúu-jàk" },
                    { en: "how about you", th: "แล้วคุณล่ะ", hint: "leaw khun la" },
                    { en: "I for male", th: "ผม", hint: "phǒm" },
                    { en: "I for female", th: "ฉัน", hint: "chǎn" },
                    { en: "you", th: "คุณ", hint: "khun" },
                    { en: "he or she", th: "เขา", hint: "khǎw" },
                    { en: "we or us", th: "พวกเรา", hint: "phûak-raw" },
                    { en: "they or them", th: "พวกเขา", hint: "phûak-khǎw" },
                    { en: "belong to or of", th: "ของ", hint: "khɔ̌ɔŋ" },
                    { en: "my or mine for male", th: "ของผม", hint: "khɔ̌ɔŋ phǒm" },
                    { en: "my or mine for female", th: "ของฉัน", hint: "khɔ̌ɔŋ chǎn" },
                    { en: "your or yours", th: "ของคุณ", hint: "khɔ̌ɔŋ khun" },
                    { en: "his or hers", th: "ของเขา", hint: "khɔ̌ɔŋ khǎw" },
                    { en: "our or ours", th: "ของพวกเรา", hint: "khɔ̌ɔŋ phûak-raw" },
                    { en: "their or theirs", th: "ของพวกเขา", hint: "khɔ̌ɔŋ phûak-khǎw" },
                    { en: "name", th: "ชือ", hint: "chʉ̂ʉ" },
                    { en: "first name", th: "ชือจริง", hint: "chʉ̂ʉ jiŋ" },
                    { en: "surname", th: "นามสกุล", hint: "naam-sà-gun" },
                    { en: "nickname", th: "ชื่อเล่น", hint: "chʉ̂ʉ lên" },
                    { en: "fine", th: "สบายดี", hint: "sà-baay-dii" },
                    { en: "pretty good", th: "ก็ดี", hint: "gɔ̂ɔ dii" },
                    { en: "so so", th: "เฉยเฉย", hint: "chə̌əy-chə̌əy" },
                    { en: "eat already", th: "กินแล้ว", hint: "gin lɛ́ɛw" },
                    { en: "not yet", th: "ยัง", hint: "yaŋ" },
                    { en: "come", th: "มา", hint: "maa" },
                    { en: "from", th: "จาก", hint: "jàak" },
                    { en: "where", th: "ทีไหน", hint: "thîi-nǎi" }

                ],
                "structure": [
                    { en: "What is your name?", th: "คุณชื่ออะไร" },
                    { en: "My name is Pairat the magnificent.", th: "ฉันชื่อ ไพรัช สุดสวย" }
                ]
            }
        ]
    },
];

let currentLesson = null;
let currentLanguage = 'en-EN';
let numberOfMultipleChoiceAnswers = 3;
let numberOfCorrectMultipleChoiceAnswer = 0;
let numberOfIncorrectMultipleChoiceAnswer = 0;
let incorrectMultipleChoiceAnswerVocabulary = [];
let incorrectMultipleChoiceAnswerOnly = false;

displayBookListLessons(books);

function displayBookListLessons(bookList) {
    const bookListContainer = document.getElementById('bookListContainer');
    bookListContainer.innerHTML = ''; // Clear previous content
    const summary = document.createElement('summary');
    summary.textContent = "Select a lesson to start";
    bookListContainer.appendChild(summary);

    books.forEach((book) => {
        const bookItem = document.createElement('details');
        bookItem.open = true; // Set to true if you want the book details to be open by default
        const summary = document.createElement('summary');
        summary.textContent = book.title + ' Lessons';
        bookItem.appendChild(summary);

        const lessonsList = document.createElement('ul');
        book.lessons.forEach((lesson) => {
            const lessonItem = document.createElement('li');
            lessonItem.textContent = lesson.name;
            lessonItem.style.cursor = 'pointer';
            lessonItem.addEventListener('click', () => {
                currentLesson = lesson;
                displayMultipleChoice(0, currentLesson.vocabulary, currentLanguage);
                displaySentenceStructure(lesson.structure);
            });

            lessonsList.appendChild(lessonItem);
        });
        bookItem.appendChild(lessonsList);

        bookListContainer.appendChild(bookItem);
    });
}

function displayMultipleChoice(wordIndex, vocabulary, currentLanguage) {
    const multipleChoiceContainer = document.getElementById('multipleChoiceContainer');
    multipleChoiceContainer.innerHTML = ''; // Clear previous content
    const multipleChoiceDetails = document.createElement('details');
    multipleChoiceDetails.open = true; // Set to true if you want the book details to be open by default
    const summary = document.createElement('summary');
    summary.textContent = "Multiple Choice Quiz";
    multipleChoiceDetails.appendChild(summary);
    multipleChoiceContainer.appendChild(multipleChoiceDetails);

    if (incorrectMultipleChoiceAnswerOnly) {
        const alert = document.createElement('p');
        alert.textContent = 'Only incorrectly answered questions are shown';
        multipleChoiceDetails.appendChild(alert);
    }

    const word = vocabulary[wordIndex];

    const questionContainer = document.createElement('div');
    questionContainer.id = 'questionContainer';

    const question = document.createElement('span');

    if (currentLanguage === 'en-EN') {
        question.textContent = `What is the Thai word for "${word.en}"?`;
    } else if (currentLanguage === 'th-TH') {
        question.textContent = `What is the English word for "${word.th}"?`;
    }
    questionContainer.appendChild(question);

    // Create radio button elements for selecting languages

    const languageSelection = document.createElement('div');
    languageSelection.id = 'languageSelection';

    var englishInput = document.createElement('input');
    englishInput.type = 'radio';
    englishInput.name = 'languageSelection';
    englishInput.value = 'english';
    englishInput.id = 'english';
    var englishLabel = document.createElement('label');
    englishLabel.style.display = 'inline-block';
    englishLabel.htmlFor = 'english';
    englishLabel.appendChild(document.createTextNode('English'));

    var thaiInput = document.createElement('input');
    thaiInput.type = 'radio';
    thaiInput.name = 'languageSelection';
    thaiInput.value = 'thai';
    thaiInput.id = 'thai';
    var thaiLabel = document.createElement('label');
    thaiLabel.style.display = 'inline-block';
    thaiLabel.htmlFor = 'thai';
    thaiLabel.appendChild(document.createTextNode('Thai'));

    // Add click event to handle language selection
    englishInput.addEventListener('click', function () {
        thaiInput.checked = false;
        englishInput.checked = true;
        currentLanguage = 'en-EN';
        displayMultipleChoice(wordIndex, vocabulary, currentLanguage);
    });

    thaiInput.addEventListener('click', function () {
        englishInput.checked = false;
        thaiInput.checked = true;
        currentLanguage = 'th-TH';
        displayMultipleChoice(wordIndex, vocabulary, currentLanguage);
    });

    if (currentLanguage === 'en-EN') {
        englishInput.checked = true;
        thaiInput.checked = false;
    }
    if (currentLanguage === 'th-TH') {
        englishInput.checked = false;
        thaiInput.checked = true;
    }

    // Append elements to the document
    languageSelection.appendChild(englishLabel);
    languageSelection.appendChild(englishInput);
    languageSelection.appendChild(thaiLabel);
    languageSelection.appendChild(thaiInput);

    questionContainer.appendChild(languageSelection);

    multipleChoiceDetails.appendChild(questionContainer);

    const answerChoiceIndices = getMultipleChoiceIndices(wordIndex, vocabulary);

    answerChoiceIndices.forEach((choiceIndex) => {
        const button = document.createElement('button');
        if (currentLanguage === 'en-EN') {
            button.textContent = vocabulary[choiceIndex].th + ` (${vocabulary[choiceIndex].hint})`;
        }
        if (currentLanguage === 'th-TH') {
            button.textContent = vocabulary[choiceIndex].en + ` (${vocabulary[choiceIndex].hint})`;
        }

        button.addEventListener('click', () => {
            if (choiceIndex === wordIndex) {
                numberOfCorrectMultipleChoiceAnswer++;
                button.classList = 'correctAnswerContainer';
                incorrectMultipleChoiceAnswerVocabulary.filter((item) => item === vocabulary[choiceIndex]);
            } else {
                numberOfIncorrectMultipleChoiceAnswer++;
                button.classList = 'incorrectAnswerContainer';
                incorrectMultipleChoiceAnswerVocabulary.push(vocabulary[choiceIndex]);
            }
            multipleChoiceFeedback();
            // replace space by underscore for audio filename    
            // const audioFilename = (vocabulary[choiceIndex].en.replace(/ /g, '_')).toLowerCase() + '.mp3';
            // playAudioFile(audioFilename);
            if (currentLanguage === 'en-EN') {
                textToSpeech(vocabulary[choiceIndex].th, 'th-TH');
                textToSpeech(vocabulary[choiceIndex].en, 'en-US');
            }
            if (currentLanguage === 'th-TH') {
                textToSpeech(vocabulary[choiceIndex].en, 'en-US');
                textToSpeech(vocabulary[choiceIndex].th, 'th-TH');
                // playAudioFile(vocabulary[choiceIndex].th_audio);
            }
            // playAudioFile(vocabulary[choiceIndex].th_audio);

        });

        multipleChoiceDetails.appendChild(button);
    });

    const multipleChoiceNav = document.createElement('nav');
    multipleChoiceNav.id = 'multipleChoiceNav';

    const previous = document.createElement('button');
    previous.textContent = 'Previous';
    previous.addEventListener('click', () => {
        if (wordIndex - 1 >= 0) {
            wordIndex--;
        } else {
            wordIndex = vocabulary.length - 1;
        }
        displayMultipleChoice(wordIndex, vocabulary, currentLanguage);
    }
    );
    multipleChoiceNav.appendChild(previous);

    const next = document.createElement('button');
    next.textContent = 'Next';
    next.addEventListener('click', () => {
        if (wordIndex + 1 < vocabulary.length) {
            wordIndex++;
        } else {
            wordIndex = 0;
        }
        displayMultipleChoice(wordIndex, vocabulary, currentLanguage);
    });
    multipleChoiceNav.appendChild(next);

    const incorrectMultipleChoiceAnswerCheckbox = document.createElement('input');
    incorrectMultipleChoiceAnswerCheckbox.type = 'checkbox';
    incorrectMultipleChoiceAnswerCheckbox.id = 'incorrectMultipleChoiceAnswerCheckbox';
    if (incorrectMultipleChoiceAnswerOnly) {
        incorrectMultipleChoiceAnswerCheckbox.checked = true;
    } else {
        incorrectMultipleChoiceAnswerCheckbox.checked = false;
    }
    incorrectMultipleChoiceAnswerCheckbox.addEventListener('change', () => {
        const incorrectMultipleChoiceAnswerContainer = document.getElementById('incorrectMultipleChoiceAnswerContainer');
        // delete duplicates, convert array to new Set and back to array
        const incorrectMultipleChoiceAnswerVocabularySet = new Set(incorrectMultipleChoiceAnswerVocabulary);
        incorrectMultipleChoiceAnswerVocabulary = [...incorrectMultipleChoiceAnswerVocabularySet];
        numberOfIncorrectMultipleChoiceAnswer = incorrectMultipleChoiceAnswerVocabularySet.size;
        multipleChoiceFeedback();
        if (incorrectMultipleChoiceAnswerCheckbox.checked && incorrectMultipleChoiceAnswerVocabularySet.size > numberOfMultipleChoiceAnswers) {
            incorrectMultipleChoiceAnswerOnly = true;
            displayMultipleChoice(0, incorrectMultipleChoiceAnswerVocabulary, currentLanguage);
        } else if (incorrectMultipleChoiceAnswerCheckbox.checked && incorrectMultipleChoiceAnswerVocabularySet.size <= numberOfMultipleChoiceAnswers) {
            incorrectMultipleChoiceAnswerOnly = false;
            const n = numberOfMultipleChoiceAnswers + 1;
            alert(n + ' incorrect answers are needed; incorrect answers so far = ' + incorrectMultipleChoiceAnswerVocabularySet.size);
            incorrectMultipleChoiceAnswerCheckbox.checked = false;
            displayMultipleChoice(wordIndex, currentLesson.vocabulary, currentLanguage);
        } else if (!incorrectMultipleChoiceAnswerCheckbox.checked) {
            incorrectMultipleChoiceAnswerOnly = false;
            displayMultipleChoice(0, currentLesson.vocabulary, currentLanguage);
        }
    }

    );
    multipleChoiceNav.appendChild(incorrectMultipleChoiceAnswerCheckbox);
    const incorrectMultipleChoiceAnswerLabel = document.createElement('label');
    incorrectMultipleChoiceAnswerLabel.textContent = 'Show Only Incorrectly Answered Questions';
    incorrectMultipleChoiceAnswerLabel.style.cursor = 'pointer';
    incorrectMultipleChoiceAnswerLabel.style.display = 'inline-block';
    incorrectMultipleChoiceAnswerLabel.style.fontSize = 'small';
    incorrectMultipleChoiceAnswerLabel.setAttribute('for', 'incorrectMultipleChoiceAnswerCheckbox');
    multipleChoiceNav.appendChild(incorrectMultipleChoiceAnswerLabel);

    const multipleChoiceFeedbackContainer = document.createElement('div');
    multipleChoiceFeedbackContainer.id = 'multipleChoiceFeedbackContainer';
    multipleChoiceDetails.appendChild(multipleChoiceFeedbackContainer);
    multipleChoiceFeedback();

    multipleChoiceDetails.appendChild(multipleChoiceNav);

}
function multipleChoiceFeedback() {
    const multipleChoiceFeedbackContainer = document.getElementById('multipleChoiceFeedbackContainer');
    multipleChoiceFeedbackContainer.innerHTML = ''; // Clear previous content
    const correctAnswerContainer = document.createElement('span');
    correctAnswerContainer.classList = 'correctAnswerContainer';
    correctAnswerContainer.textContent = `Correct Answers: ${numberOfCorrectMultipleChoiceAnswer}`;
    multipleChoiceFeedbackContainer.appendChild(correctAnswerContainer);
    const incorrectAnswerContainer = document.createElement('span');
    incorrectAnswerContainer.textContent = `Incorrect Answers: ${numberOfIncorrectMultipleChoiceAnswer}`;
    incorrectAnswerContainer.classList = 'incorrectAnswerContainer';
    multipleChoiceFeedbackContainer.appendChild(incorrectAnswerContainer);
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getMultipleChoiceIndices(wordIndex, dictionary) {
    let multipleChoiceIndices = [];
    multipleChoiceIndices.push(wordIndex);

    if (dictionary.length > numberOfMultipleChoiceAnswers) {
        let n = 0;
        while (n < numberOfMultipleChoiceAnswers) {
            r = getRandomInt(0, dictionary.length);
            if (!multipleChoiceIndices.includes(r)) {
                multipleChoiceIndices.push(r);
                n++;
            }
        }
    }
    return shuffle(multipleChoiceIndices);
}

function displaySentenceStructure(sentenceStructure) {
    const sentenceStructureContainer = document.getElementById('sentenceStructureContainer');
    sentenceStructureContainer.innerHTML = ''; // Clear previous content

    const sentenceStructureDetails = document.createElement('details');
    sentenceStructureDetails.open = true; // Set to true if you want the book details to be open by default
    const summary = document.createElement('summary');
    summary.textContent = "Sentence Structure practice";
    sentenceStructureDetails.appendChild(summary);

    sentenceStructure.forEach((structure) => {
        const sentenceStructureItem = document.createElement('div');
        sentenceStructureItem.classList = 'sentenceStructureItem';

        const sentenceStructureEN = document.createElement('span');
        sentenceStructureEN.textContent = structure.en;
        sentenceStructureEN.style.cursor = 'pointer';
        sentenceStructureItem.appendChild(sentenceStructureEN);

        sentenceStructureEN.addEventListener('click', () => {
            textToSpeech(structure.en, 'en-US');
        });

        const sentenceStructureTH = document.createElement('button');
        sentenceStructureTH.textContent = structure.th;
        sentenceStructureItem.appendChild(sentenceStructureTH);

        sentenceStructureTH.addEventListener('click', () => {
            //            playAudioFile(structure.th_audio);
            textToSpeech(structure.th, 'th-TH');
        });

        sentenceStructureDetails.appendChild(sentenceStructureItem);
        sentenceStructureContainer.appendChild(sentenceStructureDetails);

    });
}

function playAudioFile(filename) {
    let audioPathname = '/assets/audio/th/' + filename;
    if (audioPathname === undefined) {
        console.error('Audio file not found: ' + filename);

        return;
    }

    let audioPlayer = document.getElementById('audioPlayer');
    if (!audioPlayer) {
        audioPlayer = new Audio(audioPathname);
        audioPlayer.id = 'audioPlayer';
    }
    audioPlayer.src = audioPathname;
    audioPlayer.load();
    audioPlayer.play();
    audioPlayer.addEventListener('ended', () => {
        audioPlayer.remove();
    });

}

function textToSpeech(text, lang) {
    const speech = new SpeechSynthesisUtterance(text);
    //    speech.lang = 'th-TH';
    // speech.lang = 'en-US';
    speech.lang = lang;
    //  speech.text = text;
    //    speech.volume = 1; // From 0 to 1
    speech.rate = 1; // From 0.1 to 10
    speech.pitch = 1; // From 0 to 2
    window.speechSynthesis.speak(speech);
}

