// book 1
const dictionaryPhonetics = [
    { en_word: "house", th_word: "บ้าน", pronunciation: "bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "school", th_word: "โรงเรียน", pronunciation: "rooŋ-rian", ex_en: "my school", ex_pronunciation: "rooŋ-rian khɔ̌ɔŋ phǒm", ex_th: "" },
    { en_word: "coffee", th_word: "กาแฟ", pronunciation: "gaa-fɛɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "food", th_word: "อาหาร", pronunciation: "aa-hǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to lie down or sleep", th_word: "นอน", pronunciation: "nɔɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "banana", th_word: "กล้วย", pronunciation: "gluay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "family", th_word: "ครอบครัว", pronunciation: "khroop-khrua", ex_en: "", ex_pronunciation: " khɔ̌ɔŋ phǒm", ex_th: "" },
    { en_word: "dog", th_word: "หมา", pronunciation: "H̄mā", ex_en: "", ex_pronunciation: "H̄mā khɔ̌ɔŋ phǒm", ex_th: "" },
    { en_word: "lonely", th_word: "เหงา", pronunciation: "H̄engā", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "book", th_word: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ", ex_en: "my books", ex_pronunciation: "nǎŋ-sɯ̌ɯ khɔ̌ɔŋ phǒm", ex_th: "" },
    { en_word: "woman", th_word: "ผู้หญิง", pronunciation: "P̄hū̂ h̄ỵing", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hot", th_word: "ร้อน", pronunciation: "rɔ́ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "horse", th_word: "ม้า", pronunciation: "M̂ā", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "friend", th_word: "เพื่อน", pronunciation: "phɯ̂an", ex_en: "my friend", ex_pronunciation: "phɯ̂an khɔ̌ɔŋ phǒm", ex_th: "" }
];
const dictionaryBook1 = [
    { en_word: "hello", th_word: "สวัสดี", pronunciation: "sà-wàt-dii", ex_en: "hello", ex_pronunciation: "sà-wàt-dii khráp", ex_th: "สวัสดีครับ" },
    { en_word: "thank you", th_word: "ขอบคุณ", pronunciation: "kɔ̀ɔp-kun", ex_en: "Thank you.", ex_pronunciation: "khɔ̀ɔp-khun khráp", ex_th: "ขอบคุณครับ" },
    { en_word: "never mind", th_word: "ไม่เป็นไร", pronunciation: "mâi-bpen-rai", en_ex: "Never mind.Thank you.", ex_pronunciation: "mâi-bpen-rai khráp, khɔ̀ɔp-khun khráp", ex_th: "ไม่เป็ นไรครับ ขอบคุณครับ" },
    { en_word: "sorry / excuse me", th_word: "ขอโทษ", pronunciation: "kɔ̌ɔ-tôot", en_ex: "Sorry, I cannot.", ex_pronunciation: "khɔ̌ɔ-thôot khà mâi dâay khà", ex_th: "ขอโทษค่ะไม่ได้คะ่" },
    { en_word: "nice to meet you", th_word: "ยินดีทีได้รู้จัก", pronunciation: "yin-dii tîi dâai rúu-jàk", en_ex: "Nice to meet you (too).", ex_pronunciation: "yin-dii thîi dâay rúu-jàk khráp", ex_th: "ยินดีทีได้ร้ ูจกัครับ" },
    { en_word: "how about you?", th_word: "แล้ว คุณล่ะ", pronunciation: "khun la", en_ex: "How about you?", ex_pronunciation: "(lɛ́ɛw)-khun-là", ex_th: "(แล้ว) คุณล่ะ" },
    { en_word: "he / she", th_word: "เขา", pronunciation: "khǎw", ex_en: "Where is he/she from ?", ex_pronunciation: "khǎw maa jàak bprà-thêet à-rai", ex_th: "เขามาจากประเทศอะไร" },
    { en_word: "we / us", th_word: "พวกเรา", pronunciation: "phûak-raw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "they / them", th_word: "พวกเขา", pronunciation: "phûak-khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "belong to / of", th_word: "ของ", pronunciation: "khɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "my / mine for male", th_word: "ของผม", pronunciation: "(khɔ̌ɔŋ) phǒm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "my / mine for female", th_word: "ของฉัน", pronunciation: "(khɔ̌ɔŋ) chǎn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "your / yours", th_word: "ของคุณ", pronunciation: "(khɔ̌ɔŋ) khun", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "his / her / hers", th_word: "ของเขา", pronunciation: "(khɔ̌ɔŋ) khǎw", ex_en: "What is her name?", ex_pronunciation: "khǎw chɯ̂ɯ à-rai", ex_th: "เขาชืxออะไร" },
    { en_word: "our / ours", th_word: "ของพวกเรา", pronunciation: "(khɔ̌ɔŋ) phûak-raw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "their / theirs", th_word: "ของพวกเขา", pronunciation: "khɔ̌ɔŋ phûak-khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "name", th_word: "ชือ", pronunciation: "chʉ̂ʉ", ex_en: "What is your name?", ex_pronunciation: "khun chɯ̂ɯ à-rai khráp", ex_th: "คุณชืxออะไรครับ" },
    { en_word: "first name", th_word: "ชื#อจริง", pronunciation: "chʉ̂ʉ jiŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "surname", th_word: "นามสกุล", pronunciation: "naam-sà-gun", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "nickname", th_word: "อเล่น", pronunciation: "chʉ̂ʉ lên", ex_en: "My name is John.", ex_pronunciation: "phǒm chɯ̂ɯ John khráp", ex_th: "ผมชืxอจอห์นครับ" },
    { en_word: "fine", th_word: "สบายดี", pronunciation: "sà-baay-dii", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "pretty good", th_word: "ก็ดี", pronunciation: "gɔ̂ɔ dii", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "so so", th_word: "เฉย เฉย", pronunciation: "chə̌əy-chə̌əy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eat already", th_word: "กินแล้ว", pronunciation: "gin lɛ́ɛw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "no", th_word: "ยัง", pronunciation: "yaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "come", th_word: "มา", pronunciation: "maa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "from", th_word: "จาก", pronunciation: "jàak", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "where", th_word: "ทีไหน", pronunciation: "thîi-nǎi", ex_en: "Where are you from?", ex_pronunciation: "khun maa jàak thîi-nǎi khráp", ex_th: "คุณมาจากทีxไหนครับ" },
    { en_word: "to eat", th_word: "กิน", pronunciation: "gin", ex_en: "I usually eat Thai food.", ex_pronunciation: "(bpòk-gà-dtì) phǒm gin aa-hǎan thai", ex_th: "(ปกติ) ผมกินอาหารไทย" },
    { en_word: "to drink", th_word: "ดืxม", pronunciation: "dʉ̀ʉm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to watch", th_word: "ดู", pronunciation: "duu", ex_en: "What do you like to do ?", ex_pronunciation: "khun chɔ̂ɔp tham à-rai bâaŋ khá", ex_th: "คุณชอบทําอะไรบ้างคะ" },
    { en_word: "to listen", th_word: "ฟัง", pronunciation: "faŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to wake up", th_word: "ตืxน", pronunciation: "dtɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to lie down / sleep", th_word: "นอน", pronunciation: "nɔɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to walk", th_word: "เดิน", pronunciation: "dəən", ex_en: "He/She doesn't like walking.", ex_pronunciation: "khǎw mâi chɔ̂ɔp dəən", ex_th: "เขาไม่ชอบเดิน" },
    { en_word: "to speak", th_word: "พูด", pronunciation: "phûut", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to study", th_word: "เรียน", pronunciation: "rian", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to write", th_word: "เขียน", pronunciation: "khǐan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to read", th_word: "อ่าน", pronunciation: "àan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to take a shower", th_word: "อาบนํ âา", pronunciation: "àap-náam", ex_en: "Do they like taking a shower ?", ex_pronunciation: "phûak-khǎw chɔ̂ɔp àap-náam mǎi/mái", ex_th: "พวกเขาชอบอาบนําไหม/มัย" },
    { en_word: "to play", th_word: "เล่น", pronunciation: "lên", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to exercise", th_word: "ออกกําลังกาย", pronunciation: "ɔ̀ɔk-gam-lang-gaai", ex_en: "Normally, I exercise.", ex_pronunciation: "(bpòk-gà-dtì) chǎn ɔ̀ɔk gam-laŋ-gaay", ex_th: "(ปกติ) ฉันออกกําลังกาย" },
    { en_word: "to go", th_word: "ไป", pronunciation: "bpai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to do / make", th_word: "ทํา", pronunciation: "tham", ex_en: "What do you like to do ?", ex_pronunciation: "khun chɔ̂ɔp tham à-rai khráp", ex_th: "คุณชอบทําอะไรครับ" },
    { en_word: "Normally/Usually", th_word: "ปกติ", pronunciation: "bpòk-gà-dtì", ex_en: "Normally, I exercise.", ex_pronunciation: "(bpòk-gà-dtì) chǎn ɔ̀ɔk gam-laŋ-gaay", ex_th: "(ปกติ) ฉันออกกําลังกาย" },
    { en_word: "food", th_word: "อาหาร", pronunciation: "aa-hǎan", ex_en: "I like cooking.", ex_pronunciation: "chǎn chɔ̂ɔp tham aa-hǎan", ex_th: "ฉันชอบดื&ม/กินกาแฟ" },
    { en_word: "book", th_word: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "market", th_word: "ตลาด", pronunciation: "dtà-làat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "song", th_word: "เพลง", pronunciation: "phleeŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "home work", th_word: "การบ้าน", pronunciation: "gaan-bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "coffee", th_word: "กาแฟ", pronunciation: "gaa-fɛɛ", ex_en: "my coffee", ex_pronunciation: "gaa-fɛɛ khɔ̌ɔŋ phǒm", ex_th: "" },
    { en_word: "language", th_word: "ภาษา", pronunciation: "phaa-sǎa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "like", th_word: "ชอบ", pronunciation: "chɔ̂ɔp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "yes/no", th_word: "ไหม/มัย", pronunciation: "mǎi/mái", ex_en: "Do you (usually) drink coffee ?", ex_pronunciation: "bpòk-gà-dtì khun dɯɯm gaa - fɛɛ mǎi/mái", ex_th: "ปกติคณดืxมกาแฟไหม/มัย‰" },
    { en_word: "do", th_word: "ทํา", pronunciation: "tham", ex_en: "Does he/she like cooking ?", ex_pronunciation: "khǎw chɔ̂ɔp tham aa-hǎan mǎi/mái", ex_th: "เขาชอบทําอาหารไหม/มัย" },
    { en_word: "and", th_word: "และ", pronunciation: "lɛ́", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "multiple answers", th_word: "บ้าง", pronunciation: "bâaŋ", ex_en: "What do you like to do ?", ex_pronunciation: "khun chɔ̂ɔp tham à-rai bâaŋ khá", ex_th: "คุณชอบทําอะไรบ้างคะ" },
    { en_word: "do / make", th_word: "ทํา", pronunciation: "tham", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to work", th_word: "ทํางาน", pronunciation: "tham ŋaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to do homework", th_word: "ทําการบ้าน", pronunciation: "tham gaan-bânn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to do housework", th_word: "ทํางานบ้าน", pronunciation: "tham ŋaan-bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to cook", th_word: "ทําอาหาร", pronunciation: "tham aa-hǎan", ex_en: "He/She can cook.", ex_pronunciation: "khǎw tham aa-hǎan dâay", ex_th: "เขาทําอาหารได้" },
    { en_word: "to drive a car", th_word: "ขับรถ", pronunciation: "khàp rót", ex_en: "I can drive a car.", ex_pronunciation: "chǎn khàp rót dâay", ex_th: "ฉันขับรถได้" },
    { en_word: "to ride a motorbike", th_word: "ขีeมอเตอร์ไซค์", pronunciation: "khìi mɔɔ-dtəə-sai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to ride a bicycle", th_word: "ขีeจักรยาน", pronunciation: "khiì jàk-grà-yaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to talk with freinds", th_word: "คุยกับเพืeอน", pronunciation: "khuy gàp phɯ̂an", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to study Thai", th_word: "เรียนภาษาไทย", pronunciation: "rian phaa-sǎa thai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to return home", th_word: "กลับบ้าน", pronunciation: "glàp bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shopping", th_word: "ซือของ", pronunciation: "sɯ́ɯ-khɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "travel / hang out", th_word: "ไปเทีeยว", pronunciation: "bpai-thiâw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "watch movie", th_word: "ดูหนัง", pronunciation: "duu nǎŋ", ex_en: "Normally, I watch TV.", ex_pronunciation: "(bpòk-gà-dtì) chǎn duu thii-wii", ex_th: "(ปกติ) ฉันดูทีวี" },
    { en_word: "can", th_word: "ได้", pronunciation: "dâay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to sit", th_word: "นัง", pronunciation: "nâŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to stand", th_word: "ยืน", pronunciation: "yɯɯn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to run", th_word: "วิง", pronunciation: "wîŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to swim", th_word: "ว่ายนํา", pronunciation: "wâay-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to do the laundry", th_word: "ซักผ้า", pronunciation: "sák-phâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to wash the dishes", th_word: "ล้างจาน", pronunciation: "láaŋ jaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to rest", th_word: "พักผ่อน", pronunciation: "phák-phɔ̀ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to stroll", th_word: "เดินเล่น", pronunciation: "dəən-lên", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to listen to music", th_word: "ฟังเพลง", pronunciation: "faŋ pleeŋ", ex_en: "I usually listen to Thai songs.", ex_pronunciation: "(bpòk-gà-dtì) chǎn faŋ phleeŋ thai", ex_th: "(ปกติ) ฉันฟั งเพลงไทย" },
    { en_word: "to sing", th_word: "ร้องเพลง", pronunciation: "rɔ́ɔŋ pleeŋ", ex_en: "I usually listen to Thai songs.", ex_pronunciation: "(bpòk-gà-dtì) chǎn faŋ phleeŋ thai", ex_th: "(ปกติ) ฉันฟังเพลงไทย" },
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
    { en_word: "bad / terrible", th_word: "แย่", pronunciation: "yɛ̂ɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hot", th_word: "ร้อน", pronunciation: "rɔ́ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "cool / iced", th_word: "เย็น", pronunciation: "yen", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "cold", th_word: "หนาว", pronunciation: "nǎaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "cheap", th_word: "ถูก", pronunciation: "thùuk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "expensive", th_word: "แพง", pronunciation: "phɛɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "slow", th_word: "ช้า", pronunciation: "cháa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fast", th_word: "เร็ว", pronunciation: "rew", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "beautiful / pretty", th_word: "สวย", pronunciation: "sǔay", ex_en: "Is she beautiful ?", ex_pronunciation: "khǎw sǔay mǎi", ex_th: "เขาสวยไหม" },
    { en_word: "handsome", th_word: "หล่อ", pronunciation: "lɔ̀ɔ", ex_en: "Am I handsome?", ex_pronunciation: "phǒm lɔ̀ɔ mǎi", ex_th: "ผมหล่อไหม" },
    { en_word: "not", th_word: "ไม่", pronunciation: "mâi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "delicious", th_word: "อร่อย", pronunciation: "à-rɔ̀ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fun / enjoyable", th_word: "สนุก", pronunciation: "sà-nùk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hungry", th_word: "หิว", pronunciation: "hǐw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "full", th_word: "อิม", pronunciation: "ìm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fat", th_word: "อ้วน", pronunciation: "ûan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "skinny", th_word: "ผอม", pronunciation: "phɔ̌ɔm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "tired", th_word: "เหนือย", pronunciation: "nɯay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sleepy", th_word: "ง่วง", pronunciation: "ŋûaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "difficult", th_word: "ยาก", pronunciation: "yâak", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "easy", th_word: "ง่าย", pronunciation: "ŋâay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "clean", th_word: "สะอาด", pronunciation: "sà-àat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "dirty", th_word: "สกปรก", pronunciation: "sòk-gà-bpròk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "rich", th_word: "รวย", pronunciation: "ruay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "poor", th_word: "จน", pronunciation: "jon", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "new", th_word: "ใหม่", pronunciation: "mài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "old", th_word: "เก่า/แก่", pronunciation: "gàw / gɛ̀ɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "how", th_word: "ยังไง", pronunciation: "yaŋ-ŋai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shoes", th_word: "รองเท้า", pronunciation: "rɔɔŋ-tháw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "book", th_word: "หนังสือ", pronunciation: "nǎŋ-sɯ̌ɯ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "bathroom", th_word: "ห้องนําƒ", pronunciation: "hɔ̂ɔŋ-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "Bangkok", th_word: "กรุงเทพฯ", pronunciation: "gruŋ-thêep", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shirt", th_word: "เสือ", pronunciation: "sɯ̂a", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "Thailand", th_word: "ประเทศไทย", pronunciation: "bprà-thêet thai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "and", th_word: "และ", pronunciation: "lɛ́", ex_en: "She is pretty and kind.", ex_pronunciation: "khǎw sǔay lɛ́ jai-dii", ex_th: "เขาสวยและใจดี" },
    { en_word: "but", th_word: "แต่", pronunciation: "dtɛ̀ɛ", ex_en: "The food is delicious but expensive.", ex_pronunciation: "aa hǎan a-rɔ̀ɔy dtɛ̀ɛ phɛɛŋ", ex_th: "อาหารอร่อยแต่แพง" },
    { en_word: "more than", th_word: "กว่า", pronunciation: "gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "more than / rather than", th_word: "มากกว่า", pronunciation: "mâak gwàa", ex_en: "I eat more Thai food than western food.", ex_pronunciation: "phǒm gin aa-hǎan thai mâak gwàa aa-hǎan fá-ràŋ", ex_th: "ผมกินอาหารไทยมากกว่าอาหารฝรัง" },
    { en_word: "than", th_word: "กว่า", pronunciation: "gwàa", ex_en: "Thai food is more spicy than Japanese food.", ex_pronunciation: "aa-hǎan thai phèt gwàa aa-hǎan yîi-bpùn", ex_th: "อาหารไทยเผ็ดกว่าอาหารญีปนุ่" },
    { en_word: "less than", th_word: "น้อยกว่า", pronunciation: "nɔ́ɔy gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "the most", th_word: "ทีสุด", pronunciation: "thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "better", th_word: "ดีกว่า", pronunciation: "dii gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "the best", th_word: "ดีที:สดุ", pronunciation: "dii thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "better", th_word: "เก่งกว่า", pronunciation: "gèŋ gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "the best", th_word: "เก่งทีส", pronunciation: "gèŋ thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "less", th_word: "น้ อยกว่า", pronunciation: "nɔ́ɔy gwàa", ex_en: "Chiang Mai is smaller than Bangkok.", ex_pronunciation: "chiaŋ-mài lék gwàa gruŋ-thêep", ex_th: "เชียงใหม่เล็กกว่ากรุงเทพฯ" },
    { en_word: "least", th_word: "น้อยทีสดุ", pronunciation: "nɔ́ɔy thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "more", th_word: "มากกว่า", pronunciation: "mâak gwàa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "the most", th_word: "มากทีสดุ", pronunciation: "mâak thîi-sùt", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //    { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
const dictionaryPronouns = [
    { en_word: "I for male", th_word: "ผม", pronunciation: "phǒm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "I for female", th_word: "ฉัน", pronunciation: "chǎn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "you", th_word: "คุณ", pronunciation: "khun", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "he / she", th_word: "เขา", pronunciation: "khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "we / us", th_word: "พวกเรา", pronunciation: "phûak-raw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "they / them", th_word: "พวกเขา", pronunciation: "phûak-khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "belong to / of", th_word: "ของ", pronunciation: "khɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "your / yours", th_word: "ของคุณ", pronunciation: "(khɔ̌ɔŋ) khun", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "his / her / hers", th_word: "ของเขา", pronunciation: "(khɔ̌ɔŋ) khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "our / ours", th_word: "ของพวกเรา", pronunciation: "(khɔ̌ɔŋ) phûak-raw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "their / theirs", th_word: "ของพวกเขา", pronunciation: "khɔ̌ɔŋ phûak-khǎw", ex_en: "", ex_pronunciation: "", ex_th: "" }
];
const dictionaryNumbers = [
    { en_word: "one", th_word: "หนึง", pronunciation: "nɯŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "two", th_word: "สอง", pronunciation: "sɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "three", th_word: "สาม", pronunciation: "sǎam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "four", th_word: "สี", pronunciation: "sìi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "five", th_word: "ห้า", pronunciation: "hâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "six", th_word: "หก", pronunciation: "hòk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "seven", th_word: "เจ็ด", pronunciation: "jèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eight", th_word: "แปด", pronunciation: "bpɛ̀ɛt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "nine", th_word: "เก้า", pronunciation: "gâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "ten", th_word: "สิบ", pronunciation: "sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eleven", th_word: "สิบเอ็ด", pronunciation: "sìp-èt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "twelve", th_word: "สิบสอง", pronunciation: "sìp-sɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "thirteen", th_word: "สิบสาม", pronunciation: "sìp-sǎam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fourteen", th_word: "สิบสี", pronunciation: "sìp-sìi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fifteen", th_word: "สิบห้า", pronunciation: "sìp-hâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sixteen", th_word: "สิบหก", pronunciation: "sìp-hòk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "seventeen", th_word: "สิบเจ็ด", pronunciation: "sìp-jèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "eighteen", th_word: "สิบแปด", pronunciation: "sìp-bpɛ̀ɛt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "nineteen", th_word: "สิบเก้า", pronunciation: "sìp-gâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "twenty", th_word: "ยีส ิบ", pronunciation: "yîi-sìp", ex_en: "", ex_pronunciation: "", ex_th: "" },
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
const dictionaryClothes = [
    { en_word: "clothes", th_word: "เสือผ้า", pronunciation: "sɯ̂a-phâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shirt", th_word: "เสือ", pronunciation: "sɯ̂a", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "T-shirt", th_word: "เสือยืด", pronunciation: "sɯ̂a-yɯ̂ɯt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sweater", th_word: "เสือกันหนาว", pronunciation: "sɯ̂a gan-nǎaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "pants / trousers", th_word: "กางเกง", pronunciation: "gaaŋ-geeŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "skirt", th_word: "กระโปรง", pronunciation: "grà-bprooŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shoes", th_word: "รองเท้า", pronunciation: "rɔɔŋ-tháaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "socks", th_word: "ถุงเท้า", pronunciation: "thǔŋ-tháaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "glasses", th_word: "แว่นตา", pronunciation: "wɛ̂ɛn-dtaa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hat", th_word: "หมวก", pronunciation: "mùak", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "swimming suit", th_word: "ชุดว่ายนํา", pronunciation: "chút wâay-náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "pajamas", th_word: "ชุดนอน", pronunciation: "chút nɔɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "exercise outfit", th_word: "ชุดออกกําลังกาย", pronunciation: "chút ɔ̀ɔk-gam-laŋ-gaay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "price", th_word: "ราคา", pronunciation: "raa-khaa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to discount", th_word: "ลด", pronunciation: "lót", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //    { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
const dictionaryPlaces = [
    { en_word: "house", th_word: "บ้าน", pronunciation: "bâan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "school", th_word: "โรงเรียน", pronunciation: "rooŋ-rian", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hotel", th_word: "โรงแรม", pronunciation: "rooŋ-rɛɛm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hospital", th_word: "โรงพยาบาล", pronunciation: "rooŋ-phá-yaa-baan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "restaurant", th_word: "ร้านอาหาร", pronunciation: "ráan aa-hǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "coffee shop", th_word: "ร้านกาแฟ", pronunciation: "ráan gaa-fɛɛ", ex_en: "Normally, I drink coffee.", ex_pronunciation: "(bpòk-gà-dtì) phǒm dɯɯm / gin gaa-fɛɛ", ex_th: "(ปกติ) ผมดืxม/กินกาแฟ" },
    { en_word: "train station", th_word: "สถานีรถไฟ", pronunciation: "sà-thǎa-nii rót-fai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "bus station", th_word: "สถานีขนส่ง", pronunciation: "sà-thǎa-nii khǒn-sòng", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "plice station", th_word: "สถานีตํารวจ", pronunciation: "s̀a-thǎa-nii dtam-rùat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "airport", th_word: "สนามบิน", pronunciation: "sà-nǎam bin", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "park", th_word: "สวน", pronunciation: "sǔan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "bank", th_word: "ธนาคาร", pronunciation: "thá-naa-khaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "ATM", th_word: "ตู้เอทีเอ็ม", pronunciation: "dtûu ee-thii-em", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "market", th_word: "ตลาด", pronunciation: "dta-làat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "department store", th_word: "ห้าง", pronunciation: "hâaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "road / street", th_word: "ถนน", pronunciation: "thà-nǒn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "lane", th_word: "ซอย", pronunciation: "sɔɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "down town", th_word: "ตัวเมือง", pronunciation: "dtua mɯaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "beach", th_word: "ชายหาด", pronunciation: "chaay-hàat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sea", th_word: "ทะเล", pronunciation: "thá-lee", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "temple", th_word: "วัด", pronunciation: "wát", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "church", th_word: "โบสถ์", pronunciation: "bòot", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "university", th_word: "มหาวิทยาลัย", pronunciation: "má-hǎa-wit́-thá yaa- lai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "mountain", th_word: "ภูเขา / ดอย", pronunciation: "phuu-khǎw/dɔɔy", ex_en: "phuu-khǎw / dɔɔy", ex_pronunciation: "", ex_th: "" },
    { en_word: "river", th_word: "แม่นํา", pronunciation: "mɛ̂ɛ-náam", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //    { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];
const dictionaryPrepositions = [
    { en_word: "to be (is/am/are)", th_word: "อยู่", pronunciation: "yùu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "where", th_word: "ที&ไหน", pronunciation: "thîi-nǎi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "close to", th_word: "ใกล้", pronunciation: "glâi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "near", th_word: "กับ", pronunciation: "gàp", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "far", th_word: "ไกล", pronunciation: "glai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "next to", th_word: "ข้างๆ", pronunciation: "khâaŋ-khâaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "next to", th_word: "ติด(กับ)", pronunciation: "dtìt(gàp)", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "opposite to", th_word: "ตรงข้าม", pronunciation: "dtroŋ-khâam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "at", th_word: "ที&", pronunciation: "thîi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "in", th_word: "ใน", pronunciation: "nai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "arround (in the area)", th_word: "แถว", pronunciation: "thɛ̌ɛw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "in front of", th_word: "ข้างหน้า", pronunciation: "khâaŋ-nâa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "behind", th_word: "ข้างหลัง", pronunciation: "khâaŋ-lǎŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "here", th_word: "ที&นี&", pronunciation: "thîi-nîi", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "there", th_word: "ที&นนั&", pronunciation: "thîi-nân", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "over there", th_word: "ที&โน่น", pronunciation: "thîi-nôon", ex_en: "", ex_pronunciation: "", ex_th: "" }
    //   { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
];

// book 2    
const dictionaryFood = [
    { en_word: "rice", th_word: "ข้าว", pronunciation: "khâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "food", th_word: "อาหาร/กับข้าว", pronunciation: "aa-hǎan/gàp-khâaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "curry", th_word: "แกง", pronunciation: "gɛɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "vegetables", th_word: "ผัก", pronunciation: "phàk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "egg", th_word: "ไข่", pronunciation: "khài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "tofu", th_word: "เต้าหู ้", pronunciation: "dtâw-hûu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "Chili", th_word: "พริก", pronunciation: "phrík", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "meat/beef", th_word: "เนืNอ", pronunciation: "nɯa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "pork", th_word: "หมู", pronunciation: "mǔu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "chicken", th_word: "ไก่", pronunciation: "gài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fish", th_word: "ปลา", pronunciation: "bplaa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "seafood", th_word: "(อาหาร)ทะเล", pronunciation: "(aa hǎan) thá-lee", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shrimp", th_word: "กุ้ง", pronunciation: "gûŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "squid", th_word: "ปลาหมึก", pronunciation: "bplaa-mɯk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "crab", th_word: "ปู", pronunciation: "bpuu", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "shell", th_word: "หอย", pronunciation: "hɔ̌ɔy", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to boil/boiled", th_word: "ต้ม", pronunciation: "dtôm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to stir fry/fried", th_word: "ผัด", pronunciation: "phàt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to deep fry/ deep fried", th_word: "ทอด", pronunciation: "thɔ̂ɔt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to steam/steamed", th_word: "นึงf", pronunciation: "nɯ̂ŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to grill/grilled", th_word: "ปิ", pronunciation: "bpîŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "to gril/grilled", th_word: "ย่าง", pronunciation: "yâaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "mild soup", th_word: "แกงจืด", pronunciation: "gɛɛŋ-jɯɯt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "spicy sour soup", th_word: "ต้ มยํา", pronunciation: "dtôm-yam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "spicy sour salad", th_word: "ยํา", pronunciation: "yam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "noodles", th_word: "ก๋วยเตีmยว", pronunciation: "gǔay-dtǐaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "pad thai noodles", th_word: "ผัดไทย", pronunciation: "phàt-thai", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fried vegtables", th_word: "ผัดผัก", pronunciation: "phàt-phàk", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "thai omelet", th_word: "ไข่เจียว", pronunciation: "khài-jiaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "papaya salad", th_word: "ส้มตํา", pronunciation: "sôm-dtam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "green curry", th_word: "แกงเขียงหวาน", pronunciation: "gɛɛŋ-khǐaw-wǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "red curry", th_word: "แกงเผ็ด", pronunciation: "gɛɛŋ-phèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "mango sticky rice", th_word: "ข้าวเหนียวมะม่วง", pronunciation: "khâaw-nǐaw má-mûaŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "taste/flavour", th_word: "รสชาติ", pronunciation: "rót-châat", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "spicy", th_word: "เผ็ด", pronunciation: "phèt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sweet", th_word: "หวาน", pronunciation: "wǎan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sour", th_word: "เปรียNว", pronunciation: "bprîaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "salty", th_word: "เค็ม", pronunciation: "khem", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "bitter", th_word: "ขม", pronunciation: "khǒm", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "tasteless/plain", th_word: "จืด", pronunciation: "jɯɯt", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "order/eat", th_word: "สั9ง/กิน", pronunciation: "sàŋ/gin", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "with/without", th_word: "ใส่/ไม่ใส่", pronunciation: "sài/mâi sài", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fermented fish", th_word: "ปลาร้า", pronunciation: "bplaa-ráa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "monosodium glutamate", th_word: "ผงชูรส", pronunciation: "phǒŋ-chuu-rót", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "plate", th_word: "จาน", pronunciation: "jaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "bowl", th_word: "ถ้วย/ชาม", pronunciation: "thûay/chaam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "Box/carton", th_word: "กล่อง", pronunciation: "glɔ̀ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "plastic bag", th_word: "ถุง", pronunciation: "thǔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "piece", th_word: "ชิ1น", pronunciation: "chín", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "water", th_word: "นํา", pronunciation: "náam", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "plain water", th_word: "นําเปล่า", pronunciation: "náam-bplàaw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "ice", th_word: "นําแข็ง", pronunciation: "náam-khɛ̌ ɛŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "sugar", th_word: "นําตาล", pronunciation: "náam-dtaan", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "coffee", th_word: "กาแฟ", pronunciation: "gaa-fɛɛ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "tea", th_word: "ชา", pronunciation: "chaa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "milk", th_word: "นม", pronunciation: "nom", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "soda", th_word: "โซดา", pronunciation: "soo-daa", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fruit juice", th_word: "นําผลไม้", pronunciation: "náam phǒn-lá-máay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "fruit shake/smoothie", th_word: "นําผลไม้ปัfน", pronunciation: "náam phǒn-lá-máay bpàn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "soft drik", th_word: "นําอัดลม", pronunciation: "náam àt-lom", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "beer", th_word: "เบียร์", pronunciation: "bia", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "liquor", th_word: "เหล้า", pronunciation: "lâw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "wine", th_word: "ไวน์", pronunciation: "waay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "hot", th_word: "ร้อน", pronunciation: "rɔ́ɔn", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "cold/iced", th_word: "เย็น", pronunciation: "yen", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "glass/cup", th_word: "แก้ว", pronunciation: "gɛ̂ɛw", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "cup", th_word: "ถ้วย", pronunciation: "thûay", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "carton", th_word: "กล่อง", pronunciation: "glɔ̀ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "can/tin", th_word: "กระป๋อง", pronunciation: "grà-bpɔ̌ɔŋ", ex_en: "", ex_pronunciation: "", ex_th: "" },
    { en_word: "bottle", th_word: "ขวด", pronunciation: "khùat", ex_en: "", ex_pronunciation: "", ex_th: "" }

    /*
        { en_word: "", th_word: "", pronunciation: "", ex_en: "", ex_pronunciation: "", ex_th: "" },
    */
];

const dictionaries = {
    // book 1
    dictionaryPhonetics: dictionaryPhonetics,
    dictionaryPronouns: dictionaryPronouns,
    dictionaryNumbers: dictionaryNumbers,
    dictionaryClothes: dictionaryClothes,
    dictionaryPlaces: dictionaryPlaces,
    dictionaryPrepositions: dictionaryPrepositions,
    dictionaryBook1: dictionaryBook1,
    // book 2
    dictionaryFood: dictionaryFood
};

const dictionaryIncorrectAnswers = [];

let wordIndex = 0;
let dictionary = [];
let currentDictionary = [];
let lastDictionary = currentDictionary;
let selectedDictionaryNames = [];

let NoAnswerChoices = 3;
let correctAnswerCount = 0;
let incorrectAnswerCount = 0;
let attemptAnswerCount = 0;
let randomize = false;

const searchWord = document.getElementById("searchWord");
const incorrectAnswersOnly = document.getElementById("incorrectAnswersOnly");
const randomizeCheckbox = document.getElementById("randomize");
const dictionaryCheckboxes = document.querySelectorAll('.checkbox-dictionary-container input[type="checkbox"]');

initialize();
function initialize() {

    initializeDictionary();

    const choiceWords = document.getElementById("choiceWords");
    choiceWords.textContent = '';

    searchWord.value = '';

    const searchWords = document.getElementById("searchWords");
    searchWords.innerHTML = '';

    uncheckSelectedCheckboxes(dictionaryCheckboxes);

    randomizeCheckbox.checked = false;

    feedback();
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

dictionaryCheckboxes.forEach(function (dictionaryCheckbox) {

    dictionaryCheckbox.addEventListener('change', function (event) {

        //    console.log('Checkbox with value ' + dictionaryCheckbox.value + ' has been changed');

        if (dictionaryCheckbox.checked) {
            //           console.log('Checkbox with value ' + dictionaryCheckbox.value + ' checked');
            selectedDictionaryNames.push(dictionaryCheckbox.value);
        } else {
            //           console.log('Checkbox with value ' + dictionaryCheckbox.value + ' unchecked');
            const index = selectedDictionaryNames.indexOf(dictionaryCheckbox.value);
            if (index !== -1) {
                selectedDictionaryNames.splice(index, 1);
            }

            if (selectedDictionaryNames == 0) {
                // no dictionary selected
                initialize();
                return;
            }
        }
        //        console.log('selectedDictionaryNames ' + selectedDictionaryNames);
        wordIndex = 0;
        setDictionary();
    });

});

function setDictionary() {

    currentDictionary = [];

    selectedDictionaryNames.forEach(name => {

        if (dictionaries.hasOwnProperty(name)) {
            const newArray = [...dictionaries[name]];
            //            console.log(newArray);
            currentDictionary = currentDictionary.concat(newArray);

        } else {
            //            console.log(`Array '${name}' does not exist.`);
        }
    });

    //   console.log('dictionary ', dictionary);

    feedback();

    searchWord.classList.remove('info');

    //   const searchWords = document.getElementById("searchWords");
    //  searchWords.innerHTML = '';

    wordIndex = 0;
    htmlMultipleChoice(wordIndex);

}

previousWord.addEventListener("click", () => {

    if (wordIndex > 0) {
        wordIndex = (wordIndex - 1) % currentDictionary.length;
    } else if (currentDictionary.length > 0) {
        wordIndex = currentDictionary.length - 1;
    } else {
        searchWord.classList.add('info');
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
        searchWord.classList.add('info');
        searchWord.value = 'Select a dictionary';
        return;
    }

    htmlMultipleChoice(wordIndex);

});

incorrectAnswersOnly.addEventListener("click", () => {

    if (incorrectAnswersOnly.checked) {

        if (dictionaryIncorrectAnswers.length > NoAnswerChoices) {
            lastDictionary = currentDictionary; // restore last dictionary if unchecked
            currentDictionary = dictionaryIncorrectAnswers;

            wordIndex = 0;
            htmlMultipleChoice(wordIndex);

        } else {
            incorrectAnswersOnly.checked = false;
        }

    } else {
        currentDictionary = lastDictionary;
    }

});

randomizeCheckbox.addEventListener("change", () => {

    if (currentDictionary.length == 0) {
        randomizeCheckbox.checked = false;
        return;
    }

    if (randomizeCheckbox.checked) {
        randomize = true;
        currentDictionary = shuffle(currentDictionary);
        wordIndex = 0;
        htmlMultipleChoice(wordIndex);
    } else {
        randomize = false;
        setDictionary();
    }

});

function htmlMultipleChoice(questionWordIndex) {

    let randomWords = [];
    searchWord.value = currentDictionary[questionWordIndex].en_word;

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
                        + ' = ' + currentDictionary[userSelectedIndex].en_word
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
            spanChoiceWordTh.textContent = currentDictionary[userSelectedIndex].th_word;
            spanChoiceWordTh.lang = "th";
            divChoiceWord.appendChild(spanChoiceWordTh);
            //            spanChoiceWordTh.classList.add("button");

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

searchWord.addEventListener('input', function (event) {

    let userInput = event.target.value.toLowerCase();
    let wordMatches = dictionary.filter(obj => obj.en_word.toLowerCase().startsWith(userInput));

    const searchWords = document.getElementById("searchWords");
    searchWords.innerHTML = '';

    wordMatches.forEach(
        (dictionary_record) => {

            const paragraph = document.createElement("p");

            const span_en_word = document.createElement("span");
            span_en_word.textContent = dictionary_record.en_word;
            span_en_word.classList.add('blue');
            paragraph.appendChild(span_en_word);

            const span_pronunciation = document.createElement("span");
            span_pronunciation.textContent = dictionary_record.pronunciation;
            span_pronunciation.classList.add('green');
            paragraph.appendChild(span_pronunciation);

            const span_th_word = document.createElement("span");
            span_th_word.textContent = dictionary_record.th_word;
            span_th_word.lang = "th";
            paragraph.appendChild(span_th_word);

            span_th_word.addEventListener('click', function () {
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

                textToSpeech(span_th_word.textContent);

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
