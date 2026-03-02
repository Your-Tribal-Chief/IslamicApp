import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function Quran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchSurahs() {
      try {
        const res = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await res.json();
        setSurahs(data.data);
      } catch (error) {
        console.error('Failed to fetch surahs:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurahs();
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
    <div className="flex flex-col min-h-full bg-[#f5f5f0] pb-8">
      {/* Header */}
      <div className="bg-emerald-800 text-white pt-12 pb-6 px-4 rounded-b-3xl shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <BookOpen size={150} className="-mt-10 -mr-10 transform rotate-12" />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-serif mb-2">আল কুরআন</h1>
          <p className="text-emerald-100 text-sm opacity-90">পবিত্র কুরআনুল কারীম</p>
          
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-emerald-300" />
            </div>
            <input
              type="text"
              placeholder="সূরা খুঁজুন..."
              className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl bg-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Surah List */}
      <div className="px-4 mt-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSurahs.map((surah) => (
              <Link 
                key={surah.number} 
                to={`/surah/${surah.number}`}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow active:scale-[0.98]"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative flex items-center justify-center w-10 h-10">
                    <div className="absolute inset-0 bg-emerald-50 rounded-lg transform rotate-45"></div>
                    <span className="relative z-10 text-emerald-700 font-bold text-sm">
                      {convertToBanglaNumber(surah.number)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{surah.englishName}</h3>
                    <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                      <span className="uppercase tracking-wider text-[10px] font-semibold text-emerald-600/70">
                        {surah.revelationType === 'Meccan' ? 'মাক্কী' : 'মাদানী'}
                      </span>
                      <span>•</span>
                      <span>{convertToBanglaNumber(surah.numberOfAyahs)} আয়াত</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-serif text-xl text-emerald-800 font-medium">{surah.name}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
