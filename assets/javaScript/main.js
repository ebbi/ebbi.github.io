/*
// book 1
// Greeting
const dictionaryBook1Lesson1 = [
    { word_en: "house", word_th: "บ้าน", pronunciation: "bâan" },
    { word_en: "school", word_th: "โรงเรียน", pronunciation: "rooŋ-rian" },
    { word_en: "coffee", word_th: "กาแฟ", pronunciation: "gaa-fɛɛ" },
    { word_en: "food", word_th: "อาหาร", pronunciation: "aa-hǎan" },
    { word_en: "lie down or sleep", word_th: "นอน", pronunciation: "nɔɔn" },
    { word_en: "banana", word_th: "กล้วย", pronunciation: "gluay" },
    { word_en: "family", word_th: "ครอบครัว", pronunciation: "khroop-khrua" },
    { word_en: "dog", word_th: "หมา", pronunciation: "H̄mā" },
    { word_en: "lonely", word_th: "เหงา", pronunciation: "H̄engā" },
    { word_en: "book", word_th: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ" },
    { word_en: "woman", word_th: "ผู้หญิง", pronunciation: "P̄hū̂ ỵing" },
    { word_en: "hot", word_th: "ร้อน", pronunciation: "rɔ́ɔn" },
    { word_en: "horse", word_th: "ม้า", pronunciation: "M̂ā" },
    { word_en: "friend", word_th: "เพื่อน", pronunciation: "phɯ̂an" },
    { word_en: "hello", word_th: "สวัสดี", pronunciation: "sà-wàt-dii" },
    { word_en: "thank you", word_th: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun" },
    { word_en: "never mind", word_th: "ไม่เป็นไร", pronunciation: "mâi-bpen-rai" },
    { word_en: "sorry/excuse me", word_th: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot" },
    { word_en: "nice to meet you", word_th: "ยินดีทีได้รู้จัก", pronunciation: "yin-dii tîi dâai rúu-jàk" },
    { word_en: "how about you?", word_th: "แล้ว คุณล่ะ", pronunciation: "khun la" },
    { word_en: "I for male", word_th: "ผม", pronunciation: "phǒm" },
    { word_en: "I for female", word_th: "ฉัน", pronunciation: "chǎn" },
    { word_en: "you", word_th: "คุณ", pronunciation: "khun" },
    { word_en: "he/she", word_th: "เขา", pronunciation: "khǎw" },
    { word_en: "we/us", word_th: "พวกเรา", pronunciation: "phûak-raw" },
    { word_en: "they/them", word_th: "พวกเขา", pronunciation: "phûak-khǎw" },
    { word_en: "belong to/of", word_th: "ของ", pronunciation: "khɔ̌ɔŋ" },
    { word_en: "my/mine for male", word_th: "ของผม", pronunciation: "(khɔ̌ɔŋ) phǒm" },
    { word_en: "my/mine for female", word_th: "ของฉัน", pronunciation: "(khɔ̌ɔŋ) chǎn" },
    { word_en: "your/yours", word_th: "ของคุณ", pronunciation: "(khɔ̌ɔŋ) khun" },
    { word_en: "his/her/hers", word_th: "ของเขา", pronunciation: "(khɔ̌ɔŋ) khǎw" },
    { word_en: "our/ours", word_th: "ของพวกเรา", pronunciation: "(khɔ̌ɔŋ) phûak-raw" },
    { word_en: "their/theirs", word_th: "ของพวกเขา", pronunciation: "khɔ̌ɔŋ phûak-khǎw" },
    { word_en: "name", word_th: "ชือ", pronunciation: "chʉ̂ʉ" },
    { word_en: "first name", word_th: "ชื#อจริง", pronunciation: "chʉ̂ʉ jiŋ" },
    { word_en: "surname", word_th: "นามสกุล", pronunciation: "naam-sà-gun" },
    { word_en: "nickname", word_th: "อเล่น", pronunciation: "chʉ̂ʉ lên" },
    { word_en: "fine", word_th: "สบายดี", pronunciation: "sà-baay-dii" },
    { word_en: "pretty good", word_th: "ก็ดี", pronunciation: "gɔ̂ɔ dii" },
    { word_en: "so so", word_th: "เฉย เฉย", pronunciation: "chə̌əy-chə̌əy" },
    { word_en: "eat already", word_th: "กินแล้ว", pronunciation: "gin lɛ́ɛw" },
    { word_en: "no", word_th: "ยัง", pronunciation: "yaŋ" },
    { word_en: "come", word_th: "มา", pronunciation: "maa" },
    { word_en: "from", word_th: "จาก", pronunciation: "jàak" },
    { word_en: "where", word_th: "ทีไหน", pronunciation: "thîi-nǎi" },
];
// What are you doing
const dictionaryBook1Lesson2 = [
    { word_en: "eat", word_th: "กิน", pronunciation: "gin" },
    { word_en: "drink", word_th: "ดืxม", pronunciation: "dʉ̀ʉm" },
    { word_en: "watch", word_th: "ดู", pronunciation: "duu" },
    { word_en: "listen", word_th: "ฟัง", pronunciation: "faŋ" },
    { word_en: "wake up", word_th: "ตืxน", pronunciation: "dtɯɯn" },
    { word_en: "lie down/sleep", word_th: "นอน", pronunciation: "nɔɔn" },
    { word_en: "walk", word_th: "เดิน", pronunciation: "dəən" },
    { word_en: "speak", word_th: "พูด", pronunciation: "phûut" },
    { word_en: "study", word_th: "เรียน", pronunciation: "rian" },
    { word_en: "write", word_th: "เขียน", pronunciation: "khǐan" },
    { word_en: "read", word_th: "อ่าน", pronunciation: "àan" },
    { word_en: "take a shower", word_th: "อาบนํ âา", pronunciation: "àap-náam" },
    { word_en: "play", word_th: "เล่น", pronunciation: "lên" },
    { word_en: "exercise", word_th: "ออกกําลังกาย", pronunciation: "ɔ̀ɔk-gam-lang-gaai" },
    { word_en: "go", word_th: "ไป", pronunciation: "bpai" },
    { word_en: "do/make", word_th: "ทํา", pronunciation: "tham" },
    { word_en: "Normally/Usually", word_th: "ปกติ", pronunciation: "bpòk-gà-dtì" },
    { word_en: "food", word_th: "อาหาร", pronunciation: "aa-hǎan" },
    { word_en: "book", word_th: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ" },
    { word_en: "market", word_th: "ตลาด", pronunciation: "dtà-làat" },
    { word_en: "song", word_th: "เพลง", pronunciation: "phleeŋ" },
    { word_en: "home work", word_th: "การบ้าน", pronunciation: "gaan-bâan" },
    { word_en: "coffee", word_th: "กาแฟ", pronunciation: "gaa-fɛɛ" },
    { word_en: "language", word_th: "ภาษา", pronunciation: "phaa-sǎa" },
    { word_en: "like", word_th: "ชอบ", pronunciation: "chɔ̂ɔp" },
    { word_en: "yes/no", word_th: "ไหม/มัย", pronunciation: "mǎi/mái" },
    { word_en: "do", word_th: "ทํา", pronunciation: "tham" },
    { word_en: "multiple answers", word_th: "บ้าง", pronunciation: "bâaŋ" },
    { word_en: "do/make", word_th: "ทํา", pronunciation: "tham" },
    { word_en: "work", word_th: "ทํางาน", pronunciation: "tham ŋaan" },
    { word_en: "do homework", word_th: "ทําการบ้าน", pronunciation: "tham gaan-bânn" },
    { word_en: "do housework", word_th: "ทํางานบ้าน", pronunciation: "tham ŋaan-bâan" },
    { word_en: "cook", word_th: "ทําอาหาร", pronunciation: "tham aa-hǎan" },
    { word_en: "drive a car", word_th: "ขับรถ", pronunciation: "khàp rót" },
    { word_en: "ride a motorbike", word_th: "ขีeมอเตอร์ไซค์", pronunciation: "khìi mɔɔ-dtəə-sai" },
    { word_en: "ride a bicycle", word_th: "ขีeจักรยาน", pronunciation: "khiì jàk-grà-yaan" },
    { word_en: "talk with freinds", word_th: "คุยกับเพืeอน", pronunciation: "khuy gàp phɯ̂an" },
    { word_en: "study Thai", word_th: "เรียนภาษาไทย", pronunciation: "rian phaa-sǎa thai" },
    { word_en: "return home", word_th: "กลับบ้าน", pronunciation: "glàp bâan" },
    { word_en: "shopping", word_th: "ซือของ", pronunciation: "sɯ́ɯ-khɔ̌ɔŋ" },
    { word_en: "travel/hang out", word_th: "ไปเทีeยว", pronunciation: "bpai-thiâw" },
    { word_en: "watch movie", word_th: "ดูหนัง", pronunciation: "duu nǎŋ" },
    { word_en: "can", word_th: "ได้", pronunciation: "dâay" },
    { word_en: "sit", word_th: "นัง", pronunciation: "nâŋ" },
    { word_en: "stand", word_th: "ยืน", pronunciation: "yɯɯn" },
    { word_en: "run", word_th: "วิง", pronunciation: "wîŋ" },
    { word_en: "swim", word_th: "ว่ายนํา", pronunciation: "wâay-náam" },
    { word_en: "do the laundry", word_th: "ซักผ้า", pronunciation: "sák-phâa" },
    { word_en: "wash the dishes", word_th: "ล้างจาน", pronunciation: "láaŋ jaan" },
    { word_en: "rest", word_th: "พักผ่อน", pronunciation: "phák-phɔ̀ɔn" },
    { word_en: "stroll", word_th: "เดินเล่น", pronunciation: "dəən-lên" },
    { word_en: "listen to music", word_th: "ฟังเพลง", pronunciation: "faŋ pleeŋ" },
    { word_en: "sing", word_th: "ร้องเพลง", pronunciation: "rɔ́ɔŋ pleeŋ" },
    { word_en: "will", word_th: "จะ", pronunciation: "jà" },
    { word_en: "-ing", word_th: "กําลัง", pronunciation: "gam-laŋ" },
    { word_en: "-ing", word_th: "อยู่", pronunciation: "yùu" }
];
// How is Thai food Adjective/Adverb
const dictionaryBook1Lesson3 = [
    { word_en: "small", word_th: "เล็ก", pronunciation: "lék" },
    { word_en: "big", word_th: "ใหญ่", pronunciation: "yài" },
    { word_en: "short (length)", word_th: "สัäน", pronunciation: "sân" },
    { word_en: "long", word_th: "ยาว", pronunciation: "yaaw" },
    { word_en: "short (height)", word_th: "เตีย", pronunciation: "dtîa" },
    { word_en: "tall (height)", word_th: "สูง", pronunciation: "sǔuŋ" },
    { word_en: "good", word_th: "ดี", pronunciation: "dii" },
    { word_en: "bad/terrible", word_th: "แย่", pronunciation: "yɛ̂ɛ" },
    { word_en: "hot", word_th: "ร้อน", pronunciation: "rɔ́ɔn" },
    { word_en: "cool/iced", word_th: "เย็น", pronunciation: "yen" },
    { word_en: "cold", word_th: "หนาว", pronunciation: "nǎaw" },
    { word_en: "cheap", word_th: "ถูก", pronunciation: "thùuk" },
    { word_en: "expensive", word_th: "แพง", pronunciation: "phɛɛŋ" },
    { word_en: "slow", word_th: "ช้า", pronunciation: "cháa" },
    { word_en: "fast", word_th: "เร็ว", pronunciation: "rew" },
    { word_en: "beautiful/pretty", word_th: "สวย", pronunciation: "sǔay" },
    { word_en: "handsome", word_th: "หล่อ", pronunciation: "lɔ̀ɔ" },
    { word_en: "not", word_th: "ไม่", pronunciation: "mâi" },
    { word_en: "delicious", word_th: "อร่อย", pronunciation: "à-rɔ̀ɔy" },
    { word_en: "fun/enjoyable", word_th: "สนุก", pronunciation: "sà-nùk" },
    { word_en: "hungry", word_th: "หิว", pronunciation: "hǐw" },
    { word_en: "full", word_th: "อิม", pronunciation: "ìm" },
    { word_en: "fat", word_th: "อ้วน", pronunciation: "ûan" },
    { word_en: "skinny", word_th: "ผอม", pronunciation: "phɔ̌ɔm" },
    { word_en: "tired", word_th: "เหนือย", pronunciation: "nɯay" },
    { word_en: "sleepy", word_th: "ง่วง", pronunciation: "ŋûaŋ" },
    { word_en: "difficult", word_th: "ยาก", pronunciation: "yâak" },
    { word_en: "easy", word_th: "ง่าย", pronunciation: "ŋâay" },
    { word_en: "clean", word_th: "สะอาด", pronunciation: "sà-àat" },
    { word_en: "dirty", word_th: "สกปรก", pronunciation: "sòk-gà-bpròk" },
    { word_en: "rich", word_th: "รวย", pronunciation: "ruay" },
    { word_en: "poor", word_th: "จน", pronunciation: "jon" },
    { word_en: "new", word_th: "ใหม่", pronunciation: "mài" },
    { word_en: "old", word_th: "เก่า/แก่", pronunciation: "gàw/gɛ̀ɛ" },
    { word_en: "how", word_th: "ยังไง", pronunciation: "yaŋ-ŋai" },
    { word_en: "shoes", word_th: "รองเท้า", pronunciation: "rɔɔŋ-tháw" },
    { word_en: "book", word_th: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ" },
    { word_en: "bathroom", word_th: "ห้องนําƒ", pronunciation: "hɔ̂ɔŋ-náam" },
    { word_en: "Bangkok", word_th: "กรุงเทพฯ", pronunciation: "gruŋ-thêep" },
    { word_en: "shirt", word_th: "เสือ", pronunciation: "sɯ̂a" },
    { word_en: "Thailand", word_th: "ประเทศไทย", pronunciation: "bprà-thêet thai" },
    { word_en: "and", word_th: "และ", pronunciation: "lɛ́" },
    { word_en: "but", word_th: "แต่", pronunciation: "dtɛ̀ɛ" },
    { word_en: "more than", word_th: "กว่า", pronunciation: "gwàa" },
    { word_en: "more than/rather than", word_th: "มากกว่า", pronunciation: "mâak gwàa" },
    { word_en: "than", word_th: "กว่า", pronunciation: "gwàa" },
    { word_en: "less than", word_th: "น้อยกว่า", pronunciation: "nɔ́ɔy gwàa" },
    { word_en: "the most", word_th: "ทีสุด", pronunciation: "thîi-sùt" },
    { word_en: "better", word_th: "ดีกว่า", pronunciation: "dii gwàa" },
    { word_en: "the best", word_th: "ดีที:สดุ", pronunciation: "dii thîi-sùt" },
    { word_en: "better", word_th: "เก่งกว่า", pronunciation: "gèŋ gwàa" },
    { word_en: "the best", word_th: "เก่งทีส", pronunciation: "gèŋ thîi-sùt" },
    { word_en: "less", word_th: "น้ อยกว่า", pronunciation: "nɔ́ɔy gwàa" },
    { word_en: "least", word_th: "น้อยทีสดุ", pronunciation: "nɔ́ɔy thîi-sùt" },
    { word_en: "more", word_th: "มากกว่า", pronunciation: "mâak gwàa" },
    { word_en: "the most", word_th: "มากทีสดุ", pronunciation: "mâak thîi-sùt" }
];
// Go shopping (numbers)
const dictionaryBook1Lesson4 = [
    { word_en: "one", word_th: "หนึง", pronunciation: "nɯŋ" },
    { word_en: "two", word_th: "สอง", pronunciation: "sɔ̌ɔŋ" },
    { word_en: "three", word_th: "สาม", pronunciation: "sǎam" },
    { word_en: "four", word_th: "สี", pronunciation: "sìi" },
    { word_en: "five", word_th: "ห้า", pronunciation: "hâa" },
    { word_en: "six", word_th: "หก", pronunciation: "hòk" },
    { word_en: "seven", word_th: "เจ็ด", pronunciation: "jèt" },
    { word_en: "eight", word_th: "แปด", pronunciation: "bpɛ̀ɛt" },
    { word_en: "nine", word_th: "เก้า", pronunciation: "gâaw" },
    { word_en: "ten", word_th: "สิบ", pronunciation: "sìp" },
    { word_en: "eleven", word_th: "สิบเอ็ด", pronunciation: "sìp-èt" },
    { word_en: "twelve", word_th: "สิบสอง", pronunciation: "sìp-sɔ̌ɔŋ" },
    { word_en: "thirteen", word_th: "สิบสาม", pronunciation: "sìp-sǎam" },
    { word_en: "fourteen", word_th: "สิบสี", pronunciation: "sìp-sìi" },
    { word_en: "fifteen", word_th: "สิบห้า", pronunciation: "sìp-hâa" },
    { word_en: "sixteen", word_th: "สิบหก", pronunciation: "sìp-hòk" },
    { word_en: "seventeen", word_th: "สิบเจ็ด", pronunciation: "sìp-jèt" },
    { word_en: "eighteen", word_th: "สิบแปด", pronunciation: "sìp-bpɛ̀ɛt" },
    { word_en: "nineteen", word_th: "สิบเก้า", pronunciation: "sìp-gâaw" },
    { word_en: "twenty", word_th: "ยีส ิบ", pronunciation: "yîi-sìp" },
    { word_en: "thirsty", word_th: "สามสิบ", pronunciation: "sǎam-sìp" },
    { word_en: "forty", word_th: "สีสบิ", pronunciation: "sìi-sìp" },
    { word_en: "fifty", word_th: "ห้าสิบ", pronunciation: "hâa-sìp" },
    { word_en: "sixty", word_th: "หกสิบ", pronunciation: "hòk-sìp" },
    { word_en: "seventy", word_th: "เจ็ดสิบ", pronunciation: "jèt-sìp" },
    { word_en: "eighty", word_th: "แปดสิบ", pronunciation: "bpɛ̀ɛt-sìp" },
    { word_en: "ninety", word_th: "เก้าสิบ", pronunciation: "gâaw-sìp" },
    { word_en: "one hundred", word_th: "หนึงร้อย", pronunciation: "nɯŋ-rɔ́ɔy" },
    { word_en: "one thousand", word_th: "หนึงพัน", pronunciation: "nɯŋ-phan" },
    { word_en: "ten thousand", word_th: "หนึงหมืน", pronunciation: "nɯŋ-mɯɯn" },
    { word_en: "one hundred thousand", word_th: "หนึงแสน", pronunciation: "nɯŋ-sɛ̌ɛn" },
    { word_en: "one million", word_th: "หนึงล้าน", pronunciation: "nɯŋ-láan" },
    { word_en: "ten", word_th: "สิบ", pronunciation: "sìp" },
    { word_en: "hundred", word_th: "ร้อย", pronunciation: "rɔ́ɔy" },
    { word_en: "thousand", word_th: "พัน", pronunciation: "phan" },
    { word_en: "ten thousand", word_th: "หมืน", pronunciation: "mɯɯn" },
    { word_en: "hundred thousand", word_th: "แสน", pronunciation: "sɛ̌ɛn" },
    { word_en: "million", word_th: "ล้าน", pronunciation: "láan" },
    { word_en: "clothes", word_th: "เสือผ้า", pronunciation: "sɯ̂a-phâa" },
    { word_en: "shirt", word_th: "เสือ", pronunciation: "sɯ̂a" },
    { word_en: "T-shirt", word_th: "เสือยืด", pronunciation: "sɯ̂a-yɯ̂ɯt" },
    { word_en: "sweater", word_th: "เสือกันหนาว", pronunciation: "sɯ̂a gan-nǎaw" },
    { word_en: "pants/trousers", word_th: "กางเกง", pronunciation: "gaaŋ-geeŋ" },
    { word_en: "skirt", word_th: "กระโปรง", pronunciation: "grà-bprooŋ" },
    { word_en: "shoes", word_th: "รองเท้า", pronunciation: "rɔɔŋ-tháaw" },
    { word_en: "socks", word_th: "ถุงเท้า", pronunciation: "thǔŋ-tháaw" },
    { word_en: "glasses", word_th: "แว่นตา", pronunciation: "wɛ̂ɛn-dtaa" },
    { word_en: "hat", word_th: "หมวก", pronunciation: "mùak" },
    { word_en: "swimming suit", word_th: "ชุดว่ายนํา", pronunciation: "chút wâay-náam" },
    { word_en: "pajamas", word_th: "ชุดนอน", pronunciation: "chút nɔɔn" },
    { word_en: "exercise outfit", word_th: "ชุดออกกําลังกาย", pronunciation: "chút ɔ̀ɔk-gam-laŋ-gaay" },
    { word_en: "price", word_th: "ราคา", pronunciation: "raa-khaa" },
    { word_en: "discount", word_th: "ลด", pronunciation: "lót" }
];
// Where is the hospital (plaes)
const dictionaryBook1Lesson5 = [
    { word_en: "house", word_th: "บ้าน", pronunciation: "bâan" },
    { word_en: "school", word_th: "โรงเรียน", pronunciation: "rooŋ-rian" },
    { word_en: "hotel", word_th: "โรงแรม", pronunciation: "rooŋ-rɛɛm" },
    { word_en: "hospital", word_th: "โรงพยาบาล", pronunciation: "rooŋ-phá-yaa-baan" },
    { word_en: "restaurant", word_th: "ร้านอาหาร", pronunciation: "ráan aa-hǎan" },
    { word_en: "coffee shop", word_th: "ร้านกาแฟ", pronunciation: "ráan gaa-fɛɛ" },
    { word_en: "train station", word_th: "สถานีรถไฟ", pronunciation: "sà-thǎa-nii rót-fai" },
    { word_en: "bus station", word_th: "สถานีขนส่ง", pronunciation: "sà-thǎa-nii khǒn-sòng" },
    { word_en: "plice station", word_th: "สถานีตํารวจ", pronunciation: "s̀a-thǎa-nii dtam-rùat" },
    { word_en: "airport", word_th: "สนามบิน", pronunciation: "sà-nǎam bin" },
    { word_en: "park", word_th: "สวน", pronunciation: "sǔan" },
    { word_en: "bank", word_th: "ธนาคาร", pronunciation: "thá-naa-khaan" },
    { word_en: "ATM", word_th: "ตู้เอทีเอ็ม", pronunciation: "dtûu ee-thii-em" },
    { word_en: "market", word_th: "ตลาด", pronunciation: "dta-làat" },
    { word_en: "department store", word_th: "ห้าง", pronunciation: "hâaŋ" },
    { word_en: "road/street", word_th: "ถนน", pronunciation: "thà-nǒn" },
    { word_en: "lane", word_th: "ซอย", pronunciation: "sɔɔy" },
    { word_en: "down town", word_th: "ตัวเมือง", pronunciation: "dtua mɯaŋ" },
    { word_en: "beach", word_th: "ชายหาด", pronunciation: "chaay-hàat" },
    { word_en: "sea", word_th: "ทะเล", pronunciation: "thá-lee" },
    { word_en: "temple", word_th: "วัด", pronunciation: "wát" },
    { word_en: "church", word_th: "โบสถ์", pronunciation: "bòot" },
    { word_en: "university", word_th: "มหาวิทยาลัย", pronunciation: "má-hǎa-wit́-thá yaa- lai" },
    { word_en: "mountain", word_th: "ภูเขา/ดอย", pronunciation: "phuu-khǎw/dɔɔy" },
    { word_en: "river", word_th: "แม่นํา", pronunciation: "mɛ̂ɛ-náam" },
    { word_en: "be (is/am/are)", word_th: "อยู่", pronunciation: "yùu" },
    { word_en: "where", word_th: "ที&ไหน", pronunciation: "thîi-nǎi" },
    { word_en: "close to", word_th: "ใกล้", pronunciation: "glâi" },
    { word_en: "near", word_th: "กับ", pronunciation: "gàp" },
    { word_en: "far", word_th: "ไกล", pronunciation: "glai" },
    { word_en: "next to", word_th: "ข้างๆ", pronunciation: "khâaŋ-khâaŋ" },
    { word_en: "next to", word_th: "ติด(กับ)", pronunciation: "dtìt(gàp)" },
    { word_en: "opposite to", word_th: "ตรงข้าม", pronunciation: "dtroŋ-khâam" },
    { word_en: "at", word_th: "ที&", pronunciation: "thîi" },
    { word_en: "in", word_th: "ใน", pronunciation: "nai" },
    { word_en: "arround (in the area)", word_th: "แถว", pronunciation: "thɛ̌ɛw" },
    { word_en: "in front of", word_th: "ข้างหน้า", pronunciation: "khâaŋ-nâa" },
    { word_en: "behind", word_th: "ข้างหลัง", pronunciation: "khâaŋ-lǎŋ" },
    { word_en: "here", word_th: "ที&นี&", pronunciation: "thîi-nîi" },
    { word_en: "there", word_th: "ที&นนั&", pronunciation: "thîi-nân" },
    { word_en: "over there", word_th: "ที&โน่น", pronunciation: "thîi-nôon" },

];

const dictionaryBase = [
    { word_en: "Room", word_th: "ห้ อง", pronunciation: "hɔ̂ɔŋ" },
    { word_en: "Bedroom", word_th: "ห้องนอน", pronunciation: "hɔ̂ɔŋ-nɔɔn" },
    { word_en: "Kitchen", word_th: "ห้องครัว", pronunciation: "hɔ̂ɔŋ-khrua" },
    { word_en: "Living room", word_th: "ห้องนังfเล่น", pronunciation: "hɔ̂ɔŋ-nâŋ-lên" },
    { word_en: "Bathroom", word_th: "ห้องนํNา", pronunciation: "hɔ̂ɔŋ-náam" },
    { word_en: "Office/Studio/Workroom", word_th: "ห้องทํางาน", pronunciation: "hɔ̂ɔŋ tham-ŋaan" },
    { word_en: "Classroom", word_th: "ห้องเรียน", pronunciation: "hɔ̂ɔŋ-rian" },
    { word_en: "Storage room", word_th: "ห้องเก็บของ", pronunciation: "hɔ̂ɔŋ gèp-khɔ̌ɔŋ" },
    { word_en: "Shelf", word_th: "ชันวางของ", pronunciation: "chán-waaŋ-khɔ̌ɔŋ" },
    { word_en: "Cupboard", word_th: "ตู้", pronunciation: "dtûu" },
    { word_en: "Wardrobe", word_th: "ตู้เสืNอผ้า", pronunciation: "dtûu sɯ̂a-phâa" },
    { word_en: "Refrigerator", word_th: "ตู้เย็น", pronunciation: "dtûu-yen" },
    { word_en: "Bed", word_th: "เตียง", pronunciation: "dtiaŋ" },
    { word_en: "Table/Desk", word_th: "โต๊ะ", pronunciation: "dtó" },
    { word_en: "Counter", word_th: "เคาท์เตอร์", pronunciation: "kháw-dtə̂ə" },
    { word_en: "Chair", word_th: "เก้าอีN", pronunciation: "gâw-iî" },
    { word_en: "Sofa", word_th: "โซฟา", pronunciation: "soo-faa" },
    { word_en: "Wash basin", word_th: "อ่างล้างหน้า", pronunciation: "àaŋ-láaŋ-nâa" }

    //    { word_en: "", word_th: "", pronunciation: "" },
];
*/

// book 2   
/* order food 
const dictionaryBook2Lesson1 = [
    { word_en: "rice", word_th: "ข้าว", pronunciation: "khâaw" },
    { word_en: "food", word_th: "อาหาร/กับข้าว", pronunciation: "aa-hǎan/gàp-khâaw" },
    { word_en: "curry", word_th: "แกง", pronunciation: "gɛɛŋ" },
    { word_en: "vegetables", word_th: "ผัก", pronunciation: "phàk" },
    { word_en: "egg", word_th: "ไข่", pronunciation: "khài" },
    { word_en: "tofu", word_th: "เต้าหู ้", pronunciation: "dtâw-hûu" },
    { word_en: "Chili", word_th: "พริก", pronunciation: "phrík" },
    { word_en: "meat/beef", word_th: "เนืNอ", pronunciation: "nɯa" },
    { word_en: "pork", word_th: "หมู", pronunciation: "mǔu" },
    { word_en: "chicken", word_th: "ไก่", pronunciation: "gài" },
    { word_en: "fish", word_th: "ปลา", pronunciation: "bplaa" },
    { word_en: "seafood", word_th: "(อาหาร)ทะเล", pronunciation: "(aa hǎan) thá-lee" },
    { word_en: "shrimp", word_th: "กุ้ง", pronunciation: "gûŋ" },
    { word_en: "squid", word_th: "ปลาหมึก", pronunciation: "bplaa-mɯk" },
    { word_en: "crab", word_th: "ปู", pronunciation: "bpuu" },
    { word_en: "shell", word_th: "หอย", pronunciation: "hɔ̌ɔy" },
    { word_en: "boil/boiled", word_th: "ต้ม", pronunciation: "dtôm" },
    { word_en: "stir fry/fried", word_th: "ผัด", pronunciation: "phàt" },
    { word_en: "deep fry/ deep fried", word_th: "ทอด", pronunciation: "thɔ̂ɔt" },
    { word_en: "steam/steamed", word_th: "นึงf", pronunciation: "nɯ̂ŋ" },
    { word_en: "grill/grilled", word_th: "ปิ", pronunciation: "bpîŋ" },
    { word_en: "gril/grilled", word_th: "ย่าง", pronunciation: "yâaŋ" },
    { word_en: "mild soup", word_th: "แกงจืด", pronunciation: "gɛɛŋ-jɯɯt" },
    { word_en: "spicy sour soup", word_th: "ต้ มยํา", pronunciation: "dtôm-yam" },
    { word_en: "spicy sour salad", word_th: "ยํา", pronunciation: "yam" },
    { word_en: "noodles", word_th: "ก๋วยเตีmยว", pronunciation: "gǔay-dtǐaw" },
    { word_en: "pad thai noodles", word_th: "ผัดไทย", pronunciation: "phàt-thai" },
    { word_en: "fried vegtables", word_th: "ผัดผัก", pronunciation: "phàt-phàk" },
    { word_en: "thai omelet", word_th: "ไข่เจียว", pronunciation: "khài-jiaw" },
    { word_en: "papaya salad", word_th: "ส้มตํา", pronunciation: "sôm-dtam" },
    { word_en: "green curry", word_th: "แกงเขียงหวาน", pronunciation: "gɛɛŋ-khǐaw-wǎan" },
    { word_en: "red curry", word_th: "แกงเผ็ด", pronunciation: "gɛɛŋ-phèt" },
    { word_en: "mango sticky rice", word_th: "ข้าวเหนียวมะม่วง", pronunciation: "khâaw-nǐaw má-mûaŋ" },
    { word_en: "taste/flavour", word_th: "รสชาติ", pronunciation: "rót-châat" },
    { word_en: "spicy", word_th: "เผ็ด", pronunciation: "phèt" },
    { word_en: "sweet", word_th: "หวาน", pronunciation: "wǎan" },
    { word_en: "sour", word_th: "เปรียNว", pronunciation: "bprîaw" },
    { word_en: "salty", word_th: "เค็ม", pronunciation: "khem" },
    { word_en: "bitter", word_th: "ขม", pronunciation: "khǒm" },
    { word_en: "tasteless/plain", word_th: "จืด", pronunciation: "jɯɯt" },
    { word_en: "order/eat", word_th: "สั9ง/กิน", pronunciation: "sàŋ/gin" },
    { word_en: "with/without", word_th: "ใส่/ไม่ใส่", pronunciation: "sài/mâi sài" },
    { word_en: "fermented fish", word_th: "ปลาร้า", pronunciation: "bplaa-ráa" },
    { word_en: "monosodium glutamate", word_th: "ผงชูรส", pronunciation: "phǒŋ-chuu-rót" },
    { word_en: "plate", word_th: "จาน", pronunciation: "jaan" },
    { word_en: "bowl", word_th: "ถ้วย/ชาม", pronunciation: "thûay/chaam" },
    { word_en: "Box/carton", word_th: "กล่อง", pronunciation: "glɔ̀ɔŋ" },
    { word_en: "plastic bag", word_th: "ถุง", pronunciation: "thǔŋ" },
    { word_en: "piece", word_th: "ชิ1น", pronunciation: "chín" }
];
*/
/* order drinks 
const dictionaryBook2Lesson2 = [
    { word_en: "water", word_th: "นํา", pronunciation: "náam" },
    { word_en: "plain water", word_th: "นําเปล่า", pronunciation: "náam-bplàaw" },
    { word_en: "ice", word_th: "นําแข็ง", pronunciation: "náam-khɛ̌ ɛŋ" },
    { word_en: "sugar", word_th: "นําตาล", pronunciation: "náam-dtaan" },
    { word_en: "coffee", word_th: "กาแฟ", pronunciation: "gaa-fɛɛ" },
    { word_en: "tea", word_th: "ชา", pronunciation: "chaa" },
    { word_en: "milk", word_th: "นม", pronunciation: "nom" },
    { word_en: "soda", word_th: "โซดา", pronunciation: "soo-daa" },
    { word_en: "fruit juice", word_th: "นําผลไม้", pronunciation: "náam phǒn-lá-máay" },
    { word_en: "fruit shake/smoothie", word_th: "นําผลไม้ปัfน", pronunciation: "náam phǒn-lá-máay bpàn" },
    { word_en: "soft drik", word_th: "นําอัดลม", pronunciation: "náam àt-lom" },
    { word_en: "beer", word_th: "เบียร์", pronunciation: "bia" },
    { word_en: "liquor", word_th: "เหล้า", pronunciation: "lâw" },
    { word_en: "wine", word_th: "ไวน์", pronunciation: "waay" },
    { word_en: "hot", word_th: "ร้อน", pronunciation: "rɔ́ɔn" },
    { word_en: "cold/iced", word_th: "เย็น", pronunciation: "yen" },
    { word_en: "glass/cup", word_th: "แก้ว", pronunciation: "gɛ̂ɛw" },
    { word_en: "cup", word_th: "ถ้วย", pronunciation: "thûay" },
    { word_en: "carton", word_th: "กล่อง", pronunciation: "glɔ̀ɔŋ" },
    { word_en: "can/tin", word_th: "กระป๋อง", pronunciation: "grà-bpɔ̌ɔŋ" },
    { word_en: "bottle", word_th: "ขวด", pronunciation: "khùat" },
    { word_en: "Orange juice", word_th: "นํNาส้ม", pronunciation: "náam sôm" },
    { word_en: "Lime juice", word_th: "นํNามะนาว", pronunciation: "náam má-naaw" },
    { word_en: "Pineapple juice", word_th: "นํNาสับปะรด", pronunciation: "náam sàp-bpà-rót" },
    { word_en: "Mango juice", word_th: "นํNามะม่วง", pronunciation: "náam má-mûaŋ" },
    { word_en: "Water melon juice", word_th: "นํNาแตงโม", pronunciation: "náam dtɛɛŋ-moo" },
    { word_en: "Grape juice", word_th: "นํNาองุน่", pronunciation: "náam à-ŋùn" },
    { word_en: "Coconut Water", word_th: "นํNามะพร้าว", pronunciation: "náam má-phráaw" },
    { word_en: "Passion fruit juice", word_th: "นํNาเสาวรส", pronunciation: "náam sǎw-wá-rót" },
    { word_en: "Vegetable juice", word_th: "นํNาผัก", pronunciation: "náam phàk" }
]; */
/* food 
const dictionaryBook2Lesson3 = [
    { word_en: "Fruits", word_th: "ผลไม้", pronunciation: "phǒn-lá-máay" },
    { word_en: "Mango", word_th: "มะม่วง", pronunciation: "má-mûaŋ" },
    { word_en: "Coconut", word_th: "มะพร้าว", pronunciation: "má-phráaw" },
    { word_en: "Watermelon", word_th: "แตงโม", pronunciation: "dtɛɛng-moo" },
    { word_en: "Banana", word_th: "กล้วย", pronunciation: "glûay" },
    { word_en: "Papaya", word_th: "มะละกอ", pronunciation: "má-lá-gɔɔ" },
    { word_en: "Pineapple", word_th: "สัปปะรด", pronunciation: "sàp-bpà-rót" },
    { word_en: "Durian", word_th: "ทุเรียน", pronunciation: "thú-rian" },
    { word_en: "Orange", word_th: "ส้ ม", pronunciation: "sôm" },
    { word_en: "Mangosteen", word_th: "มังคุด", pronunciation: "maŋ-khút" },
    { word_en: "Guava", word_th: "ฝรัfง", pronunciation: "fà-ràŋ" },
    { word_en: "Longan", word_th: "ลําไย", pronunciation: "lam-yai" },
    { word_en: "Strawberry", word_th: "สตรอเบอรีf", pronunciation: "sà-dtrɔɔ-bəə-rîi" },
    { word_en: "Rambutan", word_th: "เงาะ", pronunciation: "ŋɔ́" },
    { word_en: "Grapes", word_th: "องุน่", pronunciation: "à-ŋùn" },
    { word_en: "Passion friut", word_th: "เสาวรส", pronunciation: "sǎw-wá-rót" },
    { word_en: "Cherry", word_th: "เชอร์รีf", pronunciation: "chəə-rîi" },
    { word_en: "Lychee", word_th: "ลิNนจีf", pronunciation: "lín-jìi" },
    { word_en: "Dragon fruit", word_th: "แก้วมังกร", pronunciation: "gɛ̂ ɛw-maŋ-gɔɔn" },
    { word_en: "Jackfruit", word_th: "ขนุน", pronunciation: "khà-nǔn" },
    { word_en: "Ripe/Cooked", word_th: "สุก", pronunciation: "sùk" },
    { word_en: "Raw/Uncooked", word_th: "ดิบ", pronunciation: "dìp" },
    { word_en: "Fresh", word_th: "สด", pronunciation: "sòt" },
    { word_en: "Dry", word_th: "แห้ง", pronunciation: "hɛ̂ɛŋ" },
    { word_en: "Sweet", word_th: "หวาน", pronunciation: "wǎan" },
    { word_en: "Sour", word_th: "เปรียNว", pronunciation: "bprîaw" },
    { word_en: "Piece", word_th: "ชิNน", pronunciation: "chín" },
    { word_en: "Small", word_th: "เล็ก", pronunciation: "lék" },
    { word_en: "Plastic bag", word_th: "ถุง", pronunciation: "tǔŋ" },
    { word_en: "Rotten", word_th: "เน่า/เสีย", pronunciation: "nâw/sǐa" },
    { word_en: "Classifier for the whole fruit", word_th: "ลูก/ผล", pronunciation: "lûuk / phǒn" }

]; */

/* colours */
const dictionaryBook2Lesson4 = [
    { word_en: "Colour", word_th: "สี", pronunciation: "sǐi" },
    { word_en: "White", word_th: "สีขาว", pronunciation: "" },
    { word_en: "Black", word_th: "สีดํา", pronunciation: "sǐi dam" },
    { word_en: "Red", word_th: "สีแดง", pronunciation: "sǐi dɛɛŋ" },
    { word_en: "Yellow", word_th: "สีเหลือง", pronunciation: "sǐi lɯ̌aŋ" },
    { word_en: "Green", word_th: "สีเขียว", pronunciation: "sǐi khǐaw" },
    { word_en: "Dark Blue", word_th: "สีนํNาเงิน", pronunciation: "sǐi náam-ŋəən" },
    { word_en: "Sky blue", word_th: "สีฟา้", pronunciation: "sǐi fáa" },
    { word_en: "Orange", word_th: "สีส้ม", pronunciation: "sǐi sôm" },
    { word_en: "Grey", word_th: "สีเทา", pronunciation: "sǐi thaw" },
    { word_en: "Pink", word_th: "สีชมพู", pronunciation: "sǐi chom-phuu" },
    { word_en: "Purple", word_th: "สีมว่ง", pronunciation: "sǐi mûaŋ" },
    { word_en: "Brown", word_th: "สีนํNาตาล", pronunciation: "sǐi náam-dtaan" },
    { word_en: "Light(Adj)", word_th: "อ่อน", pronunciation: "ɔ̀ɔn" },
    { word_en: "Dark(Adj)", word_th: "เข้ม", pronunciation: "khêm" }
    /*
        { word_en: "", word_th: "", pronunciation: "" },
    */
];

/* clssifiers */
const dictionaryBook2Lesson5 = [
    { word_en: "animals, letters, numbers,clothes,chairs,and tables", word_th: "คน", pronunciation: "khon" },
    { word_en: "containers , pieces of paper, documents", word_th: "ใบ", pronunciation: "bai" },
    { word_en: "thin or flat objects, like CDs and slices of bread", word_th: "แผ่น", pronunciation: "phɛ̀ɛn" },
    { word_en: "balls, fruits, and other small and round objects", word_th: "ลูก", pronunciation: "lûuk" },
    { word_en: "classifier for cars and vehicles except boats or planes/umbrella", word_th: "คัน", pronunciation: "khan" },
    { word_en: "classifier for seeds, pills, buttons", word_th: "เม็ด", pronunciation: "mét" },
    { word_en: "a piece of something like 3 pieces of cake", word_th: "ชิNน", pronunciation: "chín" },
    { word_en: "house", word_th: "หลัง", pronunciation: "lǎŋ" },
    { word_en: "room", word_th: "ห้อง", pronunciation: "hɔ̂ɔŋ" },
    { word_en: "eggs", word_th: "ฟอง", pronunciation: "fɔɔŋ" },
    { word_en: "books,notebooks,knifes", word_th: "เล่ม", pronunciation: "lêm" },
    { word_en: "Electrical device/machine", word_th: "เครืf อง", pronunciation: "khrɯ̂aŋ" },
    { word_en: "A pair of", word_th: "คู่", pronunciation: "khûu" },
    { word_en: "Objects", word_th: "อัน", pronunciation: "an" }
    /*
        { word_en: "", word_th: "", pronunciation: "" },
    */
];

/* prepositions 
const dictionaryBook2Lesson6 = [
    { word_en: "There is/There are", word_th: "มี", pronunciation: "mii" },
    { word_en: "On", word_th: "บน", pronunciation: "bon" },
    { word_en: "Under", word_th: "ใต้", pronunciation: "On" },
    { word_en: "Outside", word_th: "ข้างนอก", pronunciation: "khâaŋ-nɔ̂ɔk" },
    { word_en: "Inside", word_th: "ข้างใน", pronunciation: "khâaŋ-nai" },
    { word_en: "Between", word_th: "ระหว่าง", pronunciation: "rá-wàaŋ" },
    { word_en: "At", word_th: "ทีf", pronunciation: "thîi" }
    //   { word_en: "", word_th: "", pronunciation: "" },
];
*/

// book 3
/* Time */
const dictionaryBook3Lesson1 = [
    { word_en: "In the morning", word_th: "ตอนเช้า", pronunciation: "dtɔɔn cháaw" },
    { word_en: "In the late morning", word_th: "ตอนสาย", pronunciation: "dtɔɔn sǎay" },
    { word_en: "At noon", word_th: "ตอนเที9ยง", pronunciation: "dtɔɔn thîaŋ" },
    { word_en: "In the afternoon", word_th: "ตอนบ่าย", pronunciation: "dtɔɔn bàay" },
    { word_en: "In the evening (before dark)", word_th: "ตอนเย็น", pronunciation: "dtɔɔn yen" },
    { word_en: "In the evening (after dark)", word_th: "ตอนคํ9า", pronunciation: "dtɔɔn khâm" },
    { word_en: "In the day time", word_th: "ตอนกลางวัน", pronunciation: "dtɔɔn glaaŋ-wan" },
    { word_en: "In the night time", word_th: "ตอนกลางคืน", pronunciation: "dtɔɔn glaaŋ-khɯɯn" },
    { word_en: "Time", word_th: "เวลา", pronunciation: "wee-laa" },
    { word_en: "Clock/Watch/O’clock", word_th: "นาฬิกา", pronunciation: "naa-lí-gaa" },
    { word_en: "O'clock(6.00 AM-6.59PM)", word_th: "โมง", pronunciation: "mooŋ" },
    { word_en: "O'clock(7.00PM-11.59PM)", word_th: "ทุม", pronunciation: "thûm" },
    { word_en: "O'clock(1.00AM-5.59AM)", word_th: "ตี", pronunciation: "dtii" },
    { word_en: "About/Approximately", word_th: "ประมาณ", pronunciation: "bprà-maan" },
    { word_en: "Sharp", word_th: "ตรง", pronunciation: "dtroŋ" },
    { word_en: "Hour", word_th: "ชัวโมง", pronunciation: "chûa-mooŋ" },
    { word_en: "Minute", word_th: "นาที", pronunciation: "naa-thii" },
    { word_en: "Second", word_th: "วินาที", pronunciation: "wí-naa-thii!" },
    { word_en: "Half", word_th: "ครึ9ง", pronunciation: "khrɯ̂ŋ" },
    { word_en: "Long", word_th: "นาน", pronunciation: "naan" },
    { word_en: "Early", word_th: "เช้า", pronunciation: "cháaw" },
    { word_en: "Late", word_th: "สาย", pronunciation: "sǎay" },
    { word_en: "Before", word_th: "ก่อน", pronunciation: "gɔ̀ɔn" },
    { word_en: "After", word_th: "หลัง", pronunciation: "lǎŋ" },
    { word_en: "Wait for a minute", word_th: "รอแป๊ปนึง", pronunciation: "rɔɔ bpɛ́ɛp-nʉng" },
    { word_en: "Now", word_th: "ตอนนี", pronunciation: "dtɔɔn-níi" },
    { word_en: "Right now", word_th: "เดีƒยวนี", pronunciation: "dǐaw-níi" }
    //        { word_en: "", word_th: "", pronunciation: "" },
];

/* Days 
const dictionaryBook3Lesson2 = [
    { word_en: "Monday", word_th: "วันจันทร์", pronunciation: "wan-jan" },
    { word_en: "Tuesday", word_th: "วันอังคาร", pronunciation: "wan aŋ-khaan" },
    { word_en: "Wednesday", word_th: "วันพุธ", pronunciation: "wan-phút" },
    { word_en: "Thursday", word_th: "วันพฤหัสบดี", pronunciation: "wan phá-rɯ-hàt" },
    { word_en: "Friday", word_th: "วันศุกร์", pronunciation: "wan-sùk" },
    { word_en: "Saturday", word_th: "วันเสาร์", pronunciation: "wan-sǎw" },
    { word_en: "Sunday", word_th: "วันอาทิตย์", pronunciation: "wan aa-thít" },
    { word_en: "Weekend", word_th: "วันเสาร์อาทิตย์", pronunciation: "wan-sǎw aa-thít" },
    { word_en: "Day", word_th: "วัน", pronunciation: "wan" },
    { word_en: "Date", word_th: "วันที9", pronunciation: "wan-thiî" },
    { word_en: "Today", word_th: "วันนี", pronunciation: "wan-níi" },
    { word_en: "Tomorrow", word_th: "วันพรุ่งนี", pronunciation: "wan phrûŋ-níi" },
    { word_en: "Yesterday", word_th: "เมื9อวานนี", pronunciation: "mɯ̂a-waan-níi" },
    { word_en: "The day after tomorrow", word_th: "วันมะรืนนี", pronunciation: "wan má-rɯɯn-níi" },
    { word_en: "The day before yesterday", word_th: "(เมื9อ)วานซืน", pronunciation: "(mɯ̂a)-waan-sɯɯn" },
    { word_en: "Holiday", word_th: "วันหยุด", pronunciation: "wan-yùt" },
    { word_en: "Birthday", word_th: "วันเกิด", pronunciation: "wan-gə̀ət" },
    { word_en: "Weekdays", word_th: "วันธรรมดา", pronunciation: "wan tham-má-daa" },
    { word_en: "Every", word_th: "ทุก", pronunciation: "thúk" },
    { word_en: "All/Throughout", word_th: "ทังy", pronunciation: "tháŋ" },
    { word_en: "Day", word_th: "วัน", pronunciation: "Wan" },
    { word_en: "Week", word_th: "อาทิตย์", pronunciation: "aa-thít" },
    { word_en: "Month", word_th: "เดือน", pronunciation: "dɯan" },
    { word_en: "year", word_th: "ปี", pronunciation: "bpii" }
    //        { word_en: "", word_th: "", pronunciation: "" },
]; */
/* Months/year/season 
const dictionaryBook3Lesson3 = [
    { word_en: "Month", word_th: "เดือน", pronunciation: "dɯan" },
    { word_en: "January", word_th: "มกราคม", pronunciation: "mók-gà-raa-khom" },
    { word_en: "February", word_th: "กุมภาพันธ์", pronunciation: "gum-phaa-phan" },
    { word_en: "March", word_th: "มีนาคม", pronunciation: "mii-naa-khom" },
    { word_en: "April", word_th: "เมษายน", pronunciation: "mee-sǎa-yon" },
    { word_en: "May", word_th: "พฤษภาคม", pronunciation: "phrɯt-sà-phaa-khom" },
    { word_en: "June", word_th: "มิถนายน", pronunciation: "mii-naa-khom" },
    { word_en: "July", word_th: "กรกฎาคม", pronunciation: "gà-rá-gà-daa-khom" },
    { word_en: "August", word_th: "สิงหาคม", pronunciation: "sǐŋ-hǎa-khom" },
    { word_en: "September", word_th: "กันยายน", pronunciation: "gan-yaa-yon" },
    { word_en: "October", word_th: "ตุลาคม", pronunciation: "dtù-laa-khom" },
    { word_en: "November", word_th: "พฤศจิกายน", pronunciation: "phrɯt-sà-jì-gaa-yon" },
    { word_en: "December", word_th: "ธันวาคม", pronunciation: "than-waa-khom" },
    { word_en: "Year", word_th: "ปี", pronunciation: "bpii" },
    { word_en: "C.E.", word_th: "ปี ค.ศ", pronunciation: "bpii khɔɔ-sɔ̌ɔ" },
    { word_en: "B.E.", word_th: "ปี พ.ศ.", pronunciation: "bpii phɔɔ-sɔ̌ɔ" }
    //        { word_en: "", word_th: "", pronunciation: "" },
]; */
/* My family 
const dictionaryBook3Lesson4 = [
    { word_en: "Family ", word_th: "ครอบครัว", pronunciation: "khrɔ́ɔp-khrua" },
    { word_en: "Father", word_th: "พ่อ", pronunciation: "phɔ̂ɔ" },
    { word_en: "Mother", word_th: "แม่", pronunciation: "mɛ̂ɛ" },
    { word_en: "A person who is older than you", word_th: "พี9", pronunciation: "phîi" },
    { word_en: "A person who is younger than you", word_th: "น้ อง", pronunciation: "nɔ́ɔŋ" },
    { word_en: "Sibling", word_th: "พี9น้อง", pronunciation: "phîi-nɔ́ɔŋ" },
    { word_en: "Older sister", word_th: "พี9สาว", pronunciation: "phîi-sǎaw" },
    { word_en: "Younger sister", word_th: "น้ องสาว", pronunciation: "nɔ́ɔŋ-sǎaw" },
    { word_en: "Older brother", word_th: "พี9ชาย", pronunciation: "phîi-chaay" },
    { word_en: "Younger brother", word_th: "น้องชาย", pronunciation: "nɔ́ɔŋ-chaay" },
    { word_en: "Child", word_th: "ลูก", pronunciation: "lûuk" },
    { word_en: "Daughter", word_th: "ลูกสาว", pronunciation: "lûuk-sǎaw" },
    { word_en: "Son", word_th: "ลูกชาย", pronunciation: "lûuk-chaay" },
    { word_en: "Niece/Grand daughter", word_th: "หลานสาว", pronunciation: "lǎan-sǎaw" },
    { word_en: "Nephew/Grand son", word_th: "หลานชาย", pronunciation: "lǎan-chaay" },
    { word_en: "Grandfather", word_th: "ปู ่/ตา", pronunciation: "bpùu/dtaa" },
    { word_en: "Grandmother", word_th: "ย่า/ยาย", pronunciation: "yâa/yaay" },
    { word_en: "Uncle", word_th: "ลุง", pronunciation: "luŋ" },
    { word_en: "Aunt", word_th: "ป้า", pronunciation: "bpâa" },
    { word_en: "Aunt/Uncle (younger)", word_th: "น้า", pronunciation: "náa" },
    { word_en: "Aunt/Uncle (older)", word_th: "อา", pronunciation: "aa" },
    { word_en: "Husband", word_th: "สามี", pronunciation: "sǎa-mii" },
    { word_en: "Wife", word_th: "ภรรยา", pronunciation: "Phan-rá-yaa" },
    { word_en: "Boyfriend/Girlfriend", word_th: "แฟน", pronunciation: "fɛɛn" },
    { word_en: "Relatives", word_th: "ญาติ", pronunciation: "yâat" }
    //        { word_en: "", word_th: "", pronunciation: "" },
]; */

/* Occupation 
const dictionaryBook3Lesson5 = [
    { word_en: "Work/Job", word_th: "งาน", pronunciation: "ŋaan" },
    { word_en: "To work", word_th: "ทํางาน", pronunciation: "tham-ŋaan" },
    { word_en: "Student", word_th: "นักเรียน", pronunciation: "nák-rian" },
    { word_en: "Business person", word_th: "นักธุรกิจ", pronunciation: "nák thú-rá-gìt" },
    { word_en: "Musician", word_th: "นักดนตรี", pronunciation: "nák don-dtrii" },
    { word_en: "Writer", word_th: "นักเขียน", pronunciation: "nák-khǐan" },
    { word_en: "Teacher", word_th: "ครู", pronunciation: "khruu" },
    { word_en: "Doctor", word_th: "หมอ", pronunciation: "mɔ̌ɔ" },
    { word_en: "Dentist", word_th: "หมอฟัน", pronunciation: "mɔ̌ɔ-fan" },
    { word_en: "Nurse", word_th: "พยาบาล", pronunciation: "phá-yaa-baan" },
    { word_en: "Police", word_th: "ตํารวจ", pronunciation: "dtam-rùat" },
    { word_en: "Soldier", word_th: "ทหาร", pronunciation: "thá-hǎan" },
    { word_en: "Engineer", word_th: "วิศวกร", pronunciation: "wít-sà-wá-gɔɔn" },
    { word_en: "Pharmacist", word_th: "เภสั ", pronunciation: "phee-sàt-chàt-gɔɔn" },
    { word_en: "Vendor", word_th: "พ่อค้า/แม่ค้า", pronunciation: "phɔ̂ɔ-kháa/mɛ̂ɛ-kháa" },
    { word_en: "Staff/Worker", word_th: "พนักงาน", pronunciation: "phá-nák ŋaan" },
    { word_en: "Freelancer", word_th: "ฟรีแลนซ์", pronunciation: "frii-lɛ́ɛn" },
    { word_en: "Maid / Housewife", word_th: "แม่บ้าน", pronunciation: "mɛ̂ɛ bâan" },
    { word_en: "Security guard", word_th: "ยาม", pronunciation: "yaam" },
    { word_en: "Technician", word_th: "ช่าง", pronunciation: "châaŋ" }
    //        { word_en: "", word_th: "", pronunciation: "" },
]; */

/* What does she/he look like? 
const dictionaryBook3Lesson6 = [
    { word_en: "Eyes", word_th: "ตา", pronunciation: "dtaa" },
    { word_en: "Mouth", word_th: "ปาก", pronunciation: "bpàak" },
    { word_en: "Skin", word_th: "ผิว", pronunciation: "phǐw" },
    { word_en: "Hair", word_th: "ผม", pronunciation: "phǒm" },
    { word_en: "Nose", word_th: "จมูก", pronunciation: "Jà-mùuk" },
    { word_en: "Eyebrows", word_th: "คิyว", pronunciation: "khíw" },
    { word_en: "Face", word_th: "หน้า", pronunciation: "nâa" },
    { word_en: "Face", word_th: "หน้าตา", pronunciation: "nâa-dtaa" },
    { word_en: "Shape", word_th: "รูปร่าง", pronunciation: "rûup-râaŋ" },
    { word_en: "Height", word_th: "ส่วนสูง", pronunciation: "Sùan-sǔuŋ" },
    { word_en: "Weight", word_th: "นํyาหนัก", pronunciation: "Náam-nàk" }
    //        { word_en: "", word_th: "", pronunciation: "" },
];
*/
/*
const dictionaryDateTime = [
    { word_en: "In the morning", word_th: "ตอนเช้า", pronunciation: "dtɔɔn cháaw" },
    { word_en: "In the late morning", word_th: "ตอนสาย", pronunciation: "dtɔɔn sǎay" },
    { word_en: "At noon", word_th: "ตอนเที9ยง", pronunciation: "dtɔɔn thîaŋ" },
    { word_en: "In the afternoon", word_th: "ตอนบ่าย", pronunciation: "dtɔɔn bàay" },
    { word_en: "In the evening (before dark)", word_th: "ตอนเย็น", pronunciation: "dtɔɔn yen" },
    { word_en: "In the evening (after dark)", word_th: "ตอนคํา", pronunciation: "dtɔɔn khâm" },
    { word_en: "In the day time", word_th: "ตอนกลางวัน", pronunciation: "dtɔɔn glaaŋ-wan" },
    { word_en: "In the night time", word_th: "ตอนกลางคืน", pronunciation: "dtɔɔn glaaŋ-khɯɯn" },
    { word_en: "Time", word_th: "เวลา", pronunciation: "wee-laa" },
    { word_en: "Clock/Watch/O’clock", word_th: "นาฬิกา", pronunciation: "naa-lí-gaa" },
    { word_en: "O’clock(6.00 AM-6.59PM)", word_th: "โมง", pronunciation: "mooŋ" },
    { word_en: "O’clock(7.00PM-11.59PM)", word_th: "ทุม", pronunciation: "thûm" },
    { word_en: "O’clock(1.00AM-5.59AM)", word_th: "ตี", pronunciation: "dtii" },
    { word_en: "About/Approximately", word_th: "ประมาณ", pronunciation: "bprà-maan" },
    { word_en: "Sharp", word_th: "ตรง", pronunciation: "dtroŋ" },
    { word_en: "Hour", word_th: "ชัวโมง", pronunciation: "chûa-mooŋ" },
    { word_en: "Minute", word_th: "นาที", pronunciation: "naa-thii" },
    { word_en: "Second", word_th: "วินาที", pronunciation: "wí-naa-thii!" },
    { word_en: "Half", word_th: "ครึง", pronunciation: "khrɯ̂ŋ" },
    { word_en: "Long", word_th: "นาน", pronunciation: "naan" },
    { word_en: "Early", word_th: "ช้า", pronunciation: "cháaw" },
    { word_en: "Late", word_th: "สาย", pronunciation: "sǎay" },
    { word_en: "Before", word_th: "ก่อน", pronunciation: "gɔ̀ɔn" },
    { word_en: "After", word_th: "หลัง", pronunciation: "lǎŋ" },
    { word_en: "Now", word_th: "ตอนนี", pronunciation: "dtɔɔn-níi" },
    { word_en: "What time", word_th: "กีโมง", pronunciation: "gìi mooŋ" },
    { word_en: "Monday ", word_th: "วันจันทร์", pronunciation: "wan-jan" },
    { word_en: "Tuesday", word_th: "วันอังคาร", pronunciation: "wan aŋ-khaan" },
    { word_en: "Wednesday", word_th: "วันพุธ", pronunciation: "wan-phút" },
    { word_en: "Thursday", word_th: "วันพฤหัสบดี", pronunciation: "wan phá-rɯ-hàt" },
    { word_en: "Friday", word_th: "วันศุกร์", pronunciation: "wan-sùk" },
    { word_en: "Saturday", word_th: "วันเสาร์", pronunciation: "wan-sǎw" },
    { word_en: "Sunday", word_th: "วันอาทิตย์", pronunciation: "wan aa-thít" },
    { word_en: "Weekend", word_th: "วันเสาร์อาทิตย์", pronunciation: "wan-sǎw aa-thít" },
    { word_en: "Day", word_th: "วัน", pronunciation: "wan" },
    { word_en: "Date", word_th: "วันที9", pronunciation: "wan-thiî" },
    { word_en: "Today", word_th: "วันนี", pronunciation: "wan-níi" },
    { word_en: "Tomorrow", word_th: "วันพรุ่งนี", pronunciation: "wan phrûŋ-níi" },
    { word_en: "Yesterday", word_th: "เมื9อวานนี", pronunciation: "mɯ̂a-waan-níi" },
    { word_en: "The day after tomorrow", word_th: "วันมะรืนนี", pronunciation: "wan má-rɯɯn-níi" },
    { word_en: "The day before yesterday", word_th: "(เมื9อ)วานซืน", pronunciation: "(mɯ̂a)-waan-sɯɯn" },
    { word_en: "Holiday", word_th: "วันหยุด", pronunciation: "wan-yùt" },
    { word_en: "Birthday", word_th: "วันเกิด", pronunciation: "wan-gə̀ət" },
    { word_en: "Weekdays", word_th: "วันธรรมดา", pronunciation: "wan tham-má-daa" },
    { word_en: "Every", word_th: "ทุก", pronunciation: "thúk" },
    { word_en: "All/Throughout", word_th: "ทัง", pronunciation: "tháŋ" },
    { word_en: "Month", word_th: "เดือน", pronunciation: "dɯan" },
    { word_en: "January", word_th: "มกราคม", pronunciation: "má-gà-raakhom/mók-gà-raa-khom" },
    { word_en: "February", word_th: "กุมภาพันธ์", pronunciation: "gum-phaa-phan" },
    { word_en: "March", word_th: "มีนาคม", pronunciation: "mii-naa-khom" },
    { word_en: "April", word_th: "เมษายน", pronunciation: "mee-sǎa-yon" },
    { word_en: "May", word_th: "พฤษภาคม", pronunciation: "phrɯt-sà-phaa-khom" },
    { word_en: "June", word_th: "มิถน ุยน", pronunciation: "mii-naa-khom" },
    { word_en: "July", word_th: "กรกฎาคม", pronunciation: "gà-rá-gà-daa-khom" },
    { word_en: "August", word_th: "สิงหาคม", pronunciation: "sǐŋ-hǎa-khom" },
    { word_en: "September", word_th: "กันยายน", pronunciation: "gan-yaa-yon" },
    { word_en: "October", word_th: "ตุลาคม", pronunciation: "dtù-laa-khom" },
    { word_en: "November", word_th: "พฤศจิกายน", pronunciation: "phrɯt-sà-jì-gaa-yon" },
    { word_en: "December", word_th: "ธันวาคม", pronunciation: "than-waa-khom" },
    { word_en: "Year", word_th: "ปี", pronunciation: "bpii" },
    { word_en: "C.E.", word_th: "ปีคศ", pronunciation: "bpii khɔɔ-sɔ̌ɔ" },
    { word_en: "B.E.", word_th: "ปีพศ", pronunciation: "bpii phɔɔ-sɔ̌ɔ" },
    { word_en: "Born", word_th: "เกิด", pronunciation: "gə̀ət" },
    { word_en: "When", word_th: "เมือไหร่", pronunciation: "mɯ̂a-rài" }

];
*/
/*
const conversations = [
    // Book 1
    {
        "dictionary": "dictionaryBook1Lesson1",
        "conversations": [
            { description: "What is your name?", url: "https://youtu.be/hqpzxp7oXHE?si=KyEnjbgzrNBVuxjj" },
            { description: "Where do you come from?", url: "https://youtu.be/Jfn8TnDUON8?si=zrPDIrOyaH2TM_YR" }
            //            { description: "", url: "" }
        ]
    },
    {
        "dictionary": "dictionaryBook1Lesson2",
        "conversations": [
            { description: "Vocabulary Part 1", url: "https://youtu.be/ntPgx1m1K9M?si=W_zAAsfiXuP_l6xD" },
            { description: "Talking about yourself", url: "https://youtu.be/bAKFs6AMBFQ?si=B5MACIGxd4A9_cPM" },
            { description: "(Normally) Do you ...?", url: "https://youtu.be/8zjJ0GVDCfg?si=2fE25HcTK5uqn49T" },
            { description: "I like ... ", url: "https://youtu.be/w740c7Kn4HA?si=hVw-FIu12CDwKn0v" },
            { description: "Do you like ... ", url: "https://youtu.be/7WqZH4wHaTA?si=pE8Q-r5bYpoVtVt_" },
            { description: "What do you like to do?", url: "https://youtu.be/EugXI2O2CtM?si=u0Ptuy6To_APxcAH" },
            { description: "Vocabulary Part 2", url: "https://youtu.be/JSKKtNDOtUQ?si=cOUyuTX1kz7CKQr-" },
            { description: "I can ... ", url: "https://youtu.be/fSOceJiPzpU?si=euN0jPfLz7YquJ0g" },
            { description: "Can you ... ", url: "https://youtu.be/rB1TYHZJAiM?si=zNfIvLRu1BjZ67fs" },
            { description: "Vocabulary Part 3", url: "https://youtu.be/sVxwduC5C1g?si=TJ840456JusYCLFp" },
            { description: " I will ... ", url: "https://youtu.be/_KSwU01YFZI?si=j8jOtAjFADc0VKtW" },
            { description: "I am ... ing", url: "https://youtu.be/p8vEwjNP4KQ?si=CppDH1Uo-tO90wkF" },
            { description: "What are you doing?", url: "https://youtu.be/_oGn6lr_5NM?si=4Ir_uThf4EqD3mWv" }
            //            { description: "", url: "" }
        ]
    },
    {
        "dictionary": "dictionaryBook1Lesson3",
        "conversations": [
            { description: "Vocabulary Part 1", url: "https://youtu.be/kiOnHhL209w?si=M6l2maMu39xHW8oV" },
            { description: "Describe things", url: "https://youtu.be/x45p7HmtmqM?si=jXnaSsW9rcPSSA23" },
            { description: "Describe things (Negative form)", url: "https://youtu.be/nJi-zqcxUSc?si=KShbBYMGwvU5n_NY" },
            { description: "Vocabulary Part 2", url: "https://youtu.be/LVHzeQ3wNjs?si=GUdd1KI51qLayXEp" },
            { description: "Describe things (Very)", url: "https://youtu.be/bx7hIiJFO68?si=4hXJb5-DjA3smR-V" },
            { description: "Asking about things : How is/was ...?", url: "https://youtu.be/yaYVB-lK_h4?si=0RKMW0DR71DKL159" },
            { description: "Asking about people", url: "https://youtu.be/BnZ-QPT-B6s?si=vUoGOpc4sAbpgTrs" },
            { description: "Comparative (part 1)", url: "https://youtu.be/upMaxRuWd0A?si=xeMnhoyBr3dXyFkF" },
            { description: "Comparative (Part 2, 3)", url: "https://youtu.be/b17cBeaFxbA?si=b9IjoZuSjLMmxdwx" },
            { description: "Comparative (Part 4, 5)", url: "https://youtu.be/QOAYt8-TsIE?si=--ktfcSgkgVg4qhA" },
            { description: "Superlative (Part 1, 2)", url: "https://youtu.be/w5vrOHIz5H4?si=ysadllffX7C4anUR" },
            { description: "Conversation 1", url: "https://youtu.be/kZt2-pl-ZBo?si=1D6bxGayfyXLya5D" },
            { description: "Conversation 2", url: "https://youtu.be/CUbUzfztFn0?si=IxmkBczveQThZ59L" },
            { description: "Comparison", url: "https://youtu.be/80di9PsGopI?si=4rLR-Vpwqwx2eR0Y" }
        ]
    },
    {
        "dictionary": "dictionaryBook1Lesson4",
        "conversations": [
            { description: "Numbers in Thai", url: "https://youtu.be/ENBSfyXXIHE?si=ZFmYlR5z4E67g3Gl" },
            { description: "Numbers in Thai (continued ... )", url: "https://youtu.be/oxI4tPY4lI4?si=quRjYzMazqK1jhyD" },
            { description: "Asking for the price (Part 1, 2)", url: "https://youtu.be/AiXwD_CGjy0?si=_uMfgCCds0TvE86C" },
            { description: "Giving information about the price", url: "https://youtu.be/qofrTMXDvhQ?si=TV6ljTNBc6_CiVha" },
            { description: "Asking for the a discount", url: "https://youtu.be/yrHNI-2BKvQ?si=Eqa803QJCP_fG-RI" },
            { description: "Conversation", url: "https://youtu.be/ai2f9hRI3x8?si=mrDXDfhTuA3atYhI" },
            { description: "Vocabulary Part 1", url: "https://youtu.be/SKttrMf_0EA?si=s4NpfmzwiA7DUpo3" }
        ]
    },
    {
        "dictionary": "dictionaryBook1Lesson5",
        "conversations": [
            { description: "Vocabulary Part 1", url: "https://youtu.be/04ZcXl2lmIw?si=0mi-A2VvRWeVTNRf" },
            { description: "Vocabulary Part 1 (continued)", url: "https://youtu.be/uzoSrBUTVNM?si=BFDwS-LA2wYHyFKz" },
            { description: "Where is the Church?", url: "https://youtu.be/1gMdzuCt5IE?si=6Mtu0nj0wzpqKnaR" }
        ]
    },
    // Book 2
    {
        "dictionary": "dictionaryBook2Lesson1",
        "conversations": [
            { description: "What would you like to order?", url: "https://youtu.be/vPkVyBZ3318?si=hTrhjEn_8RSv68Ak" },
            { description: "continued ... ", url: "https://youtu.be/98InOltlsps?si=7FTumGbUi-4lGI_1" },
            { description: "Have you ever tried ...?", url: "https://youtu.be/-eeooHbOxyw?si=HQpUbtEnqnYB_vFB" },
            { description: "What does ... taste like?", url: "https://youtu.be/0xvSxruOK2E?si=GwAPkfsXllygcfpL" },
            { description: " I would like to order ... ", url: "https://youtu.be/hdaKmkDlp9Y?si=HfQRU-18GpBNIbFK" },
            { description: " With / Without", url: "https://youtu.be/3X4xURJ6LEs?si=yXOVQcNHdMUpEgXJ" },
            { description: "Classifier for food", url: "https://youtu.be/p2rbLiPxE_o?si=GGTTDeQEERLb9eBp" },
            { description: "I would like 1 plate of ...?", url: "https://youtu.be/-NVJ3AUPxXg?si=tXL-sBjFX1_R_ivG" },
            { description: " When Ordering Food in Thailand", url: "https://youtu.be/BmZgDsuF8zQ?si=JG7BFf2GTpJkauXQ" },
            { description: "Conversation 1", url: "https://youtu.be/vvNu25As0mQ?si=rSTpc0cFR9nrnzgq" },
            { description: "Conversation 2", url: "https://youtu.be/vF6a4eIKMCo?si=LJWxYcFpGS2Qsm8i" }
            //           { description: "", url: "" }
        ]
    },
    {
        "dictionary": "dictionaryBook2Lesson2",
        "conversations": [
            { description: "What would you like to drink?", url: "https://youtu.be/Y0j30XEIAwE?si=Nblcemg5w9gQxUhU" },
            { description: "Normally what do you drink ...?", url: "https://youtu.be/QXD2Mm3JJqs?si=VUW-Kv_3bkopfzAI" },
            { description: "Classifier for drinks", url: "https://youtu.be/AXD5BBzczTY?si=8_caMA2CbLcp7072" },
            { description: "What would you like to order?", url: "https://youtu.be/fq4fkHcS_-I?si=h4oN3BV7mjBqdAph" },
            { description: "I would like ... of ...?", url: "https://youtu.be/s84Po1PxkgI?si=JYRGHu5wkXLLV2xw" },
            { description: "Vocabulary Part 2", url: "https://youtu.be/b7ZwwQ4N4E8?si=H1vHReHqNhGaRx6d" }
        ]
    },
    {
        "dictionary": "dictionaryBook2Lesson3",
        "conversations": [
            { description: "Fruits", url: "https://youtu.be/EpYJmMGHpho?si=AM7QxXRFRIuOxFpf" },
            { description: "Vocabulary", url: "https://youtu.be/EKRXfstVuAU?si=vaKhip5hrcocsV0W" },
        ]
    },
    {
        "dictionary": "dictionaryBook2Lesson4",
        "conversations": [
            { description: "Colours", url: "https://youtu.be/TXjoVSdMEgk?si=Ys-xcv9g7iAuleMo" },
            { description: "What colour do you like?", url: "https://youtu.be/le61J7LARTw?si=vkUSOJvpNiGSRYDL" },
            { description: "What colour is ...?", url: "https://youtu.be/Ka8susyLxjA?si=FuGUo2c8gAygB512" },
            { description: "What colour shirt is she/he wearing?", url: "https://youtu.be/Ghf_dfNVhco?si=3A_uJgTNVm6MOyGC" }
        ]
    },
    {
        "dictionary": "dictionaryBook2Lesson5",
        "conversations": [
            { description: "Classifiers", url: "https://youtu.be/I6FDcONu2EM?si=JmOmoijSPyfq8bfQ" },
            { description: "Vocabulary", url: "https://youtu.be/KsFpxwE3PIU?si=yAGvQ1H4GmzmSwrZ" },
            { description: "Example classifiers", url: "https://youtu.be/vBlRAOPVzjo?si=guTaKkfQqSLoczYD" },
            { description: "continued ...", url: "https://youtu.be/K5vdvXuSE6c?si=Ty0KQnFFyxUy31tT" },
            { description: "continued ...", url: "https://youtu.be/1XWaZm7--Oc?si=SvGdBb3N9YnD1VQh" },
            { description: "continued ...", url: "https://youtu.be/-nNbh_906tw?si=29jAB-jjOSzriQCz" },
            { description: "Conversation", url: "https://youtu.be/3HF3FRYGvZU?si=R2TrAxv8z-RFbGGK" },
            { description: "How to use “Many” in Thai.", url: "https://youtu.be/56VbYKbhwPk?si=IhN1_C7C3HrY61ar" }
        ]
    },
    {
        "dictionary": "dictionaryBook2Lesson6",
        "conversations": [
            { description: "Preposition", url: "https://youtu.be/a-6NLdAAKuM?si=PHFGj_Xxyfq72sSU" },
            { description: "Vocabulary", url: "https://youtu.be/OHaRLUiMk24?si=f9WqD_LeBlXr8Ou5" },
            { description: "There are 2 books on the table", url: "https://youtu.be/sfiInIP_ylU?si=NMmEG_tzWST384Ec" },
            { description: "How many books are there on the table?", url: "https://youtu.be/K9rmI78ktpg?si=CtXGyWFHhIR_hTyD" },
            { description: "Conversation", url: "https://youtu.be/SDQYGLE2oW4?si=XsYfK-TmSDMwz7Vu" },
            { description: "continued ...", url: "https://youtu.be/PDy2YP-3cUE?si=v6MxBl2kfMftykl1" },
            { description: "Whic ...?", url: "https://youtu.be/7WxyaEi9ssQ?si=wrn0n5prwVWSDhEm" }
        ]
    },
    // Book 3
    {
        "dictionary": "dictionaryBook3Lesson1",
        "conversations": [
            { description: "What time is it now?", url: "https://youtu.be/praUAEMtWIs?si=4wXLfDjdVrKIeKyl" },
            { description: "Vocabulary", url: "https://youtu.be/mm-Yb0d93kQ?si=-TvimsyBSk_cBq4_" },
            { description: "What time is it now?", url: "https://youtu.be/U_ZAlFuGcwY?si=hvgTj96rgztl4zjR" },
            { description: "What time do you wake up?", url: "https://youtu.be/oyqonhgTd_k?si=EgNIOyegNxVZG09c" },
            { description: "Conversation 1", url: "https://youtu.be/m4l-dEuGA8A?si=zd-zAsXbEH6U48TN" },
            { description: "How many hours/minutes?", url: "https://youtu.be/VAKfFaSEjPc?si=hdAFj1hywWvNbAqV" },
            { description: "Conversation 2", url: "https://youtu.be/L1aLRVo6NTs?si=nPpRIgZClwAr97Q-" },
            { description: "What do you usually do before studying Thai?", url: "https://youtu.be/z5tSAsVfPXg?si=CTyUx2qUAP4F9QhC" },
            { description: "Vocabulary 3", url: "https://youtu.be/v65J2b_rgOU?si=XDlcs9oIPWWclOL_" }
            //            { description: "", url: "" }
        ]
    },
    {
        "dictionary": "dictionaryBook3Lesson2",
        "conversations": [
            { description: "What day is it today?", url: "https://youtu.be/PQQdDCMO7kE?si=kwkzCb6R799ynfGn" },
            { description: "continued ... ", url: "https://youtu.be/WsVALhZanfE?si=7DaIL590CQze0fDX" },
            { description: "What day is it today?", url: "https://youtu.be/INQOD75kCTk?si=I2DfK-6rSz5QFW2J" },
            { description: "What is the date today?", url: "https://youtu.be/AV_6eG2FEhA?si=DEP1anRUApgtPNZK" },
            { description: "What do you usually do on your weekend?", url: "https://youtu.be/ka8vtwY98hM?si=tR_N99iMGEw6VHdd" },
            { description: "Conversation 1", url: "https://youtu.be/equzVlc6aJ4?si=9-NT2CitAQdWjJMh" },
            { description: "continued ... ", url: "https://youtu.be/hEa9FwoKNe0?si=gz-QZECzTC-bhrK0" },
            { description: "How many days per week do you study Thai?", url: "https://youtu.be/HSC8Tq3DKNA?si=KM0tXJWy7vpl1MdO" },
            { description: "How many days in a week do you study Thai?", url: "https://youtu.be/ENbXIibgy7I?si=ej3BVxHg2YfVWPBT" },
            { description: "Conversation 2", url: "https://youtu.be/3j1AC4tL2Ms?si=SvA7C0O-5mRpQrsx" },
            { description: "continued ... ", url: "https://youtu.be/BWcWpgdL_2Y?si=ZsZYPlzrREB8Ljs3" }
            //    { description: "", url: "" }
        ]
    },
    {
        "dictionary": "dictionaryBook3Lesson3",
        "conversations": [
            { description: "Months / Year / Seasons", url: "https://youtu.be/cErs6Lep_WI?si=f75H6zDLatPbI0DU" },
            { description: "What month is this month?", url: "https://youtu.be/eqc-VZ65y5o?si=UQyQJcB4g_n6SABP" },
            { description: "When were you born?", url: "https://youtu.be/Q4j-2ZiWEA8?si=NLyxSkskp9zHiVSK" },
            { description: "Conversation 1", url: "https://youtu.be/k1-cyFVp1vs?si=qTojc_NRsWI4DjjU" },
            { description: "Vocabulary", url: "https://youtu.be/I8y6-Q_g81g?si=HKTWW7b3UfEmDKzD" },
            { description: "How many seasons are there in Thailand?", url: "https://youtu.be/qmQafMySHbI?si=thycS1rLIB3DyY4k" },
            { description: " How’s the weather today?", url: "https://youtu.be/VW9-YL71WQc?si=KLrSSZFyX8dcQzXd" },
            { description: "Conversation 2", url: "https://youtu.be/b8c-CFPywes?si=kPBUf0qw5AQFZqKe" },
            { description: "Listening Practice", url: "https://youtu.be/sa52tiTefUc?si=zIBOf15iy6vXy2cl" }
            //            { description: "", url: "" }
        ]
    },
    {
        "dictionary": "dictionaryBook3Lesson4",
        "conversations": [
            { description: "My family", url: "https://youtu.be/HYA_E5Usnuo?si=FAxXum6RX9gbtovH" },
            { description: "continued ... ", url: "https://youtu.be/GW69SI7RZgw?si=dR13s671v5-Wju29" },
            { description: "How many people are there in your family?", url: "https://youtu.be/ChU8bSd8uhU?si=Z8GWcnmzPSUwhVNV" },
            { description: "Conversation", url: "https://youtu.be/zQF2L_G9nSQ?si=Yxcnn5jfIvFWjfZX" },
            { description: "Timmy’s story", url: "https://youtu.be/RlCACHu-2Gg?si=Tlz9zDI5cLlRr3jk" },
            { description: "How old are you?", url: "https://youtu.be/75EorHYz6eY?si=j_SEFQYxGdn5cpAG" },
            { description: "Are you married?", url: "https://youtu.be/b-XmOoW5MHM?si=sPoR-8Iz7U6GcGMI" }
            //            { description: "", url: "" }
        ]
    },
    {
        "dictionary": "dictionaryBook3Lesson5",
        "conversations": [
            { description: "What is your job?", url: "https://youtu.be/zdbnq2hoSiE?si=yaganfO4TQNrkRxO" },
            { description: "What do you do?/What is your job?", url: "https://youtu.be/TQgQ0Wl3T9E?si=mz2IoemNNB9lM-HJ" },
            { description: "Conversation", url: "https://youtu.be/YTSUCo9-fs4?si=JOB4m36GtH5Iz4la" }
            //            { description: "", url: "" }
        ]
    },
    {
        "dictionary": "dictionaryBook3Lesson6",
        "conversations": [
            { description: "What does she/he look like?", url: "https://youtu.be/-rWBdUqqz_o?si=eOn0eJuiIPGLXEIB" },
            { description: "What colour is his/her eyes?", url: "https://youtu.be/hnsVJKtRrD0?si=IFA0uCj30Vwq6s_5" },
            { description: "What does he/she look like?", url: "https://youtu.be/GAYDLWLddLw?si=D6Lpb1MZDqWpWduX" },
            { description: "How tall are you?", url: "https://youtu.be/u5YuIdx2zXs?si=0H--h13nYbmx0wo2" },
            { description: "How much do you weigh?", url: "https://youtu.be/Noxq8368pys?si=_Xfgib3e-IAAkXUn" }
            //            { description: "", url: "" }
        ]
    }
]
*/

// Reading and Writing 1
// Thai Alphabet

const dictionaryRW1LowClassConsonants = [
    { word_en: "phɔɔ phaan", word_th: "พ", hint: "offering tray (LC ภ phɔɔ sam-phaw)" },
    { word_en: "fɔɔ fan", word_th: "ฟ", hint: "tooth (LC)" },
    { word_en: "thɔɔ tha-haan", word_th: "ท", hint: "soldier (LC ธ thɔɔ thoŋ, ฑ thɔɔ mon-thoo, ฒ thɔɔ phuu-thaw)" },
    { word_en: "khɔɔ khwaay", word_th: "ค", hint: "buffalow (LC ฆ khɔɔ ra-khaŋ)" },
    { word_en: "sɔɔ soo", word_th: "ซ", hint: "chain (LC)" },
    { word_en: "hɔɔ nok-huuk", word_th: "ฮ", hint: "owl (LC)" },
    { word_en: "chɔɔ chaaŋ", word_th: "ช", hint: "elephant (LC ฌ chɔɔ chəə)" },
    { word_en: "ŋɔɔ ŋuu", word_th: "ง", hint: "snake (LC)" },
    { word_en: "yɔɔ yak", word_th: "ย", hint: "giant (LC ญ yɔɔ phuu-yiŋ)" },
    { word_en: "nɔɔ nuu", word_th: "น", hint: "mouse (LC ณ nɔɔ neen)" },
    { word_en: "rɔɔ rwa", word_th: "ร", hint: "boat (LC)" },
    { word_en: "wɔɔ wεεn", word_th: "ว", hint: "ring (LC)" },
    { word_en: "mɔɔ maa", word_th: "ม", hint: "horrse (LC)" },
    { word_en: "lɔɔ liŋ", word_th: "ล", hint: "monkey (LC ฬ lɔɔ ju-laa)" },
    { word_en: "phɔɔ sam-phaw", word_th: "ภ", hint: "sailing boat (LC uncommon)" },
    { word_en: "thɔɔ thoŋ", word_th: "ธ", hint: "flag (LC uncommon)" },
    { word_en: "thɔɔ mon-thoo", word_th: "ฑ", hint: "Lady Montho (LC uncommon)" },
    { word_en: "thɔɔ phuu-thaw", word_th: "ฒ", hint: "elderly (LC uncommon)" },
    { word_en: "khɔɔ ra-khaŋ", word_th: "ฆ", hint: "bell (LC uncommon)" },
    { word_en: "chɔɔ chəə", word_th: "ฌ", hint: "name of a tree (LC uncommon)" },
    { word_en: "yɔɔ phuu-yiŋ", word_th: "ญ", hint: "female (LC uncommon)" },
    { word_en: "nɔɔ neen", word_th: "ณ", hint: "novice (LC uncommon)" },
    { word_en: "lɔɔ ju-laa", word_th: "ฬ", hint: "kite (LC uncommon)" }
];

const dictionaryRW1MiddleClassConsonants = [
    { word_en: "gɔɔ gai", word_th: "ก", hint: "chicken (MC)" },
    { word_en: "jɔɔ jaan", word_th: "จ", hint: "plate (MC)" },
    { word_en: "dɔɔ dek", word_th: "ด", hint: "child (MC ฎ dɔɔ cha-daa )" },
    { word_en: "dtɔɔ dtaw", word_th: "ต", hint: "turtle (MC ฏ dtɔɔ bpa-dtak)" },
    { word_en: "bɔɔ bai-maay", word_th: "บ", hint: "leaf (MC)" },
    { word_en: "bpɔɔ bplaa", word_th: "ป", hint: "fish (MC)" },
    { word_en: "ɔɔ aaŋ", word_th: "อ", hint: "basin (MC)" },
    { word_en: "dɔɔ cha-daa", word_th: "ฎ", hint: "head dress (MC uncommon)" },
    { word_en: "dtɔɔ bpa-dtak", word_th: "ฏ", hint: "lance (MC uncommon)" }
];

const dictionaryRW1HighClassConsonants = [
    { word_en: "phɔɔ phwwŋ", word_th: "ผ", hint: "bee (HC)" },
    { word_en: "fɔɔ faa", word_th: "ฝ", hint: "lid (HC)" },
    { word_en: "thɔɔ thuŋ", word_th: "ถ", hint: "bag (HC ฐ thɔɔ thaan)" },
    { word_en: "khɔɔ khai", word_th: "ข", hint: "egg (HC)" },
    { word_en: "sɔɔ swa", word_th: "ส", hint: "tiger (HC ษ sɔɔ rww-sii, ศ sɔɔ saa-laa)" },
    { word_en: "hɔɔ hiip", word_th: "ห", hint: "treasure box (HC)" },
    { word_en: "chɔɔ chiŋ", word_th: "ฉ", hint: "cymbal (HC)" },
    { word_en: "thɔɔ thaan", word_th: "ฐ", hint: "pedestal (HC uncommon)" },
    { word_en: "sɔɔ rww-sii", word_th: "ษ", hint: "hermit (HC uncommon)" },
    { word_en: "sɔɔ saa-laa", word_th: "ศ", hint: "pavilion (HC uncommon)" }
];

const dictionaryVowels = [
    { word_en: "a", word_th: "-ะ", hint: "SV" },
    { word_en: "aa", word_th: "-า", hint: "LV" },
    { word_en: "i", word_th: "-ิ", hint: "SV" },
    { word_en: "ii", word_th: "-ี", hint: "LV" },
    { word_en: "w", word_th: "-ึ", hint: "SV" },
    { word_en: "ww", word_th: "-ือ", hint: "LV" },
    { word_en: "u", word_th: "-ุ", hint: "SV" },
    { word_en: "uu", word_th: "-ู", hint: "LV" },
    { word_en: "ee", word_th: "เ-", hint: "LV" },
    { word_en: "εε", word_th: "เเ-", hint: "LV" },
    { word_en: "oo", word_th: "โ-", hint: "LV" },
    { word_en: "ɔɔ", word_th: "-อ", hint: "LV" },
    { word_en: "əə", word_th: "เ-อ", hint: "LV" },
    { word_en: "ia", word_th: "เ-ีย", hint: "LV" },
    { word_en: "wa", word_th: "เ-ือ", hint: "LV" },
    { word_en: "ua", word_th: "-ัว", hint: "LV" },
    { word_en: "am", word_th: "-ำ", hint: "LV" },
    { word_en: "ai", word_th: "ไ ใ", hint: "LV" },
    { word_en: "aw", word_th: "เ-า", hint: "LV" }
];

const dictionaryRW1_MC_LV_MT = [
    { word_en: "crow", word_th: "อีกา", hint: "MC LV MT" },
    { word_en: "crab", word_th: "ปู", hint: "MC LV MT" },
    { word_en: "young uncle", word_th: "อา", hint: "MC LV MT" },
    { word_en: "see", word_th: "ดู", hint: "MC LV MT" },
    { word_en: "year", word_th: "ปี", hint: "MC LV MT" },
    { word_en: "grown up", word_th: "โต", hint: "MC LV MT" },
    { word_en: "good", word_th: "ดี", hint: "MC LV MT" },
    { word_en: "lotus", word_th: "บัว", hint: "MC LV MT" },
    { word_en: "eye", word_th: "ตา", hint: "MC LV MT" },
    { word_en: "meet", word_th: "เจอ", hint: "MC LV MT" },
    { word_en: "remember", word_th: "จํา", hint: "MC LV MT" },
    { word_en: "go", word_th: "ไป", hint: "MC LV MT" }
];

const dictionaryRW1_MC_SV_LT = [
    { word_en: "island", word_th: "เกาะ", hint: "MC SV LT" },
    { word_en: "sheep", word_th: "แกะ", hint: "MC SV LT" },
    { word_en: "touch", word_th: "เตะ", hint: "MC SV LT" },
    { word_en: "year", word_th: "ปี", hint: "MC SV LT" },
    { word_en: "eye", word_th: "ตา", hint: "MC SV LT" },
    { word_en: "fierce", word_th: "ดุ", hint: "MC SV LT" },
    { word_en: "light", word_th: "เบา", hint: "MC SV LT" },
    { word_en: "remember", word_th: "จํา", hint: "MC SV LT" },
    { word_en: "lotus", word_th: "บัว", hint: "MC SV LT" }
];

/*
const dictionaryRW1_HC_LV_RT = [
    { word_en: "lotus", word_th: "บัว", hint: "MC SV LT" }

];

const dictionaryRW1_HC_SV_LT = [
    { word_en: "lotus", word_th: "บัว", hint: "MC SV LT" }

];
*/

/*
    { word_en: "", word_th: "บัว", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" },
    { word_en: "", word_th: "", hint: "" }
]
*/
/*
const dictionaryRW2ChangeFormVowels = [
    { word_en: "together", word_th: "กัน", pronunciation: "กัน", sound_th: "thai_vowels/together.mp3" },
    { word_en: "eat", word_th: "กิน", pronunciation: "กิน", sound_th: "thai_vowels/eat.mp3" },
    { word_en: "axis", word_th: "แก็น", pronunciation: "แก็น", sound_th: "thai_vowels/axis.mp3" },
    { word_en: "over", word_th: "เกิน", pronunciation: "เกิน", sound_th: "thai_vowels/over.mp3" },
    { word_en: "stir", word_th: "กวน", pronunciation: "กวน", sound_th: "thai_vowels/stir.mp3" },
    { word_en: "an", word_th: "อัน", pronunciation: "อัน", sound_th: "thai_vowels/an.mp3" },
    { word_en: "day", word_th: "วัน", pronunciation: "วัน", sound_th: "thai_vowels/day.mp3" },
    { word_en: "it", word_th: "มัน", pronunciation: "มัน", sound_th: "thai_vowels/it.mp3" },
    { word_en: "I (female)", word_th: "ฉัน", pronunciation: "ฉัน", sound_th: "thai_vowels/i_female.mp3" },
    { word_en: "tooth", word_th: "ฟัน", pronunciation: "ฟัน", sound_th: "thai_vowels/tooth.mp3" },
    { word_en: "as", word_th: "ดัง", pronunciation: "ดัง", sound_th: "thai_vowels/as.mp3" },
    { word_en: "gluten", word_th: "ตัง", pronunciation: "ตัง", sound_th: "thai_vowels/gluten.mp3" },
    { word_en: "not_yet", word_th: "ยัง", pronunciation: "ยัง", sound_th: "thai_vowels/not_yet.mp3" },
    { word_en: "listen", word_th: "ฟัง", pronunciation: "ฟัง", sound_th: "thai_vowels/listen.mp3" },
    { word_en: "tank", word_th: "ถัง", pronunciation: "ถัง", sound_th: "thai_vowels/tank.mp3" },
    { word_en: "bite", word_th: "กัด", pronunciation: "กัด", sound_th: "thai_vowels/bite.mp3" },
    { word_en: "cut", word_th: "ตัด", pronunciation: "ตัด", sound_th: "thai_vowels/cut.mp3" },
    { word_en: "scrub", word_th: "ขัด", pronunciation: "ขัด", sound_th: "thai_vowels/scrub.mp3" },
    { word_en: "puff", word_th: "ผัด", pronunciation: "ผัด", sound_th: "thai_vowels/puff.mp3" },
    { word_en: "blow", word_th: "พัด", pronunciation: "พัด", sound_th: "thai_vowels/blow.mp3" },
    { word_en: "shot", word_th: "นัด", pronunciation: "นัด", sound_th: "thai_vowels/shot.mp3" },
    { word_en: "measure", word_th: "วัด", pronunciation: "วัด", sound_th: "thai_vowels/measure.mp3" },
    { word_en: "love", word_th: "รัก", pronunciation: "รัก", sound_th: "thai_vowels/love.mp3" },
    { word_en: "whip", word_th: "ชัก", pronunciation: "ชัก", sound_th: "thai_vowels/whip.mp3" },
    { word_en: "gun", word_th: "ปืน", pronunciation: "ปืน", sound_th: "thai_vowels/gun.mp3" },
    { word_en: "stand", word_th: "ยืน", pronunciation: "ยืน", sound_th: "thai_vowels/stand.mp3" }
];

const dictionaryRW2LiveFinalConsonant = [
    { word_en: "afternoon", word_th: "บ่าย", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "frequent", word_th: "บ่อย", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "bay", word_th: "อ่าว", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "read", word_th: "อ่าน", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "shrimp", word_th: "กุ้ง", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "cheek", word_th: "แก้ม", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "pace", word_th: "ก้าว", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "some", word_th: "บ้าง", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "sign", word_th: "ป้าย", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "sugar cane", word_th: "อ้อย", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "flour", word_th: "แป้ง", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "hire", word_th: "จ้าง", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "house", word_th: "บ้าน", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "basin", word_th: "อ่างนำ้", hint: "MC + Live endings + Tone markers - LIVE" },
    { word_en: "branch", word_th: "กิ่งไม้", hint: "MC + Live endings + Tone markers - LIVE" }
];
*/
const dictionaries = {
    /*
        // book 1
        dictionaryBook1Lesson1: dictionaryBook1Lesson1,
        dictionaryBook1Lesson2: dictionaryBook1Lesson2,
        dictionaryBook1Lesson3: dictionaryBook1Lesson3,
        dictionaryBook1Lesson4: dictionaryBook1Lesson4,
        dictionaryBook1Lesson5: dictionaryBook1Lesson5,
    
        // book 2
        dictionaryBook2Lesson1: dictionaryBook2Lesson1,
        dictionaryBook2Lesson2: dictionaryBook2Lesson2,
        dictionaryBook2Lesson3: dictionaryBook2Lesson3,
        dictionaryBook2Lesson4: dictionaryBook2Lesson4,
        dictionaryBook2Lesson5: dictionaryBook2Lesson5,
        dictionaryBook2Lesson6: dictionaryBook2Lesson6,
    
        // book 3
        dictionaryBook3Lesson1: dictionaryBook3Lesson1,
        dictionaryBook3Lesson2: dictionaryBook3Lesson2,
        dictionaryBook3Lesson3: dictionaryBook3Lesson3,
        dictionaryBook3Lesson4: dictionaryBook3Lesson4,
        dictionaryBook3Lesson5: dictionaryBook3Lesson5,
        dictionaryBook3Lesson6: dictionaryBook3Lesson6,
    */

    // RW 1
    dictionaryRW1LowClassConsonants: dictionaryRW1LowClassConsonants,
    dictionaryRW1MiddleClassConsonants: dictionaryRW1MiddleClassConsonants,
    dictionaryRW1HighClassConsonants: dictionaryRW1HighClassConsonants,
    dictionaryVowels: dictionaryVowels,
    dictionaryRW1_MC_LV_MT: dictionaryRW1_MC_LV_MT,
    dictionaryRW1_MC_SV_LT: dictionaryRW1_MC_SV_LT,
    /*
    dictionaryRW1_HC_LV_RT: dictionaryRW1_HC_LV_RT,
    dictionaryRW1_HC_SV_LT: dictionaryRW1_HC_SV_LT,
*/
    // RW 2 
    /*
    dictionaryRW2ChangeFormVowels: dictionaryRW2ChangeFormVowels,
    
    dictionaryRW2LiveFinalConsonant: dictionaryRW2LiveFinalConsonant
    */
};

const dictionaryIncorrectAnswers = [];

let wordIndex = 0;
let dictionary = [];  // used for word search
let currentDictionary = [];
let selectedDictionaryNames = []; // selected dictionary checkboxes

let NoAnswerChoices = 3;
let correctAnswerCount = 0;
let incorrectAnswerCount = 0;
let attemptAnswerCount = 0;

// input textbox for search word or input textbox used to display word from chosen dictionary
const searchWord = document.getElementById("searchWord");
const currentLang = document.getElementById("lang");
const thSpeak = document.getElementById("thSpeak");

const incorrectAnswersOnly = document.getElementById("incorrectAnswersOnly");
const randomizeCheckbox = document.getElementById("randomize");
const dictionaryCheckboxes = document.querySelectorAll('.checkbox-dictionary-container input[type="checkbox"]');

let pausePlay = false;
let delayRead = 1500; // millisecond

const addTranslation = document.querySelector("#addTranslation");
let translate = false;

initialize();

currentLang.addEventListener("click", function () {
    const lang = currentLang.getAttribute("data-lang");

    if (lang === "TH") {
        currentLang.dataset.lang = "EN"
        currentLang.textContent = "EN";
        currentLang.innerText = "EN";
    } else {
        currentLang.dataset.lang = "TH"
        currentLang.textContent = "TH";
        currentLang.innerText = "TH";
    }

    if (currentDictionary.length > 0) {
        htmlMultipleChoice(wordIndex);
    } else {
        searchWord.ariaPlaceholder = "Search word or select a dictionary";
    }

});

searchWord.addEventListener('input', function (event) {

    const userInput = event.target.value.toLowerCase();
    const divDictionaryMatchedWords = document.getElementById("dictionaryMatchedWords");
    divDictionaryMatchedWords.innerHTML = '';

    if (userInput === "") {
        divDictionaryMatchedWords.innerHTML = '';
        return;
    }

    const matchedDictionaryRecords = dictionary.filter(obj => obj.word_en.toLowerCase().startsWith(userInput));

    matchedDictionaryRecords.forEach(
        (matchedDictionaryRecord) => {

            const buttonMatchedWord_en = document.createElement("button");
            buttonMatchedWord_en.textContent = matchedDictionaryRecord.word_en;
            divDictionaryMatchedWords.appendChild(buttonMatchedWord_en);

            let soundFileName = matchedDictionaryRecord.word_en.replace(' ', '_');
            soundFileName = soundFileName.toString().toLowerCase();
            const soundFilePathname = "../assets/sound/th/" + soundFileName + ".mp3";

            buttonMatchedWord_en.addEventListener("click", function () {
                playWord(soundFilePathname);
            });

            const buttonMatchedWord_th = document.createElement("button");
            buttonMatchedWord_th.textContent = matchedDictionaryRecord.word_th;
            buttonMatchedWord_th.lang = "TH"
            divDictionaryMatchedWords.appendChild(buttonMatchedWord_th);

            buttonMatchedWord_th.addEventListener("click", function () {
                playWord(soundFilePathname);
            });

        });
});

dictionaryCheckboxes.forEach(function (dictionaryCheckbox) {

    dictionaryCheckbox.addEventListener('change', function (event) {

        if (dictionaryCheckbox.checked) {
            selectedDictionaryNames.push(dictionaryCheckbox.value);
        } else {
            const index = selectedDictionaryNames.indexOf(dictionaryCheckbox.value);
            selectedDictionaryNames.splice(index, 1);
        }

        //       console.log('selectedDictionaryNames ' + selectedDictionaryNames);

        setDictionary();

    });

});

previousWord.addEventListener("click", () => {

    if (wordIndex > 0 && currentDictionary.length > 0) {
        wordIndex = (wordIndex - 1) % currentDictionary.length;
    } else if (wordIndex == 0 && currentDictionary.length > 0) {
        wordIndex = currentDictionary.length - 1;
    } else {
        wordIndex = 0;
    }

    document.getElementById("dictionaryMatchedWords").innerHTML = "";
    htmlMultipleChoice(wordIndex);

});

nextWord.addEventListener("click", () => {

    if (wordIndex < currentDictionary.length && currentDictionary.length > 0) {
        wordIndex = (wordIndex + 1) % currentDictionary.length;
    } else {
        wordIndex = 0;
    }

    document.getElementById("dictionaryMatchedWords").innerHTML = "";
    htmlMultipleChoice(wordIndex);

});

incorrectAnswersOnly.addEventListener("click", () => {
    setDictionary();
});

randomizeCheckbox.addEventListener("change", () => {
    /*
        if (currentDictionary.length == 0) {
            //        randomizeCheckbox.checked = false;
            return;
        }
    
        if (randomizeCheckbox.checked) {
            //        randomize = true;
            lastDictionary = currentDictionary;
            currentDictionary = shuffle(currentDictionary);
        } else {
            //       randomize = false;
            // setDictionary();
            currentDictionary = lastDictionary;
        }
        wordIndex = 0;
        htmlMultipleChoice(wordIndex);
    */
    setDictionary();
});

// create link to Google translate
thSpeak.addEventListener("click", function () {
    const thWordInput = document.getElementById("thWord");
    const thWord = thWordInput.value;

    let url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th&q=";
    url = url + thWord;

    let a = document.getElementById("soundLink"); //or grab it by tagname etc
    a.href = url;

});

function initialize() {

    wordIndex = 0;

    initializeDictionary();
    currentDictionary = "";

    document.getElementById("searchWord").value = "";
    document.getElementById("dictionaryMatchedWords").innerHTML = "";

    uncheckSelectedCheckboxes(dictionaryCheckboxes);

    randomizeCheckbox.checked = false;
    incorrectAnswersOnly.checked = false;
    document.getElementById("incorrectAnswersOnlyContainer").style.display = "none";

    document.getElementById("multipleChoice").style.display = "none";

    document.getElementById("wordContainer").innerHTML = "";

    document.getElementById("inputDelay").value = 1;

    const readAloud = document.getElementById("readAloud");
    readAloud.style.display = "none";

    document.getElementById("addTranslation").checked = false;
    translate = false;

}

function setDictionary() {

    let lastDictionary = currentDictionary; // used for randmised and return to ordered

    currentDictionary = [];

    document.getElementById("wordContainer").innerHTML = "";

    if (selectedDictionaryNames.length === 0) {
        initialize();
        return;
    } else {

        selectedDictionaryNames.forEach(dictionaryName => {

            if (dictionaries.hasOwnProperty(dictionaryName)) {

                const newArray = [...dictionaries[dictionaryName]];
                currentDictionary = currentDictionary.concat(newArray);
                lastDictionary = lastDictionary.concat(newArray);

            } else {
                //               console.log(`Array '${dictionaryName}' does not exist.`);
            }
        });

        if (incorrectAnswersOnly.checked) {
            currentDictionary = dictionaryIncorrectAnswers;
        }

        if (randomizeCheckbox.checked) {
            currentDictionary = shuffle(currentDictionary);
        }

        // wordIndex is set for pause and play, exception arises when dictionaies are deselected
        if (currentDictionary.length < wordIndex) {
            wordIndex = 0;
        }

        feedback();

        document.getElementById("readAloud").style.display = "block";
        readAloud(currentDictionary);

        document.getElementById("multipleChoice").style.display = "block";
        htmlMultipleChoice(wordIndex);
    }

}

function initializeDictionary() {

    // dictionary is concatenation of all dictionaries for word search

    let dictionaryNames = Object.keys(dictionaries);

    dictionaryNames.forEach(name => {

        if (dictionaries.hasOwnProperty(name)) {
            const newArray = [...dictionaries[name]];
            dictionary = dictionary.concat(newArray);

        } else {
            //            console.log(`Array '${name}' does not exist.`);
        }
    });

}

function uncheckSelectedCheckboxes(checkboxes) {
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
}

function htmlMultipleChoice(wordIndex) {

    if (currentDictionary.length <= 0) {
        //       searchWord.value = 'Select a dictionary';
        searchWord.ariaPlaceholder = "Search word or select a dictionary";

        return;
    }

    //    const ulSearchWords = document.getElementById("searchWords");
    const divSearchWords = document.getElementById("searchWords");
    divSearchWords.innerHTML = '';

    //    ulSearchWords.innerHTML = '';

    let randomWords = [];


    if ("TH" === currentLang.dataset.lang) {
        searchWord.value = currentDictionary[wordIndex].word_th;
        searchWord.lang = "TH"
    } else {
        searchWord.value = currentDictionary[wordIndex].word_en;
        searchWord.lang = "EN"
    }
    //   searchWord.value = currentDictionary[questionWordIndex].word_en;

    // get multiple choice word indexes, add index for correct answer, shuffle the array
    randomWords = getRandomIntArray(wordIndex, currentDictionary.length);
    randomWords.push(wordIndex); // add index for correct word
    let shuffledWords = [];
    shuffledWords = shuffle(randomWords);

    shuffledWords.forEach(
        (userSelectedIndex) => {

            const buttonChoiceWordTh = document.createElement("button");
            if ("TH" === currentLang.dataset.lang) {
                buttonChoiceWordTh.textContent = currentDictionary[userSelectedIndex].word_en;
                buttonChoiceWordTh.lang = "EN";
            } else {
                buttonChoiceWordTh.textContent = currentDictionary[userSelectedIndex].word_th;
                buttonChoiceWordTh.lang = "TH";
            }

            divSearchWords.appendChild(buttonChoiceWordTh);

            buttonChoiceWordTh.addEventListener('click', function () {

                if (currentDictionary[wordIndex].word_en === currentDictionary[userSelectedIndex].word_en) {
                    buttonChoiceWordTh.classList.add("correct");
                    correctAnswerCount++;
                } else {
                    buttonChoiceWordTh.lang = "EN";
                    buttonChoiceWordTh.classList.add("incorrect");
                    buttonChoiceWordTh.textContent = currentDictionary[userSelectedIndex].word_en
                        + ' = ' + currentDictionary[userSelectedIndex].word_th
                        + ' = ' + currentDictionary[userSelectedIndex].hint;
                    incorrectAnswerCount++;

                    const found = dictionaryIncorrectAnswers.find(
                        ({ word_en }) => word_en === currentDictionary[wordIndex].word_en);
                    if (!found) {
                        dictionaryIncorrectAnswers.push(currentDictionary[wordIndex]);

                        if (dictionaryIncorrectAnswers.length > NoAnswerChoices) {
                            const incorrectAnswersOnlyContainer = document.getElementById("incorrectAnswersOnlyContainer");
                            incorrectAnswersOnlyContainer.style.display = "initial";
                        }
                    }
                }

                const text = currentDictionary[userSelectedIndex].word_en;
                textToSpeech(text);

                /*
                                let soundFileName = currentDictionary[userSelectedIndex].word_en.replace(' ', '_');
                                soundFileName = soundFileName.toString().toLowerCase();
                                const soundFile = "../assets/sound/th/" + soundFileName + ".mp3";
                                playWord(soundFile);
                */

                attemptAnswerCount++;
                feedback();

            });

            const buttonChoiceWord = document.createElement("button");
            buttonChoiceWord.textContent = currentDictionary[userSelectedIndex].hint;

            //           liChoiceWord.appendChild(buttonChoiceWord);
            divSearchWords.appendChild(buttonChoiceWord);

            buttonChoiceWord.addEventListener("click", function () {

                if (currentDictionary[wordIndex].word_en === currentDictionary[userSelectedIndex].word_en) {
                    buttonChoiceWord.classList.add("correct");
                    correctAnswerCount++;
                } else {
                    buttonChoiceWordTh.lang = "EN";
                    buttonChoiceWord.classList.add("incorrect");
                    buttonChoiceWord.textContent = currentDictionary[userSelectedIndex].word_en
                        + ' = ' + currentDictionary[userSelectedIndex].word_th
                        + ' = ' + currentDictionary[userSelectedIndex].hint;
                    incorrectAnswerCount++;
                    const found = dictionaryIncorrectAnswers.find(
                        ({ word_en }) => word_en === currentDictionary[wordIndex].word_en);
                    if (!found) {
                        dictionaryIncorrectAnswers.push(currentDictionary[wordIndex]);

                        if (dictionaryIncorrectAnswers.length > NoAnswerChoices) {
                            const incorrectAnswersOnlyContainer = document.getElementById("incorrectAnswersOnlyContainer");
                            incorrectAnswersOnlyContainer.style.display = "initial";
                        }
                    }
                }

                let soundFileName = currentDictionary[userSelectedIndex].word_en.replace(' ', '_');
                soundFileName = soundFileName.toString().toLowerCase();
                const soundFile = "../assets/sound/th/" + soundFileName + ".mp3";
                playWord(soundFile);

                attemptAnswerCount++;
                feedback();

            });

        });

}

function feedback() {
    const buttonCorrect = document.getElementById("correctAnswer");
    buttonCorrect.textContent = correctAnswerCount + " ✓";

    const buttonIncorrect = document.getElementById("incorrectAnswer");
    buttonIncorrect.textContent = incorrectAnswerCount + " x";

    const buttonScore = document.getElementById("score");
    buttonScore.textContent = parseInt((correctAnswerCount / attemptAnswerCount) * 100) + "%";

    const buttonTries = document.getElementById("tries");
    buttonTries.textContent = attemptAnswerCount + " tries";

    const buttonDictionaryLength = document.getElementById("dictionaryLength");
    buttonDictionaryLength.textContent = currentDictionary.length + ' words';

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

/*
function displayAllWords() {
    let html = '';
    for (let i = 0; i < wordsAndSoundFiles.length; i++) {
        html += `< span id = "word${i}" > ${wordsAndSoundFiles[i].word}</span > `;
        if (i < wordsAndSoundFiles.length - 1) {
            html += ' ';
        }
    }
    //   document.getElementById('wordContainer').innerHTML = html;

    playAndHighlightWords();
}
*/

// Play aloud
document.getElementById('buttonPlayAll').addEventListener('click', function () {

    let wordSpans = document.querySelectorAll('#wordContainer span');
    // let wordSpans = document.querySelectorAll('#wordContainer [lang = "TH"]');

    pausePlay = false;

    function playNextWord() {

        if (wordIndex < wordSpans.length) {

            let wordSpan = wordSpans[wordIndex];

            if (wordIndex > 0) {
                const previousWordSpan = wordSpans[wordIndex - 1];
                previousWordSpan.classList.remove('highlight');
                previousWordSpan.classList.remove('highlight-paused');
                previousWordSpan.classList.remove('highlight-red');
            }

            // sound file for th and texttospeach for en
            if (wordSpan.lang === "TH") {
                let soundFileName = wordSpan.dataset.word_en.replace(' ', '_');
                soundFileName = soundFileName.toString().toLowerCase();
                const soundFilePathname = "../assets/sound/th/" + soundFileName + ".mp3";
                playWord(soundFilePathname);
            } else if (wordSpan.lang === "EN") {
                textToSpeech(wordSpan.dataset.word_en);
            }

            wordSpan.classList.add('highlight');
            wordIndex++;

            setTimeout(function () {

                if (pausePlay == false) {
                    playNextWord();
                    return;
                }

            }, delayRead); // Highlight duration in milliseconds

        }

    }

    if (wordIndex == wordSpans.length) {
        wordIndex = 0;
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
        translate = true;
    } else {
        translate = false;
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

    const wordSpans = document.querySelectorAll('#wordContainer span');

    if (wordSpans.length > 0) {

        pausePlay = true;
        let wordSpan = "";

        wordSpan = wordSpans[wordIndex - 1];
        /*
        console.log(playWordIndex);
        console.log(wordSpan);
        */
        wordSpan.classList.add('highlight-paused');

    }
});

function readAloud(dictionary) {

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

        if (translate) {

            const wordSpan_en = document.createElement('span');
            wordSpan_en.textContent = " (" + item.word_en + ") ";
            wordSpan_en.lang = "EN";
            wordSpan_en.classList.add('font-size-small');

            // word_en used for sound pathname
            wordSpan_en.dataset.word_en = item.word_en;

            wordContainer.appendChild(wordSpan_en);
            wordContainer.appendChild(document.createTextNode(' ')); // Add space between words

            wordSpan_en.addEventListener('click', function () {

                /*                
                                let soundFileName = item.word_en.replace(' ', '_');
                                soundFileName = soundFileName.toString().toLowerCase();
                                const soundFilePathname = "../assets/sound/th/" + soundFileName + ".mp3";
                                playWord(soundFilePathname);
                */

                textToSpeech(item.word_en);

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

}

function textToSpeech(text) {
    if ('speechSynthesis' in window) {
        let speechSynth = window.speechSynthesis;

        // Create a new SpeechSynthesisUtterance object
        let utterance = new SpeechSynthesisUtterance(text);

        // Set the voice to a high-quality voice
        /*

1. Google UK English Female
2. Google UK English Male
3. Google US English Female
4. Google US English Male
5. Microsoft David Desktop - English (United States)
6. Microsoft Zira Desktop - English (United States)
        */
        //        let voices = speechSynth.getVoices();
        //        utterance.voice = voices.find(voice => voice.name === 'Microsoft Zira Desktop - English (United States)');

        // Adjust other settings if needed
        //        utterance.rate = 1.5;
        //        utterance.pitch = 1;

        // Speak the text

        speechSynth.speak(utterance);
    } else {
        console.log('Web Speech API is not supported in this browser.');
    }

    /*
        const utterance = new SpeechSynthesisUtterance(text);
    
        //    const voices = window.speechSynthesis.getVoices();
    
    
        if ('speechSynthesis' in window) {
    
            const voices = window.speechSynthesis.getVoices();
    
            //        let thaiVoice = voices.find(voice => voice.lang === 'th-TH');
            let enVoice = voices.find(voice => voice.lang === 'th-TH');
    
            //                   let utterance = new SpeechSynthesisUtterance('สวัสดีครับ');
    
    
            if (typeof enVoice !== 'undefined') {
                utterance.voice = enVoice;
                window.speechSynthesis.speak(utterance);
            } else {
                console.log('SpeechSynthesis API is not available in this browser');
            }
    
            voices.forEach((voice) => {
    
                if (voice.lang === "en-EN" || voice.lang === "en" || voice.lang === "EN") {
    
                    utterance.voice = voice;
                    console.log('voice ', utterance.voice);
    
                }
    
            });
    
            //   let thaiVoice = voices.find(voice => voice.name === 'ไทย ไทย'); // see th.json in assets
            //   utterance.voice = thaiVoice;
    
            if (utterance.voice != null) {
                window.speechSynthesis.speak(utterance);
            }
    
    
        }
    */

}
