// app/data/helpRecords.js
/**
 * HELP_RECORDS – an array of help record entries used by the Help page.
 *
 * Each entry has:
 *   • id   – a unique identifier (also used as the <details> element id)
 *   • html – an object keyed by language code containing the markup to display.
 *
 * The markup strings are raw HTML; they can contain paragraphs, lists,
 * tables, code blocks, images, etc.  The Help renderer injects them with
 * `innerHTML`, so you can format the answer exactly as you need.
 *
 * Add as many entries as you like – the UI will automatically list them.
 * If a language is missing for a given entry, the renderer falls back to
 * English.
 */

export const HELP_RECORDS = [
  /* -----------------------------------------------------------------
     1️⃣  Text‑to‑Speech on Android
     An HTML <details> is the wrapper element
     <summary> for each local
     ----------------------------------------------------------------- */
  {
    id: "tts-android",
    html: {}


    /*        
              en: `
              <summary>Setup Speech on an Android mobile</summary>
  <ol>
      <li>In Settings: Scroll down and tap on "Accessibility." (On some devices, you may find Text-to-Speech under “Language & input” or “System.”) Alternatively, use 🔍 and search for Text-to-Speech</li>
      <li>Text-to-Speech Output: Look for the option labeled "Text-to-Speech output" and tap on it.</li>
      <li>Select TTS Engine: You will see options for different TTS engines. The default is usually Google Text-to-Speech. You can select it or any other installed TTS engine.</li>
      <li>Language Settings: Tap on “Language” to choose the language you want to use for TTS. You may need to download additional languages if they are not already installed.</li>
      <li>Voice Selection: Under the "Voice" option, you can choose from various available voices, which may include different accents and genders.</li>
      <li>Adjust Speech Rate and Pitch: You can modify the speech rate (how fast the text is spoken) and pitch (how high or low the voice sounds) according to your preferences.</li>
      <li>Test the Voice: There is usually an option to listen to a sample of the voice to ensure it meets your needs. Tap on "Listen to an example" to hear how the selected voice sounds.</li>
      <li>Download Language Packs: If you want to add more languages, you can often download them through the settings by tapping on "Install voice data."</li>
  </ol>
  <p>After completing these steps your device will be ready to use TTS for speech.</p>
              `,
              th: `
  <summary>ตั้งค่าการพูดบนมือถือ Android</summary>
  <ol>
      <li>ในการตั้งค่า: เลื่อนลงและแตะที่ "การเข้าถึง" (ในอุปกรณ์บางรุ่น คุณอาจพบ Text-to-Speech ภายใต้ “ภาษาและการป้อนข้อมูล” หรือ “ระบบ”) หรือใช้ 🔍 และค้นหา Text-to-Speech</li>
      <li>ผลลัพธ์ Text-to-Speech: มองหาตัวเลือกที่มีชื่อว่า "ผลลัพธ์ Text-to-Speech" และแตะที่มัน</li>
      <li>เลือกเครื่องยนต์ TTS: คุณจะเห็นตัวเลือกสำหรับเครื่องยนต์ TTS ที่แตกต่างกัน โดยปกติแล้วค่าเริ่มต้นจะเป็น Google Text-to-Speech คุณสามารถเลือกมันหรือเครื่องยนต์ TTS อื่นที่ติดตั้งไว้</li>
      <li>การตั้งค่าภาษา: แตะที่ “ภาษา” เพื่อเลือกภาษาที่คุณต้องการใช้สำหรับ TTS คุณอาจต้องดาวน์โหลดภาษาที่เพิ่มเติมหากยังไม่ได้ติดตั้ง</li>
      <li>การเลือกเสียง: ภายใต้ตัวเลือก "เสียง" คุณสามารถเลือกจากเสียงที่มีอยู่หลายแบบ ซึ่งอาจรวมถึงสำเนียงและเพศที่แตกต่างกัน</li>
      <li>ปรับอัตราการพูดและความสูงของเสียง: คุณสามารถปรับอัตราการพูด (ความเร็วที่ข้อความถูกพูด) และความสูงของเสียง (เสียงสูงหรือต่ำ) ตามที่คุณต้องการ</li>
      <li>ทดสอบเสียง: โดยปกติจะมีตัวเลือกให้ฟังตัวอย่างเสียงเพื่อให้แน่ใจว่าตรงตามความต้องการของคุณ แตะที่ "ฟังตัวอย่าง" เพื่อฟังว่าเสียงที่เลือกเป็นอย่างไร</li>
      <li>ดาวน์โหลดแพ็คภาษา: หากคุณต้องการเพิ่มภาษามากขึ้น คุณมักจะสามารถดาวน์โหลดได้ผ่านการตั้งค่าโดยการแตะที่ "ติดตั้งข้อมูลเสียง"</li>
  </ol>
  <p>หลังจากทำตามขั้นตอนเหล่านี้ อุปกรณ์ของคุณจะพร้อมใช้งาน TTS สำหรับการพูด</p>
              `,
              fa: `
    <summary>راه‌اندازی گفتار بر روی یک دستگاه Android</summary>
    <ol>
      <li>در تنظیمات: به پایین اسکرول کنید و روی «دسترسی‌پذیری» (Accessibility) ضربه بزنید. (در برخی دستگاه‌ها ممکن است تبدیل متن به گفتار زیر «زبان و ورودی» یا «سیستم» باشد.) همچنین می‌توانید با 🔍 جستجو کنید.</li>
      <li>خروجی متن‑به‑گفتار: گزینه‌ای به نام «خروجی متن‑به‑گفتار» را پیدا کنید و روی آن ضربه بزنید.</li>
      <li>انتخاب موتور TTS: گزینه‌های مختلفی برای موتورها نمایش داده می‌شود. پیش‌فرض معمولاً Google Text‑to‑Speech است؛ می‌توانید آن یا هر موتور دیگری که نصب شده است را انتخاب کنید.</li>
      <li>تنظیمات زبان: روی «زبان» ضربه بزنید تا زبانی که می‌خواهید برای TTS استفاده شود را انتخاب کنید. شاید لازم باشد زبان‌های اضافی را دانلود کنید.</li>
      <li>انتخاب صدا: در بخش «صدا» می‌توانید از میان صداهای موجود یکی را برگزینید؛ ممکن است لهجه‌ها و جنسیت‌های متفاوتی داشته باشند.</li>
      <li>تنظیم سرعت و لحن گفتار: می‌توانید سرعت خواندن (چند سریع متن تلفظ شود) و لحن (بالا یا پایین بودن صدا) را مطابق سلیقه‌تان تنظیم کنید.</li>
      <li>آزمون صدا: معمولاً گزینه‌ای برای گوش دادن به نمونه‌ای از صدا وجود دارد تا مطمئن شوید مناسب است. روی «گوش دادن به یک مثال» ضربه بزنید.</li>
      <li>دانلود بسته‌های زبانی: اگر می‌خواهید زبان‌های بیشتری اضافه کنید، اغلب می‌توانید آنها را از طریق تنظیمات با فشار دادن «نصب داده‌های صوتی» دریافت کنید.</li>
    </ol>
    <p>پس از اتمام این مراحل دستگاه شما آماده استفاده از TTS می‌شود.</p>
              `,
              es: `
    <summary>Configurar la voz en un móvil Android</summary>
    <ol>
      <li>En Configuración: desplázate hacia abajo y pulsa “Accesibilidad”. (En algunos dispositivos puede estar bajo “Idioma y entrada” o “Sistema”.) También puedes usar 🔍 y buscar “Texto a voz”.</li>
      <li>Salida de Texto a Voz: busca la opción llamada “Salida de texto a voz” y pulsa sobre ella.</li>
      <li>Selecciona el motor TTS: verás opciones para diferentes motores TTS. Por defecto suele ser Google Text‑to‑Speech, pero puedes escoger cualquier otro motor instalado.</li>
      <li>Configuración de idioma: pulsa “Idioma” y elige el idioma que deseas usar con TTS. Puede que necesites descargar idiomas adicionales si aún no están instalados.</li>
      <li>Selección de voz: bajo la opción “Voz” puedes escoger entre varias voces disponibles, que pueden incluir distintos acentos y géneros.</li>
      <li>Ajustar velocidad y tono: modifica la velocidad de lectura (qué tan rápido se pronuncia el texto) y el tono (cuán agudo o grave suena la voz) según tus preferencias.</li>
      <li>Prueba la voz: normalmente hay una opción para escuchar una muestra de la voz y asegurarte de que te convence. Pulsa “Escuchar un ejemplo” para oír la voz seleccionada.</li>
      <li>Descargar paquetes de idioma: si quieres añadir más idiomas, a menudo puedes descargarlos desde la configuración pulsando “Instalar datos de voz”.</li>
    </ol>
    <p>Una vez completados los pasos, el dispositivo quedará listo para usar TTS.</p>
              `,
              ar: `
    <summary>إعداد الكلام على هاتف Android المحمول</summary>
    <ol>
      <li>في الإعدادات: مرّر للأسفل واضغط على “إمكانية الوصول”. (في بعض الأجهزة قد تجد تحويل النص إلى كلام تحت “اللغة والإدخال” أو “النظام”.) بدلاً من ذلك استخدم 🔍 وابحث عن تحويل النص إلى كلام.</li>
      <li>إخراج النص إلى كلام: ابحث عن الخيار المسمّى “إخراج النص إلى كلام” واضغط عليه.</li>
      <li>اختر محرك TTS: ستظهر لك خيارات لمحركات تحويل النص إلى كلام مختلفة. عادةً ما يكون Google Text‑to‑Speech هو الافتراضي. يمكنك اختيار هذا أو أي محرك آخر مثبت.</li>
      <li>إعدادات اللغة: اضغط على “اللغة” لاختيار اللغة التي تريد استخدامها مع TTS. قد تحتاج إلى تنزيل لغات إضافية إذا لم تكن مثبتة مسبقاً.</li>
      <li>اختيار الصوت: ضمن خيار “الصوت” يمكنك اختيار أحد الأصوات المتوفرة، وقد تشمل لهجات وجنسيات مختلفة.</li>
      <li>ضبط سرعة الكلام والنبرة: يمكنك تعديل سرعة الكلام (كم يُنطق النص بسرعة) والنبرة (ارتفاع أو انخفاض الصوت) حسب رغبتك.</li>
      <li>اختبار الصوت: عادةً يوجد خيار للاستماع إلى عينة من الصوت للتأكد من ملاءمته. اضغط على “استمع إلى مثال” لسماع الصوت المختار.</li>
      <li>تنزيل حزم اللغات: إذا أردت إضافة المزيد من اللغات، يمكنك غالباً تنزيلها عبر الإعدادات بالضغط على “تثبيت بيانات الصوت”.</li>
    </ol>
    <p>بعد إكمال هذه الخطوات يصبح الجهاز جاهزًا لاستخدام TTS.</p>
              `,
              hi: `
    <summary>Android मोबाइल पर स्पीच सेटअप करें</summary>
    <ol>
      <li>सेटिंग्स में: नीचे स्क्रॉल करें और “एक्सेसिबिलिटी” पर टैप करें। (कुछ डिवाइसों में यह “भाषा एवं इनपुट” या “सिस्टम” के तहत मिल सकता है।) वैकल्पिक रूप से 🔍 का प्रयोग करके “टेक्स्ट‑टू‑स्पीच” खोजें।</li>
      <li>टेक्स्ट‑टू‑स्पीच आउटपुट: “टेक्स्ट‑टू‑स्पीच आउटपुट” लेबल वाला विकल्प खोजें और उसपर टैप करें।</li>
      <li>TTS इंजन चुनें: विभिन्न TTS इंजनों के विकल्प दिखेंगे। डिफ़ॉल्ट आमतौर पर Google Text‑to‑Speech होता है। आप इसे या कोई अन्य स्थापित TTS इंजन चुन सकते हैं।</li>
      <li>भाषा सेटिंग्स: “भाषा” पर टैप करके वह भाषा चुनें जिसका आप TTS के लिये उपयोग करना चाहते हैं। यदि वह पहले से इंस्टॉल नहीं है तो अतिरिक्त भाषाएँ डाउनलोड करनी पड़ सकती हैं।</li>
      <li>वॉइस चयन: “वॉइस” विकल्प के अंतर्गत उपलब्ध विभिन्न आवाज़ों में से चुनें; इनमें अलग‑अलग एक्सेंट और जेंडर हो सकते हैं।</li>
      <li>स्पीच रेट और पिच समायोजित करें: आप स्पीच रेट (टेक्स्ट कितनी तेज़ पढ़ा जाता है) और पिच (आवाज़ की ऊँचाई/नीचाई) को अपनी पसंद के अनुसार बदल सकते हैं।</li>
      <li>वॉइस टेस्ट करें: आमतौर पर एक विकल्प होता है जिससे आप आवाज़ का सैंपल सुन सकते हैं कि क्या वह आपके मानकों पर खरा उतरता है। “एक उदाहरण सुनें” पर टैप करके चुनी गई आवाज़ को सुनें।</li>
      <li>भाषा पैक्स डाउनलोड करें: यदि आप अधिक भाषाएँ जोड़ना चाहते हैं, तो सेटिंग्स में “इंस्टॉल वॉइस डेटा” पर टैप करके अक्सर उन्हें डाउनलोड किया जा सकता है।</li>
    </ol>
    <p>इन चरणों को पूरा करने के बाद आपका डिवाइस TTS का उपयोग करने के लिए तैयार हो जाएगा।</p>
              `,
              ja: `
    <summary>Android モバイルで音声設定を行う</summary>
    <ol>
      <li>設定で下へスクロールし、「アクセシビリティ」をタップします。（一部の端末では「言語と入力」や「システム」の中にある場合があります。）代わりに 🔍 で「テキスト読み上げ」を検索しても構いません。</li>
      <li>テキスト読み上げ出力: 「テキスト読み上げ出力」というラベルの付いた項目を探し、タップします。</li>
      <li>TTS エンジンの選択: 複数の TTS エンジンが表示されます。デフォルトは通常 Google Text‑to‑Speech ですが、インストール済みの他のエンジンを選択できます。</li>
      <li>言語設定: 「言語」をタップし、TTS に使用したい言語を選びます。未インストールの場合は追加でダウンロードが必要になることがあります。</li>
      <li>音声の選択: 「音声」項目で利用可能な音声を選べます。アクセントや性別が異なるものが含まれることがあります。</li>
      <li>スピーチ速度とピッチの調整: 読み上げ速度（テキストがどれだけ速く話されるか）とピッチ（声の高さ）を好みに合わせて変更できます。</li>
      <li>音声のテスト: 通常、音声サンプルを再生して確認できるオプションがあります。「例を聞く」をタップして選択した音声を確認してください。</li>
      <li>言語パックのダウンロード: さらに多くの言語を追加したい場合は、設定内の「音声データをインストール」をタップしてダウンロードできます。</li>
    </ol>
    <p>これらの手順が完了すれば、デバイスは TTS を使用できるようになります。</p>
              `,
              zh: `
    <summary>在 Android 手机上设置语音合成</summary>
    <ol>
      <li>在设置中：向下滚动并点击 “辅助功能”。（某些设备可能在 “语言和输入” 或 “系统” 中找到文本转语音。）或者使用 🔍 搜索 “文本转语音”。</li>
      <li>文本转语音输出：查找标有 “Text‑to‑Speech output” 的选项并点击。</li>
      <li>选择 TTS 引擎：会看到不同 TTS 引擎的选项。默认通常是 Google Text‑to‑Speech，你也可以选择其他已安装的引擎。</li>
      <li>语言设置：点击 “Language” 以选择用于 TTS 的语言。如果没有预装，可能需要下载额外语言包。</li>
      <li>语音选择：在 “Voice” 选项下，可以从多个可用语音中挑选，可能包括不同口音和性别。</li>
      <li>调整语速和音调：根据个人偏好修改语速（文本朗读的快慢）和音调（声音的高低）。</li>
      <li>测试语音：通常会提供一个按钮让你聆听示例，以确认所选语音是否满意。点击 “Listen to an example” 进行试听。</li>
      <li>下载语言包：如果想添加更多语言，可在设置中点击 “Install voice data” 来下载相应的语言包。</li>
    </ol>
    <p>完成以上步骤后，您的设备即可使用 TTS 进行语音合成。</p>
              `
          */

  },

  /* -----------------------------------------------------------------
     2️⃣  Text‑to‑Speech on iOS
     ----------------------------------------------------------------- */
  {
    id: "tts-ios",
    html: {}

    /*
    
          en: `
      <summary>Setup Speech on an IPhone or Apple Mac</summary>
      <ol>
        <li>Open Settings: Tap on the Settings app on your iPhone.</li>
        <li>Accessibility: Scroll down and select “Accessibility.” (alternatively, use 🔍 and search for Spoken Content)</li>
        <li>Spoken Content: Under the Accessibility menu, tap on “Spoken Content.”</li>
        <li>Enable Speak Selection: Toggle on “Speak Selection” if you want to have text read aloud when you select it. This allows you to highlight text and have it spoken.</li>
        <li>Enable Speak Screen: You can also toggle on “Speak Screen,” which allows you to swipe down with two fingers from the top of the screen to have the content of the screen read aloud.</li>
        <li>Voices: Tap on “Voices” to choose from a variety of voices and languages. You can select the preferred voice and download additional voices if needed.</li>
        <li>Speech Rate: Adjust the speech rate slider to set how fast the text is spoken.</li>
        <li>Highlight Content: You can enable “Highlight Content” to have words highlighted as they are spoken. This can help with reading along.</li>
        <li>Test the Voice: You can tap on “Play” to listen to a sample of the selected voice.</li>
      </ol>
      <p>After completing these steps, your device will be ready for TTS and speech.</p>
                `,
          th: `
      <summary>ตั้งค่าการพูดบน iPhone หรือ Apple Mac</summary>
      <ol>
        <li>เปิด Settings: แตะแอป Settings บน iPhone ของคุณ</li>
        <li>Accessibility: เลื่อนลงและเลือก “Accessibility.” (หรือใช้ 🔍 ค้นหา “Spoken Content”)</li>
        <li>Spoken Content: ภายในเมนู Accessibility ให้แตะ “Spoken Content.”</li>
        <li>Enable Speak Selection: เปิด “Speak Selection” หากต้องการให้ข้อความที่เลือกถูกอ่านออกเสียงโดยอัตโนมัติ</li>
        <li>Enable Speak Screen: คุณสามารถเปิด “Speak Screen” ได้เช่นกัน ซึ่งทำให้คุณสไลด์สองนิ้วจากด้านบนของหน้าจอเพื่อให้เนื้อหาทั้งหมดอ่านออกเสียง</li>
        <li>Voices: แตะ “Voices” เพื่อเลือกจากหลายเสียงและหลายภาษา คุณสามารถเลือกเสียงที่ต้องการและดาวน์โหลดเสียงเพิ่มเติมได้หากต้องการ</li>
        <li>Speech Rate: ปรับแถบสไลเดอร์เพื่อกำหนดความเร็วของการพูด</li>
        <li>Highlight Content: คุณสามารถเปิด “Highlight Content” เพื่อให้คำที่พูดออกมาถูกไฮไลท์ขณะอ่าน ช่วยให้ตามอ่านได้ง่ายขึ้น</li>
        <li>Test the Voice: แตะ “Play” เพื่อฟังตัวอย่างเสียงที่เลือก</li>
      </ol>
      <p>หลังจากทำตามขั้นตอนเหล่านี้เสร็จแล้ว อุปกรณ์ของคุณจะพร้อมใช้ TTS และการพูด</p>
                `,
          fa: `
      <summary>راه‌اندازی گفتار در iPhone یا Apple Mac</summary>
      <ol>
        <li>باز کردن Settings: روی برنامه Settings در iPhone خود ضربه بزنید.</li>
        <li>دسترس‌پذیری (Accessibility): به پایین اسکرول کنید و “Accessibility” را انتخاب کنید. (می‌توانید از 🔍 استفاده کرده و “Spoken Content” را جستجو کنید.)</li>
        <li>محتوای گفتاری (Spoken Content): در منوی دسترس‌پذیری، روی “Spoken Content” ضربه بزنید.</li>
        <li>فعال‌سازی Speak Selection: اگر می‌خواهید متن انتخاب‌شده هنگام برجسته شدن خوانده شود، “Speak Selection” را روشن کنید.</li>
        <li>فعال‌سازی Speak Screen: می‌توانید “Speak Screen” را نیز روشن کنید؛ این گزینه با کشیدن دو انگشت از بالا به پایین صفحه، تمام محتوا را برای شما می‌خواند.</li>
        <li>صداها (Voices): روی “Voices” ضربه بزنید تا از بین مجموعه‌ای از صداها و زبان‌ها انتخاب کنید. می‌توانید صدا دلخواه را برگزیده و در صورت نیاز صداهای دیگر را دانلود کنید.</li>
        <li>سرعت گفتار (Speech Rate): اسلایدر سرعت گفتار را تنظیم کنید تا تعیین کنید متن چقدر سریع خوانده شود.</li>
        <li>هایلایت محتوا (Highlight Content): می‌توانید “Highlight Content” را فعال کنید تا کلمات هنگام گفتار به‌صورت برجسته نشان داده شوند و خواندن همراه آسان‌تر شود.</li>
        <li>آزمون صدا: می‌توانید روی “Play” ضربه بزنید تا نمونه‌ای از صدای انتخابی را گوش کنید.</li>
      </ol>
      <p>پس از انجام این مراحل، دستگاه شما برای استفاده از تبدیل متن به گفتار (TTS) آماده می‌شود.</p>
                `,
          es: `
      <summary>Configurar la voz en un iPhone o Apple Mac</summary>
      <ol>
        <li>Abrir Configuración: toca la aplicación Configuración en tu iPhone.</li>
        <li>Accesibilidad: desplázate hacia abajo y selecciona “Accesibilidad”. (alternativamente, usa 🔍 y busca “Contenido hablado”).</li>
        <li>Contenido hablado: dentro del menú Accesibilidad, pulsa “Contenido hablado”.</li>
        <li>Activar “Hablar selección”: activa “Hablar selección” si deseas que el texto seleccionado sea leído en voz alta. Esto permite resaltar texto y escucharlo.</li>
        <li>Activar “Hablar pantalla”: también puedes activar “Hablar pantalla”, lo que permite deslizar dos dedos desde la parte superior de la pantalla para que todo el contenido sea leído.</li>
        <li>Voces: pulsa “Voces” para elegir entre una variedad de voces e idiomas. Puedes seleccionar la voz preferida y descargar voces adicionales si lo necesitas.</li>
        <li>Velocidad del habla: ajusta el control deslizante de velocidad para definir qué tan rápido se pronuncia el texto.</li>
        <li>Resaltar contenido: puedes habilitar “Resaltar contenido” para que las palabras se destaquen mientras se leen, facilitando la lectura simultánea.</li>
        <li>Probar la voz: pulsa “Reproducir” para escuchar una muestra de la voz seleccionada.</li>
      </ol>
      <p>Tras completar estos pasos, tu dispositivo estará listo para usar TTS y la síntesis de voz.</p>
                `,
          ar: `
      <summary>إعداد الكلام على iPhone أو Apple Mac</summary>
      <ol>
        <li>افتح الإعدادات: اضغط على تطبيق الإعدادات على جهاز iPhone الخاص بك.</li>
        <li>إمكانية الوصول: مرّر للأسفل واختر “إمكانية الوصول”. (يمكنك أيضاً استخدام 🔍 والبحث عن “المحتوى المنطوق”).</li>
        <li>المحتوى المنطوق: ضمن قائمة إمكانية الوصول، اضغط على “المحتوى المنطوق”.</li>
        <li>تفعيل نطق التحديد: شغّل “نطق التحديد” إذا أردت أن تُقرأ النصوص عندما تقوم بتحديدها. يتيح لك ذلك إبراز النص وسماع نطقه.</li>
        <li>تفعيل نطق الشاشة: يمكنك كذلك تشغيل “نطق الشاشة”، والذي يسمح لك بالسحب بإصبعين من أعلى الشاشة لسماع محتوى الشاشة بالكامل.</li>
        <li>الأصوات: اضغط على “الأصوات” لاختيار صوت ولغة من بين مجموعة متنوعة. يمكنك اختيار الصوت المفضل وتحميل أصوات إضافية إذا لزم الأمر.</li>
        <li>سرعة الكلام: اضبط شريط السرعة لتحديد مدى سرعة نطق النص.</li>
        <li>تمييز المحتوى: يمكنك تمكين “تمييز المحتوى” ليُظهر الكلمات مميزة أثناء نطقها، مما يساعد على القراءة المتزامنة.</li>
        <li>اختبار الصوت: اضغط على “تشغيل” للاستماع إلى عينة من الصوت المحدد.</li>
      </ol>
      <p>بعد إكمال هذه الخطوات يصبح جهازك جاهزًا لاستخدام تحويل النص إلى كلام (TTS).</p>
                `,
          hi: `
      <summary>iPhone या Apple Mac पर स्पीच सेटअप करें</summary>
      <ol>
        <li>सेटिंग्स खोलें: अपने iPhone पर Settings ऐप पर टैप करें।</li>
        <li>एक्सेसिबिलिटी: नीचे स्क्रॉल करें और “Accessibility” चुनें। (वैकल्पिक रूप से 🔍 का उपयोग करके “Spoken Content” खोजें।)</li>
        <li>स्पोकन कंटेंट: एक्सेसिबिलिटी मेन्यू के भीतर “Spoken Content” पर टैप करें।</li>
        <li>Speak Selection सक्षम करें: यदि आप चयनित टेक्स्ट को पढ़वाना चाहते हैं तो “Speak Selection” को ऑन करें। इससे आप टेक्स्ट हाईलाइट करके उसे सुन सकते हैं।</li>
        <li>Speak Screen सक्षम करें: आप “Speak Screen” को भी ऑन कर सकते हैं, जिससे दो उँगलियों से स्क्रीन के शीर्ष से नीचे स्वाइप करने पर पूरी स्क्रीन का कंटेंट पढ़ा जाता है।</li>
        <li>वॉइसेज़: “Voices” पर टैप करके विभिन्न आवाज़ों और भाषाओं में से चुनें। आप अपनी पसंदीदा आवाज़ चुन सकते हैं और जरूरत पड़ने पर अतिरिक्त आवाज़ें डाउनलोड कर सकते हैं।</li>
        <li>स्पीच रेट: स्पीच रेट स्लाइडर को समायोजित करके तय करें कि टेक्स्ट कितनी तेज़ी से पढ़ा जाए।</li>
        <li>हाइलाइट कंटेंट: “Highlight Content” को सक्षम करने से पढ़ते समय शब्द हाइलाइट होते हैं, जिससे पढ़ना आसान हो जाता है।</li>
        <li>वॉइस टेस्ट करें: “Play” पर टैप करके चयनित आवाज़ का नमूना सुन सकते हैं।</li>
      </ol>
      <p>इन चरणों को पूरा करने के बाद आपका डिवाइस TTS और स्पीच के लिए तैयार हो जाएगा।</p>
                `,
          ja: `
      <summary>iPhone または Apple Mac で音声設定を行う</summary>
      <ol>
        <li>設定アプリを開く: iPhone の Settings アプリをタップします。</li>
        <li>アクセシビリティ: 下にスクロールし「アクセシビリティ」を選択します。（代わりに 🔍 で「Spoken Content」を検索しても構いません。）</li>
        <li>Spoken Content: アクセシビリティメニュー内の「Spoken Content」をタップします。</li>
        <li>Speak Selection を有効化: テキストを選択したときに読み上げさせたい場合は「Speak Selection」をオンにします。選択したテキストがハイライトされ、音声で読み上げられます。</li>
        <li>Speak Screen を有効化: 同様に「Speak Screen」もオンにすると、画面上部から二本指で下にスワイプするだけで画面全体の内容が読み上げられます。</li>
        <li>音声（Voices）: 「Voices」をタップし、さまざまな声と言語から選択します。好みの声を選び、必要に応じて追加の音声をダウンロードできます。</li>
        <li>スピーチレート: スピーチレートのスライダーを調整して、テキストがどれくらい速く読まれるかを設定します。</li>
        <li>ハイライトコンテンツ: 「Highlight Content」を有効にすると、読み上げ中に単語がハイライトされ、追従しやすくなります。</li>
        <li>音声のテスト: 「Play」をタップして、選択した音声のサンプルを聞くことができます。</li>
      </ol>
      <p>これらの手順を完了すれば、デバイスは TTS と音声読み上げの使用準備が整います。</p>
                `,
          zh: `
      <summary>在 iPhone 或 Apple Mac 上设置语音合成</summary>
      <ol>
        <li>打开设置：在 iPhone 上点击 Settings 应用。</li>
        <li>辅助功能：向下滚动并选择 “Accessibility”。（也可以使用 🔍 搜索 “Spoken Content”。）</li>
        <li>Spoken Content：在辅助功能菜单下，点击 “Spoken Content”。</li>
        <li>启用 Speak Selection：如果希望选中文本后自动朗读，请打开 “Speak Selection”。这样选中的文字会被高亮并朗读。</li>
        <li>启用 Speak Screen：同样可以打开 “Speak Screen”，只需用两根手指从屏幕顶部向下滑动，即可朗读整个屏幕内容。</li>
        <li>语音（Voices）：点击 “Voices” 选择多种语言和声音。可以挑选喜欢的声音，并在需要时下载额外的语音包。</li>
        <li>语速（Speech Rate）：调节语速滑块，以设置文本朗读的快慢。</li>
        <li>突出显示内容（Highlight Content）：打开此选项后，朗读时文字会被高亮，便于同步阅读。</li>
        <li>测试语音：点击 “Play” 可以听取所选语音的示例。</li>
      </ol>
      <p>完成这些步骤后，您的设备即可使用 TTS 与语音朗读功能。</p>
                `
        }
    */

  },

  /* -----------------------------------------------------------------
     3️⃣  Add additional FAQ objects below following the same pattern.
     ----------------------------------------------------------------- */
  // Example placeholder (you can delete or replace it):
  // {
  //     id: "privacy-policy",
  //     html: {
  //         en: `<p>You can read the privacy policy <a href="/en/privacy" target="_blank">here</a>.</p>`,
  //         th: `<p>คุณสามารถอ่านนโยบายความเป็นส่วนตัว <a href="/th/privacy" target="_blank">ได้ที่นี่</a></p>`,
  //         // …other languages…
  //     }
  // },
];