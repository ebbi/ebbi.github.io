// app/data/settingsData.js
/**
 * FAQ data for the Settings page.
 *
 * Structure:
 *   {
 *     <langCode>: {
 *       question: string,   // goes inside <summary>
 *       intro:    string,   // paragraph before the list
 *       steps:    [string], // each step – <ol> will add the numbers
 *       outro:    string    // paragraph after the list
 *     },
 *     …
 *   }
 *
 * Add a new entry for every language you support (th, fa, es, ar, hi, ja, zh).
 */
export const SETTINGS_FAQ = {
    // -----------------------------------------------------------------
    // English (default)
    // -----------------------------------------------------------------
    en: {
        question:
            'Q. How to configure Text-to-Speech on an Android mobile phone?',
        intro:
            'To configure Text-to-Speech (TTS) on an Android mobile phone, follow these steps:',
        steps: [
            'Open Settings: Start by opening the Settings app on your Android device.',
            'Accessibility: Scroll down and tap on "Accessibility." (On some devices, you may find Text-to-Speech under “Language & input” or “System.”) (alternatively, use 🔍 and search for Text-to-Speech)',
            'Text-to-Speech Output: Look for the option labeled "Text-to-Speech output" and tap on it.',
            'Select TTS Engine: You will see options for different TTS engines. The default is usually Google Text-to-Speech. You can select it or any other installed TTS engine.',
            'Language Settings: Tap on “Language” to choose the language you want to use for TTS. You may need to download additional languages if they are not already installed.',
            'Voice Selection: Under the "Voice" option, you can choose from various available voices, which may include different accents and genders.',
            'Adjust Speech Rate and Pitch: You can modify the speech rate (how fast the text is spoken) and pitch (how high or low the voice sounds) according to your preferences.',
            'Test the Voice: There is usually an option to listen to a sample of the voice to ensure it meets your needs. Tap on "Listen to an example" to hear how the selected voice sounds.',
            'Download Language Packs: If you want to add more languages, you can often download them through the settings by tapping on "Install voice data."'
        ],
        outro:
            'After completing these steps, your device should be ready to utilize Text-to-Speech in the selected languages and voices.'
    },

    // -----------------------------------------------------------------
    // Thai
    // -----------------------------------------------------------------
    th: {
        question: 'ถาม: วิธีตั้งค่า Text-to-Speech บนโทรศัพท์ Android คืออะไร?',
        intro:
            'เพื่อกำหนดค่า Text-to-Speech (TTS) บนโทรศัพท์ Android ให้ทำตามขั้นตอนต่อไปนี้:',
        steps: [
            'เปิด Settings: เริ่มต้นโดยเปิดแอป Settings บนอุปกรณ์ Android ของคุณ',
            'Accessibility: เลื่อนลงและแตะ “Accessibility” (บนบางอุปกรณ์อาจพบ Text-to-Speech ภายใต้ “Language & input” หรือ “System”) (หรือใช้ 🔍 ค้นหา Text-to-Speech)',
            'Text-to-Speech Output: ค้นหาตัวเลือกที่ชื่อ “Text-to-Speech output” แล้วแตะ',
            'Select TTS Engine: คุณจะเห็นตัวเลือกสำหรับเครื่องยนต์ TTS ต่าง ๆ ค่าเริ่มต้นมักเป็น Google Text-to-Speech สามารถเลือกได้หรือเลือกเครื่องอื่นที่ติดตั้งไว้',
            'Language Settings: แตะ “Language” เพื่อเลือกภาษาที่ต้องการใช้กับ TTS หากไม่มีภาษาที่ต้องการอาจต้องดาวน์โหลดเพิ่มเติม',
            'Voice Selection: ภายใต้ตัวเลือก “Voice” คุณสามารถเลือกเสียงต่าง ๆ ที่มี รวมถึงสำเนียงและเพศที่แตกต่างกัน',
            'Adjust Speech Rate and Pitch: ปรับอัตราการพูด (เร็วหรือช้า) และความสูงของเสียง (สูงหรือต่ำ) ตามความต้องการ',
            'Test the Voice: มีตัวเลือกให้ฟังตัวอย่างเสียงเพื่อยืนยันว่าเหมาะกับคุณ แตะ “Listen to an example” เพื่อฟัง',
            'Download Language Packs: หากต้องการเพิ่มภาษาอื่น ๆ สามารถดาวน์โหลดได้โดยแตะ “Install voice data”'
        ],
        outro:
            'หลังจากทำตามขั้นตอนเหล่านี้แล้ว อุปกรณ์ของคุณพร้อมใช้งาน Text-to-Speech ด้วยภาษและเสียงที่เลือกแล้ว'
    },

    // -----------------------------------------------------------------
    // Persian (Farsi)
    // -----------------------------------------------------------------
    fa: {
        question: 'س: چگونه می‌توان Text-to-Speech را در گوشی اندروید پیکربندی کرد؟',
        intro:
            'برای پیکربندی Text-to-Speech (TTS) در یک گوشی اندروید، مراحل زیر را دنبال کنید:',
        steps: [
            'باز کردن Settings: ابتدا برنامه Settings را در دستگاه اندروید خود باز کنید.',
            'Accessibility: پایین بروید و روی «Accessibility» ضربه بزنید. (در برخی دستگاه‌ها ممکن است Text-to-Speech تحت «Language & input» یا «System» باشد) (به‌جای آن می‌توانید با 🔍 جستجو کنید).',
            'خروجی Text-to-Speech: گزینه‌ای با نام «Text-to-Speech output» را پیدا کنید و روی آن ضربه بزنید.',
            'انتخاب موتور TTS: گزینه‌های مختلف برای موتورهای TTS نمایش داده می‌شود. پیش‌فرض معمولاً Google Text-to-Speech است؛ می‌توانید آن یا هر موتور دیگری که نصب کرده‌اید را انتخاب کنید.',
            'تنظیمات زبان: روی «Language» ضربه بزنید تا زبانی که می‌خواهید برای TTS استفاده شود را انتخاب کنید. ممکن است نیاز به دانلود زبان‌های اضافی داشته باشید.',
            'انتخاب صدا: در بخش «Voice» می‌توانید از میان صداهای موجود (شامل لهجه‌ها و جنسیت‌های مختلف) یکی را برگزینید.',
            'تنظیم سرعت و گام صدا: می‌توانید سرعت گفتار (چند سریع یا کند) و گام صدا (بالا یا پایین) را مطابق سلیقه خود تنظیم کنید.',
            'آزمون صدا: معمولاً گزینه‌ای برای گوش دادن به نمونه‌ای از صدا وجود دارد. روی «Listen to an example» ضربه بزنید تا صدای انتخابی را بشنوید.',
            'دانلود بسته‌های زبانی: اگر می‌خواهید زبان‌های بیشتری اضافه کنید، می‌توانید با فشار دادن «Install voice data» آنها را دانلود کنید.'
        ],
        outro:
            'پس از تکمیل این مراحل، دستگاه شما آماده استفاده از Text-to-Speech با زبان‌ها و صداهای انتخابی خواهد بود.'
    },

    // -----------------------------------------------------------------
    // Spanish
    // -----------------------------------------------------------------
    es: {
        question: 'P: ¿Cómo configurar Text-to-Speech en un teléfono Android?',
        intro:
            'Para configurar Text-to-Speech (TTS) en un teléfono Android, siga estos pasos:',
        steps: [
            'Abrir Configuración: Comience abriendo la aplicación Configuración en su dispositivo Android.',
            'Accesibilidad: Desplácese hacia abajo y toque “Accesibilidad”. (En algunos dispositivos, puede encontrar Text-to-Speech bajo “Language & input” o “System”. También puede usar 🔍 para buscar Text-to-Speech.)',
            'Salida de Text-to-Speech: Busque la opción etiquetada “Text-to-Speech output” y tóquela.',
            'Seleccionar motor TTS: Verá opciones para diferentes motores TTS. El predeterminado suele ser Google Text-to-Speech. Puede seleccionarlo o cualquier otro motor instalado.',
            'Configuración de idioma: Toque “Language” para elegir el idioma que desea usar para TTS. Es posible que necesite descargar idiomas adicionales si no están instalados.',
            'Selección de voz: En la opción “Voice”, puede escoger entre varias voces disponibles, incluidas diferentes acentuaciones y géneros.',
            'Ajustar velocidad y tono: Puede modificar la velocidad de habla (qué tan rápido se pronuncia) y el tono (qué tan agudo o grave suena) según sus preferencias.',
            'Probar la voz: Normalmente hay una opción para escuchar una muestra de la voz y asegurarse de que le convenga. Toque “Listen to an example”.',
            'Descargar paquetes de idioma: Si desea agregar más idiomas, normalmente puede descargarlos desde la configuración tocando “Install voice data”.'
        ],
        outro:
            'Después de completar estos pasos, su dispositivo estará listo para utilizar Text-to-Speech con los idiomas y voces seleccionados.'
    },

    // -----------------------------------------------------------------
    // Arabic
    // -----------------------------------------------------------------
    ar: {
        question: 'س: كيف يمكن إعداد Text-to-Speech على هاتف Android؟',
        intro:
            'لتكوين Text-to-Speech (TTS) على هاتف Android، اتبع الخطوات التالية:',
        steps: [
            'فتح Settings: ابدأ بفتح تطبيق Settings على جهاز Android الخاص بك.',
            'Accessibility: مرر للأسفل واضغط على “Accessibility”. (في بعض الأجهزة قد تجد Text-to-Speech ضمن “Language & input” أو “System”. بدلاً من ذلك استخدم 🔍 للبحث عن Text-to-Speech.)',
            'إخراج Text-to-Speech: ابحث عن الخيار المسمى “Text-to-Speech output” واضغط عليه.',
            'اختيار محرك TTS: ستظهر لك خيارات لمحركات TTS المختلفة. الافتراضي عادةً هو Google Text-to-Speech. يمكنك اختياره أو أي محرك آخر مثبت.',
            'إعدادات اللغة: اضغط على “Language” لاختيار اللغة التي تريد استخدامها مع TTS. قد تحتاج إلى تنزيل لغات إضافية إذا لم تكن مثبتة مسبقًا.',
            'اختيار الصوت: ضمن خيار “Voice”، يمكنك اختيار أحد الأصوات المتاحة، والتي قد تشمل لهجات وجنسيات مختلفة.',
            'ضبط معدل الكلام والنبرة: يمكنك تعديل سرعة الكلام (كم بسرعة يُنطق النص) والنبرة (ارتفاع أو انخفاض الصوت) وفقًا لتفضيلاتك.',
            'اختبار الصوت: عادةً ما يكون هناك خيار للاستماع إلى عينة من الصوت للتأكد من ملاءمتها. اضغط على “Listen to an example”.',
            'تنزيل حزم اللغة: إذا رغبت في إضافة المزيد من اللغات، يمكنك غالبًا تنزيلها عبر الإعدادات بالضغط على “Install voice data”.'
        ],
        outro:
            'بعد إكمال هذه الخطوات، سيكون جهازك جاهزًا لاستخدام Text-to-Speech باللغات والأصوات التي اخترتها.'
    },

    // -----------------------------------------------------------------
    // Hindi
    // -----------------------------------------------------------------
    hi: {
        question:
            'प्रश्न: Android मोबाइल फ़ोन पर Text-to-Speech कैसे कॉन्फ़िगर करें?',
        intro:
            'Android मोबाइल फ़ोन पर Text-to-Speech (TTS) कॉन्फ़िगर करने के लिए नीचे दिए गए चरणों का पालन करें:',
        steps: [
            'Settings खोलें: सबसे पहले अपने Android डिवाइस पर Settings ऐप खोलें।',
            'Accessibility: नीचे स्क्रॉल करें और “Accessibility” पर टैप करें। (कुछ डिवाइसों में Text-to-Speech “Language & input” या “System” के तहत हो सकता है) (वैकल्पिक रूप से 🔍 से Text-to-Speech खोजें)।',
            'Text-to-Speech Output: “Text-to-Speech output” लेबल वाला विकल्प खोजें और उस पर टैप करें।',
            'TTS Engine चुनें: विभिन्न TTS इंजन विकल्प दिखेंगे। डिफ़ॉल्ट आमतौर पर Google Text-to-Speech होता है। आप इसे या कोई अन्य इंस्टॉल्ड TTS इंजन चुन सकते हैं।',
            'भाषा सेटिंग्स: “Language” पर टैप करके वह भाषा चुनें जिसे आप TTS के लिए उपयोग करना चाहते हैं। यदि वह भाषा पहले से नहीं है तो अतिरिक्त भाषाएँ डाउनलोड करनी पड़ सकती हैं।',
            'Voice चयन: “Voice” विकल्प के अंतर्गत उपलब्ध विभिन्न आवाज़ों में से चुनें, जिसमें अलग-अलग एक्सेंट और जेंडर शामिल हो सकते हैं।',
            'स्पीच रेट और पिच समायोजित करें: आप स्पीच रेट (टेक्स्ट कितनी तेज़ी से बोला जाता है) और पिच (आवाज़ की ऊँचाई) को अपनी पसंद के अनुसार बदल सकते हैं।',
            'वॉइस टेस्ट करें: अक्सर एक विकल्प होता है जिससे आप आवाज़ का सैंपल सुन सकते हैं। “Listen to an example” पर टैप करके आवाज़ सुनें।',
            'भाषा पैक्स डाउनलोड करें: यदि आप अधिक भाषाएँ जोड़ना चाहते हैं, तो “Install voice data” पर टैप करके उन्हें डाउनलोड कर सकते हैं।'
        ],
        outro:
            'इन चरणों को पूरा करने के बाद आपका डिवाइस चयनित भाषाओं और आवाज़ों के साथ Text-to-Speech उपयोग करने के लिए तैयार हो जाएगा.'
    },

    // -----------------------------------------------------------------
    // Japanese
    // -----------------------------------------------------------------
    ja: {
        question:
            '質問: Android スマートフォンで Text-to-Speech を設定する方法は？',
        intro:
            'Android スマートフォンで Text-to-Speech (TTS) を設定するには、以下の手順に従ってください:',
        steps: [
            '設定を開く: まず Android デバイスで「設定」アプリを開きます。',
            'アクセシビリティ: 下にスクロールし、「アクセシビリティ」をタップします。（一部のデバイスでは「Language & input」や「System」の下に Text-to-Speech がある場合があります。）(代わりに 🔍 で Text-to-Speech を検索してください。)',
            'Text-to-Speech 出力: 「Text-to-Speech output」というラベルの項目を探し、タップします。',
            'TTS エンジンを選択: 利用できる TTS エンジンが一覧表示されます。デフォルトは通常 Google Text-to-Speech です。これを選ぶか、インストール済みの別のエンジンを選択できます。',
            '言語設定: 「Language」をタップして、TTS に使用したい言語を選びます。未インストールの場合は追加でダウンロードが必要になることがあります。',
            '音声の選択: 「Voice」項目で、さまざまな音声（アクセントや性別が異なるもの）から選択できます。',
            '速度とピッチの調整: 話す速度（テキストがどれだけ速く読まれるか）とピッチ（声の高さ）を好みに合わせて変更できます。',
            '音声のテスト: 通常「Listen to an example」というオプションがあり、選択した音声を試聴できます。',
            '言語パックのダウンロード: さらに言語を追加したい場合は、「Install voice data」をタップしてダウンロードできます。'
        ],
        outro:
            'これらの手順を完了すると、選択した言語と音声で Text-to-Speech を利用できるようになります。'
    },
    // -----------------------------------------------------------------
    // Chinese (Simplified)
    // -----------------------------------------------------------------
    zh: {
        question:
            '问：如何在 Android 手机上配置文本转语音（Text-to-Speech）？',
        intro:
            '要在 Android 手机上配置文本转语音（TTS），请按照以下步骤操作：',
        steps: [
            '打开 Settings：首先打开 Android 设备上的“设置”应用。',
            '辅助功能：向下滚动并点击“辅助功能”。（在某些设备上，Text-to-Speech 可能位于“语言和输入”或“系统”下。）（或者使用 🔍 搜索 Text-to-Speech）',
            '文本转语音输出：查找标有“Text-to-Speech output”的选项并点击。',
            '选择 TTS 引擎：会显示不同的 TTS 引擎选项。默认通常是 Google Text-to-Speech。您可以选择它或任何已安装的其他 TTS 引擎。',
            '语言设置：点击“Language”，选择您想用于 TTS 的语言。如果没有预装，可能需要下载额外的语言包。',
            '语音选择：在“Voice”选项下，您可以从多种可用语音中进行选择，包括不同的口音和性别。',
            '调整语速和音调：您可以根据个人偏好修改语速（文本朗读的快慢）和音调（声音的高低）。',
            '测试语音：通常会有一个“Listen to an example”选项，让您试听所选语音是否满意。',
            '下载语言包：如果想添加更多语言，可通过点击“Install voice data”来下载相应的语言包。'
        ],
        outro:
            '完成以上步骤后，您的设备即可使用所选语言和语音进行文本转语音。'
    }
};