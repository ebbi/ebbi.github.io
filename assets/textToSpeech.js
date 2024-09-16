const langs = [
    ["Afrikaans", ["af-ZA"]],
    ["አማርኛ", ["am-ET"]],
    ["Azərbaycanca", ["az-AZ"]],
    ["বাংলা", ["bn-BD", "বাংলাদেশ"], ["bn-IN", "ভারত"]],
    ["Bahasa Indonesia", ["id-ID"]],
    ["Bahasa Melayu", ["ms-MY"]],
    ["Català", ["ca-ES"]],
    ["Čeština", ["cs-CZ"]],
    ["Dansk", ["da-DK"]],
    ["Deutsch", ["de-DE"]],
    [
        "English",
        ["en-AU", "Australia"],
        ["en-CA", "Canada"],
        ["en-IN", "India"],
        ["en-KE", "Kenya"],
        ["en-TZ", "Tanzania"],
        ["en-GH", "Ghana"],
        ["en-NZ", "New Zealand"],
        ["en-NG", "Nigeria"],
        ["en-ZA", "South Africa"],
        ["en-PH", "Philippines"],
        ["en-GB", "United Kingdom"],
        ["en-US", "United States"],
    ],
    [
        "Español",
        ["es-AR", "Argentina"],
        ["es-BO", "Bolivia"],
        ["es-CL", "Chile"],
        ["es-CO", "Colombia"],
        ["es-CR", "Costa Rica"],
        ["es-EC", "Ecuador"],
        ["es-SV", "El Salvador"],
        ["es-ES", "España"],
        ["es-US", "Estados Unidos"],
        ["es-GT", "Guatemala"],
        ["es-HN", "Honduras"],
        ["es-MX", "México"],
        ["es-NI", "Nicaragua"],
        ["es-PA", "Panamá"],
        ["es-PY", "Paraguay"],
        ["es-PE", "Perú"],
        ["es-PR", "Puerto Rico"],
        ["es-DO", "República Dominicana"],
        ["es-UY", "Uruguay"],
        ["es-VE", "Venezuela"],
    ],
    ["Euskara", ["eu-ES"]],
    ["Filipino", ["fil-PH"]],
    ["Français", ["fr-FR"]],
    ["Basa Jawa", ["jv-ID"]],
    ["Galego", ["gl-ES"]],
    ["ગુજરાતી", ["gu-IN"]],
    ["Hrvatski", ["hr-HR"]],
    ["IsiZulu", ["zu-ZA"]],
    ["Íslenska", ["is-IS"]],
    ["Italiano", ["it-IT", "Italia"], ["it-CH", "Svizzera"]],
    ["ಕನ್ನಡ", ["kn-IN"]],
    ["ភាសាខ្មែរ", ["km-KH"]],
    ["Latviešu", ["lv-LV"]],
    ["Lietuvių", ["lt-LT"]],
    ["മലയാളം", ["ml-IN"]],
    ["मराठी", ["mr-IN"]],
    ["Magyar", ["hu-HU"]],
    ["ລາວ", ["lo-LA"]],
    ["Nederlands", ["nl-NL"]],
    ["नेपाली भाषा", ["ne-NP"]],
    ["Norsk bokmål", ["nb-NO"]],
    ["Polski", ["pl-PL"]],
    ["Português", ["pt-BR", "Brasil"], ["pt-PT", "Portugal"]],
    ["Română", ["ro-RO"]],
    ["සිංහල", ["si-LK"]],
    ["Slovenščina", ["sl-SI"]],
    ["Basa Sunda", ["su-ID"]],
    ["Slovenčina", ["sk-SK"]],
    ["Suomi", ["fi-FI"]],
    ["Svenska", ["sv-SE"]],
    ["Kiswahili", ["sw-TZ", "Tanzania"], ["sw-KE", "Kenya"]],
    ["ქართული", ["ka-GE"]],
    ["Հայերեն", ["hy-AM"]],
    [
        "தமிழ்",
        ["ta-IN", "இந்தியா"],
        ["ta-SG", "சிங்கப்பூர்"],
        ["ta-LK", "இலங்கை"],
        ["ta-MY", "மலேசியா"],
    ],
    ["తెలుగు", ["te-IN"]],
    ["Tiếng Việt", ["vi-VN"]],
    ["Türkçe", ["tr-TR"]],
    ["اُردُو", ["ur-PK", "پاکستان"], ["ur-IN", "بھارت"]],
    ["Ελληνικά", ["el-GR"]],
    ["български", ["bg-BG"]],
    ["Русский", ["ru-RU"]],
    ["Српски", ["sr-RS"]],
    ["Українська", ["uk-UA"]],
    ["한국어", ["ko-KR"]],
    [
        "中文",
        ["cmn-Hans-CN", "普通话 (中国大陆)"],
        ["cmn-Hans-HK", "普通话 (香港)"],
        ["cmn-Hant-TW", "中文 (台灣)"],
        ["yue-Hant-HK", "粵語 (香港)"],
    ],
    ["日本語", ["ja-JP"]],
    ["हिन्दी", ["hi-IN"]],
    ["ภาษาไทย", ["th-TH"]],
];


// Add an event listener for the mouseup event
document.addEventListener('mouseup', function () {

    var selectedText = window.getSelection().toString();

    if (selectedText.length > 0) {
        textToSpeech(selectedText);
    }
});

// Function to process the selected text
function textToSpeech(text) {

    console.log('Speaking text: ' + text);

    // Check if the browser supports the SpeechSynthesis interface
    if ('speechSynthesis' in window) {
        console.log('speechSynthesis is supported');

        const voices = window.speechSynthesis.getVoices();
        /*
                voices.forEach((item, index) => {
                    const option = document.createElement('option');
                    option.textContent = `${item.name} (${item.lang})`;
                    option.setAttribute('data-lang', item.lang);
                    option.setAttribute('data-name', item.name);
                    option.setAttribute('data-voice-uri', item.voiceURI);
                    option.setAttribute('data-pos', index);
                    document.getElementById("voiceSelect").appendChild(option);
                });
        */

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices[0]; // Choose the first available voice
        utterance.lang = 'th-TH';

        voices.forEach((item, index) => {
            if (item.lang === "th") {
                console.log('lang ' + item.lang + " index " + index + ' name ' + item.name);

                utterance.voice = voices[index];
            }
        });

        /*
                utterance.volume = 0.8; // 0 to 1
                utterance.rate = 1.2; // 0.1 to 10
                utterance.pitch = 1.1; // 0 to 2
        
                utterance.onstart = () => console.log('Speech started');
                utterance.onend = () => console.log('Speech ended');
                utterance.onerror = (event) => console.error('Speech error:', event.error);
                utterance.onpause = () => console.log('Speech paused');
                utterance.onresume = () => console.log('Speech resumed');
        */

        window.speechSynthesis.speak(utterance);

    } else {
        // Speech synthesis not supported
        console.log('Speech synthesis not supported in this browser');
    }

}
