// book 1
const dictionaryPhonetics = [
    { word_en: "house", word_th: "บ้าน", pronunciation: "bâan", ex_en: "big house", ex_pronunciation: "bâan yài", ex_th: "บ้าน ใหญ่" },
    { word_en: "school", word_th: "โรงเรียน", pronunciation: "rooŋ-rian", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "coffee", word_th: "กาแฟ", pronunciation: "gaa-fɛɛ", ex_en: "Normally, I drink coffee.", ex_pronunciation: "(bpòk-gà-dtì) phǒm dɯ̀ɯm/gin gaa-fɛɛ", ex_th: "(ปกติ) ผมดืxม/กินกาแฟ" },
    { word_en: "food", word_th: "อาหาร", pronunciation: "aa-hǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "lie down or sleep", word_th: "นอน", pronunciation: "nɔɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "banana", word_th: "กล้วย", pronunciation: "gluay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "family", word_th: "ครอบครัว", pronunciation: "khroop-khrua", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "dog", word_th: "หมา", pronunciation: "H̄mā", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "lonely", word_th: "เหงา", pronunciation: "H̄engā", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "book", word_th: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ", ex_en: "my books", ex_pronunciation: "", ex_th: "" },
    { word_en: "woman", word_th: "ผู้หญิง", pronunciation: "P̄hū̂ ỵing", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "hot", word_th: "ร้อน", pronunciation: "rɔ́ɔn", ex_en: "The coffee is not hot.", ex_pronunciation: "gaa-fɛɛ mâi rɔ́ɔn", ex_th: "กาแฟไม่ร้อน" },
    { word_en: "horse", word_th: "ม้า", pronunciation: "M̂ā", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "friend", word_th: "เพื่อน", pronunciation: "phɯ̂an", ex_en: "What is your friend's name ?", ex_pronunciation: "phɯ̂an khɔ̌ɔŋ khun chɯ̂ɯ à-rai", ex_th: "เพืxอนของคุณชืxออะไร" }
];
const dictionaryBase = [
    { word_en: "hello", word_th: "สวัสดี", pronunciation: "sà-wàt-dii", ex_en: "hello", ex_pronunciation: "sà-wàt-dii khráp", ex_th: "สวัสดีครับ" },
    { word_en: "thank you", word_th: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun", ex_en: "Thank you.", ex_pronunciation: "khɔ̀ɔp-khun khráp", ex_th: "ขอบคุณครับ" },
    { word_en: "never mind", word_th: "ไม่เป็นไร", pronunciation: "mâi-bpen-rai", ex_en: "Never mind.Thank you.", ex_pronunciation: "mâi-bpen-rai khráp, khɔ̀ɔp-khun khráp", ex_th: "ไม่เป็ นไรครับ ขอบคุณครับ" },
    { word_en: "sorry/excuse me", word_th: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot", ex_en: "Sorry, I cannot.", ex_pronunciation: "khɔ̌ɔ-thôot khà mâi dâay khà", ex_th: "ขอโทษค่ะไม่ได้คะ่" },
    { word_en: "nice to meet you", word_th: "ยินดีทีได้รู้จัก", pronunciation: "yin-dii tîi dâai rúu-jàk", ex_en: "Nice to meet you (too).", ex_pronunciation: "yin-dii thîi dâay rúu-jàk khráp", ex_th: "ยินดีทีได้ร้ ูจกัครับ" },
    { word_en: "how about you?", word_th: "แล้ว คุณล่ะ", pronunciation: "khun la", ex_en: "How about you?", ex_pronunciation: "(lɛ́ɛw)-khun-là", ex_th: "(แล้ว) คุณล่ะ" },
    { word_en: "he/she", word_th: "เขา", pronunciation: "khǎw", ex_en: "Where is he/she from ?", ex_pronunciation: "khǎw maa jàak bprà-thêet à-rai", ex_th: "เขามาจากประเทศอะไร" },
    { word_en: "we/us", word_th: "พวกเรา", pronunciation: "phûak-raw", ex_en: "We will not swim.", ex_pronunciation: "phûak-raw jà mâi wâay-náam", ex_th: "พวกเราจะไม่วา่ ยนํา" },
    { word_en: "they/them", word_th: "พวกเขา", pronunciation: "phûak-khǎw", ex_en: "Are they kind ?", ex_pronunciation: "phûak khǎw jai dii mǎi", ex_th: "พวกเขาใจดีไหม" },
    { word_en: "belong to/of", word_th: "ของ", pronunciation: "khɔ̌ɔŋ", ex_en: "My house (house belong to me)", ex_pronunciation: "bâan khɔ̌ɔŋ phǒm", ex_th: "ของ" },
    { word_en: "my/mine for male", word_th: "ของผม", pronunciation: "(khɔ̌ɔŋ) phǒm", ex_en: "My school is big.", ex_pronunciation: "rooŋ-rian khɔ̌ɔŋ phǒm yài", ex_th: "โรงเรี ยนของผมใหญ่" },
    { word_en: "my/mine for female", word_th: "ของฉัน", pronunciation: "(khɔ̌ɔŋ) chǎn", ex_en: "My friend is less handsome than I (am).", ex_pronunciation: "phɯ̂an khɔ̌ɔŋ phǒm lɔ̀ɔ nɔ́ɔy gwàa phǒm", ex_th: "เพือนของผมหล่อน้อยกว่าผม" },
    { word_en: "your/yours", word_th: "ของคุณ", pronunciation: "(khɔ̌ɔŋ) khun", ex_en: "How is your school ?", ex_pronunciation: "rooŋ-rian khɔ̌ɔŋ khun bpen-yaŋ-ŋai", ex_th: "โรงเรียนของคุณเป็นยังไง" },
    { word_en: "his/her/hers", word_th: "ของเขา", pronunciation: "(khɔ̌ɔŋ) khǎw", ex_en: "What is her name?", ex_pronunciation: "khǎw chɯ̂ɯ à-rai", ex_th: "เขาชืxออะไร" },
    { word_en: "our/ours", word_th: "ของพวกเรา", pronunciation: "(khɔ̌ɔŋ) phûak-raw", ex_en: "We are sitting.", ex_pronunciation: "phûak-raw gam-laŋ nâŋ yùu", ex_th: "พวกเรากําลังนัง& อยู่" },
    { word_en: "their/theirs", word_th: "ของพวกเขา", pronunciation: "khɔ̌ɔŋ phûak-khǎw", ex_en: "Can they ride a motorcycle ?", ex_pronunciation: "phûak-khǎw khìi mɔɔ-dtəə-sai dâay mǎi/mái", ex_th: "พวกเขาขี&มอเตอร์ ไซค์ได้ ไหม/มัย" },
    { word_en: "name", word_th: "ชือ", pronunciation: "chʉ̂ʉ", ex_en: "What is your name?", ex_pronunciation: "khun chɯ̂ɯ à-rai khráp", ex_th: "คุณชืxออะไรครับ" },
    { word_en: "first name", word_th: "ชื#อจริง", pronunciation: "chʉ̂ʉ jiŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "surname", word_th: "นามสกุล", pronunciation: "naam-sà-gun", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "nickname", word_th: "อเล่น", pronunciation: "chʉ̂ʉ lên", ex_en: "My name is John.", ex_pronunciation: "phǒm chɯ̂ɯ John khráp", ex_th: "ผมชืxอจอห์นครับ" },
    { word_en: "fine", word_th: "สบายดี", pronunciation: "sà-baay-dii", ex_en: "Are you fine ? (How are you ?)", ex_pronunciation: "khun sà-baay-dii mǎi khŕap/khá", ex_th: "คุณ สบายดี ไหม ครับ/คะ" },
    { word_en: "pretty good", word_th: "ก็ดี", pronunciation: "gɔ̂ɔ dii", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "so so", word_th: "เฉย เฉย", pronunciation: "chə̌əy-chə̌əy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "eat already", word_th: "กินแล้ว", pronunciation: "gin lɛ́ɛw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "no", word_th: "ยัง", pronunciation: "yaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "come", word_th: "มา", pronunciation: "maa", ex_en: "Yes, I do. She comes from Lamphun.", ex_pronunciation: "châi khà, khǎw maa jàak jaŋ-wàt lam-phuun", ex_th: "ใช่คะ่ เขามาจากจังหวัดลําพูน" },
    { word_en: "from", word_th: "จาก", pronunciation: "jàak", ex_en: "Yes, I do. She comes from Lamphun.", ex_pronunciation: "châi khà, khǎw maa jàak jaŋ-wàt lam-phuun", ex_th: "ใช่คะ่ เขามาจากจังหวัดลําพูน" },
    { word_en: "where", word_th: "ทีไหน", pronunciation: "thîi-nǎi", ex_en: "Where are you from?", ex_pronunciation: "khun maa jàak thîi-nǎi khráp", ex_th: "คุณมาจากทีxไหนครับ" },
    { word_en: "eat", word_th: "กิน", pronunciation: "gin", ex_en: "I usually eat Thai food.", ex_pronunciation: "(bpòk-gà-dtì) phǒm gin aa-hǎan thai", ex_th: "(ปกติ) ผมกินอาหารไทย" },
    { word_en: "drink", word_th: "ดืxม", pronunciation: "dʉ̀ʉm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "watch", word_th: "ดู", pronunciation: "duu", ex_en: "Normally, I watch TV.", ex_pronunciation: "(bpòk-gà-dtì) chǎn duu thii-wii", ex_th: "(ปกติ) ฉันดูทีวี" },
    { word_en: "listen", word_th: "ฟัง", pronunciation: "faŋ", ex_en: "I usually listen to Thai songs.", ex_pronunciation: "(bpòk-gà-dtì) chǎn faŋ phleeŋ thai", ex_th: "(ปกติ) ฉันฟั งเพลงไทย" },
    { word_en: "wake up", word_th: "ตืxน", pronunciation: "dtɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "lie down/sleep", word_th: "นอน", pronunciation: "nɔɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "walk", word_th: "เดิน", pronunciation: "dəən", ex_en: "He/She doesn't like walking.", ex_pronunciation: "khǎw mâi chɔ̂ɔp dəən", ex_th: "เขาไม่ชอบเดิน" },
    { word_en: "speak", word_th: "พูด", pronunciation: "phûut", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "study", word_th: "เรียน", pronunciation: "rian", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "write", word_th: "เขียน", pronunciation: "khǐan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "read", word_th: "อ่าน", pronunciation: "àan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "take a shower", word_th: "อาบนํ âา", pronunciation: "àap-náam", ex_en: "Do they like taking a shower ?", ex_pronunciation: "phûak-khǎw chɔ̂ɔp àap-náam mǎi/mái", ex_th: "พวกเขาชอบอาบนําไหม/มัย" },
    { word_en: "play", word_th: "เล่น", pronunciation: "lên", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "exercise", word_th: "ออกกําลังกาย", pronunciation: "ɔ̀ɔk-gam-lang-gaai", ex_en: "Normally, I exercise.", ex_pronunciation: "(bpòk-gà-dtì) chǎn ɔ̀ɔk gam-laŋ-gaay", ex_th: "(ปกติ) ฉันออกกําลังกาย" },
    { word_en: "go", word_th: "ไป", pronunciation: "bpai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "do/make", word_th: "ทํา", pronunciation: "tham", ex_en: "What do you like to do ?", ex_pronunciation: "khun chɔ̂ɔp tham à-rai bâaŋ khá", ex_th: "คุณชอบทําอะไรบ้างคะ" },
    { word_en: "Normally/Usually", word_th: "ปกติ", pronunciation: "bpòk-gà-dtì", ex_en: "Normally, I exercise.", ex_pronunciation: "(bpòk-gà-dtì) chǎn ɔ̀ɔk gam-laŋ-gaay", ex_th: "(ปกติ) ฉันออกกําลังกาย" },
    { word_en: "food", word_th: "อาหาร", pronunciation: "aa-hǎan", ex_en: "I like cooking.", ex_pronunciation: "chǎn chɔ̂ɔp tham aa-hǎan", ex_th: "ฉันชอบดื&ม/กินกาแฟ" },
    { word_en: "book", word_th: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "market", word_th: "ตลาด", pronunciation: "dtà-làat", ex_en: "Where is the market ?", ex_pronunciation: "dtà-làat yùu thîi-nǎi khá", ex_th: "ตลาดอยูท่ ีไหนคะ" },
    { word_en: "song", word_th: "เพลง", pronunciation: "phleeŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "home work", word_th: "การบ้าน", pronunciation: "gaan-bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "coffee", word_th: "กาแฟ", pronunciation: "gaa-fɛɛ", ex_en: "Normally, I drink coffee.", ex_pronunciation: "(bpòk-gà-dtì) phǒm dɯ̀ɯm/gin gaa-fɛɛ", ex_th: "(ปกติ) ผมดืxม/กินกาแฟ" },
    { word_en: "language", word_th: "ภาษา", pronunciation: "phaa-sǎa", ex_en: "To study Thai (language)", ex_pronunciation: "rian phaa-sǎa thai", ex_th: "เรียนภาษาไทย" },
    { word_en: "like", word_th: "ชอบ", pronunciation: "chɔ̂ɔp", ex_en: "I like to exercise.", ex_pronunciation: "phǒm chɔ̂ɔp ɔ̀ɔk-gam-laŋ-gaay", ex_th: "ผมชอบออกกําลังกาย" },
    { word_en: "yes/no", word_th: "ไหม/มัย", pronunciation: "mǎi/mái", ex_en: "Do you (usually) drink coffee ?", ex_pronunciation: "bpòk-gà-dtì khun dɯɯm gaa - fɛɛ mǎi/mái", ex_th: "ปกติคณดืxมกาแฟไหม/มัย‰" },
    { word_en: "do", word_th: "ทํา", pronunciation: "tham", ex_en: "Does he/she like cooking ?", ex_pronunciation: "khǎw chɔ̂ɔp tham aa-hǎan mǎi/mái", ex_th: "เขาชอบทําอาหารไหม/มัย" },
    { word_en: "and", word_th: "และ", pronunciation: "lɛ́", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "multiple answers", word_th: "บ้าง", pronunciation: "bâaŋ", ex_en: "What do you like to do ?", ex_pronunciation: "khun chɔ̂ɔp tham à-rai bâaŋ khá", ex_th: "คุณชอบทําอะไรบ้างคะ" },
    { word_en: "do/make", word_th: "ทํา", pronunciation: "tham", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "work", word_th: "ทํางาน", pronunciation: "tham ŋaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "do homework", word_th: "ทําการบ้าน", pronunciation: "tham gaan-bânn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "do housework", word_th: "ทํางานบ้าน", pronunciation: "tham ŋaan-bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "cook", word_th: "ทําอาหาร", pronunciation: "tham aa-hǎan", ex_en: "He/She can cook.", ex_pronunciation: "khǎw tham aa-hǎan dâay", ex_th: "เขาทําอาหารได้" },
    { word_en: "drive a car", word_th: "ขับรถ", pronunciation: "khàp rót", ex_en: "I can drive a car.", ex_pronunciation: "chǎn khàp rót dâay", ex_th: "ฉันขับรถได้" },
    { word_en: "ride a motorbike", word_th: "ขีeมอเตอร์ไซค์", pronunciation: "khìi mɔɔ-dtəə-sai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "ride a bicycle", word_th: "ขีeจักรยาน", pronunciation: "khiì jàk-grà-yaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "talk with freinds", word_th: "คุยกับเพืeอน", pronunciation: "khuy gàp phɯ̂an", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "study Thai", word_th: "เรียนภาษาไทย", pronunciation: "rian phaa-sǎa thai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "return home", word_th: "กลับบ้าน", pronunciation: "glàp bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "shopping", word_th: "ซือของ", pronunciation: "sɯ́ɯ-khɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "travel/hang out", word_th: "ไปเทีeยว", pronunciation: "bpai-thiâw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "watch movie", word_th: "ดูหนัง", pronunciation: "duu nǎŋ", ex_en: "Normally, I watch TV.", ex_pronunciation: "(bpòk-gà-dtì) chǎn duu thii-wii", ex_th: "(ปกติ) ฉันดูทีวี" },
    { word_en: "can", word_th: "ได้", pronunciation: "dâay", ex_en: "I can speak Thai.", ex_pronunciation: "phǒm phûut phaa-sǎa thai dâay", ex_th: "ผมพูดภาษาไทยได้" },
    { word_en: "sit", word_th: "นัง", pronunciation: "nâŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "stand", word_th: "ยืน", pronunciation: "yɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "run", word_th: "วิง", pronunciation: "wîŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "swim", word_th: "ว่ายนํา", pronunciation: "wâay-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "do the laundry", word_th: "ซักผ้า", pronunciation: "sák-phâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "wash the dishes", word_th: "ล้างจาน", pronunciation: "láaŋ jaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "rest", word_th: "พักผ่อน", pronunciation: "phák-phɔ̀ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "stroll", word_th: "เดินเล่น", pronunciation: "dəən-lên", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "listen to music", word_th: "ฟังเพลง", pronunciation: "faŋ pleeŋ", ex_en: "I usually listen to Thai songs.", ex_pronunciation: "(bpòk-gà-dtì) chǎn faŋ phleeŋ thai", ex_th: "(ปกติ) ฉันฟั งเพลงไทย" },
    { word_en: "sing", word_th: "ร้องเพลง", pronunciation: "rɔ́ɔŋ pleeŋ", ex_en: "I usually listen to Thai songs.", ex_pronunciation: "(bpòk-gà-dtì) chǎn faŋ phleeŋ thai", ex_th: "(ปกติ) ฉันฟังเพลงไทย" },
    { word_en: "will", word_th: "จะ", pronunciation: "jà", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "-ing", word_th: "กําลัง", pronunciation: "gam-laŋ", ex_en: "What are you doing ?", ex_pronunciation: "khun gam-lanŋ tham à-rai yùu", ex_th: "คุณกําลังทําอะไรอยู่" },
    { word_en: "-ing", word_th: "อยู่", pronunciation: "yùu", ex_en: "I am doing homework.", ex_pronunciation: "chǎn gam-laŋ tham gaan-baân yùu", ex_th: "ฉันกําลังทําการบ้ านอยู่" },
    { word_en: "small", word_th: "เล็ก", pronunciation: "lék", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "big", word_th: "ใหญ่", pronunciation: "yài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "short (length)", word_th: "สัäน", pronunciation: "sân", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "long", word_th: "ยาว", pronunciation: "yaaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "short (height)", word_th: "เตีย", pronunciation: "dtîa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "tall (height)", word_th: "สูง", pronunciation: "sǔuŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "good", word_th: "ดี", pronunciation: "dii", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "bad/terrible", word_th: "แย่", pronunciation: "yɛ̂ɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "hot", word_th: "ร้อน", pronunciation: "rɔ́ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "cool/iced", word_th: "เย็น", pronunciation: "yen", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "cold", word_th: "หนาว", pronunciation: "nǎaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "cheap", word_th: "ถูก", pronunciation: "thùuk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "expensive", word_th: "แพง", pronunciation: "phɛɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "slow", word_th: "ช้า", pronunciation: "cháa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fast", word_th: "เร็ว", pronunciation: "rew", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "beautiful/pretty", word_th: "สวย", pronunciation: "sǔay", ex_en: "Is she beautiful ?", ex_pronunciation: "khǎw sǔay mǎi", ex_th: "เขาสวยไหม" },
    { word_en: "handsome", word_th: "หล่อ", pronunciation: "lɔ̀ɔ", ex_en: "Am I handsome?", ex_pronunciation: "phǒm lɔ̀ɔ mǎi", ex_th: "ผมหล่อไหม" },
    { word_en: "not", word_th: "ไม่", pronunciation: "mâi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "delicious", word_th: "อร่อย", pronunciation: "à-rɔ̀ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fun/enjoyable", word_th: "สนุก", pronunciation: "sà-nùk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "hungry", word_th: "หิว", pronunciation: "hǐw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "full", word_th: "อิม", pronunciation: "ìm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fat", word_th: "อ้วน", pronunciation: "ûan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "skinny", word_th: "ผอม", pronunciation: "phɔ̌ɔm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "tired", word_th: "เหนือย", pronunciation: "nɯay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "sleepy", word_th: "ง่วง", pronunciation: "ŋûaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "difficult", word_th: "ยาก", pronunciation: "yâak", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "easy", word_th: "ง่าย", pronunciation: "ŋâay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "clean", word_th: "สะอาด", pronunciation: "sà-àat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "dirty", word_th: "สกปรก", pronunciation: "sòk-gà-bpròk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "rich", word_th: "รวย", pronunciation: "ruay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "poor", word_th: "จน", pronunciation: "jon", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "new", word_th: "ใหม่", pronunciation: "mài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "old", word_th: "เก่า/แก่", pronunciation: "gàw/gɛ̀ɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "how", word_th: "ยังไง", pronunciation: "yaŋ-ŋai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "shoes", word_th: "รองเท้า", pronunciation: "rɔɔŋ-tháw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "book", word_th: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "bathroom", word_th: "ห้องนําƒ", pronunciation: "hɔ̂ɔŋ-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Bangkok", word_th: "กรุงเทพฯ", pronunciation: "gruŋ-thêep", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "shirt", word_th: "เสือ", pronunciation: "sɯ̂a", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Thailand", word_th: "ประเทศไทย", pronunciation: "bprà-thêet thai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "and", word_th: "และ", pronunciation: "lɛ́", ex_en: "She is pretty and kind.", ex_pronunciation: "khǎw sǔay lɛ́ jai-dii", ex_th: "เขาสวยและใจดี" },
    { word_en: "but", word_th: "แต่", pronunciation: "dtɛ̀ɛ", ex_en: "The food is delicious but expensive.", ex_pronunciation: "aa hǎan a-rɔ̀ɔy dtɛ̀ɛ phɛɛŋ", ex_th: "อาหารอร่อยแต่แพง" },
    { word_en: "more than", word_th: "กว่า", pronunciation: "gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "more than/rather than", word_th: "มากกว่า", pronunciation: "mâak gwàa", ex_en: "I eat more Thai food than western food.", ex_pronunciation: "phǒm gin aa-hǎan thai mâak gwàa aa-hǎan fá-ràŋ", ex_th: "ผมกินอาหารไทยมากกว่าอาหารฝรัง" },
    { word_en: "than", word_th: "กว่า", pronunciation: "gwàa", ex_en: "Thai food is more spicy than Japanese food.", ex_pronunciation: "aa-hǎan thai phèt gwàa aa-hǎan yîi-bpùn", ex_th: "อาหารไทยเผ็ดกว่าอาหารญีปนุ่" },
    { word_en: "less than", word_th: "น้อยกว่า", pronunciation: "nɔ́ɔy gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "the most", word_th: "ทีสุด", pronunciation: "thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "better", word_th: "ดีกว่า", pronunciation: "dii gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "the best", word_th: "ดีที:สดุ", pronunciation: "dii thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "better", word_th: "เก่งกว่า", pronunciation: "gèŋ gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "the best", word_th: "เก่งทีส", pronunciation: "gèŋ thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "less", word_th: "น้ อยกว่า", pronunciation: "nɔ́ɔy gwàa", ex_en: "Chiang Mai is smaller than Bangkok.", ex_pronunciation: "chiaŋ-mài lék gwàa gruŋ-thêep", ex_th: "เชียงใหม่เล็กกว่ากรุงเทพฯ" },
    { word_en: "least", word_th: "น้อยทีสดุ", pronunciation: "nɔ́ɔy thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "more", word_th: "มากกว่า", pronunciation: "mâak gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "the most", word_th: "มากทีสดุ", pronunciation: "mâak thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //    { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
const dictionaryPronouns = [
    { word_en: "I for male", word_th: "ผม", pronunciation: "phǒm", ex_en: "My/Mine (Male Speaker)", ex_pronunciation: "khɔ̌ɔŋ phǒm", ex_th: "ของผม" },
    { word_en: "I for female", word_th: "ฉัน", pronunciation: "chǎn", ex_en: "My/Mine (Female Speaker)", ex_pronunciation: "khɔ̌ɔŋ chǎn", ex_th: "ของฉัน" },
    { word_en: "you", word_th: "คุณ", pronunciation: "khun", ex_en: "My name is Ann, And you ?", ex_pronunciation: "chǎn chɯ̂ɯ Anne khà. lɛ́ɛw khun là khá", ex_th: "ฉันชืxอแอนค่ะ แล้ วคุณล่ะคะ" },
    { word_en: "he/she", word_th: "เขา", pronunciation: "khǎw", ex_en: "What is his/her name ?", ex_pronunciation: "khǎw chɯ̂ɯ à-rai", ex_th: "เขาชืxออะไร" },
    { word_en: "we/us", word_th: "พวกเรา", pronunciation: "phûak-raw", ex_en: "We will not swim.", ex_pronunciation: "phûak-raw jà mâi wâay-náam", ex_th: "พวกเราจะไม่วา่ ยนํา" },
    { word_en: "they/them", word_th: "พวกเขา", pronunciation: "phûak-khǎw", ex_en: "What are they doing ?", ex_pronunciation: "phûak-khǎw gam-laŋ tham à-rai yùu", ex_th: "พวกเขากําลังทําอะไรอยู่" },
    { word_en: "your/yours", word_th: "ของคุณ", pronunciation: "(khɔ̌ɔŋ) khun", ex_en: "What is your teacher's name ?", ex_pronunciation: "khruu khɔ̌ɔŋ khun chɯ̂ɯ à-rai", ex_th: "ครูของคุณชืxออะไร" },
    { word_en: "his/her/hers", word_th: "ของเขา", pronunciation: "(khɔ̌ɔŋ) khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "our/ours", word_th: "ของพวกเรา", pronunciation: "(khɔ̌ɔŋ) phûak-raw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "their/theirs", word_th: "ของพวกเขา", pronunciation: "khɔ̌ɔŋ phûak-khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" }
];
const dictionaryNumbers = [
    { word_en: "one", word_th: "หนึง", pronunciation: "nɯŋ", ex_en: "One hundred", ex_pronunciation: "nɯŋ-rɔ́ɔy", ex_th: "หนึง:ร้อย" },
    { word_en: "two", word_th: "สอง", pronunciation: "sɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "three", word_th: "สาม", pronunciation: "sǎam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "four", word_th: "สี", pronunciation: "sìi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "five", word_th: "ห้า", pronunciation: "hâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "six", word_th: "หก", pronunciation: "hòk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "seven", word_th: "เจ็ด", pronunciation: "jèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "eight", word_th: "แปด", pronunciation: "bpɛ̀ɛt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "nine", word_th: "เก้า", pronunciation: "gâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "ten", word_th: "สิบ", pronunciation: "sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "eleven", word_th: "สิบเอ็ด", pronunciation: "sìp-èt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "twelve", word_th: "สิบสอง", pronunciation: "sìp-sɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "thirteen", word_th: "สิบสาม", pronunciation: "sìp-sǎam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fourteen", word_th: "สิบสี", pronunciation: "sìp-sìi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fifteen", word_th: "สิบห้า", pronunciation: "sìp-hâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "sixteen", word_th: "สิบหก", pronunciation: "sìp-hòk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "seventeen", word_th: "สิบเจ็ด", pronunciation: "sìp-jèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "eighteen", word_th: "สิบแปด", pronunciation: "sìp-bpɛ̀ɛt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "nineteen", word_th: "สิบเก้า", pronunciation: "sìp-gâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "twenty", word_th: "ยีส ิบ", pronunciation: "yîi-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "thirsty", word_th: "สามสิบ", pronunciation: "sǎam-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "forty", word_th: "สีสบิ", pronunciation: "sìi-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fifty", word_th: "ห้าสิบ", pronunciation: "hâa-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "sixty", word_th: "หกสิบ", pronunciation: "hòk-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "seventy", word_th: "เจ็ดสิบ", pronunciation: "jèt-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "eighty", word_th: "แปดสิบ", pronunciation: "bpɛ̀ɛt-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "ninety", word_th: "เก้าสิบ", pronunciation: "gâaw-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "one hundred", word_th: "หนึงร้อย", pronunciation: "nɯŋ-rɔ́ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "one thousand", word_th: "หนึงพัน", pronunciation: "nɯŋ-phan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "ten thousand", word_th: "หนึงหมืน", pronunciation: "nɯŋ-mɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "one hundred thousand", word_th: "หนึงแสน", pronunciation: "nɯŋ-sɛ̌ɛn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "one million", word_th: "หนึงล้าน", pronunciation: "nɯŋ-láan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "ten", word_th: "สิบ", pronunciation: "sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "hundred", word_th: "ร้อย", pronunciation: "rɔ́ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "thousand", word_th: "พัน", pronunciation: "phan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "ten thousand", word_th: "หมืน", pronunciation: "mɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "hundred thousand", word_th: "แสน", pronunciation: "sɛ̌ɛn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "million", word_th: "ล้าน", pronunciation: "láan", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //    { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
    //    { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
const dictionaryClothes = [
    { word_en: "clothes", word_th: "เสือผ้า", pronunciation: "sɯ̂a-phâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "shirt", word_th: "เสือ", pronunciation: "sɯ̂a", ex_en: "How much is the shirt?", ex_pronunciation: "sɯ̂a thâw-rài khá", ex_th: "เสือเท่าไหร่คะ" },
    { word_en: "T-shirt", word_th: "เสือยืด", pronunciation: "sɯ̂a-yɯ̂ɯt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "sweater", word_th: "เสือกันหนาว", pronunciation: "sɯ̂a gan-nǎaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "pants/trousers", word_th: "กางเกง", pronunciation: "gaaŋ-geeŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "skirt", word_th: "กระโปรง", pronunciation: "grà-bprooŋ", ex_en: "The skirt is 165 Baht.", ex_pronunciation: "grà-bprooŋ 165 bàat khà", ex_th: "กระโปรง šบาทค่ะ" },
    { word_en: "shoes", word_th: "รองเท้า", pronunciation: "rɔɔŋ-tháaw", ex_en: "The shoes are cheap.", ex_pronunciation: "rɔɔŋ-tháaw thùuk", ex_th: "รองเท้ าถูก" },
    { word_en: "socks", word_th: "ถุงเท้า", pronunciation: "thǔŋ-tháaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "glasses", word_th: "แว่นตา", pronunciation: "wɛ̂ɛn-dtaa", ex_en: "How much are the glasses?", ex_pronunciation: "wɛ̂ ɛn-dtaa thâw-rài khá", ex_th: "แว่นตาเท่าไหร่คะ" },
    { word_en: "hat", word_th: "หมวก", pronunciation: "mùak", ex_en: "How much is the hat?", ex_pronunciation: "mùak thâw-rài khá", ex_th: "หมวกเท่าไหร่คะ" },
    { word_en: "swimming suit", word_th: "ชุดว่ายนํา", pronunciation: "chút wâay-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "pajamas", word_th: "ชุดนอน", pronunciation: "chút nɔɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "exercise outfit", word_th: "ชุดออกกําลังกาย", pronunciation: "chút ɔ̀ɔk-gam-laŋ-gaay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "price", word_th: "ราคา", pronunciation: "raa-khaa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "discount", word_th: "ลด", pronunciation: "lót", ex_en: "Could you give me a discount(please)?", ex_pronunciation: "lót nɔ̀ɔy dâay mǎi khá", ex_th: "ลดหน่อยได้ ไหมคะ" }
    //    { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
const dictionaryPlaces = [
    { word_en: "house", word_th: "บ้าน", pronunciation: "bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "school", word_th: "โรงเรียน", pronunciation: "rooŋ-rian", ex_en: "How is your school ?", ex_pronunciation: "rooŋ-rian khɔ̌ɔŋ khun bpen-yaŋ-ŋai", ex_th: "โรงเรี ยนของคุณเป็ นยังไง" },
    { word_en: "hotel", word_th: "โรงแรม", pronunciation: "rooŋ-rɛɛm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "hospital", word_th: "โรงพยาบาล", pronunciation: "rooŋ-phá-yaa-baan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "restaurant", word_th: "ร้านอาหาร", pronunciation: "ráan aa-hǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "coffee shop", word_th: "ร้านกาแฟ", pronunciation: "ráan gaa-fɛɛ", ex_en: "Normally, I drink coffee.", ex_pronunciation: "(bpòk-gà-dtì) phǒm dɯɯm/gin gaa-fɛɛ", ex_th: "(ปกติ) ผมดืxม/กินกาแฟ" },
    { word_en: "train station", word_th: "สถานีรถไฟ", pronunciation: "sà-thǎa-nii rót-fai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "bus station", word_th: "สถานีขนส่ง", pronunciation: "sà-thǎa-nii khǒn-sòng", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "plice station", word_th: "สถานีตํารวจ", pronunciation: "s̀a-thǎa-nii dtam-rùat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "airport", word_th: "สนามบิน", pronunciation: "sà-nǎam bin", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "park", word_th: "สวน", pronunciation: "sǔan", ex_en: "", ex_pronunciation: "", ex_th: "ตลาดอยูท่ ีไหนคะ" },
    { word_en: "bank", word_th: "ธนาคาร", pronunciation: "thá-naa-khaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "ATM", word_th: "ตู้เอทีเอ็ม", pronunciation: "dtûu ee-thii-em", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "market", word_th: "ตลาด", pronunciation: "dta-làat", ex_en: "Where is the market ?", ex_pronunciation: "dtà-làat yùu thîi-nǎi khá", ex_th: "ตลาดอยูท่ ีไหนคะ" },
    { word_en: "department store", word_th: "ห้าง", pronunciation: "hâaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "road/street", word_th: "ถนน", pronunciation: "thà-nǒn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "lane", word_th: "ซอย", pronunciation: "sɔɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "down town", word_th: "ตัวเมือง", pronunciation: "dtua mɯaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "beach", word_th: "ชายหาด", pronunciation: "chaay-hàat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "sea", word_th: "ทะเล", pronunciation: "thá-lee", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "temple", word_th: "วัด", pronunciation: "wát", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "church", word_th: "โบสถ์", pronunciation: "bòot", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "university", word_th: "มหาวิทยาลัย", pronunciation: "má-hǎa-wit́-thá yaa- lai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "mountain", word_th: "ภูเขา/ดอย", pronunciation: "phuu-khǎw/dɔɔy", ex_en: "phuu-khǎw/dɔɔy", ex_pronunciation: "", ex_th: "" },
    { word_en: "river", word_th: "แม่นํา", pronunciation: "mɛ̂ɛ-náam", ex_en: "Chee river is the longest.(in Thailand)", ex_pronunciation: "mɛ̂ ɛ-náam chii yaaw thîi-sùt (nai bprà-thêet thai)", ex_th: "แม่นํ Šาชียาวที:สดุ (ในประเทศไทย)" }
    //    { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
const dictionaryPrepositions = [
    { word_en: "be (is/am/are)", word_th: "อยู่", pronunciation: "yùu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "where", word_th: "ที&ไหน", pronunciation: "thîi-nǎi", ex_en: "Where are you from ?", ex_pronunciation: "khun maa jàak thîi-nǎi khráp", ex_th: "คุณมาจากทีxไหนครับ" },
    { word_en: "close to", word_th: "ใกล้", pronunciation: "glâi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "near", word_th: "กับ", pronunciation: "gàp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "far", word_th: "ไกล", pronunciation: "glai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "next to", word_th: "ข้างๆ", pronunciation: "khâaŋ-khâaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "next to", word_th: "ติด(กับ)", pronunciation: "dtìt(gàp)", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "opposite to", word_th: "ตรงข้าม", pronunciation: "dtroŋ-khâam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "at", word_th: "ที&", pronunciation: "thîi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "in", word_th: "ใน", pronunciation: "nai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "arround (in the area)", word_th: "แถว", pronunciation: "thɛ̌ɛw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "in front of", word_th: "ข้างหน้า", pronunciation: "khâaŋ-nâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "behind", word_th: "ข้างหลัง", pronunciation: "khâaŋ-lǎŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "here", word_th: "ที&นี&", pronunciation: "thîi-nîi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "there", word_th: "ที&นนั&", pronunciation: "thîi-nân", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "over there", word_th: "ที&โน่น", pronunciation: "thîi-nôon", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //   { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];

// book 2    
const dictionaryFood = [
    { word_en: "rice", word_th: "ข้าว", pronunciation: "khâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "food", word_th: "อาหาร/กับข้าว", pronunciation: "aa-hǎan/gàp-khâaw", ex_en: "Do you like Thai food ?", ex_pronunciation: "khun chɔ̂ɔp aa-hǎan thai mǎi/mái", ex_th: "คุณชอบอาหารไทยไหม/มั" },
    { word_en: "curry", word_th: "แกง", pronunciation: "gɛɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "vegetables", word_th: "ผัก", pronunciation: "phàk", ex_en: "I would like Pad Thai without vegetables.", ex_pronunciation: "(phǒm) aw phàt-thai mâi sài phàk khráp", ex_th: "(ผม)เอาผัดไทยไม่ใส่ผกัครับ" },
    { word_en: "egg", word_th: "ไข่", pronunciation: "khài", ex_en: "I would like chicken fried rice with a fried egg.", ex_pronunciation: "(chǎn) khɔ̌ɔ khâaw-phàt gài sài khài-daaw khà", ex_th: "(ฉัน)ขอข้ าวผัดไก่ใส่ไข่ดาวค่ะ" },
    { word_en: "tofu", word_th: "เต้าหู ้", pronunciation: "dtâw-hûu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Chili", word_th: "พริก", pronunciation: "phrík", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "meat/beef", word_th: "เนืNอ", pronunciation: "nɯa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "pork", word_th: "หมู", pronunciation: "mǔu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "chicken", word_th: "ไก่", pronunciation: "gài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fish", word_th: "ปลา", pronunciation: "bplaa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "seafood", word_th: "(อาหาร)ทะเล", pronunciation: "(aa hǎan) thá-lee", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "shrimp", word_th: "กุ้ง", pronunciation: "gûŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "squid", word_th: "ปลาหมึก", pronunciation: "bplaa-mɯk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "crab", word_th: "ปู", pronunciation: "bpuu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "shell", word_th: "หอย", pronunciation: "hɔ̌ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "boil/boiled", word_th: "ต้ม", pronunciation: "dtôm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "stir fry/fried", word_th: "ผัด", pronunciation: "phàt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "deep fry/ deep fried", word_th: "ทอด", pronunciation: "thɔ̂ɔt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "steam/steamed", word_th: "นึงf", pronunciation: "nɯ̂ŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "grill/grilled", word_th: "ปิ", pronunciation: "bpîŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "gril/grilled", word_th: "ย่าง", pronunciation: "yâaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "mild soup", word_th: "แกงจืด", pronunciation: "gɛɛŋ-jɯɯt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "spicy sour soup", word_th: "ต้ มยํา", pronunciation: "dtôm-yam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "spicy sour salad", word_th: "ยํา", pronunciation: "yam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "noodles", word_th: "ก๋วยเตีmยว", pronunciation: "gǔay-dtǐaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "pad thai noodles", word_th: "ผัดไทย", pronunciation: "phàt-thai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fried vegtables", word_th: "ผัดผัก", pronunciation: "phàt-phàk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "thai omelet", word_th: "ไข่เจียว", pronunciation: "khài-jiaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "papaya salad", word_th: "ส้มตํา", pronunciation: "sôm-dtam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "green curry", word_th: "แกงเขียงหวาน", pronunciation: "gɛɛŋ-khǐaw-wǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "red curry", word_th: "แกงเผ็ด", pronunciation: "gɛɛŋ-phèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "mango sticky rice", word_th: "ข้าวเหนียวมะม่วง", pronunciation: "khâaw-nǐaw má-mûaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "taste/flavour", word_th: "รสชาติ", pronunciation: "rót-châat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "spicy", word_th: "เผ็ด", pronunciation: "phèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "sweet", word_th: "หวาน", pronunciation: "wǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "sour", word_th: "เปรียNว", pronunciation: "bprîaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "salty", word_th: "เค็ม", pronunciation: "khem", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "bitter", word_th: "ขม", pronunciation: "khǒm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "tasteless/plain", word_th: "จืด", pronunciation: "jɯɯt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "order/eat", word_th: "สั9ง/กิน", pronunciation: "sàŋ/gin", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "with/without", word_th: "ใส่/ไม่ใส่", pronunciation: "sài/mâi sài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fermented fish", word_th: "ปลาร้า", pronunciation: "bplaa-ráa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "monosodium glutamate", word_th: "ผงชูรส", pronunciation: "phǒŋ-chuu-rót", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "plate", word_th: "จาน", pronunciation: "jaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "bowl", word_th: "ถ้วย/ชาม", pronunciation: "thûay/chaam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Box/carton", word_th: "กล่อง", pronunciation: "glɔ̀ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "plastic bag", word_th: "ถุง", pronunciation: "thǔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "piece", word_th: "ชิ1น", pronunciation: "chín", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "water", word_th: "นํา", pronunciation: "náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "plain water", word_th: "นําเปล่า", pronunciation: "náam-bplàaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "ice", word_th: "นําแข็ง", pronunciation: "náam-khɛ̌ ɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "sugar", word_th: "นําตาล", pronunciation: "náam-dtaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "coffee", word_th: "กาแฟ", pronunciation: "gaa-fɛɛ", ex_en: "Normally, I drink coffee.", ex_pronunciation: "(bpòk-gà-dtì) phǒm dɯ̀ɯm/gin gaa-fɛɛ", ex_th: "(ปกติ) ผมดืxม/กินกาแฟ" },
    { word_en: "tea", word_th: "ชา", pronunciation: "chaa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "milk", word_th: "นม", pronunciation: "nom", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "soda", word_th: "โซดา", pronunciation: "soo-daa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fruit juice", word_th: "นําผลไม้", pronunciation: "náam phǒn-lá-máay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "fruit shake/smoothie", word_th: "นําผลไม้ปัfน", pronunciation: "náam phǒn-lá-máay bpàn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "soft drik", word_th: "นําอัดลม", pronunciation: "náam àt-lom", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "beer", word_th: "เบียร์", pronunciation: "bia", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "liquor", word_th: "เหล้า", pronunciation: "lâw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "wine", word_th: "ไวน์", pronunciation: "waay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "hot", word_th: "ร้อน", pronunciation: "rɔ́ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "cold/iced", word_th: "เย็น", pronunciation: "yen", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "glass/cup", word_th: "แก้ว", pronunciation: "gɛ̂ɛw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "cup", word_th: "ถ้วย", pronunciation: "thûay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "carton", word_th: "กล่อง", pronunciation: "glɔ̀ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "can/tin", word_th: "กระป๋อง", pronunciation: "grà-bpɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "bottle", word_th: "ขวด", pronunciation: "khùat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Orange juice", word_th: "นํNาส้ม", pronunciation: "náam sôm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Lime juice", word_th: "นํNามะนาว", pronunciation: "náam má-naaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Pineapple juice", word_th: "นํNาสับปะรด", pronunciation: "náam sàp-bpà-rót", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Mango juice", word_th: "นํNามะม่วง", pronunciation: "náam má-mûaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Water melon juice", word_th: "นํNาแตงโม", pronunciation: "náam dtɛɛŋ-moo", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Grape juice", word_th: "นํNาองุน่", pronunciation: "náam à-ŋùn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Coconut Water", word_th: "นํNามะพร้าว", pronunciation: "náam má-phráaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Passion fruit juice", word_th: "นํNาเสาวรส", pronunciation: "náam sǎw-wá-rót", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Vegetable juice", word_th: "นํNาผัก", pronunciation: "náam phàk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Fruits", word_th: "ผลไม้", pronunciation: "phǒn-lá-máay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Mango", word_th: "มะม่วง", pronunciation: "má-mûaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Coconut", word_th: "มะพร้าว", pronunciation: "má-phráaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Watermelon", word_th: "แตงโม", pronunciation: "dtɛɛng-moo", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Banana", word_th: "กล้วย", pronunciation: "glûay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Papaya", word_th: "มะละกอ", pronunciation: "má-lá-gɔɔ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Pineapple", word_th: "สัปปะรด", pronunciation: "sàp-bpà-rót", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Durian", word_th: "ทุเรียน", pronunciation: "thú-rian", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Orange", word_th: "ส้ ม", pronunciation: "sôm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Mangosteen", word_th: "มังคุด", pronunciation: "maŋ-khút", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Guava", word_th: "ฝรัfง", pronunciation: "fà-ràŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Longan", word_th: "ลําไย", pronunciation: "lam-yai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Strawberry", word_th: "สตรอเบอรีf", pronunciation: "sà-dtrɔɔ-bəə-rîi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Rambutan", word_th: "เงาะ", pronunciation: "ŋɔ́", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Grapes", word_th: "องุน่", pronunciation: "à-ŋùn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Passion friut", word_th: "เสาวรส", pronunciation: "sǎw-wá-rót", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Cherry", word_th: "เชอร์รีf", pronunciation: "chəə-rîi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Lychee", word_th: "ลิNนจีf", pronunciation: "lín-jìi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Dragon fruit", word_th: "แก้วมังกร", pronunciation: "gɛ̂ ɛw-maŋ-gɔɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Jackfruit", word_th: "ขนุน", pronunciation: "khà-nǔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Ripe/Cooked", word_th: "สุก", pronunciation: "sùk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Raw/Uncooked", word_th: "ดิบ", pronunciation: "dìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Fresh", word_th: "สด", pronunciation: "sòt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Dry", word_th: "แห้ง", pronunciation: "hɛ̂ɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Sweet", word_th: "หวาน", pronunciation: "wǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Sour", word_th: "เปรียNว", pronunciation: "bprîaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Piece", word_th: "ชิNน", pronunciation: "chín", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Small", word_th: "เล็ก", pronunciation: "lék", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Plastic bag", word_th: "ถุง", pronunciation: "tǔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Rotten", word_th: "เน่า/เสีย", pronunciation: "nâw/sǐa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Classifier for the whole fruit", word_th: "ลูก/ผล", pronunciation: "lûuk / phǒn", ex_en: "", ex_pronunciation: "", ex_th: "" }
    /*
        { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
    */
];

const dictionaryColours = [
    { word_en: "Colour", word_th: "สี", pronunciation: "sǐi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "", word_th: "", pronunciation: "sǐi khǎaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "White", word_th: "สีขาว", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Black", word_th: "สีดํา", pronunciation: "sǐi dam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Red", word_th: "สีแดง", pronunciation: "sǐi dɛɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Yellow", word_th: "สีเหลือง", pronunciation: "sǐi lɯ̌aŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Green", word_th: "สีเขียว", pronunciation: "sǐi khǐaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Dark Blue", word_th: "สีนํNาเงิน", pronunciation: "sǐi náam-ŋəən", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Sky blue", word_th: "สีฟา้", pronunciation: "sǐi fáa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Orange", word_th: "สีส้ม", pronunciation: "sǐi sôm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Grey", word_th: "สีเทา", pronunciation: "sǐi thaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Pink", word_th: "สีชมพู", pronunciation: "sǐi chom-phuu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Purple", word_th: "สีมว่ง", pronunciation: "sǐi mûaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Brown", word_th: "สีนํNาตาล", pronunciation: "sǐi náam-dtaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Light(Adj)", word_th: "อ่อน", pronunciation: "ɔ̀ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Dark(Adj)", word_th: "เข้ม", pronunciation: "khêm", ex_en: "", ex_pronunciation: "", ex_th: "" }
    /*
        { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
    */
]

const dictionaryClassifiers = [
    { word_en: "animals, letters, numbers,clothes,chairs,and tables", word_th: "คน", pronunciation: "khon", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "containers , pieces of paper, documents", word_th: "ใบ", pronunciation: "bai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "thin or flat objects, like CDs and slices of bread", word_th: "แผ่น", pronunciation: "phɛ̀ɛn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "balls, fruits, and other small and round objects", word_th: "ลูก", pronunciation: "lûuk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "classifier for cars and vehicles except boats or planes/umbrella", word_th: "คัน", pronunciation: "khan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "classifier for seeds, pills, buttons", word_th: "เม็ด", pronunciation: "mét", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "a piece of something like 3 pieces of cake", word_th: "ชิNน", pronunciation: "chín", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "house", word_th: "หลัง", pronunciation: "lǎŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "rooms", word_th: "ห้อง", pronunciation: "hɔ̂ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "eggs", word_th: "ฟอง", pronunciation: "fɔɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "books,notebooks,knifes", word_th: "เล่ม", pronunciation: "lêm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Electrical device/machine", word_th: "เครืf อง", pronunciation: "khrɯ̂aŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "A pair of", word_th: "คู่", pronunciation: "khûu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Objects", word_th: "อัน", pronunciation: "an", ex_en: "", ex_pronunciation: "", ex_th: "" }
    /*
        { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
    */
]

const dictionaryPreposition = [
    { word_en: "There is/There are", word_th: "มี", pronunciation: "mii", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "On", word_th: "บน", pronunciation: "bon", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Under", word_th: "ใต้", pronunciation: "On", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "In", word_th: "ใน", pronunciation: "nai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "In front of", word_th: "ข้างหน้า", pronunciation: "khâaŋ-nâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Behind", word_th: "ข้างหลัง", pronunciation: "khâaŋ-lǎŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Next to / Beside", word_th: "ข้างๆ", pronunciation: "khâaŋ-khâaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Outside", word_th: "ข้างนอก", pronunciation: "khâaŋ-nɔ̂ɔk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Inside", word_th: "ข้างใน", pronunciation: "khâaŋ-nai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Between", word_th: "ระหว่าง", pronunciation: "rá-wàaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Near / Close to", word_th: "ใกล้", pronunciation: "glâi glâi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "Far", word_th: "ไกล", pronunciation: "glai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { word_en: "At", word_th: "ทีf", pronunciation: "thîi", ex_en: "", ex_pronunciation: "", ex_th: "" }
    /*
    { word_en: "", word_th: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
     */
]

const conversations = [
    {
        "name": "conversation 1",
        "key_words": "word1 word2 word3",
        "sentences": {
            "1": { th: "ข้าว", pronunciation: "khâaw 1", en: "example 1" },
            "2": { th: "ข้าว", pronunciation: "khâaw 2", en: "example 2" }
        }
    },
    {
        "name": "conversation 2",
        "key_words": "word4 word2 word5",
        "sentences": {
            "1": { th: "ข้าว", pronunciation: "khâaw 3", en: "example 3" },
            "2": { th: "ข้าว", pronunciation: "khâaw 4", en: "example 4" }
        }
    }

]

const dictionaries = {
    // book 1
    dictionaryPhonetics: dictionaryPhonetics,
    dictionaryPronouns: dictionaryPronouns,
    dictionaryNumbers: dictionaryNumbers,
    dictionaryClothes: dictionaryClothes,
    dictionaryPlaces: dictionaryPlaces,
    dictionaryPrepositions: dictionaryPrepositions,
    dictionaryBase: dictionaryBase,
    // book 2
    dictionaryFood: dictionaryFood,
    dictionaryColours: dictionaryColours,
    dictionaryClassifiers: dictionaryClassifiers,
    dictionaryPreposition: dictionaryPreposition
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
//let randomize = false;

const searchWord = document.getElementById("searchWord");
const incorrectAnswersOnly = document.getElementById("incorrectAnswersOnly");
const randomizeCheckbox = document.getElementById("randomize");
const dictionaryCheckboxes = document.querySelectorAll('.checkbox-dictionary-container input[type="checkbox"]');

initialize();

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
        /*
        if (selectedDictionaryNames == 0) {
            return;
        } else {
            setDictionary();
        }
*/
    });

});

previousWord.addEventListener("click", () => {

    if (wordIndex > 0) {
        wordIndex = (wordIndex - 1) % currentDictionary.length;
    } else if (currentDictionary.length > 0) {
        wordIndex = currentDictionary.length - 1;
    } else {
        //       searchWord.classList.add('info');
        searchWord.value = 'Select a dictionary';
        return;
    }

    htmlMultipleChoice(wordIndex);

});

nextWord.addEventListener("click", () => {

    if (wordIndex < currentDictionary.length) {
        wordIndex = (wordIndex + 1) % currentDictionary.length;
    } else if (currentDictionary.length > 0) {
        wordIndex = currentDictionary.length;
    } else {
        //       searchWord.classList.add('info');
        searchWord.value = 'Select a dictionary';
        return;
    }

    htmlMultipleChoice(wordIndex);

});

incorrectAnswersOnly.addEventListener("click", () => {
    /*
        if (incorrectAnswersOnly.checked) {
    
            if (dictionaryIncorrectAnswers.length > NoAnswerChoices) {
                lastDictionary = currentDictionary; // restore last dictionary if later unchecked
                currentDictionary = dictionaryIncorrectAnswers;
            } else {
                incorrectAnswersOnly.checked = false;
            }
    
        } else {
            currentDictionary = lastDictionary;
        }
    
        feedback();
    
        wordIndex = 0;
        htmlMultipleChoice(wordIndex);
    */
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

searchWord.addEventListener('input', function (event) {

    let userInput = event.target.value.toLowerCase();
    let wordMatches = dictionary.filter(obj => obj.word_en.toLowerCase().startsWith(userInput));

    const searchWords = document.getElementById("searchWords");
    searchWords.innerHTML = '';

    wordMatches.forEach(
        (dictionary_record) => {

            const paragraph = document.createElement("p");

            const span_word_en = document.createElement("span");
            span_word_en.textContent = dictionary_record.word_en;
            span_word_en.classList.add('blue');
            paragraph.appendChild(span_word_en);

            const span_pronunciation = document.createElement("span");
            span_pronunciation.textContent = dictionary_record.pronunciation;
            span_pronunciation.classList.add('green');
            paragraph.appendChild(span_pronunciation);

            const span_word_th = document.createElement("span");
            span_word_th.textContent = dictionary_record.word_th;
            span_word_th.lang = "th";
            paragraph.appendChild(span_word_th);

            span_word_th.addEventListener('click', function () {
                var spanWordTh = this;
                if (window.getSelection) {
                    var range = document.createRange();
                    range.selectNode(spanWordTh);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                } else if (document.selection) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(spanWordTh);
                    range.select();
                }

                textToSpeech(span_word_th.textContent);

            });

            searchWords.appendChild(paragraph);

        });

    if (searchWords.length == 0) {
        searchWords.innerHTML = "";
    }
    if (searchWord.value == '') {
        searchWords.innerHTML = "";
    }

    const choiceWords = document.getElementById("choiceWords");
    choiceWords.innerHTML = '';

    //    console.log(wordMatches);
});

function initialize() {

    initializeDictionary();
    currentDictionary = '';
    //   lastDictionary = '';

    const choiceWords = document.getElementById("choiceWords");
    choiceWords.textContent = '';

    searchWord.value = '';

    const searchWords = document.getElementById("searchWords");
    searchWords.innerHTML = '';

    const exampleContainer = document.getElementById("example");
    exampleContainer.innerHTML = "";

    uncheckSelectedCheckboxes(dictionaryCheckboxes);

    randomizeCheckbox.checked = false;
    incorrectAnswersOnly.checked = false;

    feedback();
}

function setDictionary() {

    let lastDictionary = currentDictionary; // used for randmised and return to ordered

    currentDictionary = [];

    if (selectedDictionaryNames.length === 0) {
        initialize();
        return;
    } else {

        selectedDictionaryNames.forEach(name => {

            if (dictionaries.hasOwnProperty(name)) {

                const newArray = [...dictionaries[name]];
                currentDictionary = currentDictionary.concat(newArray);
                lastDictionary = lastDictionary.concat(newArray);

            } else {
                //            console.log(`Array '${name}' does not exist.`);
            }
        });

        if (incorrectAnswersOnly.checked) {
            currentDictionary = dictionaryIncorrectAnswers;
        }

        if (randomizeCheckbox.checked) {
            currentDictionary = shuffle(currentDictionary);
        }

        feedback();
        wordIndex = 0;
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

function htmlMultipleChoice(questionWordIndex) {

    let randomWords = [];
    searchWord.value = currentDictionary[questionWordIndex].word_en;

    const choiceWords = document.getElementById("choiceWords");
    choiceWords.innerHTML = "";

    // get multiple choice word indexes, add index for correct answer, shuffle the array
    randomWords = getRandomIntArray(questionWordIndex, currentDictionary.length);
    randomWords.push(questionWordIndex); // add index for correct word
    let shuffledWords = [];
    shuffledWords = shuffle(randomWords);

    shuffledWords.forEach(
        (userSelectedIndex) => {
            const divChoiceWord = document.createElement("div");

            const buttonChoiceWord = document.createElement("button");
            buttonChoiceWord.textContent = currentDictionary[userSelectedIndex].pronunciation;
            divChoiceWord.appendChild(buttonChoiceWord);
            buttonChoiceWord.addEventListener("click", function () {
                if (currentDictionary[questionWordIndex].pronunciation === currentDictionary[userSelectedIndex].pronunciation) {
                    buttonChoiceWord.classList.add("correct");
                    correctAnswerCount++;
                } else {
                    buttonChoiceWord.classList.add("incorrect");
                    buttonChoiceWord.textContent = currentDictionary[userSelectedIndex].pronunciation
                        + ' = ' + currentDictionary[userSelectedIndex].word_en
                    incorrectAnswerCount++;
                    const found = dictionaryIncorrectAnswers.find(
                        ({ pronunciation }) => pronunciation === currentDictionary[questionWordIndex].pronunciation);
                    if (!found) {
                        dictionaryIncorrectAnswers.push(currentDictionary[questionWordIndex]);

                        if (dictionaryIncorrectAnswers.length > NoAnswerChoices) {
                            document.getElementById("incorrectAnswersOnlyDiv").hidden = false;
                        }
                    }
                }
                attemptAnswerCount++;
                feedback();
            });

            const spanChoiceWordTh = document.createElement("span");
            spanChoiceWordTh.textContent = currentDictionary[userSelectedIndex].word_th;
            spanChoiceWordTh.lang = "th";
            divChoiceWord.appendChild(spanChoiceWordTh);
            //            spanChoiceWordTh.classList.add("font-size-medium");

            spanChoiceWordTh.addEventListener('click', function () {
                var spanWordTh = this;
                if (window.getSelection) {
                    var range = document.createRange();
                    range.selectNode(spanWordTh);
                    window.getSelection().removeAllRanges();
                    window.getSelection().addRange(range);
                } else if (document.selection) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(spanWordTh);
                    range.select();
                }

                textToSpeech(spanChoiceWordTh.textContent);

            });

            choiceWords.appendChild(divChoiceWord);

        });

    const searchWords = document.getElementById("searchWords");
    searchWords.innerHTML = '';

    const exampleContainer = document.getElementById("example");
    exampleContainer.innerHTML = "";

    const spanExampleEn = document.createElement("span");
    spanExampleEn.textContent = currentDictionary[questionWordIndex].ex_en;
    //    spanExampleEn.classList.add("blue");
    exampleContainer.appendChild(spanExampleEn);

    const spanExamplePronunciation = document.createElement("div");
    spanExamplePronunciation.textContent = currentDictionary[questionWordIndex].ex_pronunciation;
    spanExamplePronunciation.classList.add("blue");
    exampleContainer.appendChild(spanExamplePronunciation);

    const spanExampleTh = document.createElement("div");
    spanExampleTh.lang = "th";
    spanExampleTh.textContent = currentDictionary[questionWordIndex].ex_th;
    spanExampleTh.classList.add("red");
    exampleContainer.appendChild(spanExampleTh);

}

function feedback() {
    const buttonCorrect = document.getElementById("correctAnswer");
    buttonCorrect.textContent = 'Correct: ' + correctAnswerCount;

    const buttonIncorrect = document.getElementById("incorrectAnswer");
    buttonIncorrect.textContent = 'Incorrect: ' + incorrectAnswerCount;

    const buttonScore = document.getElementById("score");
    buttonScore.textContent = 'Score: ' + parseInt((correctAnswerCount / attemptAnswerCount) * 100) + "%";

    const buttonTries = document.getElementById("tries");
    buttonTries.textContent = 'Attempts: ' + attemptAnswerCount
        + ' Selected dictionary: ' + currentDictionary.length + ' words';

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

function textToSpeech(text) {

    const utterance = new SpeechSynthesisUtterance(text);

    const voices = window.speechSynthesis.getVoices();

    /*
                    if ('speechSynthesis' in window) {
    
                        let voices = window.speechSynthesis.getVoices();
    
                        let thaiVoice = voices.find(voice => voice.lang === 'th-TH');
    
                        let utterance = new SpeechSynthesisUtterance('สวัสดีครับ');
    
                        utterance.voice = thaiVoice;
    
                        if (typeof thaiVoice !== 'undefined') {
                            window.speechSynthesis.speak(utterance);
                        }
                    } else {
                        console.log('SpeechSynthesis API is not available in this browser');
                    }
    */
    /*
        voices.forEach((voice) => {
    
            if (voice.lang === "th-TH" || voice.lang === "th" || voice.lang === "TH") {
    
                utterance.voice = voice;
                console.log('voice ', utterance.voice);
    
            }
    
        });
    */

    let thaiVoice = voices.find(voice => voice.name === 'ไทย ไทย'); // see th.json in assets
    utterance.voice = thaiVoice;

    if (utterance.voice != null) {
        window.speechSynthesis.speak(utterance);
    }

}
