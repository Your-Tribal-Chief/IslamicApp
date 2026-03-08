import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  audio: string;
  audioSecondary: string[];
  translation?: string;
  transliteration?: string;
}

interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export default function SurahDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    async function fetchSurah() {
      try {
        // Fetch Arabic with Audio
        const resAr = await fetch(`https://api.alquran.cloud/v1/surah/${id}/ar.alafasy`);
        const dataAr = await resAr.json();
        
        // Fetch Bengali Translation
        const resBn = await fetch(`https://api.alquran.cloud/v1/surah/${id}/bn.bengali`);
        const dataBn = await resBn.json();

        // Fetch Transliteration
        const resTrans = await fetch(`https://api.alquran.cloud/v1/surah/${id}/en.transliteration`);
        const dataTrans = await resTrans.json();

        // Merge data
        const mergedAyahs = dataAr.data.ayahs.map((ayah: any, index: number) => ({
          ...ayah,
          translation: dataBn.data.ayahs[index].text,
          transliteration: dataTrans.data.ayahs[index].text,
        }));

        const surahData = {
          ...dataAr.data,
          ayahs: mergedAyahs
        };
        setSurah(surahData);

        // Handle URL parameters for specific Ayah and Autoplay
        const searchParams = new URLSearchParams(location.search);
        const targetAyah = searchParams.get('ayah');
        const shouldAutoplay = searchParams.get('autoplay') === 'true';

        if (targetAyah) {
          const ayahNum = parseInt(targetAyah);
          setTimeout(() => {
            const element = ayahRefs.current[ayahNum];
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              if (shouldAutoplay) {
                const targetAyahObj = mergedAyahs.find((a: any) => a.numberInSurah === ayahNum);
                if (targetAyahObj) {
                  toggleAudio(targetAyahObj.number, targetAyahObj.audio, true);
                }
              }
            }
          }, 500);
        }
      } catch (error) {
        console.error('Failed to fetch surah details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSurah();
  }, [id]);

  const saveLastRead = (ayahNumberInSurah: number) => {
    if (!surah) return;
    const lastRead = {
      surahNumber: surah.number,
      surahName: surah.englishName,
      ayahNumber: ayahNumberInSurah
    };
    localStorage.setItem('lastReadAyah', JSON.stringify(lastRead));
    // Also update the old key for backward compatibility if needed, but the new card will use 'lastReadAyah'
    localStorage.setItem('lastReadSurah', JSON.stringify({ number: surah.number, name: surah.englishName }));
  };

  const convertToBanglaNumber = (numStr: string | number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(numStr).replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  const toggleAudio = (ayahNumber: number, audioUrl: string, autoNext = false) => {
    if (playingAyah === ayahNumber && !autoNext) {
      audioRef.current?.pause();
      setPlayingAyah(null);
      setIsAutoplay(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setPlayingAyah(ayahNumber);
      
      // Save last read when playing
      const currentAyah = surah?.ayahs.find(a => a.number === ayahNumber);
      if (currentAyah) {
        saveLastRead(currentAyah.numberInSurah);
      }
      
      audioRef.current.onended = () => {
        setPlayingAyah(null);
        if (isAutoplay || autoNext) {
          playNextAyah(ayahNumber);
        }
      };
    }
  };

  const playNextAyah = (currentAyahNumber: number) => {
    if (!surah) return;
    const currentIndex = surah.ayahs.findIndex(a => a.number === currentAyahNumber);
    if (currentIndex !== -1 && currentIndex < surah.ayahs.length - 1) {
      const nextAyah = surah.ayahs[currentIndex + 1];
      toggleAudio(nextAyah.number, nextAyah.audio, true);
      // Scroll to next ayah
      ayahRefs.current[nextAyah.numberInSurah]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setIsAutoplay(false);
    }
  };

  const startAutoplay = () => {
    if (!surah || surah.ayahs.length === 0) return;
    setIsAutoplay(true);
    const firstAyah = surah.ayahs[0];
    toggleAudio(firstAyah.number, firstAyah.audio, true);
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] transition-colors">
        <div className="bg-emerald-800 dark:bg-emerald-950 text-white p-4 flex items-center shadow-md">
          <button onClick={() => navigate(-1)} className="p-2 mr-2 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div className="h-6 w-32 bg-white/20 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-emerald-800 dark:bg-emerald-950 text-white p-4 flex items-center shadow-md">
        <button onClick={() => navigate(-1)} className="p-2 mr-2 hover:bg-white/10 rounded-full transition-colors active:scale-95">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold font-serif">{surah?.englishName}</h1>
          <p className="text-emerald-100 text-xs opacity-90">{surah?.englishNameTranslation}</p>
        </div>
        <div className="text-right flex items-center space-x-2">
          <button 
            onClick={startAutoplay}
            disabled={isAutoplay}
            className={cn(
              "p-2 rounded-xl backdrop-blur-sm transition-all flex items-center space-x-1",
              isAutoplay ? "bg-emerald-500 text-white" : "bg-white/10 text-white hover:bg-white/20"
            )}
          >
            <Play size={16} />
            <span className="text-xs font-bold">অটোপ্লে</span>
          </button>
          <h2 className="text-2xl font-serif">{surah?.name}</h2>
        </div>
      </div>

      {/* Bismillah */}
      {surah?.number !== 1 && surah?.number !== 9 && (
        <div className="py-8 px-4 text-center border-b border-emerald-100/50 dark:border-emerald-900/50 bg-white/50 dark:bg-slate-900/50 transition-colors">
          <p className="font-serif text-3xl text-emerald-900 dark:text-emerald-400 leading-loose">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        </div>
      )}

      {/* Ayahs List */}
      <div className="px-4 mt-4 space-y-4">
        {surah?.ayahs.map((ayah) => (
          <div 
            key={ayah.number} 
            ref={el => ayahRefs.current[ayah.numberInSurah] = el}
            className={cn(
              "bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border transition-all",
              playingAyah === ayah.number ? "border-emerald-500 ring-1 ring-emerald-500/20" : "border-slate-100 dark:border-slate-800"
            )}
          >
            {/* Ayah Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-50 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="relative flex items-center justify-center w-8 h-8">
                  <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-950/30 rounded-full"></div>
                  <span className="relative z-10 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                    {convertToBanglaNumber(ayah.numberInSurah)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => toggleAudio(ayah.number, ayah.audio)}
                    className={cn(
                      "p-2 rounded-full transition-colors",
                      playingAyah === ayah.number ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400" : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    )}
                  >
                    {playingAyah === ayah.number ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                </div>
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                আয়াত {convertToBanglaNumber(ayah.numberInSurah)}
              </div>
            </div>

            {/* Arabic Text */}
            <div className="text-right mb-6">
              <p className="font-serif text-3xl leading-[2.5] text-slate-800 dark:text-slate-200" dir="rtl">
                {ayah.text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '')}
              </p>
            </div>

            {/* Transliteration */}
            <div className="mb-4">
              <p className="text-sm text-emerald-600/80 dark:text-emerald-500/80 font-medium italic leading-relaxed">
                {ayah.transliteration}
              </p>
            </div>

            {/* Bengali Translation */}
            <div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
                {ayah.translation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
