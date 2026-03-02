import React, { useState } from 'react';
import { Search, BookText } from 'lucide-react';

// Hardcoded authentic Hadiths for demonstration
const HADITHS = [
  {
    id: 1,
    category: 'ঈমান (বিশ্বাস)',
    arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
    transliteration: 'Innamal a\'malu bin-niyyat, wa innama likulli imri\'in ma nawa.',
    bangla: 'নিশ্চয়ই সমস্ত কাজ নিয়তের উপর নির্ভরশীল। আর প্রত্যেক ব্যক্তি তাই পাবে, যা সে নিয়ত করেছে।',
    reference: 'সহীহ বুখারী, হাদিস ১'
  },
  {
    id: 2,
    category: 'সালাত (নামায)',
    arabic: 'مَنْ نَسِيَ صَلَاةً فَلْيُصَلِّ إِذَا ذَكَرَهَا، لَا كَفَّارَةَ لَهَا إِلَّا ذَلِكَ',
    transliteration: 'Man nasiya salatan falyusalli idha dhakaraha, la kaffarata laha illa dhalik.',
    bangla: 'যে ব্যক্তি নামায ভুলে যায়, সে যখনই তা স্মরণ করবে তখনই যেন তা পড়ে নেয়। এছাড়া এর আর কোনো কাফফারা নেই।',
    reference: 'সহীহ বুখারী, হাদিস ৫৯৭'
  },
  {
    id: 3,
    category: 'আখলাক (চরিত্র)',
    arabic: 'إِنَّ مِنْ خِيَارِكُمْ أَحْسَنَكُمْ أَخْلَاقًا',
    transliteration: 'Inna min khiyarikum ahsanakum akhlaqan.',
    bangla: 'নিশ্চয়ই তোমাদের মধ্যে সর্বশ্রেষ্ঠ ঐ ব্যক্তি, যার চরিত্র সবচেয়ে সুন্দর।',
    reference: 'সহীহ বুখারী, হাদিস ৩৫৫৯'
  },
  {
    id: 4,
    category: 'ইলম (জ্ঞান)',
    arabic: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
    transliteration: 'Talabul \'ilmi faridatun \'ala kulli muslim.',
    bangla: 'জ্ঞান অন্বেষণ করা প্রত্যেক মুসলিমের উপর ফরজ (আবশ্যক)।',
    reference: 'সুনান ইবনে মাজাহ, হাদিস ২২৪'
  },
  {
    id: 5,
    category: 'দান-সাদাকা',
    arabic: 'اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ',
    transliteration: 'Ittaqun-nara walaw bishiqqi tamratin.',
    bangla: 'তোমরা জাহান্নামের আগুন থেকে বাঁচো, একটি খেজুরের অর্ধেক দান করে হলেও।',
    reference: 'সহীহ বুখারী, হাদিস ১৪১৭'
  }
];

export default function Hadith() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(HADITHS.map(h => h.category)));

  const filteredHadiths = HADITHS.filter(hadith => {
    const matchesSearch = hadith.bangla.includes(searchQuery) || hadith.arabic.includes(searchQuery);
    const matchesCategory = selectedCategory ? hadith.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] pb-8">
      {/* Header */}
      <div className="bg-emerald-800 text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <BookText size={150} className="-mt-10 -mr-10 transform rotate-12" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-serif mb-2">হাদিস শরীফ</h1>
          <p className="text-emerald-100 text-sm opacity-90">নির্বাচিত সহীহ হাদিস সংকলন</p>
          
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-emerald-300" />
            </div>
            <input
              type="text"
              placeholder="হাদিস খুঁজুন..."
              className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl bg-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mt-6">
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === null 
                ? 'bg-emerald-600 text-white' 
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            সকল
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Hadith List */}
      <div className="px-4 mt-4 space-y-4">
        {filteredHadiths.map((hadith) => (
          <div key={hadith.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-50">
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">
                {hadith.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {hadith.reference}
              </span>
            </div>

            <div className="text-right mb-6">
              <p className="font-serif text-2xl leading-[2.2] text-slate-800" dir="rtl">
                {hadith.arabic}
              </p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-emerald-600/80 font-medium italic leading-relaxed">
                {hadith.transliteration}
              </p>
            </div>

            <div className="border-t border-slate-50 pt-4">
              <p className="text-slate-700 leading-relaxed text-[15px] font-medium">
                {hadith.bangla}
              </p>
            </div>
          </div>
        ))}
        
        {filteredHadiths.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            কোনো হাদিস পাওয়া যায়নি।
          </div>
        )}
      </div>
    </div>
  );
}
