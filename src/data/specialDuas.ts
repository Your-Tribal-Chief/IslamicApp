export interface SpecialDua {
  id: string;
  title: string;
  arabic: string;
  banglaMeaning: string;
  transliteration: string;
  virtue: string;
  source: string;
  audioUrl: string;
}

export const SPECIAL_DUAS: SpecialDua[] = [
  {
    id: 'sayyidul-istighfar',
    title: 'সাইয়্যিদুল ইস্তিগফার (ক্ষমা প্রার্থনার শ্রেষ্ঠ দোয়া)',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ لَكَ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ',
    transliteration: 'Allahumma anta Rabbi la ilaha illa anta, Khalaqtani wa ana `abduka, wa ana `ala `ahdika wa wa`dika mastata`tu, A`udhu bika min sharri ma sana`tu, abu\'u laka bini`matika `alaiya, wa abu\'u laka bidhanbi faghfir li fa-innahu la yaghfirudh-dhunuba illa anta.',
    banglaMeaning: 'হে আল্লাহ! আপনি আমার পালনকর্তা। আপনি ছাড়া কোন উপাস্য নেই। আপনি আমাকে সৃষ্টি করেছেন। আমি আপনার দাস। আমি আপনার প্রতিশ্রুতি ও অঙ্গীকারের ওপর সাধ্যমতো অবিচল আছি। আমি আমার কৃতকর্মের অনিষ্ট থেকে আপনার কাছে আশ্রয় চাই। আমার ওপর আপনার নেয়ামত স্বীকার করছি এবং আমার গুনাহও স্বীকার করছি। অতএব আপনি আমাকে ক্ষমা করুন। কারণ আপনি ছাড়া কেউ গুনাহ ক্ষমা করতে পারে না।',
    virtue: 'যে ব্যক্তি দিনের বেলা বিশ্বাসের সাথে এই দোয়াটি পড়বে এবং সন্ধ্যা হওয়ার আগেই মারা যাবে, সে জান্নাতি হবে। আর যে ব্যক্তি রাতে বিশ্বাসের সাথে এটি পড়বে এবং সকাল হওয়ার আগেই মারা যাবে, সে জান্নাতি হবে। (সহীহ বুখারী)',
    source: 'সহীহ বুখারী: ৬৩০৬',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/125.mp3'
  },
  {
    id: 'market-dua',
    title: 'বাজারে প্রবেশের দোয়া',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu, yuhyi wa yumitu, wa huwa hayyun la yamutu, biyadihil-khairu, wa huwa `ala kulli shay\'in qadir.',
    banglaMeaning: 'আল্লাহ ছাড়া কোনো উপাস্য নেই, তিনি একক, তাঁর কোনো শরিক নেই। রাজত্ব তাঁরই এবং প্রশংসাও তাঁরই। তিনিই জীবন দান করেন এবং মৃত্যু দান করেন। তিনি চিরঞ্জীব, কখনো মৃত্যুবরণ করবেন না। সকল কল্যাণ তাঁরই হাতে এবং তিনি সব কিছুর ওপর ক্ষমতাবান।',
    virtue: 'যে ব্যক্তি বাজারে প্রবেশ করে এই দোয়া পড়বে, আল্লাহ তার আমলনামায় দশ লক্ষ নেকি লিখে দেবেন, দশ লক্ষ গুনাহ মাফ করে দেবেন এবং জান্নাতে তার জন্য একটি ঘর নির্মাণ করবেন। (তিরমিযী)',
    source: 'তিরমিযী: ৩৪২৮',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/200.mp3'
  },
  {
    id: 'ayatul-kursi',
    title: 'আয়াতুল কুরসি',
    arabic: 'اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    transliteration: 'Allahu la ilaha illa Huwal-Hayyul-Qayyum. La ta\'khudhuhu sinatun wa la nawm. Lahu ma fis-samawati wa ma fil-ard. Man dhal-ladhi yashfa`u `indahu illa bi-idhnih. Ya`lamu ma baina aidihim wa ma khalfahum. Wa la yuhituna bi-shai\'im-min `ilmihi illa bima sha\'. Wasi`a kursiyyuhus-samawati wal-ard. Wa la ya\'uduhu hifzhuhuma wa Huwal-`Aliyyul-`Azhim.',
    banglaMeaning: 'আল্লাহ ছাড়া কোনো উপাস্য নেই। তিনি চিরঞ্জীব, সব কিছুর ধারক। তাঁকে তন্দ্রা ও নিদ্রা স্পর্শ করে না। আসমান ও জমিনে যা কিছু আছে সব তাঁরই। কে সে, যে তাঁর অনুমতি ছাড়া তাঁর কাছে সুপারিশ করবে? তাদের সামনে ও পেছনে যা কিছু আছে সব তিনি জানেন। তাঁর জ্ঞানের সামান্যতম অংশও কেউ আয়ত্ত করতে পারে না, তবে তিনি যা চান তা ছাড়া। তাঁর কুরসি আসমান ও জমিন পরিব্যাপ্ত। এ দুটির রক্ষণাবেক্ষণ তাঁকে ক্লান্ত করে না। তিনি সুউচ্চ, মহান।',
    virtue: 'যে ব্যক্তি প্রতি ফরয নামাযের পর আয়াতুল কুরসি পড়বে, তার জান্নাতে প্রবেশের পথে মৃত্যু ছাড়া আর কোনো বাধা থাকবে না। (নাসাঈ)',
    source: 'নাসাঈ: ৯৯২৮',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/124.mp3'
  },
  {
    id: 'subhanallahi-wa-bihamdihi',
    title: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'Subhanallahi wa bihamdihi.',
    banglaMeaning: 'আল্লাহর পবিত্রতা ঘোষণা করছি তাঁর প্রশংসার সাথে।',
    virtue: 'যে ব্যক্তি দিনে ১০০ বার এই দোয়া পড়বে, তার সমস্ত গুনাহ মাফ করে দেওয়া হবে, যদিও তা সমুদ্রের ফেনার সমান হয়। (সহীহ বুখারী)',
    source: 'সহীহ বুখারী: ৬৪০৫',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/254.mp3'
  },
  {
    id: 'la-hawla-wa-la-quwwata',
    title: 'লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah.',
    banglaMeaning: 'আল্লাহর সাহায্য ছাড়া (পাপ থেকে বাঁচার) কোনো উপায় নেই এবং (ইবাদত করার) কোনো শক্তি নেই।',
    virtue: 'রাসূলুল্লাহ (সা.) বলেছেন, এটি জান্নাতের গুপ্তধনসমূহের মধ্যে একটি গুপ্তধন। (সহীহ বুখারী)',
    source: 'সহীহ বুখারী: ৪২০৫',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/256.mp3'
  },
  {
    id: 'dua-yunus',
    title: 'দোয়া ইউনুস',
    arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
    transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zhalimin.',
    banglaMeaning: 'আপনি ছাড়া কোনো উপাস্য নেই, আপনি পবিত্র। নিশ্চয়ই আমি অপরাধীদের অন্তর্ভুক্ত।',
    virtue: 'কোনো মুসলিম ব্যক্তি যদি কোনো বিপদে পড়ে এই দোয়া করে, তবে আল্লাহ অবশ্যই তার দোয়া কবুল করবেন। (তিরমিযী)',
    source: 'তিরমিযী: ৩৫০৫',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/257.mp3'
  },
  {
    id: 'subhanallahi-al-azim',
    title: 'সুবহানাল্লাহি ওয়া বিহামদিহি সুবহানাল্লাহিল আজিম',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'Subhanallahi wa bihamdihi, Subhanallahil-`Azhim.',
    banglaMeaning: 'আল্লাহর পবিত্রতা ঘোষণা করছি তাঁর প্রশংসার সাথে, মহান আল্লাহর পবিত্রতা ঘোষণা করছি।',
    virtue: 'দুটি বাক্য আছে যা মুখে উচ্চারণ করা সহজ, আমলনামার পাল্লায় অনেক ভারী এবং দয়াময় আল্লাহর কাছে অত্যন্ত প্রিয়। (সহীহ বুখারী)',
    source: 'সহীহ বুখারী: ৬৬৮২',
    audioUrl: 'https://www.hisnmuslim.com/audio/ar/255.mp3'
  }
];
