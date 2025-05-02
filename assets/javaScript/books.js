// This script handles the display of book details and audio playback for a language learning application.
const books = [
    {
        "title": "Book LS 1",
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
            },
            {
                "name": "What are you doing?",
                "vocabulary": [
                    { en: "eat", th: "กิน", hint: "gin" },
                    { en: "drink", th: "ดืxม", hint: "dʉ̀ʉm" },
                    { en: "watch", th: "ดู", hint: "duu" },
                    { en: "listen", th: "ฟัง", hint: "faŋ" },
                    { en: "wake up", th: "ตืxน", hint: "dtɯɯn" },
                    { en: "lie down/sleep", th: "นอน", hint: "nɔɔn" },
                    { en: "walk", th: "เดิน", hint: "dəən" },
                    { en: "speak", th: "พูด", hint: "phûut" },
                    { en: "study", th: "เรียน", hint: "rian" },
                    { en: "write", th: "เขียน", hint: "khǐan" },
                    { en: "read", th: "อ่าน", hint: "àan" },
                    { en: "take a shower", th: "อาบนํâา", hint: "àap-náam" },
                    { en: "play", th: "เล่น", hint: "lên" },
                    { en: "exercise", th: "ออกกําลังกาย", hint: "ɔ̀ɔk-gam-lang-gaai" },
                    { en: "go", th: "ไป", hint: "bpai" },
                    { en: "do/make", th: "ทํา", hint: "tham" },
                    { en: "Normally/Usually", th: "ปกติ", hint: "bpòk-gà-dtì" },
                    { en: "food", th: "อาหาร", hint: "aa-hǎan" },
                    { en: "book", th: "หนังสือ", hint: "nǎŋ-sɯ̌ɯ" },
                    { en: "market", th: "ตลาด", hint: "dtà-làat" },
                    { en: "song", th: "เพลง", hint: "phleeŋ" },
                    { en: "home work", th: "การบ้าน", hint: "gaan-bâan" },
                    { en: "coffee", th: "กาแฟ", hint: "gaa-fɛɛ" },
                    { en: "language", th: "ภาษา", hint: "phaa-sǎa" },
                    { en: "like", th: "ชอบ", hint: "chɔ̂ɔp" },
                    { en: "yes/no", th: "ไหม/มัย", hint: "mǎi/mái" },
                    { en: "do", th: "ทํา", hint: "tham" },
                    { en: "multiple answers", th: "บ้าง", hint: "bâaŋ" },
                    { en: "do/make", th: "ทํา", hint: "tham" },
                    { en: "work", th: "ทํางาน", hint: "tham ŋaan" },
                    { en: "do homework", th: "ทําการบ้าน", hint: "tham gaan-bânn" },
                    { en: "do housework", th: "ทํางานบ้าน", hint: "tham ŋaan-bâan" },
                    { en: "cook", th: "ทําอาหาร", hint: "tham aa-hǎan" },
                    { en: "drive a car", th: "ขับรถ", hint: "khàp rót" },
                    { en: "ride a motorbike", th: "ขีeมอเตอร์ไซค์", hint: "khìi mɔɔ-dtəə-sai" },
                    { en: "ride a bicycle", th: "ขีeจักรยาน", hint: "khiì jàk-grà-yaan" },
                    { en: "talk with freinds", th: "คุยกับเพืeอน", hint: "khuy gàp phɯ̂an" },
                    { en: "study Thai", th: "เรียนภาษาไทย", hint: "rian phaa-sǎa thai" },
                    { en: "return home", th: "กลับบ้าน", hint: "glàp bâan" },
                    { en: "shopping", th: "ซือของ", hint: "sɯ́ɯ-khɔ̌ɔŋ" },
                    { en: "travel/hang out", th: "ไปเทีeยว", hint: "bpai-thiâw" },
                    { en: "watch movie", th: "ดูหนัง", hint: "duu nǎŋ" },
                    { en: "can", th: "ได้", hint: "dâay" },
                    { en: "sit", th: "นัง", hint: "nâŋ" },
                    { en: "stand", th: "ยืน", hint: "yɯɯn" },
                    { en: "run", th: "วิง", hint: "wîŋ" },
                    { en: "swim", th: "ว่ายนํา", hint: "wâay-náam" },
                    { en: "do the laundry", th: "ซักผ้า", hint: "sák-phâa" },
                    { en: "wash the dishes", th: "ล้างจาน", hint: "láaŋ jaan" },
                    { en: "rest", th: "พักผ่อน", hint: "phák-phɔ̀ɔn" },
                    { en: "stroll", th: "เดินเล่น", hint: "dəən-lên" },
                    { en: "listen to music", th: "ฟังเพลง", hint: "faŋ pleeŋ" },
                    { en: "sing", th: "ร้องเพลง", hint: "rɔ́ɔŋ pleeŋ" },
                    { en: "will", th: "จะ", hint: "jà" },
                    { en: "-ing", th: "กําลัง", hint: "gam-laŋ" },
                    { en: "-ing", th: "อยู่", hint: "yùu" }
                ],
                "structure": [
                    { en: "How many?", th: "กี่" },
                    { en: "I have two dogs.", th: "ฉันมีหมา 2 ตัว" },
                    { en: "I have three bananas.", th: "ฉันมีกล้วย 3 ลูก" },
                    { en: "I have four books.", th: "ฉันมีหนังสือ 4 เล่ม" },
                    { en: "I have five friends.", th: "ฉันมีเพื่อน 5 คน" }
                ]
            },
            {
                "name": "How is Thai food? (Adjective/Adverb)",
                "vocabulary": [
                    { en: "small", th: "เล็ก", hint: "lék" },
                    { en: "big", th: "ใหญ่", hint: "yài" },
                    { en: "short (length)", th: "สัäน", hint: "sân" },
                    { en: "long", th: "ยาว", hint: "yaaw" },
                    { en: "short (height)", th: "เตีย", hint: "dtîa" },
                    { en: "tall (height)", th: "สูง", hint: "sǔuŋ" },
                    { en: "good", th: "ดี", hint: "dii" },
                    { en: "bad/terrible", th: "แย่", hint: "yɛ̂ɛ" },
                    { en: "hot", th: "ร้อน", hint: "rɔ́ɔn" },
                    { en: "cool/iced", th: "เย็น", hint: "yen" },
                    { en: "cold", th: "หนาว", hint: "nǎaw" },
                    { en: "cheap", th: "ถูก", hint: "thùuk" },
                    { en: "expensive", th: "แพง", hint: "phɛɛŋ" },
                    { en: "slow", th: "ช้า", hint: "cháa" },
                    { en: "fast", th: "เร็ว", hint: "rew" },
                    { en: "beautiful/pretty", th: "สวย", hint: "sǔay" },
                    { en: "handsome", th: "หล่อ", hint: "lɔ̀ɔ" },
                    { en: "not", th: "ไม่", hint: "mâi" },
                    { en: "delicious", th: "อร่อย", hint: "à-rɔ̀ɔy" },
                    { en: "fun/enjoyable", th: "สนุก", hint: "sà-nùk" },
                    { en: "hungry", th: "หิว", hint: "hǐw" },
                    { en: "full", th: "อิม", hint: "ìm" },
                    { en: "fat", th: "อ้วน", hint: "ûan" },
                    { en: "skinny", th: "ผอม", hint: "phɔ̌ɔm" },
                    { en: "tired", th: "เหนือย", hint: "nɯay" },
                    { en: "sleepy", th: "ง่วง", hint: "ŋûaŋ" },
                    { en: "difficult", th: "ยาก", hint: "yâak" },
                    { en: "easy", th: "ง่าย", hint: "ŋâay" },
                    { en: "clean", th: "สะอาด", hint: "sà-àat" },
                    { en: "dirty", th: "สกปรก", hint: "sòk-gà-bpròk" },
                    { en: "rich", th: "รวย", hint: "ruay" },
                    { en: "poor", th: "จน", hint: "jon" },
                    { en: "new", th: "ใหม่", hint: "mài" },
                    { en: "old", th: "เก่า/แก่", hint: "gàw/gɛ̀ɛ" },
                    { en: "how", th: "ยังไง", hint: "yaŋ-ŋai" },
                    { en: "shoes", th: "รองเท้า", hint: "rɔɔŋ-tháw" },
                    { en: "book", th: "หนังสือ", hint: "nǎŋ-sɯ̌ɯ" },
                    { en: "bathroom", th: "ห้องนําƒ", hint: "hɔ̂ɔŋ-náam" },
                    { en: "Bangkok", th: "กรุงเทพฯ", hint: "gruŋ-thêep" },
                    { en: "shirt", th: "เสือ", hint: "sɯ̂a" },
                    { en: "Thailand", th: "ประเทศไทย", hint: "bprà-thêet thai" },
                    { en: "and", th: "และ", hint: "lɛ́" },
                    { en: "but", th: "แต่", hint: "dtɛ̀ɛ" },
                    { en: "more than", th: "กว่า", hint: "gwàa" },
                    { en: "more than/rather than", th: "มากกว่า", hint: "mâak gwàa" },
                    { en: "than", th: "กว่า", hint: "gwàa" },
                    { en: "less than", th: "น้อยกว่า", hint: "nɔ́ɔy gwàa" },
                    { en: "the most", th: "ทีสุด", hint: "thîi-sùt" },
                    { en: "better", th: "ดีกว่า", hint: "dii gwàa" },
                    { en: "the best", th: "ดีที:สดุ", hint: "dii thîi-sùt" },
                    { en: "better", th: "เก่งกว่า", hint: "gèŋ gwàa" },
                    { en: "the best", th: "เก่งทีส", hint: "gèŋ thîi-sùt" },
                    { en: "less", th: "น้ อยกว่า", hint: "nɔ́ɔy gwàa" },
                    { en: "least", th: "น้อยทีสดุ", hint: "nɔ́ɔy thîi-sùt" },
                    { en: "more", th: "มากกว่า", hint: "mâak gwàa" },
                    { en: "the most", th: "มากทีสดุ", hint: "mâak thîi-sùt" }
                ],
                "structure": [
                    { en: 'I am going to the market.', th: 'ฉันกำลังจะไปตลาด' }
                ]
            },
            {
                "name": "Go shopping (numbers)",
                "vocabulary": [
                    { en: "one", th: "หนึง", hint: "nɯŋ" },
                    { en: "two", th: "สอง", hint: "sɔ̌ɔŋ" },
                    { en: "three", th: "สาม", hint: "sǎam" },
                    { en: "four", th: "สี", hint: "sìi" },
                    { en: "five", th: "ห้า", hint: "hâa" },
                    { en: "six", th: "หก", hint: "hòk" },
                    { en: "seven", th: "เจ็ด", hint: "jèt" },
                    { en: "eight", th: "แปด", hint: "bpɛ̀ɛt" },
                    { en: "nine", th: "เก้า", hint: "gâaw" },
                    { en: "ten", th: "สิบ", hint: "sìp" },
                    { en: "eleven", th: "สิบเอ็ด", hint: "sìp-èt" },
                    { en: "twelve", th: "สิบสอง", hint: "sìp-sɔ̌ɔŋ" },
                    { en: "thirteen", th: "สิบสาม", hint: "sìp-sǎam" },
                    { en: "fourteen", th: "สิบสี", hint: "sìp-sìi" },
                    { en: "fifteen", th: "สิบห้า", hint: "sìp-hâa" },
                    { en: "sixteen", th: "สิบหก", hint: "sìp-hòk" },
                    { en: "seventeen", th: "สิบเจ็ด", hint: "sìp-jèt" },
                    { en: "eighteen", th: "สิบแปด", hint: "sìp-bpɛ̀ɛt" },
                    { en: "nineteen", th: "สิบเก้า", hint: "sìp-gâaw" },
                    { en: "twenty", th: "ยี่สิบ", hint: "yîi-sìp" },
                    { en: "thirty", th: "สามสิบ", hint: "sǎam-sìp" },
                    { en: "forty", th: "สี่สิบ", hint: "sìi-sìp" },
                    { en: "fifty", th: "ห้าสิบ", hint: "hâa-sìp" },
                    { en: "sixty", th: "หกสิบ", hint: "hòk-sìp" },
                    { en: "seventy", th: "เจ็ดสิบ", hint: "jèt-sìp" },
                    { en: "eighty", th: "แปดสิบ", hint: "bpɛ̀ɛt-sìp" },
                    { en: "ninety", th: "เก้าสิบ", hint: "gâaw-sìp" },
                    { en: "one hundred", th: "หนึงร้อย", hint: "nɯŋ-rɔ́ɔy" },
                    { en: "one thousand", th: "หนึงพัน", hint: "nɯŋ-phan" },
                    { en: "ten thousand", th: "หมื่น", hint: "nɯŋ-mɯɯn" },
                    { en: "one hundred thousand", th: "หนึงแสน", hint: "nɯŋ-sɛ̌ɛn" },
                    { en: "one million", th: "หนึงล้าน", hint: "nɯŋ-láan" },
                    { en: "clothes", th: "เสือผ้า", hint: "sɯ̂a-phâa" },
                    { en: "shirt", th: "เสือ", hint: "sɯ̂a" },
                    { en: "T-shirt", th: "เสือยืด", hint: "sɯ̂a-yɯ̂ɯt" },
                    { en: "sweater", th: "เสือกันหนาว", hint: "sɯ̂a gan-nǎaw" },
                    { en: "pants/trousers", th: "กางเกง", hint: "gaaŋ-geeŋ" },
                    { en: "skirt", th: "กระโปรง", hint: "grà-bprooŋ" },
                    { en: "shoes", th: "รองเท้า", hint: "rɔɔŋ-tháaw" },
                    { en: "socks", th: "ถุงเท้า", hint: "thǔŋ-tháaw" },
                    { en: "glasses", th: "แว่นตา", hint: "wɛ̂ɛn-dtaa" },
                    { en: "hat", th: "หมวก", hint: "mùak" },
                    { en: "swimming suit", th: "ชุดว่ายนํา", hint: "chút wâay-náam" },
                    { en: "pajamas", th: "ชุดนอน", hint: "chút nɔɔn" },
                    { en: "exercise outfit", th: "ชุดออกกําลังกาย", hint: "chút ɔ̀ɔk-gam-laŋ-gaay" },
                    { en: "price", th: "ราคา", hint: "raa-khaa" },
                    { en: "discount", th: "ลด", hint: "lót" }
                ],
                "structure": [
                    { en: "How much is this?", th: "อันนี้ราคาเท่าไหร่" },
                    { en: "This is 100 baht.", th: "อันนี้ราคา 100 บาท" },
                    { en: "How much is this shirt?", th: "เสืออันนี้ราคาเท่าไหร่" },
                    { en: "This shirt is 200 baht.", th: "เสืออันนี้ราคา 200 บาท" }
                ]
            },
            {
                "name": "Where is the hospital? (places)",
                "vocabulary": [
                    { en: "house", th: "บ้าน", hint: "bâan" },
                    { en: "school", th: "โรงเรียน", hint: "rooŋ-rian" },
                    { en: "hotel", th: "โรงแรม", hint: "rooŋ-rɛɛm" },
                    { en: "hospital", th: "โรงพยาบาล", hint: "rooŋ-phá-yaa-baan" },
                    { en: "restaurant", th: "ร้านอาหาร", hint: "ráan aa-hǎan" },
                    { en: "coffee shop", th: "ร้านกาแฟ", hint: "ráan gaa-fɛɛ" },
                    { en: "train station", th: "สถานีรถไฟ", hint: "sà-thǎa-nii rót-fai" },
                    { en: "bus station", th: "สถานีขนส่ง", hint: "sà-thǎa-nii khǒn-sòng" },
                    { en: "plice station", th: "สถานีตํารวจ", hint: "s̀a-thǎa-nii dtam-rùat" },
                    { en: "airport", th: "สนามบิน", hint: "sà-nǎam bin" },
                    { en: "park", th: "สวน", hint: "sǔan" },
                    { en: "bank", th: "ธนาคาร", hint: "thá-naa-khaan" },
                    { en: "ATM", th: "ตู้เอทีเอ็ม", hint: "dtûu ee-thii-em" },
                    { en: "market", th: "ตลาด", hint: "dta-làat" },
                    { en: "department store", th: "ห้าง", hint: "hâaŋ" },
                    { en: "road/street", th: "ถนน", hint: "thà-nǒn" },
                    { en: "lane", th: "ซอย", hint: "sɔɔy" },
                    { en: "down town", th: "ตัวเมือง", hint: "dtua mɯaŋ" },
                    { en: "beach", th: "ชายหาด", hint: "chaay-hàat" },
                    { en: "sea", th: "ทะเล", hint: "thá-lee" },
                    { en: "temple", th: "วัด", hint: "wát" },
                    { en: "church", th: "โบสถ์", hint: "bòot" },
                    { en: "university", th: "มหาวิทยาลัย", hint: "má-hǎa-wit́-thá yaa- lai" },
                    { en: "mountain", th: "ภูเขา/ดอย", hint: "phuu-khǎw/dɔɔy" },
                    { en: "river", th: "แม่นํา", hint: "mɛ̂ɛ-náam" },
                    { en: "be (is/am/are)", th: "อยู่", hint: "yùu" },
                    { en: "where", th: "ที&ไหน", hint: "thîi-nǎi" },
                    { en: "close to", th: "ใกล้", hint: "glâi" },
                    { en: "near", th: "กับ", hint: "gàp" },
                    { en: "far", th: "ไกล", hint: "glai" },
                    { en: "next to", th: "ข้างๆ", hint: "khâaŋ-khâaŋ" },
                    { en: "next to", th: "ติด(กับ)", hint: "dtìt(gàp)" },
                    { en: "opposite to", th: "ตรงข้าม", hint: "dtroŋ-khâam" },
                    { en: "at", th: "ที&", hint: "thîi" },
                    { en: "in", th: "ใน", hint: "nai" },
                    { en: "arround (in the area)", th: "แถว", hint: "thɛ̌ɛw" },
                    { en: "in front of", th: "ข้างหน้า", hint: "khâaŋ-nâa" },
                    { en: "behind", th: "ข้างหลัง", hint: "khâaŋ-lǎŋ" },
                    { en: "here", th: "ที&นี&", hint: "thîi-nîi" },
                    { en: "there", th: "ที&นนั&", hint: "thîi-nân" },
                    { en: "over there", th: "ที&โน่น", hint: "thîi-nôon" },

                ],
                "structure": [
                    { en: "Where is the hospital?", th: "โรงพยาบาลอยู่ทีไหน" },
                    { en: "The hospital is over there.", th: "โรงพยาบาลอยู่ทีโน่น" },
                    { en: "The hospital is next to the school.", th: "โรงพยาบาลอยู่ติดกับโรงเรียน" },
                    { en: "The hospital is in front of the hotel.", th: "โรงพยาบาลอยู่ข้างหน้าโรงแรม" },
                    { en: "The hospital is behind the bank.", th: "โรงพยาบาลอยู่ข้างหลังธนาคาร" }
                ]
            }
        ]
    },
    {
        "title": "Book LS 2",
        "lessons": [
            {
                "name": "What would you like to order?",
                "vocabulary": [
                    { en: "rice", th: "ข้าว", hint: "khâaw" },
                    { en: "food", th: "อาหาร/กับข้าว", hint: "aa-hǎan/gàp-khâaw" },
                    { en: "curry", th: "แกง", hint: "gɛɛŋ" },
                    { en: "vegetables", th: "ผัก", hint: "phàk" },
                    { en: "egg", th: "ไข่", hint: "khài" },
                    { en: "tofu", th: "เต้าหู ้", hint: "dtâw-hûu" },
                    { en: "Chili", th: "พริก", hint: "phrík" },
                    { en: "meat/beef", th: "เนืNอ", hint: "nɯa" },
                    { en: "pork", th: "หมู", hint: "mǔu" },
                    { en: "chicken", th: "ไก่", hint: "gài" },
                    { en: "fish", th: "ปลา", hint: "bplaa" },
                    { en: "seafood", th: "(อาหาร)ทะเล", hint: "(aa hǎan) thá-lee" },
                    { en: "shrimp", th: "กุ้ง", hint: "gûŋ" },
                    { en: "squid", th: "ปลาหมึก", hint: "bplaa-mɯk" },
                    { en: "crab", th: "ปู", hint: "bpuu" },
                    { en: "shell", th: "หอย", hint: "hɔ̌ɔy" },
                    { en: "boil/boiled", th: "ต้ม", hint: "dtôm" },
                    { en: "stir fry/fried", th: "ผัด", hint: "phàt" },
                    { en: "deep fry/ deep fried", th: "ทอด", hint: "thɔ̂ɔt" },
                    { en: "steam/steamed", th: "นึงf", hint: "nɯ̂ŋ" },
                    { en: "grill/grilled", th: "ปิ", hint: "bpîŋ" },
                    { en: "gril/grilled", th: "ย่าง", hint: "yâaŋ" },
                    { en: "mild soup", th: "แกงจืด", hint: "gɛɛŋ-jɯɯt" },
                    { en: "spicy sour soup", th: "ต้ มยํา", hint: "dtôm-yam" },
                    { en: "spicy sour salad", th: "ยํา", hint: "yam" },
                    { en: "noodles", th: "ก๋วยเตีmยว", hint: "gǔay-dtǐaw" },
                    { en: "pad thai noodles", th: "ผัดไทย", hint: "phàt-thai" },
                    { en: "fried vegtables", th: "ผัดผัก", hint: "phàt-phàk" },
                    { en: "thai omelet", th: "ไข่เจียว", hint: "khài-jiaw" },
                    { en: "papaya salad", th: "ส้มตํา", hint: "sôm-dtam" },
                    { en: "green curry", th: "แกงเขียงหวาน", hint: "gɛɛŋ-khǐaw-wǎan" },
                    { en: "red curry", th: "แกงเผ็ด", hint: "gɛɛŋ-phèt" },
                    { en: "mango sticky rice", th: "ข้าวเหนียวมะม่วง", hint: "khâaw-nǐaw má-mûaŋ" },
                    { en: "taste/flavour", th: "รสชาติ", hint: "rót-châat" },
                    { en: "spicy", th: "เผ็ด", hint: "phèt" },
                    { en: "sweet", th: "หวาน", hint: "wǎan" },
                    { en: "sour", th: "เปรียNว", hint: "bprîaw" },
                    { en: "salty", th: "เค็ม", hint: "khem" },
                    { en: "bitter", th: "ขม", hint: "khǒm" },
                    { en: "tasteless/plain", th: "จืด", hint: "jɯɯt" },
                    { en: "order/eat", th: "สั9ง/กิน", hint: "sàŋ/gin" },
                    { en: "with/without", th: "ใส่/ไม่ใส่", hint: "sài/mâi sài" },
                    { en: "fermented fish", th: "ปลาร้า", hint: "bplaa-ráa" },
                    { en: "monosodium glutamate", th: "ผงชูรส", hint: "phǒŋ-chuu-rót" },
                    { en: "plate", th: "จาน", hint: "jaan" },
                    { en: "bowl", th: "ถ้วย/ชาม", hint: "thûay/chaam" },
                    { en: "Box/carton", th: "กล่อง", hint: "glɔ̀ɔŋ" },
                    { en: "plastic bag", th: "ถุง", hint: "thǔŋ" },
                    { en: "piece", th: "ชิ1น", hint: "chín" }

                ],
                "structure": [
                    { en: "I would like to order", th: "ฉันอยากสั่ง", hint: "chán yàak sàŋ" },
                    { en: "I would like to eat", th: "ฉันอยากกิน", hint: "chán yàak gin" },
                    { en: "I would like to drink", th: "ฉันอยากดื่ม", hint: "chán yàak dʉ̀ʉm" },
                    { en: "I would like to watch", th: "ฉันอยากดู", hint: "chán yàak duu" },
                    { en: "I would like to listen", th: "ฉันอยากฟัง", hint: "chán yàak faŋ" },
                    { en: "I would like to wake up", th: "ฉันอยากตื่น", hint: "chán yàak dtɯ̀ɯn" },
                    { en: "I would like to lie down/sleep", th: "ฉันอยากนอน", hint: "chán yàak nɔɔn" },
                    { en: "I would like to walk", th: "ฉันอยากเดิน", hint: "chán yàak dəən" },
                    { en: "I would like to speak", th: "ฉันอยากพูด", hint: "chán yàak phûut" },
                    { en: "I would like to study", th: "ฉันอยากเรียน", hint: "chán yàak rian" },
                    { en: "I would like to write", th: "ฉันอยากเขียน", hint: "chán yàak khǐan" },
                    { en: "I would like to read", th: "ฉันอยากอ่าน", hint: "chán yàak àan" },
                    { en: "I would like to take a shower", th: "(ฉัน) อยากอาบนํâา", hint: "(chán) yàak àap-náam" }
                ]
            },
            {
                "name": "What would you like to drink?",
                "vocabulary": [
                    { en: "water", th: "นํา", hint: "náam" },
                    { en: "plain water", th: "นําเปล่า", hint: "náam-bplàaw" },
                    { en: "ice", th: "นําแข็ง", hint: "náam-khɛ̌ ɛŋ" },
                    { en: "sugar", th: "นําตาล", hint: "náam-dtaan" },
                    { en: "coffee", th: "กาแฟ", hint: "gaa-fɛɛ" },
                    { en: "tea", th: "ชา", hint: "chaa" },
                    { en: "milk", th: "นม", hint: "nom" },
                    { en: "soda", th: "โซดา", hint: "soo-daa" },
                    { en: "fruit juice", th: "นําผลไม้", hint: "náam phǒn-lá-máay" },
                    { en: "fruit shake/smoothie", th: "นําผลไม้ปัfน", hint: "náam phǒn-lá-máay bpàn" },
                    { en: "soft drik", th: "นําอัดลม", hint: "náam àt-lom" },
                    { en: "beer", th: "เบียร์", hint: "bia" },
                    { en: "liquor", th: "เหล้า", hint: "lâw" },
                    { en: "wine", th: "ไวน์", hint: "waay" },
                    { en: "hot", th: "ร้อน", hint: "rɔ́ɔn" },
                    { en: "cold/iced", th: "เย็น", hint: "yen" },
                    { en: "glass/cup", th: "แก้ว", hint: "gɛ̂ɛw" },
                    { en: "cup", th: "ถ้วย", hint: "thûay" },
                    { en: "carton", th: "กล่อง", hint: "glɔ̀ɔŋ" },
                    { en: "can/tin", th: "กระป๋อง", hint: "grà-bpɔ̌ɔŋ" },
                    { en: "bottle", th: "ขวด", hint: "khùat" },
                    { en: "Orange juice", th: "นํNาส้ม", hint: "náam sôm" },
                    { en: "Lime juice", th: "นํNามะนาว", hint: "náam má-naaw" },
                    { en: "Pineapple juice", th: "นํNาสับปะรด", hint: "náam sàp-bpà-rót" },
                    { en: "Mango juice", th: "นํNามะม่วง", hint: "náam má-mûaŋ" },
                    { en: "Water melon juice", th: "นํNาแตงโม", hint: "náam dtɛɛŋ-moo" },
                    { en: "Grape juice", th: "นํNาองุน่", hint: "náam à-ŋùn" },
                    { en: "Coconut Water", th: "นํNามะพร้าว", hint: "náam má-phráaw" },
                    { en: "Passion fruit juice", th: "นํNาเสาวรส", hint: "náam sǎw-wá-rót" },
                    { en: "Vegetable juice", th: "นํNาผัก", hint: "náam phàk" }
                ],
                "structure": [
                    { en: "I would like to order", th: "ฉันอยากสั่ง", hint: "chán yàak sàŋ" },
                    { en: "I would like to eat", th: "ฉันอยากกิน", hint: "chán yàak gin" },
                    { en: "I would like to drink", th: "ฉันอยากดื่ม", hint: "chán yàak dʉ̀ʉm" },
                    { en: "I would like to watch", th: "ฉันอยากดู", hint: "chán yàak duu" },
                    { en: "I would like to listen", th: "ฉันอยากฟัง", hint: "chán yàak faŋ" },
                    { en: "I would like to wake up", th: "ฉันอยากตื่น", hint: "chán yàak dtɯ̀ɯn" },
                    { en: "I would like to lie down/sleep", th: "ฉันอยากนอน", hint: "chán yàak nɔɔn" },
                    { en: "I would like to walk", th: "ฉันอยากเดิน", hint: "chán yàak dəən" },
                    { en: "I would like to speak", th: "ฉันอยากพูด", hint: "chán yàak phûut" },
                    { en: "I would like to study", th: "ฉันอยากเรียน", hint: "chán yàak rian" },
                    { en: "I would like to write", th: "ฉันอยากเขียน", hint: "chán yàak khǐan" },
                    { en: "I would like to read", th: "ฉันอยากอ่าน", hint: "chán yàak àan" },
                    { en: "I would like to take a shower", th: "(ฉัน) อยากอาบนํâา", hint: "(chán) yàak àap-náam" }
                ]
            },
            {
                "name": "Fruits",
                "vocabulary": [
                    { en: "Fruits", th: "ผลไม้", hint: "phǒn-lá-máay" },
                    { en: "Mango", th: "มะม่วง", hint: "má-mûaŋ" },
                    { en: "Coconut", th: "มะพร้าว", hint: "má-phráaw" },
                    { en: "Watermelon", th: "แตงโม", hint: "dtɛɛng-moo" },
                    { en: "Banana", th: "กล้วย", hint: "glûay" },
                    { en: "Papaya", th: "มะละกอ", hint: "má-lá-gɔɔ" },
                    { en: "Pineapple", th: "สัปปะรด", hint: "sàp-bpà-rót" },
                    { en: "Durian", th: "ทุเรียน", hint: "thú-rian" },
                    { en: "Orange", th: "ส้ ม", hint: "sôm" },
                    { en: "Mangosteen", th: "มังคุด", hint: "maŋ-khút" },
                    { en: "Guava", th: "ฝรัfง", hint: "fà-ràŋ" },
                    { en: "Longan", th: "ลําไย", hint: "lam-yai" },
                    { en: "Strawberry", th: "สตรอเบอรีf", hint: "sà-dtrɔɔ-bəə-rîi" },
                    { en: "Rambutan", th: "เงาะ", hint: "ŋɔ́" },
                    { en: "Grapes", th: "องุน่", hint: "à-ŋùn" },
                    { en: "Passion friut", th: "เสาวรส", hint: "sǎw-wá-rót" },
                    { en: "Cherry", th: "เชอร์รีf", hint: "chəə-rîi" },
                    { en: "Lychee", th: "ลิNนจีf", hint: "lín-jìi" },
                    { en: "Dragon fruit", th: "แก้วมังกร", hint: "gɛ̂ ɛw-maŋ-gɔɔn" },
                    { en: "Jackfruit", th: "ขนุน", hint: "khà-nǔn" },
                    { en: "Ripe/Cooked", th: "สุก", hint: "sùk" },
                    { en: "Raw/Uncooked", th: "ดิบ", hint: "dìp" },
                    { en: "Fresh", th: "สด", hint: "sòt" },
                    { en: "Dry", th: "แห้ง", hint: "hɛ̂ɛŋ" },
                    { en: "Sweet", th: "หวาน", hint: "wǎan" },
                    { en: "Sour", th: "เปรียNว", hint: "bprîaw" },
                    { en: "Piece", th: "ชิNน", hint: "chín" },
                    { en: "Small", th: "เล็ก", hint: "lék" },
                    { en: "Plastic bag", th: "ถุง", hint: "tǔŋ" },
                    { en: "Rotten", th: "เน่า/เสีย", hint: "nâw/sǐa" },
                    { en: "Classifier for the whole fruit", th: "ลูก/ผล", hint: "lûuk / phǒn" }
                ],
                "structure": [
                    { en: "What fruit is this?", th: "ผลไม้อะไร", hint: "phǒn-lá-máy à-rai" },
                    { en: "This is a mango.", th: "นี่คือมะม่วง", hint: "nîi khɯɯ má-mûaŋ" },
                    { en: "This is a watermelon.", th: "นี่คือแตงโม", hint: "nîi khɯɯ dtɛɛng-moo" }
                ]
            },
            {
                "name": "colors",
                "vocabulary": [
                    { en: "Colour", th: "สี", hint: "sǐi" },
                    { en: "White", th: "สีขาว", hint: "" },
                    { en: "Black", th: "สีดํา", hint: "sǐi dam" },
                    { en: "Red", th: "สีแดง", hint: "sǐi dɛɛŋ" },
                    { en: "Yellow", th: "สีเหลือง", hint: "sǐi lɯ̌aŋ" },
                    { en: "Green", th: "สีเขียว", hint: "sǐi khǐaw" },
                    { en: "Dark Blue", th: "สีนํNาเงิน", hint: "sǐi náam-ŋəən" },
                    { en: "Sky blue", th: "สีฟา้", hint: "sǐi fáa" },
                    { en: "Orange", th: "สีส้ม", hint: "sǐi sôm" },
                    { en: "Grey", th: "สีเทา", hint: "sǐi thaw" },
                    { en: "Pink", th: "สีชมพู", hint: "sǐi chom-phuu" },
                    { en: "Purple", th: "สีมว่ง", hint: "sǐi mûaŋ" },
                    { en: "Brown", th: "สีนํNาตาล", hint: "sǐi náam-dtaan" },
                    { en: "Light(Adj)", th: "อ่อน", hint: "ɔ̀ɔn" },
                    { en: "Dark(Adj)", th: "เข้ม", hint: "khêm" }
                ],
                "structure": [
                    { en: "What color is this?", th: "สีอะไร", hint: "sǐi à-rai" },
                    { en: "This is red.", th: "สีแดง", hint: "sǐi dɛɛŋ" },
                    { en: "This is blue.", th: "สีน้ำเงิน", hint: "sǐi náam-ngən" },
                    { en: "This is green.", th: "สีเขียว", hint: "sǐi khǐaw" },
                    { en: "This is yellow.", th: "สีเหลือง", hint: "sǐi lǔang" }
                ]
            },
            {
                "name": "Classifiers",
                "vocabulary": [
                    { en: "Classifier", th: "ลักษณะนาม", hint: "lák-sà-nà-naam" },
                    { en: "People", th: "คน", hint: "khon" },
                    { en: "Animals", th: "สัตว์", hint: "sàt" },
                    { en: "Flat objects", th: "แผ่น/ใบ", hint: "phɛ̀n/bai" },
                    { en: "Long objects", th: "อัน/ชิNน", hint: "an/chín" },
                    { en: "Round objects", th: "ลูก/ผล", hint: "lûuk/phǒn" },
                    { en: "Bottles/Cups/Glasses", th: "ขวด/แก้ว/ถ้วย", hint: "khùat/gɛ̂ɛw/thûay" },
                    { en: "Books/Magazines/Newspapers", th: "เล่ม/ฉบับ/ฉบับพิมพ์", hint: "" }
                ],
                "structure": [
                    { en: "How many people?", th: "คนกี่คน", hint: "khon gìi khon" },
                    { en: "How many animals?", th: "สัตว์กี่ตัว", hint: "sàt gìi dtua" },
                    { en: "How many flat objects?", th: "แผ่น/ใบกี่แผ่น/ใบ", hint: "phɛ̀n/bai gìi phɛ̀n/bai" },
                    { en: "How many long objects?", th: "อัน/ชิNนกี่อัน/ชิNน", hint: "an/chín gìi an/chín" },
                    { en: "How many round objects?", th: "ลูก/ผลกี่ลูก/ผล", hint: "lûuk/phǒn gìi lûuk/phǒn" }
                ]
            },
            {
                "name": "Preposition",
                "vocabulary": [
                    { en: "There is/There are", th: "มี", hint: "mii" },
                    { en: "On", th: "บน", hint: "bon" },
                    { en: "Under", th: "ใต้", hint: "On" },
                    { en: "Outside", th: "ข้างนอก", hint: "khâaŋ-nɔ̂ɔk" },
                    { en: "Inside", th: "ข้างใน", hint: "khâaŋ-nai" },
                    { en: "Between", th: "ระหว่าง", hint: "rá-wàaŋ" },
                    { en: "At", th: "ทีf", hint: "thîi" },
                    { en: "in front of", th: "ข้างหน้า", hint: "khâaŋ-nâa" },
                    { en: "behind", th: "ข้างหลัง", hint: "khâaŋ-lǎŋ" },
                    { en: "next to", th: "ติดกับ", hint: "dtìt-kàp" },
                    { en: "opposite to", th: "ตรงข้าม", hint: "dtrong-khâam" },
                    { en: "nearby/close to", th: "ใกล้ๆ", hint: "glâi-glâi" }
                ],
                "structure": [
                    { en: "Where is the hospital?", th: "โรงพยาบาลอยู่ทีไหน", hint: "rooŋ-phá-yaa-bâan yùu thîi nǎi" },
                    { en: "The hospital is over there.", th: "โรงพยาบาลอยู่ทีโน่น", hint: "rooŋ-phá-yaa-bâan yùu thîi nôon" },
                    { en: "The hospital is next to the school.", th: "โรงพยาบาลอยู่ติดกับโรงเรียน", hint: "rooŋ-phá-yaa-bâan yùu dtìt-kàp rooŋ-rian" },
                    { en: "The hospital is in front of the hotel.", th: "โรงพยาบาลอยู่ข้างหน้าโรงแรม", hint: "rooŋ-phá-yaa-bâan yùu khâaŋ-nâa rooŋ-rɛɛm" },
                    { en: "The hospital is behind the bank.", th: "โรงพยาบาลอยู่ข้างหลังธนาคาร", hint: "rooŋ-phá-yaa-bâan yùu khâaŋ-lǎŋ tha-naa-khâan" }
                ]
            }
        ]
    },
    {
        "title": "Book LS 3",
        "lessons": [
            {
                "name": "Time",
                "vocabulary": [
                    { en: "In the morning", th: "ตอนเช้า", hint: "dtɔɔn cháaw" },
                    { en: "In the late morning", th: "ตอนสาย", hint: "dtɔɔn sǎay" },
                    { en: "At noon", th: "ตอนเที9ยง", hint: "dtɔɔn thîaŋ" },
                    { en: "In the afternoon", th: "ตอนบ่าย", hint: "dtɔɔn bàay" },
                    { en: "In the evening (before dark)", th: "ตอนเย็น", hint: "dtɔɔn yen" },
                    { en: "In the evening (after dark)", th: "ตอนคํ9า", hint: "dtɔɔn khâm" },
                    { en: "In the day time", th: "ตอนกลางวัน", hint: "dtɔɔn glaaŋ-wan" },
                    { en: "In the night time", th: "ตอนกลางคืน", hint: "dtɔɔn glaaŋ-khɯɯn" },
                    { en: "Time", th: "เวลา", hint: "wee-laa" },
                    { en: "Clock/Watch/O’clock", th: "นาฬิกา", hint: "naa-lí-gaa" },
                    { en: "O'clock(6.00 AM-6.59PM)", th: "โมง", hint: "mooŋ" },
                    { en: "O'clock(7.00PM-11.59PM)", th: "ทุม", hint: "thûm" },
                    { en: "O'clock(1.00AM-5.59AM)", th: "ตี", hint: "dtii" },
                    { en: "About/Approximately", th: "ประมาณ", hint: "bprà-maan" },
                    { en: "Sharp", th: "ตรง", hint: "dtroŋ" },
                    { en: "Hour", th: "ชัวโมง", hint: "chûa-mooŋ" },
                    { en: "Minute", th: "นาที", hint: "naa-thii" },
                    { en: "Second", th: "วินาที", hint: "wí-naa-thii!" },
                    { en: "Half", th: "ครึ9ง", hint: "khrɯ̂ŋ" },
                    { en: "Long", th: "นาน", hint: "naan" },
                    { en: "Early", th: "เช้า", hint: "cháaw" },
                    { en: "Late", th: "สาย", hint: "sǎay" },
                    { en: "Before", th: "ก่อน", hint: "gɔ̀ɔn" },
                    { en: "After", th: "หลัง", hint: "lǎŋ" },
                    { en: "Wait for a minute", th: "รอแป๊ปนึง", hint: "rɔɔ bpɛ́ɛp-nʉng" },
                    { en: "Now", th: "ตอนนี", hint: "dtɔɔn-níi" },
                    { en: "Right now", th: "เดีƒยวนี", hint: "dǐaw-níi" },
                    { en: "Time", th: "เวลา", hint: "wee-laa" },
                    { en: "Hour", th: "ชั่วโมง", hint: "chûa-mɔ́ŋ" },
                    { en: "Minute", th: "นาที", hint: "naa-thii" },
                    { en: "Second", th: "วินาที", hint: "wí-naa-thii" },
                    { en: "Day", th: "วัน", hint: "wan" },
                    { en: "Week", th: "สัปดาห์", hint: "sàp-daa" },
                    { en: "Month", th: "เดือน", hint: "dʉʉan" },
                    { en: "Year", th: "ปี", hint: "pii" },
                    { en: "Today", th: "(วันนี้)", hint: "(wan-níi)" },
                    { en: "Tomorrow", th: "(พรุ่งนี้)", hint: "(phrûng-níi)" },
                    { en: "Yesterday", th: "(เมื่อวานนี้)", hint: "(mʉ̂a-wan-níi)" }
                ],
                structure:
                    [
                        { en: "What time is it?", th: "กี่โมง", hint: "gìi mooŋ" },
                        { en: "It is 8 o'clock", th: "แปดโมง", hint: "bpɛ̀ɛt mooŋ" },
                        { en: "It is 8.30", th: "แปดโมงครึ9ง", hint: "bpɛ̀ɛt mooŋ khrɯ̂ŋ" },
                        { en: "It is 8.45", th: "แปดโมงสี่สิบห้า", hint: "bpɛ̀ɛt mooŋ sìi-sìp-hâa" },
                        { en: "It is 8.50", th: "แปดโมงห้าสิบ", hint: "bpɛ̀ɛt mooŋ hâa-sìp" },
                        { en: "It is 8.55", th: "แปดโมงห้าสิบห้า", hint: "bpɛ̀ɛt mooŋ hâa-sìp-hâa" },
                        { en: "It is 9 o'clock", th: "เก้าโมง", hint: "gâo mooŋ" },
                        { en: "It is 9.15", th: "เก้าโมงสิบห้า", hint: "gâo mooŋ sìp-hâa" },
                        { en: "It is 9.30", th: "เก้าโมงครึ9ง", hint: "gâo mooŋ khrɯ̂ŋ" },
                        { en: "It is 9.45", th: "เก้าโมงสี่สิบห้า", hint: "gâo mooŋ sìi-sìp-hâa" },
                        { en: "It is 10 o'clock", th: "สิบโมง", hint: "sìp mooŋ" }
                    ]
            },
            {
                "name": "Days",
                "vocabulary": [
                    { en: "Monday", th: "วันจันทร์", hint: "wan-jan" },
                    { en: "Tuesday", th: "วันอังคาร", hint: "wan aŋ-khaan" },
                    { en: "Wednesday", th: "วันพุธ", hint: "wan-phút" },
                    { en: "Thursday", th: "วันพฤหัสบดี", hint: "wan phá-rɯ-hàt" },
                    { en: "Friday", th: "วันศุกร์", hint: "wan-sùk" },
                    { en: "Saturday", th: "วันเสาร์", hint: "wan-sǎw" },
                    { en: "Sunday", th: "วันอาทิตย์", hint: "wan aa-thít" },
                    { en: "Weekend", th: "วันเสาร์อาทิตย์", hint: "wan-sǎw aa-thít" },
                    { en: "Day", th: "วัน", hint: "wan" },
                    { en: "Date", th: "วันที9", hint: "wan-thiî" },
                    { en: "Today", th: "วันนี", hint: "wan-níi" },
                    { en: "Tomorrow", th: "วันพรุ่งนี", hint: "wan phrûŋ-níi" },
                    { en: "Yesterday", th: "เมื9อวานนี", hint: "mɯ̂a-waan-níi" },
                    { en: "The day after tomorrow", th: "วันมะรืนนี", hint: "wan má-rɯɯn-níi" },
                    { en: "The day before yesterday", th: "(เมื9อ)วานซืน", hint: "(mɯ̂a)-waan-sɯɯn" },
                    { en: "Holiday", th: "วันหยุด", hint: "wan-yùt" },
                    { en: "Birthday", th: "วันเกิด", hint: "wan-gə̀ət" },
                    { en: "Weekdays", th: "วันธรรมดา", hint: "wan tham-má-daa" },
                    { en: "Every", th: "ทุก", hint: "thúk" },
                    { en: "All/Throughout", th: "ทังy", hint: "tháŋ" },
                    { en: "Day", th: "วัน", hint: "Wan" },
                    { en: "Week", th: "อาทิตย์", hint: "aa-thít" },
                    { en: "Month", th: "เดือน", hint: "dɯan" },
                    { en: "year", th: "ปี", hint: "bpii" }
                ],
                structure:
                    [
                        { en: "What day is it today?", th: "วันนี้วันอะไร", hint: "wan-níi wan à-rai" },
                        { en: "Today is Monday", th: "วันนี้วันจันทร์", hint: "wan-níi wan-jan" },
                        { en: "Today is Tuesday", th: "วันนี้วันอังคาร", hint: "wan-níi wan aŋ-khaan" },
                        { en: "Today is Wednesday", th: "วันนี้วันพุธ", hint: "wan-níi wan-phút" },
                        { en: "Today is Thursday", th: "วันนี้วันพฤหัสบดี", hint: "wan-níi wan phá-rɯ-hàt" },
                        { en: "Today is Friday", th: "วันนี้วันศุกร์", hint: "wan-níi wan-sùk" },
                        { en: "Today is Saturday", th: "วันนี้วันเสาร์", hint: "wan-níi wan-sǎw" },
                        { en: "Today is Sunday", th: "วันนี้วันอาทิตย์", hint: "wan-níi wan aa-thít" }
                    ]
            },
            {
                "name": "Months/year/seasons",
                "vocabulary": [
                    { en: "Month", th: "เดือน", hint: "dɯan" },
                    { en: "January", th: "มกราคม", hint: "mók-gà-raa-khom" },
                    { en: "February", th: "กุมภาพันธ์", hint: "gum-phaa-phan" },
                    { en: "March", th: "มีนาคม", hint: "mii-naa-khom" },
                    { en: "April", th: "เมษายน", hint: "mee-sǎa-yon" },
                    { en: "May", th: "พฤษภาคม", hint: "phrɯt-sà-phaa-khom" },
                    { en: "June", th: "มิถนายน", hint: "mii-naa-khom" },
                    { en: "July", th: "กรกฎาคม", hint: "gà-rá-gà-daa-khom" },
                    { en: "August", th: "สิงหาคม", hint: "sǐŋ-hǎa-khom" },
                    { en: "September", th: "กันยายน", hint: "gan-yaa-yon" },
                    { en: "October", th: "ตุลาคม", hint: "dtù-laa-khom" },
                    { en: "November", th: "พฤศจิกายน", hint: "phrɯt-sà-jì-gaa-yon" },
                    { en: "December", th: "ธันวาคม", hint: "than-waa-khom" },
                    { en: "Year", th: "ปี", hint: "bpii" },
                    { en: "C.E.", th: "ปี ค.ศ", hint: "bpii khɔɔ-sɔ̌ɔ" },
                    { en: "B.E.", th: "ปี พ.ศ.", hint: "bpii phɔɔ-sɔ̌ɔ" },
                    { en: "A.D.", th: "ปี ค.ศ", hint: "bpii khɔɔ-sɔ̌ɔ" },
                    { en: "B.C.", th: "ปีก่อนคริสต์ศักราช", hint: "bpii kɔ̀ɔn khrit-sàk-kà-râat" },
                    { en: "Season", th: "ฤดู", hint: "rɯ́-duu" },
                    { en: "Summer", th: "ฤดูร้อน", hint: "rɯ́-duu rɔ́ɔn" },
                    { en: "Rainy season", th: "ฤดูฝน", hint: "rɯ́-duu fǒn" },
                    { en: "Winter", th: "ฤดูหนาว", hint: "rɯ́-duu nǎao" },
                    { en: "Spring", th: "ฤดูใบไม้ผลิ", hint: "rɯ́-duu bai-mái phlì" },
                    { en: "Autumn", th: "ฤดูใบไม้ร่วง", hint: "rɯ́-duu bai-mái rûaŋ" },
                    { en: "Weather", th: "อากาศ", hint: "aa-kàat" },
                    { en: "Hot", th: "ร้อน", hint: "rɔ́ɔn" },
                    { en: "Cold", th: "หนาว", hint: "nǎao" },
                    { en: "Cool", th: "เย็น", hint: "yen" },
                    { en: "Windy", th: "มีลม", hint: "" },
                    { en: "Rainy", th: "มีฝน", hint: "" },
                    { en: "Sunny", th: "มีแดด", hint: "" },
                    { en: "Cloudy", th: "มีเมฆ", hint: "" },
                    { en: "Foggy", th: "มีหมอก", hint: "" },
                    { en: "Snowy", th: "มีหิมะตก", hint: "" }
                ],
                structure:
                    [
                        { en: "What month is it?", th: "เดือนอะไร", hint: "dʉʉan à-rai" },
                        { en: "It is January", th: "เดือนมกราคม", hint: "dʉʉan mók-ka-ra-khom" },
                        { en: "It is February", th: "เดือนกุมภาพันธ์", hint: "dʉʉan kum-phaa-phan" },
                        { en: "It is March", th: "เดือนมีนาคม", hint: "dʉʉan mii-naa-khom" },
                        { en: "It is April", th: "เดือนเมษายน", hint: "dʉʉan mɛ̂ɛ-sǎa-yon" },
                        { en: "It is May", th: "เดือนพฤษภาคม", hint: "dʉʉan phrɯ́t-sà-phaa-khom" },
                        { en: "It is June", th: "เดือนมิถุนายน", hint: "dʉʉan mii-thu-naa-yon" },
                        { en: "It is July", th: "เดือนกรกฎาคม", hint: "dʉʉan gà-rá-gà-daa-khom" },
                        { en: "It is August", th: "เดือนสิงหาคม", hint: "dʉʉan sǐŋ-hǎa-khom" },
                        { en: "What is the weather like?", th: "(วันนี้)อากาศเป็นยังไงบ้าง?", hint: "(wan-níi) aa-kàat bpen yaŋ-ngai bâaŋ?" },
                        { en: "(Today) is hot.", th: "(วันนี้)ร้อน.", hint: "(wan-níi) rɔ́ɔn." },
                        { en: "(Today) is cold.", th: "(วันนี้)หนาว.", hint: "(wan-níi) nǎao." },
                        { en: "(Today) is cool.", th: "(วันนี้)เย็น.", hint: "(wan-níi) yen." },
                        { en: "(Today) is windy.", th: "(วันนี้)มีลม.", hint: "(wan-níi) mii lɔm." },
                        { en: "(Today) is rainy.", th: "(วันนี้)มีฝน.", hint: "(wan-níi) mii fǒn." },
                        { en: "(Today) is sunny.", th: "(วันนี้)มีแดด.", hint: "(wan-níi) mii dɛ̀ɛt." },
                        { en: "(Today) is cloudy.", th: "(วันนี้)มีเมฆ.", hint: "(wan-níi) mii mɛ̂ɛk." },
                        { en: "(Today) is foggy.", th: "(วันนี้)มีหมอก.", hint: "(wan-níi) mii mɔ̀ɔk." },
                        { en: "(Today) is snowy.", th: "(วันนี้)มีหิมะตก.", hint: "(wan-níi) mii hìmá dtòk." }
                    ]
            },
            {
                "name": "Family",
                "vocabulary": [
                    { en: "Family ", th: "ครอบครัว", hint: "khrɔ́ɔp-khrua" },
                    { en: "Father", th: "พ่อ", hint: "phɔ̂ɔ" },
                    { en: "Mother", th: "แม่", hint: "mɛ̂ɛ" },
                    { en: "A person who is older than you", th: "พี9", hint: "phîi" },
                    { en: "A person who is younger than you", th: "น้ อง", hint: "nɔ́ɔŋ" },
                    { en: "Sibling", th: "พี9น้อง", hint: "phîi-nɔ́ɔŋ" },
                    { en: "Older sister", th: "พี9สาว", hint: "phîi-sǎaw" },
                    { en: "Younger sister", th: "น้ องสาว", hint: "nɔ́ɔŋ-sǎaw" },
                    { en: "Older brother", th: "พี9ชาย", hint: "phîi-chaay" },
                    { en: "Younger brother", th: "น้องชาย", hint: "nɔ́ɔŋ-chaay" },
                    { en: "Child", th: "ลูก", hint: "lûuk" },
                    { en: "Daughter", th: "ลูกสาว", hint: "lûuk-sǎaw" },
                    { en: "Son", th: "ลูกชาย", hint: "lûuk-chaay" },
                    { en: "Niece/Grand daughter", th: "หลานสาว", hint: "lǎan-sǎaw" },
                    { en: "Nephew/Grand son", th: "หลานชาย", hint: "lǎan-chaay" },
                    { en: "Grandfather", th: "ปู ่/ตา", hint: "bpùu/dtaa" },
                    { en: "Grandmother", th: "ย่า/ยาย", hint: "yâa/yaay" },
                    { en: "Uncle", th: "ลุง", hint: "luŋ" },
                    { en: "Aunt", th: "ป้า", hint: "bpâa" },
                    { en: "Aunt/Uncle (younger)", th: "น้า", hint: "náa" },
                    { en: "Aunt/Uncle (older)", th: "อา", hint: "aa" },
                    { en: "Husband", th: "สามี", hint: "sǎa-mii" },
                    { en: "Wife", th: "ภรรยา", hint: "Phan-rá-yaa" },
                    { en: "Boyfriend/Girlfriend", th: "แฟน", hint: "fɛɛn" },
                    { en: "Relatives", th: "ญาติ", hint: "yâat" },
                    { en: "Cousin", th: "ลูกพี่ลูกน้อง", hint: "lûuk-phîi-lûuk-nɔ́ɔŋ" }
                ],
                structure:
                    [
                        { en: "Who is this?", th: "นีใคร", hint: "nîi khrai" },
                        { en: "This is my father", th: "นีพ่อของฉัน", hint: "nîi phɔ̂ɔ khɔ̌ŋ chǎn" },
                        { en: "This is my mother", th: "นีแม่ของฉัน", hint: "nîi mɛ̂ɛ khɔ̌ŋ chǎn" },
                        { en: "This is my brother", th: "นีน้องชายของฉัน", hint: "nîi nɔ́ɔŋ-chaay khɔ̌ŋ chǎn" },
                        { en: "This is my sister", th: "นีน้องสาวของฉัน", hint: "nîi nɔ́ɔŋ-sǎaw khɔ̌ŋ chǎn" },
                        { en: "This is my son", th: "นีลูกชายของฉัน", hint: "nîi lûuk-chaay khɔ̌ŋ chǎn" },
                        { en: "This is my daughter", th: "นีลูกสาวของฉัน", hint: "nîi lûuk-sǎaw khɔ̌ŋ chǎn" },
                        { en: "This is my uncle", th: "นีน้าของฉัน", hint: "nîi nâa khɔ̌ŋ chǎn" },
                        { en: "This is my aunt", th: "นีน้าของฉัน", hint: "nîi nâa khɔ̌ŋ chǎn" }
                    ]
            },
            {
                "name": "Occupation",
                "vocabulary": [
                    { en: "Work/Job", th: "งาน", hint: "ŋaan" },
                    { en: "To work", th: "ทํางาน", hint: "tham-ŋaan" },
                    { en: "Student", th: "นักเรียน", hint: "nák-rian" },
                    { en: "Business person", th: "นักธุรกิจ", hint: "nák thú-rá-gìt" },
                    { en: "Musician", th: "นักดนตรี", hint: "nák don-dtrii" },
                    { en: "Writer", th: "นักเขียน", hint: "nák-khǐan" },
                    { en: "Teacher", th: "ครู", hint: "khruu" },
                    { en: "Doctor", th: "หมอ", hint: "mɔ̌ɔ" },
                    { en: "Dentist", th: "หมอฟัน", hint: "mɔ̌ɔ-fan" },
                    { en: "Nurse", th: "พยาบาล", hint: "phá-yaa-baan" },
                    { en: "Police", th: "ตํารวจ", hint: "dtam-rùat" },
                    { en: "Soldier", th: "ทหาร", hint: "thá-hǎan" },
                    { en: "Engineer", th: "วิศวกร", hint: "wít-sà-wá-gɔɔn" },
                    { en: "Pharmacist", th: "เภสั ", hint: "phee-sàt-chàt-gɔɔn" },
                    { en: "Vendor", th: "พ่อค้า/แม่ค้า", hint: "phɔ̂ɔ-kháa/mɛ̂ɛ-kháa" },
                    { en: "Staff/Worker", th: "พนักงาน", hint: "phá-nák ŋaan" },
                    { en: "Freelancer", th: "ฟรีแลนซ์", hint: "frii-lɛ́ɛn" },
                    { en: "Maid / Housewife", th: "แม่บ้าน", hint: "mɛ̂ɛ bâan" },
                    { en: "Security guard", th: "ยาม", hint: "yaam" },
                    { en: "Technician", th: "ช่าง", hint: "châaŋ" }
                ],
                structure:
                    [
                        { en: "What is your job?", th: "คุณทํางานอะไร", hint: "khun tham-ŋaan à-rai" },
                        { en: "I am a student", th: "ฉันเป็นนักเรียน", hint: "chǎn bpen nák-rian" },
                        { en: "I am a teacher", th: "ฉันเป็นครู", hint: "chǎn bpen khruu" },
                        { en: "I am a doctor", th: "ฉันเป็นหมอ", hint: "chǎn bpen mɔ̌ɔ" }
                    ]
            },
            {
                "name": "What does he/she loo like?",
                "vocabulary": [
                    { en: "Eyes", th: "ตา", hint: "dtaa" },
                    { en: "Mouth", th: "ปาก", hint: "bpàak" },
                    { en: "Skin", th: "ผิว", hint: "phǐw" },
                    { en: "Hair", th: "ผม", hint: "phǒm" },
                    { en: "Nose", th: "จมูก", hint: "Jà-mùuk" },
                    { en: "Eyebrows", th: "คิyว", hint: "khíw" },
                    { en: "Face", th: "หน้า", hint: "nâa" },
                    { en: "Face", th: "หน้าตา", hint: "nâa-dtaa" },
                    { en: "Shape", th: "รูปร่าง", hint: "rûup-râaŋ" },
                    { en: "Height", th: "ส่วนสูง", hint: "Sùan-sǔuŋ" },
                    { en: "Weight", th: "นํyาหนัก", hint: "Náam-nàk" }
                ],
                structure:
                    [
                        { en: "What does he/she look like?", th: "เขาหน้าตาเป็นยังไง", hint: "khǎo nâa-dtaa bpen yaŋ-ngai" },
                        { en: "He/She is tall", th: "เขาสูง", hint: "khǎo sǔuŋ" },
                        { en: "He/She is short", th: "เขาสั้น", hint: "khǎo sâŋ" },
                        { en: "He/She is fat", th: "เขาอ้วน", hint: "khǎo ûan" },
                        { en: "He/She is thin", th: "เขาผอม", hint: "khǎo phɔ̌ɔm" },
                        { en: "He/She is beautiful", th: "เขาสวย", hint: "khǎo sǔay" },
                        { en: "He/She is handsome", th: "เขาหล่อ", hint: "khǎo lɔ̀ɔ" }
                    ]
            }
        ]
    },
    {
        "title": "Book RW 1",
        "lessons": [
            {
                "name": "Low class consonants",
                "vocabulary": [
                    { en: "offering tray", th: "พ", hint: "phɔɔ phaan (LC ภ phɔɔ sam-phaw)" },
                    { en: "tooth", th: "ฟ", hint: "fɔɔ fan (LC)" },
                    { en: "soldier", th: "ท", hint: "thɔɔ tha-haan (LC ธ thɔɔ thoŋ, ฑ thɔɔ mon-thoo, ฒ thɔɔ phuu-thaw)" },
                    { en: "buffalow", th: "ค", hint: "khɔɔ khwaay (LC ฆ khɔɔ ra-khaŋ)" },
                    { en: "chain", th: "ซ", hint: "sɔɔ soo (LC)" },
                    { en: "owl", th: "ฮ", hint: "hɔɔ nok-huuk (LC)" },
                    { en: "elephant", th: "ช", hint: "chɔɔ chaaŋ (LC ฌ chɔɔ chəə)" },
                    { en: "snake", th: "ง", hint: "ŋɔɔ ŋuu (LC)" },
                    { en: "giant", th: "ย", hint: "yɔɔ yak (LC ญ yɔɔ phuu-yiŋ)" },
                    { en: "mouse", th: "น", hint: "nɔɔ nuu (LC ณ nɔɔ neen)" },
                    { en: "boat", th: "ร", hint: "rɔɔ rwa (LC)" },
                    { en: "ring", th: "ว", hint: "wɔɔ wεεn (LC)" },
                    { en: "horse", th: "ม", hint: "mɔɔ maa (LC)" },
                    { en: "monkey", th: "ล", hint: "lɔɔ liŋ (LC ฬ lɔɔ ju-laa)" },
                    { en: "sailing boat", th: "ภ", hint: "phɔɔ sam-phaw (LC uncommon)" },
                    { en: "flag", th: "ธ", hint: "thɔɔ thoŋ (LC uncommon)" },
                    { en: "Lady Montho", th: "ฑ", hint: "thɔɔ mon-thoo (LC uncommon)" },
                    { en: "elderly", th: "ฒ", hint: "thɔɔ phuu-thaw (LC uncommon)" },
                    { en: "bell", th: "ฆ", hint: "khɔɔ ra-khaŋ (LC uncommon)" },
                    { en: "name of a tree", th: "ฌ", hint: "chɔɔ chəə (LC uncommon)" },
                    { en: "female", th: "ญ", hint: "yɔɔ phuu-yiŋ (LC uncommon)" },
                    { en: "novice", th: "ณ", hint: "nɔɔ neen (LC uncommon)" },
                    { en: "kite", th: "ฬ", hint: "lɔɔ ju-laa (LC uncommon)" }
                ],
                structure:
                    [
                        { en: "What is this?", th: "นีอะไร", hint: "nîi à-rai" },
                        { en: "This is a low class consonant", th: "นีเป็นพยัญชนะต่ำ", hint: "nîi bpen phá-yan-chá-ná tàm" }
                    ]
            },
            {
                "name": "Middle class consonants",
                "vocabulary": [
                    { word_en: "gɔɔ gai", word_th: "ก", hint: "chicken (MC)" },
                    { word_en: "jɔɔ jaan", word_th: "จ", hint: "plate (MC)" },
                    { word_en: "dɔɔ dek", word_th: "ด", hint: "child (MC ฎ dɔɔ cha-daa )" },
                    { word_en: "dtɔɔ dtaw", word_th: "ต", hint: "turtle (MC ฏ dtɔɔ bpa-dtak)" },
                    { word_en: "bɔɔ bai-maay", word_th: "บ", hint: "leaf (MC)" },
                    { word_en: "bpɔɔ bplaa", word_th: "ป", hint: "fish (MC)" },
                    { word_en: "ɔɔ aaŋ", word_th: "อ", hint: "basin (MC)" },
                    { word_en: "dɔɔ cha-daa", word_th: "ฎ", hint: "head dress (MC uncommon)" },
                    { word_en: "dtɔɔ bpa-dtak", word_th: "ฏ", hint: "lance (MC uncommon)" }
                ],
                structure:
                    [
                        { en: "What is this?", th: "นีอะไร", hint: "nîi à-rai" },
                        { en: "This is a high class consonant", th: "นีเป็นพยัญชนะสูง", hint: "nîi bpen phá-yan-chá-ná sǔuŋ" }
                    ]
            },
            {
                "name": "High class consonants",
                "vocabulary": [
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
                ],
                structure:
                    [
                        { en: "What is this?", th: "นีอะไร", hint: "nîi à-rai" },
                        { en: "This is a high class consonant", th: "นีเป็นพยัญชนะสูง", hint: "nîi bpen phá-yan-chá-ná sǔuŋ" }
                    ]
            },
            {
                "name": "Vowels",
                "vocabulary": [
                    { word_en: "", word_th: "-ะ", hint: "a SV" },
                    { word_en: "", word_th: "-า", hint: "aa LV" },
                    { word_en: "", word_th: "-ิ", hint: "i SV" },
                    { word_en: "", word_th: "-ี", hint: "ii LV" },
                    { word_en: "", word_th: "-ึ", hint: "w SV" },
                    { word_en: "", word_th: "-ือ", hint: "ww LV" },
                    { word_en: "", word_th: "-ุ", hint: "u SV" },
                    { word_en: "", word_th: "-ู", hint: "uu LV" },
                    { word_en: "", word_th: "เ-", hint: "ee LV" },
                    { word_en: "", word_th: "เเ-", hint: "εε LV" },
                    { word_en: "", word_th: "โ-", hint: "oo LV" },
                    { word_en: "", word_th: "-อ", hint: "ɔɔ LV" },
                    { word_en: "", word_th: "เ-อ", hint: "əə LV" },
                    { word_en: "", word_th: "เ-ีย", hint: "ia LV" },
                    { word_en: "", word_th: "เ-ือ", hint: "wa LV" },
                    { word_en: "", word_th: "-ัว", hint: "ua LV" },
                    { word_en: "", word_th: "-ำ", hint: "am LV" },
                    { word_en: "", word_th: "ไ ใ", hint: "ai LV" },
                    { word_en: "", word_th: "เ-า", hint: "aw LV" }
                ],
                structure:
                    [
                        { en: "What is this?", th: "นีอะไร", hint: "nîi à-rai" },
                        { en: "This is a vowel", th: "นีเป็นสระ", hint: "nîi bpen sà-rà" }
                    ]
            }
        ]
    }
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
        bookItem.classList.add('bookItem');
        //        bookItem.open = true; // Set to true if you want the book details to be open by default
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

