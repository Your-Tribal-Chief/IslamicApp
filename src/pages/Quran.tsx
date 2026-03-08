import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, History, ChevronRight } from 'lucide-react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

interface LastRead {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
}

export default function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRead, setLastRead] = useState<LastRead | null>(null);

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch('/api/quran/surah');
        const data = await res.json();
        setSurahs(data.data);
      } catch (error) {
        console.error('Failed to fetch surahs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();

    const saved = localStorage.getItem('lastReadAyah');
    if (saved) {
      setLastRead(JSON.parse(saved));
    } else {
      // Fallback to old format if exists
      const oldSaved = localStorage.getItem('lastReadSurah');
      if (oldSaved) {
        const parsed = JSON.parse(oldSaved);
        setLastRead({
          surahNumber: parsed.number,
          surahName: parsed.name,
          ayahNumber: 1
        });
      }
    }
  }, []);

  const convertToBanglaNumber = (numStr: string | number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(numStr).replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  const filteredSurahs = surahs.filter(surah => 
    surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    surah.name.includes(searchQuery)
  );

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="bg-emerald-800 dark:bg-emerald-950 text-white pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <BookOpen size={150} className="-mt-10 -mr-10 transform rotate-12" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-serif mb-2">আল কুরআন</h1>
          <p className="text-emerald-100 text-sm opacity-80">পবিত্র কুরআনুল কারীম</p>
          
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-emerald-300" />
            </div>
            <input
              type="text"
              placeholder="সূরা খুঁজুন..."
              className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl bg-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Last Read */}
      {lastRead && !searchQuery && (
        <div className="px-4 mt-6">
          <Link 
            to={`/surah/${lastRead.surahNumber}?ayah=${lastRead.ayahNumber}&autoplay=true`}
            className="bg-emerald-900 dark:bg-emerald-950 rounded-[32px] p-6 shadow-xl shadow-emerald-900/20 text-white flex items-center justify-between relative overflow-hidden group border border-emerald-800 dark:border-emerald-900"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <History size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                <History size={12} />
                <span>সর্বশেষ পঠিত</span>
              </div>
              <h3 className="text-2xl font-bold font-serif">{lastRead.surahName}</h3>
              <p className="text-emerald-100/60 text-xs mt-1">আয়াত {convertToBanglaNumber(lastRead.ayahNumber)} থেকে পড়া চালিয়ে যান</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5">
              <ChevronRight size={20} />
            </div>
          </Link>
        </div>
      )}

      {/* Surah List */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">সূরা তালিকা</h3>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-lg">
            {convertToBanglaNumber(filteredSurahs.length)} সূরা
          </span>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-xs font-medium">লোড হচ্ছে...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSurahs.map((surah) => (
              <Link 
                key={surah.number} 
                to={`/surah/${surah.number}`}
                onClick={() => {
                  const lastRead = {
                    surahNumber: surah.number,
                    surahName: surah.englishName,
                    ayahNumber: 1
                  };
                  localStorage.setItem('lastReadAyah', JSON.stringify(lastRead));
                  localStorage.setItem('lastReadSurah', JSON.stringify({ number: surah.number, name: surah.englishName }));
                }}
                className="bg-white dark:bg-slate-900 rounded-[28px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-emerald-200 dark:hover:border-emerald-800 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl transform rotate-12 group-hover:rotate-45 transition-transform"></div>
                    <span className="relative z-10 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                      {convertToBanglaNumber(surah.number)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">{surah.englishName}</h3>
                    <div className="flex items-center text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider space-x-2">
                      <span className="text-emerald-600/70 dark:text-emerald-400/70">
                        {surah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                      </span>
                      <span>•</span>
                      <span>{convertToBanglaNumber(surah.numberOfAyahs)} আয়াত</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif text-2xl text-emerald-800 dark:text-emerald-400 font-medium">{surah.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
