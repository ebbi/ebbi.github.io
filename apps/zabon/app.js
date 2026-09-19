(() => {
  "use strict";
  const STORAGE_KEYS = {
    get settings() {
      return "zabon.settings";
    },
    get lessonLanguages() {
      return "zabon.lessonLanguages";
    },
    get onboardingComplete() {
      return "zabon.onboardingComplete";
    },
    get onboardingAnswers() {
      return "zabon.onboardingAnswers";
    },
    get buildLanguages() {
      return "zabon.buildLanguages";
    },
    get srs() {
      return `zabon.${state?.settings?.targetLanguage || "th"}.srs`;
    },
    get quiz() {
      return `zabon.${state?.settings?.targetLanguage || "th"}.quiz`;
    },
    get lessonsTried() {
      return `zabon.${state?.settings?.targetLanguage || "th"}.lessonsTried`;
    },
    get milestoneProgress() {
      return `zabon.${state?.settings?.targetLanguage || "th"}.milestoneProgress`;
    },
  };
  const DEFAULT_LESSON_LANGUAGES = Object.freeze(["en", "th"]);
  const THEME_CYCLE = Object.freeze(["auto", "light", "dark"]);
  const SPEED_PRESETS = Object.freeze({
    normal: { rate: 1, pitch: 1 },
    slow: { rate: 0.75, pitch: 1.05 },
    slower: { rate: 0.5, pitch: 1.1 },
  });
  const CATEGORY_ICONS = Object.freeze({
    cat_grammar_intro: "📜",
    cat_grammar_inter: "📜",
    cat_grammar_adv: "📜",
    cat_greetings: "👋",
    cat_basics: "🧭",
    cat_food: "🍜",
    cat_shopping: "🛍️",
    cat_money: "💰",
    cat_transport: "🚌",
    cat_weather: "⛅",
    cat_home: "🏠",
    cat_health: "💊",
    cat_personal: "💇",
    cat_post: "📮",
    cat_entertainment: "🎬",
    cat_family: "👪",
    cat_accommodation: "🏨",
    cat_travel: "✈️",
    cat_emergency: "🚨",
    cat_work: "💼",
    cat_religion_culture: "🛕",
    cat_reading_writing: "🔤",
  });
  const TIER_ICONS = Object.freeze({
    introductory: "🌱",
    intermediate: "🌿",
    advanced: "🌳",
  });
  const SCROLL_SUPPRESSION_MS = 900;
  const VIEW_IDS = Object.freeze([
    "targetSelect",
    "onboarding",
    "home",
    "lesson",
    "flashcard",
    "quiz",
    "build",
    "letter-flashcard",
    "letter-quiz",
    "letter-spell",
    "progress",
    "voicetest",
    "help",
  ]);
  const IMPLEMENTED_TARGET_LANGUAGES = Object.freeze([
    "th",
    "fa",
    "en",
    "zh",
    "ja",
    "ar",
    "es",
  ]);
  const UI_STRINGS = Object.freeze({
    appTitle: {
      en: "Zabon",
      th: "ซาบอน",
      fa: "زبون",
      ar: "زابون",
      es: "Zabon",
      zh: "扎邦",
      ja: "ザボン",
    },
    appLanguage: {
      en: "App language",
      th: "ภาษาของแอป",
      fa: "زبان برنامه",
      ar: "لغة التطبيق",
      es: "Idioma de la app",
      zh: "应用语言",
      ja: "アプリ言語",
    },
    lessonsTried: {
      en: "Lessons tried",
      th: "บทเรียนที่ลองแล้ว",
      fa: "درس‌های امتحان‌شده",
      ar: "الدروس المُجرَّبة",
      es: "Lecciones probadas",
      zh: "已尝试的课程",
      ja: "試したレッスン",
    },
    onboardingTitle: {
      en: "Welcome to Zabon",
      th: "ยินดีต้อนรับสู่ Zabon",
      fa: "به زبون خوش آمدید",
      ar: "مرحبًا بك في زبون",
      es: "Bienvenido a Zabon",
      zh: "欢迎使用 Zabon",
      ja: "Zabonへようこそ",
    },
    onboardingIntro: {
      en: "Answer a few questions to help Zabon suggest a study plan. You can skip this and browse freely.",
      th: "ตอบคำถามสองสามข้อเพื่อช่วยให้ Zabon แนะนำแผนการเรียน คุณสามารถข้ามและเรียกดูได้อย่างอิสระ",
      fa: "برای کمک به زبون در پیشنهاد برنامه مطالعه، به چند سؤال پاسخ دهید. می‌توانید رد کنید و آزادانه مرور کنید.",
      ar: "أجب عن بضعة أسئلة لمساعدة زبون في اقتراح خطة دراسة. يمكنك التخطي والتصفح بحرية.",
      es: "Responde algunas preguntas para que Zabon sugiera un plan de estudio. Puedes omitir esto y explorar libremente.",
      zh: "回答几个问题，帮助 Zabon 推荐学习计划。你可以跳过并自由浏览。",
      ja: "Zabonが学習プランを提案できるように、いくつかの質問にお答えください。スキップして自由に閲覧することもできます。",
    },
    onboardingGoal: {
      en: "What is your main goal?",
      th: "เป้าหมายหลักของคุณคืออะไร",
      fa: "هدف اصلی شما چیست؟",
      ar: "ما هدفك الرئيسي؟",
      es: "¿Cuál es tu objetivo principal?",
      zh: "你的主要目标是什么？",
      ja: "主な目標は何ですか？",
    },
    onboardingGoalSurvival: {
      en: "Survival & Travel",
      th: "การเอาตัวรอดและการเดินทาง",
      fa: "بقا و سفر",
      ar: "البقاء والسفر",
      es: "Supervivencia y viajes",
      zh: "生存与旅行",
      ja: "サバイバルと旅行",
    },
    onboardingGoalSocial: {
      en: "Social & Everyday",
      th: "สังคมและชีวิตประจำวัน",
      fa: "اجتماعی و روزمره",
      ar: "اجتماعي ويومي",
      es: "Social y cotidiano",
      zh: "社交与日常",
      ja: "ソーシャルと日常",
    },
    onboardingGoalProfessional: {
      en: "Professional & Business",
      th: "วิชาชีพและธุรกิจ",
      fa: "حرفه‌ای و کسب‌وکار",
      ar: "مهني وأعمال",
      es: "Profesional y negocios",
      zh: "职业与商务",
      ja: "プロフェッショナルとビジネス",
    },
    onboardingGoalMedia: {
      en: "Media & Literacy",
      th: "สื่อและการรู้หนังสือ",
      fa: "رسانه و سوادآموزی",
      ar: "الإعلام ومحو الأمية",
      es: "Medios y alfabetización",
      zh: "媒体与读写",
      ja: "メディアとリテラシー",
    },
    onboardingGoalCultural: {
      en: "Cultural Integration",
      th: "การบูรณาการทางวัฒนธรรม",
      fa: "ادغام فرهنگی",
      ar: "الاندماج الثقافي",
      es: "Integración cultural",
      zh: "文化融入",
      ja: "文化統合",
    },
    onboardingLevel: {
      en: "Your current {targetLanguage} level?",
      th: "ระดับ{targetLanguage}ปัจจุบันของคุณคืออะไร",
      fa: "سطح فعلی شما در {targetLanguage} چیست؟",
      ar: "ما مستواك الحالي في {targetLanguage}؟",
      es: "¿Cuál es tu nivel actual de {targetLanguage}?",
      zh: "你目前的{targetLanguage}水平是什么？",
      ja: "現在の{targetLanguage}レベルは何ですか？",
    },
    onboardingLevelBeginner: {
      en: "Complete beginner",
      th: "ผู้เริ่มต้น",
      fa: "مبتدی کامل",
      ar: "مبتدئ تمامًا",
      es: "Principiante absoluto",
      zh: "完全零基础",
      ja: "完全な初心者",
    },
    onboardingLevelSome: {
      en: "Some words & phrases",
      th: "รู้คำและวลีบ้าง",
      fa: "برخی کلمات و عبارت‌ها",
      ar: "بعض الكلمات والعبارات",
      es: "Algunas palabras y frases",
      zh: "会一些单词和短语",
      ja: "いくつかの単語とフレーズ",
    },
    onboardingLevelBasic: {
      en: "Basic conversations",
      th: "การสนทนาพื้นฐาน",
      fa: "مکالمه‌های پایه",
      ar: "محادثات أساسية",
      es: "Conversaciones básicas",
      zh: "基本会话",
      ja: "基本的な会話",
    },
    onboardingLevelAdvanced: {
      en: "Advanced refinement",
      th: "ปรับปรุงขั้นสูง",
      fa: "اصلاح پیشرفته",
      ar: "تحسين متقدم",
      es: "Perfeccionamiento avanzado",
      zh: "高级提升",
      ja: "上級の仕上げ",
    },
    onboardingUsage: {
      en: "How will you mainly use {targetLanguage}?",
      th: "คุณจะใช้เวลา{targetLanguage}เป็นหลักอย่างไร",
      fa: "چگونه عمدتاً از {targetLanguage} استفاده خواهید کرد؟",
      ar: "كيف ستستخدم {targetLanguage} بشكل أساسي؟",
      es: "¿Cómo usarás principalmente el {targetLanguage}?",
      zh: "你将主要如何使用{targetLanguage}？",
      ja: "{targetLanguage}を主にどのように使いますか？",
    },
    onboardingUsageConversation: {
      en: "Talking & listening in real life",
      th: "พูดคุยและฟังในชีวิตจริง",
      fa: "گفتگو و شنیدن در دنیای واقعی",
      ar: "التحدث والاستماع في الواقع",
      es: "Conversaciones en la vida real",
      zh: "日常交谈与倾听",
      ja: "実生活での会話とリスニング",
    },
    onboardingUsageDigital: {
      en: "Texting & social media",
      th: "แชทและโซเชียลมีเดีย",
      fa: "پیام‌رسانی و شبکه‌های اجتماعی",
      ar: "المراسلة ووسائل التواصل الاجتماعي",
      es: "Mensajería y redes sociales",
      zh: "聊天与社交媒体",
      ja: "チャットとSNS",
    },
    onboardingUsageMedia: {
      en: "Movies, music & podcasts",
      th: "ภาพยนตร์ เพลง และพอดแคสต์",
      fa: "فیلم، موسیقی و پادکست",
      ar: "الأفلام والموسيقى والبودكاست",
      es: "Películas, música y podcasts",
      zh: "电影、音乐与播客",
      ja: "映画、音楽、ポッドキャスト",
    },
    onboardingUsageFormal: {
      en: "Work, study & formal reading",
      th: "การทำงาน การเรียน และการอ่านทางการ",
      fa: "کار، تحصیل و مطالعه رسمی",
      ar: "العمل والدراسة والقراءة الرسمية",
      es: "Trabajo, estudio y lectura formal",
      zh: "工作、学习与正式阅读",
      ja: "仕事、勉強、フォーマルな読書",
    },
    generateStudyPlan: {
      en: "Generate my study plan",
      th: "สร้างแผนการเรียนของฉัน",
      fa: "برنامه مطالعه من را بساز",
      ar: "أنشئ خطتي الدراسية",
      es: "Generar mi plan de estudio",
      zh: "生成我的学习计划",
      ja: "学習プランを作成",
    },
    skipOnboarding: {
      en: "Skip — browse freely",
      th: "ข้าม — เรียกดูอย่างอิสระ",
      fa: "رد شدن — مرور آزاد",
      ar: "تخطٍ — تصفح بحرية",
      es: "Omitir — explorar libremente",
      zh: "跳过——自由浏览",
      ja: "スキップして自由に閲覧",
    },
    onboardingGenerateHint: {
      en: "Select a goal and level to continue.",
      th: "เลือกเป้าหมายและระดับเพื่อดำเนินการต่อ",
      fa: "برای ادامه، هدف و سطح را انتخاب کنید.",
      ar: "اختر هدفًا ومستوى للمتابعة.",
      es: "Selecciona un objetivo y un nivel para continuar.",
      zh: "选择目标和水平以继续。",
      ja: "続けるには目標とレベルを選択してください。",
    },
    nextUp: {
      en: "Next Up",
      th: "ถัดไป",
      fa: "بعدی",
      ar: "التالي",
      es: "Siguiente",
      zh: "下一个",
      ja: "次へ",
    },
    studyPlan: {
      en: "Study Plan",
      th: "แผนการเรียน",
      fa: "برنامه مطالعه",
      ar: "خطة الدراسة",
      es: "Plan de estudio",
      zh: "学习计划",
      ja: "学習プラン",
    },
    completeQuestion: {
      en: "Complete?",
      th: "เสร็จแล้ว?",
      fa: "کامل شد؟",
      ar: "مكتمل؟",
      es: "¿Completado?",
      zh: "已完成？",
      ja: "完了？",
    },
    createStudyPlan: {
      en: "Create Study Plan",
      th: "สร้างแผนการเรียน",
      fa: "ساخت برنامه مطالعه",
      ar: "إنشاء خطة دراسة",
      es: "Crear plan de estudio",
      zh: "创建学习计划",
      ja: "学習プランを作成",
    },
    editStudyPlan: {
      en: "Edit Study Plan",
      th: "แก้ไขแผนการเรียนรู้",
      fa: "ویرایش برنامه مطالعه",
      ar: "تعديل خطة الدراسة",
      es: "Editar plan de estudio",
      zh: "编辑学习计划",
      ja: "学習プランを編集",
    },
    studyPlanAndProgress: {
      en: "Study Plan & Progress",
      th: "แผนการเรียนและความคืบหน้า",
      fa: "برنامه مطالعه و پیشرفت",
      ar: "خطة الدراسة والتقدم",
      es: "Plan de estudio y progreso",
      zh: "学习计划与进度",
      ja: "学習プランと進捗",
    },
    gettingStarted: {
      en: "Getting Started",
      th: "เริ่มต้นใช้งาน",
      fa: "شروع کار",
      ar: "البدء",
      es: "Primeros pasos",
      zh: "入门指南",
      ja: "はじめに",
    },
    deleteStudyPlan: {
      en: "Delete Study Plan",
      th: "ลบแผนการเรียน",
      fa: "حذف برنامه مطالعه",
      ar: "حذف خطة الدراسة",
      es: "Eliminar plan de estudio",
      zh: "删除学习计划",
      ja: "学習プランを削除",
    },
    deleteStudyPlanConfirm: {
      en: "Delete this study plan? All lesson progress will be removed.",
      th: "ลบแผนการเรียนนี้หรือไม่? ความคืบหน้าของบทเรียนทั้งหมดจะถูกลบออก",
      fa: "این برنامه مطالعه حذف شود؟ تمام پیشرفت درس‌ها حذف خواهد شد.",
      ar: "هل تريد حذف خطة الدراسة هذه؟ ستُزال كل تطورات الدروس.",
      es: "¿Eliminar este plan de estudio? Se eliminará todo el progreso de las lecciones.",
      zh: "删除此学习计划？所有课程进度都将被移除。",
      ja: "この学習プランを削除しますか？すべてのレッスン進捗が削除されます。",
    },
    noStudyPlan: {
      en: "No study plan yet.",
      th: "ยังไม่มีแผนการเรียน",
      fa: "هنوز برنامه مطالعه‌ای وجود ندارد.",
      ar: "لا توجد خطة دراسة بعد.",
      es: "Aún no hay plan de estudio.",
      zh: "尚无学习计划。",
      ja: "学習プランはまだありません。",
    },
    lessonStatusComplete: {
      en: "Complete",
      th: "สำเร็จสมบูรณ์",
      fa: "کامل",
      ar: "مكتمل",
      es: "Completado",
      zh: "已完成",
      ja: "完了",
    },
    lessonStatusInProgress: {
      en: "In Progress",
      th: "กำลังดำเนินการ",
      fa: "در حال انجام",
      ar: "قيد التنفيذ",
      es: "En progreso",
      zh: "进行中",
      ja: "進行中",
    },
    lessonStatusSkipped: {
      en: "Skipped",
      th: "ข้ามแล้ว",
      fa: "رد شده",
      ar: "تم التخطي",
      es: "Omitido",
      zh: "已跳过",
      ja: "スキップ済み",
    },
    tierIntroductory: {
      en: "Beginner",
      th: "ผู้เริ่มต้น",
      fa: "مبتدی",
      ar: "مبتدئ",
      es: "Principiante",
      zh: "初学者",
      ja: "初心者",
    },
    tierIntermediate: {
      en: "Intermediate",
      th: "ระดับกลาง",
      fa: "متوسط",
      ar: "متوسط",
      es: "Intermedio",
      zh: "中级",
      ja: "中級",
    },
    tierAdvanced: {
      en: "Advanced",
      th: "ระดับสูง",
      fa: "پیشرفته",
      ar: "متقدم",
      es: "Avanzado",
      zh: "高级",
      ja: "上級",
    },
    tierAlphabet: {
      en: "Alphabet",
      th: "ตัวอักษร",
      fa: "الفبا",
      ar: "الأبجدية",
      es: "Alfabeto",
      zh: "字母",
      ja: "アルファベット",
    },

    lessonsLabel: {
      en: "lessons",
      th: "บทเรียน",
      fa: "درس‌ها",
      ar: "الدروس",
      es: "lecciones",
      zh: "课程",
      ja: "レッスン",
    },
    theme: {
      en: "Theme",
      th: "ธีม",
      fa: "پوسته",
      ar: "السمة",
      es: "Tema",
      zh: "主题",
      ja: "テーマ",
    },
    themeAuto: {
      en: "Auto",
      th: "อัตโนมัติ",
      fa: "خودکار",
      ar: "تلقائي",
      es: "Automático",
      zh: "自动",
      ja: "自動",
    },
    themeLight: {
      en: "Light",
      th: "สว่าง",
      fa: "روشن",
      ar: "فاتح",
      es: "Claro",
      zh: "浅色",
      ja: "ライト",
    },
    themeDark: {
      en: "Dark",
      th: "มืด",
      fa: "تیره",
      ar: "داكن",
      es: "Oscuro",
      zh: "深色",
      ja: "ダーク",
    },
    font: {
      en: "Font",
      th: "แบบอักษร",
      fa: "قلم",
      ar: "الخط",
      es: "Fuente",
      zh: "字体",
      ja: "フォント",
    },
    fontMode: {
      en: "Font mode",
      th: "โหมดแบบอักษร",
      fa: "حالت قلم",
      ar: "وضع الخط",
      es: "Modo de fuente",
      zh: "字体模式",
      ja: "フォントモード",
    },
    fontModern: {
      en: "Modern",
      th: "ทันสมัย",
      fa: "مدرن",
      ar: "حديث",
      es: "Moderna",
      zh: "现代",
      ja: "モダン",
    },
    fontTraditional: {
      en: "Traditional",
      th: "ดั้งเดิม",
      fa: "سنتی",
      ar: "تقليدي",
      es: "Tradicional",
      zh: "传统",
      ja: "トラディショナル",
    },
    flashcards: {
      en: "Flashcards",
      th: "บัตรคำ",
      fa: "فلش‌کارت‌ها",
      ar: "البطاقات",
      es: "Tarjetas",
      zh: "闪卡",
      ja: "フラッシュカード",
    },
    wordFlashcards: {
      en: "Word flashcards",
      th: "บัตรคำศัพท์",
      fa: "فلش‌کارت واژه‌ها",
      ar: "بطاقات الكلمات",
      es: "Tarjetas de palabras",
      zh: "单词闪卡",
      ja: "単語フラッシュカード",
    },
    sentenceFlashcards: {
      en: "Sentence flashcards ",
      th: "บัตรประโยค ",
      fa: "فلش‌کارت جمله‌ها ",
      ar: "بطاقات الجمل ",
      es: "Tarjetas de oraciones ",
      zh: "句子闪卡 ",
      ja: "文フラッシュカード ",
    },
    letterFlashcards: {
      en: "Letter flashcards",
      th: "บัตรตัวอักษร",
      fa: "فلش‌کارت حروف",
      ar: "بطاقات الحروف",
      es: "Tarjetas de letras",
      zh: "字母闪卡",
      ja: "文字フラッシュカード",
    },
    quiz: {
      en: "Quiz",
      th: "แบบทดสอบ",
      fa: "آزمون",
      ar: "اختبار",
      es: "Cuestionario",
      zh: "测验",
      ja: "クイズ",
    },
    wordQuiz: {
      en: "Word quiz",
      th: "แบบทดสอบคำศัพท์",
      fa: "آزمون واژه‌ها",
      ar: "اختبار الكلمات",
      es: "Cuestionario de palabras",
      zh: "单词测验",
      ja: "単語クイズ",
    },
    sentenceQuiz: {
      en: "Sentence quiz ",
      th: "แบบทดสอบประโยค ",
      fa: "آزمون جمله‌ها ",
      ar: "اختبار الجمل ",
      es: "Cuestionario de oraciones ",
      zh: "句子测验 ",
      ja: "文クイズ ",
    },
    letterQuiz: {
      en: "Letter quiz",
      th: "แบบทดสอบตัวอักษร",
      fa: "آزمون حروف",
      ar: "اختبار الحروف",
      es: "Cuestionario de letras",
      zh: "字母测验",
      ja: "文字クイズ",
    },
    letterSpell: {
      en: "Audio spelling",
      th: "การสะกดด้วยเสียง",
      fa: "املای صوتی",
      ar: "التهجئة الصوتية",
      es: "Deletreo de audio",
      zh: "音频拼写",
      ja: "音声スペリング",
    },
    buildSentence: {
      en: "Build a sentence",
      th: "แต่งประโยค",
      fa: "جمله بسازید",
      ar: "كوّن جملة",
      es: "Construye una oración",
      zh: "组句",
      ja: "文を作ろう",
    },
    yourSentence: {
      en: "Your sentence",
      th: "ประโยคของคุณ",
      fa: "جمله شما",
      ar: "جملتك",
      es: "Tu oración",
      zh: "你的句子",
      ja: "あなたの文",
    },
    buildPlaceholder: {
      en: "Tap words below to build your sentence ",
      th: "แตะคำด้านล่างเพื่อแต่งประโยค ",
      fa: "برای ساختن جمله، واژه‌های زیر را لمس کنید ",
      ar: "اضغط على الكلمات أدناه لتكوين جملتك ",
      es: "Toca las palabras de abajo para construir tu oración ",
      zh: "点击下方单词组成你的句子 ",
      ja: "下の単語をタップして文を作りましょう ",
    },
    letterSpellSinglePlaceholder: {
      en: "Tap the letter you hear",
      th: "แตะตัวอักษรที่คุณได้ยิน",
      fa: "حرفی را که می‌شنوید لمس کنید",
      ar: "اضغط على الحرف الذي تسمعه",
      es: "Toca la letra que escuchas",
      zh: "点击你听到的字母",
      ja: "聞こえた文字をタップしよう",
    },
    letterSpellPlaceholder: {
      en: "Tap letters below to build the word",
      th: "แตะตัวอักษรด้านล่างเพื่อสร้างคำ",
      fa: "حروف زیر را برای ساختن کلمه لمس کنید",
      ar: "اضغط على الحروف أدناه لتكوين الكلمة",
      es: "Toca las letras de abajo para formar la palabra",
      zh: "点击下方字母拼出单词",
      ja: "下の文字をタップして単語を作ろう",
    },
    hint: {
      en: "Hint",
      th: "คำใบ้",
      fa: "راهنمایی",
      ar: "تلميح",
      es: "Pista",
      zh: "提示",
      ja: "ヒント",
    },
    buildCorrect: {
      en: "Correct sentence!",
      th: "ประโยคถูกต้อง!",
      fa: "جمله درست است!",
      ar: "جملة صحيحة!",
      es: "¡Oración correcta!",
      zh: "句子正确！",
      ja: "正しい文です！",
    },
    buildIncorrect: {
      en: "Not quite right — try again.",
      th: "ยังไม่ถูกต้อง — ลองอีกครั้ง",
      fa: "کاملاً درست نیست — دوباره تلاش کنید.",
      ar: "ليست صحيحة تمامًا — حاول مرة أخرى.",
      es: "No es correcta — inténtalo de nuevo.",
      zh: "不太对——再试一次。",
      ja: "まだ正しくありません——もう一度。",
    },
    buildFinished: {
      en: "All sentences completed.",
      th: "ครบทุกประโยคแล้ว",
      fa: "همه جمله‌ها کامل شدند.",
      ar: "اكتملت جميع الجمل.",
      es: "Todas las oraciones completadas.",
      zh: "所有句子已完成。",
      ja: "すべての文が完了しました。",
    },
    buildRestart: {
      en: "Restart exercise",
      th: "เริ่มแบบฝึกหัดใหม่",
      fa: "شروع دوباره تمرین",
      ar: "إعادة بدء التمرين",
      es: "Reiniciar ejercicio",
      zh: "重新开始练习",
      ja: "練習を再開",
    },
    buildNoSentences: {
      en: "No sentences are available for this exercise.",
      th: "ไม่มีประโยคสำหรับแบบฝึกหัดนี้",
      fa: "جمله‌ای برای این تمرین موجود نیست.",
      ar: "لا توجد جمل متاحة لهذا التمرين.",
      es: "No hay oraciones disponibles para este ejercicio.",
      zh: "此练习没有可用的句子。",
      ja: "この練習に使える文がありません。",
    },
    words: {
      en: "Words",
      th: "คำศัพท์",
      fa: "واژه‌ها",
      ar: "الكلمات",
      es: "Palabras",
      zh: "单词",
      ja: "単語",
    },
    sentences: {
      en: "Sentences",
      th: "ประโยค",
      fa: "جمله‌ها",
      ar: "الجمل",
      es: "Oraciones",
      zh: "句子",
      ja: "文",
    },
    phoneticNote: {
      en: "Phonetics",
      th: "เสียงอ่าน",
      fa: "آوانگاری",
      ar: "الصوتيات",
      es: "Fonética",
      zh: "注音",
      ja: "音声表記",
    },
    lessonSettings: {
      en: "Lesson settings",
      th: "การตั้งค่าบทเรียน",
      fa: "تنظیمات درس",
      ar: "إعدادات الدرس",
      es: "Ajustes de la lección",
      zh: "课程设置",
      ja: "レッスン設定",
    },
    exerciseSettings: {
      en: "Exercise settings",
      th: "การตั้งค่าแบบฝึกหัด",
      fa: "تنظیمات تمرین",
      ar: "إعدادات التمرين",
      es: "Ajustes del ejercicio",
      zh: "练习设置",
      ja: "練習設定",
    },
    languages: {
      en: "Languages",
      th: "ภาษา",
      fa: "زبان‌ها",
      ar: "اللغات",
      es: "Idiomas",
      zh: "语言",
      ja: "言語",
    },
    selectTargetLanguage: {
      en: "What do you want to learn?",
      th: "คุณต้องการเรียนภาษาอะไร?",
      fa: "چه زبانی می‌خواهید یاد بگیرید؟",
      ar: "ماذا تريد أن تتعلم؟",
      es: "¿Qué quieres aprender?",
      zh: "你想学什么？",
      ja: "何を学びたいですか？",
    },
    selectTargetLanguageIntro: {
      en: "Select a target language to begin your study plan.",
      th: "เลือกภาษาเป้าหมายเพื่อเริ่มแผนการเรียนของคุณ",
      fa: "یک زبان هدف را برای شروع برنامه مطالعه خود انتخاب کنید.",
      ar: "اختر لغة هدف لبدء خطة دراستك.",
      es: "Selecciona un idioma objetivo para comenzar tu plan de estudio.",
      zh: "选择一门目标语言以开始你的学习计划。",
      ja: "学習プランを開始するには、目標言語を選択してください。",
    },
    repeatCount: {
      en: "Repeat count",
      th: "จำนวนครั้งซ้ำ",
      fa: "تعداد تکرار",
      ar: "عدد التكرار",
      es: "Número de repeticiones",
      zh: "重复次数",
      ja: "繰り返し回数",
    },
    speechSpeed: {
      en: "Speech speed",
      th: "ความเร็วเสียง",
      fa: "سرعت گفتار",
      ar: "سرعة النطق",
      es: "Velocidad de voz",
      zh: "语速",
      ja: "読み上げ速度",
    },
    speedNormal: {
      en: "Normal",
      th: "ปกติ",
      fa: "عادی",
      ar: "عادي",
      es: "Normal",
      zh: "正常",
      ja: "普通",
    },
    speedSlow: {
      en: "Slow",
      th: "ช้า",
      fa: "آهسته",
      ar: "بطيء",
      es: "Lenta",
      zh: "慢速",
      ja: "遅い",
    },
    speedSlower: {
      en: "Slower",
      th: "ช้าลง",
      fa: "آهسته‌تر",
      ar: "أبطأ",
      es: "Más lenta",
      zh: "更慢",
      ja: "さらに遅い",
    },
    voices: {
      en: "Voices",
      th: "เสียง",
      fa: "صداها",
      ar: "الأصوات",
      es: "Voces",
      zh: "语音",
      ja: "音声",
    },
    defaultVoice: {
      en: "Default voice",
      th: "เสียงเริ่มต้น",
      fa: "صدای پیش‌فرض",
      ar: "الصوت الافتراضي",
      es: "Voz predeterminada",
      zh: "默认语音",
      ja: "既定の音声",
    },
    resetVoices: {
      en: "Reset voices",
      th: "รีเซ็ตเสียง",
      fa: "بازنشانی صداها",
      ar: "إعادة تعيين الأصوات",
      es: "Restablecer voces",
      zh: "重置语音",
      ja: "音声をリセット",
    },
    play: {
      en: "Play",
      th: "เล่น",
      fa: "پخش",
      ar: "تشغيل",
      es: "Reproducir",
      zh: "播放",
      ja: "再生",
    },
    pause: {
      en: "Pause",
      th: "หยุดชั่วคราว",
      fa: "توقف موقت",
      ar: "إيقاف مؤقت",
      es: "Pausa",
      zh: "暂停",
      ja: "一時停止",
    },
    stop: {
      en: "Stop",
      th: "หยุด",
      fa: "توقف",
      ar: "إيقاف",
      es: "Detener",
      zh: "停止",
      ja: "停止",
    },
    noPlayableMedia: {
      en: "Nothing is available to play.",
      th: "ไม่มีเนื้อหาให้เล่น",
      fa: "موردی برای پخش وجود ندارد.",
      ar: "لا يوجد محتوى للتشغيل.",
      es: "No hay nada disponible para reproducir.",
      zh: "没有可播放的内容。",
      ja: "再生できる項目がありません。",
    },
    noLanguagesSelected: {
      en: "No languages are selected.",
      th: "ยังไม่ได้เลือกภาษา",
      fa: "هیچ زبانی انتخاب نشده است.",
      ar: "لم يتم اختيار أي لغة.",
      es: "No se han seleccionado idiomas.",
      zh: "未选择任何语言。",
      ja: "言語が選択されていません。",
    },
    noItems: {
      en: "No items.",
      th: "ไม่มีรายการ",
      fa: "موردی وجود ندارد.",
      ar: "لا توجد عناصر.",
      es: "No hay elementos.",
      zh: "没有条目。",
      ja: "項目がありません。",
    },
    selectTwoLanguages: {
      en: "Select at least two languages to use this exercise.",
      th: "เลือกอย่างน้อยสองภาษาเพื่อใช้แบบฝึกหัดนี้",
      fa: "برای استفاده از این تمرین حداقل دو زبان انتخاب کنید.",
      ar: "اختر لغتين على الأقل لاستخدام هذا التمرين.",
      es: "Selecciona al menos dos idiomas para usar este ejercicio.",
      zh: "请至少选择两种语言以使用此练习。",
      ja: "この練習を使うには少なくとも2つの言語を選択してください。",
    },
    promptLanguage: {
      en: "Prompt language",
      th: "ภาษาถาม",
      fa: "زبان پرسش",
      ar: "لغة المطالبة",
      es: "Idioma de pregunta",
      zh: "提示语言",
      ja: "プロンプト言語",
    },
    revealLanguages: {
      en: "Reveal languages",
      th: "ภาษาตอบกลับ",
      fa: "زبان‌های پاسخ",
      ar: "لغات الإجابة",
      es: "Idiomas de respuesta",
      zh: "回答语言",
      ja: "回答言語",
    },
    showAnswer: {
      en: "Show answer",
      th: "แสดงคำตอบ",
      fa: "نمایش پاسخ",
      ar: "عرض الإجابة",
      es: "Mostrar respuesta",
      zh: "显示答案",
      ja: "答えを表示",
    },
    again: {
      en: "Again",
      th: "อีกครั้ง",
      fa: "دوباره",
      ar: "مرة أخرى",
      es: "Otra vez",
      zh: "重来",
      ja: "もう一度",
    },
    hard: {
      en: "Hard",
      th: "ยาก",
      fa: "سخت",
      ar: "صعب",
      es: "Difícil",
      zh: "困难",
      ja: "難しい",
    },
    good: {
      en: "Good",
      th: "ดี",
      fa: "خوب",
      ar: "جيد",
      es: "Bien",
      zh: "良好",
      ja: "普通",
    },
    easy: {
      en: "Easy",
      th: "ง่าย",
      fa: "آسان",
      ar: "سهل",
      es: "Fácil",
      zh: "简单",
      ja: "簡単",
    },
    noPromptText: {
      en: "No items have text in the prompt language.",
      th: "ไม่มีรายการใดมีข้อความในภาษาถาม",
      fa: "هیچ موردی متن زبان پرسش ندارد.",
      ar: "لا توجد عناصر تحتوي على نص لغة المطالبة.",
      es: "Ningún elemento tiene texto en el idioma de pregunta.",
      zh: "没有条目包含提示语言的文本。",
      ja: "プロンプト言語にテキストがある項目がありません。",
    },
    noRevealText: {
      en: "No items have text in the selected reveal languages.",
      th: "ไม่มีรายการใดมีข้อความในภาษาตอบกลับที่เลือก",
      fa: "هیچ موردی متن زبان‌های پاسخ انتخاب‌شده ندارد.",
      ar: "لا توجد عناصر تحتوي على نص في لغات الإجابة المحددة.",
      es: "Ningún elemento tiene texto en los idiomas de respuesta seleccionados.",
      zh: "没有条目包含所选回答语言的文本。",
      ja: "選択された回答言語にテキストがある項目がありません。",
    },
    selectRevealLanguage: {
      en: "Select at least one reveal language different from the prompt language.",
      th: "เลือกภาษาตอบกลับอย่างน้อยหนึ่งภาษาที่ไม่ซ้ำกับภาษาถาม",
      fa: "حداقل یک زبان پاسخ متفاوت از زبان پرسش انتخاب کنید.",
      ar: "اختر لغة إجابة واحدة على الأقل مختلفة عن لغة المطالبة.",
      es: "Selecciona al menos un idioma de respuesta diferente del idioma de pregunta.",
      zh: "请至少选择一个与提示语言不同的回答语言。",
      ja: "プロンプト言語と異なる回答言語を少なくとも1つ選択してください。",
    },
    noDueCards: {
      en: "No flashcards are due for this language configuration.",
      th: "ไม่มีบัตรคำที่ครบกำหนดสำหรับการตั้งค่าภาษาครั้งนี้",
      fa: "هیچ فلش‌کارتی برای این پیکربندی زبان سررسید نشده است.",
      ar: "لا توجد بطاقات مستحقة لهذا الإعداد اللغوي.",
      es: "No hay tarjetas vencidas para esta configuración de idioma.",
      zh: "此语言配置下没有到期的闪卡。",
      ja: "この言語設定で期限が来たフラッシュカードはありません。",
    },
    questionLanguage: {
      en: "Question language",
      th: "ภาษาถาม",
      fa: "زبان پرسش",
      ar: "لغة السؤال",
      es: "Idioma de pregunta",
      zh: "问题语言",
      ja: "質問言語",
    },
    answerLanguage: {
      en: "Answer language",
      th: "ภาษาตอบกลับ",
      fa: "زبان پاسخ",
      ar: "لغة الإجابة",
      es: "Idioma de respuesta",
      zh: "答案语言",
      ja: "回答言語",
    },
    selectAnswer: {
      en: "Select answer",
      th: "เลือกคำตอบ",
      fa: "پاسخ را انتخاب کنید",
      ar: "اختر الإجابة",
      es: "Selecciona la respuesta",
      zh: "选择答案",
      ja: "答えを選択",
    },
    quizCorrect: {
      en: "Correct",
      th: "ถูกต้อง",
      fa: "درست",
      ar: "صحيح",
      es: "Correcto",
      zh: "正确",
      ja: "正解",
    },
    quizIncorrect: {
      en: "Incorrect",
      th: "ไม่ถูกต้อง",
      fa: "نادرست",
      ar: "غير صحيح",
      es: "Incorrecto",
      zh: "错误",
      ja: "不正解",
    },
    quizNext: {
      en: "Next",
      th: "ถัดไป",
      fa: "بعدی",
      ar: "التالي",
      es: "Siguiente",
      zh: "下一个",
      ja: "次へ",
    },
    quizFinished: {
      en: "Quiz finished.",
      th: "แบบทดสอบเสร็จสิ้น",
      fa: "آزمون تمام شد.",
      ar: "اكتمل الاختبار.",
      es: "Cuestionario terminado.",
      zh: "测验完成。",
      ja: "クイズが終了しました。",
    },
    quizScore: {
      en: "Score",
      th: "คะแนน",
      fa: "امتیاز",
      ar: "النتيجة",
      es: "Puntuación",
      zh: "得分",
      ja: "スコア",
    },
    examples: {
      en: "Examples",
      th: "ตัวอย่าง",
      fa: "مثال‌ها",
      ar: "أمثلة",
      es: "Ejemplos",
      zh: "示例",
      ja: "例",
    },
    quizRestart: {
      en: "Restart quiz",
      th: "เริ่มแบบทดสอบใหม่",
      fa: "شروع دوباره آزمون",
      ar: "إعادة بدء الاختبار",
      es: "Reiniciar cuestionario",
      zh: "重新开始测验",
      ja: "クイズを再開",
    },

    grammarQuiz: {
      en: "Grammar Quiz",
      th: "แบบทดสอบไวยากรณ์",
      fa: "آزمون گرامر",
      ar: "اختبار القواعد",
      es: "Cuestionario de gramática",
      zh: "语法测验",
      ja: "文法クイズ",
    },

    quizRetry: {
      en: "Retry quiz",
      th: "ลองทำแบบทดสอบใหม่",
      fa: "تلاش دوباره آزمون",
      ar: "إعادة المحاولة",
      es: "Reintentar cuestionario",
      zh: "重试测验",
      ja: "クイズを再挑戦",
    },
    quizSelectAnswerLanguage: {
      en: "Select an answer language different from the question language.",
      th: "เลือกภาษาตอบกลับที่ไม่ซ้ำกับภาษาถาม",
      fa: "یک زبان پاسخ متفاوت از زبان پرسش انتخاب کنید.",
      ar: "اختر لغة إجابة مختلفة عن لغة السؤال.",
      es: "Selecciona un idioma de respuesta diferente del idioma de pregunta.",
      zh: "请选择与问题语言不同的答案语言。",
      ja: "質問言語と異なる回答言語を選択してください。",
    },
    quizNotEnoughOptions: {
      en: "Not enough items have text in the selected answer language.",
      th: "มีรายการที่มีข้อความในภาษาตอบกลับที่เลือกไม่เพียงพอ",
      fa: "موارد کافی با متن در زبان پاسخ انتخاب‌شده وجود ندارد.",
      ar: "لا توجد عناصر كافية تحتوي على نص بلغة الإجابة المحددة.",
      es: "No hay suficientes elementos con texto en el idioma de respuesta seleccionado.",
      zh: "所选答案语言中没有足够包含文本的条目。",
      ja: "選択した回答言語にテキストがある項目が十分ではありません。",
    },
    quizNoQuestions: {
      en: "No questions are available for this language pair.",
      th: "ไม่มีคำถามสำหรับคู่ภาษานี้",
      fa: "هیچ پرسشی برای این جفت زبان موجود نیست.",
      ar: "لا توجد أسئلة متاحة لهذا الزوج اللغوي.",
      es: "No hay preguntas disponibles para este par de idiomas.",
      zh: "此语言对没有可用问题。",
      ja: "この言語ペアには質問がありません。",
    },
    primaryLanguage: {
      en: "Primary language",
      th: "ภาษาหลัก",
      fa: "زبان اصلی",
      ar: "اللغة الأساسية",
      es: "Idioma principal",
      zh: "主要语言",
      ja: "主要言語",
    },
    secondaryLanguage: {
      en: "Secondary language",
      th: "ภาษารอง",
      fa: "زبان ثانویه",
      ar: "اللغة الثانوية",
      es: "Idioma secundario",
      zh: "次要语言",
      ja: "補助言語",
    },
    none: {
      en: "None",
      th: "ไม่มี",
      fa: "هیچ‌کدام",
      ar: "لا شيء",
      es: "Ninguno",
      zh: "无",
      ja: "なし",
    },
    resetProgressPage: {
      en: "Reset Progress",
      th: "รีเซ็ตความคืบหน้า",
      fa: "بازنشانی پیشرفت",
      ar: "إعادة تعيين التقدم",
      es: "Restablecer progreso",
      zh: "重置进度",
      ja: "進捗をリセット",
    },
    resetProgress: {
      en: "Reset all progress",
      th: "รีเซ็ตความคืบหน้าทั้งหมด",
      fa: "بازنشانی همه پیشرفت",
      ar: "إعادة تعيين كل التقدم",
      es: "Restablecer todo el progreso",
      zh: "重置所有进度",
      ja: "すべての進捗をリセット",
    },
    resetFlashcardsConfirm: {
      en: "Reset flashcard progress? All flashcard schedules will be erased.",
      th: "รีเซ็ตความคืบหน้าบัตรคำหรือไม่? กำหนดการบัตรคำทั้งหมดจะถูกลบออก",
      fa: "پیشرفت فلش‌کارت‌ها بازنشانی شود؟ همه زمان‌بندی کارت‌ها حذف خواهد شد.",
      ar: "هل تريد إعادة تعيين تقدم البطاقات؟ سيُمحى كل جدولات البطاقات.",
      es: "¿Restablecer el progreso de tarjetas? Se borrarán todas las programaciones.",
      zh: "重置闪卡进度？所有卡片的学习安排都将被清除。",
      ja: "フラッシュカードの進捗をリセットしますか？すべてのスケジュールが削除されます。",
    },
    resetQuizConfirm: {
      en: "Reset quiz progress? All quiz history will be erased.",
      th: "รีเซ็ตความคืบหน้าแบบทดสอบหรือไม่? ประวัติแบบทดสอบทั้งหมดจะถูกลบออก",
      fa: "پیشرفت آزمون بازنشانی شود؟ همه تاریخچه آزمون‌ها حذف خواهد شد.",
      ar: "هل تريد إعادة تعيين تقدم الاختبارات؟ سيُمحى كل سجل الاختبارات.",
      es: "¿Restablecer el progreso de cuestionarios? Se borrará todo el historial.",
      zh: "重置测验进度？所有测验记录都将被清除。",
      ja: "クイズの進捗をリセットしますか？すべての履歴が削除されます。",
    },
    resetProgressConfirm: {
      en: "Reset all progress? Flashcards, quiz history and lessons tried will be erased.",
      th: "รีเซ็ตความคืบหน้าทั้งหมดหรือไม่? บัตรคำ แบบทดสอบ และบทเรียนที่ลองแล้วจะถูกลบออก",
      fa: "همه پیشرفت بازنشانی شود؟ فلش‌کارت‌ها، تاریخچه آزمون و درس‌های امتحان‌شده حذف خواهد شد.",
      ar: "هل تريد إعادة تعيين كل التقدم؟ سيُمحى تقدم البطاقات والاختبارات والدروس المُجرَّبة.",
      es: "¿Restablecer todo el progreso? Se borrarán tarjetas, historial de cuestionarios y lecciones probadas.",
      zh: "重置所有进度？闪卡、测验记录和已尝试的课程都将被清除。",
      ja: "すべての進捗をリセットしますか？フラッシュカード、クイズ履歴、試したレッスンが削除されます。",
    },

    open: {
      en: "Open",
      th: "เปิด",
      fa: "باز کردن",
      ar: "فتح",
      es: "Abrir",
      zh: "打开",
      ja: "開く",
    },
    focus: {
      en: "Focus",
      th: "เน้น",
      fa: "تمرکز",
      ar: "التركيز",
      es: "Enfoque",
      zh: "重点",
      ja: "フォーカス",
    },
    general: {
      en: "General",
      th: "ทั่วไป",
      fa: "عمومی",
      ar: "عام",
      es: "General",
      zh: "通用",
      ja: "一般",
    },
    lockedTooltip: {
      en: "Complete previous milestones to unlock",
      th: "ทำบทเรียนก่อนหน้าให้เสร็จเพื่อปลดล็อก",
      fa: "برای باز کردن، درس‌های قبلی را کامل کنید",
      ar: "أكمل المعالم السابقة للفتح",
      es: "Completa los hitos anteriores para desbloquear",
      zh: "完成之前的里程碑以解锁",
      ja: "前のマイルストーンを完了してロック解除",
    },
    milestone_M1: {
      en: "Foundations & Greetings",
      th: "พื้นฐานและการทักทาย",
      fa: "مبانی و احوال‌پرسی",
      zh: "基础与问候",
      ja: "基礎と挨拶",
      ar: "الأساسيات والتحيات",
      es: "Fundamentos y saludos",
    },
    milestone_M2: {
      en: "Numbers & Time",
      th: "ตัวเลขและเวลา",
      fa: "اعداد و زمان",
      zh: "数字与时间",
      ja: "数字と時間",
      ar: "الأرقام والوقت",
      es: "Números y tiempo",
    },
    milestone_M3: {
      en: "Survival Needs",
      th: "ความจำเป็นเพื่อการอยู่รอด",
      fa: "نیازهای بقا",
      zh: "生存需求",
      ja: "サバイバルニーズ",
      ar: "احتياجات البقاء",
      es: "Necesidades de supervivencia",
    },
    milestone_M4: {
      en: "Directions & Transport",
      th: "ทิศทางและการขนส่ง",
      fa: "مسیرها و حمل‌ونقل",
      zh: "方向与交通",
      ja: "道案内と交通",
      ar: "الاتجاهات والنقل",
      es: "Direcciones y transporte",
    },
    milestone_M5: {
      en: "Shopping & Money",
      th: "การช้อปปิ้งและเงินตรา",
      fa: "خرید و پول",
      zh: "购物与金钱",
      ja: "買い物とお金",
      ar: "التسوق والمال",
      es: "Compras y dinero",
    },
    milestone_M6: {
      en: "Daily Routines & Hobbies",
      th: "กิจวัตรประจำวันและงานอดิเรก",
      fa: "روتین روزانه و سرگرمی‌ها",
      zh: "日常与爱好",
      ja: "日常生活と趣味",
      ar: "الروتين اليومي والهوايات",
      es: "Rutinas diarias y pasatiempos",
    },
    milestone_M7: {
      en: "Health & Emergencies",
      th: "สุขภาพและเหตุฉุกเฉิน",
      fa: "سلامت و اورژانس",
      zh: "健康与急救",
      ja: "健康と緊急事態",
      ar: "الصحة والطوارئ",
      es: "Salud y emergencias",
    },
    milestone_M8: {
      en: "Work & Business Basics",
      th: "งานและพื้นฐานธุรกิจ",
      fa: "کار و مبانی کسب‌وکار",
      zh: "工作与商业基础",
      ja: "仕事とビジネス基礎",
      ar: "العمل وأساسيات الأعمال",
      es: "Trabajo y conceptos básicos de negocios",
    },
    milestone_M9: {
      en: "Travel & Accommodation",
      th: "การเดินทางและที่พัก",
      fa: "سفر و اقامت",
      zh: "旅行与住宿",
      ja: "旅行と宿泊",
      ar: "السفر والإقامة",
      es: "Viajes y alojamiento",
    },
    milestone_M10: {
      en: "Socializing & Opinions",
      th: "การเข้าสังคมและความคิดเห็น",
      fa: "معاشرت و نظرات",
      zh: "社交与观点",
      ja: "交流と意見",
      ar: "التواصل والآراء",
      es: "Socialización y opiniones",
    },
    milestone_M11: {
      en: "Abstract Concepts & Philosophy",
      th: "แนวคิดนามธรรมและปรัชญา",
      fa: "مفاهیم انتزاعی و فلسفه",
      zh: "抽象概念与哲学",
      ja: "抽象概念と哲学",
      ar: "المفاهيم المجردة والفلسفة",
      es: "Conceptos abstractos y filosofía",
    },
    milestone_M12: {
      en: "Media, News & Technology",
      th: "สื่อ ข่าวสาร และเทคโนโลยี",
      fa: "رسانه، اخبار و فناوری",
      zh: "媒体、新闻与科技",
      ja: "メディア、ニュース、テクノロジー",
      ar: "الإعلام والأخبار والتكنولوجيا",
      es: "Medios, noticias y tecnología",
    },
    milestone_M13: {
      en: "Culture, History & Traditions",
      th: "วัฒนธรรม ประวัติศาสตร์ และประเพณี",
      fa: "فرهنگ، تاریخ و سنت‌ها",
      zh: "文化、历史与传统",
      ja: "文化、歴史、伝統",
      ar: "الثقافة والتاريخ والتقاليد",
      es: "Cultura, historia y tradiciones",
    },
    milestone_M14: {
      en: "Professional Negotiations",
      th: "การเจรจาทางวิชาชีพ",
      fa: "مذاکرات حرفه‌ای",
      zh: "专业谈判",
      ja: "専門的な交渉",
      ar: "المفاوضات المهنية",
      es: "Negociaciones profesionales",
    },
    milestone_M15: {
      en: "Nuance, Humor & Idioms",
      th: "น้ำเสียง อารมณ์ขัน และสำนวน",
      fa: "ظرافت، طنز و اصطلاحات",
      zh: "细微差别、幽默与习语",
      ja: "ニュアンス、ユーモア、慣用句",
      ar: "الفروق الدقيقة والفكر والأمثال",
      es: "Matices, humor y modismos",
    },

    milestone_alphabet: {
      en: "Alphabet",
      th: "ตัวอักษร",
      fa: "الفبا",
      ar: "الأبجدية",
      es: "Alfabeto",
      zh: "字母",
      ja: "アルファベット",
    },
    milestone_consonants_mid: {
      en: "Middle Class Consonants",
      th: "พยัญชนะชั้นกลาง",
      fa: "صامت‌های طبقه وسط",
      ar: "الحروف الساكنة الطبقة الوسطى",
      es: "Consonantes de Clase Media",
      zh: "中辅音",
      ja: "中声子音",
    },
    milestone_consonants_high: {
      en: "High Class Consonants",
      th: "พยัญชนะชั้นสูง",
      fa: "صامت‌های طبقه بالا",
      ar: "الحروف الساكنة الطبقة العليا",
      es: "Consonantes de Clase Alta",
      zh: "高辅音",
      ja: "高声子音",
    },
    milestone_consonants_low: {
      en: "Low Class Consonants",
      th: "พยัญชนะชั้นต่ำ",
      fa: "صامت‌های طبقه پایین",
      ar: "الحروف الساكنة الطبقة السفلى",
      es: "Consonantes de Clase Baja",
      zh: "低辅音",
      ja: "低声子音",
    },
    milestone_vowels: {
      en: "Thai Vowels",
      th: "สระภาษาไทย",
      fa: "واکه‌های تایلندی",
      ar: "حروف العلة التايلاندية",
      es: "Vocales Tailandesas",
      zh: "泰语元音",
      ja: "タイ語母音",
    },

    tag_everyday: {
      en: "everyday",
      th: "ชีวิตประจำวัน",
      fa: "روزمره",
      ar: "يومي",
      es: "cotidiano",
      zh: "日常",
      ja: "日常",
    },
    tag_travel: {
      en: "travel",
      th: "การเดินทาง",
      fa: "سفر",
      ar: "سفر",
      es: "viajes",
      zh: "旅行",
      ja: "旅行",
    },
    tag_business: {
      en: "business",
      th: "ธุรกิจ",
      fa: "کسب‌وکار",
      ar: "أعمال",
      es: "negocios",
      zh: "商务",
      ja: "ビジネス",
    },
    tag_academic: {
      en: "academic",
      th: "วิชาการ",
      fa: "تحصیلی",
      ar: "أكاديمي",
      es: "académico",
      zh: "学术",
      ja: "学術",
    },
    tag_cultural: {
      en: "cultural",
      th: "วัฒนธรรม",
      fa: "فرهنگی",
      ar: "ثقافي",
      es: "cultural",
      zh: "文化",
      ja: "文化",
    },
    lessonLoadError: {
      en: "This lesson could not be loaded. Please try again.",
      th: "ไม่สามารถโหลดบทเรียนนี้ได้ กรุณาลองอีกครั้ง",
      fa: "این درس بارگیری نشد. لطفاً دوباره تلاش کنید.",
      ar: "تعذّر تحميل هذا الدرس. يرجى المحاولة مرة أخرى.",
      es: "No se pudo cargar esta lección. Inténtalo de nuevo.",
      zh: "无法加载此课程。请重试。",
      ja: "このレッスンを読み込めませんでした。もう一度お試しください。",
    },
    tryAgain: {
      en: "Try again",
      th: "ลองอีกครั้ง",
      fa: "تلاش دوباره",
      ar: "إعادة المحاولة",
      es: "Reintentar",
      zh: "重试",
      ja: "再試行",
    },
    resetFlashcards: {
      en: "Reset flashcard progress",
      th: "รีเซ็ตความคืบหน้าบัตรคำ",
      fa: "بازنشانی پیشرفت فلش‌کارت‌ها",
      ar: "إعادة تعيين تقدم البطاقات",
      es: "Restablecer progreso de tarjetas",
      zh: "重置闪卡进度",
      ja: "フラッシュカードの進捗をリセット",
    },
    resetQuiz: {
      en: "Reset quiz progress",
      th: "รีเซ็ตความคืบหน้าแบบทดสอบ",
      fa: "بازنشانی پیشرفت آزمون",
      ar: "إعادة تعيين تقدم الاختبار",
      es: "Restablecer progreso de cuestionario",
      zh: "重置测验进度",
      ja: "クイズの進捗をリセット",
    },
    back: {
      en: "Back",
      th: "กลับ",
      fa: "بازگشت",
      ar: "رجوع",
      es: "Volver",
      zh: "返回",
      ja: "戻る",
    },
    testVoices: {
      en: "Test voices",
      th: "ทดสอบเสียง",
      fa: "آزمایش صداها",
      ar: "اختبار الأصوات",
      es: "Probar voces",
      zh: "测试语音",
      ja: "音声をテスト",
    },
    voiceAvailableStatus: {
      en: "Available",
      th: "พร้อมใช้งาน",
      fa: "در دسترس",
      ar: "متوفر",
      es: "Disponible",
      zh: "可用",
      ja: "利用可能",
    },
    voiceMissingStatus: {
      en: "No voice",
      th: "ไม่มีเสียง",
      fa: "بدون صدا",
      ar: "لا يوجد صوت",
      es: "Sin voz",
      zh: "无语音",
      ja: "音声なし",
    },
    playVoiceTest: {
      en: "Play test messages",
      th: "เล่นข้อความทดสอบ",
      fa: "پخش پیام‌های آزمایشی",
      ar: "تشغيل رسائل الاختبار",
      es: "Reproducir mensajes de prueba",
      zh: "播放测试消息",
      ja: "テストメッセージを再生",
    },
    voiceInstallTitle: {
      en: "Install missing voices",
      th: "ติดตั้งเสียงที่ขาดไป",
      fa: "نصب صداها",
      ar: "تثبيت الأصوات المفقودة",
      es: "Instalar las voces que faltan",
      zh: "安装缺失的语音",
      ja: "不足している音声をインストール",
    },
    voiceInstallIntro: {
      en: "Follow the steps for your device to install the missing voices:",
      th: "ทำตามขั้นตอนสำหรับอุปกรณ์ของคุณเพื่อติดตั้งเสียงที่ขาดไป:",
      fa: "برای نصب صداهای موردياز، مراحل مربوط به دستگاه خود را دنبال کنید:",
      ar: "اتبع الخطوات الخاصة بجهازك لتثبيت الأصوات المفقودة:",
      es: "Sigue los pasos para tu dispositivo para instalar las voces que faltan:",
      zh: "请按照你的设备步骤安装缺失的语音：",
      ja: "お使いのデバイスの手順に従って、不足している音声をインストールしてください：",
    },
    device: {
      en: "Device",
      th: "อุปกรณ์",
      fa: "دستگاه",
      ar: "الجهاز",
      es: "Dispositivo",
      zh: "设备",
      ja: "デバイス",
    },
    recordAndCompare: {
      en: "Record and Compare",
      th: "บันทึกและเปรียบเทียบ",
      fa: "ضبط و مقایسه",
      ar: "تسجيل ومقارنة",
      es: "Grabar y comparar",
      zh: "录音并比较",
      ja: "録音して比較",
    },
    recordAndCompareDesc: {
      en: "Show microphone icons to record your speech",
      th: "แสดงไอคอนไมโครโฟนเพื่อบันทึกเสียงของคุณ",
      fa: "نمایش نماد میکروفون برای ضبط صدای شما",
      ar: "إظهار أيقونات الميكروفون لتسجيل كلامك",
      es: "Mostrar iconos de micrófono para grabar tu voz",
      zh: "显示麦克风图标以录制您的语音",
      ja: "音声を録音するためのマイクアイコンを表示",
    },
    recordMicAriaLabel: {
      en: "Record this text",
      th: "บันทึกข้อความนี้",
      fa: "ضبط این متن",
      ar: "تسجيل هذا النص",
      es: "Grabar este texto",
      zh: "录制此文本",
      ja: "このテキストを録音",
    },
    recordOverlayTitle: {
      en: "Record & Compare",
      th: "บันทึกและเปรียบเทียบ",
      fa: "ضبط و مقایسه",
      ar: "تسجيل ومقارنة",
      es: "Grabar y comparar",
      zh: "录音并比较",
      ja: "録音して比較",
    },
    recordInstruction: {
      en: "Compare your speech. Tap to record.",
      th: "เปรียบเทียบเสียงพูด แตะเพื่อบันทึก",
      fa: "گفتار خود را مقایسه کنید. برای ضبط ضربه بزنید.",
      ar: "قارن كلامك. انقر للتسجيل.",
      es: "Compara tu voz. Toca para grabar.",
      zh: "比较您的语音。点击录音。",
      ja: "音声を比較します。タップして録音。",
    },
    recordBtnStart: {
      en: "Record",
      th: "บันทึก",
      fa: "ضبط",
      ar: "تسجيل",
      es: "Grabar",
      zh: "录音",
      ja: "録音",
    },
    recordBtnStop: {
      en: "Stop recording",
      th: "หยุดบันทึก",
      fa: "توقف ضبط",
      ar: "إيقاف التسجيل",
      es: "Detener grabación",
      zh: "停止录音",
      ja: "録音停止",
    },
    recordBtnPlay: {
      en: "Play and Compare",
      th: "เล่นและเปรียบเทียบ",
      fa: "پخش و مقایسه",
      ar: "تشغيل ومقارنة",
      es: "Reproducir y comparar",
      zh: "播放并比较",
      ja: "再生して比較",
    },
    recordPermissionDenied: {
      en: "Microphone access denied. Please enable it in your browser settings.",
      th: "การเข้าถึงไมโครโฟนถูกปฏิเสธ โปรดเปิดใช้งานในการตั้งค่าเบราว์เซอร์ของคุณ",
      fa: "دسترسی به میکروفون رد شد. لطفاً آن را در تنظیمات مرورگر خود فعال کنید.",
      ar: "تم رفض الوصول إلى الميكروفون. يرجى تمكينه في إعدادات المتصفح.",
      es: "Acceso al micrófono denegado. Por favor, habilítalo en la configuración de tu navegador.",
      zh: "麦克风访问被拒绝。请在浏览器设置中启用它。",
      ja: "マイクへのアクセスが拒否されました。ブラウザの設定で有効にしてください。",
    },
    recordFailed: {
      en: "Recording failed or was silent. Please try again.",
      th: "การบันทึกล้มเหลวหรือไม่มีเสียง กรุณาลองอีกครั้ง",
      fa: "ضبط ناموفق بود یا بی‌صدا بود. لطفاً دوباره تلاش کنید.",
      ar: "فشل التسجيل أو كان صامتًا. يرجى المحاولة مرة أخرى.",
      es: "La grabación falló o fue silenciosa. Por favor, inténtalo de nuevo.",
      zh: "录音失败或无声。请重试。",
      ja: "録音に失敗したか、無音でした。もう一度お試しください。",
    },
  });

  const VOICE_TEST_MESSAGES = Object.freeze({
    en: "{language} is available",
    th: "{language} พร้อมใช้งาน",
    fa: "{language} در دسترس است",
    ar: "{language} متوفرة",
    es: "{language} está disponible",
    zh: "{language}可用",
    ja: "{language}は利用可能です",
  });
  const VOICE_OS_LABELS = Object.freeze([
    ["android", "Android"],
    ["ios", "iOS (iPhone/iPad)"],
    ["macos", "macOS"],
    ["windows", "Windows"],
    ["linux", "Linux"],
  ]);
  const VOICE_OS_INSTRUCTIONS = Object.freeze({
    android: {
      steps: [
        {
          en: "Open the Settings app.",
          th: "เปิดแอปการตั้งค่า",
          fa: "برنامه تنظیمات را باز کنید.",
          ar: "افتح تطبيق الإعدادات.",
          es: "Abre la aplicación Ajustes.",
          zh: "打开“设置”应用。",
          ja: "設定アプリを開きます。",
        },
        {
          en: "Search for “Text-to-speech” and open Text-to-speech output.",
          th: "ค้นหา “การอ่านออกเสียงข้อความ” แล้วเปิด",
          fa: "عبارت «Text-to-speech» را جستجو کنید و «خروجی نوشتار به گفتار» را باز کنید.",
          ar: "ابحث عن “تحويل النص إلى كلام” وافتحه.",
          es: "Busca “Salida de voz” y ábrela.",
          zh: "搜索“文字转语音”并打开该设置。",
          ja: "「テキスト読み上げ」を検索して開きます。",
        },
        {
          en: "In your TTS engine settings (for example Google Speech Services), open “Install voice data” and download the language.",
          th: "ในการตั้งค่าเครื่องมือ TTS (เช่น บริการเสียงพูดของ Google) ให้เปิด “ติดตั้งข้อมูลเสียง” แล้วดาวน์โหลดภาษาที่ต้องการ",
          fa: "در تنظیمات موتور TTS (مثلاً خدمات گفتار گوگل) گزینه «نصب داده صوتی» را باز کنید و زبان موردنظر را دانلود کنید.",
          ar: "في إعدادات محرك TTS (مثل خدمات كلام Google)، افتح “تثبيت بيانات الصوت” وحمّل اللغة.",
          es: "En los ajustes del motor TTS (p. ej., Servicios de voz de Google), abre “Instalar datos de voz” y descarga el idioma.",
          zh: "在 TTS 引擎设置中（例如 Google 语音服务），打开“安装语音数据”并下载所需语言。",
          ja: "TTSエンジン（例：Google音声サービス）の設定で「音声データのインストール」を開き、必要な言語をダウンロードします。",
        },
      ],
    },
    ios: {
      steps: [
        {
          en: "Open the Settings app.",
          th: "เปิดแอปการตั้งค่า",
          fa: "برنامه تنظیمات را باز کنید.",
          ar: "افتح تطبيق الإعدادات.",
          es: "Abre la aplicación Ajustes.",
          zh: "打开“设置”应用。",
          ja: "設定アプリを開きます。",
        },
        {
          en: "Go to Accessibility → Spoken Content.",
          th: "ไปที่ การช่วยการเข้าถึง → เนื้อหาที่อ่านออกเสียง",
          fa: "به دسترسی‌پذیری → محتوای گفتاری بروید.",
          ar: "انتقل إلى إمكانية الوصول → المحتوى المقروء.",
          es: "Ve a Accesibilidad → Contenido leído.",
          zh: "前往“辅助功能”→“朗读内容”。",
          ja: "「アクセシビリティ」→「読み上げコンテンツ」を開きます。",
        },
        {
          en: "Tap Voices, choose the language and download a voice.",
          th: "แตะ เสียง แล้วเลือกภาษาและดาวน์โหลดเสียง",
          fa: "روی صداها بزنید، زبان را انتخاب کنید و یک صدا را دانلود کنید.",
          ar: "اضغط على الأصوات واختر اللغة وحمّل صوتًا.",
          es: "Toca Voces, elige el idioma y descarga una voz.",
          zh: "点按“语音”，选择语言并下载语音。",
          ja: "「声」をタップし、言語を選んで音声をダウンロードします。",
        },
      ],
    },
    macos: {
      steps: [
        {
          en: "Open System Settings.",
          th: "เปิดการตั้งค่าระบบ",
          fa: "تنظیمات سیستم را باز کنید.",
          ar: "افتح إعدادات النظام.",
          es: "Abre Ajustes del Sistema.",
          zh: "打开“系统设置”。",
          ja: "システム設定を開きます。",
        },
        {
          en: "Go to Accessibility → Spoken Content.",
          th: "ไปที่ การช่วยการเข้าถึง → เนื้อหาที่อ่านออกเสียง",
          fa: "به دسترسی‌پذیری → محتوای گفتاری بروید.",
          ar: "انتقل إلى إمكانية الوصول → المحتوى المقروء.",
          es: "Ve a Accesibilidad → Contenido leído.",
          zh: "前往“辅助功能”→“朗读内容”。",
          ja: "「アクセシビリティ」→「読み上げコンテンツ」を開きます。",
        },
        {
          en: "Open the Voice menu, choose the language, and pick a voice marked “Download” to install it.",
          th: "เปิดเมนูเสียง เลือกภาษา แล้วเลือกเสียงที่ระบุว่า “ดาวน์โหลด” เพื่อติดตั้ง",
          fa: "منوی صدا را باز کنید، زبان را انتخاب کنید و صدایی با برچسب «دانلود» را برای نصب انتخاب کنید.",
          ar: "افتح قائمة الصوت واختر اللغة ثم اختر صوتًا عليه علامة “تنزيل” لتثبيته.",
          es: "Abre el menú Voz, elige el idioma y selecciona una voz marcada como “Descargar” para instalarla.",
          zh: "打开“语音”菜单，选择语言，并选择标有“下载”的语音进行安装。",
          ja: "「声」メニューを開き、言語を選び、「ダウンロード」と表示された音声を選択してインストールします。",
        },
      ],
    },
    windows: {
      steps: [
        {
          en: "Open Settings.",
          th: "เปิดการตั้งค่า",
          fa: "تنظیمات را باز کنید.",
          ar: "افتح الإعدادات.",
          es: "Abre Configuración.",
          zh: "打开“设置”。",
          ja: "設定を開きます。",
        },
        {
          en: "Go to Time & language → Speech.",
          th: "ไปที่ เวลาและภาษา → เสียงพูด",
          fa: "به زمان و زبان → گفتار بروید.",
          ar: "انتقل إلى الوقت واللغة → الكلام.",
          es: "Ve a Hora e idioma → Voz.",
          zh: "前往“时间和语言”→“语音”。",
          ja: "「時刻と言語」→「音声」を開きます。",
        },
        {
          en: "Under Manage voices / Add voices, add the language to download its voice.",
          th: "ใต้ จัดการเสียง / เพิ่มเสียง ให้เพิ่มภาษาเพื่อดาวน์โหลดเสียง",
          fa: "در بخش مدیریت صداها / افزودن صداها، زبان موردنظر را اضافه کنید تا صدای آن دانلود شود.",
          ar: "ضمن إدارة الأصوات / إضافة الأصوات، أضف اللغة لتنزيل صوتها.",
          es: "En Administrar voces / Agregar voces, agrega el idioma para descargar su voz.",
          zh: "在“管理语音 / 添加语音”下，添加语言以下载其语音。",
          ja: "「音声の管理 / 音声の追加」で言語を追加し、その音声をダウンロードします。",
        },
      ],
    },
    linux: {
      steps: [
        {
          en: "Open your software manager or terminal.",
          th: "เปิดตัวจัดการซอฟต์แวร์หรือเทอร์มินัล",
          fa: "مدیر نرم‌افزار یا پایانه را باز کنید.",
          ar: "افتح مدير البرامج أو الطرفية.",
          es: "Abre el gestor de software o la terminal.",
          zh: "打开软件管理器或终端。",
          ja: "ソフトウェアマネージャーまたはターミナルを開きます。",
        },
        {
          en: "Install a speech engine with voices for your language (for example espeak-ng).",
          th: "ติดตั้งเครื่องมืออ่านออกเสียงที่มีเสียงสำหรับภาษาของคุณ (เช่น espeak-ng)",
          fa: "یک موتور گفتار همراه با صداهای زبان موردنظر نصب کنید (مثلاً espeak-ng).",
          ar: "ثبّت محرك كلام يحتوي على أصوات للّغة المطلوبة (مثل espeak-ng).",
          es: "Instala un motor de voz con voces para tu idioma (por ejemplo, espeak-ng).",
          zh: "为你的语言安装带语音的语音引擎（例如 espeak-ng）。",
          ja: "対象の言語の音声を含む音声エンジン（例：espeak-ng）をインストールします。",
        },
        {
          en: "Restart the browser so it can use the new speech service.",
          th: "รีสตาร์ทเบราว์เซอร์เพื่อให้ใช้บริการเสียงใหม่ได้",
          fa: "مرورگر را دوباره راه‌اندازی کنید تا از سرویس گفتار جدید استفاده کند.",
          ar: "أعد تشغيل المتصفح ليتمكن من استخدام خدمة الكلام الجديدة.",
          es: "Reinicia el navegador para que pueda usar el nuevo servicio de voz.",
          zh: "重新启动浏览器以使用新的语音服务。",
          ja: "新しい音声サービスを利用できるようにブラウザーを再起動します。",
        },
      ],
    },
  });
  const HELP_SECTIONS = Object.freeze([
    {
      key: "help:first-visit ",
      title: {
        en: "Getting started ",
        th: "เริ่มต้นใช้งาน ",
        fa: "شروع کار ",
        ar: "البدء ",
        es: "Primeros pasos ",
        zh: "入门指南 ",
        ja: "はじめに ",
      },
      items: [
        {
          en: "Open Zabon and land on Home — no setup needed. ",
          th: "เปิด Zabon ขึ้นมาก็เริ่มได้เลย ไม่ต้องตั้งค่า ",
          fa: "زبون را باز کنید و وارد صفحه اصلی شوید — نیازی به تنظیم نیست. ",
          ar: "افتح زبون وستصل إلى الرئيسية — دون أي إعداد. ",
          es: "Abre Zabon y llegarás a Inicio: no se necesita configuración. ",
          zh: "打开 Zabon 即进入首页——无需设置。 ",
          ja: "Zabonを開くとホーム画面からすぐ始められます。設定は不要です。 ",
        },
        {
          en: "Browse by Level: 🌱 Beginner, 🌿 Intermediate, 🌳 Advanced. ",
          th: "เรียกดูตามระดับ: 🌱 ระดับต้น 🌿 ระดับกลาง 🌳 ระดับสูง ",
          fa: "مرور بر اساس سطح: 🌱 مقدماتی، 🌿 متوسط، 🌳 پیشرفته. ",
          ar: "تصفح حسب المستوى: 🌱 مبتدئ، 🌿 متوسط، 🌳 متقدم. ",
          es: "Explora por nivel: 🌱 Principiante, 🌿 Intermedio, 🌳 Avanzado. ",
          zh: "按级别浏览：🌱 初级、🌿 中级、🌳 高级。 ",
          ja: "レベル別に閲覧：🌱 初級、🌿 中級、🌳 上級。 ",
        },
        {
          en: "Tap any unlocked lesson to open it. Locked lessons 🔒 require completing the previous one first. ",
          th: "แตะบทเรียนที่ปลดล็อกแล้วเพื่อเปิด บทเรียนที่ล็อก 🔒 ต้องทำบทก่อนหน้าให้เสร็จก่อน ",
          fa: "روی هر درس باز‌شده بزنید تا باز شود. درس‌های قفل 🔒 نیاز به تکمیل درس قبلی دارند. ",
          ar: "اضغط على أي درس مفتوح لفتحه. الدروس المقفلة 🔒 تتطلب إتمام الدرس السابق أولاً. ",
          es: "Toca cualquier lección desbloqueada para abrirla. Las lecciones bloqueadas 🔒 requieren completar la anterior primero. ",
          zh: "点击任何已解锁的课程即可打开。锁定的课程 🔒 需要先完成前一课。 ",
          ja: "ロック解除されたレッスンをタップして開きます。ロックされたレッスン 🔒 は前のレッスンの完了が必要です。 ",
        },
      ],
    },

    {
      key: "help:cycle ",
      title: {
        en: "The learning cycle ",
        th: "วงจรการเรียนรู้ ",
        fa: "چرخه یادگیری ",
        ar: "دورة التعلم ",
        es: "El ciclo de aprendizaje ",
        zh: "学习循环 ",
        ja: "学習サイクル ",
      },
      items: [
        {
          en: "Open a lesson — read and tap ▶ to listen. ",
          th: "เปิดบทเรียน อ่านแล้วแตะ ▶ เพื่อฟัง ",
          fa: "درس را باز کنید — بخوانید و برای شنیدن ▶ را بزنید. ",
          ar: "افتح الدرس — اقرأ واضغط ▶ للاستماع. ",
          es: "Abre una lección: lee y toca ▶ para escuchar. ",
          zh: "打开课程——阅读并点按 ▶ 收听。 ",
          ja: "レッスンを開き、読んで ▶ をタップして聞きます。 ",
        },
        {
          en: "Practice the exercises: 🃏 flashcards · ❓ quiz · 🧩 build a sentence. ",
          th: "ฝึกแบบฝึกหัด: 🃏 บัตรคำ ❓ แบบทดสอบ 🧩 แต่งประโยค ",
          fa: "تمرین‌ها را انجام دهید: 🃏 فلش‌کارت · ❓ آزمون · 🧩 جمله بسازید. ",
          ar: "تدرب على التمارين: 🃏 بطاقات · ❓ اختبار · 🧩 كوّن جملة. ",
          es: "Practica los ejercicios: 🃏 tarjetas · ❓ cuestionario · 🧩 construye una oración. ",
          zh: "完成练习：🃏 闪卡 · ❓ 测验 · 🧩 组句。 ",
          ja: "演習を練習：🃏 フラッシュカード · ❓ クイズ · 🧩 文を作ろう。 ",
        },
        {
          en: "Reach the mastery target (e.g. 80% quiz accuracy) to auto-complete the lesson and unlock the next one. ",
          th: "ทำคะแนนให้ถึงเป้าหมาย (เช่น แบบทดสอบ 80%) เพื่อจบบทเรียนอัตโนมัติและปลดล็อกบทถัดไป ",
          fa: "به هدف تسلط برسید (مثلاً ۸۰٪ دقت آزمون) تا درس به‌طور خودکار کامل شود و درس بعدی باز شود. ",
          ar: "حقق هدف الإتقان (مثلاً 80% دقة في الاختبار) لإتمام الدرس تلقائيًا وفتح الدرس التالي. ",
          es: "Alcanza el objetivo de dominio (p. ej., 80% de precisión) para completar la lección y desbloquear la siguiente. ",
          zh: "达到掌握目标（如测验正确率 80%）即可自动完成课程并解锁下一课。 ",
          ja: "習得目標（例：クイズ正答率80%）に達すると、レッスンが自動完了し次のレッスンがロック解除されます。 ",
        },
        {
          en: "Or manually check Complete? ✅ in the bottom bar to mark it done. ",
          th: "หรือทำเครื่องหมาย เสร็จแล้ว? ✅ ที่แถบด้านล่างด้วยตนเอง ",
          fa: "یا به‌صورت دستی «کامل شد؟» ✅ را در نوار پایین علامت بزنید. ",
          ar: "أو ضع علامة مكتمل؟ ✅ يدويًا في الشريط السفلي. ",
          es: "O marca manualmente ¿Completado? ✅ en la barra inferior. ",
          zh: "或者在底栏手动勾选'已完成？' ✅。 ",
          ja: "または下部バーの「完了？」✅ を手動でチェックします。 ",
        },
      ],
    },

    {
      key: "help:plan",
      title: {
        en: "Study plan (optional)",
        th: "แผนการเรียน (ไม่บังคับ)",
        fa: "برنامه مطالعه (اختیاری)",
        ar: "خطة الدراسة (اختياري)",
        es: "Plan de estudio (opcional)",
        zh: "学习计划（可选）",
        ja: "学習プラン（任意）",
      },
      items: [
        {
          en: "Menu → Study Plan & Progress → Create Study Plan.",
          th: "เมนู → แผนการเรียนและความคืบหน้า → สร้างแผนการเรียน",
          fa: "منو → برنامه مطالعه و پیشرفت → ساخت برنامه مطالعه.",
          ar: "القائمة ← خطة الدراسة والتقدم ← إنشاء خطة دراسة.",
          es: "Menú → Plan de estudio y progreso → Crear plan de estudio.",
          zh: "菜单 → 学习计划与进度 → 创建学习计划。",
          ja: "メニュー → 学習プランと進捗 → 学習プランを作成。",
        },
        {
          en: "Answer goal & level questions to generate a plan.",
          th: "ตอบคำถามเป้าหมายและระดับเพื่อสร้างแผน",
          fa: "برای ساخت برنامه، به پرسش‌های هدف و سطح پاسخ دهید.",
          ar: "أجب عن أسئلة الهدف والمستوى لإنشاء الخطة.",
          es: "Responde las preguntas de objetivo y nivel para generar un plan.",
          zh: "回答目标与水平问题以生成计划。",
          ja: "目標とレベルの質問に答えるとプランが作成されます。",
        },
        {
          en: "Edit or delete anytime from Progress.",
          th: "แก้ไขหรือลบได้ทุกเมื่อจากหน้าความคืบหน้า",
          fa: "هر زمان از صفحه پیشرفت، ویرایش یا حذف کنید.",
          ar: "يمكنك التعديل أو الحذف في أي وقت من التقدم.",
          es: "Edita o elimina en cualquier momento desde Progreso.",
          zh: "可随时在进度页面编辑或删除。",
          ja: "進捗画面からいつでも編集・削除できます。",
        },
      ],
    },
    {
      key: "help:comfort",
      title: {
        en: "Make yourself comfortable",
        th: "ปรับให้เหมาะกับคุณ",
        fa: "راحت باشید",
        ar: "اجعل التطبيق مريحًا لك",
        es: "Ponte cómodo",
        zh: "个性化设置",
        ja: "快適に使おう",
      },
      items: [
        {
          en: "🌗 Theme · 🔤 Font · 🌐 App language in the menu.",
          th: "🌗 ธีม 🔤 แบบอักษร 🌐 ภาษาของแอป อยู่ในเมนู",
          fa: "🌗 پوسته · 🔤 قلم · 🌐 زبان برنامه در منو.",
          ar: "🌗 السمة · 🔤 الخط · 🌐 لغة التطبيق في القائمة.",
          es: "🌗 Tema · 🔤 Fuente · 🌐 Idioma de la app en el menú.",
          zh: "菜单中可设置 🌗 主题 · 🔤 字体 · 🌐 应用语言。",
          ja: "メニューに 🌗 テーマ · 🔤 フォント · 🌐 アプリ言語があります。",
        },
        {
          en: "⚙ Lesson settings: languages, speed, voices.",
          th: "⚙ การตั้งค่าบทเรียน: ภาษา ความเร็ว เสียง",
          fa: "⚙ تنظیمات درس: زبان‌ها، سرعت، صداها.",
          ar: "⚙ إعدادات الدرس: اللغات والسرعة والأصوات.",
          es: "⚙ Ajustes de la lección: idiomas, velocidad, voces.",
          zh: "⚙ 课程设置：语言、语速、语音。",
          ja: "⚙ レッスン設定：言語、速度、音声。",
        },
        {
          en: "🔊 Test voices if speech is silent.",
          th: "🔊 ทดสอบเสียงหากไม่ได้ยินเสียงพูด",
          fa: "🔊 اگر صدا پخش نمی‌شود، صداها را آزمایش کنید.",
          ar: "🔊 اختبر الأصوات إذا كان النطق صامتًا.",
          es: "🔊 Prueba las voces si no se oye nada.",
          zh: "🔊 如果没有声音，请测试语音。",
          ja: "🔊 音が出ないときは音声をテストしてください。",
        },
      ],
    },
  ]);

  let currentView = "home";
  let manifest = null;
  let registry = null;
  let dataService = null;
  let mediaService = null;
  let srsService = null;
  let flashcardService = null;
  let quizService = null;
  let quizProgressService = null;
  let milestoneService = null;
  let state = null;
  let currentLesson = null;
  let availableVoices = [];
  let openCategories = new Set();
  let openProgressSections = new Set();
  let openLessonSections = new Set();
  let openHelpSections = new Set(["help:first-visit"]);
  let flashcardSession = null;
  let quizSession = null;

  let letterQuizSession = null;
  let letterSpellSession = null;
  let nextUpPreviewId = null;

  let quizSessionSeed = "quiz:default";
  let flashcardConfig = { promptLanguage: "", revealLanguages: [] };
  let flashcardKind = "word";
  let quizConfig = { questionLanguage: "", answerLanguage: "" };
  let quizKind = "word";
  let buildConfig = null;
  let buildSession = null;
  let buildCurrent = null;
  let exerciseSettingsOpen = false;
  let lessonsTried = new Set();
  let playbackSessionCounter = 0;
  let playbackState = {
    status: "idle",
    units: [],
    index: 0,
    repeat: 0,
    session: 0,
    utterance: null,
    timerId: null,
    highlightTimerId: null,
  };
  let programmaticScrollUntil = 0;
  let exerciseHighlightTimerId = null;
  let exerciseUtterance = null;
  let voiceTestOs = "";
  let voiceTestReturn = "back-home";
  let voiceTestPlaying = false;
  let voiceTestQueue = [];
  let voiceTestTimer = null;
  let voiceTestUtterance = null;
  const elements = {};

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }
  function saveJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }
  function cssEscape(value) {
    const raw = String(value ?? "");
    if (window.CSS && typeof window.CSS.escape === "function")
      return window.CSS.escape(raw);
    return raw.replace(/[^a-zA-Z0-9_-]/g, (ch) => `\\${ch}`);
  }
  function normalizeRepeatCount(value) {
    const parsed = Number.parseInt(value, 10);
    if (!Number.isFinite(parsed)) return 1;
    return Math.max(1, parsed);
  }
  function truncateLabel(text, max = 28) {
    const str = String(text ?? "");
    if (str.length <= max) return str;
    return `${str.slice(0, max - 1).trimEnd()}\u2026`;
  }
  function createRegistry(languages) {
    const all = Array.isArray(languages)
      ? languages.filter((l) => l && typeof l.code === "string")
      : [];
    const byCode = new Map(all.map((l) => [l.code, l]));
    return {
      all,
      byCode,
      getLanguage(code) {
        return byCode.get(code) || null;
      },
      has(code) {
        return byCode.has(code);
      },
      allCodes() {
        return all.map((l) => l.code);
      },
      dir(code) {
        return byCode.get(code)?.dir || "ltr";
      },
      bcp47(code) {
        return byCode.get(code)?.bcp47 || code;
      },
      segmentation(code) {
        return byCode.get(code)?.segmentation || "none";
      },
    };
  }
  function languageDisplayName(code) {
    const language = registry.getLanguage(code);
    if (!language) return code;
    const appLang = state?.settings?.appLanguage;
    const names = language.names || {};
    return names[appLang] || names.en || language.label || code;
  }
  function flagEmoji(code) {
    const language = registry.getLanguage(code);
    const bcp47 = language?.bcp47 || "";
    const parts = String(bcp47).split("-");
    const region = parts.length > 1 ? parts[parts.length - 1] : "";
    if (!/^[A-Za-z]{2}$/.test(region)) return "\u{1F310}";
    const up = region.toUpperCase();
    const base = 127462;
    return String.fromCodePoint(
      base + up.charCodeAt(0) - 65,
      base + up.charCodeAt(1) - 65,
    );
  }
  function t(key) {
    const textMap = UI_STRINGS[key];
    if (!textMap) return key;
    const appLang = state?.settings?.appLanguage || "en";
    let text = textMap[appLang] || textMap.en || key;
    if (state?.settings?.targetLanguage) {
      const targetName = languageDisplayName(state.settings.targetLanguage);
      text = text.replace(/{targetLanguage}/g, targetName);
    }
    return text;
  }

  class DataService {
    constructor(content, languageRegistry) {
      this.content = content || { items: [] };
      this.registry = languageRegistry;
      this.itemsById = new Map(
        (this.content.items || [])
          .filter((item) => item && typeof item.id === "string")
          .map((item) => [item.id, item]),
      );
    }
    getAllItems() {
      return Array.isArray(this.content.items)
        ? this.content.items.filter((i) => i && typeof i.id === "string")
        : [];
    }
    getItem(id) {
      return this.itemsById.get(id) || null;
    }
    getItemKind(item) {
      if (item?.kind === "letter") return "letter";
      return item?.kind || (item?.texts ? "sentence" : "word");
    }
    getTextMap(item) {
      return item?.texts || item?.labels || item?.strings || {};
    }
    getText(item, languageCode) {
      const value = this.getTextMap(item)?.[languageCode];
      return typeof value === "string" && value.trim() ? value : "";
    }
    hasText(item, languageCode) {
      return Boolean(this.getText(item, languageCode).trim());
    }
    getLocalizedText(textMap, preferredLanguageCodes) {
      if (!textMap || typeof textMap !== "object") return "";
      for (const code of preferredLanguageCodes || []) {
        const value = textMap[code];
        if (typeof value === "string" && value.trim()) return value;
      }
      return (
        Object.values(textMap).find((v) => typeof v === "string" && v.trim()) ||
        ""
      );
    }
    getExplicitTokens(item, languageCode) {
      return Array.isArray(item?.tokens?.[languageCode])
        ? item.tokens[languageCode]
        : null;
    }
    tokenize(item, languageCode) {
      const fullText = this.getText(item, languageCode);
      const explicit = this.getExplicitTokens(item, languageCode);
      if (explicit) {
        return explicit
          .map((token, index) => {
            let text = typeof token === "string" ? token : token?.text || "";
            if (
              !text &&
              token &&
              typeof token.start === "number" &&
              typeof token.end === "number"
            )
              text = fullText.slice(token.start, token.end);
            return { id: token?.id ?? String(index), text };
          })
          .filter((token) => token.text.trim());
      }
      if (!fullText) return [];
      const strategy = this.registry.segmentation(languageCode);
      if (strategy === "whitespace")
        return fullText
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((text, index) => ({ id: String(index), text }));
      if (strategy === "segmenter") {
        if (
          typeof Intl !== "undefined" &&
          typeof Intl.Segmenter === "function"
        ) {
          try {
            const segmenter = new Intl.Segmenter(
              this.registry.bcp47(languageCode),
              { granularity: "word" },
            );
            return Array.from(segmenter.segment(fullText))
              .map((segment, index) => ({
                id: String(index),
                text: segment.segment,
              }))
              .filter((token) => token.text.trim());
          } catch {}
        }
        return fullText
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map((text, index) => ({ id: String(index), text }));
      }
      return [];
    }
  }

  class MediaService {
    constructor(languageRegistry) {
      this.registry = languageRegistry;
    }
    get supported() {
      return typeof window !== "undefined" && "speechSynthesis" in window;
    }
    getVoices() {
      if (
        !this.supported ||
        typeof window.speechSynthesis.getVoices !== "function"
      )
        return [];
      return window.speechSynthesis.getVoices() || [];
    }
    voicesForLanguage(code) {
      const bcp47 = this.registry.bcp47(code);
      const normalize = (v) =>
        String(v || "")
          .toLowerCase()
          .replace(/_/g, "-");
      const short = normalize(code);
      return this.getVoices().filter(
        (voice) =>
          normalize(voice.lang) === normalize(bcp47) ||
          normalize(voice.lang).startsWith(short),
      );
    }
    findVoice(code) {
      const wantedName = state?.settings?.voices?.[code];
      const matching = this.voicesForLanguage(code);
      if (wantedName) {
        const named =
          matching.find((v) => v.name === wantedName) ||
          this.getVoices().find((v) => v.name === wantedName);
        if (named) return named;
      }
      return matching[0] || null;
    }
    speakText(text, code, { onEnd, onError } = {}) {
      if (!this.supported) return false;
      if (typeof text !== "string" || !text.trim()) return false;
      if (!this.registry.has(code)) return false;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.registry.bcp47(code);
      const preset =
        SPEED_PRESETS[state?.settings?.speechSpeed] || SPEED_PRESETS.normal;
      utterance.rate = preset.rate;
      utterance.pitch = preset.pitch;
      const voice = this.findVoice(code);
      if (voice) utterance.voice = voice;
      if (typeof onEnd === "function") utterance.onend = onEnd;
      if (typeof onError === "function") utterance.onerror = onError;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      return utterance;
    }
    speakImmediate(text, code) {
      this.speakText(text, code);
    }
    stop() {
      if (this.supported) window.speechSynthesis.cancel();
    }
  }

  class SrsService {
    constructor(storageKey) {
      this.storageKey = storageKey;
      this.records = loadJSON(storageKey, {});
      this.intervals = Object.freeze([0, 1, 3, 7, 14, 30, 60]);
      if (
        !this.records ||
        typeof this.records !== "object" ||
        Array.isArray(this.records)
      )
        this.records = {};
    }
    save() {
      saveJSON(this.storageKey, this.records);
    }
    getRecord(cardId) {
      return this.records[cardId] || null;
    }
    isDue(cardId, now = new Date()) {
      const record = this.getRecord(cardId);
      if (!record) return true;
      const dueTime = Date.parse(record.due);
      if (Number.isNaN(dueTime)) return true;
      return dueTime <= now.getTime();
    }
    getDueCards(cards, now = new Date()) {
      return (Array.isArray(cards) ? cards : []).filter((card) =>
        this.isDue(card.cardId, now),
      );
    }
    createRecord(card, now) {
      return {
        cardId: card.cardId,
        itemId: card.itemId,
        itemKind: card.itemKind,
        promptLanguage: card.promptLanguage,
        revealLanguages: [...card.revealLanguages],
        box: 1,
        lapses: 0,
        intervalDays: 0,
        due: now.toISOString(),
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        ratingHistory: [],
      };
    }
    rateCard(card, rating, now = new Date()) {
      const validRatings = new Set(["again", "hard", "good", "easy"]);
      if (!card?.cardId || !validRatings.has(rating)) return null;
      const existing = this.getRecord(card.cardId);
      const record = existing || this.createRecord(card, now);
      const previousBox = Number.isInteger(record.box) ? record.box : 1;
      let nextBox = previousBox;
      if (rating === "again") {
        nextBox = 1;
        record.lapses = (record.lapses || 0) + 1;
      }
      if (rating === "hard") nextBox = Math.max(1, previousBox);
      if (rating === "good") nextBox = previousBox + 1;
      if (rating === "easy") nextBox = previousBox + 2;
      record.box = Math.min(Math.max(nextBox, 1), this.intervals.length);
      record.intervalDays = this.intervals[record.box - 1];
      record.due = new Date(
        now.getTime() + record.intervalDays * 864e5,
      ).toISOString();
      record.updatedAt = now.toISOString();
      if (!Array.isArray(record.ratingHistory)) record.ratingHistory = [];
      record.ratingHistory.push({ rating, at: record.updatedAt });
      this.records[card.cardId] = record;
      this.save();
      return record;
    }
    reset() {
      this.records = {};
      this.save();
    }
  }

  class FlashcardService {
    constructor({ dataService: ds, registry: reg }) {
      this.dataService = ds;
      this.registry = reg;
    }
    buildCardId({ itemKind, itemId, promptLanguage, revealLanguages }) {
      const reveal = [...new Set(revealLanguages)].sort().join("+");
      return [itemKind, itemId, promptLanguage, reveal].join(":");
    }
    buildDeck({ itemIds, promptLanguage, revealLanguages }) {
      const selectedRevealLanguages = [
        ...new Set(
          (revealLanguages || []).filter(
            (code) => this.registry.has(code) && code !== promptLanguage,
          ),
        ),
      ];
      const stats = {
        totalItems: 0,
        withPromptText: 0,
        withRevealText: 0,
        cards: 0,
      };
      const cards = [];
      const result = {
        cards,
        stats,
        promptLanguage,
        revealLanguages: selectedRevealLanguages,
      };
      if (
        !this.registry.has(promptLanguage) ||
        selectedRevealLanguages.length === 0
      )
        return result;
      const sourceItems = Array.isArray(itemIds)
        ? itemIds.map((id) => this.dataService.getItem(id)).filter(Boolean)
        : this.dataService.getAllItems();
      for (const item of sourceItems) {
        stats.totalItems += 1;
        const promptText = this.dataService.getText(item, promptLanguage);
        if (!promptText.trim()) continue;
        stats.withPromptText += 1;
        const validRevealLanguages = selectedRevealLanguages.filter((code) =>
          this.dataService.hasText(item, code),
        );
        if (!validRevealLanguages.length) continue;
        stats.withRevealText += 1;
        const itemKind = this.dataService.getItemKind(item);
        cards.push({
          cardId: this.buildCardId({
            itemKind,
            itemId: item.id,
            promptLanguage,
            revealLanguages: validRevealLanguages,
          }),
          itemId: item.id,
          itemKind,
          promptLanguage,
          revealLanguages: [...validRevealLanguages],
          promptText,
          revealLines: validRevealLanguages.map((code) => ({
            languageCode: code,
            text: this.dataService.getText(item, code),
            dir: this.registry.dir(code),
            bcp47: this.registry.bcp47(code),
          })),
        });
      }
      stats.cards = cards.length;
      return result;
    }
  }

  function normalizePrimaryValue(value) {
    if (typeof value === "string") return value.trim();
    if (Array.isArray(value)) {
      for (const entry of value) {
        const text = normalizePrimaryValue(entry);
        if (text) return text;
      }
      return "";
    }
    if (value && typeof value === "object") {
      const direct = normalizePrimaryValue(
        value.text ?? value.label ?? value.value,
      );
      if (direct) return direct;
      for (const entryValue of Object.values(value)) {
        const text = normalizePrimaryValue(entryValue);
        if (text) return text;
      }
      return "";
    }
    return "";
  }
  function hashString(value) {
    let hash = 2166136261 >>> 0;
    const text = String(value);
    for (let index = 0; index < text.length; index += 1) {
      hash ^= text.charCodeAt(index);
      hash = Math.imul(hash, 16777619) >>> 0;
    }
    return hash >>> 0;
  }
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function next() {
      a = (a + 1831565813) | 0;
      let t2 = Math.imul(a ^ (a >>> 15), 1 | a);
      t2 = (t2 + Math.imul(t2 ^ (t2 >>> 7), 61 | t2)) ^ t2;
      return ((t2 ^ (t2 >>> 14)) >>> 0) / 4294967296;
    };
  }
  function deterministicShuffle(values, seed) {
    const result = [...values];
    const random = mulberry32(hashString(seed));
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }
  function resetQuizSessionSeed() {
    quizSessionSeed = `quiz:${Date.now()}:${Math.random().toString(36).slice(2)}`;
  }

  class QuizService {
    constructor({ dataService: ds, registry: reg }) {
      this.dataService = ds;
      this.registry = reg;
      this.minOptions = 4;
    }
    getPrimaryText(item, languageCode) {
      const map = this.dataService.getTextMap(item);
      return normalizePrimaryValue(map?.[languageCode]);
    }
    hasPrimaryText(item, languageCode) {
      return Boolean(this.getPrimaryText(item, languageCode));
    }
    buildOption(item, languageCode, isCorrect) {
      return {
        itemId: item.id,
        text: this.getPrimaryText(item, languageCode),
        dir: this.registry.dir(languageCode),
        bcp47: this.registry.bcp47(languageCode),
        isCorrect,
      };
    }
    buildSession({ itemIds, questionLanguage, answerLanguage, seed = "" }) {
      const stats = {
        totalItems: 0,
        withQuestionText: 0,
        withAnswerText: 0,
        questions: 0,
      };
      const questions = [];
      const result = {
        questions,
        stats,
        questionLanguage,
        answerLanguage,
        reason: "",
      };
      if (
        !this.registry.has(questionLanguage) ||
        !this.registry.has(answerLanguage) ||
        questionLanguage === answerLanguage
      ) {
        result.reason = "invalidPair";
        return result;
      }
      const sourceItems = Array.isArray(itemIds)
        ? itemIds.map((id) => this.dataService.getItem(id)).filter(Boolean)
        : this.dataService.getAllItems();
      const answerEntries = [];
      for (const item of sourceItems) {
        stats.totalItems += 1;
        const answerText = this.getPrimaryText(item, answerLanguage);
        if (!answerText) continue;
        stats.withAnswerText += 1;
        answerEntries.push({ item, answerText });
      }
      if (answerEntries.length === 0) {
        result.reason = "notEnoughOptions";
        return result;
      }
      for (const entry of answerEntries) {
        const item = entry.item;
        const questionText = this.getPrimaryText(item, questionLanguage);
        if (!questionText) continue;
        stats.withQuestionText += 1;
        const correctOption = this.buildOption(item, answerLanguage, true);
        const candidates = answerEntries.filter((c) => c.item.id !== item.id);
        const shuffledCandidates = deterministicShuffle(
          candidates,
          `${seed}:distractors:${item.id}:${questionLanguage}:${answerLanguage}`,
        );
        const distractors = [];
        const selectedIds = new Set([item.id]);
        const usedTexts = new Set([correctOption.text]);
        for (const candidate of shuffledCandidates) {
          if (distractors.length >= this.minOptions - 1) break;
          if (selectedIds.has(candidate.item.id)) continue;
          const option = this.buildOption(
            candidate.item,
            answerLanguage,
            false,
          );
          if (usedTexts.has(option.text)) continue;
          distractors.push(option);
          selectedIds.add(candidate.item.id);
          usedTexts.add(option.text);
        }
        const options = deterministicShuffle(
          [correctOption, ...distractors],
          `${seed}:options:${item.id}:${questionLanguage}:${answerLanguage}`,
        );
        questions.push({
          questionId: ["quiz", item.id, questionLanguage, answerLanguage].join(
            ":",
          ),
          itemId: item.id,
          itemKind: this.dataService.getItemKind(item),
          questionLanguage,
          answerLanguage,
          questionText,
          questionDir: this.registry.dir(questionLanguage),
          questionBcp47: this.registry.bcp47(questionLanguage),
          answerItemId: item.id,
          answerText: entry.answerText,
          answerDir: this.registry.dir(answerLanguage),
          answerBcp47: this.registry.bcp47(answerLanguage),
          options,
        });
      }
      stats.questions = questions.length;
      if (!questions.length) result.reason = "noQuestions";
      return result;
    }
  }

  class QuizProgressService {
    constructor(storageKey) {
      this.storageKey = storageKey;
      this.records = loadJSON(storageKey, {});
      if (
        !this.records ||
        typeof this.records !== "object" ||
        Array.isArray(this.records)
      )
        this.records = {};
    }
    save() {
      saveJSON(this.storageKey, this.records);
    }
    recordAnswer(
      { itemId, questionLanguage, answerLanguage, correct },
      now = new Date(),
    ) {
      if (!itemId || !questionLanguage || !answerLanguage) return null;
      const recordId = [itemId, questionLanguage, answerLanguage].join(":");
      const existing = this.records[recordId];
      const record = existing || {
        itemId,
        questionLanguage,
        answerLanguage,
        correct: 0,
        incorrect: 0,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      };
      if (correct) record.correct += 1;
      else record.incorrect += 1;
      record.updatedAt = now.toISOString();
      this.records[recordId] = record;
      this.save();
      return record;
    }
    reset() {
      this.records = {};
      this.save();
    }
  }

  class MilestoneService {
    constructor() {
      this.progressKey = STORAGE_KEYS.milestoneProgress;
    }
    getProgress() {
      return loadJSON(this.progressKey, null);
    }
    saveProgress(progress) {
      saveJSON(this.progressKey, progress);
    }

    initializeProgress() {
      const existing = this.getProgress();
      const milestones = manifest?.milestones || [];

      // Merge with existing progress to avoid wiping user data when new milestones are added
      const progress =
        existing && typeof existing === "object" && !Array.isArray(existing)
          ? existing
          : {};
      let needsSave = false;

      milestones.forEach((m, index) => {
        if (!progress[m.id]) {
          progress[m.id] = {
            state: index === 0 ? "UNLOCKED" : "LOCKED",
            completed_via: null,
            completed_at: null,
          };
          needsSave = true;
        }
      });

      // Clean up any milestones that were removed from manifest.json
      for (const key of Object.keys(progress)) {
        if (!milestones.find((m) => m.id === key)) {
          delete progress[key];
          needsSave = true;
        }
      }

      if (needsSave) {
        this.saveProgress(progress);
      }

      return progress;
    }

    getMilestoneState(id) {
      let progress = this.getProgress();
      if (!progress) progress = this.initializeProgress();

      // Defensive auto-heal: If a milestone is somehow missing, inject it immediately
      if (!progress[id]) {
        const milestones = manifest?.milestones || [];
        const index = milestones.findIndex((m) => m.id === id);
        progress[id] = {
          state: index === 0 ? "UNLOCKED" : "LOCKED",
          completed_via: null,
          completed_at: null,
        };
        this.saveProgress(progress);
      }

      const milestone = (manifest?.milestones || []).find((m) => m.id === id);
      if (milestone?.kind === "letter") {
        // Auto-heal: Ensure letter milestones are never locked
        if (progress[id].state === "LOCKED") {
          progress[id].state = "UNLOCKED";
          this.saveProgress(progress);
        }
        return progress[id].state;
      }
      return progress[id].state || "LOCKED";
    }

    setMilestoneComplete(id, isComplete) {
      let progress = this.getProgress();
      if (!progress) progress = this.initializeProgress();
      const milestones = manifest?.milestones || [];
      const currentIndex = milestones.findIndex((m) => m.id === id);
      if (currentIndex === -1) return progress;
      if (isComplete) {
        progress[id] = {
          ...progress[id],
          state: "COMPLETED",
          completed_via: "manual_override",
          completed_at: new Date().toISOString(),
        };
        if (currentIndex + 1 < milestones.length) {
          const nextId = milestones[currentIndex + 1].id;
          if (progress[nextId]?.state === "LOCKED")
            progress[nextId] = {
              state: "UNLOCKED",
              completed_via: null,
              completed_at: null,
            };
        }
      } else {
        progress[id] = {
          ...progress[id],
          state: "IN_PROGRESS",
          completed_via: null,
          completed_at: null,
        };
        for (let i = currentIndex + 1; i < milestones.length; i++) {
          const mid = milestones[i].id;
          const nextMilestone = milestones.find((m) => m.id === mid);
          if (nextMilestone?.kind === "letter") continue; // Skip locking letter milestones
          progress[mid] = {
            state: "LOCKED",
            completed_via: null,
            completed_at: null,
          };
        }
      }
      this.saveProgress(progress);
      return progress;
    }

    evaluateAutoCompletion(id) {
      const milestoneData = (manifest?.milestones || []).find(
        (m) => m.id === id,
      );
      if (!milestoneData) return false;

      const currentState = this.getMilestoneState(id);
      if (currentState === "LOCKED" || currentState === "COMPLETED")
        return false;

      // ── ITEM MASTERY LOGIC ──
      // Calculate progress based on Quiz accuracy for target items.
      const avgScore = getLessonMasteryScore(id);

      const requirements =
        currentLesson && currentLesson.meta.id === id
          ? currentLesson.unlock_requirements || {}
          : milestoneData.unlock_requirements || {};
      const requiredPct = requirements.grammar_quiz_pass_pct || 80;

      // If the overall average score hasn't reached the threshold, do not auto-complete.
      if (avgScore < requiredPct) return false;

      // ── Mark as Completed & Unlock Next ──
      let progress = this.getProgress();
      if (!progress) progress = this.initializeProgress();
      const mProgress = progress[id] || {};

      const milestones = manifest?.milestones || [];
      const currentIndex = milestones.findIndex((m) => m.id === id);

      progress[id] = {
        ...mProgress,
        state: "COMPLETED",
        completed_via: "automated",
        completed_at: new Date().toISOString(),
      };

      if (currentIndex + 1 < milestones.length) {
        const nextId = milestones[currentIndex + 1].id;
        if (progress[nextId]?.state === "LOCKED") {
          progress[nextId] = {
            state: "UNLOCKED",
            completed_via: null,
            completed_at: null,
          };
        }
      }

      this.saveProgress(progress);
      return true;
    }

    markInProgress(id) {
      let progress = this.getProgress();
      if (!progress) progress = this.initializeProgress();
      if (progress[id]?.state === "UNLOCKED") {
        progress[id] = { ...progress[id], state: "IN_PROGRESS" };
        this.saveProgress(progress);
      }
    }
    getNextMilestone() {
      let progress = this.getProgress();
      if (!progress) progress = this.initializeProgress();
      const milestones = manifest?.milestones || [];
      for (const m of milestones) {
        if (progress[m.id]?.state === "IN_PROGRESS") return m.id;
      }
      const unlocked = milestones.filter(
        (m) => progress[m.id]?.state === "UNLOCKED",
      );
      if (unlocked.length === 0) return null;
      const goal = state?.settings?.userGoal;
      const goalTags = goal ? this._getGoalTags(goal) : [];
      if (goalTags.length > 0) {
        unlocked.sort((a, b) => {
          const aTags = a.priority_tags || [];
          const bTags = b.priority_tags || [];
          const aScore = aTags.filter((t) => goalTags.includes(t)).length;
          const bScore = bTags.filter((t) => goalTags.includes(t)).length;
          if (bScore !== aScore) return bScore - aScore;
          const aFirst = goalTags.includes(aTags[0]) ? 1 : 0;
          const bFirst = goalTags.includes(bTags[0]) ? 1 : 0;
          return bFirst - aFirst;
        });
      }
      return unlocked[0].id;
    }
    _getGoalTags(goal) {
      switch (goal) {
        case "survival":
          return ["travel", "everyday"];
        case "social":
          return ["everyday", "cultural"];
        case "professional":
          return ["business", "academic"];
        case "media":
          return ["academic", "cultural"];
        case "cultural":
          return ["cultural", "everyday"];
        default:
          return [];
      }
    }
    hasProgress() {
      const p = this.getProgress();
      return p && typeof p === "object" && Object.keys(p).length > 0;
    }
    reset() {
      try {
        localStorage.removeItem(this.progressKey);
      } catch {}
    }
  }

  function chooseDefaultAppLanguage() {
    const browserCode = (navigator.language || "").toLowerCase().split("-")[0];
    if (registry?.has(browserCode)) return browserCode;
    return registry?.allCodes()[0] || "";
  }
  function normalizeSettings(saved) {
    const s = saved || {};
    return {
      theme: THEME_CYCLE.includes(s.theme) ? s.theme : "auto",
      font: s.font === "traditional" ? "traditional" : "modern",
      appLanguage: registry.has(s.appLanguage)
        ? s.appLanguage
        : chooseDefaultAppLanguage(),
      targetLanguage: registry.has(s.targetLanguage) ? s.targetLanguage : null,
      repeatCount: normalizeRepeatCount(s.repeatCount),
      speechSpeed: ["normal", "slow", "slower"].includes(s.speechSpeed)
        ? s.speechSpeed
        : "normal",
      voices:
        s.voices && typeof s.voices === "object" && !Array.isArray(s.voices)
          ? s.voices
          : {},
      recordAndCompare:
        typeof s.recordAndCompare === "boolean" ? s.recordAndCompare : true,
    };
  }
  function normalizeLessonLanguages(saved, targetLang) {
    if (!targetLang) return [];
    const browserLang = (navigator.language || "").toLowerCase().split("-")[0];
    const bridgeLang =
      registry.has(browserLang) && browserLang !== targetLang
        ? browserLang
        : registry.has("en") && "en" !== targetLang
          ? "en"
          : null;
    const defaults = [targetLang];
    if (bridgeLang) defaults.push(bridgeLang);
    if (Array.isArray(saved)) {
      const filtered = saved.filter((code) => registry.has(code));
      if (filtered.length) return filtered;
    }
    return defaults;
  }
  function saveState() {
    saveJSON(STORAGE_KEYS.settings, state.settings);
    saveJSON(STORAGE_KEYS.lessonLanguages, state.lessonLanguages);
  }
  function resetTargetScopedServices() {
    srsService = new SrsService(STORAGE_KEYS.srs);
    quizProgressService = new QuizProgressService(STORAGE_KEYS.quiz);
    milestoneService = new MilestoneService();
    milestoneService.initializeProgress();
    const savedTried = loadJSON(STORAGE_KEYS.lessonsTried, []);
    lessonsTried = new Set(Array.isArray(savedTried) ? savedTried : []);
    currentLesson = null;
    flashcardSession = null;
    quizSession = null;
    buildSession = null;
    buildCurrent = null;
    exerciseSettingsOpen = false;
    if (typeof resetQuizSessionSeed === "function") resetQuizSessionSeed();
  }
  function setTargetLanguage(code, source = "toolbar") {
    if (!registry.has(code)) return;
    const previousTarget = state.settings.targetLanguage;
    state.settings.targetLanguage = code;
    nextUpPreviewId = null;
    const browserLang = (navigator.language || "").toLowerCase().split("-")[0];
    const bridgeLang =
      registry.has(browserLang) && browserLang !== code
        ? browserLang
        : registry.has("en") && "en" !== code
          ? "en"
          : null;
    const desired = [code];
    if (bridgeLang) desired.push(bridgeLang);
    state.lessonLanguages = desired.filter((c) => registry.has(c));
    saveState();
    if (previousTarget !== code) resetTargetScopedServices();
    renderTargetLanguageControl();
    const onboardingComplete = loadJSON(STORAGE_KEYS.onboardingComplete, false);
    if (!onboardingComplete) {
      renderOnboarding();
      return;
    }
    goHome();
  }
  function applyTheme() {
    document.documentElement.dataset.theme = state.settings.theme;
  }
  function applyFont() {
    document.documentElement.dataset.font = state.settings.font;
  }
  function applyDocumentLanguage() {
    const appLang = state.settings.appLanguage;
    const language = registry.getLanguage(appLang);
    document.documentElement.lang = language?.bcp47 || appLang || "";
    document.documentElement.dir = language?.dir || "ltr";
  }
  function cycleTheme() {
    const index = THEME_CYCLE.indexOf(state.settings.theme);
    state.settings.theme = THEME_CYCLE[(index + 1) % THEME_CYCLE.length];
    saveState();
    applyTheme();
    renderHamburger();
  }
  function cycleFont() {
    state.settings.font =
      state.settings.font === "modern" ? "traditional" : "modern";
    saveState();
    applyFont();
    renderHamburger();
    renderCurrent();
  }
  function setAppLanguage(code) {
    if (!registry.has(code)) return;
    state.settings.appLanguage = code;
    saveState();
    applyDocumentLanguage();
    renderStaticLabels();
    renderHamburger();
    renderTargetLanguageControl();
    if (elements.settingsSheet && !elements.settingsSheet.hidden)
      renderSettings();
    if (
      !state.settings.targetLanguage ||
      !registry.has(state.settings.targetLanguage)
    ) {
      state.settings.targetLanguage = null;
      saveState();
      renderTargetSelect();
      return;
    }
    renderCurrent();
  }
  function selectedLessonLanguages() {
    if (!currentLesson?.meta?.translations) return state.lessonLanguages;
    const available = currentLesson.meta.translations || [];
    if (!available.length) return state.lessonLanguages;
    const filtered = state.lessonLanguages.filter(
      (code) => available.includes(code) && registry.has(code),
    );
    if (filtered.length === 0 && state.lessonLanguages.length > 0)
      return state.lessonLanguages.filter((c) => registry.has(c));
    return filtered;
  }
  function setLessonLanguageEnabled(code, enabled) {
    if (!registry.has(code)) return;
    const set = new Set(state.lessonLanguages);
    if (enabled) set.add(code);
    else set.delete(code);
    state.lessonLanguages = registry.allCodes().filter((c) => set.has(c));
    flashcardSession = null;
    quizSession = null;
    ensureExerciseConfigs();
    saveState();
    stopPlayback();
    renderSettings();
    renderCurrent();
  }
  function preferredAppLanguages() {
    return [state.settings.appLanguage, "en", ...registry.allCodes()].filter(
      Boolean,
    );
  }
  function setVoiceForLanguage(code, name) {
    if (!state.settings.voices) state.settings.voices = {};
    if (name) state.settings.voices[code] = name;
    else delete state.settings.voices[code];
    saveState();
  }
  function refreshVoices() {
    availableVoices = mediaService?.getVoices() || [];
  }
  function markLessonTried(lessonId) {
    if (!lessonId) return;
    if (!lessonsTried.has(lessonId)) {
      lessonsTried.add(lessonId);
      saveJSON(STORAGE_KEYS.lessonsTried, [...lessonsTried]);
    }
  }
  function showView(name) {
    const isViewChange = currentView !== name;
    currentView = name;

    // Only stop playback and clear highlights if we are actually changing views.
    // This prevents dynamic re-renders (like opening a closed section during playback) from killing the audio.
    if (isViewChange) {
      if (name !== "voicetest") stopVoiceTestPlayback();
      stopPlayback();
      clearPlaybackHighlights();
      clearExerciseHighlights();
      if (name !== "lesson") {
        [elements.actionBar, elements.bottomBar].forEach((bar) => {
          if (bar) {
            const existing = bar.querySelector(".complete-toggle");
            if (existing) existing.remove();
            const existingProgress = bar.querySelector(
              ".auto-complete-progress",
            );
            if (existingProgress) existingProgress.remove();
          }
        });
      }
    }

    VIEW_IDS.forEach((id) => {
      const el = elements[`${id}View`];
      if (el) el.hidden = id !== name;
    });
    const isLesson = name === "lesson";
    if (elements.actionBar) elements.actionBar.hidden = !isLesson;
    if (elements.bottomBar) elements.bottomBar.hidden = !isLesson;
  }
  function rerenderCurrentView() {
    if (currentView === "progress") renderProgress();
    else if (currentView === "help") renderHelp();
    else renderHome();
  }
  function renderStaticLabels() {
    document.querySelectorAll("[data-ui-string]").forEach((el) => {
      el.textContent = t(el.dataset.uiString);
    });
    document.querySelectorAll("[data-ui-label]").forEach((el) => {
      el.setAttribute("aria-label", t(el.dataset.uiLabel));
    });
    document.title = t("appTitle");
  }
  function makeEmptyState(text) {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = text;
    return div;
  }
  function createRecordMicButton(item, code, text) {
    const micBtn = document.createElement("button");
    micBtn.type = "button";
    micBtn.className = "record-mic-btn";
    micBtn.dataset.action = "open-record-overlay";
    micBtn.dataset.itemId = item.id;
    micBtn.dataset.lang = code;
    micBtn.dataset.text = text;
    micBtn.setAttribute("aria-label", t("recordMicAriaLabel"));
    micBtn.textContent = "🎙️";
    return micBtn;
  }
  function createTextLine(text, code, extraClasses = [], item = null) {
    if (!registry.has(code)) return null;
    if (typeof text !== "string" || !text.trim()) return null;
    const line = document.createElement("div");
    line.className = "language-line";
    if (extraClasses.length) line.classList.add(...extraClasses);
    line.dir = registry.dir(code);
    line.dataset.action = "speak-text";
    line.dataset.lang = code;
    line.dataset.speakText = text;
    if (item) line.dataset.itemId = item.id;
    const span = document.createElement("span");
    span.className = "language-line__text";
    span.lang = registry.bcp47(code);
    span.textContent = text;
    line.appendChild(span);
    if (item && state.settings.recordAndCompare) {
      line.appendChild(createRecordMicButton(item, code, text));
    }
    return line;
  }
  function createSentenceTextLine(item, text, code, extraClasses = []) {
    if (!registry.has(code)) return null;
    if (typeof text !== "string" || !text.trim()) return null;
    const line = document.createElement("div");
    line.className = "language-line";
    if (extraClasses.length) line.classList.add(...extraClasses);
    line.dir = registry.dir(code);
    line.dataset.action = "speak-text";
    line.dataset.lang = code;
    line.dataset.speakText = text;
    line.dataset.itemId = item.id;
    const span = document.createElement("span");
    span.className = "language-line__text";
    span.lang = registry.bcp47(code);
    const container = document.createElement("span");
    container.className = "sentence-text";
    if (registry.segmentation(code) === "segmenter")
      container.classList.add("sentence-text--compact");
    const tokens = dataService.tokenize(item, code);
    if (tokens.length) {
      tokens.forEach((token) => {
        const tokenEl = document.createElement("span");
        tokenEl.className = "sentence-token";
        tokenEl.dataset.tokenId = String(token.id);
        tokenEl.lang = registry.bcp47(code);
        tokenEl.textContent = token.text;
        container.appendChild(tokenEl);
      });
    } else {
      container.textContent = text;
    }
    span.appendChild(container);
    line.appendChild(span);
    if (state.settings.recordAndCompare) {
      line.appendChild(createRecordMicButton(item, code, text));
    }
    return line;
  }

  function clearExerciseHighlights() {
    if (exerciseHighlightTimerId) {
      clearInterval(exerciseHighlightTimerId);
      exerciseHighlightTimerId = null;
    }
    exerciseUtterance = null;
    document
      .querySelectorAll(".language-line.is-speaking")
      .forEach((el) => el.classList.remove("is-speaking"));
    document
      .querySelectorAll(".quiz-option.is-speaking")
      .forEach((el) => el.classList.remove("is-speaking"));
    document
      .querySelectorAll(".sentence-token.is-highlighted")
      .forEach((el) => el.classList.remove("is-highlighted"));
  }
  function speakLineWithHighlight(lineEl, text, code) {
    clearExerciseHighlights();
    if (!lineEl) {
      mediaService.speakImmediate(text, code);
      return;
    }
    lineEl.classList.add("is-speaking");
    const tokens = Array.from(lineEl.querySelectorAll(".sentence-token"));
    if (tokens.length) {
      let idx = 0;
      const highlightCurrent = () => {
        tokens.forEach((tokenEl) => tokenEl.classList.remove("is-highlighted"));
        if (tokens[idx]) tokens[idx].classList.add("is-highlighted");
        if (idx < tokens.length - 1) idx += 1;
      };
      highlightCurrent();
      if (tokens.length > 1) {
        const preset =
          SPEED_PRESETS[state.settings.speechSpeed] || SPEED_PRESETS.normal;
        const textLength = String(text || "").length;
        const estimated = Math.max(1200, textLength * 90) / (preset.rate || 1);
        const interval = Math.max(180, Math.floor(estimated / tokens.length));
        exerciseHighlightTimerId = setInterval(highlightCurrent, interval);
      }
    }
    const utterance = mediaService.speakText(text, code, {
      onEnd: () => {
        if (exerciseUtterance === utterance) clearExerciseHighlights();
      },
      onError: () => {
        if (exerciseUtterance === utterance) clearExerciseHighlights();
      },
    });
    exerciseUtterance = utterance || null;
    if (!utterance) {
      const delay = Math.max(800, String(text || "").length * 80);
      setTimeout(clearExerciseHighlights, delay);
    }
  }
  function renderCurrent() {
    if (elements.flashcardView && !elements.flashcardView.hidden) {
      renderFlashcards();
      return;
    }
    if (elements.quizView && !elements.quizView.hidden) {
      renderQuiz();
      return;
    }
    if (elements.buildView && !elements.buildView.hidden) {
      renderBuildSentence();
      return;
    }
    if (elements.progressView && !elements.progressView.hidden) {
      renderProgress();
      return;
    }
    if (elements.voicetestView && !elements.voicetestView.hidden) {
      renderVoiceTest();
      return;
    }
    if (elements.helpView && !elements.helpView.hidden) {
      renderHelp();
      return;
    }
    if (elements.lessonView && !elements.lessonView.hidden) {
      renderLesson();
      return;
    }
    if (elements.onboardingView && !elements.onboardingView.hidden) {
      renderOnboarding();
      return;
    }
    renderHome();
  }
  function openHamburger() {
    renderHamburger();
    elements.hamburgerPanel.hidden = false;
    elements.hamburgerBackdrop.hidden = false;
    const toggle = document.querySelector('[data-action="toggle-hamburger"]');
    if (toggle) toggle.setAttribute("aria-expanded", "true");
  }
  function closeHamburger() {
    elements.hamburgerPanel.hidden = true;
    elements.hamburgerBackdrop.hidden = true;
    const toggle = document.querySelector('[data-action="toggle-hamburger"]');
    if (toggle) toggle.setAttribute("aria-expanded", "false");
  }
  function renderHamburger() {
    const theme = state.settings.theme;
    elements.themeIcon.textContent =
      theme === "auto"
        ? "\u{1F317}"
        : theme === "light"
          ? "\u2600\uFE0F"
          : "\u{1F319}";
    const themeName =
      theme === "auto"
        ? t("themeAuto")
        : theme === "light"
          ? t("themeLight")
          : t("themeDark");
    elements.themeLabel.textContent = `${t("theme")}: ${themeName}`;
    const font = state.settings.font;
    elements.fontIcon.textContent =
      font === "modern" ? "\u{1F524}" : "\u{1F4DC}";
    const fontName = font === "modern" ? t("fontModern") : t("fontTraditional");
    elements.fontLabel.textContent = `${t("font")}: ${fontName}`;
    renderAppLanguageControl();
  }
  function renderAppLanguageControl() {
    const container = elements.appLanguageControl;
    if (!container) return;
    container.innerHTML = "";
    const select = document.createElement("select");
    select.className = "select";
    registry.all.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.code;
      option.textContent = `${flagEmoji(language.code)} ${languageDisplayName(language.code)}`;
      select.appendChild(option);
    });
    select.value = state.settings.appLanguage;
    select.addEventListener("change", () => setAppLanguage(select.value));
    container.appendChild(select);
  }
  async function loadManifest() {
    try {
      const response = await fetch("manifest.json", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const rawData = await response.json();
      if (!rawData.zabon) {
        console.warn(
          "Zabon: manifest.json is missing the 'zabon' object. Adding fallback.",
        );
        rawData.zabon = { languages: [] };
      }
      if (!rawData.categories) rawData.categories = [];
      if (!rawData.milestones) rawData.milestones = [];
      if (!rawData.tiers) rawData.tiers = [];
      return rawData;
    } catch (error) {
      console.error("Zabon: unable to load manifest.json.", error);
      return {
        zabon: { languages: [] },
        categories: [],
        milestones: [],
        tiers: [],
      };
    }
  }

  // ── Stage 4: Milestone UI ──
  function renderMilestoneList() {
    const list = document.createElement("div");
    list.className = "category-list";
    const tiers = manifest?.tiers || [];
    const tierLabels = {
      beginner: t("tierIntroductory"),
      intermediate: t("tierIntermediate"),
      advanced: t("tierAdvanced"),
      letters: t("tierAlphabet"),
    };
    const tierIcons = {
      beginner: TIER_ICONS.introductory,
      intermediate: TIER_ICONS.intermediate,
      advanced: TIER_ICONS.advanced,
    };

    for (const tier of tiers) {
      const tierKey = tier.id;
      const openKey = "tier:" + tierKey;
      const isOpen = openCategories.has(openKey);
      const wrap = document.createElement("div");
      wrap.className = "proficiency-tier";
      const header = document.createElement("button");
      header.type = "button";
      header.className = "proficiency-tier__header";
      header.dataset.action = "toggle-tier";
      header.dataset.tierId = tierKey;
      const icon = document.createElement("span");
      icon.className = "proficiency-tier__icon";
      icon.textContent = tierIcons[tierKey] || "🌱";
      const title = document.createElement("span");
      title.className = "proficiency-tier__title";
      title.textContent = tierLabels[tierKey] || tier.label;
      const titleGroup = document.createElement("span");
      titleGroup.className = "proficiency-tier__title-group";
      titleGroup.append(icon, title);
      const milestoneIds = tier.milestones || [];
      const completedCount = milestoneIds.filter(
        (id) => milestoneService.getMilestoneState(id) === "COMPLETED",
      ).length;
      const progress = document.createElement("span");
      progress.className = "proficiency-tier__progress";
      const numFmt = new Intl.NumberFormat(state.settings.appLanguage);
      progress.textContent = `${numFmt.format(completedCount)}/${numFmt.format(milestoneIds.length)}`;

      const chevron = document.createElement("span");
      chevron.className = "category__chevron";
      chevron.textContent = isOpen ? "\u25BE" : "\u25B8";
      header.append(titleGroup, progress, chevron);
      wrap.appendChild(header);
      if (isOpen) {
        const body = document.createElement("div");
        body.className = "proficiency-tier__body";
        for (const mId of milestoneIds) {
          const milestone = (manifest.milestones || []).find(
            (m) => m.id === mId,
          );
          if (!milestone) continue;

          // 🛡️ FIX: Filter out milestones that don't support the active target language
          if (!lessonBelongsToActiveTarget(milestone)) continue;

          const mState = milestoneService.getMilestoneState(mId);

          const card = document.createElement("button");
          card.type = "button";
          card.className = "lesson-card milestone-card";
          if (mState === "LOCKED") {
            card.classList.add("is-locked");
            card.disabled = true;
            card.title = t("lockedTooltip");
          } else if (mState === "IN_PROGRESS") {
            card.classList.add("is-in-progress");
          } else if (mState === "COMPLETED") {
            card.classList.add("is-complete");
          }
          if (mState !== "LOCKED") {
            card.dataset.action = "open-lesson";
          }
          card.dataset.lessonId = mId;
          const statusIcon = document.createElement("span");
          statusIcon.className = "lesson-card__status";
          if (mState === "LOCKED") statusIcon.textContent = "🔒";
          else if (mState === "IN_PROGRESS") statusIcon.textContent = "🟡";
          else if (mState === "COMPLETED") statusIcon.textContent = "✅";
          else statusIcon.textContent = "▶️";
          const titleEl = document.createElement("span");
          titleEl.className = "lesson-card__title";
          const titleKey = `milestone_${milestone.id}`;
          const titleObj = UI_STRINGS[titleKey] || { en: milestone.title };
          titleEl.textContent =
            dataService.getLocalizedText(titleObj, preferredAppLanguages()) ||
            milestone.id;
          card.append(statusIcon, titleEl);
          body.appendChild(card);
        }
        wrap.appendChild(body);
      }
      list.appendChild(wrap);
    }
    return list;
  }

  function renderHome() {
    showView("home");
    const view = elements.homeView;
    view.innerHTML = "";
    if (!IMPLEMENTED_TARGET_LANGUAGES.includes(state.settings.targetLanguage)) {
      const banner = document.createElement("div");
      banner.className = "empty-state";
      banner.style.marginBlockEnd = "1rem";
      banner.style.borderColor = "var(--accent)";
      banner.style.textAlign = "center";
      const langName = languageDisplayName(state.settings.targetLanguage);
      const msg = document.createElement("p");
      msg.style.margin = "0 0 0.5rem 0";
      msg.textContent = `${langName} is not implemented yet. Only Thai is currently available.`;
      banner.appendChild(msg);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "button button--wide";
      btn.dataset.action = "change-target-language";
      btn.textContent = t("selectTargetLanguage");
      banner.appendChild(btn);
      view.appendChild(banner);
    }
    const nextUpCard = renderNextUpCard();
    if (nextUpCard) view.appendChild(nextUpCard);
    const list = renderMilestoneList();
    view.appendChild(list);
  }

  function getSortedLanguages() {
    const langs = manifest?.zabon?.languages || [];
    return [...langs]
      .filter((lang) => lang?.code)
      .sort((a, b) => {
        const nameA = languageDisplayName(a.code).toLowerCase();
        const nameB = languageDisplayName(b.code).toLowerCase();
        return nameA.localeCompare(nameB);
      });
  }
  function renderTargetLanguageControl() {
    const container = elements.targetLanguageControl;
    if (!container) return;
    container.innerHTML = "";
    const select = document.createElement("select");
    select.className = "select";
    select.dataset.control = "target-language";
    select.setAttribute("aria-label", t("selectTargetLanguage"));
    const appLang = state.settings.appLanguage;
    const targetLang = state.settings.targetLanguage;
    const hasValidTarget = Boolean(targetLang && registry.has(targetLang));
    if (!hasValidTarget) {
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = t("selectTargetLanguage");
      placeholder.disabled = true;
      placeholder.selected = true;
      select.appendChild(placeholder);
      select.disabled = true;
    } else {
      select.disabled = false;
    }
    const sortedLanguages = getSortedLanguages();
    sortedLanguages.forEach((lang) => {
      const option = document.createElement("option");
      option.value = lang.code;
      option.textContent = `${flagEmoji(lang.code)} ${languageDisplayName(lang.code)}`;
      select.appendChild(option);
    });
    if (hasValidTarget) select.value = targetLang;
    select.addEventListener("change", () =>
      setTargetLanguage(select.value, "toolbar"),
    );
    container.appendChild(select);
  }
  function renderNextUpCard() {
    let previewId = nextUpPreviewId;
    if (!previewId) {
      const nextMilestoneId = milestoneService
        ? milestoneService.getNextMilestone()
        : null;
      if (nextMilestoneId) previewId = nextMilestoneId;
    }
    if (!previewId) return null;
    const milestone = (manifest?.milestones || []).find(
      (m) => m.id === previewId,
    );
    if (!milestone) return null;
    const card = document.createElement("div");
    card.className = "next-up-card";
    const title = document.createElement("h3");
    title.className = "next-up-card__title";
    const titleKey = `milestone_${milestone.id}`;
    const titleObj = UI_STRINGS[titleKey] || { en: milestone.title };
    title.textContent =
      dataService.getLocalizedText(titleObj, preferredAppLanguages()) ||
      milestone.id;
    card.appendChild(title);

    const metaRow = document.createElement("div");
    metaRow.className = "next-up-card__meta";
    const rawTags = milestone.priority_tags || [];
    const localizedTags = rawTags.map((tag) => {
      const cleanTag = String(tag).trim();
      const tagKey = `tag_${cleanTag}`;
      // Fallback to the raw tag string if the translation key doesn't exist
      const translated = t(tagKey);
      return translated !== tagKey ? translated : cleanTag;
    });
    const tags = localizedTags.join(", ");
    const metaSpan = document.createElement("span");
    metaSpan.className = "next-up-card__level";
    metaSpan.textContent = `${t("focus")}: ${tags || t("general")}`;
    metaRow.appendChild(metaSpan);
    card.appendChild(metaRow);

    const navRow = document.createElement("div");
    navRow.className = "next-up-card__nav";
    const openBtn = document.createElement("button");
    openBtn.type = "button";
    openBtn.className = "button next-up-card__open";
    openBtn.dataset.action = "next-up-continue";
    openBtn.dataset.lessonId = previewId;
    openBtn.textContent = t("open");
    navRow.appendChild(openBtn);
    card.appendChild(navRow);
    return card;
  }
  function handleNextUpSkip(lessonId) {
    nextUpPreviewId = null;
    renderHome();
  }
  function handleEditPlan() {
    renderOnboarding();
  }
  function normalizeOnboardingAnswers(saved) {
    const validGoals = [
      "survival",
      "social",
      "professional",
      "media",
      "cultural",
    ];
    const validLevels = ["beginner", "some", "basic", "advanced"];
    const validUsage = ["conversation", "digital", "media", "formal"];
    return {
      goal: validGoals.includes(saved?.goal) ? saved.goal : "",
      level: validLevels.includes(saved?.level) ? saved.level : "",
      usage: Array.isArray(saved?.usage)
        ? saved.usage.filter((value) => validUsage.includes(value))
        : [],
    };
  }
  function collectOnboardingAnswers() {
    const view = elements.onboardingView;
    if (!view) return normalizeOnboardingAnswers({});
    const goal =
      view.querySelector('input[name="onboarding-goal"]:checked')?.value || "";
    const level =
      view.querySelector('input[name="onboarding-level"]:checked')?.value || "";
    const usage = Array.from(
      view.querySelectorAll('input[name="onboarding-usage"]:checked'),
    ).map((input) => input.value);
    return normalizeOnboardingAnswers({ goal, level, usage });
  }
  function saveCurrentOnboardingAnswers() {
    saveJSON(STORAGE_KEYS.onboardingAnswers, collectOnboardingAnswers());
  }
  function refreshOnboardingGenerateButton() {
    const view = elements.onboardingView;
    if (!view) return;
    const generateButton = view.querySelector('[data-action="generate-plan"]');
    const hint = view.querySelector(".onboarding-hint");
    if (!generateButton) return;
    const answers = collectOnboardingAnswers();
    const disabled = !answers.goal || !answers.level;
    generateButton.disabled = disabled;
    if (hint) hint.hidden = !disabled;
  }
  function renderOnboarding() {
    showView("onboarding");
    const view = elements.onboardingView;
    view.innerHTML = "";
    const saved = loadJSON(STORAGE_KEYS.onboardingAnswers, {});
    const answers = normalizeOnboardingAnswers(saved);
    const stage = document.createElement("div");
    stage.className = "onboarding-stage";
    const title = document.createElement("h2");
    title.className = "onboarding-title";
    title.textContent = t("onboardingTitle");
    stage.appendChild(title);
    const intro = document.createElement("p");
    intro.className = "onboarding-intro";
    intro.textContent = t("onboardingIntro");
    stage.appendChild(intro);
    const goalSection = document.createElement("section");
    goalSection.className = "sheet-section";
    const goalTitle = document.createElement("h3");
    goalTitle.className = "sheet-section__title";
    goalTitle.textContent = t("onboardingGoal");
    goalSection.appendChild(goalTitle);
    const goalOptions = document.createElement("div");
    goalOptions.className = "onboarding-options";
    [
      ["survival", t("onboardingGoalSurvival")],
      ["social", t("onboardingGoalSocial")],
      ["professional", t("onboardingGoalProfessional")],
      ["media", t("onboardingGoalMedia")],
      ["cultural", t("onboardingGoalCultural")],
    ].forEach(([value, label]) => {
      const option = document.createElement("label");
      option.className = "onboarding-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "onboarding-goal";
      input.value = value;
      input.checked = answers.goal === value;
      input.addEventListener("change", () => {
        saveCurrentOnboardingAnswers();
        refreshOnboardingGenerateButton();
      });
      const text = document.createElement("span");
      text.className = "onboarding-option__label";
      text.textContent = label;
      option.append(input, text);
      goalOptions.appendChild(option);
    });
    goalSection.appendChild(goalOptions);
    stage.appendChild(goalSection);
    const levelSection = document.createElement("section");
    levelSection.className = "sheet-section";
    const levelTitle = document.createElement("h3");
    levelTitle.className = "sheet-section__title";
    levelTitle.textContent = t("onboardingLevel");
    levelSection.appendChild(levelTitle);
    const levelOptions = document.createElement("div");
    levelOptions.className = "onboarding-options";
    [
      ["beginner", t("onboardingLevelBeginner")],
      ["some", t("onboardingLevelSome")],
      ["basic", t("onboardingLevelBasic")],
      ["advanced", t("onboardingLevelAdvanced")],
    ].forEach(([value, label]) => {
      const option = document.createElement("label");
      option.className = "onboarding-option";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "onboarding-level";
      input.value = value;
      input.checked = answers.level === value;
      input.addEventListener("change", () => {
        saveCurrentOnboardingAnswers();
        refreshOnboardingGenerateButton();
      });
      const text = document.createElement("span");
      text.className = "onboarding-option__label";
      text.textContent = label;
      option.append(input, text);
      levelOptions.appendChild(option);
    });
    levelSection.appendChild(levelOptions);
    stage.appendChild(levelSection);
    const usageSection = document.createElement("section");
    usageSection.className = "sheet-section";
    const usageTitle = document.createElement("h3");
    usageTitle.className = "sheet-section__title";
    usageTitle.textContent = t("onboardingUsage");
    usageSection.appendChild(usageTitle);
    const usageOptions = document.createElement("div");
    usageOptions.className = "onboarding-options";
    [
      ["conversation", t("onboardingUsageConversation")],
      ["digital", t("onboardingUsageDigital")],
      ["media", t("onboardingUsageMedia")],
      ["formal", t("onboardingUsageFormal")],
    ].forEach(([value, label]) => {
      const option = document.createElement("label");
      option.className = "onboarding-option";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "onboarding-usage";
      input.value = value;
      input.checked = answers.usage.includes(value);
      input.addEventListener("change", () => {
        saveCurrentOnboardingAnswers();
        refreshOnboardingGenerateButton();
      });
      const text = document.createElement("span");
      text.className = "onboarding-option__label";
      text.textContent = label;
      option.append(input, text);
      usageOptions.appendChild(option);
    });
    usageSection.appendChild(usageOptions);
    stage.appendChild(usageSection);
    const actions = document.createElement("div");
    actions.className = "onboarding-actions";
    const generateButton = document.createElement("button");
    generateButton.type = "button";
    generateButton.className = "button button--wide";
    generateButton.dataset.action = "generate-plan";
    generateButton.textContent = t("generateStudyPlan");
    const skipButton = document.createElement("button");
    skipButton.type = "button";
    skipButton.className = "button button--wide";
    skipButton.dataset.action = "skip-onboarding";
    skipButton.textContent = t("skipOnboarding");
    actions.append(generateButton, skipButton);
    stage.appendChild(actions);
    const hint = document.createElement("p");
    hint.className = "onboarding-hint";
    hint.textContent = t("onboardingGenerateHint");
    stage.appendChild(hint);
    view.appendChild(stage);
    refreshOnboardingGenerateButton();
  }
  function generateStudyPlan() {
    const answers = collectOnboardingAnswers();
    if (!answers.goal || !answers.level) return;
    saveJSON(STORAGE_KEYS.onboardingAnswers, answers);
    state.settings.userGoal = answers.goal;
    saveState();
    if (milestoneService) milestoneService.initializeProgress();
    saveJSON(STORAGE_KEYS.onboardingComplete, true);
    renderHome();
  }
  function skipOnboarding() {
    saveCurrentOnboardingAnswers();
    saveJSON(STORAGE_KEYS.onboardingComplete, true);
    renderHome();
  }
  function goHome() {
    renderHome();
  }
  function lessonBelongsToActiveTarget(lesson) {
    const target = state?.settings?.targetLanguage;
    if (!target) return false;
    const targets = lesson.targets || [];
    if (!targets.length) return true;
    return targets.includes(target);
  }
  function statusToIcon(status) {
    if (status === "complete") return "\u2705";
    if (status === "skipped") return "\u23ED";
    return "\u25B6";
  }
  function toggleCategory(id) {
    if (openCategories.has(id)) openCategories.delete(id);
    else openCategories.add(id);
    rerenderCurrentView();
  }
  function toggleTier(tierId) {
    const key = "tier:" + tierId;
    if (openCategories.has(key)) openCategories.delete(key);
    else openCategories.add(key);
    rerenderCurrentView();
  }
  function toggleProgressSection(key) {
    if (openProgressSections.has(key)) openProgressSections.delete(key);
    else openProgressSections.add(key);
    rerenderCurrentView();
  }
  function toggleLessonSection(sectionKey) {
    if (openLessonSections.has(sectionKey))
      openLessonSections.delete(sectionKey);
    else openLessonSections.add(sectionKey);
    renderLesson();
  }
  function handleDeletePlan() {
    if (!milestoneService) return;
    if (!window.confirm(t("deleteStudyPlanConfirm"))) return;
    milestoneService.reset();
    renderHome();
  }
  function findLessonMeta(lessonId) {
    for (const category of manifest.categories || []) {
      for (const lesson of category.lessons || [])
        if (lesson.id === lessonId) return lesson;
    }
    return null;
  }
  async function loadLessonFile(path) {
    try {
      const response = await fetch(path, { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error("Zabon: unable to load lesson file", path, error);
      return { items: [], failed: true };
    }
  }
  async function openLesson(lessonId) {
    let lessonMeta = findLessonMeta(lessonId);
    if (!lessonMeta) {
      const milestone = (manifest?.milestones || []).find(
        (m) => m.id === lessonId,
      );
      if (milestone) {
        const titleKey = `milestone_${milestone.id}`;
        const localizedTitle = UI_STRINGS[titleKey] || { en: milestone.title };
        lessonMeta = {
          id: milestone.id,
          title: localizedTitle,
          proficiency: milestone.tier,
          kind: milestone.kind || "word",
          file: milestone.file,
        };
      } else {
        return;
      }
    }
    markLessonTried(lessonMeta.id);
    let content = { items: [], failed: false };
    if (lessonMeta.file) {
      const targetLang = state.settings.targetLanguage || "en";
      const parts = lessonMeta.file.split("/");
      const filename = parts.pop(); // e.g., "M1.json"

      let commonData = { items: [] };
      let langData = { items: [] };
      let commonFailed = true;
      let langFailed = true;

      // 🧠 ARCHITECTURE FIX: Alphabet data is strictly language-specific.
      // Skip the 'common' fetch entirely for kind="letter" to avoid 404s.
      if (lessonMeta.kind === "letter") {
        // Add a cache-buster to ensure we always fetch the correct language data
        const langPath = `milestones/${targetLang}/${filename}?t=${Date.now()}`;
        langData = await loadLessonFile(langPath);
        langFailed = langData.failed || !langData.items;
      } else {
        // 1. Fetch the Language-Agnostic Common Data (Vocab & Sentences)
        const commonPath = `milestones/common/${filename}`;
        commonData = await loadLessonFile(commonPath);
        // 2. Fetch the Target Language Specific Data (Grammar & Quizzes)
        const langPath = `milestones/${targetLang}/${filename}`;
        langData = await loadLessonFile(langPath);

        commonFailed = commonData.failed || !commonData.items;
        langFailed = langData.failed || !langData.items;
      }

      // 3. Assemble / Merge the Data
      if (commonFailed && langFailed) {
        content = { items: [], failed: true };
      } else {
        const commonItems = Array.isArray(commonData.items)
          ? commonData.items
          : [];
        const langItems = Array.isArray(langData.items) ? langData.items : [];
        content = {
          milestone_id: commonData.milestone_id || langData.milestone_id,
          displayMode:
            commonData.displayMode || langData.displayMode || "default",
          unlock_requirements:
            commonData.unlock_requirements ||
            langData.unlock_requirements ||
            {},
          cultural_context: commonData.cultural_context || {},
          items: [...commonItems, ...langItems],
          grammar_questions: Array.isArray(langData.grammar_questions)
            ? langData.grammar_questions
            : [],
          failed: false,
        };
      }
    }

    currentLesson = {
      meta: lessonMeta,
      items: Array.isArray(content.items) ? content.items : [],
      grammar_questions: Array.isArray(content.grammar_questions)
        ? content.grammar_questions
        : [],
      unlock_requirements: content.unlock_requirements || {},
      cultural_context: content.cultural_context || {}, // 🛠️ Re-capture for the collapsible panel
      failed: Boolean(content.failed),
    };

    dataService = new DataService({ items: currentLesson.items }, registry);
    flashcardService = new FlashcardService({ dataService, registry });
    quizService = new QuizService({ dataService, registry });
    flashcardSession = null;
    quizSession = null;
    buildSession = null;
    buildCurrent = null;
    openLessonSections.clear();
    resetQuizSessionSeed();
    ensureExerciseConfigs();
    renderLesson();
  }

  function ensureExerciseConfigs() {
    const langs = selectedLessonLanguages();
    const appLang = state.settings.appLanguage;
    const targetLang = state.settings.targetLanguage;

    // Only set defaults if the current selection is invalid/missing
    if (!langs.includes(flashcardConfig.promptLanguage)) {
      flashcardConfig.promptLanguage = langs.includes(targetLang)
        ? targetLang
        : langs[0] || "";
    }
    const isLetterLesson = currentLesson?.meta?.kind === "letter";
    flashcardConfig.revealLanguages = flashcardConfig.revealLanguages.filter(
      (code) => langs.includes(code) && code !== flashcardConfig.promptLanguage,
    );
    // Only force a reveal language if it's NOT a letter lesson
    if (flashcardConfig.revealLanguages.length === 0 && !isLetterLesson) {
      const reveal =
        langs.find(
          (c) => c !== flashcardConfig.promptLanguage && c === appLang,
        ) || langs.find((c) => c !== flashcardConfig.promptLanguage);
      if (reveal) flashcardConfig.revealLanguages = [reveal];
    }
    if (!langs.includes(quizConfig.questionLanguage)) {
      quizConfig.questionLanguage = langs.includes(targetLang)
        ? targetLang
        : langs[0] || "";
    }
    if (
      !langs.includes(quizConfig.answerLanguage) ||
      quizConfig.answerLanguage === quizConfig.questionLanguage
    ) {
      quizConfig.answerLanguage =
        langs.find((c) => c !== quizConfig.questionLanguage && c === appLang) ||
        langs.find((c) => c !== quizConfig.questionLanguage) ||
        "";
    }
  }

  function getLessonMasteryScore(lessonId) {
    // We can only calculate this if the lesson is currently loaded in memory
    if (!currentLesson || currentLesson.meta.id !== lessonId) return 0;

    const targetItems = currentLesson.items.filter((i) => i.role === "target");
    if (targetItems.length === 0) return 100; // No targets = complete

    let masteredCount = 0;
    const quizRecords = quizProgressService?.records || {};

    for (const item of targetItems) {
      let itemCorrect = 0;
      let itemTotal = 0;

      // 🛡️ FIX: Correctly match the itemId prefix in the quiz records
      for (const key in quizRecords) {
        if (key.startsWith(item.id + ":")) {
          const rec = quizRecords[key];
          itemCorrect += rec.correct || 0;
          itemTotal += (rec.correct || 0) + (rec.incorrect || 0);
        }
      }

      // 🎯 MASTERY CONDITION:
      // The user must have answered at least once, and achieved >= 75% accuracy.
      // This prevents a single lucky guess from marking it complete,
      // but rewards consistent correct answers immediately.
      if (itemTotal > 0 && itemCorrect > 0 && itemCorrect / itemTotal >= 0.75) {
        masteredCount++;
      }
    }

    return Math.round((masteredCount / targetItems.length) * 100);
  }

  function getMilestoneProgressText(milestoneId) {
    const score = getLessonAverageScore(milestoneId);

    // Fetch the required threshold (default 80%)
    const milestoneData = (manifest?.milestones || []).find(
      (m) => m.id === milestoneId,
    );
    const requirements =
      currentLesson && currentLesson.meta.id === milestoneId
        ? currentLesson.unlock_requirements || {}
        : milestoneData?.unlock_requirements || {};
    const requiredPct = requirements.grammar_quiz_pass_pct || 80;

    // Dynamic Microcopy based on threshold
    if (score >= requiredPct) {
      return `${score}% ✅`; // Goal Met
    } else {
      return `${score}% → ${requiredPct}%`; // Progressing toward goal
    }
  }

  function renderCompleteToggle() {
    // Clean up any previously injected elements
    [elements.actionBar, elements.bottomBar].forEach((bar) => {
      if (bar) {
        const existing = bar.querySelector(".complete-toggle");
        if (existing) existing.remove();
        const existingProgress = bar.querySelector(".auto-complete-progress");
        if (existingProgress) existingProgress.remove();
      }
    });

    if (!currentLesson) return;
    const lessonId = currentLesson.meta.id;
    const isComplete = milestoneService
      ? milestoneService.getMilestoneState(lessonId) === "COMPLETED"
      : false;

    const currentScore = getLessonMasteryScore(lessonId);
    const requiredPct =
      currentLesson?.unlock_requirements?.grammar_quiz_pass_pct || 80;
    const goalMet = currentScore >= requiredPct;

    // ── 1. Action Bar (Row 1): PROGRESS REMOVED ──
    // We no longer inject the progress pill here to save mobile space.
    // The 3 exercise buttons (Flashcards, Spell, Quiz) now have full width.

    // ── 2. Bottom Bar (Row 2): COMBINED PROGRESS & COMPLETE TOGGLE ──
    if (elements.bottomBar) {
      const label = document.createElement("label");
      label.className = "complete-toggle";

      // Add state classes for CSS styling
      if (isComplete || goalMet) {
        label.classList.add("is-complete");
      } else {
        label.classList.add("is-progress");
      }

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = isComplete;
      checkbox.addEventListener("change", () => {
        if (milestoneService) {
          milestoneService.setMilestoneComplete(lessonId, checkbox.checked);
          renderLesson();
        }
      });

      const text = document.createElement("span");
      text.className = "complete-toggle__label";

      // 🎯 DYNAMIC LABEL LOGIC
      if (isComplete || goalMet) {
        // Show localized "Complete?" (e.g., "Complete?", "完了？", "เสร็จแล้ว?")
        text.textContent = t("completeQuestion");
      } else {
        // Show compact progress e.g., "25→80%"
        text.textContent = `${currentScore}→${requiredPct}%`;
      }

      label.append(checkbox, text);

      const settingsBtn = elements.bottomBar.querySelector(
        '[data-action="open-settings"]',
      );
      if (settingsBtn) {
        elements.bottomBar.insertBefore(label, settingsBtn);
      } else {
        elements.bottomBar.appendChild(label);
      }
    }
  }

  function renderLesson() {
    showView("lesson");
    const view = elements.lessonView;
    view.innerHTML = "";

    const header = document.createElement("div");
    header.className = "document-header";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "button";
    back.dataset.action = "back-home";
    back.textContent = "\u2190";
    back.setAttribute("aria-label", t("back"));

    const title = document.createElement("h2");
    title.className = "document-title";
    // Title is already localized via openLesson -> UI_STRINGS mapping
    title.textContent =
      dataService.getLocalizedText(
        currentLesson.meta.title,
        preferredAppLanguages(),
      ) || currentLesson.meta.id;

    header.append(back, title);

    // ── 1. Render Cultural Context Toggle (💡 Icon) ──
    const culturalText = dataService.getLocalizedText(
      currentLesson.cultural_context || {},
      preferredAppLanguages(),
    );

    if (culturalText) {
      const cultureBtn = document.createElement("button");
      cultureBtn.type = "button";
      cultureBtn.className = "icon-button culture-toggle-btn";
      cultureBtn.dataset.action = "toggle-cultural-context";
      cultureBtn.textContent = "💡";
      cultureBtn.setAttribute(
        "aria-label",
        t("culturalNote") || "Cultural Note",
      );
      cultureBtn.title = t("culturalNote") || "Cultural Note";

      const isCultureOpen = openLessonSections.has("lesson:cultural-context");
      if (isCultureOpen) cultureBtn.classList.add("is-active");

      header.appendChild(cultureBtn);
    }

    // ── 1.5 Render Grammar Quiz Trigger (📝 Icon) ──
    // This is a Milestone-level assessment (for unlocking), distinct from the Sentence Quiz.
    if (
      currentLesson.grammar_questions &&
      currentLesson.grammar_questions.length > 0
    ) {
      const gqBtn = document.createElement("button");
      gqBtn.type = "button";
      gqBtn.className = "icon-button grammar-quiz-toggle-btn";
      gqBtn.dataset.action = "open-grammar-quiz";
      gqBtn.textContent = "📝"; // Or use "🧠" to differentiate from Sentence Quiz
      gqBtn.setAttribute("aria-label", t("grammarQuiz"));
      gqBtn.title = t("grammarQuiz");
      header.appendChild(gqBtn);
    }

    view.appendChild(header);

    // ── 2. Render Collapsible Cultural Context Panel ──
    if (culturalText) {
      const culturePanel = document.createElement("div");
      culturePanel.className = "cultural-context-panel";
      const isCultureOpen = openLessonSections.has("lesson:cultural-context");
      culturePanel.hidden = !isCultureOpen;

      const cultureTextEl = document.createElement("p");
      cultureTextEl.className = "cultural-context-panel__text";
      cultureTextEl.textContent = culturalText;
      culturePanel.appendChild(cultureTextEl);

      view.appendChild(culturePanel);
    }

    // ── 3. Handle Load Failure ──
    if (currentLesson.failed) {
      view.appendChild(makeEmptyState(t("lessonLoadError")));
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "button button--wide";
      retry.dataset.action = "retry-lesson";
      retry.textContent = t("tryAgain");
      view.appendChild(retry);
      return;
    }

    // ── 4. Render Lesson Sections (Vocab, Sentences, Grammar Notes) ──
    const langs = selectedLessonLanguages();
    if (!langs.length) {
      view.appendChild(makeEmptyState(t("noLanguagesSelected")));
      return;
    }

    const items = currentLesson.items;
    const sections = [];
    let currentSection = { header: null, items: [] };

    for (const item of items) {
      if (item.header) {
        if (currentSection.items.length > 0) {
          sections.push(currentSection);
          currentSection = { header: item, items: [] };
        } else {
          currentSection.header = item;
        }
      } else {
        currentSection.items.push(item);
      }
    }
    if (currentSection.items.length > 0) sections.push(currentSection);

    const isLetterLesson = currentLesson?.meta?.kind === "letter";

    sections.forEach((section, index) => {
      const sectionKey = section.header
        ? `lesson:section:${section.header.id}`
        : `lesson:section:fallback:${index}`;
      const titleText = section.header
        ? dataService.getLocalizedText(
            section.header.texts,
            preferredAppLanguages(),
          ) || section.header.id
        : isLetterLesson
          ? t("letterFlashcards")
          : t("sentences");

      // Bypass the collapsible wrapper for letter lessons without a specific header
      // so the alphabet letters display immediately on the initial view.
      if (isLetterLesson && !section.header) {
        const sectionEl = document.createElement("section");
        sectionEl.className = "lesson-section";

        const body = document.createElement("div");
        body.className = "lesson-section__body";

        if (!section.items.length) {
          body.appendChild(makeEmptyState(t("noItems")));
        } else {
          const row = document.createElement("div");
          row.className = "item-row";
          row.dir = registry.dir(state.settings.appLanguage);
          section.items.forEach((item) =>
            row.appendChild(renderItemColumn(item, langs)),
          );
          body.appendChild(row);
        }

        sectionEl.appendChild(body);
        view.appendChild(sectionEl);
      } else {
        view.appendChild(
          renderLessonSection(titleText, section.items, langs, sectionKey),
        );
      }
    });

    // ── 5. Render Bottom Bar Controls (Score & Complete Toggle) ──
    renderCompleteToggle();
    // mic in the player toolbar
    updateRecordToggleButton();

    // ── 6. Toggle Action Bar Buttons based on Lesson Kind ──
    //  const isLetterLesson = currentLesson?.meta?.kind === "letter";
    if (elements.actionBar) {
      const allButtons = elements.actionBar.querySelectorAll(
        ".action-bar__button",
      );
      const letterActions = new Set([
        "open-letter-flashcards",
        "open-audio-spell",
        "open-letter-quiz",
      ]);

      // Robust DOM iteration: Hides ALL standard buttons, shows ONLY letter buttons
      allButtons.forEach((btn) => {
        const action = btn.dataset.action;
        if (isLetterLesson) {
          btn.hidden = !letterActions.has(action);
        } else {
          btn.hidden = letterActions.has(action);
        }
      });
    }
  }

  function renderLessonSection(titleText, items, langs, sectionKey) {
    const section = document.createElement("section");
    section.className = "lesson-section";
    const isOpen = openLessonSections.has(sectionKey);
    const header = document.createElement("button");
    header.type = "button";
    header.className = "lesson-section__header";
    header.dataset.action = "toggle-lesson-section";
    header.dataset.sectionKey = sectionKey;
    const title = document.createElement("span");
    title.className = "lesson-section__title";
    title.textContent = titleText;
    const chevron = document.createElement("span");
    chevron.className = "lesson-section__chevron";
    chevron.textContent = isOpen ? "\u25BE" : "\u25B8";
    header.append(title, chevron);
    section.appendChild(header);
    if (!isOpen) return section;
    const body = document.createElement("div");
    body.className = "lesson-section__body";
    if (!items.length) body.appendChild(makeEmptyState(t("noItems")));
    else {
      const row = document.createElement("div");
      row.className = "item-row";
      row.dir = registry.dir(state.settings.appLanguage);
      items.forEach((item) => row.appendChild(renderItemColumn(item, langs)));
      body.appendChild(row);
    }
    section.appendChild(body);
    return section;
  }

  function renderItemColumn(item, langs) {
    if (item.header) {
      const column = document.createElement("div");
      column.className = "item-column item-column--header";
      column.dataset.itemId = item.id;
      column.dataset.kind = "header";
      const heading = document.createElement("div");
      heading.className = "lesson-section__title";
      heading.textContent = dataService.getLocalizedText(
        item.texts,
        preferredAppLanguages(),
      );
      column.appendChild(heading);
      return column;
    }

    const column = document.createElement("div");
    column.className = "item-column";
    column.dataset.itemId = item.id;
    column.dataset.kind = dataService.getItemKind(item);

    const isLetterLesson = currentLesson?.meta?.kind === "letter";

    if (currentLesson?.meta?.displayMode === "phonetic") {
      column.appendChild(renderPhoneticCell(item));
    } else if (currentLesson?.meta?.displayMode === "script") {
      column.appendChild(renderScriptCell(item));
    } else {
      // 🛡️ FIX: For letter lessons, ONLY render the target language.
      // This prevents the app from generating a second column with the English name (e.g., "Ko Kai").
      const codesToRender = isLetterLesson
        ? [state.settings.targetLanguage]
        : langs;

      codesToRender.forEach((code) =>
        column.appendChild(renderLanguageCell(item, code)),
      );
    }

    return column;
  }

  function parseScriptConnections(connections) {
    const forms = { isolated: "", initial: "", medial: "", final: "" };
    if (!connections) return forms;
    if (typeof connections === "object") {
      Object.keys(forms).forEach((key) => {
        if (typeof connections[key] === "string")
          forms[key] = connections[key].trim();
      });
      return forms;
    }
    if (typeof connections === "string") {
      connections.split("|").forEach((pair) => {
        const index = pair.indexOf(":");
        if (index === -1) return;
        const key = pair.slice(0, index).trim().toLowerCase();
        const value = pair.slice(index + 1).trim();
        if (Object.prototype.hasOwnProperty.call(forms, key))
          forms[key] = value;
      });
    }
    return forms;
  }

  function renderLanguageCell(item, code) {
    const kind = dataService.getItemKind(item);
    let text = dataService.getText(item, code);

    // 🛡️ DEFENSIVE CHECK: Prevent AI "laziness" from showing English to non-English users.
    // If this is a grammar note, and the text for the current language is identical
    // to the English text (meaning the AI copied the English string instead of translating),
    // force it to be treated as missing.
    if (
      item.role === "grammar" &&
      code !== "en" &&
      code !== state.settings.targetLanguage
    ) {
      const enText = dataService.getText(item, "en");
      if (text && enText && text.trim() === enText.trim()) {
        text = "";
      }
    }

    const cell = document.createElement("div");

    cell.className = "language-cell";
    cell.dataset.itemId = item.id;
    cell.dataset.lang = code;
    cell.dataset.action = "speak-cell";
    cell.dir = registry.dir(code);
    if (!text) {
      cell.classList.add("language-cell--missing");
      const span = document.createElement("span");
      span.className = "language-cell__text";
      span.lang = registry.bcp47(code);
      span.textContent = "\u2014";
      cell.appendChild(span);
      return cell;
    }
    if (kind === "sentence") {
      const container = document.createElement("span");
      container.className = "sentence-text";
      container.lang = registry.bcp47(code);
      if (registry.segmentation(code) === "segmenter")
        container.classList.add("sentence-text--compact");
      const tokens = dataService.tokenize(item, code);
      if (tokens.length) {
        tokens.forEach((token) => {
          const span = document.createElement("span");
          span.className = "sentence-token";
          span.dataset.tokenId = String(token.id);
          span.lang = registry.bcp47(code);
          span.textContent = token.text;
          container.appendChild(span);
        });
      } else {
        container.textContent = text;
      }
      if (state.settings.recordAndCompare)
        container.appendChild(createRecordMicButton(item, code, text));
      cell.appendChild(container);
    } else {
      const wrapper = document.createElement("div");
      wrapper.className = "language-cell__word-wrapper";
      const span = document.createElement("span");
      span.className = "language-cell__text";
      span.lang = registry.bcp47(code);
      span.textContent = text;
      wrapper.appendChild(span);
      if (state.settings.recordAndCompare)
        wrapper.appendChild(createRecordMicButton(item, code, text));
      cell.appendChild(wrapper);
    }
    return cell;
  }

  function renderPhoneticCell(item) {
    const code = state.settings.targetLanguage;
    const text = dataService.getText(item, code);
    const note = dataService.getLocalizedText(
      item.phonetic,
      preferredAppLanguages(),
    );
    const cell = document.createElement("div");
    cell.className = "language-cell phonetic-cell";
    cell.dataset.itemId = item.id;
    cell.dataset.lang = code;
    cell.dataset.action = "speak-cell";
    cell.dir = registry.dir(code);
    const charSpan = document.createElement("span");
    charSpan.className = "language-cell__text phonetic-cell__char";
    charSpan.lang = registry.bcp47(code);
    charSpan.textContent = text;
    cell.appendChild(charSpan);
    if (note) {
      const noteSpan = document.createElement("span");
      noteSpan.className = "phonetic-cell__note";
      noteSpan.textContent = note;
      cell.appendChild(noteSpan);
    }
    return cell;
  }
  function renderScriptCell(item) {
    const code = state.settings.targetLanguage;
    const text = dataService.getText(item, code);
    const cell = document.createElement("div");
    cell.className = "language-cell script-cell";
    cell.dataset.itemId = item.id;
    cell.dataset.lang = code;
    cell.dataset.action = "speak-cell";
    cell.dir = registry.dir(code);
    const charSpan = document.createElement("span");
    charSpan.className = "language-cell__text script-cell__char";
    charSpan.lang = registry.bcp47(code);
    charSpan.textContent = text;
    cell.appendChild(charSpan);
    if (item.connections) {
      const forms = parseScriptConnections(item.connections);

      // Only render the contextual forms grid if at least one form differs from the isolated form.
      // This prevents scripts like Thai from showing a redundant 4-column grid of the same character.
      const hasDistinctForms = ["initial", "medial", "final"].some(
        (formName) => forms[formName] && forms[formName] !== forms.isolated,
      );

      if (hasDistinctForms) {
        const grid = document.createElement("div");
        grid.className = "script-cell__forms";
        ["isolated", "initial", "medial", "final"].forEach((formName) => {
          const val = forms[formName];
          if (!val) return;
          const col = document.createElement("div");
          col.className = "script-cell__form-col";
          const glyph = document.createElement("span");
          glyph.lang = registry.bcp47(targetLang);
          glyph.dir = registry.dir(targetLang);
          glyph.textContent = val;
          const label = document.createElement("span");
          label.className = "script-cell__form-label";
          label.textContent = formName;
          col.appendChild(glyph);
          col.appendChild(label);
          grid.appendChild(col);
        });
        back.appendChild(grid);
      }
    }
    let note = "";
    if (item.phonetic)
      note = dataService.getLocalizedText(
        item.phonetic,
        preferredAppLanguages(),
      );
    if (!note) {
      const bridgeLang = preferredAppLanguages().find(
        (l) => l !== code && dataService.hasText(item, l),
      );
      if (bridgeLang) note = dataService.getText(item, bridgeLang);
    }
    if (note) {
      const noteSpan = document.createElement("span");
      noteSpan.className = "script-cell__note";
      noteSpan.textContent = note;
      cell.appendChild(noteSpan);
    }
    return cell;
  }
  function getCellElement(itemId, lang) {
    return document.querySelector(
      `.language-cell[data-item-id="${cssEscape(itemId)}"][data-lang="${cssEscape(lang)}"]`,
    );
  }
  function openSettings() {
    stopPlayback();
    clearExerciseHighlights();
    renderSettings();
    elements.settingsSheet.hidden = false;
  }
  function closeSettings() {
    elements.settingsSheet.hidden = true;
  }
  function openGrammarOverlay(ruleId) {
    const rule = (manifest.grammar_rules || []).find((r) => r.id === ruleId);
    if (!rule) return;
    const sheet = document.createElement("div");
    sheet.className = "sheet";
    sheet.id = "grammar-overlay";
    const backdrop = document.createElement("div");
    backdrop.className = "sheet__backdrop";
    backdrop.dataset.action = "close-grammar-overlay";
    sheet.appendChild(backdrop);
    const panel = document.createElement("div");
    panel.className = "sheet__panel";
    const header = document.createElement("div");
    header.className = "sheet__header";
    const title = document.createElement("h3");
    title.className = "sheet__title";
    title.textContent = `🧩 ${dataService.getLocalizedText(rule.title, preferredAppLanguages()) || rule.id}`;
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "icon-button";
    closeBtn.dataset.action = "close-grammar-overlay";
    closeBtn.textContent = "✕";
    closeBtn.setAttribute("aria-label", t("back"));
    header.append(title, closeBtn);
    panel.appendChild(header);
    const body = document.createElement("div");
    body.className = "sheet__body";
    const descText = dataService.getLocalizedText(
      rule.description,
      preferredAppLanguages(),
    );
    if (descText) {
      const descP = document.createElement("p");
      descP.className = "grammar-overlay__description";
      descP.textContent = descText;
      body.appendChild(descP);
    }
    if (Array.isArray(rule.examples) && rule.examples.length > 0) {
      const exTitle = document.createElement("h4");
      exTitle.className = "sheet-section__title";
      exTitle.textContent = t("examples");
      body.appendChild(exTitle);
      const exList = document.createElement("ul");
      exList.className = "grammar-overlay__examples";
      rule.examples.forEach((ex) => {
        const li = document.createElement("li");
        li.className = "grammar-overlay__example";
        const text =
          typeof ex === "string"
            ? ex
            : ex.target || ex.en || JSON.stringify(ex);
        li.textContent = text;
        exList.appendChild(li);
      });
      body.appendChild(exList);
    }
    panel.appendChild(body);
    sheet.appendChild(panel);
    document.body.appendChild(sheet);
  }
  function closeGrammarOverlay() {
    const sheet = document.getElementById("grammar-overlay");
    if (sheet) sheet.remove();
  }
  let mediaRecorder = null;
  let audioChunks = [];
  let audioStream = null;
  let recordedBlob = null;
  let currentRecordLang = "";
  let currentRecordText = "";
  let isRecording = false;
  let recordingTimeoutId = null;
  let currentAudioUrl = null;
  let currentAudioElement = null;
  async function startRecordingTest() {
    try {
      audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "audio/webm";
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "";
      }
      const options = mimeType ? { mimeType } : {};
      mediaRecorder = new MediaRecorder(audioStream, options);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunks.push(event.data);
      };
      mediaRecorder.onstop = () => {
        recordedBlob = new Blob(audioChunks, {
          type: mimeType || "audio/webm",
        });
        if (audioStream)
          audioStream.getTracks().forEach((track) => track.stop());
        if (recordedBlob.size < 1000) {
          showRecordError("recordFailed", false);
          updateRecordOverlayButton("idle");
          recordedBlob = null;
          audioChunks = [];
        } else {
          const body = document.getElementById("record-overlay-body");
          if (body) {
            const existingError = body.querySelector(".record-overlay__error");
            if (existingError) existingError.remove();
          }
          updateRecordOverlayButton("ready");
        }
      };
      mediaRecorder.start();
      return true;
    } catch (err) {
      console.error("Zabon Stage 7: Error accessing microphone:", err);
      return false;
    }
  }
  function stopRecordingTest() {
    if (mediaRecorder && mediaRecorder.state !== "inactive")
      mediaRecorder.stop();
  }
  function updateRecordOverlayButton(state) {
    const btn = document.querySelector("#record-overlay .record-overlay__btn");
    if (!btn) return;
    if (state === "idle") {
      btn.dataset.action = "record-start";
      btn.textContent = `🎙️ ${t("recordBtnStart")}`;
      btn.disabled = false;
    } else if (state === "recording") {
      btn.dataset.action = "record-stop";
      btn.textContent = `⏹️ ${t("recordBtnStop")}`;
      btn.disabled = false;
    } else if (state === "ready") {
      btn.dataset.action = "record-play";
      btn.textContent = `▶️ ${t("recordBtnPlay")}`;
      btn.disabled = false;
    }
  }
  async function startRecordingFlow() {
    isRecording = true;
    updateRecordOverlayButton("recording");
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }
    recordedBlob = null;
    audioChunks = [];
    recordingTimeoutId = setTimeout(() => {
      if (isRecording) stopRecordingFlow();
    }, 60000);
    const success = await startRecordingTest();
    if (!success) {
      isRecording = false;
      if (recordingTimeoutId) {
        clearTimeout(recordingTimeoutId);
        recordingTimeoutId = null;
      }
      updateRecordOverlayButton("idle");
      showRecordError();
    }
  }
  function showRecordError(
    messageKey = "recordPermissionDenied",
    disableButton = true,
  ) {
    const body = document.getElementById("record-overlay-body");
    if (!body) return;
    const existingError = body.querySelector(".record-overlay__error");
    if (existingError) existingError.remove();
    const errorEl = document.createElement("p");
    errorEl.className = "record-overlay__error";
    errorEl.textContent = `⚠️ ${t(messageKey)}`;
    body.appendChild(errorEl);
    const btn = body.querySelector(".record-overlay__btn");
    if (btn) btn.disabled = disableButton;
  }
  function stopRecordingFlow() {
    if (!isRecording) return;
    isRecording = false;
    if (recordingTimeoutId) {
      clearTimeout(recordingTimeoutId);
      recordingTimeoutId = null;
    }
    stopRecordingTest();
  }
  async function playAndCompare() {
    const btn = document.querySelector("#record-overlay .record-overlay__btn");
    if (!btn || !recordedBlob) return;
    btn.disabled = true;
    const ttsPromise = new Promise((resolve) => {
      if (
        !mediaService.supported ||
        !currentRecordText ||
        !currentRecordText.trim()
      ) {
        resolve();
        return;
      }
      const utterance = mediaService.speakText(
        currentRecordText,
        currentRecordLang,
        { onEnd: () => resolve(), onError: () => resolve() },
      );
      if (!utterance) resolve();
    });
    await ttsPromise;
    await new Promise((resolve) => setTimeout(resolve, 800));
    currentAudioUrl = URL.createObjectURL(recordedBlob);
    const audio = new Audio(currentAudioUrl);
    currentAudioElement = audio;
    const cleanupAndReset = () => {
      if (currentAudioUrl) {
        URL.revokeObjectURL(currentAudioUrl);
        currentAudioUrl = null;
      }
      if (currentAudioElement) {
        currentAudioElement.pause();
        currentAudioElement.src = "";
        currentAudioElement = null;
      }
      recordedBlob = null;
      audioChunks = [];
      updateRecordOverlayButton("idle");
    };
    audio.onended = cleanupAndReset;
    audio.onerror = cleanupAndReset;
    try {
      await audio.play();
    } catch (err) {
      cleanupAndReset();
    }
  }
  function openRecordOverlay(itemId, lang, text) {
    stopPlayback();
    clearExerciseHighlights();
    currentRecordLang = lang;
    currentRecordText = text;
    const sheet = document.createElement("div");
    sheet.className = "sheet record-overlay";
    sheet.id = "record-overlay";
    const backdrop = document.createElement("div");
    backdrop.className = "sheet__backdrop";
    backdrop.dataset.action = "close-record-overlay";
    sheet.appendChild(backdrop);
    const panel = document.createElement("div");
    panel.className = "sheet__panel";
    const header = document.createElement("div");
    header.className = "sheet__header";
    const title = document.createElement("h3");
    title.className = "sheet__title";
    title.textContent = t("recordOverlayTitle");
    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "icon-button";
    closeBtn.dataset.action = "close-record-overlay";
    closeBtn.textContent = "✕";
    closeBtn.setAttribute("aria-label", t("back"));
    header.append(title, closeBtn);
    panel.appendChild(header);
    const body = document.createElement("div");
    body.className = "sheet__body record-overlay__body";
    body.id = "record-overlay-body";
    const instruction = document.createElement("p");
    instruction.className = "record-overlay__instruction";
    instruction.textContent = `ℹ️ ${t("recordInstruction")}`;
    body.appendChild(instruction);
    const item = dataService.getItem(itemId);
    let textLine;
    if (item && dataService.getItemKind(item) === "sentence")
      textLine = createSentenceTextLine(item, text, lang, [
        "record-overlay__text",
      ]);
    else textLine = createTextLine(text, lang, ["record-overlay__text"], item);

    if (textLine) body.appendChild(textLine);
    const recordBtn = document.createElement("button");
    recordBtn.type = "button";
    recordBtn.className = "button button--wide record-overlay__btn";
    recordBtn.dataset.action = "record-start";
    recordBtn.textContent = `🎙️ ${t("recordBtnStart")}`;
    body.appendChild(recordBtn);
    panel.appendChild(body);
    sheet.appendChild(panel);
    document.body.appendChild(sheet);
  }
  function closeRecordOverlay() {
    const sheet = document.getElementById("record-overlay");
    if (sheet) sheet.remove();
    if (isRecording) stopRecordingFlow();
    if (currentAudioElement) {
      currentAudioElement.pause();
      currentAudioElement.src = "";
      currentAudioElement = null;
    }
    if (currentAudioUrl) {
      URL.revokeObjectURL(currentAudioUrl);
      currentAudioUrl = null;
    }
    recordedBlob = null;
    audioChunks = [];
  }
  function renderSettings() {
    const body = elements.settingsBody;
    body.innerHTML = "";
    const lessonLangs =
      currentLesson?.meta?.translations || registry.allCodes();
    body.appendChild(renderSettingsLanguagesSection(lessonLangs));
    body.appendChild(renderRepeatSection());
    body.appendChild(renderSpeedSection());
    body.appendChild(renderFontSection());
    body.appendChild(renderRecordAndCompareSection());
    body.appendChild(renderVoicesSection());
  }
  function renderLanguageCheckboxList(codes, onChangeHandler) {
    const list = document.createElement("div");
    list.className = "language-list";
    codes.forEach((code) => {
      if (!registry.has(code)) return;
      const label = document.createElement("label");
      label.className = "language-control";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.checked = state.lessonLanguages.includes(code);
      input.addEventListener("change", () =>
        onChangeHandler(code, input.checked),
      );
      const flag = document.createElement("span");
      flag.className = "language-control__flag";
      flag.textContent = flagEmoji(code);
      const name = document.createElement("span");
      name.className = "language-control__label";
      name.textContent = languageDisplayName(code);
      label.append(input, flag, name);
      list.appendChild(label);
    });
    return list;
  }
  function renderSettingsLanguagesSection(lessonLangs) {
    const section = document.createElement("div");
    section.className = "sheet-section";
    const title = document.createElement("h3");
    title.className = "sheet-section__title";
    title.textContent = t("languages");
    section.appendChild(title);
    const list = renderLanguageCheckboxList(
      lessonLangs,
      setLessonLanguageEnabled,
    );
    section.appendChild(list);
    return section;
  }
  function renderRepeatSection() {
    const section = document.createElement("div");
    section.className = "sheet-section";
    const title = document.createElement("h3");
    title.className = "sheet-section__title";
    title.textContent = t("repeatCount");
    section.appendChild(title);
    const input = document.createElement("input");
    input.type = "number";
    input.className = "text-input";
    input.min = "1";
    input.step = "1";
    input.value = String(state.settings.repeatCount || 1);
    input.addEventListener("change", () => setRepeatCount(input.value));
    section.appendChild(input);
    return section;
  }
  function renderSpeedSection() {
    const section = document.createElement("div");
    section.className = "sheet-section";
    const title = document.createElement("h3");
    title.className = "sheet-section__title";
    title.textContent = t("speechSpeed");
    section.appendChild(title);
    const row = document.createElement("div");
    row.className = "radio-row";
    [
      ["normal", t("speedNormal")],
      ["slow", t("speedSlow")],
      ["slower", t("speedSlower")],
    ].forEach(([value, label]) => {
      const labelEl = document.createElement("label");
      labelEl.className = "radio-control";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "speech-speed";
      input.value = value;
      input.checked = state.settings.speechSpeed === value;
      input.addEventListener("change", () => setSpeechSpeed(value));
      const text = document.createElement("span");
      text.textContent = label;
      labelEl.append(input, text);
      row.appendChild(labelEl);
    });
    section.appendChild(row);
    return section;
  }
  function renderFontSection() {
    const section = document.createElement("div");
    section.className = "sheet-section";
    const title = document.createElement("h3");
    title.className = "sheet-section__title";
    title.textContent = t("fontMode");
    section.appendChild(title);
    const row = document.createElement("div");
    row.className = "radio-row";
    [
      ["modern", t("fontModern")],
      ["traditional", t("fontTraditional")],
    ].forEach(([value, label]) => {
      const labelEl = document.createElement("label");
      labelEl.className = "radio-control";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "font-mode";
      input.value = value;
      input.checked = state.settings.font === value;
      input.addEventListener("change", () => setFontMode(value));
      const text = document.createElement("span");
      text.textContent = label;
      labelEl.append(input, text);
      row.appendChild(labelEl);
    });
    section.appendChild(row);
    return section;
  }

  function renderVoicesSection() {
    const section = document.createElement("div");
    section.className = "sheet-section";
    const title = document.createElement("h3");
    title.className = "sheet-section__title";
    title.textContent = t("voices");
    section.appendChild(title);
    const langs = selectedLessonLanguages();
    if (!langs.length) {
      section.appendChild(makeEmptyState(t("noLanguagesSelected")));
      return section;
    }
    langs.forEach((code) => {
      const row = document.createElement("div");
      row.className = "voice-row";
      const label = document.createElement("span");
      label.className = "voice-row__label";
      label.textContent = `${flagEmoji(code)} ${languageDisplayName(code)}`;
      const select = document.createElement("select");
      select.className = "select";
      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = t("defaultVoice");
      select.appendChild(defaultOption);
      const voices = mediaService.voicesForLanguage(code);
      voices.forEach((voice) => {
        const option = document.createElement("option");
        option.value = voice.name;
        option.textContent = truncateLabel(voice.name);
        select.appendChild(option);
      });
      select.value = state.settings.voices?.[code] || "";
      if (select.value && !voices.some((voice) => voice.name === select.value))
        select.value = "";
      select.addEventListener("change", () =>
        setVoiceForLanguage(code, select.value),
      );
      row.append(label, select);
      section.appendChild(row);
    });
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "button button--wide";
    reset.dataset.action = "reset-voices";
    reset.textContent = t("resetVoices");
    section.appendChild(reset);
    return section;
  }
  function setRepeatCount(value) {
    state.settings.repeatCount = normalizeRepeatCount(value);
    saveState();
    renderSettings();
  }
  function setSpeechSpeed(value) {
    if (!["normal", "slow", "slower"].includes(value)) return;
    state.settings.speechSpeed = value;
    saveState();
  }
  function setFontMode(value) {
    if (value !== "modern" && value !== "traditional") return;
    state.settings.font = value;
    saveState();
    applyFont();
    renderHamburger();
  }

  function getItemPool(kind) {
    if (!currentLesson) return [];
    const isLetterLesson = currentLesson.meta?.kind === "letter";
    const items = kind
      ? currentLesson.items.filter((item) => {
          if (item.header) return false;
          if (kind === "letter") {
            return isLetterLesson || dataService.getItemKind(item) === "letter";
          }
          return (
            dataService.getItemKind(item) === kind && item.role === "target"
          );
        })
      : currentLesson.items.filter(
          (item) => item.role === "target" && !item.header,
        );
    return items.map((item) => item.id);
  }

  function buildPlaybackUnits() {
    if (!currentLesson) return [];
    const items = currentLesson.items.filter((item) => !item.header);
    const langs = selectedLessonLanguages();
    const units = [];
    const wordItems = [];
    const sentenceItems = [];
    for (const item of items) {
      if (dataService.getItemKind(item) === "sentence")
        sentenceItems.push(item);
      else wordItems.push(item);
    }
    const orderedItems = [...wordItems, ...sentenceItems];
    for (const item of orderedItems) {
      const kind = dataService.getItemKind(item);
      for (const code of langs) {
        const text = dataService.getText(item, code);
        if (!text.trim()) continue;
        units.push({
          id: `${item.id}:${code}`,
          itemId: item.id,
          itemKind: kind,
          languageCode: code,
          text,
        });
      }
    }
    return units;
  }
  function startPlaybackFromBeginning() {
    // Panels will now open dynamically as playback reaches them.
    renderLesson();
    const units = buildPlaybackUnits();
    if (!units.length) {
      stopPlayback();
      return;
    }
    startPlaybackAt(units, 0);
  }
  function startPlaybackFromCell(itemId, code) {
    const units = buildPlaybackUnits();
    const index = units.findIndex(
      (unit) => unit.itemId === itemId && unit.languageCode === code,
    );
    if (index < 0) {
      stopPlayback();
      return;
    }
    startPlaybackAt(units, index);
  }
  function startPlaybackAt(units, index) {
    stopPlayback();
    playbackSessionCounter += 1;
    playbackState = {
      status: "playing",
      units,
      index,
      repeat: 0,
      session: playbackSessionCounter,
      utterance: null,
      timerId: null,
      highlightTimerId: null,
    };
    playCurrentUnit();
    refreshPlaybackUI();
  }
  function togglePlayPause() {
    if (playbackState.status === "playing") {
      pausePlayback();
      return;
    }
    if (playbackState.status === "paused") {
      resumePlayback();
      return;
    }
    startPlaybackFromBeginning();
  }
  function pausePlayback() {
    if (playbackState.status !== "playing") return;
    playbackSessionCounter += 1;
    playbackState.session = playbackSessionCounter;
    playbackState.status = "paused";
    cancelCurrentSpeech();
    refreshPlaybackUI();
  }
  function resumePlayback() {
    if (playbackState.status !== "paused") return;
    playbackSessionCounter += 1;
    playbackState.status = "playing";
    playbackState.session = playbackSessionCounter;
    playCurrentUnit();
    refreshPlaybackUI();
  }
  function stopPlayback() {
    if (playbackState) {
      playbackSessionCounter += 1;
      playbackState.session = playbackSessionCounter;
      playbackState.status = "idle";
      playbackState.units = [];
      playbackState.index = 0;
      playbackState.repeat = 0;
    }
    cancelCurrentSpeech();
    refreshPlaybackUI();
  }
  function cancelCurrentSpeech() {
    clearPlaybackHighlights();
    if (playbackState) {
      if (playbackState.timerId) {
        clearTimeout(playbackState.timerId);
        playbackState.timerId = null;
      }
      playbackState.utterance = null;
    }
    if (mediaService?.supported) window.speechSynthesis.cancel();
  }
  function clearPlaybackHighlights() {
    if (playbackState && playbackState.highlightTimerId) {
      clearInterval(playbackState.highlightTimerId);
      playbackState.highlightTimerId = null;
    }
    document
      .querySelectorAll(".language-cell.is-speaking")
      .forEach((el) => el.classList.remove("is-speaking"));
    document
      .querySelectorAll(".sentence-token.is-highlighted")
      .forEach((el) => el.classList.remove("is-highlighted"));
  }
  function scrollUnitIntoView(unit) {
    let cell = getCellElement(unit.itemId, unit.languageCode);

    // If the cell is not in the DOM, it is likely inside a closed section.
    if (!cell && currentLesson) {
      const sectionKey = getSectionKeyForItem(unit.itemId);
      if (sectionKey && !openLessonSections.has(sectionKey)) {
        openLessonSections.add(sectionKey);

        // Suppress scroll events BEFORE re-rendering to prevent the scroll
        // listener from accidentally stopping playback.
        programmaticScrollUntil = Date.now() + SCROLL_SUPPRESSION_MS;
        renderLesson();

        // Fetch the cell again now that the section is open
        cell = getCellElement(unit.itemId, unit.languageCode);
      }
    }

    if (!cell) return;

    const target = cell.closest(".item-column") || cell;
    programmaticScrollUntil = Date.now() + SCROLL_SUPPRESSION_MS;
    target.scrollIntoView({
      block: "center",
      inline: "nearest",
      behavior: "smooth",
    });
  }

  function getSectionKeyForItem(targetItemId) {
    if (!currentLesson?.items) return null;

    // Replicate the exact section-building logic from renderLesson()
    const sections = [];
    let currentSection = { header: null, items: [] };

    for (const item of currentLesson.items) {
      if (item.header) {
        if (currentSection.items.length > 0) {
          sections.push(currentSection);
          currentSection = { header: item, items: [] };
        } else {
          currentSection.header = item;
        }
      } else {
        currentSection.items.push(item);
      }
    }
    if (currentSection.items.length > 0) sections.push(currentSection);

    // Find which section contains the target item
    for (let index = 0; index < sections.length; index++) {
      const section = sections[index];
      const sectionKey = section.header
        ? `lesson:section:${section.header.id}`
        : `lesson:section:fallback:${index}`;

      if (section.items.some((i) => i.id === targetItemId)) {
        return sectionKey;
      }
    }
    return null;
  }

  function playCurrentUnit() {
    if (!playbackState || playbackState.status !== "playing") return;
    const unit = playbackState.units?.[playbackState.index];
    if (!unit) {
      stopPlayback();
      return;
    }
    if (!String(unit.text || "").trim()) {
      nextUnit();
      return;
    }
    refreshPlaybackUI();
    scrollUnitIntoView(unit);
    speakUnit(unit);
  }
  function speakUnit(unit) {
    if (!playbackState || playbackState.status !== "playing") return;
    const session = playbackState.session ?? 0;
    const repeatTotal = normalizeRepeatCount(state.settings.repeatCount);
    cancelCurrentSpeech();
    highlightUnit(unit);
    const finish = () => {
      if (
        session !== playbackState.session ||
        playbackState.status !== "playing"
      )
        return;
      const rep = playbackState.repeat || 0;
      if (rep < repeatTotal - 1) {
        playbackState.repeat = rep + 1;
        speakUnit(unit);
      } else {
        playbackState.repeat = 0;
        nextUnit();
      }
    };
    const handleError = () => {
      if (
        session !== playbackState.session ||
        playbackState.status !== "playing"
      )
        return;
      playbackState.repeat = 0;
      nextUnit();
    };
    if (!mediaService.supported) {
      const delay = Math.max(500, String(unit.text || "").length * 80);
      playbackState.timerId = setTimeout(finish, delay);
      return;
    }
    const utterance = mediaService.speakText(unit.text, unit.languageCode, {
      onEnd: () => {
        if (playbackState.utterance !== utterance) return;
        finish();
      },
      onError: () => {
        if (playbackState.utterance !== utterance) return;
        handleError();
      },
    });
    playbackState.utterance = utterance || null;
  }
  function highlightUnit(unit) {
    clearPlaybackHighlights();
    const cell = getCellElement(unit.itemId, unit.languageCode);
    if (!cell) return;
    cell.classList.add("is-speaking");
    if (unit.itemKind === "sentence") {
      const tokens = Array.from(cell.querySelectorAll(".sentence-token"));
      if (!tokens.length) return;
      let idx = 0;
      const highlightCurrent = () => {
        tokens.forEach((token) => token.classList.remove("is-highlighted"));
        if (tokens[idx]) tokens[idx].classList.add("is-highlighted");
        if (idx < tokens.length - 1) idx += 1;
      };
      highlightCurrent();
      if (tokens.length > 1) {
        const preset =
          SPEED_PRESETS[state.settings.speechSpeed] || SPEED_PRESETS.normal;
        const textLength = String(unit.text || "").length;
        const estimated = Math.max(1200, textLength * 90) / (preset.rate || 1);
        const interval = Math.max(180, Math.floor(estimated / tokens.length));
        playbackState.highlightTimerId = setInterval(
          highlightCurrent,
          interval,
        );
      }
    }
  }
  function nextUnit() {
    if (playbackState.status !== "playing") return;
    playbackState.index += 1;
    playbackState.repeat = 0;
    if (playbackState.index >= playbackState.units.length) {
      stopPlayback();
      return;
    }
    playCurrentUnit();
  }
  function updateRecordToggleButton() {
    const btn = document.getElementById("toggle-record");
    if (!btn) return;
    const isActive = Boolean(state.settings.recordAndCompare);
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-label", t("recordAndCompare"));
    btn.title = isActive
      ? "Disable Record & Compare"
      : "Enable Record & Compare";
  }

  function refreshPlaybackUI() {
    const playButton = document.querySelector('[data-action="media-play"]');
    if (playButton) {
      const isPlaying = playbackState.status === "playing";
      playButton.textContent = isPlaying ? "\u23F8" : "\u25B6";
      playButton.setAttribute("aria-label", isPlaying ? t("pause") : t("play"));
    }
    const stopButton = document.querySelector('[data-action="media-stop"]');
    if (stopButton) stopButton.disabled = playbackState.status === "idle";
  }

  function exerciseHeader(titleText, backAction) {
    const header = document.createElement("div");
    header.className = "document-header";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "button";
    back.dataset.action = backAction;
    back.textContent = "\u2190";
    back.setAttribute("aria-label", t("back"));
    const title = document.createElement("h2");
    title.className = "document-title";
    title.textContent = titleText;
    header.append(back, title);
    return header;
  }

  function configRow(labelText, control) {
    const row = document.createElement("div");
    row.className = "config-row";
    const label = document.createElement("span");
    label.className = "config-label";
    label.textContent = labelText;
    row.appendChild(label);
    row.appendChild(control);
    return row;
  }
  function renderExerciseSettingsPanel(isOpen, configBody) {
    const wrap = document.createElement("div");
    wrap.className = "exercise-settings";
    const header = document.createElement("button");
    header.type = "button";
    header.className = "exercise-settings__header";
    header.dataset.action = "toggle-exercise-settings";
    const title = document.createElement("span");
    title.className = "exercise-settings__title";
    title.textContent = t("exerciseSettings");
    const chevron = document.createElement("span");
    chevron.className = "exercise-settings__chevron";
    chevron.textContent = isOpen ? "\u25BE" : "\u25B8";
    header.append(title, chevron);
    wrap.appendChild(header);
    if (isOpen) {
      const body = document.createElement("div");
      body.className = "exercise-settings__body";
      body.appendChild(configBody);
      wrap.appendChild(body);
    }
    return wrap;
  }
  function buildLanguageSelect(langs, selected, onChange) {
    const select = document.createElement("select");
    select.className = "select";
    langs.forEach((code) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = `${flagEmoji(code)} ${languageDisplayName(code)}`;
      select.appendChild(option);
    });
    select.value = selected;
    if (!select.value) select.value = langs[0] || "";
    select.addEventListener("change", () => onChange(select.value));
    return select;
  }
  function showStageMessage(stage, text) {
    stage.innerHTML = "";
    stage.appendChild(makeEmptyState(text));
  }
  function renderFlashcards() {
    showView("flashcard");
    const view = elements.flashcardView;
    view.innerHTML = "";
    view.appendChild(
      exerciseHeader(
        flashcardKind === "sentence"
          ? t("sentenceFlashcards")
          : t("wordFlashcards"),
        "back-lesson",
      ),
    );
    const langs = selectedLessonLanguages();
    const settingsOpen = langs.length < 2 || exerciseSettingsOpen;
    ensureExerciseConfigs();
    const config = document.createElement("div");
    config.className = "exercise-config";
    config.appendChild(
      configRow(
        t("promptLanguage"),
        buildLanguageSelect(langs, flashcardConfig.promptLanguage, (value) => {
          flashcardConfig.promptLanguage = value;
          flashcardConfig.revealLanguages =
            flashcardConfig.revealLanguages.filter((code) => code !== value);
          flashcardSession = null;
          renderFlashcards();
        }),
      ),
    );
    const revealRow = document.createElement("div");
    revealRow.className = "config-row";
    const revealLabel = document.createElement("span");
    revealLabel.className = "config-label";
    revealLabel.textContent = t("revealLanguages");
    revealRow.appendChild(revealLabel);
    const revealControls = document.createElement("div");
    revealControls.className = "reveal-controls";
    langs.forEach((code) => {
      const isPrompt = code === flashcardConfig.promptLanguage;
      const label = document.createElement("label");
      label.className = "language-control";
      const input = document.createElement("input");
      input.type = "checkbox";
      input.disabled = isPrompt;
      input.checked =
        !isPrompt && flashcardConfig.revealLanguages.includes(code);
      input.addEventListener("change", () =>
        setFlashcardReveal(code, input.checked),
      );
      const flag = document.createElement("span");
      flag.className = "language-control__flag";
      flag.textContent = flagEmoji(code);
      const name = document.createElement("span");
      name.className = "language-control__label";
      name.textContent = languageDisplayName(code);
      label.append(input, flag, name);
      revealControls.appendChild(label);
    });
    const isLetterLesson = currentLesson?.meta?.kind === "letter";
    if (isLetterLesson) revealRow.hidden = true;
    view.appendChild(renderExerciseSettingsPanel(settingsOpen, config));
    const stage = document.createElement("div");
    stage.id = "flashcard-stage";
    stage.className = "flashcard-stage";
    view.appendChild(stage);
    //   const isLetterLesson = currentLesson?.meta?.kind === "letter";
    if (langs.length < 2 && !isLetterLesson) {
      showStageMessage(stage, t("selectTwoLanguages"));
      return;
    }
    if (!flashcardSession) startFlashcardSession();
    else if (flashcardSession.index < flashcardSession.due.length)
      renderCurrentFlashcard();
    else showStageMessage(stage, t("noDueCards"));
  }
  function setFlashcardReveal(code, enabled) {
    const set = new Set(flashcardConfig.revealLanguages);
    if (enabled) set.add(code);
    else set.delete(code);
    flashcardConfig.revealLanguages = [...set];
    flashcardSession = null;
    renderFlashcards();
  }
  function startFlashcardSession() {
    ensureExerciseConfigs();
    const stage = document.getElementById("flashcard-stage");
    if (!stage) return;
    const deck = flashcardService.buildDeck({
      itemIds: getItemPool(flashcardKind),
      promptLanguage: flashcardConfig.promptLanguage,
      revealLanguages: flashcardConfig.revealLanguages,
    });
    stage.innerHTML = "";
    if (!deck.revealLanguages.length) {
      showStageMessage(stage, t("selectRevealLanguage"));
      return;
    }
    if (!deck.cards.length) {
      if (deck.stats.withPromptText === 0)
        showStageMessage(stage, t("noPromptText"));
      else showStageMessage(stage, t("noRevealText"));
      return;
    }
    const due = srsService.getDueCards(deck.cards);
    flashcardSession = { deck, due, index: 0 };
    if (!due.length) {
      showStageMessage(stage, t("noDueCards"));
      return;
    }
    renderCurrentFlashcard();
  }
  function renderCurrentFlashcard() {
    const stage = document.getElementById("flashcard-stage");
    if (!stage) return;
    clearExerciseHighlights();
    stage.innerHTML = "";
    const card = flashcardSession?.due?.[flashcardSession.index];
    if (!card) {
      showStageMessage(stage, t("noDueCards"));
      return;
    }
    const status = document.createElement("div");
    status.className = "flashcard-status";
    status.textContent = `${flashcardSession.index + 1} / ${flashcardSession.due.length}`;
    stage.appendChild(status);
    const article = document.createElement("article");
    article.className = "flashcard";
    article.dataset.cardId = card.cardId;
    const isSentence = card.itemKind === "sentence";
    const cardItem = dataService.getItem(card.itemId);
    const front = isSentence
      ? createSentenceTextLine(cardItem, card.promptText, card.promptLanguage, [
          "flashcard__prompt",
        ])
      : createTextLine(
          card.promptText,
          card.promptLanguage,
          ["flashcard__prompt"],
          cardItem,
        );
    if (!front) {
      showStageMessage(stage, t("noPromptText"));
      return;
    }
    article.appendChild(front);
    const back = document.createElement("div");
    back.className = "flashcard__back";
    back.hidden = true;
    card.revealLines.forEach((line) => {
      const el = isSentence
        ? createSentenceTextLine(cardItem, line.text, line.languageCode, [
            "flashcard__reveal",
          ])
        : createTextLine(
            line.text,
            line.languageCode,
            ["flashcard__reveal"],
            cardItem,
          );
      if (el) back.appendChild(el);
    });
    article.appendChild(back);
    const actions = document.createElement("div");
    actions.className = "flashcard__actions";
    const revealButton = document.createElement("button");
    revealButton.type = "button";
    revealButton.className = "button button--wide";
    revealButton.dataset.action = "reveal";
    revealButton.textContent = t("showAnswer");
    actions.appendChild(revealButton);
    article.appendChild(actions);
    article.appendChild(createRatingPanel());
    stage.appendChild(article);
    if (isSentence)
      speakLineWithHighlight(front, card.promptText, card.promptLanguage);
    else mediaService.speakImmediate(card.promptText, card.promptLanguage);
  }
  function createRatingPanel() {
    const panel = document.createElement("div");
    panel.className = "rating-panel";
    panel.hidden = true;
    ["again", "hard", "good", "easy"].forEach((rating) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button--wide";
      button.dataset.action = "rate";
      button.dataset.rating = rating;
      button.textContent = t(rating);
      panel.appendChild(button);
    });
    return panel;
  }
  function revealCurrentCard() {
    const stage = document.getElementById("flashcard-stage");
    if (!stage) return;
    const card = flashcardSession?.due?.[flashcardSession.index];
    const back = stage.querySelector(".flashcard__back");
    const revealButton = stage.querySelector('[data-action="reveal"]');
    const ratingPanel = stage.querySelector(".rating-panel");
    if (back) back.hidden = false;
    if (revealButton) revealButton.hidden = true;
    if (ratingPanel) ratingPanel.hidden = false;
    const answerLine = card?.revealLines?.[0];
    if (answerLine && String(answerLine.text || "").trim()) {
      if (card.itemKind === "sentence") {
        const lineEl = back ? back.querySelector(".language-line") : null;
        speakLineWithHighlight(
          lineEl,
          answerLine.text,
          answerLine.languageCode,
        );
      } else
        mediaService.speakImmediate(answerLine.text, answerLine.languageCode);
    }
  }
  function rateCurrentCard(rating) {
    const card = flashcardSession?.due?.[flashcardSession.index];
    if (!card) return;
    srsService.rateCard(card, rating);
    nextFlashcard();
  }

  function nextFlashcard() {
    if (!flashcardSession) return;
    flashcardSession.index += 1;
    const stage = document.getElementById("flashcard-stage");
    if (flashcardSession.index >= flashcardSession.due.length) {
      if (stage) showStageMessage(stage, t("noDueCards"));
      return;
    }
    renderCurrentFlashcard();
  }

  function renderLetterFlashcards() {
    showView("letter-flashcard");
    const view = elements["letter-flashcardView"];
    if (!view) return;
    view.innerHTML = "";

    const header = exerciseHeader(t("letterFlashcards"), "back-lesson");
    view.appendChild(header);

    const stage = document.createElement("div");
    stage.id = "letter-flashcard-stage";
    stage.className = "flashcard-stage";
    view.appendChild(stage);

    if (!flashcardSession) startLetterFlashcardSession();
    else if (flashcardSession.index < flashcardSession.due.length)
      renderCurrentLetterFlashcard();
    else renderLetterFlashcardFinished(stage);
  }

  function startLetterFlashcardSession() {
    const stage = document.getElementById("letter-flashcard-stage");
    if (!stage) return;

    const itemIds = getItemPool("letter");
    const targetLang = state.settings.targetLanguage;
    const appLang = state.settings.appLanguage;

    const cards = [];
    for (const id of itemIds) {
      const item = dataService.getItem(id);
      if (!item) continue;
      const promptText = dataService.getText(item, targetLang);
      if (!promptText) continue;
      cards.push({
        cardId: `letter:${id}`,
        itemId: id,
        itemKind: "letter",
        promptLanguage: targetLang,
        revealLanguages: [appLang],
        promptText,
        item,
      });
    }

    // BYPASS SRS: Include ALL cards so letters can be practiced repeatedly.
    const due = [...cards];
    flashcardSession = { deck: { cards }, due, index: 0 };

    if (!due.length) {
      showStageMessage(stage, t("noItems"));
      return;
    }
    renderCurrentLetterFlashcard();
  }

  function renderCurrentLetterFlashcard() {
    const stage = document.getElementById("letter-flashcard-stage");
    if (!stage) return;
    clearExerciseHighlights();
    stage.innerHTML = "";

    const card = flashcardSession?.due?.[flashcardSession.index];
    if (!card) {
      renderLetterFlashcardFinished(stage);
      return;
    }

    const item = card.item;
    const targetLang = state.settings.targetLanguage;
    const appLang = state.settings.appLanguage;

    const status = document.createElement("div");
    status.className = "flashcard-status";
    status.textContent = `${flashcardSession.index + 1} / ${flashcardSession.due.length}`;
    stage.appendChild(status);

    const article = document.createElement("article");
    article.className = "letter-flashcard";

    // Front
    const front = document.createElement("div");
    front.className = "letter-flashcard__front";
    const charSpan = document.createElement("span");
    charSpan.className = "letter-flashcard__char";
    charSpan.lang = registry.bcp47(targetLang);
    charSpan.dir = registry.dir(targetLang);
    charSpan.textContent = card.promptText;
    front.appendChild(charSpan);
    article.appendChild(front);

    // Back
    const back = document.createElement("div");
    back.className = "letter-flashcard__back";
    back.hidden = true;

    if (item.phonetic) {
      const noteText = dataService.getLocalizedText(item.phonetic, [
        appLang,
        "en",
      ]);
      if (noteText) {
        const noteEl = document.createElement("div");
        noteEl.className = "letter-flashcard__note";
        noteEl.textContent = noteText;
        back.appendChild(noteEl);
      }
    }

    if (item.connections) {
      const forms = parseScriptConnections(item.connections);
      const hasDistinctForms = ["initial", "medial", "final"].some(
        (f) => forms[f] && forms[f] !== forms.isolated,
      );
      if (hasDistinctForms) {
        const grid = document.createElement("div");
        grid.className = "script-cell__forms";
        ["isolated", "initial", "medial", "final"].forEach((formName) => {
          const val = forms[formName];
          if (!val) return;
          const col = document.createElement("div");
          col.className = "script-cell__form-col";
          const glyph = document.createElement("span");
          glyph.lang = registry.bcp47(targetLang);
          glyph.dir = registry.dir(targetLang);
          glyph.textContent = val;
          const label = document.createElement("span");
          label.className = "script-cell__form-label";
          label.textContent = formName;
          col.appendChild(glyph);
          col.appendChild(label);
          grid.appendChild(col);
        });
        back.appendChild(grid);
      }
    }

    article.appendChild(back);

    const actions = document.createElement("div");
    actions.className = "flashcard__actions";
    const revealButton = document.createElement("button");
    revealButton.type = "button";
    revealButton.className = "button button--wide";
    revealButton.dataset.action = "reveal-letter";
    revealButton.textContent = t("showAnswer");
    actions.appendChild(revealButton);
    article.appendChild(actions);

    const panel = document.createElement("div");
    panel.className = "rating-panel";
    panel.hidden = true;
    ["again", "hard", "good", "easy"].forEach((rating) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button--wide";
      button.dataset.action = "rate-letter";
      button.dataset.rating = rating;
      button.textContent = t(rating);
      panel.appendChild(button);
    });
    article.appendChild(panel);
    stage.appendChild(article);
  }

  function revealCurrentLetterCard() {
    const stage = document.getElementById("letter-flashcard-stage");
    if (!stage) return;
    const back = stage.querySelector(".letter-flashcard__back");
    const revealButton = stage.querySelector('[data-action="reveal-letter"]');
    const ratingPanel = stage.querySelector(".rating-panel");
    if (back) back.hidden = false;
    if (revealButton) revealButton.hidden = true;
    if (ratingPanel) ratingPanel.hidden = false;
    const card = flashcardSession?.due?.[flashcardSession.index];
    if (card) {
      mediaService.speakImmediate(
        card.promptText,
        state.settings.targetLanguage,
      );
    }
  }

  function renderLetterFlashcardFinished(stage) {
    clearExerciseHighlights();
    stage.innerHTML = "";
    const article = document.createElement("article");
    article.className = "letter-flashcard";
    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback is-correct";
    feedback.textContent = t("quizFinished");
    const actions = document.createElement("div");
    actions.className = "flashcard__actions";
    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.className = "button button--wide";
    restartButton.dataset.action = "restart-letter-flashcards";
    restartButton.textContent = t("buildRestart");
    actions.appendChild(restartButton);
    article.append(feedback, actions);
    stage.appendChild(article);
  }

  function renderLetterQuiz() {
    showView("letter-quiz");
    const view = elements["letter-quizView"];
    if (!view) return;
    view.innerHTML = "";

    if (!letterQuizSession) initLetterQuizSession();

    if (!letterQuizSession || !letterQuizSession.questions.length) {
      view.appendChild(exerciseHeader(t("letterQuiz"), "back-lesson"));
      view.appendChild(makeEmptyState(t("noItems")));
      return;
    }

    if (letterQuizSession.index < letterQuizSession.questions.length) {
      renderCurrentLetterQuizQuestion();
    } else {
      renderLetterQuizFinished();
    }
  }

  function initLetterQuizSession() {
    const poolIds = getItemPool("letter");
    const items = poolIds.map((id) => dataService.getItem(id)).filter(Boolean);

    if (items.length < 4) {
      letterQuizSession = {
        questions: [],
        index: 0,
        correct: 0,
        answered: false,
        selectedId: null,
      };
      return;
    }

    const shuffledItems = deterministicShuffle(items, `lq:${Date.now()}`);
    const questions = [];

    for (const targetItem of shuffledItems) {
      const distractors = [];
      const usedIds = new Set([targetItem.id]);

      const candidates = items.filter((i) => !usedIds.has(i.id));
      const shuffledCandidates = deterministicShuffle(
        candidates,
        `lq-d:${targetItem.id}`,
      );

      for (const cand of shuffledCandidates) {
        if (distractors.length >= 3) break;
        distractors.push(cand);
        usedIds.add(cand.id);
      }

      if (distractors.length < 3) continue;

      const options = [targetItem, ...distractors].map((item) => ({
        id: item.id,
        text: dataService.getText(item, state.settings.targetLanguage),
        isCorrect: item.id === targetItem.id,
      }));

      const shuffledOptions = deterministicShuffle(
        options,
        `lq-o:${targetItem.id}`,
      );

      questions.push({
        targetId: targetItem.id,
        targetText: dataService.getText(
          targetItem,
          state.settings.targetLanguage,
        ),
        options: shuffledOptions,
      });
    }

    letterQuizSession = {
      questions,
      index: 0,
      correct: 0,
      answered: false,
      selectedId: null,
    };
  }

  function renderCurrentLetterQuizQuestion() {
    const view = elements.letterQuizView;
    if (!view) return;
    view.innerHTML = "";

    const q = letterQuizSession.questions[letterQuizSession.index];
    if (!q) {
      renderLetterQuizFinished();
      return;
    }

    view.appendChild(exerciseHeader(t("letterQuiz"), "back-lesson"));

    const status = document.createElement("div");
    status.className = "quiz-status";
    status.textContent = `${letterQuizSession.index + 1} / ${letterQuizSession.questions.length}`;
    view.appendChild(status);

    const prompt = document.createElement("div");
    prompt.className = "letter-quiz-prompt";

    const promptText = document.createElement("span");
    promptText.textContent = t("selectAnswer");
    prompt.appendChild(promptText);

    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "button";
    playBtn.dataset.action = "letter-quiz-play";
    playBtn.textContent = "🔊";
    prompt.appendChild(playBtn);

    view.appendChild(prompt);

    const optionsGrid = document.createElement("div");
    optionsGrid.className = "letter-quiz-options";

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "letter-quiz-option";
      btn.dataset.action = "letter-quiz-answer";
      btn.dataset.itemId = opt.id;
      btn.textContent = opt.text;
      btn.lang = registry.bcp47(state.settings.targetLanguage);
      btn.dir = registry.dir(state.settings.targetLanguage);
      optionsGrid.appendChild(btn);
    });

    view.appendChild(optionsGrid);

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.hidden = true;
    feedback.id = "letter-quiz-feedback";
    view.appendChild(feedback);

    mediaService.speakImmediate(q.targetText, state.settings.targetLanguage);
  }

  function answerLetterQuiz(itemId) {
    if (!letterQuizSession || letterQuizSession.answered) return;

    const q = letterQuizSession.questions[letterQuizSession.index];
    if (!q) return;

    const isCorrect = itemId === q.targetId;

    letterQuizSession.answered = true;
    letterQuizSession.selectedId = itemId;
    if (isCorrect) letterQuizSession.correct++;

    const buttons = document.querySelectorAll(".letter-quiz-option");
    buttons.forEach((btn) => {
      btn.disabled = true;
      if (btn.dataset.itemId === q.targetId) btn.classList.add("is-correct");
      else if (btn.dataset.itemId === itemId && !isCorrect)
        btn.classList.add("is-incorrect");
    });

    const feedback = document.getElementById("letter-quiz-feedback");
    if (feedback) {
      feedback.hidden = false;
      feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
      feedback.textContent = isCorrect ? t("quizCorrect") : t("quizIncorrect");

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "button button--wide";
      nextBtn.dataset.action = "letter-quiz-next";
      nextBtn.textContent = t("quizNext");
      nextBtn.style.marginInlineStart = "auto";
      feedback.appendChild(nextBtn);
    }

    mediaService.speakImmediate(q.targetText, state.settings.targetLanguage);
  }

  function nextLetterQuizQuestion() {
    if (!letterQuizSession) return;
    letterQuizSession.index++;
    letterQuizSession.answered = false;
    letterQuizSession.selectedId = null;

    if (letterQuizSession.index >= letterQuizSession.questions.length) {
      renderLetterQuizFinished();
    } else {
      renderCurrentLetterQuizQuestion();
    }
  }

  function renderLetterQuizFinished() {
    const view = elements.letterQuizView;
    if (!view) return;
    view.innerHTML = "";

    view.appendChild(exerciseHeader(t("letterQuiz"), "back-lesson"));

    const article = document.createElement("article");
    article.className = "quiz-question";

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback is-correct";
    feedback.textContent = `${t("quizFinished")} ${t("quizScore")}: ${letterQuizSession.correct} / ${letterQuizSession.questions.length}`;

    const actions = document.createElement("div");
    actions.className = "quiz-options";

    const restartBtn = document.createElement("button");
    restartBtn.type = "button";
    restartBtn.className = "button button--wide";
    restartBtn.dataset.action = "letter-quiz-restart";
    restartBtn.textContent = t("quizRestart");
    actions.appendChild(restartBtn);

    article.append(feedback, actions);
    view.appendChild(article);
  }

  /* 
  function renderCurrentLetterSpell(view) {
    const wordData = letterSpellSession.words[letterSpellSession.index];
    const targetLang = state.settings.targetLanguage;
    const dir = registry.dir(targetLang);

    // Dynamic placeholder based on single letter vs multi-letter word
    const isSingleLetter = wordData.targetChips.length === 1;
    const placeholderText = isSingleLetter
      ? t("letterSpellSinglePlaceholder")
      : t("letterSpellPlaceholder");

    const status = document.createElement("div");
    status.className = "flashcard-status";
    status.textContent = `${letterSpellSession.index + 1} / ${letterSpellSession.words.length}`;
    view.appendChild(status);

    const promptArea = document.createElement("div");
    promptArea.className = "letter-spell-prompt";
    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "button letter-spell-play-btn";
    playBtn.dataset.action = "letter-spell-play";
    playBtn.textContent = "🔊";
    playBtn.setAttribute("aria-label", t("play"));
    promptArea.appendChild(playBtn);
    view.appendChild(promptArea);

    const targetArea = document.createElement("div");
    targetArea.className = "letter-spell-target";
    targetArea.dir = dir;
    if (wordData.selected.length === 0) {
      const placeholder = document.createElement("span");
      placeholder.className = "letter-spell-placeholder";
      placeholder.textContent = placeholderText;
      targetArea.appendChild(placeholder);
    } else {
      wordData.selected.forEach((chip) => {
        targetArea.appendChild(createLetterSpellChip(chip, true));
      });
    }
    view.appendChild(targetArea);

    const poolArea = document.createElement("div");
    poolArea.className = "letter-spell-pool";
    poolArea.dir = dir;
    const remainingChips = wordData.poolChips.filter(
      (c) => !wordData.selected.find((s) => s.id === c.id),
    );
    remainingChips.forEach((chip) => {
      poolArea.appendChild(createLetterSpellChip(chip, false));
    });
    view.appendChild(poolArea);

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.id = "letter-spell-feedback";
    feedback.hidden = true;
    view.appendChild(feedback);

    const actions = document.createElement("div");
    actions.className = "build-actions";
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "button button--wide";
    nextBtn.dataset.action = "letter-spell-next";
    nextBtn.textContent = t("quizNext");
    nextBtn.disabled = true;
    nextBtn.id = "letter-spell-next-btn";
    actions.appendChild(nextBtn);
    view.appendChild(actions);
  }
*/

  // ── Letter Spell (Audio Spelling) ──
  function getGraphemes(text, langCode) {
    if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
      try {
        const segmenter = new Intl.Segmenter(registry.bcp47(langCode), {
          granularity: "grapheme",
        });
        return Array.from(segmenter.segment(text)).map((s) => s.segment);
      } catch (e) {}
    }
    return Array.from(text);
  }

  function initLetterSpellSession() {
    const poolIds = getItemPool("letter");
    const items = poolIds.map((id) => dataService.getItem(id)).filter(Boolean);
    const targetLang = state.settings.targetLanguage;
    const validItems = items.filter((item) =>
      dataService.getText(item, targetLang).trim(),
    );

    if (!validItems.length) {
      letterSpellSession = { words: [], index: 0 };
      return;
    }

    // Collect all UNIQUE graphemes from the lesson to form the distractor pool
    const allGraphemes = [];
    const seen = new Set();
    validItems.forEach((item) => {
      const text = dataService.getText(item, targetLang);
      const graphemes = getGraphemes(text, targetLang);
      graphemes.forEach((g) => {
        if (!seen.has(g)) {
          seen.add(g);
          allGraphemes.push(g);
        }
      });
    });

    const words = validItems.map((item) => {
      const text = dataService.getText(item, targetLang);
      const graphemes = getGraphemes(text, targetLang);

      // Simplified: Target is just the single letter
      const targetChips = graphemes.map((g, i) => ({
        id: `${item.id}_${i}`,
        text: g,
      }));

      // Pool contains all unique letters from the lesson
      const poolChips = allGraphemes.map((g, i) => ({
        id: `pool_${i}_${g}`,
        text: g,
      }));

      return {
        itemId: item.id,
        text,
        targetChips,
        poolChips: deterministicShuffle(poolChips, `ls:${item.id}`),
        selected: [],
      };
    });

    letterSpellSession = { words, index: 0 };
  }

  function renderAudioSpell() {
    showView("letter-spell");
    const view = elements.letterSpellView;
    if (!view) return;

    view.innerHTML = "";
    view.appendChild(exerciseHeader(t("letterSpell"), "back-lesson"));

    if (!letterSpellSession) initLetterSpellSession();
    if (!letterSpellSession || !letterSpellSession.words.length) {
      view.appendChild(makeEmptyState(t("noItems")));
      return;
    }
    if (letterSpellSession.index >= letterSpellSession.words.length) {
      renderLetterSpellFinished(view);
      return;
    }

    // Create a dedicated stage container to isolate updates
    const stage = document.createElement("div");
    stage.id = "letter-spell-stage";
    stage.className = "build-stage";
    view.appendChild(stage);

    renderLetterSpellStage();

    // Speak the word ONLY on initial load / next word
    const wordData = letterSpellSession.words[letterSpellSession.index];
    mediaService.speakImmediate(wordData.text, state.settings.targetLanguage);
  }

  function renderLetterSpellStage() {
    const stage = document.getElementById("letter-spell-stage");
    if (!stage) return;
    stage.innerHTML = "";

    const wordData = letterSpellSession.words[letterSpellSession.index];
    const targetLang = state.settings.targetLanguage;
    const dir = registry.dir(targetLang);

    const status = document.createElement("div");
    status.className = "flashcard-status";
    status.textContent = `${letterSpellSession.index + 1} / ${letterSpellSession.words.length}`;
    stage.appendChild(status);

    // 1. Audio Prompt (NO text shown)
    const promptArea = document.createElement("div");
    promptArea.className = "letter-spell-prompt";
    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "button letter-spell-play-btn";
    playBtn.dataset.action = "letter-spell-play";
    playBtn.textContent = "🔊";
    playBtn.setAttribute("aria-label", t("play"));
    promptArea.appendChild(playBtn);
    stage.appendChild(promptArea);

    // 2. Target Build Area
    const targetArea = document.createElement("div");
    targetArea.className = "letter-spell-target";
    targetArea.dir = dir; // RTL enforcement

    if (wordData.selected.length === 0) {
      const placeholder = document.createElement("span");
      placeholder.className = "letter-spell-placeholder";
      placeholder.textContent = t("letterSpellSinglePlaceholder");
      targetArea.appendChild(placeholder);
    } else {
      wordData.selected.forEach((chip) => {
        targetArea.appendChild(createLetterSpellChip(chip, true));
      });
    }
    stage.appendChild(targetArea);

    // 3. Shuffled Pool
    const poolArea = document.createElement("div");
    poolArea.className = "letter-spell-pool";
    poolArea.dir = dir; // RTL enforcement

    const remainingChips = wordData.poolChips.filter(
      (c) => !wordData.selected.find((s) => s.id === c.id),
    );
    remainingChips.forEach((chip) => {
      poolArea.appendChild(createLetterSpellChip(chip, false));
    });
    stage.appendChild(poolArea);

    // 4. Feedback & Next
    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.id = "letter-spell-feedback";
    feedback.hidden = true;
    stage.appendChild(feedback);

    const actions = document.createElement("div");
    actions.className = "build-actions";
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "button button--wide";
    nextBtn.dataset.action = "letter-spell-next";
    nextBtn.textContent = t("quizNext");
    nextBtn.disabled = true;
    nextBtn.id = "letter-spell-next-btn";
    actions.appendChild(nextBtn);
    stage.appendChild(actions);
  }

  function createLetterSpellChip(chip, isInTarget) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "build-chip letter-spell-chip";
    btn.dataset.action = isInTarget
      ? "letter-spell-remove"
      : "letter-spell-add";
    btn.dataset.chipId = chip.id;

    const text = document.createElement("span");
    text.className = "build-chip__text";
    text.textContent = chip.text;
    btn.appendChild(text);

    if (isInTarget) {
      const remove = document.createElement("span");
      remove.className = "build-chip__remove";
      remove.textContent = "\u2715";
      btn.appendChild(remove);
    }
    return btn;
  }

  function letterSpellAddChip(chipId) {
    const wordData = letterSpellSession.words[letterSpellSession.index];
    if (!wordData) return;
    const chip = wordData.poolChips.find((c) => c.id === chipId);
    if (!chip || wordData.selected.find((s) => s.id === chipId)) return;

    wordData.selected.push(chip);
    mediaService.speakImmediate(chip.text, state.settings.targetLanguage);

    // ONLY update the stage, preserving the header and preventing DOM duplication
    renderLetterSpellStage();
    validateLetterSpell();
  }

  function letterSpellRemoveChip(chipId) {
    const wordData = letterSpellSession.words[letterSpellSession.index];
    if (!wordData) return;
    const idx = wordData.selected.findIndex((c) => c.id === chipId);
    if (idx !== -1) {
      wordData.selected.splice(idx, 1);
      renderLetterSpellStage();

      const feedback = document.getElementById("letter-spell-feedback");
      if (feedback) feedback.hidden = true;
      const nextBtn = document.getElementById("letter-spell-next-btn");
      if (nextBtn) nextBtn.disabled = true;
    }
  }

  function validateLetterSpell() {
    const wordData = letterSpellSession.words[letterSpellSession.index];
    if (!wordData) return;

    // Since it's simplified to single letter selection, we just check if the selected chip matches the target
    if (wordData.selected.length !== wordData.targetChips.length) return;

    const isCorrect = wordData.selected.every(
      (chip, i) => chip.text === wordData.targetChips[i].text,
    );

    const feedback = document.getElementById("letter-spell-feedback");
    const nextBtn = document.getElementById("letter-spell-next-btn");

    if (feedback) {
      feedback.hidden = false;
      feedback.classList.remove("is-correct", "is-incorrect");
      if (isCorrect) {
        feedback.classList.add("is-correct");
        feedback.textContent = t("quizCorrect");
        if (nextBtn) nextBtn.disabled = false;
      } else {
        feedback.classList.add("is-incorrect");
        feedback.textContent = t("buildIncorrect");
        // Clear selection on incorrect to allow retry
        wordData.selected = [];
        renderLetterSpellStage();
      }
    }
  }

  function nextLetterSpell() {
    if (!letterSpellSession) return;
    letterSpellSession.index++;
    renderAudioSpell();
  }

  function renderLetterSpellFinished(view) {
    view.innerHTML = "";
    view.appendChild(exerciseHeader(t("letterSpell"), "back-lesson"));

    const article = document.createElement("article");
    article.className = "quiz-question";

    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback is-correct";
    feedback.textContent = t("quizFinished");

    const actions = document.createElement("div");
    actions.className = "quiz-options";
    const restartBtn = document.createElement("button");
    restartBtn.type = "button";
    restartBtn.className = "button button--wide";
    restartBtn.dataset.action = "letter-spell-restart";
    restartBtn.textContent = t("quizRestart");
    actions.appendChild(restartBtn);

    article.append(feedback, actions);
    view.appendChild(article);
  }
  function rateCurrentLetterCard(rating) {
    const card = flashcardSession?.due?.[flashcardSession.index];
    if (!card) return;
    // Still record to SRS for progress tracking, but don't filter by it.
    srsService.rateCard(card, rating);
    nextLetterFlashcard();
  }

  function nextLetterFlashcard() {
    if (!flashcardSession) return;
    flashcardSession.index += 1;
    const stage = document.getElementById("letter-flashcard-stage");
    if (flashcardSession.index >= flashcardSession.due.length) {
      if (stage) renderLetterFlashcardFinished(stage);
      return;
    }
    renderCurrentLetterFlashcard();
  }

  function buildGrammarQuizSession(
    questions,
    questionLanguage,
    answerLanguage,
  ) {
    const qs = questions.map((q) => {
      const qText = q.question[questionLanguage] || q.question.en || "";
      const options = q.options.map((opt, idx) => ({
        itemId: `${q.id}_opt_${idx}`,
        text: opt.text[answerLanguage] || opt.text.en || "",
        dir: registry.dir(answerLanguage),
        bcp47: registry.bcp47(answerLanguage),
        isCorrect: idx === q.correctOptionIndex,
      }));
      const shuffledOptions = deterministicShuffle(options, `gq:${q.id}`);
      const correctOpt = shuffledOptions.find((o) => o.isCorrect);
      return {
        questionId: q.id,
        itemId: q.id,
        itemKind: "word",
        questionLanguage,
        answerLanguage,
        questionText: qText,
        questionDir: registry.dir(questionLanguage),
        questionBcp47: registry.bcp47(questionLanguage),
        answerItemId: correctOpt ? correctOpt.itemId : "",
        answerText: correctOpt ? correctOpt.text : "",
        answerDir: registry.dir(answerLanguage),
        answerBcp47: registry.bcp47(answerLanguage),
        options: shuffledOptions,
      };
    });
    return {
      questions: qs,
      stats: { questions: qs.length },
      questionLanguage,
      answerLanguage,
      reason: "",
    };
  }

  function renderQuiz() {
    showView("quiz");
    const view = elements.quizView;
    view.innerHTML = "";

    const isGQ = quizSession?.isGrammarQuiz;
    const headerTitle = isGQ
      ? t("grammarQuiz")
      : quizKind === "sentence"
        ? t("sentenceQuiz")
        : t("wordQuiz");

    view.appendChild(exerciseHeader(headerTitle, "back-lesson"));

    const langs = selectedLessonLanguages();
    const settingsOpen = langs.length < 2 || exerciseSettingsOpen;
    ensureExerciseConfigs();

    const config = document.createElement("div");
    config.className = "exercise-config";
    config.appendChild(
      configRow(
        t("questionLanguage"),
        buildLanguageSelect(langs, quizConfig.questionLanguage, (value) => {
          quizConfig.questionLanguage = value;
          if (quizConfig.answerLanguage === value)
            quizConfig.answerLanguage =
              langs.find((code) => code !== value) || "";
          quizSession = null;
          renderQuiz();
        }),
      ),
    );
    config.appendChild(
      configRow(
        t("answerLanguage"),
        buildLanguageSelect(
          langs.filter((code) => code !== quizConfig.questionLanguage),
          quizConfig.answerLanguage,
          (value) => {
            quizConfig.answerLanguage = value;
            quizSession = null;
            renderQuiz();
          },
        ),
      ),
    );
    view.appendChild(renderExerciseSettingsPanel(settingsOpen, config));

    const stage = document.createElement("div");
    stage.id = "quiz-stage";
    stage.className = "quiz-stage";
    view.appendChild(stage);

    if (langs.length < 2) {
      showStageMessage(stage, t("selectTwoLanguages"));
      return;
    }

    if (isGQ) {
      if (quizSession.index < quizSession.session.questions.length)
        renderCurrentQuizQuestion();
      else renderQuizFinished();
    } else {
      if (!quizSession) startQuiz();
      else if (quizSession.index < quizSession.session.questions.length)
        renderCurrentQuizQuestion();
      else renderQuizFinished();
    }
  }

  function startQuiz() {
    ensureExerciseConfigs();
    const stage = document.getElementById("quiz-stage");
    if (!stage) return;
    const questionLanguage = quizConfig.questionLanguage;
    const answerLanguage = quizConfig.answerLanguage;
    if (
      !registry.has(questionLanguage) ||
      !registry.has(answerLanguage) ||
      questionLanguage === answerLanguage
    ) {
      showStageMessage(stage, t("quizSelectAnswerLanguage"));
      return;
    }
    resetQuizSessionSeed();
    const session = quizService.buildSession({
      itemIds: getItemPool(quizKind),
      questionLanguage,
      answerLanguage,
      seed: quizSessionSeed,
    });
    stage.innerHTML = "";
    if (session.reason === "notEnoughOptions") {
      showStageMessage(stage, t("quizNotEnoughOptions"));
      return;
    }
    if (!session.questions.length) {
      showStageMessage(stage, t("quizNoQuestions"));
      return;
    }
    quizSession = {
      session,
      index: 0,
      correct: 0,
      answered: false,
      selectedItemId: "",
      incorrectQuestions: [],
    };
    renderCurrentQuizQuestion();
  }
  function updateQuizStatus() {
    const statusEl = document.getElementById("quiz-status");
    if (!statusEl || !quizSession) return;
    const total = quizSession.session.questions.length;
    const current = Math.min(quizSession.index + 1, total);
    statusEl.textContent = `${current} / ${total} \xB7 ${t("quizScore")}: ${quizSession.correct}`;
  }
  function renderCurrentQuizQuestion() {
    const stage = document.getElementById("quiz-stage");
    if (!stage) return;
    clearExerciseHighlights();
    stage.innerHTML = "";
    const question = quizSession?.session?.questions?.[quizSession.index];
    if (!question) {
      renderQuizFinished();
      return;
    }
    const status = document.createElement("div");
    status.className = "quiz-status";
    status.id = "quiz-status";
    stage.appendChild(status);
    updateQuizStatus();
    const article = document.createElement("article");
    article.className = "quiz-question";
    article.dataset.itemId = question.itemId;
    const isSentence = question.itemKind === "sentence";
    const questionItem = dataService.getItem(question.itemId);
    const questionLine = isSentence
      ? createSentenceTextLine(
          questionItem,
          question.questionText,
          question.questionLanguage,
          ["quiz-question__line"],
        )
      : createTextLine(
          question.questionText,
          question.questionLanguage,
          ["quiz-question__line"],
          questionItem,
        );
    if (!questionLine) {
      showStageMessage(stage, t("quizNoQuestions"));
      return;
    }
    article.appendChild(questionLine);
    const optionsTitle = document.createElement("h3");
    optionsTitle.className = "quiz-options-title";
    optionsTitle.textContent = t("selectAnswer");
    article.appendChild(optionsTitle);
    const options = document.createElement("div");
    options.className = "quiz-options";
    question.options.forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "quiz-option";
      button.dataset.action = "quiz-answer";
      button.dataset.itemId = option.itemId;
      button.dir = option.dir;
      const text = document.createElement("span");
      text.className = "quiz-option__text";
      text.lang = option.bcp47;
      text.dir = option.dir;
      if (isSentence) {
        const optionItem = dataService.getItem(option.itemId);
        const container = document.createElement("span");
        container.className = "sentence-text";
        if (registry.segmentation(question.answerLanguage) === "segmenter")
          container.classList.add("sentence-text--compact");
        const tokens = optionItem
          ? dataService.tokenize(optionItem, question.answerLanguage)
          : [];
        if (tokens.length) {
          tokens.forEach((token) => {
            const tokenEl = document.createElement("span");
            tokenEl.className = "sentence-token";
            tokenEl.dataset.tokenId = String(token.id);
            tokenEl.lang = option.bcp47;
            tokenEl.textContent = token.text;
            container.appendChild(tokenEl);
          });
        } else {
          container.textContent = option.text;
        }
        text.appendChild(container);
      } else {
        text.textContent = option.text;
      }
      button.appendChild(text);
      options.appendChild(button);
    });
    article.appendChild(options);
    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";
    feedback.hidden = true;
    feedback.setAttribute("role", "status");
    article.appendChild(feedback);
    stage.appendChild(article);
    if (quizSession.answered && quizSession.selectedItemId)
      applyQuizAnswerUI(quizSession.selectedItemId);
    else if (
      questionLine &&
      question.questionText &&
      question.questionText.trim()
    )
      speakLineWithHighlight(
        questionLine,
        question.questionText,
        question.questionLanguage,
      );
  }
  function applyQuizAnswerUI(answerItemId) {
    const question = quizSession.session.questions[quizSession.index];
    if (!question) return;
    const stage = document.getElementById("quiz-stage");
    if (!stage) return;
    const isCorrect = answerItemId === question.answerItemId;
    const optionButtons = Array.from(
      stage.querySelectorAll('[data-action="quiz-answer"]'),
    );
    optionButtons.forEach((button) => {
      if (button.dataset.itemId === question.answerItemId)
        button.classList.add("is-correct");
      else if (button.dataset.itemId === answerItemId && !isCorrect)
        button.classList.add("is-incorrect");
    });
    const feedback = stage.querySelector(".quiz-feedback");
    if (feedback) {
      feedback.hidden = false;
      feedback.classList.add(isCorrect ? "is-correct" : "is-incorrect");
      const message = document.createElement("span");
      message.textContent = t(isCorrect ? "quizCorrect" : "quizIncorrect");
      const nextButton = document.createElement("button");
      nextButton.type = "button";
      nextButton.className = "button button--wide";
      nextButton.dataset.action = "quiz-next";
      nextButton.textContent = t("quizNext");
      feedback.append(message, nextButton);
    }
  }
  function answerQuiz(answerItemId) {
    const question = quizSession?.session?.questions?.[quizSession.index];
    if (!question) return;

    if (quizSession.answered) {
      const clickedOption = question.options.find(
        (option) => option.itemId === answerItemId,
      );
      const spokenText = String(clickedOption?.text || "").trim();
      if (spokenText) {
        if (question.itemKind === "sentence") {
          const optionEl =
            document.querySelector(
              `#quiz-stage .quiz-option[data-item-id="${cssEscape(answerItemId)}"]`,
            ) || null;
          speakLineWithHighlight(optionEl, spokenText, question.answerLanguage);
        } else {
          mediaService.speakImmediate(spokenText, question.answerLanguage);
        }
      }
      return;
    }

    quizSession.answered = true;
    quizSession.selectedItemId = answerItemId;
    const isCorrect = answerItemId === question.answerItemId;
    if (isCorrect) quizSession.correct += 1;
    else {
      if (!quizSession.incorrectQuestions) quizSession.incorrectQuestions = [];
      quizSession.incorrectQuestions.push(question);
    }
    applyQuizAnswerUI(answerItemId);
    quizProgressService.recordAnswer({
      itemId: question.itemId,
      questionLanguage: question.questionLanguage,
      answerLanguage: question.answerLanguage,
      correct: isCorrect,
    });
    const clickedOption = question.options.find(
      (option) => option.itemId === answerItemId,
    );
    const spokenText = String(
      clickedOption?.text || question.answerText || "",
    ).trim();
    if (spokenText) {
      if (question.itemKind === "sentence") {
        const optionEl =
          document.querySelector(
            `#quiz-stage .quiz-option[data-item-id="${cssEscape(answerItemId)}"]`,
          ) || null;
        speakLineWithHighlight(optionEl, spokenText, question.answerLanguage);
      } else mediaService.speakImmediate(spokenText, question.answerLanguage);
    }
    updateQuizStatus();
  }

  function nextQuizQuestion() {
    if (!quizSession || !quizSession.answered) return;
    quizSession.index += 1;
    quizSession.answered = false;
    quizSession.selectedItemId = "";
    if (quizSession.index >= quizSession.session.questions.length) {
      renderQuizFinished();
      return;
    }
    renderCurrentQuizQuestion();
  }

  function renderQuizFinished() {
    const stage = document.getElementById("quiz-stage");
    if (!stage) return;
    clearExerciseHighlights();
    stage.innerHTML = "";

    const total = quizSession?.session?.questions?.length || 0;
    const correct = quizSession?.correct || 0;
    const hasIncorrect = (quizSession?.incorrectQuestions || []).length > 0;

    const article = document.createElement("article");
    article.className = "quiz-question";
    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";

    if (quizSession.isGrammarQuiz) {
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
      const milestoneId = quizSession.milestoneId;
      let progress = milestoneService.getProgress();
      if (!progress) progress = milestoneService.initializeProgress();
      if (!progress[milestoneId])
        progress[milestoneId] = {
          state: "UNLOCKED",
          completed_via: null,
          completed_at: null,
        };

      const gq = progress[milestoneId].grammar_quiz || {
        best_accuracy: 0,
        attempts: 0,
        passed: false,
      };
      gq.attempts += 1;
      gq.best_accuracy = Math.max(gq.best_accuracy, accuracy);
      const milestoneData = (manifest?.milestones || []).find(
        (m) => m.id === milestoneId,
      );
      const requiredPct =
        milestoneData?.unlock_requirements?.grammar_quiz_pass_pct || 80;
      gq.passed = gq.best_accuracy >= requiredPct;

      progress[milestoneId].grammar_quiz = gq;
      milestoneService.saveProgress(progress);
      feedback.textContent = `${t("quizFinished")} Accuracy: ${accuracy}%. Best: ${gq.best_accuracy}%. ${gq.passed ? "PASSED!" : `Need ${requiredPct}% to pass.`}`;
      milestoneService.evaluateAutoCompletion(milestoneId);
    } else {
      feedback.textContent = `${t("quizFinished")} ${t("quizScore")}: ${correct} / ${total}`;
    }

    const actions = document.createElement("div");
    actions.className = "quiz-options";

    if (quizSession.isGrammarQuiz) {
      const backBtn = document.createElement("button");
      backBtn.type = "button";
      backBtn.className = "button button--wide";
      backBtn.dataset.action = "back-lesson";
      backBtn.textContent = t("back");
      actions.appendChild(backBtn);

      const retryBtn = document.createElement("button");
      retryBtn.type = "button";
      retryBtn.className = "button button--wide";
      retryBtn.dataset.action = "grammar-quiz-retry";
      retryBtn.textContent = t("quizRetry");
      actions.appendChild(retryBtn);
    } else if (hasIncorrect) {
      const retryButton = document.createElement("button");
      retryButton.type = "button";
      retryButton.className = "button button--wide";
      retryButton.dataset.action = "quiz-retry";
      retryButton.textContent = t("quizRetry");
      actions.appendChild(retryButton);
    } else {
      const restartButton = document.createElement("button");
      restartButton.type = "button";
      restartButton.className = "button button--wide";
      restartButton.dataset.action = "quiz-restart";
      restartButton.textContent = t("quizRestart");
      actions.appendChild(restartButton);
    }

    article.append(feedback, actions);
    stage.appendChild(article);
  }

  function restartQuiz() {
    resetQuizSessionSeed();
    startQuiz();
  }
  function retryQuiz() {
    if (!quizSession || !(quizSession.incorrectQuestions || []).length) return;
    const questions = quizSession.incorrectQuestions;
    quizSession = {
      session: {
        questions,
        stats: { questions: questions.length },
        questionLanguage: quizSession.session.questionLanguage,
        answerLanguage: quizSession.session.answerLanguage,
        reason: "",
      },
      index: 0,
      correct: 0,
      answered: false,
      selectedItemId: "",
      incorrectQuestions: [],
    };
    renderCurrentQuizQuestion();
  }
  function ensureBuildConfig() {
    const langs = selectedLessonLanguages();
    const appLang = state.settings.appLanguage;
    if (!buildConfig) {
      const saved = loadJSON(STORAGE_KEYS.buildLanguages, {});
      buildConfig = {
        displayLanguage:
          typeof saved?.displayLanguage === "string"
            ? saved.displayLanguage
            : "",
        buildLanguage:
          typeof saved?.buildLanguage === "string" ? saved.buildLanguage : "",
      };
    }
    let changed = false;
    if (!langs.includes(buildConfig.displayLanguage)) {
      buildConfig.displayLanguage = langs.includes(appLang)
        ? appLang
        : langs[0] || "";
      changed = true;
    }
    if (
      !langs.includes(buildConfig.buildLanguage) ||
      buildConfig.buildLanguage === buildConfig.displayLanguage
    ) {
      const targetLang = state.settings.targetLanguage;
      const next =
        langs.find(
          (code) => code !== buildConfig.displayLanguage && code === targetLang,
        ) ||
        langs.find((code) => code !== buildConfig.displayLanguage) ||
        "";
      if (buildConfig.buildLanguage !== next) changed = true;
      buildConfig.buildLanguage = next;
    }
    return changed;
  }
  function saveBuildConfig() {
    saveJSON(STORAGE_KEYS.buildLanguages, {
      displayLanguage: buildConfig.displayLanguage,
      buildLanguage: buildConfig.buildLanguage,
    });
  }
  function getBuildTargetTokens(item, code) {
    const explicit = dataService.getExplicitTokens(item, code);
    if (Array.isArray(explicit) && explicit.length > 0)
      return explicit
        .map((token) => (typeof token === "string" ? token : token?.text || ""))
        .map((text) => String(text).trim())
        .filter(Boolean);
    return dataService.tokenize(item, code).map((token) => token.text);
  }
  function buildEligibleSentenceIds() {
    return getItemPool("sentence").filter((id) => {
      const item = dataService.getItem(id);
      return (
        dataService.hasText(item, buildConfig.displayLanguage) &&
        getBuildTargetTokens(item, buildConfig.buildLanguage).length > 0
      );
    });
  }
  function startBuildSession() {
    buildSession = { itemIds: buildEligibleSentenceIds(), index: 0 };
    buildCurrent = null;
  }
  function loadBuildSentence() {
    const itemId = buildSession.itemIds[buildSession.index];
    const item = dataService.getItem(itemId);
    const texts = getBuildTargetTokens(item, buildConfig.buildLanguage);
    const chips = texts.map((text, index) => ({ id: index, text }));
    const order = deterministicShuffle(
      chips.map((chip) => chip.id),
      `build:${itemId}:${buildConfig.buildLanguage}`,
    );
    buildCurrent = { itemId, chips, selected: [], poolOrder: order };
  }
  function renderBuildSentence() {
    showView("build");
    const view = elements.buildView;
    view.innerHTML = "";
    view.appendChild(exerciseHeader(t("buildSentence"), "back-lesson"));
    const langs = selectedLessonLanguages();
    const settingsOpen = langs.length < 2 || exerciseSettingsOpen;
    const changed = ensureBuildConfig();
    const isInitialRender = !buildSession;
    const config = document.createElement("div");
    config.className = "exercise-config";
    config.appendChild(
      configRow(
        t("primaryLanguage"),
        buildLanguageSelect(langs, buildConfig.displayLanguage, (value) => {
          buildConfig.displayLanguage = value;
          if (buildConfig.buildLanguage === value)
            buildConfig.buildLanguage = langs.find((c) => c !== value) || "";
          saveBuildConfig();
          startBuildSession();
          renderBuildSentence();
        }),
      ),
    );
    config.appendChild(
      configRow(
        t("secondaryLanguage"),
        buildLanguageSelect(
          langs.filter((code) => code !== buildConfig.displayLanguage),
          buildConfig.buildLanguage,
          (value) => {
            buildConfig.buildLanguage = value;
            saveBuildConfig();
            startBuildSession();
            renderBuildSentence();
          },
        ),
      ),
    );
    view.appendChild(renderExerciseSettingsPanel(settingsOpen, config));
    const stage = document.createElement("div");
    stage.id = "build-stage";
    stage.className = "build-stage";
    view.appendChild(stage);
    if (langs.length < 2) {
      showStageMessage(stage, t("selectTwoLanguages"));
      return;
    }
    if (changed || !buildSession) startBuildSession();
    renderBuildStage();
    if (isInitialRender && buildCurrent) {
      const item = dataService.getItem(buildCurrent.itemId);
      if (item) {
        const displayText = dataService.getText(
          item,
          buildConfig.displayLanguage,
        );
        const displayLine = document.querySelector(
          "#build-stage .build-display",
        );
        if (displayLine && displayText && displayText.trim())
          speakLineWithHighlight(
            displayLine,
            displayText,
            buildConfig.displayLanguage,
          );
      }
    }
  }
  function createBuildChip(chipId, isSelected) {
    const chip = buildCurrent.chips[chipId];
    const buildCode = buildConfig.buildLanguage;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "build-chip";
    button.dataset.action = isSelected ? "build-remove" : "build-add";
    button.dataset.chipId = String(chipId);
    const text = document.createElement("span");
    text.className = "build-chip__text";
    text.lang = registry.bcp47(buildCode);
    text.textContent = chip.text;
    button.appendChild(text);
    if (isSelected) {
      const remove = document.createElement("span");
      remove.className = "build-chip__remove";
      remove.textContent = "\u2715";
      button.appendChild(remove);
    }
    return button;
  }
  function renderBuildStage() {
    const stage = document.getElementById("build-stage");
    if (!stage) return;
    stage.innerHTML = "";
    if (!buildSession || !buildSession.itemIds.length) {
      showStageMessage(stage, t("buildNoSentences"));
      return;
    }
    if (buildSession.index >= buildSession.itemIds.length) {
      renderBuildFinished(stage);
      return;
    }
    if (
      !buildCurrent ||
      buildCurrent.itemId !== buildSession.itemIds[buildSession.index]
    )
      loadBuildSentence();
    const item = dataService.getItem(buildCurrent.itemId);
    const displayCode = buildConfig.displayLanguage;
    const buildCode = buildConfig.buildLanguage;
    const status = document.createElement("div");
    status.className = "flashcard-status";
    status.textContent = `${buildSession.index + 1} / ${buildSession.itemIds.length}`;
    stage.appendChild(status);
    const displayText = dataService.getText(item, displayCode);
    const displayLine = createSentenceTextLine(item, displayText, displayCode, [
      "build-display",
    ]);
    if (displayLine) stage.appendChild(displayLine);
    const heading = document.createElement("h3");
    heading.className = "quiz-options-title";
    heading.textContent = t("yourSentence");
    stage.appendChild(heading);
    const sentenceArea = document.createElement("div");
    sentenceArea.className = "build-sentence";
    sentenceArea.dir = registry.dir(buildCode);
    if (!buildCurrent.selected.length) {
      const placeholder = document.createElement("span");
      placeholder.className = "build-placeholder";
      placeholder.textContent = t("buildPlaceholder");
      sentenceArea.appendChild(placeholder);
    } else {
      buildCurrent.selected.forEach((chipId) =>
        sentenceArea.appendChild(createBuildChip(chipId, true)),
      );
    }
    stage.appendChild(sentenceArea);
    const pool = document.createElement("div");
    pool.className = "build-pool";
    pool.dir = registry.dir(buildCode);
    buildCurrent.poolOrder
      .filter((chipId) => !buildCurrent.selected.includes(chipId))
      .forEach((chipId) => pool.appendChild(createBuildChip(chipId, false)));
    stage.appendChild(pool);
    if (buildCurrent.selected.length === buildCurrent.chips.length) {
      const correct = isBuildSentenceCorrect();
      const feedback = document.createElement("div");
      feedback.className = "quiz-feedback";
      feedback.classList.add(correct ? "is-correct" : "is-incorrect");
      feedback.textContent = t(correct ? "buildCorrect" : "buildIncorrect");
      stage.appendChild(feedback);
    }
    const actions = document.createElement("div");
    actions.className = "build-actions";
    const hintButton = document.createElement("button");
    hintButton.type = "button";
    hintButton.className = "button button--wide";
    hintButton.dataset.action = "build-hint";
    hintButton.textContent = t("hint");
    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "button button--wide";
    nextButton.dataset.action = "build-next";
    nextButton.textContent = t("quizNext");
    actions.append(hintButton, nextButton);
    stage.appendChild(actions);
  }
  function renderBuildFinished(stage) {
    clearExerciseHighlights();
    const article = document.createElement("article");
    article.className = "quiz-question";
    const feedback = document.createElement("div");
    feedback.className = "quiz-feedback";

    feedback.textContent = t("buildFinished");
    const actions = document.createElement("div");
    actions.className = "quiz-options";
    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.className = "button button--wide";
    restartButton.dataset.action = "build-restart";
    restartButton.textContent = t("buildRestart");
    actions.appendChild(restartButton);
    article.append(feedback, actions);
    stage.appendChild(article);
  }
  function showBuildSentence() {
    loadBuildSentence();
    renderBuildStage();
    const item = dataService.getItem(buildCurrent.itemId);
    const text = dataService.getText(item, buildConfig.displayLanguage);
    const lineEl = document.querySelector("#build-stage .build-display");
    if (lineEl && text.trim())
      speakLineWithHighlight(lineEl, text, buildConfig.displayLanguage);
  }
  function buildAddChip(chipId) {
    if (!buildCurrent || buildCurrent.selected.includes(chipId)) return;
    buildCurrent.selected.push(chipId);
    mediaService.speakImmediate(
      buildCurrent.chips[chipId].text,
      buildConfig.buildLanguage,
    );
    renderBuildStage();
  }
  function buildRemoveChip(chipId) {
    if (!buildCurrent) return;
    const position = buildCurrent.selected.indexOf(chipId);
    if (position < 0) return;
    buildCurrent.selected.splice(position, 1);
    mediaService.speakImmediate(
      buildCurrent.chips[chipId].text,
      buildConfig.buildLanguage,
    );
    renderBuildStage();
  }
  function buildHint() {
    if (!buildCurrent) return;
    const total = buildCurrent.chips.length;
    if (buildCurrent.selected.length >= total) return;
    const newLength = buildCurrent.selected.length + 1;
    buildCurrent.selected = Array.from({ length: newLength }, (_, i) => i);
    mediaService.speakImmediate(
      buildCurrent.chips[newLength - 1].text,
      buildConfig.buildLanguage,
    );
    renderBuildStage();
  }
  function normalizeBuildToken(text) {
    return String(text)
      .toLowerCase()
      .replace(/[\p{P}\p{S}]/gu, " ")
      .trim();
  }
  function isBuildSentenceCorrect() {
    if (!buildCurrent) return false;
    return buildCurrent.selected.every(
      (chipId, index) =>
        normalizeBuildToken(buildCurrent.chips[chipId].text) ===
        normalizeBuildToken(buildCurrent.chips[index].text),
    );
  }
  function buildNext() {
    if (!buildSession) return;
    buildSession.index += 1;
    if (buildSession.index >= buildSession.itemIds.length) {
      renderBuildStage();
      return;
    }
    showBuildSentence();
  }
  function buildRestart() {
    startBuildSession();
    if (!buildSession.itemIds.length) {
      renderBuildStage();
      return;
    }
    showBuildSentence();
  }
  function detectOs() {
    const ua = String(navigator.userAgent || "");
    if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
    if (/Android/i.test(ua)) return "android";
    if (/Macintosh|MacIntel|MacPPC/i.test(ua)) {
      if (
        typeof navigator.maxTouchPoints === "number" &&
        navigator.maxTouchPoints > 1
      )
        return "ios";
      return "macos";
    }
    if (/Windows/i.test(ua)) return "windows";
    if (/Linux/i.test(ua)) return "linux";
    return "linux";
  }
  function voiceTestLanguages() {
    return registry
      .allCodes()
      .filter((code) => state.lessonLanguages.includes(code));
  }
  function voiceTestMessage(code) {
    const language = registry.getLanguage(code);
    const endonym = language?.names?.[code] || language?.label || code;
    const template = VOICE_TEST_MESSAGES[code] || VOICE_TEST_MESSAGES.en;
    return template.replace("{language}", endonym);
  }
  function renderVoiceTest() {
    stopVoiceTestPlayback();
    refreshVoices();
    showView("voicetest");
    const view = elements.voicetestView;
    view.innerHTML = "";
    view.appendChild(exerciseHeader(t("testVoices"), voiceTestReturn));
    const langSection = document.createElement("div");
    langSection.className = "sheet-section";
    const langTitle = document.createElement("h3");
    langTitle.className = "sheet-section__title";
    langTitle.textContent = t("languages");
    langSection.appendChild(langTitle);
    const list = renderLanguageCheckboxList(
      registry.allCodes(),
      setLessonLanguageEnabled,
    );
    langSection.appendChild(list);
    view.appendChild(langSection);
    const langs = voiceTestLanguages();
    if (langs.length < 2) {
      view.appendChild(makeEmptyState(t("selectTwoLanguages")));
      return;
    }
    const results = document.createElement("div");
    results.className = "sheet-section";
    const resultsTitle = document.createElement("h3");
    resultsTitle.className = "sheet-section__title";
    resultsTitle.textContent = t("testVoices");
    results.appendChild(resultsTitle);
    const available = [];
    const missing = [];
    langs.forEach((code) => {
      const hasVoice = mediaService.voicesForLanguage(code).length > 0;
      if (hasVoice) available.push(code);
      else missing.push(code);
      const row = document.createElement("div");
      row.className = "sheet-field";
      const labelEl = document.createElement("span");
      labelEl.className = "voice-row__label";
      labelEl.textContent = `${flagEmoji(code)} ${languageDisplayName(code)} — ${t(hasVoice ? "voiceAvailableStatus" : "voiceMissingStatus")}`;
      row.appendChild(labelEl);
      results.appendChild(row);
    });
    const controls = document.createElement("div");
    controls.className = "flashcard__actions";
    const playButton = document.createElement("button");
    playButton.type = "button";
    playButton.className = "button button--wide";
    playButton.dataset.action = "voice-test-play";
    playButton.textContent = t("playVoiceTest");
    playButton.disabled = available.length === 0;
    const stopButton = document.createElement("button");
    stopButton.type = "button";
    stopButton.className = "button button--wide";
    stopButton.dataset.action = "voice-test-stop";
    stopButton.textContent = t("stop");
    stopButton.disabled = true;
    controls.append(playButton, stopButton);
    results.appendChild(controls);
    view.appendChild(results);
    if (missing.length) view.appendChild(renderVoiceInstructions(missing));
  }
  function renderVoiceInstructions(missing) {
    if (!VOICE_OS_INSTRUCTIONS[voiceTestOs]) voiceTestOs = detectOs();
    const section = document.createElement("div");
    section.className = "sheet-section";
    const title = document.createElement("h3");
    title.className = "sheet-section__title";
    title.textContent = t("voiceInstallTitle");
    section.appendChild(title);
    const intro = document.createElement("p");
    intro.className = "voice-row__label";
    intro.textContent = `${t("voiceInstallIntro")} (${missing.map((code) => languageDisplayName(code)).join(", ")})`;
    section.appendChild(intro);
    const deviceRow = document.createElement("div");
    deviceRow.className = "sheet-field";
    const deviceLabel = document.createElement("span");
    deviceLabel.className = "voice-row__label";
    deviceLabel.textContent = t("device");
    const select = document.createElement("select");
    select.className = "select";
    VOICE_OS_LABELS.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      select.appendChild(option);
    });
    select.value = voiceTestOs;
    select.addEventListener("change", () => {
      voiceTestOs = select.value;
      renderVoiceTest();
    });
    deviceRow.append(deviceLabel, select);
    section.appendChild(deviceRow);
    const osLabel =
      VOICE_OS_LABELS.find(([value]) => value === voiceTestOs)?.[1] ||
      voiceTestOs;
    const details = document.createElement("details");
    details.className = "voice-instructions";
    details.open = true;
    const summary = document.createElement("summary");
    summary.textContent = osLabel;
    details.appendChild(summary);
    const steps = document.createElement("ol");
    steps.className = "voice-instructions__steps";
    const appLang = state.settings.appLanguage;
    (VOICE_OS_INSTRUCTIONS[voiceTestOs]?.steps || []).forEach((step) => {
      const li = document.createElement("li");
      li.textContent = step[appLang] || step.en;
      steps.appendChild(li);
    });
    details.appendChild(steps);
    section.appendChild(details);
    return section;
  }
  function refreshVoiceTestUI() {
    const playButton = document.querySelector(
      '[data-action="voice-test-play"]',
    );
    const stopButton = document.querySelector(
      '[data-action="voice-test-stop"]',
    );
    if (playButton) playButton.disabled = voiceTestPlaying;
    if (stopButton) stopButton.disabled = !voiceTestPlaying;
  }
  function startVoiceTestPlayback() {
    if (voiceTestPlaying) return;
    refreshVoices();
    const playable = voiceTestLanguages().filter(
      (code) => mediaService.voicesForLanguage(code).length > 0,
    );
    if (!playable.length) return;
    voiceTestQueue = playable.map((code) => ({
      code,
      text: voiceTestMessage(code),
    }));
    voiceTestPlaying = true;
    refreshVoiceTestUI();
    speakNextVoiceTest();
  }
  function speakNextVoiceTest() {
    if (!voiceTestPlaying) return;
    const entry = voiceTestQueue.shift();
    if (!entry) {
      stopVoiceTestPlayback();
      return;
    }
    if (!mediaService.supported) {
      voiceTestTimer = setTimeout(speakNextVoiceTest, 1000);
      return;
    }
    const utterance = mediaService.speakText(entry.text, entry.code, {
      onEnd: () => {
        if (voiceTestUtterance === utterance) speakNextVoiceTest();
      },
      onError: () => {
        if (voiceTestUtterance === utterance) speakNextVoiceTest();
      },
    });
    voiceTestUtterance = utterance || null;
  }
  function stopVoiceTestPlayback() {
    voiceTestPlaying = false;
    voiceTestQueue = [];
    voiceTestUtterance = null;
    if (voiceTestTimer) {
      clearTimeout(voiceTestTimer);
      voiceTestTimer = null;
    }
    if (mediaService?.supported) window.speechSynthesis.cancel();
    refreshVoiceTestUI();
  }
  function renderProgress() {
    showView("progress");
    const view = elements.progressView;
    view.innerHTML = "";
    view.appendChild(
      exerciseHeader("🗑️ " + t("resetProgressPage"), "back-home"),
    );
    const stage = document.createElement("div");
    stage.className = "progress-stage";
    const resetPanel = document.createElement("section");
    resetPanel.className = "progress-section";
    const resetBody = document.createElement("div");
    resetBody.className = "progress-section__body";
    const resetActions = document.createElement("div");
    resetActions.className = "progress-reset-actions";
    const makeResetButton = (label, action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button button--wide";
      button.dataset.action = action;
      button.textContent = label;
      return button;
    };
    resetActions.appendChild(
      makeResetButton(t("resetFlashcards"), "reset-progress-srs"),
    );
    resetActions.appendChild(
      makeResetButton(t("resetQuiz"), "reset-progress-quiz"),
    );
    resetActions.appendChild(
      makeResetButton(t("resetProgress"), "reset-progress-all"),
    );
    resetBody.appendChild(resetActions);
    resetPanel.appendChild(resetBody);
    stage.appendChild(resetPanel);
    view.appendChild(stage);
  }

  function renderRecordAndCompareSection() {
    const section = document.createElement("div");
    section.className = "sheet-section";
    const title = document.createElement("h3");
    title.className = "sheet-section__title";
    title.textContent = t("recordAndCompare");
    section.appendChild(title);
    const desc = document.createElement("p");
    desc.style.margin = "0 0 0.75rem 0";
    desc.style.color = "var(--muted)";
    desc.style.fontSize = "0.9rem";
    desc.textContent = t("recordAndCompareDesc");
    section.appendChild(desc);
    const label = document.createElement("label");
    label.className = "language-control";
    label.style.cursor = "pointer";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(state.settings.recordAndCompare);
    input.addEventListener("change", () => {
      state.settings.recordAndCompare = input.checked;
      saveState();
      renderSettings();
      renderCurrent();
    });
    const text = document.createElement("span");
    text.className = "language-control__label";
    text.textContent = t("recordAndCompare");
    label.append(input, text);
    section.appendChild(label);
    return section;
  }

  function renderHelp() {
    showView("help");
    const view = elements.helpView;
    view.innerHTML = "";
    view.appendChild(exerciseHeader(t("gettingStarted"), "back-home"));
    const stage = document.createElement("div");
    stage.className = "progress-stage";
    HELP_SECTIONS.forEach((section) =>
      stage.appendChild(renderHelpSection(section)),
    );
    view.appendChild(stage);
  }
  function renderHelpSection(section) {
    const wrap = document.createElement("section");
    wrap.className = "progress-section";
    const isOpen = openHelpSections.has(section.key);
    const header = document.createElement("button");
    header.type = "button";
    header.className = "progress-section__header";
    header.dataset.action = "toggle-help-section";
    header.dataset.helpKey = section.key;
    const title = document.createElement("span");
    title.className = "progress-section__title";
    title.textContent = dataService.getLocalizedText(
      section.title,
      preferredAppLanguages(),
    );
    const chevron = document.createElement("span");
    chevron.className = "progress-section__chevron";
    chevron.textContent = isOpen ? "\u25BE" : "\u25B8";
    header.append(title, chevron);
    wrap.appendChild(header);
    if (!isOpen) return wrap;
    const body = document.createElement("div");
    body.className = "progress-section__body";
    const list = document.createElement("ul");
    list.className = "help-list";
    const appLang = state.settings.appLanguage;
    section.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item[appLang] || item.en;
      list.appendChild(li);
    });
    body.appendChild(list);
    wrap.appendChild(body);
    return wrap;
  }
  function toggleHelpSection(key) {
    if (openHelpSections.has(key)) openHelpSections.delete(key);
    else openHelpSections.add(key);
    renderHelp();
  }
  function clearProgressKeys(keys) {
    keys.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {}
    });
  }
  function resetFlashcardProgress() {
    if (!window.confirm(t("resetFlashcardsConfirm"))) return;
    clearProgressKeys([STORAGE_KEYS.srs]);
    srsService.records = {};
    if (elements.progressView && !elements.progressView.hidden)
      renderProgress();
  }
  function resetQuizProgress() {
    if (!window.confirm(t("resetQuizConfirm"))) return;
    clearProgressKeys([STORAGE_KEYS.quiz]);
    quizProgressService.records = {};
    if (elements.progressView && !elements.progressView.hidden)
      renderProgress();
  }
  function resetAllProgress() {
    if (!window.confirm(t("resetProgressConfirm"))) return;
    clearProgressKeys([
      STORAGE_KEYS.srs,
      STORAGE_KEYS.quiz,
      STORAGE_KEYS.lessonsTried,
    ]);
    srsService.records = {};
    quizProgressService.records = {};
    lessonsTried.clear();
    if (elements.progressView && !elements.progressView.hidden)
      renderProgress();
  }
  function bindGlobalEvents() {
    document.addEventListener("click", (event) => {
      const actionEl = event.target.closest("[data-action]");
      if (!actionEl) return;
      const action = actionEl.dataset.action;
      switch (action) {
        case "select-target-language": {
          const code = actionEl.dataset.langCode;
          if (code) setTargetLanguage(code, "target-select");
          break;
        }
        case "change-target-language":
          state.settings.targetLanguage = null;
          saveState();
          renderTargetSelect();
          break;
        case "go-home-header":
          goHome();
          break;
        case "generate-plan":
          generateStudyPlan();
          break;
        case "skip-onboarding":
          skipOnboarding();
          break;
        case "toggle-hamburger":
          if (elements.hamburgerPanel.hidden) openHamburger();
          else closeHamburger();
          break;
        case "close-hamburger":
          closeHamburger();
          break;
        case "cycle-theme":
          cycleTheme();
          break;
        case "cycle-font":
          cycleFont();
          break;
        case "create-plan":
          closeHamburger();
          renderOnboarding();
          break;
        case "show-progress":
          closeHamburger();
          renderProgress();
          break;
        case "open-voice-test":
          closeHamburger();
          if (!voiceTestOs) voiceTestOs = detectOs();
          voiceTestReturn = currentLesson ? "back-lesson" : "back-home";
          renderVoiceTest();
          break;
        case "open-help":
          closeHamburger();
          renderHelp();
          break;
        case "toggle-help-section":
          toggleHelpSection(actionEl.dataset.helpKey);
          break;
        case "toggle-category":
          toggleCategory(actionEl.dataset.categoryId);
          break;
        case "toggle-tier":
          toggleTier(actionEl.dataset.tierId);
          break;
        case "open-lesson":
          openLesson(actionEl.dataset.lessonId);
          break;
        case "retry-lesson":
          if (currentLesson) openLesson(currentLesson.meta.id);
          break;
        case "next-up-continue":
          nextUpPreviewId = null;
          openLesson(actionEl.dataset.lessonId);
          break;
        case "next-up-skip":
          handleNextUpSkip(actionEl.dataset.lessonId);
          break;
        case "open-grammar-rule":
          openGrammarOverlay(actionEl.dataset.ruleId);
          break;
        case "close-grammar-overlay":
          closeGrammarOverlay();
          break;
        case "open-record-overlay":
          openRecordOverlay(
            actionEl.dataset.itemId,
            actionEl.dataset.lang,
            actionEl.dataset.text,
          );
          break;
        case "close-record-overlay":
          closeRecordOverlay();
          break;
        case "record-start":
          startRecordingFlow();
          break;
        case "record-stop":
          stopRecordingFlow();
          break;
        case "record-play":
          playAndCompare();
          break;
        case "next-up-preview-prev": {
          const currentPreview =
            nextUpPreviewId || milestoneService?.getNextMilestone();
          if (currentPreview) {
            const milestones = manifest?.milestones || [];
            const idx = milestones.findIndex((m) => m.id === currentPreview);
            if (idx > 0) {
              nextUpPreviewId = milestones[idx - 1].id;
              renderHome();
            }
          }
          break;
        }
        case "next-up-preview-next": {
          const currentPreviewNext =
            nextUpPreviewId || milestoneService?.getNextMilestone();
          if (currentPreviewNext) {
            const milestones = manifest?.milestones || [];
            const idx = milestones.findIndex(
              (m) => m.id === currentPreviewNext,
            );
            if (idx < milestones.length - 1) {
              nextUpPreviewId = milestones[idx + 1].id;
              renderHome();
            }
          }
          break;
        }
        case "edit-plan":
          handleEditPlan();
          break;
        case "delete-plan":
          handleDeletePlan();
          break;
        case "toggle-progress-section":
          toggleProgressSection(actionEl.dataset.sectionKey);
          break;
        case "toggle-cultural-context": {
          const key = "lesson:cultural-context";
          if (openLessonSections.has(key)) {
            openLessonSections.delete(key);
          } else {
            openLessonSections.add(key);
          }
          renderLesson(); // Re-render to toggle the 'hidden' attribute
          break;
        }
        case "toggle-lesson-section":
          toggleLessonSection(actionEl.dataset.sectionKey);
          break;
        case "toggle-exercise-settings":
          exerciseSettingsOpen = !exerciseSettingsOpen;
          renderCurrent();
          break;
        case "open-flashcards":
          if (flashcardKind !== "word") flashcardSession = null;
          flashcardKind = "word";
          renderFlashcards();
          break;
        case "open-sentence-flashcards":
          if (flashcardKind !== "sentence") flashcardSession = null;
          flashcardKind = "sentence";
          renderFlashcards();
          break;
        case "open-quiz":
          if (quizKind !== "word") quizSession = null;
          quizKind = "word";
          renderQuiz();
          break;
        case "open-sentence-quiz":
          if (quizKind !== "sentence") quizSession = null;
          quizKind = "sentence";
          renderQuiz();
          break;
        case "open-build-sentence":
          renderBuildSentence();
          break;

        case "open-letter-flashcards":
          flashcardKind = "letter";
          flashcardSession = null;
          renderLetterFlashcards();
          break;
        case "reveal-letter":
          revealCurrentLetterCard();
          break;
        case "rate-letter":
          rateCurrentLetterCard(actionEl.dataset.rating);
          break;
        case "restart-letter-flashcards":
          flashcardSession = null;
          renderLetterFlashcards();
          break;
        case "open-audio-spell":
          letterSpellSession = null;
          renderAudioSpell();
          break;
        case "letter-spell-add":
          letterSpellAddChip(actionEl.dataset.chipId);
          break;
        case "letter-spell-remove":
          letterSpellRemoveChip(actionEl.dataset.chipId);
          break;
        case "letter-spell-play":
          if (letterSpellSession) {
            const w = letterSpellSession.words[letterSpellSession.index];
            if (w)
              mediaService.speakImmediate(
                w.text,
                state.settings.targetLanguage,
              );
          }
          break;
        case "letter-spell-next":
          nextLetterSpell();
          break;
        case "letter-spell-restart":
          letterSpellSession = null;
          renderAudioSpell();
          break;
        case "open-letter-quiz":
          letterQuizSession = null;
          renderLetterQuiz();
          break;
        case "letter-quiz-answer":
          answerLetterQuiz(actionEl.dataset.itemId);
          break;
        case "letter-quiz-next":
          nextLetterQuizQuestion();
          break;
        case "letter-quiz-play":
          if (letterQuizSession) {
            const q = letterQuizSession.questions[letterQuizSession.index];
            if (q)
              mediaService.speakImmediate(
                q.targetText,
                state.settings.targetLanguage,
              );
          }
          break;
        case "letter-quiz-restart":
          letterQuizSession = null;
          renderLetterQuiz();
          break;

        case "back-home":
          goHome();
          break;
        case "back-lesson":
          renderLesson();
          break;
        case "media-play":
          togglePlayPause();
          break;
        case "media-stop":
          stopPlayback();
          break;
        case "toggle-record-compare":
          state.settings.recordAndCompare = !state.settings.recordAndCompare;
          saveState();
          updateRecordToggleButton();
          renderCurrent(); // Re-renders the lesson to show/hide inline mic icons
          break;
        case "voice-test-play":
          startVoiceTestPlayback();
          break;
        case "voice-test-stop":
          stopVoiceTestPlayback();
          break;
        case "open-settings":
          openSettings();
          break;
        case "close-settings":
          closeSettings();
          break;
        case "speak-cell":
          startPlaybackFromCell(actionEl.dataset.itemId, actionEl.dataset.lang);
          break;
        case "speak-text": {
          const lang = actionEl.dataset.lang;
          const rawText =
            actionEl.dataset.speakText ?? actionEl.textContent ?? "";
          const text = String(rawText).trim();
          if (text && registry.has(lang)) {
            if (actionEl.querySelector(".sentence-token"))
              speakLineWithHighlight(actionEl, text, lang);
            else mediaService.speakImmediate(text, lang);
          }
          break;
        }
        case "reset-voices":
          state.settings.voices = {};
          saveState();
          renderSettings();
          break;
        case "reveal":
          revealCurrentCard();
          break;
        case "rate":
          rateCurrentCard(actionEl.dataset.rating);
          break;
        case "quiz-answer":
          answerQuiz(actionEl.dataset.itemId);
          break;
        case "quiz-next":
          nextQuizQuestion();
          break;
        case "quiz-restart":
          restartQuiz();
          break;
        case "quiz-retry":
          retryQuiz();
          break;
        case "build-add":
          buildAddChip(Number(actionEl.dataset.chipId));
          break;
        case "build-remove":
          buildRemoveChip(Number(actionEl.dataset.chipId));
          break;
        case "build-hint":
          buildHint();
          break;
        case "build-next":
          buildNext();
          break;
        case "build-restart":
          buildRestart();
          break;
        case "reset-progress-srs":
          resetFlashcardProgress();
          break;
        case "reset-progress-quiz":
          resetQuizProgress();
          break;
        case "reset-progress-all":
          resetAllProgress();
          break;
        case "open-grammar-quiz": {
          const questions = currentLesson.grammar_questions || [];
          if (!questions.length) return;
          const qLang = state.settings.appLanguage;
          const aLang = state.settings.targetLanguage;
          quizSession = {
            session: buildGrammarQuizSession(questions, qLang, aLang),
            index: 0,
            correct: 0,
            answered: false,
            selectedItemId: "",
            incorrectQuestions: [],
            isGrammarQuiz: true,
            milestoneId: currentLesson.meta.id,
          };
          showView("quiz");
          renderQuiz();
          break;
        }
        case "grammar-quiz-retry": {
          const questions = currentLesson.grammar_questions || [];
          if (!questions.length) return;
          const qLang = state.settings.appLanguage;
          const aLang = state.settings.targetLanguage;
          quizSession = {
            session: buildGrammarQuizSession(questions, qLang, aLang),
            index: 0,
            correct: 0,
            answered: false,
            selectedItemId: "",
            incorrectQuestions: [],
            isGrammarQuiz: true,
            milestoneId: currentLesson.meta.id,
          };
          renderQuiz();
          break;
        }
        case "toggle-cultural-context": {
          const key = "lesson:cultural-context";
          if (openLessonSections.has(key)) {
            openLessonSections.delete(key);
          } else {
            openLessonSections.add(key);
          }
          renderLesson(); // Re-render to toggle the 'hidden' attribute
          break;
        }
        default:
          break;
      }
    });
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
    });
    document.addEventListener(
      "scroll",
      () => {
        if (!playbackState || playbackState.status !== "playing") return;
        if (Date.now() < programmaticScrollUntil) return;
        stopPlayback();
      },
      { capture: true, passive: true },
    );
  }
  document.addEventListener("DOMContentLoaded", init);
  function renderTargetSelect() {
    showView("targetSelect");
    const view = elements.targetSelectView;
    view.innerHTML = "";
    const stage = document.createElement("div");
    stage.className = "target-select-stage";
    const title = document.createElement("h2");
    title.className = "target-select-title";
    title.textContent = t("selectTargetLanguage");
    stage.appendChild(title);
    const intro = document.createElement("p");
    intro.className = "target-select-intro";
    intro.textContent = t("selectTargetLanguageIntro");
    stage.appendChild(intro);
    const list = document.createElement("div");
    list.className = "target-select-list";
    const appLang = state.settings.appLanguage;
    const sortedLanguages = getSortedLanguages();
    sortedLanguages.forEach((lang) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "target-select-option";
      btn.dataset.action = "select-target-language";
      btn.dataset.langCode = lang.code;
      const flag = document.createElement("span");
      flag.className = "target-select-flag";
      flag.textContent = flagEmoji(lang.code);
      const name = document.createElement("span");
      name.className = "target-select-name";
      name.textContent = languageDisplayName(lang.code);
      btn.append(flag, name);
      list.appendChild(btn);
    });
    stage.appendChild(list);
    view.appendChild(stage);
  }
  async function init() {
    elements.onboardingView = document.getElementById("onboarding-view");
    elements.homeView = document.getElementById("home-view");
    elements.lessonView = document.getElementById("lesson-view");
    elements.flashcardView = document.getElementById("flashcard-view");
    elements.letterFlashcardView = document.getElementById(
      "letter-flashcard-view",
    );
    elements.letterQuizView = document.getElementById("letter-quiz-view");
    elements.letterSpellView = document.getElementById("letter-spell-view");
    elements.quizView = document.getElementById("quiz-view");
    elements.buildView = document.getElementById("build-view");
    elements.progressView = document.getElementById("progress-view");
    elements.voicetestView = document.getElementById("voicetest-view");

    elements["letter-flashcardView"] = document.getElementById(
      "letter-flashcard-view",
    );
    elements["letter-quizView"] = document.getElementById("letter-quiz-view");
    elements["letter-spellView"] = document.getElementById("letter-spell-view");
    elements.audioSpellView = document.getElementById("audio-spell-view");

    elements.actionBar = document.getElementById("action-bar");
    elements.bottomBar = document.getElementById("bottom-bar");
    elements.hamburgerPanel = document.getElementById("hamburger-panel");
    elements.hamburgerBackdrop = document.getElementById("hamburger-backdrop");
    elements.helpView = document.getElementById("help-view");
    elements.themeIcon = document.getElementById("theme-icon");
    elements.themeLabel = document.getElementById("theme-label");
    elements.fontIcon = document.getElementById("font-icon");
    elements.fontLabel = document.getElementById("font-label");
    elements.appLanguageControl = document.getElementById(
      "app-language-control",
    );
    elements.settingsSheet = document.getElementById("settings-sheet");
    elements.settingsBody = document.getElementById("settings-body");
    elements.targetSelectView = document.getElementById("target-select-view");
    manifest = await loadManifest();
    registry = createRegistry(manifest?.zabon?.languages || []);
    const settings = normalizeSettings(loadJSON(STORAGE_KEYS.settings, {}));
    state = { settings, lessonLanguages: [] };
    state.lessonLanguages = normalizeLessonLanguages(
      loadJSON(STORAGE_KEYS.lessonLanguages, null),
      settings.targetLanguage,
    );
    mediaService = new MediaService(registry);
    dataService = new DataService({ items: [] }, registry);
    applyTheme();
    applyFont();
    applyDocumentLanguage();
    refreshVoices();
    bindGlobalEvents();
    renderStaticLabels();
    renderHamburger();
    elements.targetLanguageControl = document.getElementById(
      "target-language-control",
    );
    renderTargetLanguageControl();
    if (
      mediaService.supported &&
      typeof window.speechSynthesis.addEventListener === "function"
    ) {
      window.speechSynthesis.addEventListener("voiceschanged", () => {
        refreshVoices();
        if (elements.settingsSheet && !elements.settingsSheet.hidden)
          renderSettings();
      });
    }
    if (!state.settings.targetLanguage) {
      renderTargetSelect();
      return;
    }
    const onboardingComplete = loadJSON(STORAGE_KEYS.onboardingComplete, false);
    if (!onboardingComplete) {
      renderOnboarding();
      return;
    }
    resetTargetScopedServices();
    goHome();
    window.ZabonV2 = {
      state,
      registry,
      manifest,
      dataService,
      mediaService,
      srsService,
      quizProgressService,
      milestoneService,
      startRecordingTest,
      stopRecordingTest,
      getRecordedBlob: () => recordedBlob,
    };
  }
})();
