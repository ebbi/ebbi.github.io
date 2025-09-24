// This script handles the display of book details and audio playback for a language learning application.
const books = [
    {
        "title": "Listening & Speaking 1",
        "lessons": [
            {
                "name": "Greetings",
                "vocabulary": [
                    { "en": "house", "th": "บ้าน", "hint": "bâan" },
                    { "en": "school", "th": "โรงเรียน", "hint": "rooŋ-rian" },
                    { "en": "coffee", "th": "กาแฟ", "hint": "gaa-fɛɛ" },
                    { "en": "food", "th": "อาหาร", "hint": "aa-hǎan" },
                    { "en": "sleep", "th": "นอน", "hint": "nɔɔn" },
                    { "en": "banana", "th": "กล้วย", "hint": "gluay" },
                    { "en": "family", "th": "ครอบครัว", "hint": "khroop-khrua" },
                    { "en": "dog", "th": "หมา", "hint": "māa" },
                    { "en": "lonely", "th": "เหงา", "hint": "naaw" },
                    { "en": "book", "th": "หนังสือ", "hint": "nǎŋ-sɯ̌ɯ" },
                    { "en": "woman", "th": "ผู้หญิง", "hint": "P̄hū̂-ỵing" },
                    { "en": "hot", "th": "ร้อน", "hint": "rɔ́ɔn" },
                    { "en": "horse", "th": "ม้า", "hint": "M̂ā" },
                    { "en": "friend", "th": "เพื่อน", "hint": "phɯ̂an" },
                    { "en": "hello", "th": "สวัสดี", "hint": "sà-wàt-dii" },
                    { "en": "thank you", "th": "ขอบคุณ", "hint": "kɔ̀ɔp-kun" },
                    { "en": "never mind", "th": "ไม่เป็นไร", "hint": "mâi-bpen-rai" },
                    { "en": "excuse me", "th": "ขอโทษ", "hint": "kɔ̌ɔ-tôot" },
                    { "en": "nice to meet you", "th": "ยินดีทีได้รู้จัก", "hint": "yin-dii tîi dâai rúu-jàk" },
                    { "en": "how about you", "th": "แล้วคุณล่ะ", "hint": "leaw khun la" },
                    { "en": "I for male", "th": "ผม", "hint": "phǒm" },
                    { "en": "I for female", "th": "ฉัน", "hint": "chǎn" },
                    { "en": "you", "th": "คุณ", "hint": "khun" },
                    { "en": "he or she", "th": "เขา", "hint": "khǎw" },
                    { "en": "we or us", "th": "พวกเรา", "hint": "phûak-raw" },
                    { "en": "they or them", "th": "พวกเขา", "hint": "phûak-khǎw" },
                    { "en": "belong to or of", "th": "ของ", "hint": "khɔ̌ɔŋ" },
                    { "en": "my or mine for male", "th": "ของผม", "hint": "khɔ̌ɔŋ phǒm" },
                    { "en": "my or mine for female", "th": "ของฉัน", "hint": "khɔ̌ɔŋ chǎn" },
                    { "en": "your or yours", "th": "ของคุณ", "hint": "khɔ̌ɔŋ khun" },
                    { "en": "his or hers", "th": "ของเขา", "hint": "khɔ̌ɔŋ khǎw" },
                    { "en": "our or ours", "th": "ของพวกเรา", "hint": "khɔ̌ɔŋ phûak-raw" },
                    { "en": "their or theirs", "th": "ของพวกเขา", "hint": "khɔ̌ɔŋ phûak-khǎw" },
                    { "en": "name", "th": "ชือ", "hint": "chʉ̂ʉ" },
                    { "en": "first name", "th": "ชือจริง", "hint": "chʉ̂ʉ jiŋ" },
                    { "en": "surname", "th": "นามสกุล", "hint": "naam-sà-gun" },
                    { "en": "nickname", "th": "ชื่อเล่น", "hint": "chʉ̂ʉ lên" },
                    { "en": "fine", "th": "สบายดี", "hint": "sà-baay-dii" },
                    { "en": "pretty good", "th": "ก็ดี", "hint": "gɔ̂ɔ dii" },
                    { "en": "so so", "th": "เฉยเฉย", "hint": "chə̌əy-chə̌əy" },
                    { "en": "eat already", "th": "กินแล้ว", "hint": "gin lɛ́ɛw" },
                    { "en": "not yet", "th": "ยัง", "hint": "yaŋ" },
                    { "en": "come", "th": "มา", "hint": "maa" },
                    { "en": "from", "th": "จาก", "hint": "jàak" },
                    { "en": "where", "th": "ทีไหน", "hint": "thîi-nǎi" }
                ],
                "structure": [
                    { "en": "Hello. How are you?", "th": "สวัสดี คุณ สบายดี ไหม" },
                    { "en": "I am fine, thank you. And you?", "th": "ฉัน สบายดี ขอบคุณ แล้ว คุณ ล่ะ" },
                    { "en": "Where are you from?", "th": "คุณ มาจาก ไหน" },
                    { "en": "I am from Palestine.", "th": "ฉัน มาจาก ปาเลสไตน์" },
                    { "en": "What is your name?", "th": "คุณ ชื่อ จริง อะไร" },
                    { "en": "My name is Ebrahim.", "th": "ฉัน ชื่อ เอบริฮัม" },
                    { "en": "What is your name?", "th": "คุณ ชื่อ อะไร" },
                    { "en": "My name is Pairat.", "th": "ฉัน ชื่อ ไพรัช" },
                    { "en": "Where are you from?", "th": "คุณ มาจาก ไหน" },
                    { "en": "I am from Thailand.", "th": "ฉัน มาจาก ประเทศไทย" },
                    { "en": "Nice to meet you.", "th": "ยินดี ที่ ได้ รู้จัก" },
                    { "en": "Nice to meet you too.", "th": "ยินดี ที่ ได้ รู้จัก เช่นกัน" },
                    { "en": "Excuse me.", "th": "ขอโทษ" },
                    { "en": "I have to go to class now.", "th": "ฉัน ต้อง ไป เรียน ตอนนี้" },
                    { "en": "See you again.", "th": "แล้ว พบกัน ใหม่" },
                    { "en": "See you later.", "th": "แล้ว พบกัน ทีหลัง" },
                    { "en": "Hello Pairat. Nice to see you again.", "th": "สวัสดี ไพรัช ยินดี ที่ ได้ พบ กัน ใหม่" },
                    { "en": "Hello Ebrahim. Nice to see you too.", "th": "สวัสดี เอบริฮัม ยินดี ที่ ได้ พบ กัน เช่นกัน" }
                ]
            },
            {
                "name": "What are you doing?",
                "vocabulary": [
                    { "en": "eat", "th": "กิน", "hint": "gin" },
                    { "en": "drink", "th": "ดืxม", "hint": "dʉ̀ʉm" },
                    { "en": "watch", "th": "ดู", "hint": "duu" },
                    { "en": "listen", "th": "ฟัง", "hint": "faŋ" },
                    { "en": "wake up", "th": "ตืxน", "hint": "dtɯɯn" },
                    { "en": "lie down or sleep", "th": "นอน", "hint": "nɔɔn" },
                    { "en": "walk", "th": "เดิน", "hint": "dəən" },
                    { "en": "speak", "th": "พูด", "hint": "phûut" },
                    { "en": "study", "th": "เรียน", "hint": "rian" },
                    { "en": "write", "th": "เขียน", "hint": "khǐan" },
                    { "en": "read", "th": "อ่าน", "hint": "àan" },
                    { "en": "take a shower", "th": "อาบนํâา", "hint": "àap-náam" },
                    { "en": "play", "th": "เล่น", "hint": "lên" },
                    { "en": "exercise", "th": "ออกกําลังกาย", "hint": "ɔ̀ɔk-gam-lang-gaai" },
                    { "en": "go", "th": "ไป", "hint": "bpai" },
                    { "en": "do or make", "th": "ทํา", "hint": "tham" },
                    { "en": "Normally or Usually", "th": "ปกติ", "hint": "bpòk-gà-dtì" },
                    { "en": "food", "th": "อาหาร", "hint": "aa-hǎan" },
                    { "en": "book", "th": "หนังสือ", "hint": "nǎŋ-sɯ̌ɯ" },
                    { "en": "market", "th": "ตลาด", "hint": "dtà-làat" },
                    { "en": "song", "th": "เพลง", "hint": "phleeŋ" },
                    { "en": "home work", "th": "การบ้าน", "hint": "gaan-bâan" },
                    { "en": "coffee", "th": "กาแฟ", "hint": "gaa-fɛɛ" },
                    { "en": "language", "th": "ภาษา", "hint": "phaa-sǎa" },
                    { "en": "like", "th": "ชอบ", "hint": "chɔ̂ɔp" },
                    { "en": "yes/no", "th": "ไหม/มัย", "hint": "mǎi/mái" },
                    { "en": "do", "th": "ทํา", "hint": "tham" },
                    { "en": "multiple answers", "th": "บ้าง", "hint": "bâaŋ" },
                    { "en": "do or make", "th": "ทํา", "hint": "tham" },
                    { "en": "work", "th": "ทํางาน", "hint": "tham ŋaan" },
                    { "en": "do homework", "th": "ทําการบ้าน", "hint": "tham gaan-bânn" },
                    { "en": "do housework", "th": "ทํางานบ้าน", "hint": "tham ŋaan-bâan" },
                    { "en": "cook", "th": "ทําอาหาร", "hint": "tham aa-hǎan" },
                    { "en": "drive a car", "th": "ขับรถ", "hint": "khàp rót" },
                    { "en": "ride a motorbike", "th": "ขีeมอเตอร์ไซค์", "hint": "khìi mɔɔ-dtəə-sai" },
                    { "en": "ride a bicycle", "th": "ขีeจักรยาน", "hint": "khiì jàk-grà-yaan" },
                    { "en": "talk with freinds", "th": "คุยกับเพืeอน", "hint": "khuy gàp phɯ̂an" },
                    { "en": "study Thai", "th": "เรียนภาษาไทย", "hint": "rian phaa-sǎa thai" },
                    { "en": "return home", "th": "กลับบ้าน", "hint": "glàp bâan" },
                    { "en": "shopping", "th": "ซือของ", "hint": "sɯ́ɯ-khɔ̌ɔŋ" },
                    { "en": "travel or hang out", "th": "ไปเทีeยว", "hint": "bpai-thiâw" },
                    { "en": "watch movie", "th": "ดูหนัง", "hint": "duu nǎŋ" },
                    { "en": "can", "th": "ได้", "hint": "dâay" },
                    { "en": "sit", "th": "นัง", "hint": "nâŋ" },
                    { "en": "stand", "th": "ยืน", "hint": "yɯɯn" },
                    { "en": "run", "th": "วิง", "hint": "wîŋ" },
                    { "en": "swim", "th": "ว่ายนํา", "hint": "wâay-náam" },
                    { "en": "do the laundry", "th": "ซักผ้า", "hint": "sák-phâa" },
                    { "en": "wash the dishes", "th": "ล้างจาน", "hint": "láaŋ jaan" },
                    { "en": "rest", "th": "พักผ่อน", "hint": "phák-phɔ̀ɔn" },
                    { "en": "stroll", "th": "เดินเล่น", "hint": "dəən-lên" },
                    { "en": "listen to music", "th": "ฟังเพลง", "hint": "faŋ pleeŋ" },
                    { "en": "sing", "th": "ร้องเพลง", "hint": "rɔ́ɔŋ pleeŋ" },
                    { "en": "will", "th": "จะ", "hint": "jà" }
                ],
                "structure": [
                    { "en": "What are you doing?", "th": "คุณ ทำ อะไร" },
                    { "en": "I am going to write a book.", "th": "ฉัน กำลัง จะ เขียน หนังสือ" },
                    { "en": "What are you going to write a book about?", "th": "ฉัน กำลัง จะ ซื้อ หนังสือ" },
                    { "en": "How horses walk?", "th": "ฉัน กำลัง จะ อ่าน หนังสือ" },
                    { "en": "I have written 30 pages", "th": "ฉัน เขียน 30 หน้า เสร็จ แล้ว" },
                    { "en": "Very interesting.", "th": "น่าสนใจ มาก" },
                    { "en": "Can you read the book?", "th": "คุณ อ่าน หนังสือ ได้ ไหม" },
                    { "en": "Yes, I can read it.", "th": "ได้ ฉัน อ่าน ได้" },
                    { "en": "How do horses walk?", "th": "ม้า เดิน อย่างไร" },
                    { "en": "Horses walk by lifting two leg at a time.", "th": "ม้า เดิน โดย ยก ขา ทีละ ข้าง" },
                    { "en": "'toto lop toto lop toto lop '", "th": "'toto lop toto lop toto lop '" },
                    { "en": "30 pages of 'toto lop'?", "th": "30 หน้า ของ 'toto lop'?" },
                    { "en": "Yes, it is a long walk.", "th": "ได้ มัน น่าสนใจ มาก" },
                    { "en": "I am going to eat.", "th": "ฉัน กำลัง จะ กิน" },
                    { "en": "I am going to drink coffee.", "th": "ฉัน กำลัง จะ ดื่ม กาแฟ" },
                    { "en": "I am watching TV.", "th": "ฉัน กำลัง ดู ทีวี" },
                    { "en": "I was listening to music.", "th": "ฉัน กำลัง ฟัง เพลง" },
                    { "en": "I will wake up.", "th": "ฉัน จะ ตื่น" },
                    { "en": "I am going to lie down.", "th": "ฉัน กำลัง จะ นอน" },
                    { "en": "I am going for a walk.", "th": "ฉัน กำลัง จะ เดินเล่น" },
                    { "en": "I am learning to speak Thai.", "th": "ฉัน กำลัง เรียน ภาษาไทย" },
                    { "en": "I will study Thai.", "th": "ฉัน จะ เรียน ภาษาไทย" },
                    { "en": "I go to the market every week.", "th": "ฉัน ไป ตลาด ทุก สัปดาห์" },
                    { "en": "I am reading a book.", "th": "ฉัน กำลัง อ่าน หนังสือ" },
                    { "en": "I will take a shower.", "th": "ฉัน จะ อาบน้ำ" },
                    { "en": "I am going to play.", "th": "ฉัน กำลัง จะ เล่น" }
                ]
            },
            {
                "name": "How is Thai food? (Adjective/Adverb)",
                "vocabulary": [
                    { "en": "small", "th": "เล็ก", "hint": "lék" },
                    { "en": "big", "th": "ใหญ่", "hint": "yài" },
                    { "en": "short (length)", "th": "สัäน", "hint": "sân" },
                    { "en": "long", "th": "ยาว", "hint": "yaaw" },
                    { "en": "short (height)", "th": "เตีย", "hint": "dtîa" },
                    { "en": "tall (height)", "th": "สูง", "hint": "sǔuŋ" },
                    { "en": "good", "th": "ดี", "hint": "dii" },
                    { "en": "bad or terrible", "th": "แย่", "hint": "yɛ̂ɛ" },
                    { "en": "hot", "th": "ร้อน", "hint": "rɔ́ɔn" },
                    { "en": "cool or iced", "th": "เย็น", "hint": "yen" },
                    { "en": "cold", "th": "หนาว", "hint": "nǎaw" },
                    { "en": "cheap", "th": "ถูก", "hint": "thùuk" },
                    { "en": "expensive", "th": "แพง", "hint": "phɛɛŋ" },
                    { "en": "slow", "th": "ช้า", "hint": "cháa" },
                    { "en": "fast", "th": "เร็ว", "hint": "rew" },
                    { "en": "beautiful o pretty", "th": "สวย", "hint": "sǔay" },
                    { "en": "handsome", "th": "หล่อ", "hint": "lɔ̀ɔ" },
                    { "en": "not", "th": "ไม่", "hint": "mâi" },
                    { "en": "delicious", "th": "อร่อย", "hint": "à-rɔ̀ɔy" },
                    { "en": "fun or enjoyable", "th": "สนุก", "hint": "sà-nùk" },
                    { "en": "hungry", "th": "หิว", "hint": "hǐw" },
                    { "en": "full", "th": "อิม", "hint": "ìm" },
                    { "en": "fat", "th": "อ้วน", "hint": "ûan" },
                    { "en": "skinny", "th": "ผอม", "hint": "phɔ̌ɔm" },
                    { "en": "tired", "th": "เหนือย", "hint": "nɯay" },
                    { "en": "sleepy", "th": "ง่วง", "hint": "ŋûaŋ" },
                    { "en": "difficult", "th": "ยาก", "hint": "yâak" },
                    { "en": "easy", "th": "ง่าย", "hint": "ŋâay" },
                    { "en": "clean", "th": "สะอาด", "hint": "sà-àat" },
                    { "en": "dirty", "th": "สกปรก", "hint": "sòk-gà-bpròk" },
                    { "en": "rich", "th": "รวย", "hint": "ruay" },
                    { "en": "poor", "th": "จน", "hint": "jon" },
                    { "en": "new", "th": "ใหม่", "hint": "mài" },
                    { "en": "old", "th": "เก่า/แก่", "hint": "gàw/gɛ̀ɛ" },
                    { "en": "how", "th": "ยังไง", "hint": "yaŋ-ŋai" },
                    { "en": "shoes", "th": "รองเท้า", "hint": "rɔɔŋ-tháw" },
                    { "en": "book", "th": "หนังสือ", "hint": "nǎŋ-sɯ̌ɯ" },
                    { "en": "bathroom", "th": "ห้องนําƒ", "hint": "hɔ̂ɔŋ-náam" },
                    { "en": "Bangkok", "th": "กรุงเทพฯ", "hint": "gruŋ-thêep" },
                    { "en": "shirt", "th": "เสือ", "hint": "sɯ̂a" },
                    { "en": "Thailand", "th": "ประเทศไทย", "hint": "bprà-thêet thai" },
                    { "en": "and", "th": "และ", "hint": "lɛ́" },
                    { "en": "but", "th": "แต่", "hint": "dtɛ̀ɛ" },
                    { "en": "more than", "th": "กว่า", "hint": "gwàa" },
                    { "en": "more than or rather than", "th": "มากกว่า", "hint": "mâak gwàa" },
                    { "en": "than", "th": "กว่า", "hint": "gwàa" },
                    { "en": "less than", "th": "น้อยกว่า", "hint": "nɔ́ɔy gwàa" },
                    { "en": "the most", "th": "ทีสุด", "hint": "thîi-sùt" },
                    { "en": "better", "th": "ดีกว่า", "hint": "dii gwàa" },
                    { "en": "the best", "th": "ดีที:สดุ", "hint": "dii thîi-sùt" },
                    { "en": "better", "th": "เก่งกว่า", "hint": "gèŋ gwàa" },
                    { "en": "the best", "th": "เก่งทีส", "hint": "gèŋ thîi-sùt" },
                    { "en": "less", "th": "น้ อยกว่า", "hint": "nɔ́ɔy gwàa" },
                    { "en": "least", "th": "น้อยทีสดุ", "hint": "nɔ́ɔy thîi-sùt" },
                    { "en": "more", "th": "มากกว่า", "hint": "mâak gwàa" },
                    { "en": "the most", "th": "มากทีสดุ", "hint": "mâak thîi-sùt" }
                ],
                "structure": [
                    { "en": "How is Thai food?", "th": "อาหารไทยเป็นอย่างไร?" },
                    { "en": "Thai food is delicious.", "th": "อาหารไทยอร่อย" },
                    { "en": "Is Thai food spicy?", "th": "อาหารไทยเผ็ดไหม?" },
                    { "en": "Yes, it is spicy.", "th": "เผ็ด" },
                    { "en": "What is your favourite Thai food?", "th": "อาหารไทยที่คุณชอบคืออะไร?" },
                    { "en": "I like Pad Thai the most.", "th": "ผัดไทย" },
                    { "en": "How is the least spicy Thai food?", "th": "อาหารไทยที่เผ็ดน้อยที่สุดเป็นอย่างไร?" },
                    { "en": "I like Thai omelette.", "th": "ไข่เจียว" },
                    { "en": "Could you you tell me the names of Thai dishes?", "th": "คุณช่วยบอกชื่ออาหารไทยให้ฉันหน่อยได้ไหม?" },
                    { "en": "Sure. Here are some names of Thai dishes.", "th": "ได้ นี่คือชื่ออาหารไทยบางส่วน" },
                    { "en": "Pad Thai, Tom Yum Goong, Som Tum, Green Curry, Massaman Curry, Panang Curry, Red Curry, Yellow Curry, Thai Omelette, Fried Rice, Stir-fried Basil with Pork, Stir-fried Morning Glory, Chicken with Cashew Nuts, Chicken with Garlic and Pepper, Chicken with Coconut Milk, Mango Sticky Rice, Coconut Ice Cream.", "th": "ผัดไทย ต้มยำกุ้ง ส้มตำ แกงเขียวหวาน แกงมัสมั่น แกงพะแนง แกงเผ็ด ไข่เจียว ข้าวผัด ผัดกะเพรา ผัดผักบุ้ง ไก่ผัดเม็ดมะม่วงหิมพานต์ ไก่ผัดกระเทียมพริกไทย ไก่แกงเขียวหวาน ข้าวเหนียวมะม่วง ไอศกรีมมะพร้าว" },
                    { "en": "Thank you very much.", "th": "ขอบคุณมาก" },
                    { "en": "Have you eaten yet?", "th": "คุณ กิน แล้ว หรือ ยัง" },
                    { "en": "Not yet. I am hungry.", "th": "ยัง ฉัน หิว" },
                    { "en": "Let's go eat together.", "th": "เรา ไป กิน ด้วย กัน เถอะ" },
                    { "en": "Ok. Where shall we eat?", "th": "ได้ ฉัน มา" },
                    { "en": "How about my restaurant at Warrarot market?", "th": "ร้านอาหาร นู้น ดี ไหม" },
                    { "en": "That sounds good.", "th": "ฟัง ดู ดี" },
                    { "en": "Let's go.", "th": "เรา ไป กัน" }
                ]
            },
            {
                "name": "Go shopping (numbers)",
                "vocabulary": [
                    { "en": "one", "th": "หนึง", "hint": "nɯŋ" },
                    { "en": "two", "th": "สอง", "hint": "sɔ̌ɔŋ" },
                    { "en": "three", "th": "สาม", "hint": "sǎam" },
                    { "en": "four", "th": "สี", "hint": "sìi" },
                    { "en": "five", "th": "ห้า", "hint": "hâa" },
                    { "en": "six", "th": "หก", "hint": "hòk" },
                    { "en": "seven", "th": "เจ็ด", "hint": "jèt" },
                    { "en": "eight", "th": "แปด", "hint": "bpɛ̀ɛt" },
                    { "en": "nine", "th": "เก้า", "hint": "gâaw" },
                    { "en": "ten", "th": "สิบ", "hint": "sìp" },
                    { "en": "eleven", "th": "สิบเอ็ด", "hint": "sìp-èt" },
                    { "en": "twelve", "th": "สิบสอง", "hint": "sìp-sɔ̌ɔŋ" },
                    { "en": "thirteen", "th": "สิบสาม", "hint": "sìp-sǎam" },
                    { "en": "fourteen", "th": "สิบสี", "hint": "sìp-sìi" },
                    { "en": "fifteen", "th": "สิบห้า", "hint": "sìp-hâa" },
                    { "en": "sixteen", "th": "สิบหก", "hint": "sìp-hòk" },
                    { "en": "seventeen", "th": "สิบเจ็ด", "hint": "sìp-jèt" },
                    { "en": "eighteen", "th": "สิบแปด", "hint": "sìp-bpɛ̀ɛt" },
                    { "en": "nineteen", "th": "สิบเก้า", "hint": "sìp-gâaw" },
                    { "en": "twenty", "th": "ยี่สิบ", "hint": "yîi-sìp" },
                    { "en": "thirty", "th": "สามสิบ", "hint": "sǎam-sìp" },
                    { "en": "forty", "th": "สี่สิบ", "hint": "sìi-sìp" },
                    { "en": "fifty", "th": "ห้าสิบ", "hint": "hâa-sìp" },
                    { "en": "sixty", "th": "หกสิบ", "hint": "hòk-sìp" },
                    { "en": "seventy", "th": "เจ็ดสิบ", "hint": "jèt-sìp" },
                    { "en": "eighty", "th": "แปดสิบ", "hint": "bpɛ̀ɛt-sìp" },
                    { "en": "ninety", "th": "เก้าสิบ", "hint": "gâaw-sìp" },
                    { "en": "one hundred", "th": "หนึงร้อย", "hint": "nɯŋ-rɔ́ɔy" },
                    { "en": "one thousand", "th": "หนึงพัน", "hint": "nɯŋ-phan" },
                    { "en": "ten thousand", "th": "หมื่น", "hint": "nɯŋ-mɯɯn" },
                    { "en": "one hundred thousand", "th": "หนึงแสน", "hint": "nɯŋ-sɛ̌ɛn" },
                    { "en": "one million", "th": "หนึงล้าน", "hint": "nɯŋ-láan" },
                    { "en": "clothes", "th": "เสือผ้า", "hint": "sɯ̂a-phâa" },
                    { "en": "shirt", "th": "เสือ", "hint": "sɯ̂a" },
                    { "en": "T-shirt", "th": "เสือยืด", "hint": "sɯ̂a-yɯ̂ɯt" },
                    { "en": "sweater", "th": "เสือกันหนาว", "hint": "sɯ̂a gan-nǎaw" },
                    { "en": "pants or trousers", "th": "กางเกง", "hint": "gaaŋ-geeŋ" },
                    { "en": "skirt", "th": "กระโปรง", "hint": "grà-bprooŋ" },
                    { "en": "shoes", "th": "รองเท้า", "hint": "rɔɔŋ-tháaw" },
                    { "en": "socks", "th": "ถุงเท้า", "hint": "thǔŋ-tháaw" },
                    { "en": "glasses", "th": "แว่นตา", "hint": "wɛ̂ɛn-dtaa" },
                    { "en": "hat", "th": "หมวก", "hint": "mùak" },
                    { "en": "swimming suit", "th": "ชุดว่ายนํา", "hint": "chút wâay-náam" },
                    { "en": "pajamas", "th": "ชุดนอน", "hint": "chút nɔɔn" },
                    { "en": "exercise outfit", "th": "ชุดออกกําลังกาย", "hint": "chút ɔ̀ɔk-gam-laŋ-gaay" },
                    { "en": "price", "th": "ราคา", "hint": "raa-khaa" },
                    { "en": "discount", "th": "ลด", "hint": "lót" }
                ],
                "structure": [
                    { "en": "How much is this?", "th": "อัน นี้ ราคา เท่าไหร่" },
                    { "en": "This is 100 baht.", "th": "อัน นี้ ราคา 100 บาท" },
                    { "en": "How much is this shirt?", "th": "เสือ อัน นี้ ราคา เท่า ไหร่" },
                    { "en": "This shirt is 200 baht.", "th": "เสือ อัน นี้ ราคา 200 บาท" },
                    { "en": "How much are these shoes?", "th": "รองเท้า คู่นี้ ราคา เท่า ไหร่" },
                    { "en": "These shoes are 500 baht.", "th": "รองเท้า คู่นี้ ราคา 500 บาท" },
                    { "en": "How much are these pants?", "th": "กางเกง ตัว นี้ ราคา เท่า ไหร่" },
                    { "en": "These pants are 300 baht.", "th": "กางเกง ตัว นี้ ราคา 300 บาท" },
                    { "en": "How much is this hat?", "th": "หมวก อัน นี้ ราคา เท่า ไหร่" },
                    { "en": "This hat is 150 baht.", "th": "หมวก อัน นี้ ราคา 150 บาท" },
                    { "en": "How much is this sweater?", "th": "เสือกันหนาว อัน นี้ ราคา เท่า ไหร่" },
                    { "en": "This sweater is 400 baht.", "th": "เสือกันหนาว อัน นี้ ราคา 400 บาท" },
                    { "en": "Can you give me a discount?", "th": "คุณ ลด ให้ ฉัน ได้ ไหม" },
                    { "en": "Yes, I can give you a discount.", "th": "ได้ ฉัน ลด ให้ คุณ ได้" },
                    { "en": "How much is the discount?", "th": "ลด เท่า ไหร่" },
                    { "en": "I can give you a 20 baht discount.", "th": "ฉัน ลด ให้ คุณ 20 บาท" },
                    { "en": "Ok. I will take it.", "th": "ได้ ฉัน เอา" }
                ]
            },
            {
                "name": "Where is the hospital? (places)",
                "vocabulary": [
                    { "en": "house", "th": "บ้าน", "hint": "bâan" },
                    { "en": "school", "th": "โรงเรียน", "hint": "rooŋ-rian" },
                    { "en": "hotel", "th": "โรงแรม", "hint": "rooŋ-rɛɛm" },
                    { "en": "hospital", "th": "โรงพยาบาล", "hint": "rooŋ-phá-yaa-baan" },
                    { "en": "restaurant", "th": "ร้านอาหาร", "hint": "ráan aa-hǎan" },
                    { "en": "coffee shop", "th": "ร้านกาแฟ", "hint": "ráan gaa-fɛɛ" },
                    { "en": "train station", "th": "สถานีรถไฟ", "hint": "sà-thǎa-nii rót-fai" },
                    { "en": "bus station", "th": "สถานีขนส่ง", "hint": "sà-thǎa-nii khǒn-sòng" },
                    { "en": "plice station", "th": "สถานีตํารวจ", "hint": "s̀a-thǎa-nii dtam-rùat" },
                    { "en": "airport", "th": "สนามบิน", "hint": "sà-nǎam bin" },
                    { "en": "park", "th": "สวน", "hint": "sǔan" },
                    { "en": "bank", "th": "ธนาคาร", "hint": "thá-naa-khaan" },
                    { "en": "ATM", "th": "ตู้เอทีเอ็ม", "hint": "dtûu ee-thii-em" },
                    { "en": "market", "th": "ตลาด", "hint": "dta-làat" },
                    { "en": "department store", "th": "ห้าง", "hint": "hâaŋ" },
                    { "en": "road or street", "th": "ถนน", "hint": "thà-nǒn" },
                    { "en": "lane", "th": "ซอย", "hint": "sɔɔy" },
                    { "en": "down town", "th": "ตัวเมือง", "hint": "dtua mɯaŋ" },
                    { "en": "beach", "th": "ชายหาด", "hint": "chaay-hàat" },
                    { "en": "sea", "th": "ทะเล", "hint": "thá-lee" },
                    { "en": "temple", "th": "วัด", "hint": "wát" },
                    { "en": "church", "th": "โบสถ์", "hint": "bòot" },
                    { "en": "university", "th": "มหาวิทยาลัย", "hint": "má-hǎa-wit́-thá yaa- lai" },
                    { "en": "mountain", "th": "ภูเขา/ดอย", "hint": "phuu-khǎw/dɔɔy" },
                    { "en": "river", "th": "แม่นํา", "hint": "mɛ̂ɛ-náam" },
                    { "en": "be (is or am or are)", "th": "อยู่", "hint": "yùu" },
                    { "en": "where", "th": "ที&ไหน", "hint": "thîi-nǎi" },
                    { "en": "close to", "th": "ใกล้", "hint": "glâi" },
                    { "en": "near", "th": "กับ", "hint": "gàp" },
                    { "en": "far", "th": "ไกล", "hint": "glai" },
                    { "en": "next to", "th": "ข้างๆ", "hint": "khâaŋ-khâaŋ" },
                    { "en": "next to", "th": "ติด(กับ)", "hint": "dtìt(gàp)" },
                    { "en": "opposite to", "th": "ตรงข้าม", "hint": "dtroŋ-khâam" },
                    { "en": "at", "th": "ที&", "hint": "thîi" },
                    { "en": "in", "th": "ใน", "hint": "nai" },
                    { "en": "arround (in the area)", "th": "แถว", "hint": "thɛ̌ɛw" },
                    { "en": "in front of", "th": "ข้างหน้า", "hint": "khâaŋ-nâa" },
                    { "en": "behind", "th": "ข้างหลัง", "hint": "khâaŋ-lǎŋ" },
                    { "en": "here", "th": "ที&นี&", "hint": "thîi-nîi" },
                    { "en": "there", "th": "ที&นนั&", "hint": "thîi-nân" },
                    { "en": "over there", "th": "ที&โน่น", "hint": "thîi-nôon" },

                ],
                "structure": [
                    { "en": "Where is the hospital?", "th": "โรงพยาบาลอยู่ทีไหน" },
                    { "en": "The hospital is over there.", "th": "โรงพยาบาลอยู่ทีโน่น" },
                    { "en": "The hospital is next to the school.", "th": "โรงพยาบาลอยู่ติดกับโรงเรียน" },
                    { "en": "The hospital is in front of the hotel.", "th": "โรงพยาบาลอยู่ข้างหน้าโรงแรม" },
                    { "en": "The hospital is behind the bank.", "th": "โรงพยาบาลอยู่ข้างหลังธนาคาร" },
                    { "en": "The hospital is near the market.", "th": "โรงพยาบาลอยู่ใกล้ตลาด" },
                    { "en": "The hospital is far from the airport.", "th": "โรงพยาบาลอยู่ไกลจากสนามบิน" },
                    { "en": "Excuse me. Where is the hospital?", "th": "ขอโทษครับ/ค่ะ โรงพยาบาลอยู่ทีไหน" },
                    { "en": "Go straight (ahead).", "th": "ตรงไป" },
                    { "en": "Turn left.", "th": "เลี้ยวซ้าย" },
                    { "en": "Turn right.", "th": "เลี้ยวขวา" },
                    { "en": "It's on the left side.", "th": "อยู่ทางซ้าย" },
                    { "en": "It's on the right side.", "th": "อยู่ทางขวา" },
                    { "en": "It's in front of you.", "th": "อยู่ข้างหน้าคุณ" },
                    { "en": "It's behind you.", "th": "อยู่ข้างหลังคุณ" },
                    { "en": "It's next to you.", "th": "อยู่ติดกับคุณ" },
                    { "en": "It's near you.", "th": "อยู่ใกล้คุณ" },
                    { "en": "It's far from you.", "th": "อยู่ไกลจากคุณ" },
                    { "en": "Thank you very much.", "th": "ขอบคุณมาก" }
                ]
            }
        ]
    },
    {
        "title": "Listening & Speaking 2",
        "lessons": [
            {
                "name": "What would you like to order?",
                "vocabulary": [
                    { "en": "rice", "th": "ข้าว", "hint": "khâaw" },
                    { "en": "food", "th": "อาหาร/กับข้าว", "hint": "aa-hǎan/gàp-khâaw" },
                    { "en": "curry", "th": "แกง", "hint": "gɛɛŋ" },
                    { "en": "vegetables", "th": "ผัก", "hint": "phàk" },
                    { "en": "egg", "th": "ไข่", "hint": "khài" },
                    { "en": "tofu", "th": "เต้าหู ้", "hint": "dtâw-hûu" },
                    { "en": "Chili", "th": "พริก", "hint": "phrík" },
                    { "en": "meat or beef", "th": "เนืNอ", "hint": "nɯa" },
                    { "en": "pork", "th": "หมู", "hint": "mǔu" },
                    { "en": "chicken", "th": "ไก่", "hint": "gài" },
                    { "en": "fish", "th": "ปลา", "hint": "bplaa" },
                    { "en": "seafood", "th": "(อาหาร)ทะเล", "hint": "(aa hǎan) thá-lee" },
                    { "en": "shrimp", "th": "กุ้ง", "hint": "gûŋ" },
                    { "en": "squid", "th": "ปลาหมึก", "hint": "bplaa-mɯk" },
                    { "en": "crab", "th": "ปู", "hint": "bpuu" },
                    { "en": "shell", "th": "หอย", "hint": "hɔ̌ɔy" },
                    { "en": "boil or boiled", "th": "ต้ม", "hint": "dtôm" },
                    { "en": "stir fry or fried", "th": "ผัด", "hint": "phàt" },
                    { "en": "deep fry or deep fried", "th": "ทอด", "hint": "thɔ̂ɔt" },
                    { "en": "steam or steamed", "th": "นึงf", "hint": "nɯ̂ŋ" },
                    { "en": "grill or grilled", "th": "ปิ", "hint": "bpîŋ" },
                    { "en": "mild soup", "th": "แกงจืด", "hint": "gɛɛŋ-jɯɯt" },
                    { "en": "spicy sour soup", "th": "ต้ มยํา", "hint": "dtôm-yam" },
                    { "en": "spicy sour salad", "th": "ยํา", "hint": "yam" },
                    { "en": "noodles", "th": "ก๋วยเตีmยว", "hint": "gǔay-dtǐaw" },
                    { "en": "pad thai noodles", "th": "ผัดไทย", "hint": "phàt-thai" },
                    { "en": "fried vegtables", "th": "ผัดผัก", "hint": "phàt-phàk" },
                    { "en": "thai omelet", "th": "ไข่เจียว", "hint": "khài-jiaw" },
                    { "en": "papaya salad", "th": "ส้มตํา", "hint": "sôm-dtam" },
                    { "en": "green curry", "th": "แกงเขียงหวาน", "hint": "gɛɛŋ-khǐaw-wǎan" },
                    { "en": "red curry", "th": "แกงเผ็ด", "hint": "gɛɛŋ-phèt" },
                    { "en": "mango sticky rice", "th": "ข้าวเหนียวมะม่วง", "hint": "khâaw-nǐaw má-mûaŋ" },
                    { "en": "taste or flavour", "th": "รสชาติ", "hint": "rót-châat" },
                    { "en": "spicy", "th": "เผ็ด", "hint": "phèt" },
                    { "en": "sweet", "th": "หวาน", "hint": "wǎan" },
                    { "en": "sour", "th": "เปรียNว", "hint": "bprîaw" },
                    { "en": "salty", "th": "เค็ม", "hint": "khem" },
                    { "en": "bitter", "th": "ขม", "hint": "khǒm" },
                    { "en": "tasteless or plain", "th": "จืด", "hint": "jɯɯt" },
                    { "en": "order or eat", "th": "สัง/กิน", "hint": "sàŋ/gin" },
                    { "en": "with or without", "th": "ใส่/ไม่ใส่", "hint": "sài/mâi sài" },
                    { "en": "fermented fish", "th": "ปลาร้า", "hint": "bplaa-ráa" },
                    { "en": "monosodium glutamate", "th": "ผงชูรส", "hint": "phǒŋ-chuu-rót" },
                    { "en": "plate", "th": "จาน", "hint": "jaan" },
                    { "en": "bowl", "th": "ถ้วย/ชาม", "hint": "thûay/chaam" },
                    { "en": "Box or carton", "th": "กล่อง", "hint": "glɔ̀ɔŋ" },
                    { "en": "plastic bag", "th": "ถุง", "hint": "thǔŋ" },
                    { "en": "piece", "th": "ชิ1น", "hint": "chín" }

                ],
                "structure": [
                    { "en": "What would you like to order?", "th": "ฉัน อยาก สั่ง", "hint": "chán yàak sàŋ" },
                    { "en": "I would like to order fried rice.", "th": "ฉัน อยาก สั่ง ข้าว ผัด", "hint": "chán yàak sàŋ khâaw phàt" },
                    { "en": "I would like to order pad thai noodles.", "th": "ฉัน อยาก สั่ง ก๋วยเตี๋ยว ผัดไทย", "hint": "chán yàak sàŋ gǔay-dtǐaw phàt-thai" },
                    { "en": "I would like to order spicy sour soup with shrimp.", "th": "ฉัน อยาก สั่ง ต้มยํา กุ้ง", "hint": "chán yàak sàŋ dtôm-yam gûŋ" },
                    { "en": "I would like to order green curry with chicken.", "th": "ฉัน อยาก สั่ง แกงเขียวหวาน ไก่", "hint": "chán yàak sàŋ gɛɛŋ-khǐaw-wǎan gài" },
                    { "en": "I would like to order red curry with beef.", "th": "ฉัน อยาก สั่ง แกงเผ็ด เนื้อ", "hint": "chán yàak sàŋ gɛɛŋ-phèt nɯa" },
                    { "en": "I would like to order papaya salad.", "th": "ฉัน อยาก สั่ง ส้มตํา", "hint": "chán yàak sàŋ sôm-dtam" },
                    { "en": "I would like to order thai omelet.", "th": "ฉัน อยาก สั่ง ไข่เจียว", "hint": "chán yàak sàŋ khài-jiaw" },
                    { "en": "I would like to order mango sticky rice.", "th": "ฉัน อยาก สั่ง ข้าวเหนียวมะม่วง", "hint": "chán yàak sàŋ khâaw-nǐaw má-mûaŋ" },
                    { "en": "I would like to order steamed fish.", "th": "ฉัน อยาก สั่ง ปลานึ่ง", "hint": "chán yàak sàŋ bplaa nɯ̂ŋ" },
                    { "en": "I would like to order fried vegetables.", "th": "ฉัน อยาก สั่ง ผัดผัก", "hint": "chán yàak sàŋ phàt-phàk" },
                    { "en": "I would like to order a fruit salad.", "th": "ฉัน อยาก สั่ง สลัดผลไม้", "hint": "chán yàak sàŋ sà-lát phǒn-lá-máy" },
                    { "en": "Excuse me, can I have the bill please?", "th": "ขอ เช็ค บิล ด้วย ครับ/ค่ะ", "hint": "khɔ̌ɔ chék bin dûay khráp/khâ" }
                ]
            },
            {
                "name": "What would you like to drink?",
                "vocabulary": [
                    { "en": "water", "th": "นํา", "hint": "náam" },
                    { "en": "plain water", "th": "นําเปล่า", "hint": "náam-bplàaw" },
                    { "en": "ice", "th": "นําแข็ง", "hint": "náam-khɛ̌ ɛŋ" },
                    { "en": "sugar", "th": "นําตาล", "hint": "náam-dtaan" },
                    { "en": "coffee", "th": "กาแฟ", "hint": "gaa-fɛɛ" },
                    { "en": "tea", "th": "ชา", "hint": "chaa" },
                    { "en": "milk", "th": "นม", "hint": "nom" },
                    { "en": "soda", "th": "โซดา", "hint": "soo-daa" },
                    { "en": "fruit juice", "th": "นําผลไม้", "hint": "náam phǒn-lá-máay" },
                    { "en": "fruit shake or smoothie", "th": "นําผลไม้ปัfน", "hint": "náam phǒn-lá-máay bpàn" },
                    { "en": "soft drik", "th": "นําอัดลม", "hint": "náam àt-lom" },
                    { "en": "beer", "th": "เบียร์", "hint": "bia" },
                    { "en": "liquor", "th": "เหล้า", "hint": "lâw" },
                    { "en": "wine", "th": "ไวน์", "hint": "waay" },
                    { "en": "hot", "th": "ร้อน", "hint": "rɔ́ɔn" },
                    { "en": "cold or iced", "th": "เย็น", "hint": "yen" },
                    { "en": "glass or cup", "th": "แก้ว", "hint": "gɛ̂ɛw" },
                    { "en": "cup", "th": "ถ้วย", "hint": "thûay" },
                    { "en": "carton", "th": "กล่อง", "hint": "glɔ̀ɔŋ" },
                    { "en": "can or tin", "th": "กระป๋อง", "hint": "grà-bpɔ̌ɔŋ" },
                    { "en": "bottle", "th": "ขวด", "hint": "khùat" },
                    { "en": "Orange juice", "th": "นํNาส้ม", "hint": "náam sôm" },
                    { "en": "Lime juice", "th": "นํNามะนาว", "hint": "náam má-naaw" },
                    { "en": "Pineapple juice", "th": "นํNาสับปะรด", "hint": "náam sàp-bpà-rót" },
                    { "en": "Mango juice", "th": "นํNามะม่วง", "hint": "náam má-mûaŋ" },
                    { "en": "Water melon juice", "th": "นํNาแตงโม", "hint": "náam dtɛɛŋ-moo" },
                    { "en": "Grape juice", "th": "นํNาองุน่", "hint": "náam à-ŋùn" },
                    { "en": "Coconut Water", "th": "นํNามะพร้าว", "hint": "náam má-phráaw" },
                    { "en": "Passion fruit juice", "th": "นํNาเสาวรส", "hint": "náam sǎw-wá-rót" },
                    { "en": "Vegetable juice", "th": "นํNาผัก", "hint": "náam phàk" }
                ],
                "structure": [
                    { "en": "What would you like to drink?", "th": "ฉัน อยาก สั่ง", "hint": "chán yàak sàŋ" },
                    { "en": "I would like to order a glass of water.", "th": "ฉัน อยาก สั่ง นํา แก้ว", "hint": "chán yàak sàŋ náam gɛ̂ɛw" },
                    { "en": "I would like to order a cup of hot coffee with sugar and milk.", "th": "ฉัน อยาก สั่ง กาแฟ ร้อน ใส่นํ้าตาล กับ นม ถ้วย", "hint": "chán yàak sàŋ gaa-fɛɛ rɔ́ɔn sài náam-dtaan gàp nom thûay" },
                    { "en": "I would like to order a glass of iced tea with sugar.", "th": "ฉัน อยาก สั่ง ชา เย็น ใส่นํ้าตาล แก้ว", "hint": "chán yàak sàŋ chaa yen sài náam-dtaan gɛ̂ɛw" },
                    { "en": "I would like to order a bottle of soda.", "th": "ฉัน อยาก สั่ง โซดา ขวด", "hint": "chán yàak sàŋ soo-daa khùat" },
                    { "en": "I would like to order a can of beer.", "th": "ฉัน อยาก สั่ง เบียร์ กระป๋อง", "hint": "chán yàak sàŋ bia grà-bpɔ̌ɔŋ" },
                    { "en": "I would like to order a glass of red wine.", "th": "ฉัน อยาก สั่ง ไวน์ แก้ว", "hint": "chán yàak sàŋ waay gɛ̂ɛw" },
                    { "en": "I would like to order a glass of white wine.", "th": "ฉัน อยาก สั่ง ไวน์ ขาว แก้ว", "hint": "chán yàak sàŋ waay khǎaw gɛ̂ɛw" },
                    { "en": "I would like to order a glass of orange juice.", "th": "ฉัน อยาก สั่ง นํNาส้ม แก้ว", "hint": "chán yàak sàŋ náam sôm gɛ̂ɛw" },
                    { "en": "I would like to order a glass of lime juice.", "th": "ฉัน อยาก สั่ง นํNามะนาว แก้ว", "hint": "chán yàak sàŋ náam má-naaw gɛ̂ɛw" },
                    { "en": "I would like to order a glass of pineapple juice.", "th": "ฉัน อยาก สั่ง นํNาสับปะรด แก้ว", "hint": "chán yàak sàŋ náam sàp-bpà-rót gɛ̂ɛw" },
                    { "en": "I would like to order a glass of mango juice.", "th": "ฉัน อยาก สั่ง นํNามะม่วง แก้ว", "hint": "chán yàak sàŋ náam má-mûaŋ gɛ̂ɛw" },
                    { "en": "I would like to order a glass of watermelon juice.", "th": "ฉัน อยาก สั่ง นํNาแตงโม แก้ว", "hint": "chán yàak sàŋ náam dtɛɛŋ-moo gɛ̂ɛw" },
                    { "en": "I would like to order a glass of grape juice.", "th": "ฉัน อยาก สั่ง นํNาองุน่ แก้ว", "hint": "chán yàak sàŋ náam à-ŋùn gɛ̂ɛw" },
                    { "en": "I would like to order a glass of coconut water.", "th": "ฉัน อยาก สั่ง นํNามะพร้าว แก้ว", "hint": "chán yàak sàŋ náam má-phráaw gɛ̂ɛw" },
                    { "en": "I would like to order a glass of passion fruit juice.", "th": "ฉัน อยาก สั่ง นํNาเสาวรส แก้ว", "hint": "chán yàak sàŋ náam sǎw-wá-rót gɛ̂ɛw" },
                    { "en": "I would like to order a glass of vegetable juice.", "th": "ฉัน อยาก สั่ง นํNาผัก แก้ว", "hint": "chán yàak sàŋ náam phàk gɛ̂ɛw" },
                    { "en": "Excuse me, can I have the bill please?", "th": "ขอ เช็ค บิล ด้วย ครับ/ค่ะ", "hint": "khɔ̌ɔ chék bin dûay khráp/khâ" }
                ]
            },
            {
                "name": "Fruits",
                "vocabulary": [
                    { "en": "Fruits", "th": "ผลไม้", "hint": "phǒn-lá-máay" },
                    { "en": "Mango", "th": "มะม่วง", "hint": "má-mûaŋ" },
                    { "en": "Coconut", "th": "มะพร้าว", "hint": "má-phráaw" },
                    { "en": "Watermelon", "th": "แตงโม", "hint": "dtɛɛng-moo" },
                    { "en": "Banana", "th": "กล้วย", "hint": "glûay" },
                    { "en": "Papaya", "th": "มะละกอ", "hint": "má-lá-gɔɔ" },
                    { "en": "Pineapple", "th": "สัปปะรด", "hint": "sàp-bpà-rót" },
                    { "en": "Durian", "th": "ทุเรียน", "hint": "thú-rian" },
                    { "en": "Orange", "th": "ส้ ม", "hint": "sôm" },
                    { "en": "Mangosteen", "th": "มังคุด", "hint": "maŋ-khút" },
                    { "en": "Guava", "th": "ฝรัfง", "hint": "fà-ràŋ" },
                    { "en": "Longan", "th": "ลําไย", "hint": "lam-yai" },
                    { "en": "Strawberry", "th": "สตรอเบอรีf", "hint": "sà-dtrɔɔ-bəə-rîi" },
                    { "en": "Rambutan", "th": "เงาะ", "hint": "ŋɔ́" },
                    { "en": "Grapes", "th": "องุน่", "hint": "à-ŋùn" },
                    { "en": "Passion friut", "th": "เสาวรส", "hint": "sǎw-wá-rót" },
                    { "en": "Cherry", "th": "เชอร์รีf", "hint": "chəə-rîi" },
                    { "en": "Lychee", "th": "ลิNนจีf", "hint": "lín-jìi" },
                    { "en": "Dragon fruit", "th": "แก้วมังกร", "hint": "gɛ̂ ɛw-maŋ-gɔɔn" },
                    { "en": "Jackfruit", "th": "ขนุน", "hint": "khà-nǔn" },
                    { "en": "Ripe or Cooked", "th": "สุก", "hint": "sùk" },
                    { "en": "Raw or Uncooked", "th": "ดิบ", "hint": "dìp" },
                    { "en": "Fresh", "th": "สด", "hint": "sòt" },
                    { "en": "Dry", "th": "แห้ง", "hint": "hɛ̂ɛŋ" },
                    { "en": "Sweet", "th": "หวาน", "hint": "wǎan" },
                    { "en": "Sour", "th": "เปรียNว", "hint": "bprîaw" },
                    { "en": "Piece", "th": "ชิNน", "hint": "chín" },
                    { "en": "Small", "th": "เล็ก", "hint": "lék" },
                    { "en": "Plastic bag", "th": "ถุง", "hint": "tǔŋ" },
                    { "en": "Rotten", "th": "เน่า/เสีย", "hint": "nâw/sǐa" },
                    { "en": "Classifier for the whole fruit", "th": "ลูก/ผล", "hint": "lûuk / phǒn" }
                ],
                "structure": [
                    { "en": "What fruit is this?", "th": "ผลไม้ อะไร", "hint": "phǒn-lá-máy à-rai" },
                    { "en": "This is a mango.", "th": "นี่ คื อมะม่วง", "hint": "nîi khɯɯ má-mûaŋ" },
                    { "en": "This is a watermelon.", "th": "นี่ คื อแตงโม", "hint": "nîi khɯɯ dtɛɛng-moo" },
                    { "en": "This is a banana.", "th": "นี่ คื อกล้วย", "hint": "nîi khɯɯ glûay" },
                    { "en": "This is a pineapple.", "th": "นี่ คื อสับปะรด", "hint": "nîi khɯɯ sàp-bpà-rót" },
                    { "en": "I would like to buy some fruits.", "th": "ฉัน อยาก ซื้อ ผลไม้", "hint": "chán yàak sʉ́ʉ phǒn-lá-máay" },
                    { "en": "I would like to buy a kilo of mangoes.", "th": "ฉัน อยาก ซื้อ มะม่วง หนึ่ง กิโล", "hint": "chán yàak sʉ́ʉ má-mûaŋ nɯ̀ŋ gi-lo" },
                    { "en": "I would like to buy a kilo of bananas.", "th": "ฉัน อยาก ซื้อ กล้วย หนึ่ง กิโล", "hint": "chán yàak sʉ́ʉ glûay nɯ̀ŋ gi-lo" },
                    { "en": "I would like to buy a kilo of pineapples.", "th": "ฉัน อยาก ซื้อ สับปะรด หนึ่ง กิโล", "hint": "chán yàak sʉ́ʉ sàp-bpà-rót nɯ̀ŋ gi-lo" },
                    { "en": "I would like to buy a kilo of oranges.", "th": "ฉัน อยาก ซื้อ ส้ม หนึ่ง กิโล", "hint": "chán yàak sʉ́ʉ sôm nɯ̀ŋ gi-lo" }
                ]
            },
            {
                "name": "colors",
                "vocabulary": [
                    { "en": "Colour", "th": "สี", "hint": "sǐi" },
                    { "en": "White", "th": "สีขาว", "hint": "" },
                    { "en": "Black", "th": "สีดํา", "hint": "sǐi dam" },
                    { "en": "Red", "th": "สีแดง", "hint": "sǐi dɛɛŋ" },
                    { "en": "Yellow", "th": "สีเหลือง", "hint": "sǐi lɯ̌aŋ" },
                    { "en": "Green", "th": "สีเขียว", "hint": "sǐi khǐaw" },
                    { "en": "Dark Blue", "th": "สีนํNาเงิน", "hint": "sǐi náam-ŋəən" },
                    { "en": "Sky blue", "th": "สีฟา้", "hint": "sǐi fáa" },
                    { "en": "Orange", "th": "สีส้ม", "hint": "sǐi sôm" },
                    { "en": "Grey", "th": "สีเทา", "hint": "sǐi thaw" },
                    { "en": "Pink", "th": "สีชมพู", "hint": "sǐi chom-phuu" },
                    { "en": "Purple", "th": "สีมว่ง", "hint": "sǐi mûaŋ" },
                    { "en": "Brown", "th": "สีนํNาตาล", "hint": "sǐi náam-dtaan" },
                    { "en": "Light(Adj)", "th": "อ่อน", "hint": "ɔ̀ɔn" },
                    { "en": "Dark(Adj)", "th": "เข้ม", "hint": "khêm" }
                ],
                "structure": [
                    { "en": "What color is this?", "th": "สี อะไร", "hint": "sǐi à-rai" },
                    { "en": "This is red.", "th": "สี แดง", "hint": "sǐi dɛɛŋ" },
                    { "en": "This is blue.", "th": "สี น้ำเงิน", "hint": "sǐi náam-ngən" },
                    { "en": "This is green.", "th": "สี เขียว", "hint": "sǐi khǐaw" },
                    { "en": "This is yellow.", "th": "สี เหลือง", "hint": "sǐi lǔang" },
                    { "en": "This is black.", "th": "สี ดำ", "hint": "sǐi dam" },
                    { "en": "This is white.", "th": "สี ขาว", "hint": "sǐi khǎaw" },
                    { "en": "This is pink.", "th": "สี ชมพู", "hint": "sǐi chom-phuu" },
                    { "en": "This is purple.", "th": "สี ม่วง", "hint": "sǐi mûaŋ" },
                    { "en": "This is brown.", "th": "สี น้ำตาล", "hint": "sǐi náam-dtaan" },
                    { "en": "This is grey.", "th": "สี เทา", "hint": "sǐi thao" },
                    { "en": "This is orange.", "th": "สี ส้ม", "hint": "sǐi sôm" },
                    { "en": "I like the color blue.", "th": "ฉัน ชอบ สี น้ำเงิน", "hint": "chán chɔ̂ɔp sǐi náam-ŋəən" },
                    { "en": "What are each days color in Thai?", "th": "สี ของแต่ละวันในภาษาไทยคืออะไร", "hint": "sǐi khǎng tàe-lá wan nai phaa-sǎa-thai khʉ̄ à-rai" },
                    { "en": "Monday is yellow.", "th": "วันจันทร์ สี เหลือง", "hint": "wan-jan sǐi lɯ̌aŋ" },
                    { "en": "Tuesday is pink.", "th": "วันอังคาร สี ชมพู", "hint": "wan-ang-kaan sǐi chom-phuu" },
                    { "en": "Wednesday is green.", "th": "วันพุธ สี เขียว", "hint": "wan-phút sǐi khǐaw" },
                    { "en": "Thursday is orange.", "th": "วันพฤหัสบดี สี ส้ม", "hint": "wan-phá-rʉ́-hàt-sà-bɔɔ-dii sǐi sôm" },
                    { "en": "Friday is blue.", "th": "วันศุกร์ สี น้ำเงิน", "hint": "wan-sùk sǐi náam-ŋəən" },
                    { "en": "Saturday is purple.", "th": "วันเสาร์ สี ม่วง", "hint": "wan-sǎo sǐi mûaŋ" },
                    { "en": "Sunday is red.", "th": "วันอาทิตย์ สี แดง", "hint": "wan-aa-thít sǐi dɛɛŋ" }
                ]
            },
            {
                "name": "Classifiers",
                "vocabulary": [
                    { "en": "Classifier", "th": "ลักษณะนาม", "hint": "lák-sà-nà-naam" },
                    { "en": "People", "th": "คน", "hint": "khon" },
                    { "en": "Animals", "th": "สัตว์", "hint": "sàt" },
                    { "en": "Flat objects", "th": "แผ่น/ใบ", "hint": "phɛ̀n/bai" },
                    { "en": "Long objects", "th": "อัน/ชิNน", "hint": "an/chín" },
                    { "en": "Round objects", "th": "ลูก/ผล", "hint": "lûuk/phǒn" },
                    { "en": "Bottles or Cups or Glasses", "th": "ขวด/แก้ว/ถ้วย", "hint": "khùat/gɛ̂ɛw/thûay" },
                    { "en": "Books or Magazines or Newspapers", "th": "เล่ม/ฉบับ/ฉบับพิมพ์", "hint": "" }
                ],
                "structure": [
                    { "en": "How many people?", "th": "คน กี่ คน", "hint": "khon gìi khon" },
                    { "en": "How many animals?", "th": "สัตว์ กี่ ตัว", "hint": "sàt gìi dtua" },
                    { "en": "How many flat objects?", "th": "แผ่น/ใบ กี่ แผ่น/ใบ", "hint": "phɛ̀n/bai gìi phɛ̀n/bai" },
                    { "en": "How many long objects?", "th": "อัน/ชิNน กี่ อัน/ชิNน", "hint": "an/chín gìi an/chín" },
                    { "en": "How many round objects?", "th": "ลูก/ผล กี่ ลูก/ผล", "hint": "lûuk/phǒn gìi lûuk/phǒn" },
                    { "en": "How many bottles or cups or glasses?", "th": "ขวด/แก้ว/ถ้วย กี่ ขวด/แก้ว/ถ้วย", "hint": "khùat/gɛ̂ɛw/thûay gìi khùat/gɛ̂ɛw/thûay" },
                    { "en": "How many books or magazines or newspapers?", "th": "เล่ม/ฉบับ/ฉบับพิมพ์ กี่ เล่ม/ฉบับ/ฉบับพิมพ์", "hint": "lêm/chà-bàp/chà-bàp-phim gìi lêm/chà-bàp/chà-bàp-phim" },
                    { "en": "I have two books.", "th": "ฉัน มี หนังสือ สอง เล่ม", "hint": "chán mii nǎŋ-sɯ̌ɯ sɔ̌ɔŋ lêm" },
                    { "en": "I have three magazines.", "th": "ฉัน มี นิตยสาร สาม ฉบับ", "hint": "chán mii nít-tá-yaa-sǎan săam chà-bàp" },
                    { "en": "I have four newspapers.", "th": "ฉัน มี หนังสือพิมพ์ สี่ ฉบับพิมพ์", "hint": "chán mii nǎŋ-sɯ̌ɯ phim sìi chà-bàp-phim" },
                    { "en": "I have five cups of coffee.", "th": "ฉัน มี กาแฟ ห้า ถ้วย", "hint": "chán mii gaa-fɛɛ hâa thûay" },
                    { "en": "I have six bottles of water.", "th": "ฉัน มี นํา หก ขวด", "hint": "chán mii náam hòk khùat" },
                    { "en": "I have seven plates.", "th": "ฉัน มี จาน เจ็ด ใบ", "hint": "chán mii jaan jèt bai" },
                    { "en": "I have eight pieces of cake.", "th": "ฉัน มี เค้ก แปด ชิNน", "hint": "chán mii khêek bpàet chín" },
                    { "en": "I have nine bowls of soup.", "th": "ฉัน มี ซุป เก้า ชาม", "hint": "chán mii súp kâo chǎam" }
                ]
            },
            {
                "name": "Preposition",
                "vocabulary": [
                    { "en": "There is or There are", "th": "มี", "hint": "mii" },
                    { "en": "On", "th": "บน", "hint": "bon" },
                    { "en": "Under", "th": "ใต้", "hint": "On" },
                    { "en": "Outside", "th": "ข้างนอก", "hint": "khâaŋ-nɔ̂ɔk" },
                    { "en": "Inside", "th": "ข้างใน", "hint": "khâaŋ-nai" },
                    { "en": "Between", "th": "ระหว่าง", "hint": "rá-wàaŋ" },
                    { "en": "At", "th": "ทีf", "hint": "thîi" },
                    { "en": "in front of", "th": "ข้างหน้า", "hint": "khâaŋ-nâa" },
                    { "en": "behind", "th": "ข้างหลัง", "hint": "khâaŋ-lǎŋ" },
                    { "en": "next to", "th": "ติดกับ", "hint": "dtìt-kàp" },
                    { "en": "opposite to", "th": "ตรงข้าม", "hint": "dtrong-khâam" },
                    { "en": "nearby or close to", "th": "ใกล้ๆ", "hint": "glâi-glâi" }
                ],
                "structure": [
                    { "en": "Examples of prepositions in Thai", "th": "โรงพยาบาล อยู่ ที่ ไหน", "hint": "rooŋ-phá-yaa-bâan yùu thîi nǎi" },
                    { "en": "Where is the hospital?", "th": "โรงพยาบาล อยู่ ที่ ไหน", "hint": "rooŋ-phá-yaa-bâan yùu thîi nǎi" },
                    { "en": "The hospital is next to the school.", "th": "โรงพยาบาล อยู่ ติดกับ โรงเรียน", "hint": "rooŋ-phá-yaa-bâan yùu dtìt-kàp rooŋ-rian" },
                    { "en": "The hospital is in front of the bank.", "th": "โรงพยาบาล อยู่ ข้างหน้า ธนาคาร", "hint": "rooŋ-phá-yaa-bâan yùu khâaŋ-nâa thá-náa-khaan" },
                    { "en": "The hospital is behind the post office.", "th": "โรงพยาบาล อยู่ ข้างหลัง ไปรษณีย์", "hint": "rooŋ-phá-yaa-bâan yùu khâaŋ-lǎŋ bprà-sà-nii" },
                    { "en": "The hospital is between the bank and the post office.", "th": "โรงพยาบาล อยู่ ระหว่าง ธนาคาร กับ ไปรษณีย์", "hint": "rooŋ-phá-yaa-bâan yùu rá-wàaŋ thá-náa-khaan gàp bprà-sà-nii" },
                    { "en": "The hospital is on the left side of the road.", "th": "โรงพยาบาล อยู่ ทาง ซ้าย ของ ถนน", "hint": "rooŋ-phá-yaa-bâan yùu thaang sáai khǎng thá-nǒn" },
                    { "en": "The hospital is on the right side of the road.", "th": "โรงพยาบาล อยู่ ทาง ขวา ของ ถนน", "hint": "rooŋ-phá-yaa-bâan yùu thaang khwǎa khǎng thá-nǒn" },
                    { "en": "The hospital is near the school.", "th": "โรงพยาบาล อยู่ ใกล้ๆ โรงเรียน", "hint": "rooŋ-phá-yaa-bâan yùu glâi-glâi rooŋ-rian" },
                    { "en": "The hospital is far from the school.", "th": "โรงพยาบาล อยู่ ไกล จาก โรงเรียน", "hint": "rooŋ-phá-yaa-bâan yùu glai jàak rooŋ-rian" }
                ]
            }
        ]
    },
    {
        "title": "Listening & Speaking 3",
        "lessons": [
            {
                "name": "Time",
                "vocabulary": [
                    { "en": "In the morning", "th": "ตอนเช้า", "hint": "dtɔɔn cháaw" },
                    { "en": "In the late morning", "th": "ตอนสาย", "hint": "dtɔɔn sǎay" },
                    { "en": "At noon", "th": "ตอนเทียง", "hint": "dtɔɔn thîaŋ" },
                    { "en": "In the afternoon", "th": "ตอนบ่าย", "hint": "dtɔɔn bàay" },
                    { "en": "In the evening (before dark)", "th": "ตอนเย็น", "hint": "dtɔɔn yen" },
                    { "en": "In the evening (after dark)", "th": "ตอนคํา", "hint": "dtɔɔn khâm" },
                    { "en": "In the day time", "th": "ตอนกลางวัน", "hint": "dtɔɔn glaaŋ-wan" },
                    { "en": "In the night time", "th": "ตอนกลางคืน", "hint": "dtɔɔn glaaŋ-khɯɯn" },
                    { "en": "Time", "th": "เวลา", "hint": "wee-laa" },
                    { "en": "Clock or Watch or O'clock", "th": "นาฬิกา", "hint": "naa-lí-gaa" },
                    { "en": "O'clock(6.00 AM-6.59PM)", "th": "โมง", "hint": "mooŋ" },
                    { "en": "O'clock(7.00PM-11.59PM)", "th": "ทุม", "hint": "thûm" },
                    { "en": "O'clock(1.00AM-5.59AM)", "th": "ตี", "hint": "dtii" },
                    { "en": "About or Approximately", "th": "ประมาณ", "hint": "bprà-maan" },
                    { "en": "Sharp", "th": "ตรง", "hint": "dtroŋ" },
                    { "en": "Hour", "th": "ชัวโมง", "hint": "chûa-mooŋ" },
                    { "en": "Minute", "th": "นาที", "hint": "naa-thii" },
                    { "en": "Second", "th": "วินาที", "hint": "wí-naa-thii!" },
                    { "en": "Half", "th": "ครึง", "hint": "khrɯ̂ŋ" },
                    { "en": "Long", "th": "นาน", "hint": "naan" },
                    { "en": "Early", "th": "เช้า", "hint": "cháaw" },
                    { "en": "Late", "th": "สาย", "hint": "sǎay" },
                    { "en": "Before", "th": "ก่อน", "hint": "gɔ̀ɔn" },
                    { "en": "After", "th": "หลัง", "hint": "lǎŋ" },
                    { "en": "Wait for a minute", "th": "รอแป๊ปนึง", "hint": "rɔɔ bpɛ́ɛp-nʉng" },
                    { "en": "Now", "th": "ตอนนี", "hint": "dtɔɔn-níi" },
                    { "en": "Right now", "th": "เดีƒยวนี", "hint": "dǐaw-níi" },
                    { "en": "Time", "th": "เวลา", "hint": "wee-laa" },
                    { "en": "Hour", "th": "ชั่วโมง", "hint": "chûa-mɔ́ŋ" },
                    { "en": "Minute", "th": "นาที", "hint": "naa-thii" },
                    { "en": "Second", "th": "วินาที", "hint": "wí-naa-thii" },
                    { "en": "Day", "th": "วัน", "hint": "wan" },
                    { "en": "Week", "th": "สัปดาห์", "hint": "sàp-daa" },
                    { "en": "Month", "th": "เดือน", "hint": "dʉʉan" },
                    { "en": "Year", "th": "ปี", "hint": "pii" },
                    { "en": "Today", "th": "(วันนี้)", "hint": "(wan-níi)" },
                    { "en": "Tomorrow", "th": "(พรุ่งนี้)", "hint": "(phrûng-níi)" },
                    { "en": "Yesterday", "th": "(เมื่อวานนี้)", "hint": "(mʉ̂a-wan-níi)" }
                ],
                "structure":
                    [
                        { "en": "What time is it?", "th": "กี่ โมง", "hint": "gìi mooŋ" },
                        { "en": "It is 8 o'clock", "th": "แปด โมง", "hint": "bpɛ̀ɛt mooŋ" },
                        { "en": "It is 8.30", "th": "แปด โมง ครึง", "hint": "bpɛ̀ɛt mooŋ khrɯ̂ŋ" },
                        { "en": "It is 8.45", "th": "แปด โมง สี่สิบห้า", "hint": "bpɛ̀ɛt mooŋ sìi-sìp-hâa" },
                        { "en": "It is 8.50", "th": "แปด โมง ห้าสิบ", "hint": "bpɛ̀ɛt mooŋ hâa-sìp" },
                        { "en": "It is 8.55", "th": "แปด โมง ห้าสิบห้า", "hint": "bpɛ̀ɛt mooŋ hâa-sìp-hâa" },
                        { "en": "It is 9 o'clock", "th": "เก้า โมง", "hint": "gâo mooŋ" },
                        { "en": "It is 9.15", "th": "เก้า โมง สิบห้า", "hint": "gâo mooŋ sìp-hâa" },
                        { "en": "It is 9.30", "th": "เก้า โมง ครึง", "hint": "gâo mooŋ khrɯ̂ŋ" },
                        { "en": "It is 9.45", "th": "เก้า โมง สี่สิบห้า", "hint": "gâo mooŋ sìi-sìp-hâa" },
                        { "en": "It is 10 o'clock", "th": "สิบ โมง", "hint": "sìp mooŋ" },
                        { "en": "It is 10.15", "th": "สิบ โมง สิบห้า", "hint": "sìp mooŋ sìp-hâa" },
                        { "en": "It is 10.30", "th": "สิบ โมง ครึง", "hint": "sìp mooŋ khrɯ̂ŋ" },
                        { "en": "It is 10.45", "th": "สิบ โมง สี่สิบห้า", "hint": "sìp mooŋ sìi-sìp-hâa" },
                        { "en": "It is 11 o'clock", "th": "สิบเอ็ด โมง", "hint": "sìp-èt mooŋ" },
                        { "en": "It is 11.15", "th": "สิบเอ็ด โมง สิบห้า", "hint": "sìp-èt mooŋ sìp-hâa" },
                        { "en": "It is 11.30", "th": "สิบเอ็ด โมง ครึง", "hint": "sìp-èt mooŋ khrɯ̂ŋ" },
                        { "en": "It is 11.45", "th": "สิบเอ็ด โมง สี่สิบห้า", "hint": "sìp-èt mooŋ sìi-sìp-hâa" },
                        { "en": "It is 12 o'clock", "th": "เทียง", "hint": "thîaŋ" },
                        { "en": "It is 12.15", "th": "เทียง สิบห้า", "hint": "thîaŋ sìp-hâa" },
                        { "en": "It is 12.30", "th": "เทียง ครึง", "hint": "thîaŋ khrɯ̂ŋ" },
                        { "en": "It is 12.45", "th": "เทียง สี่สิบห้า", "hint": "thîaŋ sìi-sìp-hâa" }
                    ]
            },
            {
                "name": "Days",
                "vocabulary": [
                    { "en": "Monday", "th": "วันจันทร์", "hint": "wan-jan" },
                    { "en": "Tuesday", "th": "วันอังคาร", "hint": "wan aŋ-khaan" },
                    { "en": "Wednesday", "th": "วันพุธ", "hint": "wan-phút" },
                    { "en": "Thursday", "th": "วันพฤหัสบดี", "hint": "wan phá-rɯ-hàt" },
                    { "en": "Friday", "th": "วันศุกร์", "hint": "wan-sùk" },
                    { "en": "Saturday", "th": "วันเสาร์", "hint": "wan-sǎw" },
                    { "en": "Sunday", "th": "วันอาทิตย์", "hint": "wan aa-thít" },
                    { "en": "Weekend", "th": "วันเสาร์อาทิตย์", "hint": "wan-sǎw aa-thít" },
                    { "en": "Day", "th": "วัน", "hint": "wan" },
                    { "en": "Date", "th": "วันที", "hint": "wan-thiî" },
                    { "en": "Today", "th": "วันนี", "hint": "wan-níi" },
                    { "en": "Tomorrow", "th": "วันพรุ่งนี", "hint": "wan phrûŋ-níi" },
                    { "en": "Yesterday", "th": "เมือวานนี", "hint": "mɯ̂a-waan-níi" },
                    { "en": "The day after tomorrow", "th": "วันมะรืนนี", "hint": "wan má-rɯɯn-níi" },
                    { "en": "The day before yesterday", "th": "(เมือ)วานซืน", "hint": "(mɯ̂a)-waan-sɯɯn" },
                    { "en": "Holiday", "th": "วันหยุด", "hint": "wan-yùt" },
                    { "en": "Birthday", "th": "วันเกิด", "hint": "wan-gə̀ət" },
                    { "en": "Weekdays", "th": "วันธรรมดา", "hint": "wan tham-má-daa" },
                    { "en": "Every", "th": "ทุก", "hint": "thúk" },
                    { "en": "All or Throughout", "th": "ทังy", "hint": "tháŋ" },
                    { "en": "Day", "th": "วัน", "hint": "Wan" },
                    { "en": "Week", "th": "อาทิตย์", "hint": "aa-thít" },
                    { "en": "Month", "th": "เดือน", "hint": "dɯan" },
                    { "en": "year", "th": "ปี", "hint": "bpii" }
                ],
                "structure":
                    [
                        { "en": "What day is it today?", "th": "วัน นี้ วัน อะไร", "hint": "wan-níi wan à-rai" },
                        { "en": "Today is Monday", "th": "วัน นี้ วัน จันทร์", "hint": "wan-níi wan-jan" },
                        { "en": "Today is Tuesday", "th": "วัน นี้ วัน อังคาร", "hint": "wan-níi wan aŋ-khaan" },
                        { "en": "Today is Wednesday", "th": "วัน นี้ วัน พุธ", "hint": "wan-níi wan-phút" },
                        { "en": "Today is Thursday", "th": "วัน นี้ วัน พฤหัสบดี", "hint": "wan-níi wan phá-rɯ-hàt" },
                        { "en": "Today is Friday", "th": "วัน นี้ วัน ศุกร์", "hint": "wan-níi wan-sùk" },
                        { "en": "Today is Saturday", "th": "วัน นี้ วัน เสาร์", "hint": "wan-níi wan-sǎw" },
                        { "en": "Today is Sunday", "th": "วัน นี้วันอาทิตย์", "hint": "wan-níi wan aa-thít" },
                        { "en": "What day is it tomorrow?", "th": "วัน พรุ่งนี วัน อะไร", "hint": "wan phrûŋ-níi wan à-rai" },
                        { "en": "Tomorrow is Monday", "th": "วัน พรุ่งนี วัน จันทร์", "hint": "wan phrûŋ-níi wan-jan" },
                        { "en": "Tomorrow is Tuesday", "th": "วัน พรุ่งนี วัน อังคาร", "hint": "wan phrûŋ-níi wan aŋ-khaan" },
                        { "en": "Tomorrow is Wednesday", "th": "วัน พรุ่งนี วัน พุธ", "hint": "wan phrûŋ-níi wan-phút" },
                        { "en": "Tomorrow is Thursday", "th": "วัน พรุ่งนี วัน พฤหัสบดี", "hint": "wan phrûŋ-níi wan phá-rɯ-hàt" },
                        { "en": "Tomorrow is Friday", "th": "วัน พรุ่งนี วัน ศุกร์", "hint": "wan phrûŋ-níi wan-sùk" },
                        { "en": "Tomorrow is Saturday", "th": "วัน พรุ่งนี วัน เสาร์", "hint": "wan phrûŋ-níi wan-sǎw" },
                        { "en": "Tomorrow is Sunday", "th": "วัน พรุ่งนี วัน อาทิตย์", "hint": "wan phrûŋ-níi wan aa-thít" },
                        { "en": "What day was it yesterday?", "th": "เมื่อวานนี วัน อะไร", "hint": "mɯ̂a-waan-níi wan à-rai" },
                        { "en": "Yesterday was Monday", "th": "เมื่อวานนี วัน จันทร์", "hint": "mɯ̂a-waan-níi wan-jan" },
                        { "en": "Yesterday was Tuesday", "th": "เมื่อวานนี วัน อังคาร", "hint": "mɯ̂a-waan-níi wan aŋ-khaan" },
                        { "en": "Yesterday was Wednesday", "th": "เมื่อวานนี วัน พุธ", "hint": "mɯ̂a-waan-níi wan-phút" },
                        { "en": "Yesterday was Thursday", "th": "เมื่อวานนี วัน พฤหัสบดี", "hint": "mɯ̂a-waan-níi wan phá-rɯ-hàt" },
                        { "en": "Yesterday was Friday", "th": "เมื่อวานนี วัน ศุกร์", "hint": "mɯ̂a-waan-níi wan-sùk" },
                        { "en": "Yesterday was Saturday", "th": "เมื่อวานนี วัน เสาร์", "hint": "mɯ̂a-waan-níi wan-sǎw" },
                        { "en": "Yesterday was Sunday", "th": "เมื่อวานนี วัน อาทิตย์", "hint": "mɯ̂a-waan-níi wan aa-thít" }
                    ]
            },
            {
                "name": "Months/year/seasons",
                "vocabulary": [
                    { "en": "Month", "th": "เดือน", "hint": "dɯan" },
                    { "en": "January", "th": "มกราคม", "hint": "mók-gà-raa-khom" },
                    { "en": "February", "th": "กุมภาพันธ์", "hint": "gum-phaa-phan" },
                    { "en": "March", "th": "มีนาคม", "hint": "mii-naa-khom" },
                    { "en": "April", "th": "เมษายน", "hint": "mee-sǎa-yon" },
                    { "en": "May", "th": "พฤษภาคม", "hint": "phrɯt-sà-phaa-khom" },
                    { "en": "June", "th": "มิถนายน", "hint": "mii-naa-khom" },
                    { "en": "July", "th": "กรกฎาคม", "hint": "gà-rá-gà-daa-khom" },
                    { "en": "August", "th": "สิงหาคม", "hint": "sǐŋ-hǎa-khom" },
                    { "en": "September", "th": "กันยายน", "hint": "gan-yaa-yon" },
                    { "en": "October", "th": "ตุลาคม", "hint": "dtù-laa-khom" },
                    { "en": "November", "th": "พฤศจิกายน", "hint": "phrɯt-sà-jì-gaa-yon" },
                    { "en": "December", "th": "ธันวาคม", "hint": "than-waa-khom" },
                    { "en": "Year", "th": "ปี", "hint": "bpii" },
                    /*
                                        { "en": "C.E.", "th": "ปี ค.ศ", "hint": "bpii khɔɔ-sɔ̌ɔ" },
                                        { "en": "B.E.", "th": "ปี พ.ศ.", "hint": "bpii phɔɔ-sɔ̌ɔ" },
                                        { "en": "A.D.", "th": "ปี ค.ศ", "hint": "bpii khɔɔ-sɔ̌ɔ" },
                                        { "en": "B.C.", "th": "ปีก่อนคริสต์ศักราช", "hint": "bpii kɔ̀ɔn khrit-sàk-kà-râat" },
                    */
                    { "en": "Season", "th": "ฤดู", "hint": "rɯ́-duu" },
                    { "en": "Summer", "th": "ฤดูร้อน", "hint": "rɯ́-duu rɔ́ɔn" },
                    { "en": "Rainy season", "th": "ฤดูฝน", "hint": "rɯ́-duu fǒn" },
                    { "en": "Winter", "th": "ฤดูหนาว", "hint": "rɯ́-duu nǎao" },
                    { "en": "Spring", "th": "ฤดูใบไม้ผลิ", "hint": "rɯ́-duu bai-mái phlì" },
                    { "en": "Autumn", "th": "ฤดูใบไม้ร่วง", "hint": "rɯ́-duu bai-mái rûaŋ" },
                    { "en": "Weather", "th": "อากาศ", "hint": "aa-kàat" },
                    { "en": "Hot", "th": "ร้อน", "hint": "rɔ́ɔn" },
                    { "en": "Cold", "th": "หนาว", "hint": "nǎao" },
                    { "en": "Cool", "th": "เย็น", "hint": "yen" },
                    { "en": "Windy", "th": "มีลม", "hint": "" },
                    { "en": "Rainy", "th": "มีฝน", "hint": "" },
                    { "en": "Sunny", "th": "มีแดด", "hint": "" },
                    { "en": "Cloudy", "th": "มีเมฆ", "hint": "" },
                    { "en": "Foggy", "th": "มีหมอก", "hint": "" },
                    { "en": "Snowy", "th": "มีหิมะตก", "hint": "" }
                ],
                "structure":
                    [
                        { "en": "What month is it?", "th": "เดือน อะไร", "hint": "dʉʉan à-rai" },
                        { "en": "It is January", "th": "เดือน มกราคม", "hint": "dʉʉan mók-ka-ra-khom" },
                        { "en": "It is February", "th": "เดือน กุมภาพันธ์", "hint": "dʉʉan kum-phaa-phan" },
                        { "en": "It is March", "th": "เดือน มีนาคม", "hint": "dʉʉan mii-naa-khom" },
                        { "en": "It is April", "th": "เดือน เมษายน", "hint": "dʉʉan mɛ̂ɛ-sǎa-yon" },
                        { "en": "It is May", "th": "เดือน พฤษภาคม", "hint": "dʉʉan phrɯ́t-sà-phaa-khom" },
                        { "en": "It is June", "th": "เดือน มิถุนายน", "hint": "dʉʉan mii-thu-naa-yon" },
                        { "en": "It is July", "th": "เดือน กรกฎาคม", "hint": "dʉʉan gà-rá-gà-daa-khom" },
                        { "en": "It is August", "th": "เดือน สิงหาคม", "hint": "dʉʉan sǐŋ-hǎa-khom" },
                        { "en": "What is the weather like?", "th": "อากาศ เป็น ยังไงบ้าง?", "hint": "aa-kàat bpen yaŋ-ngai bâaŋ?" },
                        { "en": "Today is hot.", "th": "วันนี้ ร้อน", "hint": "wan-níi rɔ́ɔn." },
                        { "en": "Today is cold.", "th": "วันนี้ หนาว", "hint": "wan-níi nǎao." },
                        { "en": "Today is cool.", "th": "วันนี้ เย็น", "hint": "wan-níi yen." },
                        { "en": "Today is windy.", "th": "วันนี้ มีลม", "hint": "wan-níi mii lɔm." },
                        { "en": "Today is rainy.", "th": "วันนี้ มีฝน", "hint": "wan-níi mii fǒn." },
                        { "en": "Today is sunny.", "th": "วันนี้ มีแดด", "hint": "wan-níi mii dɛ̀ɛt." },
                        { "en": "Today is cloudy.", "th": "วันนี้ มีเมฆ", "hint": "wan-níi mii mɛ̂ɛk." },
                        { "en": "Today is foggy.", "th": "วันนี้ มีหมอก", "hint": "wan-níi mii mɔ̀ɔk." },
                        { "en": "Today is snowy.", "th": "วันนี้ มีหิมะตก", "hint": "wan-níi mii hìmá dtòk." },
                        { "en": "What season is it?", "th": "ฤดู อะไร", "hint": "rɯ́-duu à-rai" },
                        { "en": "It is summer.", "th": "ฤดู ร้อน", "hint": "rɯ́-duu rɔ́ɔn" },
                        { "en": "It is rainy season.", "th": "ฤดู ฝน", "hint": "rɯ́-duu fǒn" },
                        { "en": "It is winter.", "th": "ฤดู หนาว", "hint": "rɯ́-duu nǎao" }
                    ]
            },
            {
                "name": "Family",
                "vocabulary": [
                    { "en": "Family ", "th": "ครอบครัว", "hint": "khrɔ́ɔp-khrua" },
                    { "en": "Father", "th": "พ่อ", "hint": "phɔ̂ɔ" },
                    { "en": "Mother", "th": "แม่", "hint": "mɛ̂ɛ" },
                    { "en": "A person who is older than you", "th": "พี", "hint": "phîi" },
                    { "en": "A person who is younger than you", "th": "น้อง", "hint": "nɔ́ɔŋ" },
                    { "en": "Sibling", "th": "พีน้อง", "hint": "phîi-nɔ́ɔŋ" },
                    { "en": "Older sister", "th": "พีสาว", "hint": "phîi-sǎaw" },
                    { "en": "Younger sister", "th": "น้องสาว", "hint": "nɔ́ɔŋ-sǎaw" },
                    { "en": "Older brother", "th": "พีชาย", "hint": "phîi-chaay" },
                    { "en": "Younger brother", "th": "น้องชาย", "hint": "nɔ́ɔŋ-chaay" },
                    { "en": "Child", "th": "ลูก", "hint": "lûuk" },
                    { "en": "Daughter", "th": "ลูกสาว", "hint": "lûuk-sǎaw" },
                    { "en": "Son", "th": "ลูกชาย", "hint": "lûuk-chaay" },
                    { "en": "Niece or Grand daughter", "th": "หลานสาว", "hint": "lǎan-sǎaw" },
                    { "en": "Nephew o Grand son", "th": "หลานชาย", "hint": "lǎan-chaay" },
                    { "en": "Grandfather", "th": "ปู ่/ตา", "hint": "bpùu/dtaa" },
                    { "en": "Grandmother", "th": "ย่า/ยาย", "hint": "yâa/yaay" },
                    { "en": "Uncle", "th": "ลุง", "hint": "luŋ" },
                    { "en": "Aunt", "th": "ป้า", "hint": "bpâa" },
                    { "en": "Aunt or Uncle (younger)", "th": "น้า", "hint": "náa" },
                    { "en": "Aunt or Uncle (older)", "th": "อา", "hint": "aa" },
                    { "en": "Husband", "th": "สามี", "hint": "sǎa-mii" },
                    { "en": "Wife", "th": "ภรรยา", "hint": "Phan-rá-yaa" },
                    { "en": "Boyfriend or Girlfriend", "th": "แฟน", "hint": "fɛɛn" },
                    { "en": "Relatives", "th": "ญาติ", "hint": "yâat" },
                    { "en": "Cousin", "th": "ลูกพี่ลูกน้อง", "hint": "lûuk-phîi-lûuk-nɔ́ɔŋ" }
                ],
                "structure":
                    [
                        { "en": "Who is this?", "th": "นี ใคร", "hint": "nîi khrai" },
                        { "en": "This is my father", "th": "นี พ่อ ของ ฉัน", "hint": "nîi phɔ̂ɔ khɔ̌ŋ chǎn" },
                        { "en": "This is my mother", "th": "นี แม่ ของ ฉัน", "hint": "nîi mɛ̂ɛ khɔ̌ŋ chǎn" },
                        { "en": "This is my brother", "th": "นี น้องชาย ของ ฉัน", "hint": "nîi nɔ́ɔŋ-chaay khɔ̌ŋ chǎn" },
                        { "en": "This is my sister", "th": "นี น้องสาว ของ ฉัน", "hint": "nîi nɔ́ɔŋ-sǎaw khɔ̌ŋ chǎn" },
                        { "en": "This is my son", "th": "นี ลูกชาย ของ ฉัน", "hint": "nîi lûuk-chaay khɔ̌ŋ chǎn" },
                        { "en": "This is my daughter", "th": "นี ลูกสาว ของ ฉัน", "hint": "nîi lûuk-sǎaw khɔ̌ŋ chǎn" },
                        { "en": "This is my uncle", "th": "นี น้าของ ฉัน", "hint": "nîi nâa khɔ̌ŋ chǎn" },
                        { "en": "This is my aunt", "th": "นี น้าของ ฉัน", "hint": "nîi nâa khɔ̌ŋ chǎn" },
                        { "en": "This is my grandfather", "th": "นี ตาของ ฉัน", "hint": "nîi dtaa khɔ̌ŋ chǎn" },
                        { "en": "This is my grandmother", "th": "นี ยายของ ฉัน", "hint": "nîi yaay khɔ̌ŋ chǎn" }
                    ]
            },
            {
                "name": "Occupation",
                "vocabulary": [
                    { "en": "Work or Job", "th": "งาน", "hint": "ŋaan" },
                    { "en": "To work", "th": "ทํางาน", "hint": "tham-ŋaan" },
                    { "en": "Student", "th": "นักเรียน", "hint": "nák-rian" },
                    { "en": "Business person", "th": "นักธุรกิจ", "hint": "nák thú-rá-gìt" },
                    { "en": "Musician", "th": "นักดนตรี", "hint": "nák don-dtrii" },
                    { "en": "Writer", "th": "นักเขียน", "hint": "nák-khǐan" },
                    { "en": "Teacher", "th": "ครู", "hint": "khruu" },
                    { "en": "Doctor", "th": "หมอ", "hint": "mɔ̌ɔ" },
                    { "en": "Dentist", "th": "หมอฟัน", "hint": "mɔ̌ɔ-fan" },
                    { "en": "Nurse", "th": "พยาบาล", "hint": "phá-yaa-baan" },
                    { "en": "Police", "th": "ตํารวจ", "hint": "dtam-rùat" },
                    { "en": "Soldier", "th": "ทหาร", "hint": "thá-hǎan" },
                    { "en": "Engineer", "th": "วิศวกร", "hint": "wít-sà-wá-gɔɔn" },
                    { "en": "Pharmacist", "th": "เภสั ", "hint": "phee-sàt-chàt-gɔɔn" },
                    { "en": "Vendor", "th": "พ่อค้า/แม่ค้า", "hint": "phɔ̂ɔ-kháa/mɛ̂ɛ-kháa" },
                    { "en": "Staff or Worker", "th": "พนักงาน", "hint": "phá-nák ŋaan" },
                    { "en": "Freelancer", "th": "ฟรีแลนซ์", "hint": "frii-lɛ́ɛn" },
                    { "en": "Maid or Housewife", "th": "แม่บ้าน", "hint": "mɛ̂ɛ bâan" },
                    { "en": "Security guard", "th": "ยาม", "hint": "yaam" },
                    { "en": "Technician", "th": "ช่าง", "hint": "châaŋ" }
                ],
                "structure":
                    [
                        { "en": "What is your job?", "th": "คุณ ทํางาน อะไร", "hint": "khun tham-ŋaan à-rai" },
                        { "en": "I am a student", "th": "ฉัน เป็น นักเรียน", "hint": "chǎn bpen nák-rian" },
                        { "en": "I am a teacher", "th": "ฉัน เป็น ครู", "hint": "chǎn bpen khruu" },
                        { "en": "I am a doctor", "th": "ฉัน เป็น หมอ", "hint": "chǎn bpen mɔ̌ɔ" },
                        { "en": "I am a nurse", "th": "ฉัน เป็น พยาบาล", "hint": "chǎn bpen phá-yaa-baan" },
                        { "en": "I am a police officer", "th": "ฉัน เป็น ตํารวจ", "hint": "chǎn bpen dtam-rùat" },
                        { "en": "I am an engineer", "th": "ฉัน เป็น วิศวกร", "hint": "chǎn bpen wít-sà-wá-gɔɔn" },
                        { "en": "I am staff", "th": "ฉัน เป็น พนักงาน", "hint": "chǎn bpen phá-nák ŋaan" }
                    ]
            },
            {
                "name": "What does he/she loo like?",
                "vocabulary": [
                    { "en": "Eyes", "th": "ตา", "hint": "dtaa" },
                    { "en": "Mouth", "th": "ปาก", "hint": "bpàak" },
                    { "en": "Skin", "th": "ผิว", "hint": "phǐw" },
                    { "en": "Hair", "th": "ผม", "hint": "phǒm" },
                    { "en": "Nose", "th": "จมูก", "hint": "Jà-mùuk" },
                    { "en": "Eyebrows", "th": "คิyว", "hint": "khíw" },
                    { "en": "Face", "th": "หน้า", "hint": "nâa" },
                    { "en": "Face", "th": "หน้าตา", "hint": "nâa-dtaa" },
                    { "en": "Shape", "th": "รูปร่าง", "hint": "rûup-râaŋ" },
                    { "en": "Height", "th": "ส่วนสูง", "hint": "Sùan-sǔuŋ" },
                    { "en": "Weight", "th": "นํyาหนัก", "hint": "Náam-nàk" }
                ],
                "structure":
                    [
                        { "en": "What does he or she look like?", "th": "เขา หน้าตา เป็นยังไง", "hint": "khǎo nâa-dtaa bpen yaŋ-ngai" },
                        { "en": "He or She is tall", "th": "เขา สูง", "hint": "khǎo sǔuŋ" },
                        { "en": "He or She is short", "th": "เขา สั้น", "hint": "khǎo sâŋ" },
                        { "en": "He or She is fat", "th": "เขา อ้วน", "hint": "khǎo ûan" },
                        { "en": "He or She is thin", "th": "เขา ผอม", "hint": "khǎo phɔ̌ɔm" },
                        { "en": "He or She is beautiful", "th": "เขา สวย", "hint": "khǎo sǔay" },
                        { "en": "He or She is handsome", "th": "เขาหล่อ", "hint": "khǎo lɔ̀ɔ" },
                        { "en": "He or She has big eyes", "th": "เขา ตา ใหญ่", "hint": "khǎo dtaa yài" },
                        { "en": "He or She has small eyes", "th": "เขา ตา เล็ก", "hint": "khǎo dtaa lék" },
                        { "en": "He or She has a big nose", "th": "เขา จมูก ใหญ่", "hint": "khǎo jà-mùuk yài" },
                        { "en": "He or She has a small nose", "th": "เขา จมูก เล็ก", "hint": "khǎo jà-mùuk lék" },
                        { "en": "He or She has curly hair", "th": "เขา ผม หยิก", "hint": "khǎo phǒm yìk" },
                        { "en": "He or She has straight hair", "th": "เขา ผม ตรง", "hint": "khǎo phǒm dtrong" },
                        { "en": "He or She has wavy hair", "th": "เขา ผม เป็นลอน", "hint": "khǎo phǒm bpen lɔɔn" },
                        { "en": "He or She has fair skin", "th": "เขา ผิว ขาว", "hint": "khǎo phǐw khǎaw" },
                        { "en": "He or She has dark skin", "th": "เขา ผิว ดํา", "hint": "khǎo phǐw dam" }
                    ]
            }
        ]
    },
    {
        "title": "Listening & Speaking 4",
        "lessons": [
            {
                "name": "Body parts",
                "vocabulary": [
                    { "en": "body", "th": "ร่างกาย", "hint": "râaŋ-gaai" },
                    { "en": "self", "th": "ตัว", "hint": "dtua" },
                    { "en": "head", "th": "หัว", "hint": "hǔa" },
                    { "en": "eye", "th": "ตา", "hint": "dtaa" },
                    { "en": "nose", "th": "จมูก", "hint": "jà-mùuk" },
                    { "en": "mouth", "th": "ปาก", "hint": "bpàak" },
                    { "en": "ear", "th": "หู", "hint": "hǔu" },
                    { "en": "neck", "th": "คอ", "hint": "khɔɔ" },
                    { "en": "shoulder", "th": "ไหล่", "hint": "làj" },
                    { "en": "back", "th": "หลัง", "hint": "lǎŋ" },
                    { "en": "arm", "th": "แขน", "hint": "khɛ̌ɛn" },
                    { "en": "hand", "th": "มือ", "hint": "mʉʉ" },
                    { "en": "legs", "th": "ขา", "hint": "khǎa" },
                    { "en": "knee", "th": "เข่า", "hint": "khàaw" },
                    { "en": "Feet", "th": "เท้า", "hint": "tháaw" },
                    { "en": "stomach", "th": "ท้อง", "hint": "thɔ́ɔŋ" },
                    { "en": "teeth", "th": "ฟัน", "hint": "fan" },
                    { "en": "face", "th": "หน้า", "hint": "nâa" },
                    { "en": "finger", "th": "นิ้วมือ", "hint": "níw-mʉʉ" },
                    { "en": "chest", "th": "อก", "hint": "" },
                    { "en": "belly", "th": "พุง", "hint": "" },
                    { "en": "hair", "th": "ผม", "hint": "phǒm" },
                    { "en": "skin", "th": "ผิว", "hint": "phǐw" },
                    { "en": "nail", "th": "เล็บ", "hint": "" },
                    { "en": "lip", "th": "ริมฝีปาก", "hint": "" },
                    { "en": "eyebrow", "th": "คิ้ว", "hint": "" },
                    { "en": "mustache", "th": "หนวด", "hint": "" },
                    { "en": "beard", "th": "เครา", "hint": "" }
                ],
                "structure":
                    [
                        { "en": "What is this?", "th": "นี อะไร", "hint": "nîi à-rai" },
                        { "en": "This is a body part", "th": "นี เป็น อวัยวะ", "hint": "nîi bpen à-wai-yá-wá" },
                        { "en": "This is my head", "th": "นี หัว ของ ฉัน", "hint": "nîi hǔa khɔ̌ŋ chǎn" },
                        { "en": "This is my eye", "th": "นี ตา ของ ฉัน", "hint": "nîi dtaa khɔ̌ŋ chǎn" },
                        { "en": "This is my mouth", "th": "นี ปาก ของ ฉัน", "hint": "nîi bpàak khɔ̌ŋ chǎn" },
                        { "en": "This is my nose", "th": "นี จมูก ของ ฉัน", "hint": "nîi jà-mùuk khɔ̌ŋ chǎn" },
                        { "en": "This is my ear", "th": "นี หู ของ ฉัน", "hint": "nîi hǔu khɔ̌ŋ chǎn" },
                        { "en": "This is my neck", "th": "นี คอ ของ ฉัน", "hint": "nîi khɔɔ khɔ̌ŋ chǎn" },
                        { "en": "This is my shoulder", "th": "นี ไหล่ ของ ฉัน", "hint": "nîi làj khɔ̌ŋ chǎn" },
                        { "en": "This is my back", "th": "นี หลัง ของ ฉัน", "hint": "nîi lǎŋ khɔ̌ŋ chǎn" },
                        { "en": "This is my arm", "th": "นี แขน ของ ฉัน", "hint": "nîi khɛ̌ɛn khɔ̌ŋ chǎn" },
                        { "en": "This is my hand", "th": "นี มือ ของ ฉัน", "hint": "nîi mʉʉ khɔ̌ŋ chǎn" },
                        { "en": "This is my leg", "th": "นี ขา ของ ฉัน", "hint": "nîi khǎa khɔ̌ŋ chǎn" },
                        { "en": "This is my knee", "th": "นี เข่า ของ ฉัน", "hint": "nîi khàaw khɔ̌ŋ chǎn" },
                        { "en": "This is my foot", "th": "นี เท้า ของ ฉัน", "hint": "nîi tháaw khɔ̌ŋ chǎn" },
                        { "en": "This is my stomach", "th": "นี ท้อง ของ ฉัน", "hint": "nîi nàa-má-thɔ́ɔŋ khɔ̌ŋ chǎn" },
                        { "en": "This is my teeth", "th": "นี ฟัน ของ ฉัน", "hint": "nîi fan khɔ̌ŋ chǎn" },
                        { "en": "This is my face", "th": "นี หน้า ของ ฉัน", "hint": "nîi nâa khɔ̌ŋ chǎn" },
                        { "en": "This is not a head", "th": "นี ไม่ใช่ หัว", "hint": "nîi mâi châi hǔa" },
                        { "en": "This is not a body part", "th": "นี ไม่ใช่ อวัยวะ", "hint": "nîi mâi châi à-wai-yá-wá" },
                        { "en": "This is not a finger", "th": "นี ไม่ใช่ นิ้วมือ", "hint": "nîi mâi châi níw-mʉʉ" },
                        { "en": "This is not a chest", "th": "นี ไม่ใช่ อก", "hint": "nîi mâi châi ɔ̀k" },
                        { "en": "This is not a back", "th": "นี ไม่ใช่ หลัง", "hint": "nîi mâi châi lǎŋ" },
                        { "en": "This is not a leg", "th": "นี ไม่ใช่ ขา", "hint": "nîi mâi châi khǎa" },
                        { "en": "This is not a knee", "th": "นี ไม่ใช่ เข่า", "hint": "nîi mâi châi khàaw" }
                    ]
            },
            {
                "name": "Sickness",
                "vocabulary": [
                    { "en": "hurt", "th": "เจ็บ", "hint": "jèp" },
                    { "en": "Ache or Sore", "th": "ปวด", "hint": "bpùat" },
                    { "en": "Ache or Stiff", "th": "เมือย", "hint": "mɯ̂ay" },
                    { "en": "Itchy", "th": "คัน", "hint": "itchy" },
                    { "en": "Have a cold", "th": "เป็นหวัด", "hint": "bpen wàt" },
                    { "en": "Have a fever", "th": "เป็นไข้ / มีไข้", "hint": "bpen khâi/mii khâi" },
                    { "en": "To Faint", "th": "เป็นลม", "hint": "bpen lom" },
                    { "en": "To feel unwel", "th": "ไม่สบาย", "hint": "mâi sà-baay" },
                    { "en": "Diarrhea", "th": "ท้องเสีย", "hint": "thɔ́ɔŋ sǐa" },
                    { "en": "Food Poisoning", "th": "อาหารเป็นพิษ", "hint": "aa-hǎan bpen-phít" },
                    { "en": "To vomit", "th": "อาเจียน/อ้วก", "hint": "aa-jian/ûak" },
                    { "en": "To cough", "th": "ไอ", "hint": "ai" },
                    { "en": "To sneeze", "th": "จาม", "hint": "jaam" },
                    { "en": "To have a runny nose", "th": "มีนํามูก", "hint": "mii náam-mûuk" },
                    { "en": "Dizzy", "th": "เวียนหัว", "hint": "wian-hǔa" },
                    { "en": "Insomnia", "th": "นอนไม่หลับ", "hint": "nɔɔn mâi làp" },
                    { "en": "allergic", "th": "แพ้", "hint": "phɛ́ɛ" },
                    { "en": "sick", "th": "ป่วย", "hint": "bpùai" },
                    { "en": "fever", "th": "ไข้", "hint": "khâi" },
                    { "en": "headache", "th": "ปวดหัว", "hint": "bpùat hǔa" },
                    { "en": "toothache", "th": "ปวดฟัน", "hint": "bpùat fan" },
                    { "en": "stomachache", "th": "ปวดท้อง", "hint": "bpùat thɔ́ɔŋ" },
                    { "en": "backache", "th": "ปวดหลัง", "hint": "bpùat lǎŋ" },
                    { "en": "earache", "th": "ปวดหู", "hint": "bpùat hǔu" },
                    { "en": "eye infection", "th": "ตาอักเสบ", "hint": "" },
                    { "en": "nose infection", "th": "จมูกอักเสบ", "hint": "" },
                    { "en": "throat infection", "th": "คออักเสบ", "hint": "" },
                    { "en": "skin infection", "th": "ผิวอักเสบ", "hint": "" },
                    { "en": "tooth infection", "th": "ฟันอักเสบ", "hint": "" },
                    { "en": "ear infection", "th": "หูอักเสบ", "hint": "" },
                    { "en": "eye pain", "th": "ปวดตา", "hint": "" },
                    { "en": "ear pain", "th": "ปวดหู", "hint": "" },
                    { "en": "throat pain", "th": "ปวดคอ", "hint": "" }
                ],
                "structure":
                    [
                        { "en": "What's your symptom ?", "th": "คุณ เป็น อะไร คะ", "hint": "khun bpen à-rai khá" },
                        { "en": "I have a cold", "th": "ผม เป็น หวัด ครับ", "hint": "phǒm bpen wàt khráp" },
                        { "en": "Do you have a sore throat ?", "th": "คุณ เจ็บ คอ ไหม คะ", "hint": "khun jèp khɔɔ mái khá" },
                        { "en": "Yes, I do.", "th": "เจ็บ ครับ", "hint": "jèp khráp" },
                        { "en": "Do you have a head ache ?", "th": "คุณ ปวด หัว ไหม คะ", "hint": "khun bpùat hǔa mǎi khá" },
                        { "en": "Yes, I do.", "th": "ปวด ครับ", "hint": "bpùat khráp" },
                        { "en": "What's your symptom ?", "th": "คุณ เป็น อะไร ครับ", "hint": "khun bpen à-rai khráp" },
                        { "en": "I have a stomachache and I've(been) vomiting.", "th": "ฉัน ปวด ท้อง และ อาเจียน ค่ะ", "hint": "chǎn bpùat thɔ́ɔŋ lɛ́ aa-jian khâ" },
                        { "en": "Do you have a fever?", "th": "คุณ มี ไข้ ไหม คะ", "hint": "kun mii khâi mǎi khá" },
                        { "en": "No, I don't.", "th": "ไม่มี คะ", "hint": "mâi mii khâ" },
                        { "en": "What are the symptoms?", "th": "คุณ มี อาการ ยัง ไง บ้าง", "hint": "khun mii aa-gaan yaŋ-ŋai bâaŋ" },
                        { "en": "What are your symptoms ?", "th": "คุณ มี อาการ ยังไงบ้าง ครับ", "hint": "khun mii aa-gaan yaŋ-ŋai bâaŋ khráp" },
                        { "en": "I have a sore throat, headache, and runny nose.", "th": "ผม มี อาการ เจ็บ คอ ปวด หัว และ มี นํามูก ครับ", "hint": "phǒm mii (aa-gaan) jèp khɔɔ bpùat hǔa lɛ́ mii náam-mûukkhráp" },
                        { "en": "Have you gotten over your cold yet ?", "th": "คุณ หาย เป็น หวัด รึ ยัง ครับ", "hint": "khun hǎay bpen wàt rɯ-yaŋ khráp" },
                        { "en": "Yes", "th": "หาย แล้ว ค่ะ", "hint": "hǎay lɛ́ɛw khâ" },
                        { "en": "No", "th": "ยัง ค่ะ", "hint": "yaŋ khâ" },
                        { "en": "Have you recovered from your cough?", "th": "คุณ หาย ไอ รึ ยัง คะ", "hint": "khun hǎay ai rɯ-yaŋ khá" },
                        { "en": "Yes", "th": "หาย แล้ว ครับ", "hint": "hǎay lɛ́ɛw khráp" },
                        { "en": "No", "th": "ยัง ครับ", "hint": "yaŋ khráp" },
                        { "en": "Are you getting better?", "th": "คุณ ดี ขึ้น รึ ยัง คะ", "hint": "khun dii-khɯ̂n rɯ-yaŋ khá" },
                        { "en": "Yes", "th": "ดี ขึ้น แล้ว ครับ", "hint": "dii-khɯ̂n lɛ́ɛw khráp" },
                        { "en": "No", "th": "ยัง ครับ", "hint": "yaŋ khráp" },
                        { "en": "How long have you been having a headache?", "th": "คุณ ปวด หัว มา นาน เท่า ไหร่ แล้ว", "hint": "khun bpùat hǔa maa naan thâw-rài lɛ́ɛw" },
                        { "en": "Better", "th": "ดีขึ้น", "hint": "dii-khɯ̂n" },
                        { "en": "Worse", "th": "แย่ลง", "hint": "yɛ̂ɛ loŋ" },
                        { "en": "Are you allergic to anything?", "th": "คุณ แพ้ อะไร ไหม", "hint": "khun phɛ́ɛ à-rai mǎi" },
                        { "en": "allergic to dust", "th": "แพ้ ฝุ่น", "hint": "phɛ́ɛ fùn" },
                        { "en": "allergic to milk", "th": "แพ้ นม", "hint": "phɛ́ɛ nom" },
                        { "en": "allergic to seafood", "th": "แพ้ อาหาร ทะเล", "hint": "aa-hǎan thá-lee" },
                        { "en": "allergic to pollen", "th": "แพ้ เกสร ดอกไม้", "hint": "phɛ́ɛ gee-sɔ̌ɔn dɔ̀ɔk-mái" },
                        { "en": "allergic to peanut", "th": "แพ้ ถั่ว", "hint": "phɛ́ɛ tùa" },
                        { "en": "Coeliac disease", "th": "แพ้ กลูเตน", "hint": "phɛ́ɛ gluu-dteen" },
                        { "en": "What's your symptom ?", "th": "คุณ เป็น อะไร คะ", "hint": "khun bpen à-rai khá" },
                        { "en": "My eyes are sore.", "th": "ผม เจ็บ ตา ครับ", "hint": "phǒm jèp dtàa khráp" },
                        { "en": "How long have your eyes been sore?", "th": "คุณ เจ็บ ตา มา นาน เท่า ไหร่ แล้ว คะ", "hint": "khun jèp dtaa maa naan thâw-rài lɛ́ɛw khá" },
                        { "en": "My eyes had been sore for 2 days.", "th": "ผม เจ็บ ตา มา 2 วันแล้วครับ", "hint": "phǒm jèp dtaa maa sɔ̌ɔŋ wan lɛ́ɛw khráp" },
                        { "en": "What's your symptom ?", "th": "คุณ เป็นอะไรครับ", "hint": "khun bpen à-rai khráp" },
                        { "en": "I have diarrhea , a stomachache , and I've been vomiting", "th": "ฉัน ท้องเสีย ปวดท้อง และ อาเจียน ค่ะ", "hint": "chǎn thɔ́ɔŋ-sǐa bpùat tɔ́ɔŋ lɛ́ aa-jian khâ" },
                        { "en": "I have had these symptoms for a week.", "th": "ฉัน มี อาการ มา อาทิตย์ แล้ว ค่ะ", "hint": "chǎn mii aa-gaan maa nɯŋ aa - thít lɛ́ɛw khâ" },
                        { "en": "I have a stomach ache because I ate too much", "th": "ผม ปวด ท้อง เพราะ ว่า ผม กิน เยอะ เกิน ไป", "hint": "phǒm bpùat thɔ́ɔŋ phrɔ́-wâa gin yə́ gəən-bpai" },
                        { "en": "Why do you have a headache?", "th": "ทําไมคุณปวดหัว", "hint": "tham-mai khun bpùat hǔa" },
                        { "en": "I have a headache because I have been using my computer too much.", "th": "ผม ปวด หัว เพราะ ว่า ใช้ คอมพิวเตอร์ มาก เกิน ไป", "hint": "phǒm bpùat hǔa phrɔ́-wâa chái khɔɔm-piw-dtəə mâak gəən-bpai" },
                        { "en": "Why does she have diarrhea?", "th": "ทําไม เขา ท้องเสีย", "hint": "tham-mai khǎw thɔ́ɔŋ-sǐa" },
                        { "en": "She has diarrhea because she ate too much spicy food", "th": "เขา ท้องเสีย เพราะว่า เขา กิน อาหาร เผ็ด มากเกินไป", "hint": "khǎw thɔ́ɔŋ-sǐa phrɔ́-wâa khǎw gin aa-hǎan phèt mâakgəən-bpai" },
                        { "en": "Why couldn't your brother sleep last night ?", "th": "ทําไม เมื่อคืน พี่ชาย ของ คุณ นอน ไม่หลับ", "hint": "tham-mai mɯ̂a-kɯɯn phîi-chaai khɔ̌ɔng kun nɔɔn-mâi-làp" },
                        { "en": "He could not sleep because he drank too much coffee yesterday.", "th": "เขา นอนไม่หลับ เพราะว่า เมื่อวาน เขา ดื่ม กาแฟมาก เกิน ไป", "hint": "khǎw nɔɔn-mâi-làp phrɔ́-wâa mɯ̂a-waan khǎw dɯɯm gaa - fɛɛmâak gəən - bpai" },
                        { "en": "I don't feel well.", "th": "ฉันรู้สึก ไม่ สบาย", "hint": "wan-níi chǎn rúu-sɯk mâi sà-baay" },
                        { "en": "I feel good.", "th": "วัน นี ฉัน รู้สึก ดี", "hint": "wan-níi chǎn rúu-sɯk dii" },
                        { "en": "I have a headache.", "th": "ฉัน รู้สึก ปวด หัว มาก", "hint": "chǎn rúu-sɯk bpùat - hǔa mâak" },
                        { "en": "I feel tired.", "th": "ฉัน รู้สึก เหนื่อย", "hint": "chǎn rúu-sɯk nɯay" },
                        { "en": "I'm aching all over.", "th": "ผม เมื่อย(ทั้ง)ตัว", "hint": "phǒm mɯ̂ay tháŋ dtua" },
                        { "en": "I have a stomach ache.", "th": "ผม ปวด ท้อง", "hint": "phǒm bpùat-thɔ́ɔŋ" },
                        { "en": "I have a sore throat", "th": "ฉัน เจ็บ คอ", "hint": "chǎn jèp khɔɔ" },
                        { "en": "I have a cold", "th": "ผม เป็น หวัด", "hint": "phǒm bpen wàt" },
                        { "en": "I have a fever", "th": "ฉัน มี ไข้", "hint": "chǎn mii khâi" },
                        { "en": "I have a cough", "th": "ผม ไอ", "hint": "phǒm ai" },
                        { "en": "I have diarrhea", "th": "ผม ท้อง เสีย", "hint": "phǒm thɔ́ɔŋ sǐa" },
                        { "en": "I have food poisoning", "th": "ฉัน อาหาร เป็น พิษ", "hint": "chǎn aahǎan bpen-phít" },
                        { "en": "I am dizzy", "th": "ฉัน เวียน หัว", "hint": "chǎn wian-hǔa" },
                        { "en": "I am nauseous", "th": "ฉัน คลืน ไส้", "hint": "chǎn khlʉ̂ʉn sâi" },
                        { "en": "I vomited", "th": "ฉัน อา เจียน", "hint": "chǎn aa-jian" },
                        { "en": "I have a runny nose.", "th": "ผม มี นํามูก", "hint": "phǒm mii náam-mûuk" },
                        { "en": "I am sick", "th": "ฉัน ป่วย", "hint": "chǎn bpùai" },
                        { "en": "I have a headache", "th": "ฉัน ปวด หัว", "hint": "chǎn bpùat hǔa" },
                        { "en": "I have a toothache", "th": "ฉัน ปวด ฟัน", "hint": "chǎn bpùat fan" },
                        { "en": "I have a stomachache", "th": "ฉัน ปวด ท้อง", "hint": "chǎn bpùat thɔ́ɔŋ" },
                        { "en": "I have a backache", "th": "ฉัน ปวด หลัง", "hint": "chǎn bpùat lǎŋ" },
                        { "en": "I have an earache", "th": "ฉัน ปวด หู", "hint": "chǎn bpùat hǔu" },
                        { "en": "What's wrong?", "th": "คุณ เป็น อะไร คะ คุณ ดู ไม่ สบาย", "hint": "khun bpen àrai khá, khun duu mâi sà-baay" },
                        { "en": "I have covid.", "th": "ผม ติด โควิด", "hint": "phǒm dtìt Covid" },
                        { "en": "My arm hurts.", "th": "ผม เจ็บ แขน", "hint": "phǒm jèp khɛ̌ ɛn!" },
                        { "en": "I have diarrhea all day.", "th": "ผม ท้อง เสีย ทั้ง วัน", "hint": "phǒm thɔ́ɔŋ-sǐa tháŋ wan!" },
                        { "en": "I have had a cold for many days", "th": "ผม เป็น หวัด หลาย วัน แล้ว", "hint": "phǒm bpen-wàt lǎay wan lɛ́ɛw!" },
                        { "en": "I cough and have a sore throat", "th": "ผม ไอ และ เจ็บ คอ มาก", "hint": "phǒm ai lɛ́ jèp khɔɔ mâak" },
                        { "en": "What's your symptom ?", "th": "คุณ เป็น อะไร คะ", "hint": "khun bpen à-rai khá" },
                        { "en": "Do you have a sore throat ?", "th": "คุณ เจ็บ คอ ไหม คะ", "hint": "khun jèp khɔɔ mái khá" },
                        { "en": "Do you have a headache ?", "th": "คุณ ปวด หัว ไหม คะ", "hint": "khun bpùat hǔa mǎi khá" },
                        { "en": "Do you have a fever?", "th": "คุณ มี ไข้ ไหม คะ", "hint": "kun mii khâi mǎi khá" }
                    ]
            },
            {
                "name": "Travel and tourism",
                "vocabulary": [
                    { "en": "To travel or take a trip", "th": "ไปเทียว", "hint": "bpai-thîaw " },
                    { "en": "To visit or go to see", "th": "ไปหา", "hint": "bpai-hǎa" },
                    { "en": "To take (time)", "th": "ใช้เวลา", "hint": "chái wee-laa" },
                    { "en": "Long (Time)", "th": "นาน", "hint": "naan" },
                    { "en": "Tourist Attraction", "th": "สถานทีทอ ่งเทียว", "hint": "sà-thǎan-thîi thɔ̂ɔŋ-thîaw" },
                    { "en": "Accommodation", "th": "ทีพก ั", "hint": "thîi-phák" },
                    { "en": "Day off or Holiday", "th": "วันหยุด", "hint": "wan-yùt" },
                    { "en": "Country", "th": "ประเทศ", "hint": "bprà-thêet" },
                    { "en": "Foreign country", "th": "ต่างประเทศ", "hint": "dtàaŋ bprà-thêet" },
                    { "en": "Province", "th": "จังหวัด", "hint": "jan-wàt" },
                    { "en": "Provincial town", "th": "ต่างจังหวัด", "hint": "dtàaŋ jang-wàt!" },
                    { "en": "tourist", "th": "นักท่องเที่ยว", "hint": "nák thɔ̂ŋ-thîaw" },
                    { "en": "Interesting", "th": "น่าสนใจ", "hint": "nâa-sǒn-jai" },
                    { "en": "Weather or Air", "th": "อากาศ", "hint": "aa-gàat" },
                    { "en": "Same", "th": "เหมือน", "hint": "mɯ̌ɯn" },
                    { "en": "Northern region", "th": "ภาคเหนือ", "hint": "phâak nɯ̌a" },
                    { "en": "Central region", "th": "ภาคกลาง", "hint": "phâak glaaŋ" },
                    { "en": "North-eastern region", "th": "ภาคอีสาน", "hint": "phâak ii-sǎan" },
                    { "en": "Southern region", "th": "ภาคใต้", "hint": "phâak dtâai" },
                    { "en": "Eastern region", "th": "ภาคตะวันออก", "hint": "phâak dtà-wan ɔ̀ɔk" },
                    { "en": "Western region", "th": "ภาคตะวันตก", "hint": "phâak dtà-wan dtòk" },
                    { "en": "Staff", "th": "พนักงาน", "hint": "phá-nák-ngaan" },
                    { "en": "Excited", "th": "ตืนเต้น", "hint": "dtɯɯn-dtên" },
                    { "en": "The most", "th": "ทีสด", "hint": "thîi-sùt" },
                    { "en": "Traffic jam", "th": "รถติด", "hint": "rót-dtìt" },
                    { "en": "Capital city", "th": "เมืองหลวง", "hint": "mɯaŋ-lǔaŋ" },
                    { "en": "travel", "th": "เดินทาง", "hint": "dəən-thaŋ" },
                    { "en": "tourism", "th": "การท่องเที่ยว", "hint": "kaan thɔ̂ŋ-thîaw" }
                ],
                "structure":
                    [
                        { "en": "Where will you go (travelling) this holiday?", "th": "วันหยุด นี คุณ จะ ไป เทียว ที ไหน", "hint": "Wan-yùt níi khun jà bpai thîaw thîi-nǎi" },
                        { "en": "I will go to the sea(beach) with my family.", "th": "ผม จะ ไป เทียว ทะเล กับ ครอบครัว ครับ", "hint": "phǒm jà bpai-tîaw thá-lee gàp khrɔ̂ɔp-khrua khráp" },
                        { "en": "Where are you going (to travel) this weekend?", "th": "วันเสาร์ อาทิตย์ นี คุณ จะ ไป เทียว ที ไหน ครับ", "hint": "wan-sǎaw aa-thít níi khun jà bpai-thîaw thîi-nǎi khráp" },
                        { "en": "I will go to Suthep Mountain with my friend because the weather is good this month.", "th": "ฉัน จะ ไป เทียว ดอย สุเทพ กับ เพื่อน ค่ะ เพราะ เดือน นี้ อากาศ ดี", "hint": "chǎn jà bpai-thîaw dɔɔi sù-thêep gàp phɯ̂an khâ phrɔ́ dɯan níi aa-gàat dii" },
                        { "en": "Where will you go (traveling) next month ?", "th": "เดือน หน้า คุณ จะ ไป เทียว ที ไหน ครับ", "hint": "dɯan nâa khun jà bpai-thîaw thîi-nǎi khráp" },
                        { "en": "I will go hiking with my husband. And now there are not much tourist.", "th": "ฉัน จะ ไป เดิน ป่า กับ สามี ค่ะ ตอน นี้ นัก ท่อง เที่ยว น้อย", "hint": "chǎn jà bpai dəən bpàa gàp sǎa-mii khâ dtɔɔn-níi nák- thɔ̂ɔŋ - thîaw nɔ́ɔy" },
                        { "en": "What country do you want to visit the most ?", "th": "คุณ อยาก ไป เทียว ประเทศ อะไร มาก ที่สุด คะ", "hint": "khun yàak bpai-thîaw bprà-thêet à-rai mâak thîi-sùt khá" },
                        { "en": "I want to visit Japan the most.", "th": "ผม อยาก ไป เทียว ประเทศ ญี่ปุ่น มาก ที่สุด ครับ", "hint": "phǒm yàak bpai-thîaw bprà-thêet yîi-bpùn mâak thîi-sùt khráp!" },
                        { "en": "Why?", "th": "ทำไม คะ", "hint": "tham-mai khá" },
                        { "en": "Because the weather is not hot and the food is delicious", "th": "เพราะ อากาศ ไม่ร้อน และ อาหาร อร่อย ค่ะ", "hint": "phrɔ́ aa-gàat mâi rɔ́ɔn lɛ́ aa-hǎan à-rɔ̀ɔy khâ" },
                        { "en": "What province do you want to visit the most? why?", "th": "คุณ อยาก ไปเทียว จังหวัด อะไร มาก ทีสด ทําไม คะ", "hint": "khun yàak bpai-thîaw jaŋ-wàt à-rai mâak thîi-sùt tham-mai khá" },
                        { "en": "I want to visit Phuket the most.because I have never been there.", "th": "ฉัน อยาก ไปเทียว จังหวัด ภูเก็ต มาก ทีสด ค่ะ เพราะ ฉัน ยัง ไม่ เคย ไปทีนน ค่ะ", "hint": "chǎn yàak bpai-thîaw jaŋ-wàt puu-gèt mâak thîi-sùt kha" },
                        { "en": "I want to visit Phuket the most.because I have never been there.", "th": "ฉัน อยาก ไปเทียว จังหวัด ภูเก็ต มาก ที่สุด ค่ะ เพราะ ฉัน ยัง ไม่ เคย ไปที่นั่น ค่ะ", "hint": "chǎn yàak bpai-thîaw jaŋ-wàt puu-gèt mâak thîi-sùt khâ phrɔ́ chǎn yaŋ mâi kəəy bpai thîi-nân khâ!" },
                        { "en": "Have you ever been to Bangkok?", "th": "คุณ เคย ไป กรุงเทพฯ ไหม", "hint": "Khun khəəy bpai grung-thêep mǎi" },
                        { "en": "Have you ever been to Australia?", "th": "คุณ เคย ไป ประเทศ ออสเตรเลีย ไหม", "hint": "khun khəəy bpai bprà-thêet ɔ̀ɔt-dtree-lia mǎi" },
                        { "en": "Have you ever seen an elephant?", "th": "คุณ เคย เห็น ช้าง ไหม", "hint": "khun kəəy hěn cháang mǎi" },
                        { "en": "What countries have you been to?", "th": "คุณ เคย ไป ประเทศ อะไร บ้าง", "hint": "khun khəəy bpai bprà-thêet à-rai bâaŋ" },
                        { "en": "I have been to Japan, France, and Italy.", "th": "ผม เคย ไป ประเทศ ญี่ปุ่น ฝรั่งเศส และ อิตาลี", "hint": "phǒm khəəy bpai bprà-thêet yîi-bpùn fà-ràng-sèet lɛ́ ì-dtaa-lîi" },
                        { "en": "What provinces have you been to?", "th": "คุณ เคย ไป จังหวัด อะไร บ้าง", "hint": "khun khəəy bpai jaŋ-wàt à-rai bâaŋ" },
                        { "en": "I have been to Chiang Rai , Lampang , and Nan.", "th": "ผม เคย ไป จังหวัด เชียงราย ลําปาง และ น่าน", "hint": "phǒm khəəy bpai jaŋ-wàt chiaŋ-raai lam-bpaaŋ lɛ́ nâan" },
                        { "en": "I have been to many countries.", "th": "ผม เคย ไป หลาย ประเทศ", "hint": "phǒm khəəy bpai lǎay bprà-thêet" },
                        { "en": "What region is Bangkok (located) in?", "th": "กรุงเทพฯ อยู่ ภาค อะไร คะ", "hint": "gruŋ-thêep yùu phâak à-rai khá" },
                        { "en": "Bangkok is (located) in the central region.", "th": "กรุงเทพฯ อยู่ ภาค กลาง ครับ", "hint": "gruŋ-thêep yùu phâak glaaŋ khráp" },
                        { "en": "What region is the state of California (located) in?", "th": "รัฐ แคลิฟอร์เนีย อยู่ ภาค อะไร คะ", "hint": "rát khɛɛ-lí-fɔɔ-nia yùu phâak à-rai khá" },
                        { "en": "California state is (located) in the western region.", "th": "รัฐ แคลิฟอร์เนีย อยู่ ภาค ตะวันตก ครับ", "hint": "rát khɛɛ-lí-fɔɔ-nia yùu phâak dta-wan dtòk khráp" },
                        { "en": "What region is Shanghai (located) in ?", "th": "เมือง เซียงไฮ้อยูภาคอะไร คะ", "hint": "mɯaŋ sîaŋ-hái yùu phâak à-rai khá" },
                        { "en": "Shanghai is (located) in eastern region.", "th": "เมือง เซียงไฮ้ อยูภาค ตะวันออก ครับ", "hint": "mɯaŋ sîaŋ-hái yùu phâak dtà-wan ɔ̀ɔk khráp" },
                        { "en": "What region is Phuket (located) in?", "th": "จังหวัด ภูเก็ต อยู่ ภาค อะไร คะ", "hint": "jaŋ-wàt puu-gèt yùu phâak à-rai khá" },
                        { "en": "Phuket is (located) in the southern region.", "th": "จังหวัด ภูเก็ต อยู่ ภาค ใต้ ครับ", "hint": "jaŋ-wàt puu-gèt yùu phâak dtâai khráp" },
                        { "en": "What region is Udon Thani (located) in?", "th": "จังหวัด อุดรธานี อยู่ ภาค อะไร คะ", "hint": "jaŋ-wàt ù-dɔɔn-thaa-nii yùu phâak à-rai khá" },
                        { "en": "Udon Thani is (located) in the northeastern region.", "th": "จังหวัด อุดรธานี อยู่ ภาค อีสาน ครับ", "hint": "jaŋ-wàt ù-dɔɔn-thaa-nii yùu phâak ii-sǎan khráp" },
                        { "en": "What region is Kanchanaburi (located) in?", "th": "จังหวัด กาญจนบุรี อยู่ ภาค อะไร คะ", "hint": "jaŋ-wàt gaan-jà-na-bu-rii yùu phâak à-rai khá" },
                        { "en": "Kanchanaburi is (located) in the western region.", "th": "จังหวัด กาญจนบุรี อยู่ ภาค ตะวันตก ครับ", "hint": "jaŋ-wàt gaan-jà-na-bu-rii yùu phâak dtà-wan dtòk khráp" },
                        { "en": "What region is Chiang Mai (located) in?", "th": "จังหวัด เชียงใหม่ อยู่ ภาค อะไร คะ", "hint": "jaŋ-wàt chiaŋ-mài yùu phâak à-rai khá" },
                        { "en": "Chiang Mai is (located) in the northern region.", "th": "จังหวัด เชียงใหม่ อยู่ ภาค เหนือ ครับ", "hint": "jaŋ-wàt chiaŋ-mài yùu phâak nɯ̌ɯ khráp" },
                        { "en": "What region is Khon Kaen (located) in?", "th": "จังหวัด ขอนแก่น อยู่ ภาค อะไร คะ", "hint": "jaŋ-wàt khɔ̌ɔn-gɛ̀ɛn yùu phâak à-rai khá" },
                        { "en": "Khon Kaen is (located) in the northeastern region.", "th": "จังหวัด ขอนแก่น อยู่ ภาค อีสาน ครับ", "hint": "jaŋ-wàt khɔ̌ɔn-gɛ̀ɛn yùu phâak ii-sǎan khráp" },
                        { "en": "Northern Thailand has the northern provinces adjacent to Burma.", "th": "ภาคเหนือ ของ ประเทศไทย มี จังหวัด ภาคเหนือ ติดกับ ประเทศพม่า", "hint": "" },
                        { "en": "There are many mountains and trees here, but there is no sea.", "th": "ที่ นี่ มีภูเขา และ ต้นไม้ มาก มาย แต่ ไม่ มี ทะเล", "hint": "" },
                        { "en": "The weather is colder than other regions.", "th": "อากาศ จะ หนาว เย็น กว่า ภาค อื่นๆ", "hint": "" },
                        { "en": "People in the North speak the northern dialect and Thai.", "th": "คน ภาค เหนือ พูด ภาษาเหนือ และ ภาษาไทย", "hint": "" },
                        { "en": "Northern food is not spicy and has a lot of vegetables.", "th": "อาหารเหนือ ไม่ เผ็ด และ มี ผัก เยอะ", "hint": "" },
                        { "en": "In winter, the weather in the North is very cold, but there is no snow.", "th": "ใน ฤดู หนาว อากาศ ทาง ภาค เหนือ หนาว มาก แต่ ไม่มี หิมะ", "hint": "" },
                        { "en": "During this time, there are many tourists and most of them travel on the mountains.", "th": "ใน ช่วง นี้ มี นัก ท่องเที่ยว จำนวน มาก โดย ส่วน ใหญ่ จะ เดินทาง บน ภูเขา", "hint": "" },
                        {
                            "en": "Northern Thailand has the northern provinces adjacent to Burma. There are many mountains and trees here, but there is no sea. The weather is colder than other regions. People in the North speak the northern dialect and Thai. Northern food is not spicy and has a lot of vegetables. In winter, the weather in the North is very cold, but there is no snow. During this time, there are many tourists and most of them travel on the mountains.",
                            "th": "ภาค เหนือ ของ ประเทศไทย มี จังหวัด ภาคเหนือ ติดกับ ประเทศพม่า ที่นี่ มี ภูเขา เยอะ มี ต้นไม้ เยอะ แต่ ไม่มี ทะเล อากาศ หนาว กว่า ภาค อื่น คน ภาค เหนือ พูด ภาษาเหนือ และ ภาษาไทย อาหาร ภาค เหนือ ไม่ เผ็ด และ ใส่ ผัก เยอะ ฤดู หนาว ภาค เหนือ อากาศ หนาว มาก แต่ ไม่มี หิมะ ช่วง นี้ มี นัก ท่องเที่ยว เยอะ และ ส่วนใหญ่ จะ ท่องเที่ยว บน ดอย",
                            "hint": "phâak-nɯ̌ɯ khɔ̌ɔŋ bprà-thêet thai mii 8 jaŋ-wàt phâak-nɯ̌ɯ yùu dtìt-gàp bprà-thêet phá-mâa thîi-nîi m"
                        },
                        { "en": "During this time, there are many tourists and most of them travel on the mountains.", "th": "ใน ช่วง นี้ มี นัก ท่องเที่ยว จำนวน มาก โดย ส่วน ใหญ่ จะ เดินทาง บน ภูเขา", "hint": "" },
                        {
                            "en": "Northern Thailand has the northern provinces adjacent to Burma. There are many mountains and trees here, but there is no sea. The weather is colder than other regions. People in the North speak the northern dialect and Thai. Northern food is not spicy and has a lot of vegetables. In winter, the weather in the North is very cold, but there is no snow. During this time, there are many tourists and most of them travel on the mountains.",
                            "th": "ภาค เหนือ ของ ประเทศไทย มี จังหวัด ภาคเหนือ ติดกับ ประเทศพม่า ที่นี่ มี ภูเขา เยอะ มี ต้นไม้ เยอะ แต่ ไม่มี ทะเล อากาศ หนาว กว่า ภาค อื่น คน ภาค เหนือ พูด ภาษาเหนือ และ ภาษาไทย อาหาร ภาค เหนือ ไม่ เผ็ด และ ใส่ ผัก เยอะ ฤดู หนาว ภาค เหนือ อากาศ หนาว มาก แต่ ไม่มี หิมะ ช่วง นี้ มี นัก ท่องเที่ยว เยอะ และ ส่วนใหญ่ จะ ท่องเที่ยว บน ดอย",
                            "hint": "phâak-nɯ̌ɯ khɔ̌ɔŋ bprà-thêet thai mii 8 jaŋ-wàt phâak-nɯ̌ɯ yùu dtìt-gàp bprà-thêet phá-mâa thîi-nîi m"
                        },
                        { "en": "The eastern region of Thailand is adjacent to Cambodia.", "th": "ภาค ตะวันออก ของ ประเทศไทย ติด กับ ประเทศ กัมพูชา", "hint": "" },
                        { "en": "The weather is hot and humid.", "th": "อากาศ ร้อน และ ชื้น", "hint": "" },
                        { "en": "There are many beaches and islands.", "th": "มี ชายหาด และ เกาะ ต่างๆ มากมาย", "hint": "" },
                        { "en": "The sea is very beautiful.", "th": "ทะเล สวย มาก.", "hint": "" },
                        { "en": "The eastern region has many tourists, but it is not as crowded as the central region.", "th": "ภาค ตะวันออก มี นัก ท่องเที่ยว จำนวน มาก แต่ ไม่ หนาแน่น เท่า ภาค กลาง", "hint": "" },
                        { "en": "The eastern dialect is similar to the central dialect.", "th": "ภาษา ถิ่น ตะวันออก ก็ คล้าย คลึง กับ ภาษา ถิ่น กลาง", "hint": "" },
                        {
                            "en": "The eastern region of Thailand is adjacent to Cambodia. The weather is hot and humid. There are many beaches and islands. The sea is very beautiful. The eastern region has many tourists, but it is not as crowded as the central region. The eastern dialect is similar to the central dialect.",
                            "th": "ภาคตะวันออกของประเทศไทยอยูต ่ด ิกับประเทศกัมพูชาอากาศร้อนและชืนมีชายหาดและเกาะเยอะทะเลสวยมากภาคตะวันออกมีนกท่องเทียวเยอะแต่ว่าไม่เยอะเท่าภาคกลางภาษาอีสานคล้ายกับภาษาไทยกลาง",
                            "hint": ""
                        },
                        { "en": "Southern Thailand is adjacent to Malaysia.", "th": "ภาค ใต้ ของ ประเทศไทย ติด กับ ประเทศ มาเลเซีย", "hint": "" },
                        { "en": "There are beautiful seas and many islands.", "th": "มี ทะเล สวยงาม และ เกาะ มากมาย", "hint": "" },
                        { "en": "Interestingly, the South has more rain than other regions.", "th": "ที่ น่าสนใจ คือ ภาค ใต้ มี ฝน ตก มากกว่า ภาค อื่น", "hint": "" },
                        { "en": "The islands are very beautiful, which attracts many foreign tourists.", "th": "หมู่เกาะ มี ความ สวยงาม มาก ซึ่ง ดึงดูด นัก ท่องเที่ยว ชาว ต่างชาติ จำนวน มาก", "hint": "" },
                        { "en": "People there speak southern dialect.", "th": "คน แถวนั้น พูด ภาษา ถิ่น ใต้", "hint": "" },
                        { "en": "Southern dialect is spoken quickly and is difficult to listen to, but if you go there, you will really like it.", "th": "ภาษา ถิ่น ใต้ พูด เร็ว และ ฟัง ยาก แต่ ถ้า คุณ ไป ที่นั่น คุณ จะ ชอบ มัน จริงๆ", "hint": "" },
                        {
                            "en": "Southern Thailand is adjacent to Malaysia. There are beautiful seas and many islands. Interestingly, the South has more rain than other regions. The islands are very beautiful, which attracts many foreign tourists. People there speak southern dialect. Southern dialect is spoken quickly and is difficult to listen to, but if you go there, you will really like it.",
                            "th": "ภาคใต้ของประเทศไทยอยูต ่ ิดกับประเทศมาเลเซียทีนน ัมีทะเลสวยมีเกาะเยอะและน่าสนใจภาคใต้มีฝนตกมากกว่าภาคอืนๆเกาะทีนน ัสวยมากทําให้นก ั ท่องเทียวต่างชาติไเทียวทีน น ัเยอะคนทีนน ัพูดภาษาใต้ ภาษาใต้ พด ูเร็วและฟั งยากแต่ถ้าคุณไปเทียวทีนน ัคุณจะชอบมากๆ",
                            "hint": ""
                        },
                        { "en": "The Isan region is located in the northeast of Thailand and borders Laos.", "th": "ภาคอีสาน ตั้งอยู่ในภาคตะวันออกเฉียงเหนือของประเทศไทยและมีอาณาเขตติดกับประเทศลาว", "hint": "" },
                        { "en": "The Mekong River is in the middle.", "th": "แม่ น้ำ โขง อยู่ ตรงกลาง", "hint": "" },
                        { "en": "Isan people are very kind and lovely.", "th": "คน อีสาน เป็น คน ใจดี และ น่ารัก มาก", "hint": "" },
                        { "en": "Isan food is very delicious.", "th": "อาหาร อีสาน อร่อย มาก.", "hint": "" },
                        { "en": "Most of it is spicy and salty.", "th": "ส่วนใหญ่ ก็ จะ มี รส เผ็ด และ เค็ม", "hint": "" },
                        { "en": "The famous food is sticky rice and papaya salad.", "th": "อาหาร ที่ มี ชื่อเสียง คือ ข้าวเหนียว และ ส้มตำ", "hint": "" },
                        { "en": "The Isan language is similar to the northern language but faster.", "th": "ภาษา อีสาน มี ความ คล้ายคลึง กับ ภาษา เหนือ แต่ มี ความ เร็ว กว่า", "hint": "" },
                        {
                            "en": "The Isan region is located in the northeast of Thailand and borders Laos. The Mekong River is in the middle. Isan people are very kind and lovely. Isan food is very delicious. Most of it is spicy and salty. The famous food is sticky rice and papaya salad. The Isan language is similar to the northern language but faster.",
                            "th": "ภาคอีสานอยูท ่างทิศตะวันออกเฉียงเหนือของประเทศไทยและติดกับประเทศลาวมีแม่นําโขงอยูต ่รงกลางคนอีสานใจดีและน่ารักมากอาหารภาคอีสานอร่อยมากส่วนใหญ่มีรสเผ็ดและรสเค็มอาหารทีมีชือเสียงคือข้าวเหนียวกับส้มตําภาษาอีสานคล้ายกับภาษาเหนือแต่เร็วกว่า",
                            "hint": ""
                        },
                        { "en": "The central region of Thailand has Bangkok as the capital.", "th": "ภาค กลาง ของ ประเทศไทย มี กรุงเทพมหานคร เป็น เมืองหลวง", "hint": "" },
                        { "en": "There is a large river, the Chao Phraya River.", "th": "มี แม่น้ำ ใหญ่ สาย หนึ่ง คือ แม่น้ำเจ้าพระยา", "hint": "" },
                        { "en": "The weather is hot.", "th": "อากาศ ร้อน", "hint": "" },
                        { "en": "The central region has many interesting things.", "th": "ภาค กลาง มี สิ่ง ที่ น่าสนใจ มากมาย", "hint": "" },
                        { "en": "There are many tourists and many people, but it is convenient to travel.", "th": "มี นักท่องเที่ยว และ ผู้คน จำนวนมาก แต่ การเดินทาง ก็ สะดวก", "hint": "" },
                        { "en": "Sometimes, there are too many traffic jams.", "th": "บางที มี การจราจร ติดขัด มากเกินไป", "hint": "" },
                        { "en": "Most central Thai food has coconut milk. It is very delicious.", "th": "อาหาร ไทย ภาค กลาง ส่วนมาก จะ มี กะทิ เป็น ส่วน ประกอบ ซึ่ง อร่อย มาก", "hint": "" },
                        { "en": "If you have free time, you should go to the central region.", "th": "หาก มี เวลา ว่าง ก็ ควร ไป เที่ยว ภาค กลาง ครับ", "hint": "" },
                        {
                            "en": "The central region of Thailand has Bangkok as the capital. There is a large river, the Chao Phraya River. The weather is hot. The central region has many interesting things. There are many tourists and many people, but it is convenient to travel. Sometimes, there are too many traffic jams. Most central Thai food has coconut milk. It is very delicious. If you have free time, you should go to the central region.",
                            "th": "ภาคกลางของประเทศไทยมีจง ัหวัดกรุงเทพเป็นเมืองหลวงทีนนมีแม่นําใหญ่คือแม่นําเจ้าพระยาทีนนอากาศร้อนภาคกลางมีหลายอย่างทีนาสนใจมีนกท่องเทียวเยอะมีคนเยอะแต่สะดวกเวลาเดินทางแต่บางครังรถติดเกินไปอาหารภาคกลางส่วนมากใส่กะทิมน ั อร่อยมากถ้าคุณว่างคุณควรไปเทียวภาคกลาง",
                            "hint": ""
                        },
                        { "en": "Where are you going?", "th": "คุณ จะ ไป ไหน", "hint": "khun jà bpai nǎi" },
                        { "en": "I am going to the beach.", "th": "ผม จะ ไป ทะเล", "hint": "phǒm jà bpai thá-lee" },
                        { "en": "I am going to the beach for 2 days.", "th": "ผม จะ ไป ทะเล 2 วัน", "hint": "phǒm jà bpai thá-lee sɔ̌ɔŋ wan" }
                    ]
            }
        ]
    },
    {
        "title": "Reading & Writing 1",
        "lessons": [
            {
                "name": "Low class consonants",
                "vocabulary": [
                    { "en": "offering tray", "th": "พ", "hint": "phɔɔ phaan (LC ภ phɔɔ sam-phaw)" },
                    { "en": "tooth", "th": "ฟ", "hint": "fɔɔ fan (LC)" },
                    { "en": "soldier", "th": "ท", "hint": "thɔɔ tha-haan (LC ธ thɔɔ thoŋ, ฑ thɔɔ mon-thoo, ฒ thɔɔ phuu-thaw)" },
                    { "en": "buffalow", "th": "ค", "hint": "khɔɔ khwaay (LC ฆ khɔɔ ra-khaŋ)" },
                    { "en": "chain", "th": "ซ", "hint": "sɔɔ soo (LC)" },
                    { "en": "owl", "th": "ฮ", "hint": "hɔɔ nok-huuk (LC)" },
                    { "en": "elephant", "th": "ช", "hint": "chɔɔ chaaŋ (LC ฌ chɔɔ chəə)" },
                    { "en": "snake", "th": "ง", "hint": "ŋɔɔ ŋuu (LC)" },
                    { "en": "giant", "th": "ย", "hint": "yɔɔ yak (LC ญ yɔɔ phuu-yiŋ)" },
                    { "en": "mouse", "th": "น", "hint": "nɔɔ nuu (LC ณ nɔɔ neen)" },
                    { "en": "boat", "th": "ร", "hint": "rɔɔ Reading & Writinga (LC)" },
                    { "en": "ring", "th": "ว", "hint": "wɔɔ wεεn (LC)" },
                    { "en": "horse", "th": "ม", "hint": "mɔɔ maa (LC)" },
                    { "en": "monkey", "th": "ล", "hint": "lɔɔ liŋ (LC ฬ lɔɔ ju-laa)" },
                    { "en": "sailing boat", "th": "ภ", "hint": "phɔɔ sam-phaw (LC uncommon)" },
                    { "en": "flag", "th": "ธ", "hint": "thɔɔ thoŋ (LC uncommon)" },
                    { "en": "Lady Montho", "th": "ฑ", "hint": "thɔɔ mon-thoo (LC uncommon)" },
                    { "en": "elderly", "th": "ฒ", "hint": "thɔɔ phuu-thaw (LC uncommon)" },
                    { "en": "bell", "th": "ฆ", "hint": "khɔɔ ra-khaŋ (LC uncommon)" },
                    { "en": "name of a tree", "th": "ฌ", "hint": "chɔɔ chəə (LC uncommon)" },
                    { "en": "female", "th": "ญ", "hint": "yɔɔ phuu-yiŋ (LC uncommon)" },
                    { "en": "novice", "th": "ณ", "hint": "nɔɔ neen (LC uncommon)" },
                    { "en": "kite", "th": "ฬ", "hint": "lɔɔ ju-laa (LC uncommon)" }
                ],
                "structure":
                    [
                        { "en": "What is this?", "th": "นี อะไร", "hint": "nîi à-rai" },
                        { "en": "This is a low class consonant", "th": "นี เป็น พยัญชนะ ต่ำ", "hint": "nîi bpen phá-yan-chá-ná tàm" }
                    ]
            },
            {
                "name": "Middle class consonants",
                "vocabulary": [
                    { "en": "chicken", "th": "ก", "hint": "gɔɔ gai (MC)" },
                    { "en": "plate", "th": "จ", "hint": "jɔɔ jaan (MC)" },
                    { "en": "child", "th": "ด", "hint": "dɔɔ dek (MC ฎ dɔɔ cha-daa )" },
                    { "en": "turtle", "th": "ต", "hint": "dtɔɔ dtaw (MC ฏ dtɔɔ bpa-dtak)" },
                    { "en": "leaf", "th": "บ", "hint": "bɔɔ bai-maay (MC)" },
                    { "en": "fish", "th": "ป", "hint": "bpɔɔ bplaa (MC)" },
                    { "en": "basin", "th": "อ", "hint": "ɔɔ aaŋ (MC)" },
                    { "en": "head dress", "th": "ฎ", "hint": "dɔɔ cha-daa (MC uncommon)" },
                    { "en": "lance", "th": "ฏ", "hint": "dtɔɔ bpa-dtak (MC uncommon)" }
                ],
                "structure":
                    [
                        { "en": "What is this?", "th": "นี อะไร", "hint": "nîi à-rai" },
                        { "en": "This is a middle class consonant", "th": "นี เป็น พยัญชนะ กลาง", "hint": "nîi bpen phá-yan-chá-ná klāŋ" }
                    ]
            },
            {
                "name": "High class consonants",
                "vocabulary": [
                    { "en": "bee", "th": "ผ", "hint": "phɔɔ phwwŋ (HC)" },
                    { "en": "lid", "th": "ฝ", "hint": "fɔɔ faa (HC)" },
                    { "en": "bag", "th": "ถ", "hint": "thɔɔ thuŋ (HC ฐ thɔɔ thaan)" },
                    { "en": "egg", "th": "ข", "hint": "khɔɔ khai (HC)" },
                    { "en": "tiger", "th": "ส", "hint": "sɔɔ swa (HC ษ sɔɔ Reading & Writingw-sii, ศ sɔɔ saa-laa)" },
                    { "en": "treasure", "th": "ห", "hint": "hɔɔ hiip box (HC)" },
                    { "en": "cymbal", "th": "ฉ", "hint": "chɔɔ chiŋ (HC)" },
                    { "en": "pedestal", "th": "ฐ", "hint": "thɔɔ thaan (HC uncommon)" },
                    { "en": "hermit", "th": "ษ", "hint": "sɔɔ Reading & Writingw-sii (HC uncommon)" },
                    { "en": "pavilion", "th": "ศ", "hint": "sɔɔ saa-laa (HC uncommon)" }
                ],
                "structure":
                    [
                        { "en": "What is this?", "th": "นี อะไร", "hint": "nîi à-rai" },
                        { "en": "This is a high class consonant", "th": "นี เป็น พยัญชนะ สูง", "hint": "nîi bpen phá-yan-chá-ná sǔuŋ" }
                    ]
            },
            {
                "name": "Practice reading",
                "vocabulary": [
                    { "en": "crow", "th": "อีกา", "hint": "MC LV MT" },
                    { "en": "crab", "th": "ปู", "hint": "MC LV MT" },
                    { "en": "young uncle", "th": "อา", "hint": "MC LV MT" },
                    { "en": "see", "th": "ดู", "hint": "MC LV MT" },
                    { "en": "year", "th": "ปี", "hint": "MC LV MT" },
                    { "en": "grown up", "th": "โต", "hint": "MC LV MT" },
                    { "en": "good", "th": "ดี", "hint": "MC LV MT" },
                    //                    { "en": "lotus", "th": "บัว", "hint": "MC LV MT" },
                    { "en": "eye", "th": "ตา", "hint": "MC LV MT" },
                    { "en": "meet", "th": "เจอ", "hint": "MC LV MT" },
                    { "en": "remember", "th": "จํา", "hint": "MC LV MT" },
                    { "en": "go", "th": "ไป", "hint": "MC LV MT" },
                    { "en": "island", "th": "เกาะ", "hint": "MC SV LT" },
                    { "en": "sheep", "th": "แกะ", "hint": "MC SV LT" },
                    { "en": "touch", "th": "เตะ", "hint": "MC SV LT" },
                    { "en": "year", "th": "ปี", "hint": "MC SV LT" },
                    { "en": "eye", "th": "ตา", "hint": "MC SV LT" },
                    { "en": "fierce", "th": "ดุ", "hint": "MC SV LT" },
                    { "en": "light", "th": "เบา", "hint": "MC SV LT" },
                    { "en": "remember", "th": "จํา", "hint": "MC SV LT" },
                    { "en": "lotus", "th": "บัว", "hint": "MC SV LT" },
                    { "en": "leg", "th": "ขา", "hint": "HC LV RT" },
                    { "en": "look for", "th": "หา", "hint": "HC LV RT" },
                    { "en": "ghost", "th": "ผี", "hint": "HC LV RT" },
                    { "en": "color", "th": "สี", "hint": "HC LV RT" },
                    { "en": "hold", "th": "ถือ", "hint": "HC LV RT" },
                    { "en": "ear", "th": "หู", "hint": "HC LV RT" },
                    { "en": "net", "th": "แห", "hint": "HC LV RT" },
                    { "en": "jar", "th": "โถ", "hint": "HC LV RT" },
                    { "en": "broken", "th": "เสีย", "hint": "HC LV RT" },
                    { "en": "tiger", "th": "เสือ", "hint": "HC LV RT" },
                    { "en": "clear", "th": "ใส", "hint": "HC LV RT" },
                    //                    { "en": "louse", "th": "เหา", "hint": "HC SV LT" },
                    //                    { "en": "decay", "th": "ผุ", "hint": "HC SV LT" },
                    { "en": "please", "th": "ขอ", "hint": "HC SV LT" },
                    { "en": "head", "th": "หัว", "hint": "HC SV LT" },
                    { "en": "apply", "th": "ทา", "hint": "LC LV SV" },
                    { "en": "tea", "th": "ชา", "hint": "LC LV SV" },
                    { "en": "rice field", "th": "นา", "hint": "LC LV SV" },
                    { "en": "come", "th": "มา", "hint": "LC LV SV" },
                    { "en": "medicine", "th": "ยา", "hint": "LC LV SV" },
                    { "en": "have", "th": "มี", "hint": "LC LV SV" },
                    { "en": "hand", "th": "มือ", "hint": "LC LV SV" },
                    { "en": "raft", "th": "แพ", "hint": "LC LV SV" },
                    { "en": "wait", "th": "รอ", "hint": "LC LV SV" },
                    { "en": "neck", "th": "คอ", "hint": "LC LV SV" },
                    { "en": "enough", "th": "พอ", "hint": "LC LV SV" },
                    { "en": "boat", "th": "เรือ", "hint": "LC LV SV" },
                    { "en": "light or fire", "th": "ไฟ", "hint": "LC LV SV" },
                    { "en": "drunk", "th": "เมา", "hint": "LC LV SV" }
                ],
                "structure":
                    [
                        { "en": "What is this?", "th": "นี อะไร", "hint": "nîi à-rai" },
                        { "en": "This is a word", "th": "นี เป็น คํา", "hint": "nîi bpen kham" }
                    ]
            },
            {
                "name": "Five tones and four tone markers",
                "vocabulary": [
                    { "en": "forest", "th": "ป่า", "hint": "" },
                    { "en": "to tell off", "th": "ด่า", "hint": "" },
                    { "en": "how many", "th": "กี ̃", "hint": "" },
                    { "en": "grandfather", "th": "ปู ่", "hint": "" },
                    { "en": "but", "th": "แต่", "hint": "" },
                    { "en": "bored", "th": "เบื ̃อ", "hint": "" },
                    { "en": "crazy", "th": "บ้า", "hint": "" },
                    { "en": "aunt", "th": "ป้า", "hint": "" },
                    { "en": "stubborn or naughty", "th": "ดือ", "hint": "" },
                    { "en": "older sister", "th": "เจ๊", "hint": "" },
                    { "en": "ticket", "th": "ตัว", "hint": "" },
                    { "en": "I see or understand", "th": "อ๋อ", "hint": "" },
                    { "en": "chicken", "th": "ไก่", "hint": "" },
                    { "en": "can", "th": "ได้", "hint": "" },
                    { "en": "south or under", "th": "ใต้", "hint": "" },
                    { "en": "turtle", "th": "เต่า", "hint": "" },
                    { "en": "nine", "th": "เก้า", "hint": "" },
                    { "en": "egg", "th": "ไข่", "hint": "" },
                    { "en": "tiger", "th": "เสื ̃อ", "hint": "" },
                    { "en": "knee", "th": "เข่า", "hint": "" },
                    { "en": "enter", "th": "เข้า", "hint": "" },
                    { "en": "poop", "th": "ขี", "hint": "" },
                    { "en": "if", "th": "ถ้า", "hint": "" },
                    { "en": "inject", "th": "ฉี", "hint": "" },
                    { "en": "color", "th": "สี", "hint": "" },
                    { "en": "you", "th": "สู ้", "hint": "" },
                    { "en": "beans", "th": "ถัว", "hint": "" },
                    { "en": "give", "th": "ให้", "hint": "" },
                    { "en": "five", "th": "ห้า", "hint": "" },
                    { "en": "cloth", "th": "ผ้า", "hint": "" },
                    { "en": "bamboo", "th": "ไผ่", "hint": "" },
                    { "en": "wrap", "th": "ห่อ", "hint": "" },
                    { "en": "ghost", "th": "ผี", "hint": "" },
                    { "en": "elder", "th": "พี", "hint": "" },
                    { "en": "father", "th": "พ่อ", "hint": "" },
                    { "en": "mother", "th": "แม่", "hint": "" },
                    { "en": "electricity bill", "th": "ค่าไฟ", "hint": "" },
                    { "en": "rent", "th": "ค่าเช่า", "hint": "" },
                    { "en": "foot", "th": "เท้า", "hint": "" },
                    { "en": "hole", "th": "รู ้", "hint": "" },
                    { "en": "horse", "th": "ม้า", "hint": "" },
                    { "en": "aunt", "th": "น้า", "hint": "" },
                    { "en": "slow", "th": "ช้า", "hint": "" },
                    { "en": "no", "th": "ไม่", "hint": "" },
                    { "en": "time", "th": "ที", "hint": "" },
                    { "en": "electricity", "th": "ไฟฟ้า", "hint": "" },
                    { "en": "blue", "th": "สีฟา ้", "hint": "" },
                    { "en": "river", "th": "แม่นํา", "hint": "" },
                    { "en": "name", "th": "ชื", "hint": "" },
                    { "en": "pair", "th": "คู่", "hint": "" }
                ],
                "structure":
                    []
            }
        ]
    },
    {
        "title": "Reading & Writing 2",
        "lessons": [
            {
                "name": "Change form vowels",
                "vocabulary":
                    [
                        { "en": "together", "th": "กัน", "hint": "กัน" },
                        { "en": "eat", "th": "กิน", "hint": "กิน" },
                        //                        { "en": "axis", "th": "แก็น", "hint": "แก็น" },
                        { "en": "over", "th": "เกิน", "hint": "เกิน" },
                        { "en": "stir", "th": "กวน", "hint": "กวน" },
                        { "en": "an", "th": "อัน", "hint": "อัน" },
                        { "en": "day", "th": "วัน", "hint": "วัน" },
                        { "en": "it", "th": "มัน", "hint": "มัน" },
                        { "en": "I (female)", "th": "ฉัน", "hint": "ฉัน" },
                        { "en": "tooth", "th": "ฟัน", "hint": "ฟัน" },
                        { "en": "as", "th": "ดัง", "hint": "ดัง" },
                        //                        { "en": "gluten", "th": "ตัง", "hint": "ตัง" },
                        { "en": "not_yet", "th": "ยัง", "hint": "ยัง" },
                        { "en": "listen", "th": "ฟัง", "hint": "ฟัง" },
                        //                        { "en": "tank", "th": "ถัง", "hint": "ถัง" },
                        { "en": "bite", "th": "กัด", "hint": "กัด" },
                        { "en": "cut", "th": "ตัด", "hint": "ตัด" },
                        //                        { "en": "scrub", "th": "ขัด", "hint": "ขัด" },
                        //                        { "en": "puff", "th": "ผัด", "hint": "ผัด" },
                        { "en": "blow", "th": "พัด", "hint": "พัด" },
                        { "en": "shot", "th": "นัด", "hint": "นัด" },
                        { "en": "measure", "th": "วัด", "hint": "วัด" },
                        { "en": "love", "th": "รัก", "hint": "รัก" },
                        //                        { "en": "whip", "th": "ชัก", "hint": "ชัก" },
                        { "en": "gun", "th": "ปืน", "hint": "ปืน" },
                        { "en": "stand", "th": "ยืน", "hint": "ยืน" }
                    ],
                "structure":
                    []
            },
            {
                "name": "Live final consonants",
                "vocabulary":
                    [
                        { "en": "afternoon", "th": "บ่าย", "hint": "MC + Live endings + Tone markers - LIVE" },
                        //                       { "en": "frequent", "th": "บ่อย", "hint": "MC + Live endings + Tone markers - LIVE" },
                        //                        { "en": "bay", "th": "อ่าว", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "read", "th": "อ่าน", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "shrimp", "th": "กุ้ง", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "cheek", "th": "แก้ม", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "pace", "th": "ก้าว", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "some", "th": "บ้าง", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "sign", "th": "ป้าย", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "sugar cane", "th": "อ้อย", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "flour", "th": "แป้ง", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "hire", "th": "จ้าง", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "house", "th": "บ้าน", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "basin", "th": "อ่างนำ้", "hint": "MC + Live endings + Tone markers - LIVE" },
                        { "en": "branch", "th": "กิ่งไม้", "hint": "MC + Live endings + Tone markers - LIVE" }],
                "structure":
                    []
            }
        ]
    },
    {
        "title": "Reading & Writing 3",
        "lessons": [
            {
                "name": "Leading consonant clusters",
                "vocabulary":
                    [
                        { "en": "don't", "th": "อย่า", "hint": "อ as a leading consonant" },
                        { "en": "be", "th": "อยู่", "hint": "อ as a leading consonant" },
                        { "en": "Type, Kind, Classifier of things", "th": "อย่าง", "hint": "อ as a leading consonant" },
                        { "en": "to want", "th": "อยาก", "hint": "อ as a leading consonant" },
                        { "en": "dog", "th": "หมา", "hint": "ห as a leading consonant" },
                        { "en": "bear", "th": "หมี", "hint": "ห as a leading consonant" },
                        { "en": "pig", "th": "หมู", "hint": "ห as a leading consonant" },
                        { "en": "to be", "th": "ไหม", "hint": "ห as a leading consonant" },
                        { "en": "road", "th": "ถนน", "hint": "Non-conforming Initial Clusters" },
                        { "en": "snack", "th": "ขนม", "hint": "Non-conforming Initial Clusters" },
                        { "en": "market", "th": "ตลาด", "hint": "Non-conforming Initial Clusters" },
                        { "en": "to laugh", "th": "ตลก", "hint": "Non-conforming Initial Clusters" },
                        //                        { "en": "don't", "th": "อย่า", "hint": "อ as a leading consonant" },
                        { "en": "be", "th": "อยู่", "hint": "อ as a leading consonant" },
                        //                        { "en": "Type, Kind, Classifier of things", "th": "อย่าง", "hint": "อ as a leading consonant" },
                        { "en": "to want", "th": "อยาก", "hint": "อ as a leading consonant" },
                        { "en": "dog", "th": "หมา", "hint": "ห as a leading consonant" },
                        { "en": "bear", "th": "หมี", "hint": "ห as a leading consonant" },
                        { "en": "pig", "th": "หมู", "hint": "ห as a leading consonant" },
                        { "en": "to be", "th": "ไหม", "hint": "ห as a leading consonant" },
                        { "en": "doctor", "th": "หมอ", "hint": "ห as a leading consonant" },
                        { "en": "thick", "th": "หนา", "hint": "ห as a leading consonant" },
                        { "en": "above", "th": "เหนือ", "hint": "ห as a leading consonant" },
                        { "en": "which", "th": "ไหน", "hint": "ห as a leading consonant" },
                        { "en": "lonely", "th": "เหงา", "hint": "ห as a leading consonant" },
                        { "en": "or", "th": "หรือ", "hint": "ห as a leading consonant" },
                        { "en": "no", "th": "ไม", "hint": "Without final consonants + Tone markers" },
                        { "en": "new", "th": "ใหม่", "hint": "Without final consonants + Tone markers" },
                        { "en": "not / burned", "th": "ไม่ / ไหม้", "hint": "Without final consonants + Tone markers" },
                        { "en": "wood", "th": "ไม้", "hint": "Without final consonants + Tone markers" },
                        { "en": "burned", "th": "ไหม้", "hint": "Without final consonants + Tone markers" },
                        { "en": "have", "th": "มี", "hint": "Without final consonants + Tone markers" },
                        { "en": "bear", "th": "หมีL", "hint": "Without final consonants + Tone markers" },
                        { "en": "to be", "th": "มีL / หมี", "hint": "Without final consonants + Tone markers" },
                        { "en": "doctor", "th": "มี", "hint": "Without final consonants + Tone markers" },
                        { "en": "thick", "th": "หนา", "hint": "Without final consonants + Tone markers" },
                        { "en": "pig", "th": "หมู", "hint": "Without final consonants + Tone markers" },
                        { "en": "to be", "th": "มู ้", "hint": "Without final consonants + Tone markers" },
                        { "en": "bear", "th": "หมู", "hint": "Without final consonants + Tone markers" },
                        { "en": "medicine", "th": "ยา", "hint": "Without final consonants + Tone markers" },
                        { "en": "divorce", "th": "หย่า", "hint": "Without final consonants + Tone markers" },
                        { "en": "grandmother", "th": "ย่า / หย้า", "hint": "Without final consonants + Tone markers" },
                        { "en": "to be", "th": "ลอ", "hint": "Without final consonants + Tone markers" },
                        { "en": "handsome", "th": "หล่อ", "hint": "Without final consonants + Tone markers" },
                        { "en": "to tease", "th": "ล่อ / หล้อ", "hint": "Without final consonants + Tone markers" },
                        { "en": "wheel", "th": "ล้อ", "hint": "Without final consonants + Tone markers" },
                        { "en": "to deceive", "th": "หลอ", "hint": "Without final consonants + Tone markers" },
                        { "en": "farm", "th": "ไร่", "hint": "Without final consonants + Tone markers" },
                        { "en": "how many", "th": "ไหร่", "hint": "Without final consonants + Tone markers" },
                        { "en": "farm / how many", "th": "ไร่ / ไหร้", "hint": "Without final consonants + Tone markers" },
                        //                        { "en": "to be without", "th": "ไร้", "hint": "Without final consonants + Tone markers" },
                        //                        { "en": "to be without", "th": "ไหร", "hint": "Without final consonants + Tone markers" }
                    ],
                "structure":
                    [
                        { "en": "Don't eat food in the fridge", "th": "อย่า กิน อาหาร ใน ตู้เย็น", "hint": "" },
                        { "en": "Don't stay up late tonight", "th": "คืนนี อย่า นอน ดึก", "hint": "" },
                        { "en": "My house is near an Indian restaurant", "th": "บ้าน ของ ผม อยู่ ใกล้ กับ ร้าน อาหาร อินเดีย", "hint": "" },
                        { "en": "My friend has lived in Bangkok for ten years", "th": "เพื่อน ของ ผม อยู่ กรุงเทพ มา สิบ ปี แล้ ว", "hint": "" },
                        { "en": "I'm not free right now, I'm driving", "th": "ผม ยัง ไม่ ว่าง ตอนนี กําลัง ขับรถ อยู่", "hint": "" },
                        { "en": "My mom is going to make two or three dishes for dinner", "th": "แม่ ของ ฉัน จะ ทํา อาหาร เย็น สอง สาม อย่าง", "hint": "" },
                        { "en": "Grandma wants to travel to Mexico", "th": "คุณ ย่า อยาก ไปเที่ยว ประเทศ เม็กซิโก", "hint": "" }
                    ]
            },
            {
                "name": "Silent Mark",
                "vocabulary":
                    [
                        { "en": "animal", "th": "สัตว์", "hint": "silent mark" },
                        { "en": "to text", "th": "พิมพ์", "hint": "silent mark" },
                        { "en": "giant", "th": "ยักษ์", "hint": "silent mark" },
                        { "en": "Saturday", "th": "วันเสาร์", "hint": "silent mark" },
                        { "en": "emotion", "th": "อารมณ์", "hint": "silent mark" },
                        { "en": "lift or elevator", "th": "ลิฟต์", "hint": "silent mark" },
                        { "en": "wine", "th": "ไวน์", "hint": "silent mark" },
                        { "en": "car", "th": "รถยนต์", "hint": "silent mark" },
                        { "en": "cartoon", "th": "การ์ตูน", "hint": "silent mark" },
                        { "en": "Hormone", "th": "ฮอร์โมน", "hint": "silent mark" },
                        { "en": "Motorcycle", "th": "มอเตอร์ไซค์", "hint": "silent mark" },
                        { "en": "February", "th": "กุมภาพันธ์", "hint": "silent mark" },
                        { "en": "Dinosaur", "th": "ไดโนเสาร์", "hint": "silent mark" },
                        { "en": "Computer", "th": "คอมพิวเตอร์", "hint": "silent mark" },
                        { "en": "Pagoda", "th": "เจดีย์", "hint": "silent mark" },
                        { "en": "Sunday", "th": "วันอาทิตย์", "hint": "silent mark" },
                        { "en": "Friday", "th": "วันศุกร์", "hint": "silent mark" },
                        { "en": "Teacher", "th": "อาจารย์", "hint": "silent mark" },
                        { "en": "Vocabulary", "th": "คําศัพท์", "hint": "silent mark" },
                        { "en": "Week", "th": "สัปดาห์", "hint": "silent mark" },
                        { "en": "Song Kran", "th": "สงกรานต์", "hint": "silent mark" },
                        { "en": "Netherlands", "th": "เนเธอร์แลนด์", "hint": "silent mark" },
                        { "en": "Finland", "th": "ฟินแลนด์", "hint": "silent mark" },
                        { "en": "Nuclear", "th": "นิวเคลียร์", "hint": "silent mark" },
                        { "en": "Physics", "th": "ฟิสิกส์", "hint": "silent mark" },
                        { "en": "Guitar", "th": "กีตาร์", "hint": "silent mark" },
                        { "en": "Supermarket", "th": "ซูเปอร์มาร์เก็ต", "hint": "silent mark" },
                        { "en": "Townhouse", "th": "ทาวน์เฮาส์", "hint": "silent mark" },
                        { "en": "Monday", "th": "วันจันทร์", "hint": "silent mark" },
                        { "en": "Vientiane", "th": "เวียงจันทน์", "hint": "silent mark" },
                        { "en": "Film", "th": "ภาพยนตร์", "hint": "silent mark" },
                        { "en": "Science", "th": "วิทยาศาสตร์", "hint": "silent mark" },
                        { "en": "Mathematics", "th": "คณิตศาสตร์", "hint": "silent mark" },
                        { "en": "Camera", "th": "กล้องฟิล์ม", "hint": "silent mark" },
                        { "en": "Golf", "th": "กอล์ฟ", "hint": "silent mark" },
                        { "en": "Denmark", "th": "เดนมาร์ก", "hint": "silent mark" },
                        { "en": "temple", "th": "โบสถ์", "hint": "silent mark" },
                        { "en": "Pagoda", "th": "เจดีย์", "hint": "silent mark" },
                        { "en": "Classifier for place", "th": "แห่ง", "hint": "silent mark" },
                        { "en": "many", "th": "หลาย", "hint": "silent mark" },
                        { "en": "To post", "th": "โพสต์", "hint": "silent mark" },
                        { "en": "To like", "th": "กดไลก์", "hint": "silent mark" },
                        { "en": "Don't", "th": "อย่า", "hint": "silent mark" },
                        { "en": "To forget", "th": "ลืม", "hint": "silent mark" },
                        { "en": "Sure / Of course", "th": "แน่นอน", "hint": "silent mark" },
                        { "en": "Photo", "th": "รูป", "hint": "silent mark" }
                    ],
                "structure": [
                    { "en": "What are you doing this weekend?", "th": "คุณ ทำ อะไร ใน สุดสัปดาห์ นี้", "hint": "" },
                    { "en": "I'm going to the market to buy food.", "th": "ฉัน จะ ไป ตลาด เพื่อ ซื้อ อาหาร", "hint": "" },
                    { "en": "Somchai: How was it? Was it fun?", "th": "สมชาย : เป็น ยังไงบ้าง ครับ สนุก ไหม", "hint": "" },
                    { "en": "Golab: It was so much fun. My daughter really enjoyed watching the seal show. What about you?", "th": "กุหลาบ : สนุก มาก ค่ะ ลูก สาว ของ ฉัน ชอบ ดู โชว์ ของ แมวน้ำ มาก ค่ะ แล้ว คุณ ล่ะ คะ", "hint": "" },
                    { "en": "Somchai: I went to Vientiane with friends.", "th": "สมชาย : ผม ไป เที่ยว เมือง เวียงจันทน์ มา ครับ ไป กับ เพื่อน ๆ", "hint": "" },
                    { "en": "Golab: Really? I've never been there. I've heard there are many beautiful temples.", "th": "กุหลาบ : จริง เหรอคะ ฉัน ยัง ไม่ เคย ไป ที่ นั่น เลย ค่ะ ได้ ยิน ว่า มี วัด สวย หลาย แห่ง", "hint": "" },
                    { "en": "Somchai: Yes, there are very beautiful temples and pagodas in the temple.", "th": "สมชาย : ใช่ ครับ ใน วัด มี โบสถ์ และ เจดีย์ ที่ สวย มาก ครับ", "hint": "" },
                    { "en": "Golab: Wow, don't forget to post the picture on Facebook. I'll go and like it for you.", "th": "กุหลาบ : ว้าว อย่าลืม โพสต์ รูป ลง ใน เฟซบุ๊ก นะคะ ฉัน จะ ไป กด ไลก์ ให้ คุณ", "hint": "" },
                    { "en": "Where did you go, Mr Golab, and who did you go with?", "th": "กุหลาบ : คุณ ไป ที่ ไหน มา และ ไป กับ ใคร คะ", "hint": "" },
                    { "en": "I went at the weekend with my family.", "th": "ฉัน ไปเที่ยวสุดสัปดาห์กับครอบครัว", "hint": "" },
                    { "en": "Miss Gulap, what day are you going?", "th": "คุณ กุหลาบไปเที่ยววันอะไร", "hint": "" },
                    { "en": "I'm going at the weekend.", "th": "ฉัน จะ ไป ช่วง สุดสัปดาห์", "hint": "" },
                    { "en": "Where did Mr. Somchai go and who did he go with?", "th": "คุณ สมชาย ไป เที่ยว ที่ ไหน และ ไป กับ ใคร ครับ", "hint": "" },
                    { "en": "Mr. Somchai went to Vientiane with his friends.", "th": "คุณ สมชาย ไป เที่ยว เวียงจันทน์ กับ เพื่อนๆ", "hint": "" }

                ]
            },
            {
                "name": "Double cosonants",
                "vocabulary":
                    [
                        { "en": "sissors", "th": "กรรไกร", "hint": "" },
                        { "en": "trucks", "th": "รถบรรทุก", "hint": "" },
                        { "en": "housing", "th": "หมู่บ้านจัดสรร", "hint": "" },
                        { "en": "candle", "th": "เทียนพรรษา", "hint": "" },
                        { "en": "ruler", "th": "ไม้บรรทัด", "hint": "" },
                        { "en": "pregnant", "th": "ตั้งครรภ์", "hint": "" },
                        { "en": "painkiller", "th": "ยาบรรเทาปวด", "hint": "" },
                        { "en": "wife", "th": "ภรรยา", "hint": "" },
                        { "en": "crab", "th": "กรรเชียงปู", "hint": "" },
                        { "en": "strategy", "th": "ยุทธศาสตร์", "hint": "" },
                        { "en": "ordinary", "th": "ธรรมดา", "hint": "" },
                        { "en": "abstract", "th": "นามธรรม", "hint": "" },
                        { "en": "sculpture", "th": "ประติมากรรม", "hint": "" },
                        { "en": "genetics", "th": "พันธุกรรม", "hint": "" },
                        { "en": "committee", "th": "กรรมการ", "hint": "" },
                        { "en": "nature", "th": "ธรรมชาติ", "hint": "" },
                        { "en": "political party", "th": "พรรคการเมือง", "hint": "" },
                        { "en": "century", "th": "ศตวรรษ", "hint": "" }
                    ],
                "structure": []
            },
            {
                "name": "A syllable end with ร",
                "vocabulary":
                    [
                        { "en": "Alphabet character", "th": "อักษร", "hint": "" },
                        { "en": "Monkey", "th": "วานร", "hint": "" },
                        { "en": "", "th": "ถาวร", "hint": "" },
                        { "en": "Labourer", "th": "กรรมกร", "hint": "" },
                        { "en": "Traffic light", "th": "ไฟจราจร", "hint": "" },
                        { "en": "Company", "th": "บริษัท", "hint": "" },
                        { "en": "Donate", "th": "บริจาค", "hint": "" },
                        { "en": "Waiter", "th": "บริกร", "hint": "" },
                        { "en": "So", "th": "ก็เลย", "hint": "" },
                        { "en": "Together", "th": "ด้วยกัน", "hint": "" },
                        { "en": "To give", "th": "ให้", "hint": "" },
                        { "en": "Samut Sakhon", "th": "สมุทรสาคร", "hint": "" },
                        { "en": "Nakhon Nayok", "th": "นครนายก", "hint": "" },
                        { "en": "Nakhon Ratchasima", "th": "นครราชสีมา", "hint": "" },
                        { "en": "Nakhon Pathom", "th": "นครปฐม", "hint": "" },
                        { "en": "Nakhon Phanom", "th": "นครพนม", "hint": "" }
                    ],
                "structure": [
                    { "en": "Somporn: Hello, Ms. Saisamorn. It's been a while.How are you?", "th": "สมพร : สวัสดีค่ะ คุณสายสมร ไม่ เจอ กัน นาน เลย นะคะ เป็น ยัง ไง บ้าง คะ", "hint": "" },
                    {
                        "en": "Saisamorn: Hello, Khun Somporn. I'm fine. I have to take care of my parents in Samut Sakhon Province, so I haven't had much free time.", "th": "สายสมร : สวัสดีค่ะ คุณ สมพร ฉัน สบายดี ค่ะ ช่วง นี้ ฉัน ต้อง ไป ดู แล พ่อ แม่ ที่ จังหวัด สมุทรสาคร ค่ะ ก็ เลย ไม่ ค่อย ว่าง", "hint": ""
                    },
                    {
                        "en": "Somporn: Really? I've never been there before. When will you go back there?", "th": "สมพร : จริง เหรอ คะ ฉัน ยัง ไม่ เคย ไป ที่ นั่น เลย ค่ะ คุณ จะ กลับ ไป ที่ นั่น อีก เมื่อ ไหร่ คะ", "hint": ""
                    },
                    {
                        "en": "Saisamorn: I think it might be in December. Do you want to go together?", "th": "สายสมร : ฉัน คิด ว่า อาจจะ เดือน ธันวาคม ค่ะ คุณ อยาก ไป ด้วย กัน ไหม คะ", "hint": ""
                    },
                    {
                        "en": "Somporn: Oh, what a pity! I'm not free then. I have to go to a close friend's wedding in Nakhon Si Thammarat Province.", "th": "สมพร : โอ้ น่า เสียดาย จัง เลย ค่ะ ช่วง นั้น ฉัน ไม่ ว่าง ต้อง ไป งาน แต่งงาน ของ เพื่อน สนิท ที่ จังหวัด นคร ศรี ธรรมราช ค่ะ", "hint": ""
                    },
                    {
                        "en": "Saisamorn: That's okay. I go there often. Next time, I'll invite you again.", "th": "สายสมร : ไม่ เป็น ไร ค่ะ ฉัน ไป ที่ นั่น บ่อยๆ โอกาส หน้า ฉัน จะ ชวน คุณ อีก นะ คะ", "hint": ""
                    },
                    {
                        "en": "Somporn: Thank you very much. I just came back from the market. I saw the edible flowers and bought many bags. This bag is for you.", "th": "สมพร : ขอบคุณ มาก ค่ะ ฉัน เพิ่ง กลับ มา จาก ตลาด เห็น ดอก ขจร ดู น่า กิน ก็ เลย ซื้อ มา หลาย ถุง เลย ค่ะ ถุง นี้ ฉัน ให้ คุณ นะ คะ", "hint": ""
                    },
                    {
                        "en": "Saisamorn: Thank you very much. I have to go now. The drama I like is about to start. See you again.", "th": "สายสมร : ขอบคุณ มาก ค่ะ ฉัน ต้อง ไป แล้ว ละคร ที่ ฉัน ชอบ กำลัง จะ มา แล้ว ไว้ เจอ กัน ใหม่ นะ คะ", "hint": ""
                    }
                ]
            },
            {
                "name": "Reading loan words in Thai",
                "vocabulary":
                    [
                        { "en": "January", "th": "มกราคม", "hint": "" },
                        { "en": "July", "th": "กรกฎาคม", "hint": "" },
                        { "en": "Telephone", "th": "โทรศัพท์", "hint": "" },
                        { "en": "television", "th": "โทรทัศน์", "hint": "" },
                        { "en": "normal", "th": "ปกติ", "hint": "" },
                        { "en": "United States", "th": "สหรัฐ", "hint": "" },
                        { "en": "attempt", "th": "พยายาม", "hint": "" },
                        { "en": "nurse", "th": "พยาบาล", "hint": "" },
                        { "en": "bank", "th": "ธนาคาร", "hint": "" },
                        { "en": "train station", "th": "สถานีรถไฟ", "hint": "" },
                        { "en": "government", "th": "รัฐบาล", "hint": "" },
                        { "en": "culture", "th": "วัฒนธรรม", "hint": "" },
                        { "en": "ordinary", "th": "ธรรมดา", "hint": "" },
                        { "en": "nature", "th": "ธรรมชาติ", "hint": "" },
                        { "en": "literature", "th": "วรรณกรรม", "hint": "" },
                        { "en": "movie", "th": "ภาพยนตร์", "hint": "" },
                        { "en": "mathematics", "th": "คณิตศาสตร์", "hint": "" },
                        { "en": "science", "th": "วิทยาศาสตร์", "hint": "" },
                        { "en": "psychology", "th": "จิตวิทยา", "hint": "" },
                        { "en": "festival", "th": "เทศกาล", "hint": "" },
                        { "en": "imagination", "th": "จินตนาการ", "hint": "" },
                        { "en": "season", "th": "ฤดู", "hint": "" },
                        { "en": "Thursday", "th": "พฤหัสบดี", "hint": "" },
                        { "en": "May", "th": "พฤษภาคม", "hint": "" },
                        { "en": "November", "th": "พฤศจิกายน", "hint": "" },
                        { "en": "Behavior", "th": "พฤติกรรม", "hint": "" },
                        { "en": "Death", "th": "มฤตยู", "hint": "" },
                        { "en": "Theory", "th": "ทฤษฎี", "hint": "" }
                    ],
                "structure": [

                    { "en": "Thailand has three seasons: summer, rainy season, and winter. Summer runs from March to May. April is the hottest month in Thailand. April has a very important tradition, which is the Songkran Festival.", "th": "เมือง ไทย มี ฤดู ได้ แก่ ฤดู ร้อน ฤดู ฝน และ ฤดู หนาว ฤดู ร้อน เริ่ม ตั้ง แต่ เดือน มีนาคม ถึง เดือน พฤษภาคม เดือน เมษายน เป็น เดือน ที่ ร้อน ที่ สุด ของ ประเทศไทย ใน เดือน เมษายน มี ประเพณี ที่ สำคัญ มาก นั่น ก็คือ ประเพณี สงกรานต์", "hint": "" },
                    { "en": "The rainy season in Thailand runs from June to mid-October, but sometimes the rains may start as early as mid-May. In September, storms often bring heavy rain to many provinces. During the rainy season, there is an important Buddhist festival, which is the Buddhist Lent.", "th": "ฤดู ฝน ใน เมืองไทย เริ่ม ตั้งแต่ เดือน มิถุนายน ถึง กลาง เดือน ตุลาคม แต่ บางครั้ง ฝน ก็ อาจจะ เริ่ม ตก ตั้งแต่ กลาง เดือน พฤษภาคม ใน ช่วง เดือน กันยายน มักจะ มี พายุ ทำให้ มี ฝน ตก หนัก ใน หลาย จังหวัด ใน ช่วง ฤดู ฝน มี เทศกาล สำคัญ ของ ชาว พุทธ นั่น ก็คือ เทศกาล เข้าพรรษา", "hint": "" },
                    { "en": "The winter season in Thailand runs from mid-October to February. Generally, the weather is not very cold, but the northern and upper northeastern regions can be quite chilly, especially in the mountains. During the winter season, there is a very famous festival called the Loy Krathong Festival.", "th": "ฤดู หนาว เริ่ม ตั้งแต่ กลาง เดือน ตุลาคม ถึง เดือน กุมภาพันธ์ โดย ทั่วไป อากาศ ไม่ ค่อย หนาว มาก แต่ จังหวัด ใน ภาค เหนือ และ ภาค อีสาน ตอน บน อากาศ ค่อน ข้าง หนาว โดย เฉพาะ บน ภูเขา ใน ช่วง ฤดู หนาว มี เทศกาล ที่ มี ชื่อเสียง มาก นั่น ก็คือ เทศกาล ลอย กระทง", "hint": "" }

                ]
            },
            {
                "name": "Irregular prnunciation",
                "vocabulary":
                    [
                        { "en": "Can", "th": "ได้", "hint": "" },
                        { "en": "Under", "th": "ใต้", "hint": "" },
                        { "en": "Wood", "th": "ไม้", "hint": "" },
                        { "en": "Morning", "th": "เช้า", "hint": "" },
                        { "en": "Lead", "th": "นำ", "hint": "" },
                        { "en": "Heart", "th": "ใจ", "hint": "" },
                        { "en": "Monarchy", "th": "ราชาธิปไตย", "hint": "" },
                        { "en": "Patriarchy", "th": "ปิตาธิปไตย", "hint": "" },
                        { "en": "Democracy", "th": "ประชาธิปไตย", "hint": "" },
                        { "en": "Fruit", "th": "ผลไม้", "hint": "" },
                        { "en": "Steal", "th": "ขโมย", "hint": "" },
                        { "en": "Explore", "th": "สํารวจ", "hint": "" },
                        { "en": "success", "th": "ความสําเร็จ", "hint": "" },
                        { "en": "Birth", "th": "กําเนิด", "hint": "" },
                        { "en": "Recipe", "th": "ตํารับ", "hint": "" },
                        { "en": "Suppression", "th": "กําราบ", "hint": "" },
                        { "en": "Darkness", "th": "ดําริ", "hint": "" },
                        { "en": "Sermon", "th": "ดํารัส", "hint": "" },
                        { "en": "Graph", "th": "กราฟ", "hint": "" },
                        { "en": "Quota", "th": "โควตา", "hint": "" }
                    ],
                "structure": []
            },
            {
                "name": "Writing Signs",
                "vocabulary":
                    [
                        { "en": "Bangkok", "th": "กรุงเทพฯ", "hint": "" },
                        { "en": "Thursday", "th": "วันพฤหัสฯ", "hint": "" },
                        { "en": "Prime Minister", "th": "นายกฯ", "hint": "" },
                        { "en": "Children", "th": "เด็กๆ", "hint": "" },
                        { "en": "Friends", "th": "เพื่อนๆ", "hint": "" },
                        { "en": "Very", "th": "มากๆ", "hint": "" },
                        { "en": "Many", "th": "เยอะๆ", "hint": "" },
                        { "en": "Green", "th": "สีเขียวๆ", "hint": "" },
                        { "en": "Orange", "th": "สีส้มๆ", "hint": "" },
                        { "en": "Red", "th": "สีแดงๆ", "hint": "" },
                        { "en": "Blue", "th": "สีน้ำเงินๆ", "hint": "" },
                        { "en": "Yellow", "th": "สีเหลืองๆ", "hint": "" },
                        { "en": "Black", "th": "สีดำๆ", "hint": "" },
                        { "en": "White", "th": "สีขาวๆ", "hint": "" }

                    ],
                "structure": [
                    {
                        "en": "Thai people usually eat rice as their main food. They will eat rice with other foods called khao khao such as curry, boiled, stir-fried, fried, etc. Nowadays, Thai people use spoons and forks to eat.", "th": "ปกติ แล้ว คน ไทย กิน ข้าว เป็น อาหาร หลัก พวก เขา จะ กิน ข้าว กับ อาหาร อื่นๆ เรียก ว่า 'กับข้าว' เช่น อาหาร ประเภท แกง ต้ม ผัด ทอดฯลฯ ใน ปัจจุบัน คน ไทย ใช้ ช้อน กับ ส้อม กิน อาหาร", "hint": ""
                    },
                    {
                        "en": "Thailand has four regions: the North, Central, Northeast, and South. Food in each region has its own unique identity because each region has a different culture, which results in different eating cultures.", "th": "ประเทศ ไทย มี 4 ภาค ได้ แก่ ภาค เหนือ ภาค กลาง ภาค อีสาน และ ภาค ใต้ อาหาร ใน แต่ละ ภาค มี เอกลักษณ์ เฉพาะ ตัว เนื่องจาก แต่ละ ภาค มี วัฒนธรรม แตกต่าง กัน จึง ส่ง ผล ให้ วัฒนธรรม การ กิน แตกต่าง กัน", "hint": ""
                    },
                    {
                        "en": "The staple food of northern people is sticky rice. They often eat various types of chili paste and curry such as Nam Phrik Num, Nam Phrik Ong, Gaeng Hang Lay, etc. They also eat fermented pork sausage, Sai Ua sausage, crispy pork skin, and various vegetables.", "th": "อาหาร หลัก ของ คน ภาค เหนือ คือ ข้าวเหนียว ส่วนใหญ่ พวก เขา มัก จะ ทาน น้ำพริก และ แกง ต่างๆ เช่น น้ำพริกหนุ่ม น้ำพริกอ่อง แกงฮังเล ฯลฯ นอกจากนั้น ยัง ทาน แหนม ไส้อั่ว แคบหมู และ ผัก ต่างๆ ด้วย", "hint": ""
                    },
                    {
                        "en": "People in the central region eat rice as their main food. Central region food usually has various chili pastes and curries such as shrimp paste chili paste, tamarind chili paste, green curry, massaman curry, and chicken tom kha. Most central region food is made from coconut milk.", "th": "คน ภาค กลาง กิน ข้าว สวย เป็น อาหาร หลัก อาหาร ภาค กลาง มัก จะ มี น้ำพริก และ แกงต่างๆ เช่น น้ำพริกกะปิ น้ำพริกมะขาม แกงเขียวหวาน แกงมัสมัน ต้มข่าไก่ เป็นต้น ส่วน มาก อาหาร ภาค กลาง มัก จะ ทํา จาก กะท", "hint": ""
                    },
                    {
                        "en": "People in the northeastern region eat sticky rice as their main food, just like people in the north. Northeastern food is mostly spicy, sour, and salty. Since the area is quite dry, they have to preserve food, such as making fermented fish and dried chili. Most northeastern people use fermented fish to cook almost every type of food, such as larb, koi, som tam, and bamboo shoot soup.", "th": "คน ภาค อีสาน กิน ข้าว เหนียว เป็น อาหาร หลัก เหมือน กับ คน ภาค เหนือ อาหาร อีสาน ส่วน มาก มี รสเผ็ด เปรี้ยว และ เค็ม เนื่อง จาก แถว นั้น ค่อน ข้าง แห้ง แล้ง พวก เขา ก็ เลย ต้อง ถนอม อาหาร เช่น ทํา ปลา ร้า ทํา พริก แห้ง เป็นต้น คน อีสาน ส่วน ใหญ่ ใช้ ปลาร้า ทํา อาหาร เกือบ ทุก ประเภท ตัวอย่างเช่น ลาบ ก้อย ส้มตํา ซุบหน่อไม้ เป็นต้น", "hint": ""
                    },
                    {
                        "en": "People in the southern region eat steamed rice like people in the central region. Southern local food is spicy because it is made from various spices. The meat used in cooking is mostly seafood, such as mackerel, tuna, crab, shrimp, and shellfish. Famous southern dishes include rice salad, yellow curry, fish head curry, stir-fried stinky beans with shrimp, etc.", "th": "คนภาคใต้ กิน ข้าวสวยเหมือนกับคนภาคกลาง อาหารพื้นบ้านภาคใต้ มีรสจัดเพราะว่าทําจากเครื่องเทศหลากหลายชนิด เนื้อสัตว์ที่นํามาทําอาหารส่วนมากเป็นสัตว์ทะเล เช่น ปลากระบอก ปลาทู ปูทะเลกุ้ง และหอย อาหารทีมีชื่อเสียงมากของภาคใต้ ได้แก่ ข้าวยำ แกงเหลืองแกงไตปลา สะตอผัดกุ้ง ฯลฯ", "hint": ""
                    },
                ]
            }
        ]
    },
    {
        "title": "Mana Mani",
        "lessons": [
            {
                "name": "Mana Mani",
                "vocabulary": [
                    { "en": "Crow", "th": "กา", "hint": "" },
                    { "en": "Uncle", "th": "อา", "hint": "" },
                    { "en": "Rice paddy", "th": "นา", "hint": "" },
                    { "en": "Good", "th": "ดี", "hint": "" },
                    { "en": "Mani", "th": "มานี", "hint": "" },
                    { "en": "Eyes", "th": "ตา", "hint": "" },
                    { "en": "Come", "th": "มา", "hint": "" },
                    { "en": "have", "th": "มี", "hint": "" },
                    { "en": "hit", "th": "ตี", "hint": "" },
                    { "en": "hurl", "th": "ปา", "hint": "" },
                    { "en": "see", "th": "ดู", "hint": "" },
                    { "en": "hole", "th": "รู", "hint": "" },
                    { "en": "crab", "th": "ปู", "hint": "" },
                    { "en": "ear", "th": "หู", "hint": "" },
                    { "en": "nose", "th": "จมูก", "hint": "" },
                    { "en": "mouth", "th": "ปาก", "hint": "" },
                    { "en": "snake", "th": "งู", "hint": "" },
                    { "en": "look", "th": "พา", "hint": "" },
                    { "en": "find", "th": "หา", "hint": "" },
                    { "en": "go", "th": "ไป", "hint": "" },
                    { "en": "quick", "th": "ไว", "hint": "" },
                    { "en": "heart", "th": "ใจ", "hint": "" },
                    { "en": "in", "th": "ใน", "hint": "" },
                    { "en": "any", "th": "ใด", "hint": "" },
                    { "en": "put", "th": "ใส่", "hint": "" },
                    { "en": "scratch", "th": "เกา", "hint": "" },
                    { "en": "guess", "th": "เดา", "hint": "" },
                    { "en": "stove", "th": "เตา", "hint": "" },
                    { "en": "take", "th": "เอา", "hint": "" },
                    { "en": "we", "th": "เรา", "hint": "" },
                    { "en": "shadow", "th": "เงา", "hint": "" },
                    { "en": "he", "th": "เขา", "hint": "" },
                    { "en": "lice", "th": "เหา", "hint": "" },
                    { "en": "pole", "th": "เสา", "hint": "" },
                    { "en": "nest", "th": "เถา", "hint": "" },
                    { "en": "pour", "th": "เท", "hint": "" },
                    { "en": "take", "th": "เอา", "hint": "" },
                    { "en": "guess", "th": "เย", "hint": "" },
                    { "en": "stove", "th": "เม", "hint": "" },
                    { "en": "heart", "th": "เส", "hint": "" },
                    { "en": "cross-eyed", "th": "เข", "hint": "" },
                    { "en": "Apply", "th": "ทา", "hint": "" },
                    { "en": "independent", "th": "ไท", "hint": "" },
                    { "en": "mold", "th": "รา", "hint": "" },
                    { "en": "dance", "th": "รํา", "hint": "" },
                    { "en": "leg", "th": "ขา", "hint": "" },
                    { "en": "egg", "th": "ไข", "hint": "" },
                    { "en": "funny", "th": "ขํา", "hint": "" },
                    { "en": "bar", "th": "บา", "hint": "" },
                    { "en": "light", "th": "เบา", "hint": "" },
                    { "en": "bark", "th": "ไบ", "hint": "" },
                    { "en": "bloom", "th": "บํา", "hint": "" },
                    { "en": "for", "th": "แก", "hint": "" },
                    { "en": "net", "th": "แห", "hint": "" },
                    { "en": "row", "th": "แถ", "hint": "" },
                    { "en": "subject", "th": "วิชา", "hint": "" },
                    { "en": "second", "th": "วินาที", "hint": "" },
                    { "en": "jasmine", "th": "มะลิ", "hint": "" },
                    { "en": "father", "th": "บิดา", "hint": "" },
                    { "en": "coconut milk", "th": "กะทิ", "hint": "" },
                    { "en": "shrimp paste", "th": "กะป", "hint": "" },
                    { "en": "have", "th": "มี", "hint": "" },
                    { "en": "and", "th": "และ", "hint": "" },
                    { "en": "stop by", "th": "แวะ", "hint": "" },
                    { "en": "advise", "th": "แนะ", "hint": "" },
                    { "en": "gnaw", "th": "แทะ", "hint": "" },
                    { "en": "dig", "th": "แคะ", "hint": "" },
                    { "en": "many", "th": "แยะ", "hint": "" },
                    { "en": "goat", "th": "แพะ", "hint": "" },
                    { "en": "sheep", "th": "แกะ", "hint": "" },
                    { "en": "tap", "th": "แตะ", "hint": "" },
                    { "en": "stick", "th": "แปะ", "hint": "" },
                    { "en": "pry", "th": "แงะ", "hint": "" },
                    { "en": "sleepwalk", "th": "ละเมอ", "hint": "" },
                    { "en": "eggplant", "th": "มะเขือ", "hint": "" },
                    { "en": "You", "th": "ท่าน", "hint": "" },
                    { "en": "Aloe vera", "th": "ว่าน", "hint": "" },
                    { "en": "curtain", "th": "ม่าน", "hint": "" },
                    { "en": "charcoal", "th": "ถ่าน", "hint": "" },
                    { "en": "goose", "th": "ห่าน", "hint": "" },
                    { "en": "shop", "th": "ร้าน", "hint": "" },
                    { "en": "house", "th": "บ้าน", "hint": "" },
                    { "en": "side", "th": "ด้าน", "hint": "" },
                    { "en": "against", "th": "ค้าน", "hint": "" },
                    { "en": "stem", "th": "ก้าน", "hint": "" },
                    { "en": "bark", "th": "เปลือก", "hint": "" },
                    { "en": "bloom", "th": "บาน", "hint": "" },
                    { "en": "for", "th": "เพื่อ", "hint": "" },
                    { "en": "net", "th": "ตาข่าย", "hint": "" },
                    { "en": "person", "th": "คน", "hint": "" },
                    { "en": "until", "th": "จน", "hint": "" },
                    { "en": "mix", "th": "ปน", "hint": "" },
                    { "en": "on", "th": "บน", "hint": "" },
                    { "en": "self", "th": "ตน", "hint": "" },
                    { "en": "endure", "th": "ทน", "hint": "" },
                    { "en": "collide", "th": "ชน", "hint": "" },
                    { "en": "burn", "th": "รน", "hint": "" },
                    { "en": "turn", "th": "วน", "hint": "" },
                    { "en": "carry", "th": "ขน", "hint": "" },
                    { "en": "support", "th": "สน", "hint": "" },
                    { "en": "sleep", "th": "นอน", "hint": "" },
                    { "en": "deduct", "th": "ทอน", "hint": "" },
                    { "en": "howl", "th": "หอน", "hint": "" },
                    { "en": "teach", "th": "สอน", "hint": "" },
                    { "en": "withdraw", "th": "ถอน", "hint": "" },
                    { "en": "hug", "th": "กอด", "hint": "" },
                    { "en": "park", "th": "จอด", "hint": "" },
                    { "en": "lung", "th": "ปอด", "hint": "" },
                    { "en": "ask", "th": "ขอด", "hint": "" },
                    { "en": "take off", "th": "ถอด", "hint": "" },
                    { "en": "insert", "th": "สอด", "hint": "" },
                    { "en": "bite", "th": "ตอด", "hint": "" },
                    { "en": "gnaw", "th": "มอด", "hint": "" },
                    { "en": "tip", "th": "ยอด", "hint": "" },
                    { "en": "pass", "th": "ลอด", "hint": "" },
                    { "en": "stretch", "th": "ทอด", "hint": "" },
                    { "en": "ask", "th": "ถาม", "hint": "" },
                    { "en": "carry", "th": "หาม", "hint": "" },
                    { "en": "three", "th": "สาม", "hint": "" },
                    { "en": "beautiful", "th": "งาม", "hint": "" },
                    { "en": "name", "th": "นาม", "hint": "" },
                    { "en": "time", "th": "ยาม", "hint": "" },
                    { "en": "follow", "th": "ตาม", "hint": "" },
                    { "en": "bowl", "th": "ชาม", "hint": "" },
                    { "en": "which", "th": "ไหน", "hint": "" },
                    { "en": "new", "th": "ใหม่", "hint": "" },
                    { "en": "face", "th": "หน้า", "hint": "" },
                    { "en": "mouse", "th": "หนู", "hint": "" },
                    { "en": "pig", "th": "หมู", "hint": "" },
                    { "en": "dog", "th": "หมา", "hint": "" },
                    { "en": "run away", "th": "หนี", "hint": "" },
                    { "en": "bear", "th": "หมี", "hint": "" },
                    { "en": "lost", "th": "หลง", "hint": "" },
                    { "en": "shoulder", "th": "ไหล่", "hint": "" },
                    { "en": "group", "th": "หมู่", "hint": "" },
                    { "en": "single", "th": "เดียว", "hint": "" },
                    { "en": "fry", "th": "เจียว", "hint": "" },
                    { "en": "scythe", "th": "เคียว", "hint": "" },
                    { "en": "green", "th": "เขียว", "hint": "" },
                    { "en": "tingle", "th": "เสียว", "hint": "" },
                    { "en": "glue", "th": "กาว", "hint": "" },
                    { "en": "star", "th": "ดาว", "hint": "" },
                    { "en": "white", "th": "ขาว", "hint": "" },
                    { "en": "gorge", "th": "เหว", "hint": "" },
                    { "en": "bad", "th": "เลว", "hint": "" },
                    { "en": "pimple", "th": "สิว", "hint": "" },
                    { "en": "hungry", "th": "หิว", "hint": "" },
                    { "en": "row", "th": "แถว", "hint": "" },
                    { "en": "oar", "th": "แจว", "hint": "" },
                    { "en": "walk", "th": "เดิน", "hint": "" },
                    { "en": "exceed", "th": "เกิน", "hint": "" },
                    { "en": "hill", "th": "เนิน", "hint": "" },
                    { "en": "born", "th": "เกิด", "hint": "" },
                    { "en": "let", "th": "เถิด", "hint": "" },
                    { "en": "Proud", "th": "เชิด", "hint": "" },
                    { "en": "withdraw", "th": "เบิก", "hint": "" },
                    { "en": "stop", "th": "เลิก", "hint": "" },
                    { "en": "aspect", "th": "เชิง", "hint": "" },
                    { "en": "shed", "th": "เพิง", "hint": "" },
                    { "en": "fill", "th": "เติม", "hint": "" },
                    { "en": "old", "th": "เดิม", "hint": "" },
                    { "en": "anoint", "th": "เจิม", "hint": "" },
                    { "en": "news", "th": "ข่าว", "hint": "" },
                    { "en": "rice", "th": "ข้าว", "hint": "" },
                    { "en": "glass", "th": "แก้ว", "hint": "" },
                    { "en": "already", "th": "แล้ว", "hint": "" },
                    { "en": "finger", "th": "นิ้ว", "hint": "" },
                    { "en": "green", "th": "เขียว", "hint": "" },
                    { "en": "sickle", "th": "เคียว", "hint": "" },
                    { "en": "About", "th": "เกี่ยว", "hint": "" },
                    { "en": "body", "th": "กาย", "hint": "" },
                    { "en": "dead", "th": "ตาย", "hint": "" },
                    { "en": "sell", "th": "ขาย", "hint": "" },
                    { "en": "line", "th": "สาย", "hint": "" },
                    { "en": "brother-in-law", "th": "เขย", "hint": "" },
                    { "en": "indifferent", "th": "เฉย", "hint": "" },
                    { "en": "ever", "th": "เคย", "hint": "" },
                    { "en": "never", "th": "เลย", "hint": "" },
                    { "en": "clam", "th": "หอย", "hint": "" },
                    { "en": "wait", "th": "คอย", "hint": "" },
                    { "en": "beautiful", "th": "สวย", "hint": "" },
                    { "en": "rich", "th": "รวย", "hint": "" },
                    { "en": "talk", "th": "คุย", "hint": "" },
                    { "en": "charge", "th": "ลุย", "hint": "" },
                    { "en": "sprinkle", "th": "โรย", "hint": "" },
                    { "en": "oh", "th": "โอย", "hint": "" },
                    { "en": "glue", "th": "กาว", "hint": "" },
                    { "en": "star", "th": "ดาว", "hint": "" },
                    { "en": "raw", "th": "คาว", "hint": "" },
                    { "en": "people", "th": "ชาว", "hint": "" },
                    { "en": "girl", "th": "สาว", "hint": "" },
                    { "en": "white", "th": "ขาว", "hint": "" },
                    { "en": "step", "th": "ก้าว", "hint": "" },
                    { "en": "rice", "th": "ข้าว", "hint": "" },
                    { "en": "crack", "th": "ร้าว", "hint": "" },
                    { "en": "news", "th": "ข่าว", "hint": "" },
                    { "en": "bay", "th": "อ่าว", "hint": "" },
                    { "en": "boy", "th": "บ่าว", "hint": "" },
                    { "en": "row", "th": "แถว", "hint": "" },
                    { "en": "oar", "th": "แจว", "hint": "" },
                    { "en": "cat", "th": "แมว", "hint": "" },
                    { "en": "already", "th": "แล้ว", "hint": "" },
                    { "en": "glass", "th": "แก้ว", "hint": "" },
                    { "en": "taro", "th": "แห้ว", "hint": "" },
                    { "en": "quiet", "th": "เงียบ", "hint": "" },
                    { "en": "smooth", "th": "เรียบ", "hint": "" },
                    { "en": "compare", "th": "เทียบ", "hint": "" },
                    { "en": "insert", "th": "เสียบ", "hint": "" },
                    { "en": "compare", "th": "เปรียบ", "hint": "" },
                    { "en": "talk", "th": "คุย", "hint": "" },
                    { "en": "charge", "th": "ลุย", "hint": "" },
                    { "en": "fluff", "th": "ปุย", "hint": "" },
                    { "en": "withdraw", "th": "เบิก", "hint": "" },
                    { "en": "give up", "th": "เลิก", "hint": "" },
                    { "en": "wait", "th": "คอย", "hint": "" },
                    { "en": "float", "th": "ลอย", "hint": "" },
                    { "en": "slowly", "th": "ค่อย", "hint": "" },
                    { "en": "hundred", "th": "ร้อย", "hint": "" },
                    { "en": "few", "th": "น้อย", "hint": "" },
                    { "en": "all", "th": "ทั่ว", "hint": "" },
                    { "en": "evil", "th": "ชั่ว", "hint": "" },
                    { "en": "leak", "th": "รั่ว", "hint": "" },
                    { "en": "full", "th": "เตม", "hint": "" },
                    { "en": "chemistry", "th": "เคมี", "hint": "" },
                    { "en": "hard", "th": "แข็ง", "hint": "" },
                    { "en": "turn", "th": "หัน", "hint": "" },
                    { "en": "I", "th": "ฉัน", "hint": "" },
                    { "en": "stripe", "th": "ลาย", "hint": "" },
                    { "en": "many", "th": "หลาย", "hint": "" },
                    { "en": "disappear", "th": "หาย", "hint": "" },
                    { "en": "black", "th": "สีดํา", "hint": "" },
                    { "en": "white", "th": "สีขาว", "hint": "" },
                    { "en": "green", "th": "สีเขียว", "hint": "" },
                    { "en": "yellow", "th": "สีเหลือง", "hint": "" },
                    { "en": "red", "th": "สีแดง", "hint": "" },
                    { "en": "purple", "th": "สีม่วง", "hint": "" },
                    { "en": "blue", "th": "สีนํา้าเงิน", "hint": "" },
                    { "en": "pink", "th": "สีชมพู", "hint": "" },
                    { "en": "gray", "th": "สีเทา", "hint": "" },
                    { "en": "hello", "th": "สวัสดี", "hint": "" },
                    { "en": "week", "th": "อาทิตย์", "hint": "" },
                    { "en": "paper", "th": "กระดาษ", "hint": "" },
                    { "en": "blame", "th": "โทษ", "hint": "" },
                    { "en": "nation", "th": "ชาติ", "hint": "" },
                    { "en": "life", "th": "ชีวิต", "hint": "" },
                    { "en": "Thursday", "th": "พหัสบดี", "hint": "" },
                    { "en": "Nation", "th": "ชาติ", "hint": "" },
                    { "en": "Wednesday", "th": "พุธ", "hint": "" },
                    { "en": "Weapon", "th": "อาวุธ", "hint": "" },
                    { "en": "Angry", "th": "โกรธ", "hint": "" },
                    { "en": "Tuesday", "th": "อังคาร", "hint": "" },
                    { "en": "Work", "th": "การงาน", "hint": "" },
                    { "en": "Food", "th": "อาหาร", "hint": "" },
                    { "en": "Rice", "th": "ข้าวสาร", "hint": "" },
                    { "en": "Ball", "th": "ลูกบอล", "hint": "" },
                    { "en": "Sugar", "th": "นํา้าตาล", "hint": "" },
                    { "en": "Prize", "th": "รางวัล", "hint": "" },
                    { "en": "Bad people", "th": "คนพาล", "hint": "" },
                    { "en": "Weather", "th": "อากาศ", "hint": "" },
                    { "en": "Announcement", "th": "ประกาศ", "hint": "" },
                    { "en": "Paper", "th": "กระดาษ", "hint": "" },
                    { "en": "Sorry", "th": "ขอโทษ", "hint": "" },
                    { "en": "Always", "th": "เสมอ", "hint": "" },
                    { "en": "Notebook", "th": "สมุด", "hint": "" },
                    { "en": "Hello", "th": "สวัสดี", "hint": "" },
                    { "en": "Fun", "th": "สนุก", "hint": "" },
                    { "en": "Fun", "th": "สนาน", "hint": "" },
                    { "en": "stadium", "th": "สนาม", "hint": "" },
                    { "en": "Almost", "th": "เกือบ", "hint": "" },
                    { "en": "Fleeting", "th": "เหลือบ", "hint": "" },
                    { "en": "Coating", "th": "เคลือบ", "hint": "" },
                    { "en": "Walk", "th": "เดิน", "hint": "" },
                    { "en": "Money", "th": "เงิน", "hint": "" },
                    { "en": "Exceed", "th": "เกิน", "hint": "" },
                    { "en": "Ram", "th": "แรม", "hint": "" },
                    { "en": "Sharp", "th": "แหลม", "hint": "" },
                    { "en": "Pointed", "th": "แหลน", "hint": "" },
                    { "en": "January", "th": "มกราคม", "hint": "" },
                    { "en": "February", "th": "กุมภาพันธ์", "hint": "" },
                    { "en": "March", "th": "มีนาคม", "hint": "" },
                    { "en": "April", "th": "เมษายน", "hint": "" },
                    { "en": "May", "th": "พฤษภาคม", "hint": "" },
                    { "en": "June", "th": "มิถุนายน", "hint": "" },
                    { "en": "July", "th": "กรกฎาคม", "hint": "" },
                    { "en": "August", "th": "สิงหาคม", "hint": "" },
                    { "en": "September", "th": "กันยายน", "hint": "" },
                    { "en": "October", "th": "ตุลาคม", "hint": "" },
                    { "en": "November", "th": "พฤศจิกายน", "hint": "" },
                    { "en": "December", "th": "ธันวาคม", "hint": "" },
                    { "en": "great", "th": "มหา", "hint": "" },
                    { "en": "king", "th": "กษัตริย์", "hint": "" },
                    { "en": "try", "th": "พยายาม", "hint": "" },
                    { "en": "comfortable", "th": "สบาย", "hint": "" },
                    { "en": "religion", "th": "ศาสนา", "hint": "" },
                    { "en": "soap", "th": "สบู่", "hint": "" },
                    { "en": "thief", "th": "ขโมย", "hint": "" },
                    { "en": "type", "th": "ชนิด", "hint": "" }
                ],
                "structure": [
                    { "en": "Mani has eyes", "th": "มานี มี ตา", "hint": "" },
                    { "en": "The crow has eyes", "th": "กา มี ตา", "hint": "" },
                    { "en": "The uncle has eyes", "th": "อา มี ตา", "hint": "" },

                    { "en": "The good Grandfather has good rice paddy", "th": "ตา ดี นา ดี", "hint": "" },
                    { "en": "Mani has eyes", "th": "มานี มี ตา", "hint": "" },
                    { "en": "Grandfather has rice paddy", "th": "ตา มี นา", "hint": "" },
                    {
                        "en": "The crow comes to rice paddy", "th": "กา มา นา", "hint": ""
                    },
                    {
                        "en": "Grandfather comes to rice paddy", "th": "ตา มา นา", "hint": ""
                    },
                    {
                        "en": "Grandfather has good rice paddy", "th": "ตา มี นา ดี", "hint": ""
                    },
                    {
                        "en": "The uncle comes to rice paddy", "th": "อา มา นา", "hint": ""
                    },

                    { "en": "The uncle has rice paddy", "th": "อา มี นา", "hint": "" },
                    { "en": "The rice paddy has a snake", "th": "นา มี งู", "hint": "" },
                    { "en": "The rice paddy has a crab", "th": "นา มี ปู", "hint": "" },
                    { "en": "The crow sees the crab", "th": "กา ดู ปู", "hint": "" },
                    { "en": "The snake sees the crab", "th": "งู ดู ปู", "hint": "" },
                    { "en": "Mani comes to uncle rice paddy", "th": "มานี มา นา อา", "hint": "" },

                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" },
                    { "en": "", "th": "", "hint": "" }
                ]
            }
        ]
    },
    {
        "title": "Top 250 most frequently used words",
        "lessons": [
            {
                "name": "Top 250 most frequently used words",
                "vocabulary": [
                    { "en": "that/which/at/where", "th": "ที่", "hint": "thîi" },
                    { "en": "and", "th": "และ", "hint": "láe" },
                    { "en": "in/inside/within", "th": "ใน", "hint": "nai" },
                    { "en": "to be/is", "th": "เป็น", "hint": "pen" },
                    { "en": "have/there is", "th": "มี", "hint": "mii" },
                    { "en": "not/no", "th": "ไม่", "hint": "mâi" },
                    { "en": "person/people", "th": "คน", "hint": "khon" },
                    { "en": "I (female)", "th": "ฉัน", "hint": "chăn" },
                    { "en": "I (male)", "th": "ผม", "hint": "phŏm" },
                    { "en": "you (polite)", "th": "คุณ", "hint": "khun" },
                    { "en": "he/she/they", "th": "เขา", "hint": "khăo" },
                    { "en": "we/us", "th": "เรา", "hint": "rao" },
                    { "en": "go", "th": "ไป", "hint": "bpai" },
                    { "en": "come", "th": "มา", "hint": "maa" },
                    { "en": "do/make", "th": "ทำ", "hint": "tham" },
                    { "en": "that/to say", "th": "ว่า", "hint": "wâa" },
                    { "en": "see/look/watch", "th": "ดู", "hint": "duu" },
                    { "en": "speak/talk", "th": "พูด", "hint": "phûut" },
                    { "en": "can/get/receive", "th": "ได้", "hint": "dâi" },
                    { "en": "also/too/then", "th": "ก็", "hint": "gôr" },
                    { "en": "already/then", "th": "แล้ว", "hint": "láaeo" },
                    { "en": "this", "th": "นี้", "hint": "níi" },
                    { "en": "that", "th": "นั่น", "hint": "nân" },
                    { "en": "yes/right", "th": "ใช่", "hint": "châi" },
                    { "en": "or", "th": "หรือ", "hint": "rʉ̌ʉ" },
                    { "en": "but", "th": "แต่", "hint": "dtàe" },
                    { "en": "if", "th": "ถ้า", "hint": "thâa" },
                    { "en": "why", "th": "ทำไม", "hint": "tham‑mai" },
                    { "en": "when/once", "th": "เมื่อ", "hint": "meuua" },
                    { "en": "where (which place)", "th": "ที่ไหน", "hint": "thîi nai" },
                    { "en": "how", "th": "อย่างไร", "hint": "yàang‑rai" },
                    { "en": "much/very", "th": "มาก", "hint": "mâak" },
                    { "en": "few/little", "th": "น้อย", "hint": "nói" },
                    { "en": "big/large", "th": "ใหญ่", "hint": "yài" },
                    { "en": "small", "th": "เล็ก", "hint": "lék" },
                    { "en": "new", "th": "ใหม่", "hint": "mài" },
                    { "en": "good/well", "th": "ดี", "hint": "dii" },
                    { "en": "not good/bad", "th": "ไม่ดี", "hint": "mâi dii" },
                    { "en": "old (thing)", "th": "เก่า", "hint": "gào" },
                    { "en": "know (a fact)", "th": "รู้", "hint": "rúu" },
                    { "en": "love", "th": "รัก", "hint": "rák" },
                    { "en": "want/wish", "th": "อยาก", "hint": "yàak" },
                    { "en": "must/have to", "th": "ต้อง", "hint": "dtông" },
                    { "en": "because/since", "th": "เพราะ", "hint": "phrɔ́ɔ" },
                    { "en": "give/let/allow", "th": "ให้", "hint": "hâi" },
                    { "en": "be at/stay/located", "th": "อยู่", "hint": "yùu" },
                    { "en": "find/look for", "th": "หา", "hint": "hăa" },
                    { "en": "write", "th": "เขียน", "hint": "khian" },
                    { "en": "read", "th": "อ่าน", "hint": "æan" },
                    { "en": "listen", "th": "ฟัง", "hint": "fang" },
                    { "en": "sleep/lie down", "th": "นอน", "hint": "non" },
                    { "en": "eat", "th": "กิน", "hint": "gin" },
                    { "en": "drink", "th": "ดื่ม", "hint": "dʉ̀ʉm" },
                    { "en": "tomorrow", "th": "พรุ่งนี้", "hint": "phrûng‑níi" },
                    { "en": "today", "th": "วันนี้", "hint": "wan‑níi" },
                    { "en": "yesterday", "th": "เมื่อวาน", "hint": "meuua‑waan" },
                    { "en": "time", "th": "เวลา", "hint": "we‑laa" },
                    { "en": "day", "th": "วัน", "hint": "wan" },
                    { "en": "year", "th": "ปี", "hint": "bpii" },
                    { "en": "month", "th": "เดือน", "hint": "duean" },
                    { "en": "hour", "th": "ชั่วโมง", "hint": "chûa‑mohng" },
                    { "en": "water", "th": "น้ำ", "hint": "náam" },
                    { "en": "house/home", "th": "บ้าน", "hint": "bâan" },
                    { "en": "car/vehicle", "th": "รถ", "hint": "rót" },
                    { "en": "school", "th": "โรงเรียน", "hint": "roong‑rian" },
                    { "en": "place/location", "th": "สถานที่", "hint": "sà‑thăan‑thîi" },
                    { "en": "thing/matter/story", "th": "เรื่อง", "hint": "rʉ̂ʉang" },
                    { "en": "before", "th": "ก่อน", "hint": "gòn" },
                    { "en": "after/behind", "th": "หลัง", "hint": "lǎng" },
                    { "en": "classifier/self/body/unit", "th": "ตัว", "hint": "dtua" },
                    { "en": "that", "th": "นั้น", "hint": "nân" },
                    { "en": "with", "th": "กับ", "hint": "gàp" },
                    { "en": "until/so that", "th": "จน", "hint": "jon" },
                    { "en": "help", "th": "ช่วย", "hint": "chûuai" },
                    { "en": "thing/object/matter", "th": "สิ่ง", "hint": "sìng" },
                    { "en": "child", "th": "เด็ก", "hint": "dèk" },
                    { "en": "just/only", "th": "แค่", "hint": "kâae" },
                    { "en": "different/various", "th": "ต่าง", "hint": "dtàang" },
                    { "en": "and then/also", "th": "แล้วก็", "hint": "láaeo gôr" },
                    { "en": "straight/exact", "th": "ตรง", "hint": "dtrong" },
                    { "en": "name", "th": "ชื่อ", "hint": "chʉ̂ʉ" },
                    { "en": "market", "th": "ตลาด", "hint": "dtà-làat" },
                    { "en": "money", "th": "เงิน", "hint": "ngern" },
                    { "en": "work/job", "th": "งาน", "hint": "ngaan" },
                    { "en": "hospital", "th": "โรงพยาบาล", "hint": "roong‑pha‑yaa‑baan" },
                    { "en": "shop/restaurant", "th": "ร้าน", "hint": "ráan" },
                    { "en": "food", "th": "อาหาร", "hint": "aa‑hăan" },
                    { "en": "family", "th": "ครอบครัว", "hint": "khrop‑khrua" },
                    { "en": "hotel", "th": "โรงแรม", "hint": "roong‑ræem" },
                    { "en": "field/stadium", "th": "สนาม", "hint": "sà‑naam" },
                    { "en": "country", "th": "ประเทศ", "hint": "bprà‑têet" },
                    { "en": "language", "th": "ภาษา", "hint": "paa‑săa" },
                    { "en": "student", "th": "นักเรียน", "hint": "nák‑rian" },
                    { "en": "teacher", "th": "ครู", "hint": "khruu" },
                    { "en": "friend", "th": "เพื่อน", "hint": "phêuuan" },
                    { "en": "at the time/period", "th": "ตอน", "hint": "dton" },
                    { "en": "think", "th": "คิด", "hint": "khít" },
                    { "en": "see/feel/think", "th": "เห็น", "hint": "hĕn" },
                    { "en": "call", "th": "เรียก", "hint": "rîak" },
                    { "en": "study/learn", "th": "เรียน", "hint": "rian" },
                    { "en": "return/come back", "th": "กลับ", "hint": "glàp" },
                    { "en": "enter", "th": "เข้า", "hint": "khâo" },
                    { "en": "exit/go out", "th": "ออก", "hint": "òk" },
                    { "en": "tell", "th": "บอก", "hint": "bòk" },
                    { "en": "understand", "th": "เข้าใจ", "hint": "khâo‑jai" },
                    { "en": "begin/start", "th": "เริ่ม", "hint": "rœ̂m" },
                    { "en": "finish/end", "th": "จบ", "hint": "jòp" },
                    { "en": "walk", "th": "เดิน", "hint": "dern" },
                    { "en": "run", "th": "วิ่ง", "hint": "wîng" },
                    { "en": "drive", "th": "ขับ", "hint": "khàp" },
                    { "en": "buy", "th": "ซื้อ", "hint": "sʉ́ʉ" },
                    { "en": "sell", "th": "ขาย", "hint": "khǎai" },
                    { "en": "price", "th": "ราคา", "hint": "raa‑khaa" },
                    { "en": "cheap/correct", "th": "ถูก", "hint": "thùuk" },
                    { "en": "expensive", "th": "แพง", "hint": "phaeng" },
                    { "en": "bag", "th": "กระเป๋า", "hint": "grà‑bpăo" },
                    { "en": "hand", "th": "มือ", "hint": "mʉʉ" },
                    { "en": "leg", "th": "ขา", "hint": "kăa" },
                    { "en": "head", "th": "หัว", "hint": "hŭa" },
                    { "en": "heart/mind", "th": "ใจ", "hint": "jai" },
                    { "en": "beautiful", "th": "สวย", "hint": "sŭuai" },
                    { "en": "handsome", "th": "หล่อ", "hint": "lòr" },
                    { "en": "easy", "th": "ง่าย", "hint": "ngaai" },
                    { "en": "difficult", "th": "ยาก", "hint": "yâak" },
                    { "en": "long", "th": "ยาว", "hint": "yaao" },
                    { "en": "short", "th": "สั้น", "hint": "sân" },
                    { "en": "single/only", "th": "เดียว", "hint": "diao" },
                    { "en": "again/another", "th": "อีก", "hint": "ìik" },
                    { "en": "both/all", "th": "ทั้ง", "hint": "táng" },
                    { "en": "all/everything", "th": "ทั้งหมด", "hint": "táng‑mòt" },
                    { "en": "some/few", "th": "บาง", "hint": "baang" },
                    { "en": "everyone", "th": "ทุกคน", "hint": "thúk‑khon" },
                    { "en": "everything", "th": "ทุกอย่าง", "hint": "thúk‑yàang" },
                    { "en": "everywhere", "th": "ทุกที่", "hint": "thúk‑thîi" },
                    { "en": "previous/before", "th": "ก่อนหน้า", "hint": "gòn‑nâa" },
                    { "en": "after/afterwards", "th": "หลังจาก", "hint": "lǎng‑jàak" },
                    { "en": "include/combine", "th": "รวม", "hint": "ruam" },
                    { "en": "show/display", "th": "แสดง", "hint": "sà‑dɛɛng" },
                    { "en": "picture/image", "th": "ภาพ", "hint": "phâap" },
                    { "en": "song", "th": "เพลง", "hint": "phleeng" },
                    { "en": "movie/book/skin", "th": "หนัง", "hint": "nǎng" },
                    { "en": "cinema", "th": "โรงหนัง", "hint": "roong‑nǎng" },
                    { "en": "drama/play", "th": "ละคร", "hint": "lá‑khorn" },
                    { "en": "news", "th": "ข่าว", "hint": "khàao" },
                    { "en": "telephone/phone", "th": "โทรศัพท์", "hint": "thoo‑rá‑sàp" },
                    { "en": "internet", "th": "อินเทอร์เน็ต", "hint": "in‑thə̂ə‑nét" },
                    { "en": "computer", "th": "คอมพิวเตอร์", "hint": "khawm‑phîw‑têr" },
                    { "en": "website", "th": "เว็บไซต์", "hint": "wéb‑sàyt" },
                    { "en": "email", "th": "อีเมล", "hint": "ee‑mɛɛl" },
                    { "en": "photo/form/shape", "th": "รูป", "hint": "rûup" },
                    { "en": "Monday", "th": "วันจันทร์", "hint": "wan‑jan" },
                    { "en": "Tuesday", "th": "วันอังคาร", "hint": "wan‑ang‑khaan" },
                    { "en": "Wednesday", "th": "วันพุธ", "hint": "wan‑phút" },
                    { "en": "Thursday", "th": "วันพฤหัส", "hint": "wan‑phá‑rue‑hat" },
                    { "en": "Friday", "th": "วันศุกร์", "hint": "wan‑sùk" },
                    { "en": "Saturday", "th": "วันเสาร์", "hint": "wan‑săao" },
                    { "en": "Sunday", "th": "วันอาทิตย์", "hint": "wan‑aa‑thít" },
                    { "en": "one", "th": "หนึ่ง", "hint": "nùeng" },
                    { "en": "two", "th": "สอง", "hint": "sŏng" },
                    { "en": "three", "th": "สาม", "hint": "săam" },
                    { "en": "four", "th": "สี่", "hint": "sìi" },
                    { "en": "five", "th": "ห้า", "hint": "hâa" },
                    { "en": "six", "th": "หก", "hint": "hòk" },
                    { "en": "seven", "th": "เจ็ด", "hint": "jèt" },
                    { "en": "eight", "th": "แปด", "hint": "bpàet" },
                    { "en": "nine", "th": "เก้า", "hint": "gâao" },
                    { "en": "ten", "th": "สิบ", "hint": "sìp" },
                    { "en": "hundred", "th": "ร้อย", "hint": "rɔ́ɔi" },
                    { "en": "thousand", "th": "พัน", "hint": "phan" },
                    { "en": "ten thousand", "th": "หมื่น", "hint": "mʉ̀en" },
                    { "en": "hundred thousand", "th": "แสน", "hint": "săen" },
                    { "en": "million", "th": "ล้าน", "hint": "lǎan" },
                    { "en": "sorry/excuse me", "th": "ขอโทษ", "hint": "khǎaw‑thôt" },
                    { "en": "thank you", "th": "ขอบคุณ", "hint": "khàawp‑khun" },
                    { "en": "welcome/pleased", "th": "ยินดี", "hint": "yin‑dii" },
                    { "en": "polite particle (male)", "th": "ครับ", "hint": "khráp" },
                    { "en": "polite particle (female)", "th": "ค่ะ", "hint": "khâ" },
                    { "en": "particle (softener)", "th": "นะ", "hint": "ná" },
                    { "en": "particle, casual", "th": "จ้ะ", "hint": "já" },
                    { "en": "at all/absolutely", "th": "เลย", "hint": "loei" },
                    { "en": "really/truly", "th": "จริง", "hint": "jing" },
                    { "en": "sure/certainly", "th": "แน่นอน", "hint": "nâe‑nawn" },
                    { "en": "many/abundant", "th": "มากมาย", "hint": "mâak‑maai" },
                    { "en": "different from each other", "th": "ต่างกัน", "hint": "dtàang‑gan" },
                    { "en": "same/similar", "th": "เหมือน", "hint": "mʉ̌uan" },
                    { "en": "including", "th": "รวมทั้ง", "hint": "ruam‑táng" },
                    { "en": "appoint/arrange a meeting", "th": "นัด", "hint": "nát" },
                    { "en": "opportunity", "th": "โอกาส", "hint": "oo‑gaat" },
                    { "en": "problem", "th": "ปัญหา", "hint": "bpan‑haa" },
                    { "en": "method/way", "th": "วิธี", "hint": "wí‑thii" },
                    { "en": "result/effect", "th": "ผล", "hint": "phǒn" },
                    { "en": "information/data", "th": "ข้อมูล", "hint": "khâaw‑mûn" },
                    { "en": "system", "th": "ระบบ", "hint": "rá‑bòp" },
                    { "en": "service", "th": "บริการ", "hint": "baw‑rì‑gaan" },
                    { "en": "law", "th": "กฎหมาย", "hint": "kòt‑măai" },
                    { "en": "government", "th": "รัฐบาล", "hint": "rát‑thà‑baan" },
                    { "en": "city/town", "th": "เมือง", "hint": "mʉang" },
                    { "en": "province", "th": "จังหวัด", "hint": "jàang‑wàt" },
                    { "en": "center", "th": "ศูนย์", "hint": "sǔun" },
                    { "en": "airport", "th": "สนามบิน", "hint": "sà‑naam‑bin" },
                    { "en": "ticket", "th": "ตั๋ว", "hint": "dtŭa" },
                    { "en": "travel/trip", "th": "เที่ยว", "hint": "thîeow" },
                    { "en": "fly", "th": "บิน", "hint": "bin" },
                    { "en": "travel/journey", "th": "เดินทาง", "hint": "dern‑thaang" },
                    { "en": "document", "th": "เอกสาร", "hint": "èek‑kà‑sǎan" },
                    { "en": "passport", "th": "หนังสือเดินทาง", "hint": "nǎng‑sʉ̌ʉ‑dern‑thaang" },
                    { "en": "visa", "th": "วีซ่า", "hint": "wee‑sâa" },
                    { "en": "interview", "th": "สัมภาษณ์", "hint": "sàm‑phâat" },
                    { "en": "apply/enroll", "th": "สมัคร", "hint": "sà‑màk" },
                    { "en": "apply for job", "th": "สมัครงาน", "hint": "sà‑màk‑ngaan" },
                    { "en": "experience", "th": "ประสบการณ์", "hint": "bprà‑sòp‑gaan" },
                    { "en": "skill", "th": "ทักษะ", "hint": "thák‑sà" },
                    { "en": "qualifications", "th": "วุฒิการศึกษา", "hint": "wút‑thì‑gaan‑sùk‑săa" }
                ],
                "structure": [
                    { "en": "Subject + Verb + Object", "th": "ประธาน + กริยา + กรรม", "hint": "bprà‑thâan + grì‑yaa + grâm" }
                ]
            }
        ]
    },
    {
        "title": "Basic 2",
        "lessons": [
            {
                "name": "Lesson 1",
                "vocabulary": [
                    { "en": "I", "th": "ฉัน", "hint": "" },
                    { "en": "you", "th": "คุณ", "hint": "" }
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
    summary.textContent = "Select lessons";
    bookListContainer.appendChild(summary);

    books.forEach((book) => {
        const bookItemDetails = document.createElement('details');
        bookItemDetails.classList.add('bookItem');
        const summary = document.createElement('summary');
        summary.textContent = book.title;
        bookItemDetails.appendChild(summary);

        book.lessons.forEach((lesson) => {

            const lessonButton = document.createElement('button');
            lessonButton.classList.add('lessonButton');
            lessonButton.textContent = lesson.name;
            lessonButton.addEventListener('click', () => {
                currentLesson = lesson;
                displayMultipleChoice(0, currentLesson.vocabulary, currentLanguage);
                displaySentenceStructure(lesson.structure);

                bookListContainer.removeAttribute('open');
            });

            bookItemDetails.appendChild(lessonButton);
        });

        bookListContainer.appendChild(bookItemDetails);
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
        if (currentLanguage === 'en-EN' && vocabulary[choiceIndex].hint !== "") {
            button.textContent = vocabulary[choiceIndex].th + ` (${vocabulary[choiceIndex].hint})`;
        } else if (currentLanguage === 'en-EN') {
            button.textContent = vocabulary[choiceIndex].th;
        }
        if (currentLanguage === 'th-TH' && vocabulary[choiceIndex].hint !== "") {
            button.textContent = vocabulary[choiceIndex].en + ` (${vocabulary[choiceIndex].hint})`;
        } else if (currentLanguage === 'th-TH') {
            button.textContent = vocabulary[choiceIndex].en;
        }

        button.addEventListener('click', () => {
            if (choiceIndex === wordIndex) {
                numberOfCorrectMultipleChoiceAnswer++;
                button.classList = 'correctAnswerContainer';
                //                incorrectMultipleChoiceAnswerVocabulary.filter((item) => item === vocabulary[choiceIndex]);
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
    summary.textContent = "Reading practice";
    sentenceStructureDetails.appendChild(summary);

    sentenceStructure.forEach((structure) => {
        const sentenceStructureItem = document.createElement('div');
        sentenceStructureItem.classList = 'sentenceStructureItem';

        const sentenceStructureEN = document.createElement('button');
        sentenceStructureEN.textContent = structure.en;
        sentenceStructureEN.style.cursor = 'pointer';
        sentenceStructureEN.style.textAlign = 'left';
        sentenceStructureItem.appendChild(sentenceStructureEN);

        sentenceStructureEN.addEventListener('click', () => {
            textToSpeech(structure.en, 'en-US');
            textToSpeech(structure.th, 'th-TH');
        });

        const sentenceStructureTH = document.createElement('button');
        //        sentenceStructureTH.textContent = structure.th;
        sentenceStructureTH.style.cursor = 'pointer';
        sentenceStructureTH.style.textAlign = 'left';
        //    sentenceStructureItem.appendChild(sentenceStructureTH);

        let obj = JSON.parse(`{"text": "${structure.th}"}`);
        // Split into words
        let words = obj.text.split(" ");

        /* display the Thai text without spaces between words */
        // Create HTML element dynamically
        let outputSpan = document.createElement("span");
        outputSpan.id = "output";
        // Display string without spaces initially
        outputSpan.textContent = words.join("");
        sentenceStructureTH.appendChild(outputSpan);
        sentenceStructureItem.appendChild(sentenceStructureTH);

        sentenceStructureTH.addEventListener('click', () => {

            for (let i = 0; i < words.length; i++) {
                let word = words[i];
                setTimeout(() => {
                    textToSpeech(word, 'th-TH');
                    let wordSpan = document.createElement("span");
                    wordSpan.textContent = word;
                    outputSpan.innerHTML = ''; // Clear previous content
                    for (let j = 0; j < words.length; j++) {
                        let span = document.createElement("span");
                        span.textContent = words[j];
                        if (j === i) {
                            span.classList.add('highlight');
                        }
                        outputSpan.appendChild(span);
                    }
                }, i * 1500); // Adjust the delay as needed
                if (i === words.length - 1) {
                    setTimeout(() => {
                        outputSpan.innerHTML = words.join(""); // Restore original text after the last word highlight
                    }, (i + 1) * 1500);
                }
            }

        });

        sentenceStructureDetails.appendChild(sentenceStructureItem);
        sentenceStructureContainer.appendChild(sentenceStructureDetails);

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
    /*
    speech.onend = function (event) {
        //        console.log('SpeechSynthesisUtterance.onend');
    }
        */
}


function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/*
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
*/
