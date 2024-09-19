const dictionaryGeneral = [
    { en_word: "hello", th_word: "สวัสดี", pronunciation: "sà-wàt-dii", ex_en: "hello", ex_pronunciation: "sà-wàt-dii-khráp", ex_th: "สวัสดีครับ" },
    { en_word: "thank you", th_word: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun", en_ex: "", ex_th: "" },
    { en_word: "never mind", th_word: "ไม่เป็นไร", pronunciation: "mâi-bpen-rai", en_ex: "", ex_th: "" },
    { en_word: "sorry; excuse me", th_word: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot", en_ex: "", ex_th: "" },
    { en_word: "nice to meet you", th_word: "ยินดีทีได้รู้จัก", pronunciation: "yin-dii tîi dâai rúu-jàk", en_ex: "", ex_th: "" },
    { en_word: "how about you?", th_word: "แล้ว คุณล่ะ", pronunciation: "khun la", en_ex: "", ex_th: "" },
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
    { en_word: "to wake up", th_word: "ตืxน", pronunciation: "dtɯ̀ɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
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
    { en_word: "to do or make", th_word: "ทํา", pronunciation: "tham", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "food", th_word: "อาหาร", pronunciation: "aa-hǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "school", th_word: "โรงเรียน", pronunciation: "rooŋ-rian", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "book", th_word: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "market", th_word: "ตลาด", pronunciation: "dtà-làat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "song", th_word: "เพลง", pronunciation: "phleeŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "home work", th_word: "การบ้าน", pronunciation: "gaan-bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "coffee", th_word: "กาแฟ", pronunciation: "gaa-fɛɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "language", th_word: "ภาษา", pronunciation: "phaa-sǎa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "like", th_word: "ชอบ", pronunciation: "chɔ̂ɔp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "yes/no", th_word: "ไหม/มัย", pronunciation: "mǎi/mái", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "do", th_word: "ทํา", pronunciation: "tham", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "and", th_word: "และ", pronunciation: "lɛ́", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "multiple answers", th_word: "บ้าง", pronunciation: "bâaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "do or make", th_word: "ทํา", pronunciation: "tham", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to work", th_word: "ทํางาน", pronunciation: "tham ŋaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to do homework", th_word: "ทําการบ้าน", pronunciation: "tham gaan-bânn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to do housework", th_word: "ทํางานบ้าน", pronunciation: "tham ŋaan-bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to cook", th_word: "ทําอาหาร", pronunciation: "tham aa-hǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to drive a car", th_word: "ขับรถ", pronunciation: "khàp rót", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to ride a motorbike", th_word: "ขีeมอเตอร์ไซค์", pronunciation: "khìi mɔɔ-dtəə-sai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to ride a bicycle", th_word: "ขีeจักรยาน", pronunciation: "khiì jàk-grà-yaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to talk with freinds", th_word: "คุยกับเพืeอน", pronunciation: "khuy gàp phɯ̂an", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to study Thai", th_word: "เรียนภาษาไทย", pronunciation: "rian phaa-sǎa thai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to return home", th_word: "กลับบ้าน", pronunciation: "glàp bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shopping", th_word: "ซือของ", pronunciation: "sɯ́ ɯ-khɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "travel or hang out", th_word: "ไปเทีeยว", pronunciation: "bpai-thiâw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "watch movie", th_word: "ดูหนัง", pronunciation: "duu nǎŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "can", th_word: "ได้", pronunciation: "dâay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to sit", th_word: "นั&ง", pronunciation: "nâŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to stand", th_word: "ยืน", pronunciation: "yɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to run", th_word: "วิ&ง", pronunciation: "wîŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to swim", th_word: "ว่ายนํา", pronunciation: "wâay-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to do the laundry", th_word: "ซักผ้า", pronunciation: "sák-phâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to wash the dishes", th_word: "ล้างจาน", pronunciation: "láaŋ jaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to rest", th_word: "พักผ่อน", pronunciation: "phák-phɔ̀ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to stroll", th_word: "เดินเล่น", pronunciation: "dəən-lên", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to listen to music", th_word: "ฟังเพลง", pronunciation: "faŋ pleeŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to sing", th_word: "ร้องเพลง", pronunciation: "rɔ́ɔŋ pleeŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "will", th_word: "จะ", pronunciation: "jà", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "-ing", th_word: "กําลัง", pronunciation: "gam-laŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "-ing", th_word: "อยู่", pronunciation: "yùu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "small", th_word: "เล็ก", pronunciation: "lék", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "big", th_word: "ใหญ่", pronunciation: "yài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "short (length)", th_word: "สัäน", pronunciation: "sân", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "long", th_word: "ยาว", pronunciation: "yaaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "short (height)", th_word: "เตีย", pronunciation: "dtîa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "tall (height)", th_word: "สูง", pronunciation: "sǔuŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "good", th_word: "ดี", pronunciation: "dii", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "bad or terrible", th_word: "แย่", pronunciation: "yɛ̂ɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hot", th_word: "ร้อน", pronunciation: "rɔ́ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "cool or iced", th_word: "เย็น", pronunciation: "yen", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "cold", th_word: "หนาว", pronunciation: "nǎaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "cheap", th_word: "ถูก", pronunciation: "thùuk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "expensive", th_word: "แพง", pronunciation: "phɛɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "slow", th_word: "ช้า", pronunciation: "cháa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fast", th_word: "เร็ว", pronunciation: "rew", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "beautiful or pretty", th_word: "สวย", pronunciation: "sǔay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "handsome", th_word: "หล่อ", pronunciation: "lɔ̀ɔ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "not", th_word: "ไม่", pronunciation: "mâi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "delicious", th_word: "อร่อย", pronunciation: "à-rɔ̀ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fun or enjoyable", th_word: "สนุก", pronunciation: "sà-nùk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hungry", th_word: "หิว", pronunciation: "hǐw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "full", th_word: "อิ:ม", pronunciation: "ìm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fat", th_word: "อ้วน", pronunciation: "ûan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "skinny", th_word: "ผอม", pronunciation: "phɔ̌ɔm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "tired", th_word: "เหนื:อย", pronunciation: "nɯay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sleepy", th_word: "ง่วง", pronunciation: "ŋûaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "difficult", th_word: "ยาก", pronunciation: "yâak", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "easy", th_word: "ง่าย", pronunciation: "ŋâay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "clean", th_word: "สะอาด", pronunciation: "sà-àat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "dirty", th_word: "สกปรก", pronunciation: "sòk-gà-bpròk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "rich", th_word: "รวย", pronunciation: "ruay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "poor", th_word: "จน", pronunciation: "jon", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "new", th_word: "ใหม่", pronunciation: "mài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "old", th_word: "เก่า/แก่", pronunciation: "gàw or gɛ̀ɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "how", th_word: "ยังไง", pronunciation: "yaŋ-ŋai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "school", th_word: "โรงเรียน", pronunciation: "rooŋ-rian", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shoes", th_word: "รองเท้า", pronunciation: "rɔɔŋ-tháw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "book", th_word: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "bathroom", th_word: "ห้องนําƒ", pronunciation: "hɔ̂ɔŋ-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "Bangkok", th_word: "กรุงเทพฯ", pronunciation: "gruŋ-thêep", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shirt", th_word: "เสือ", pronunciation: "sɯ̂a", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "Thailand", th_word: "ประเทศไทย", pronunciation: "bprà-thêet thai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "and", th_word: "และ", pronunciation: "lɛ́", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "but", th_word: "แต่", pronunciation: "dtɛ̀ɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "more than", th_word: "กว่า", pronunciation: "gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "more than / rather than", th_word: "มากกว่า", pronunciation: "mâak gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "than", th_word: "กว่า", pronunciation: "gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "less than", th_word: "น้อยกว่า", pronunciation: "nɔ́ɔy gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "the most", th_word: "ทีสุด", pronunciation: "thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "better", th_word: "ดีกว่า", pronunciation: "dii gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "the best", th_word: "ดีที:สดุ", pronunciation: "dii thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "better", th_word: "เก่งกว่า", pronunciation: "gèŋ gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "the best", th_word: "เก่งทีส", pronunciation: "gèŋ thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "less", th_word: "น้ อยกว่า", pronunciation: "nɔ́ɔy gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "least", th_word: "น้อยทีสดุ", pronunciation: "nɔ́ɔy thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "more", th_word: "มากกว่า", pronunciation: "mâak gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "the most", th_word: "มากทีสดุ", pronunciation: "mâak thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //    { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
/*
const dictionaryNumbers = [
    { en_word: "one", th_word: "หนึ$ง", pronunciation: "nɯŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "two", th_word: "สอง", pronunciation: "sɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "three", th_word: "สาม", pronunciation: "sǎam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "four", th_word: "สี$", pronunciation: "sìi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "five", th_word: "ห้า", pronunciation: "hâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "six", th_word: "หก", pronunciation: "hòk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "seven", th_word: "เจ็ด", pronunciation: "jèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eight", th_word: "แปด", pronunciation: "bpɛ̀ɛt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "nine", th_word: "เก้า", pronunciation: "gâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "ten", th_word: "สิบ", pronunciation: "sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eleven", th_word: "สิบเอ็ด", pronunciation: "sìp-èt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "twelve", th_word: "สิบสอง", pronunciation: "sìp-sɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "thirteen", th_word: "สิบสาม", pronunciation: "sìp-sǎam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fourteen", th_word: "สิบสี$", pronunciation: "sìp-sìi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fifteen", th_word: "สิบห้า", pronunciation: "sìp-hâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sixteen", th_word: "สิบหก", pronunciation: "sìp-hòk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "seventeen", th_word: "สิบเจ็ด", pronunciation: "sìp-jèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eighteen", th_word: "สิบแปด", pronunciation: "sìp-bpɛ̀ɛt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "nineteen", th_word: "สิบเก้า", pronunciation: "sìp-gâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "twenty", th_word: "ยีส$ ิบ", pronunciation: "yîi-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "thirsty", th_word: "สามสิบ", pronunciation: "sǎam-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "forty", th_word: "สีสบิ", pronunciation: "sìi-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fifty", th_word: "ห้าสิบ", pronunciation: "hâa-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sixty", th_word: "หกสิบ", pronunciation: "hòk-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "seventy", th_word: "เจ็ดสิบ", pronunciation: "jèt-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eighty", th_word: "แปดสิบ", pronunciation: "bpɛ̀ɛt-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "ninety", th_word: "เก้าสิบ", pronunciation: "gâaw-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "one hundred", th_word: "หนึงร้อย", pronunciation: "nɯŋ-rɔ́ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "one thousand", th_word: "หนึงพัน", pronunciation: "nɯŋ-phan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "ten thousand", th_word: "หนึงหมืน", pronunciation: "nɯŋ-mɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "one hundred thousand", th_word: "หนึงแสน", pronunciation: "nɯŋ-sɛ̌ɛn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "one million", th_word: "หนึงล้าน", pronunciation: "nɯŋ-láan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "ten", th_word: "สิบ", pronunciation: "sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hundred", th_word: "ร้อย", pronunciation: "rɔ́ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "thousand", th_word: "พัน", pronunciation: "phan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "ten thousand", th_word: "หมืน", pronunciation: "mɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hundred thousand", th_word: "แสน", pronunciation: "sɛ̌ɛn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "million", th_word: "ล้าน", pronunciation: "láan", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //    { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
    //    { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
*/

const dictionaryNumbers = [
    { en_word: "one", th_word: "หนึ$ง", pronunciation: "nɯŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "two", th_word: "สอง", pronunciation: "sɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "three", th_word: "สาม", pronunciation: "sǎam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "four", th_word: "สี$", pronunciation: "sìi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "five", th_word: "ห้า", pronunciation: "hâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
];

const dictionaryIncorrectAnswers = [];

let wordIndex = 0;
let dictionary = dictionaryGeneral;
let dictionaryName = "General dictionary"
let lastDictionary = dictionary;
let NoAnswerChoices = 3;
let correctAnswerCount = 0;
let incorrectAnswerCount = 0;
let attemptAnswerCount = 0;
let randomize = false;

const selectDictionary = document.getElementById("selectDictionary");
const incorrectAnswersOnly = document.getElementById("incorrectAnswersOnly");
const randomizeCheckbox = document.getElementById("randomize");

initialize();
function initialize() {
    setDictionary();
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
    /*
        if (selectDictionary.value === "dictionaryIncorrectAnswers"
            && incorrectAnswerCount > NoAnswerChoices) {  // 4 words for 1 multiple choice Q/A
            setDictionary();
        } else if (selectDictionary.value != "dictionaryIncorrectAnswers") {
            setDictionary();
        }
    */
    setDictionary();
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

randomizeCheckbox.addEventListener("change", () => {
    if (randomizeCheckbox.checked) {
        randomize = true;
    } else {
        randomize = false;
    }
    setDictionary();
});


function setDictionary() {


    if (selectDictionary.value === "dictionaryIncorrectAnswers"
        && incorrectAnswerCount > NoAnswerChoices) {  // 4 words for 1 multiple choice Q/A
        dictionaryName = " Incorrectly answered words ";
        dictionary = [...dictionaryIncorrectAnswers];
    } else if (selectDictionary.value === "dictionaryNumbers") {
        dictionaryName = " Numbers ";
        dictionary = [...dictionaryNumbers];
    } else if (selectDictionary.value === "dictionaryAll") {
        const dictA = [...dictionaryGeneral];
        const dictB = [...dictionaryNumbers];
        dictionary = dictA.concat(dictB);
    } else {
        dictionaryName = " General ";
        dictionary = [...dictionaryGeneral];
    }

    if (randomize == true) {
        dictionary = shuffle(dictionary);
    } else {
        //       dictionary = dictionary.toSorted();
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
    let randomWords = [];

    const currentWord = document.getElementById("currentWord");
    const choiceWords = document.getElementById("choiceWords");
    choiceWords.innerHTML = "";

    currentWord.textContent = dictionary[questionWordIndex].en_word;

    // get multiple choice word indexes, add index for correct answer, shuffle the array
    randomWords = getRandomIntArray(questionWordIndex, dictionary.length);
    randomWords.push(questionWordIndex); // add index for correct word
    let shuffledWords = [];
    shuffledWords = shuffle(randomWords);

    shuffledWords.forEach(
        (userSelectedIndex) => {
            const divChoiceWord = document.createElement("div");

            const buttonChoiceWord = document.createElement("button");
            buttonChoiceWord.textContent = dictionary[userSelectedIndex].pronunciation;
            divChoiceWord.appendChild(buttonChoiceWord);
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
            divChoiceWord.appendChild(spanChoiceWordTh);

            //            spanChoiceWordTh.classList.add("button");
            //            choiceWords.appendChild(spanChoiceWordTh);

            choiceWords.appendChild(divChoiceWord);

        });


    const exampleContainer = document.getElementById("example");
    exampleContainer.innerHTML = "";

    const spanExampleEn = document.createElement("span");
    spanExampleEn.textContent = dictionary[questionWordIndex].ex_en;
    exampleContainer.appendChild(spanExampleEn);

    const spanExamplePronunciation = document.createElement("div");
    spanExamplePronunciation.textContent = dictionary[questionWordIndex].ex_pronunciation;
    exampleContainer.appendChild(spanExamplePronunciation);

    const spanExampleTh = document.createElement("div");
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

