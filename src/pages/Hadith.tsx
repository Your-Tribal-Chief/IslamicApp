import React, { useState, useEffect, useRef } from 'react';
import { Search, BookText, ChevronDown, BookOpen, History, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import hadithSections from '../data/hadithSections.json';
import { cn } from '../lib/utils';

const BOOKS = [
  { id: 'bukhari', name: 'সহীহ বুখারী', count: '৭৫৬৩' },
  { id: 'muslim', name: 'সহীহ মুসলিম', count: '৭৪৫৩' },
  { id: 'tirmidhi', name: 'জামে তিরমিযী', count: '৩৯৫৬' },
  { id: 'abudawud', name: 'সুনান আবু দাউদ', count: '৫২৭৪' },
  { id: 'nasai', name: 'সুনান আন-নাসায়ী', count: '৫৭৫৮' },
  { id: 'ibnmajah', name: 'সুনান ইবনে মাজাহ', count: '৪৩৪১' }
];

interface HadithItem {
  hadithnumber: number;
  arabicText: string;
  banglaText: string;
  transliteration?: string;
  reference: string;
}

interface LastReadHadith {
  bookId: string;
  bookName: string;
  sectionId: string;
  hadithNumber: number;
}

export default function Hadith() {
  const navigate = useNavigate();
  const [selectedBook, setSelectedBook] = useState(BOOKS[0].id);
  const [sections, setSections] = useState<{ [key: string]: string }>({});
  const [selectedSection, setSelectedSection] = useState<string>('');
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRead, setLastRead] = useState<LastReadHadith | null>(null);
  const hadithRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const convertToBanglaNumber = (num: number | string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  useEffect(() => {
    const saved = localStorage.getItem('lastReadHadith');
    if (saved) {
      setLastRead(JSON.parse(saved));
    }
  }, []);

  const saveLastRead = (hadithNumber: number) => {
    const book = BOOKS.find(b => b.id === selectedBook);
    const lastReadData: LastReadHadith = {
      bookId: selectedBook,
      bookName: book?.name || '',
      sectionId: selectedSection,
      hadithNumber
    };
    localStorage.setItem('lastReadHadith', JSON.stringify(lastReadData));
    setLastRead(lastReadData);
  };

  const loadLastRead = () => {
    if (!lastRead) return;
    setSelectedBook(lastRead.bookId);
    setSelectedSection(lastRead.sectionId);
    
    // Scroll will happen in the hadiths useEffect
    setTimeout(() => {
      hadithRefs.current[lastRead.hadithNumber]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1000);
  };

  // Fetch sections when book changes
  useEffect(() => {
    const data = (hadithSections as any)[selectedBook] || {};
    setSections(data);
    
    // Find first valid section
    const validSections = Object.keys(data).filter(k => data[k] !== '');
    if (validSections.length > 0) {
      // Only auto-select if not loading from last read or if current selection is invalid for this book
      if (!selectedSection || !data[selectedSection]) {
        setSelectedSection(validSections[0]);
      }
    }
  }, [selectedBook]);

  // Fetch hadiths when section changes
  useEffect(() => {
    if (!selectedSection) return;
    async function fetchHadiths() {
      setLoading(true);
      try {
        const [benRes, araRes, engRes] = await Promise.all([
          fetch(`/api/hadith/editions/ben-${selectedBook}/sections/${selectedSection}.json`),
          fetch(`/api/hadith/editions/ara-${selectedBook}/sections/${selectedSection}.json`),
          fetch(`/api/hadith/editions/eng-${selectedBook}/sections/${selectedSection}.json`)
        ]);
        
        const [benData, araData, engData] = await Promise.all([
          benRes.json(),
          araRes.json(),
          engRes.ok ? engRes.json() : Promise.resolve(null)
        ]);

        if (!benData.hadiths || !araData.hadiths) {
          throw new Error("Invalid hadith data received");
        }

        const merged: HadithItem[] = benData.hadiths.map((b: any) => {
          const a = araData.hadiths.find((x: any) => x.hadithnumber === b.hadithnumber);
          const e = engData?.hadiths?.find((x: any) => x.hadithnumber === b.hadithnumber);
          return {
            hadithnumber: b.hadithnumber,
            arabicText: a ? a.text : '',
            banglaText: b.text,
            transliteration: e ? e.text : undefined,
            reference: `${BOOKS.find(book => book.id === selectedBook)?.name}, হাদিস ${convertToBanglaNumber(b.hadithnumber)}`
          };
        });
        setHadiths(merged);

        // If we just loaded a section from last read, scroll to it
        if (lastRead && lastRead.bookId === selectedBook && lastRead.sectionId === selectedSection) {
          setTimeout(() => {
            hadithRefs.current[lastRead.hadithNumber]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 500);
        }
      } catch (error) {
        console.error('Error fetching hadiths', error);
      } finally {
        setLoading(false);
      }
    }
    fetchHadiths();
  }, [selectedBook, selectedSection]);

  const filteredHadiths = hadiths.filter(h => 
    h.banglaText.includes(searchQuery) || h.arabicText.includes(searchQuery)
  );

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="bg-emerald-800 dark:bg-emerald-950 text-white pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <BookText size={150} className="-mt-10 -mr-10 transform rotate-12" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white ml-3 font-serif">হাদিস শরীফ</h1>
          </div>
          <p className="text-emerald-100 text-sm opacity-80">নির্বাচিত সহীহ হাদিস সংকলন</p>
          
          <div className="mt-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-emerald-300" />
            </div>
            <input
              type="text"
              placeholder="হাদিস খুঁজুন..."
              className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl bg-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Last Read Card */}
      {lastRead && !searchQuery && (
        <div className="px-4 mt-6">
          <button 
            onClick={loadLastRead}
            className="w-full bg-emerald-900 dark:bg-emerald-950 rounded-[32px] p-6 shadow-xl shadow-emerald-900/20 text-white flex items-center justify-between relative overflow-hidden group border border-emerald-800 dark:border-emerald-900 text-left"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <History size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center space-x-2 text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-2">
                <History size={12} />
                <span>সর্বশেষ পঠিত হাদিস</span>
              </div>
              <h3 className="text-xl font-bold font-serif">{lastRead.bookName}</h3>
              <p className="text-emerald-100/60 text-xs mt-1">হাদিস নং {convertToBanglaNumber(lastRead.hadithNumber)} থেকে পড়া চালিয়ে যান</p>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/5">
              <ChevronRight size={20} />
            </div>
          </button>
        </div>
      )}

      {/* Book Selection (Horizontal Scroll) */}
      <div className="mt-6 px-4 overflow-x-auto no-scrollbar flex space-x-4 pb-4">
        {BOOKS.map((book) => (
          <button
            key={book.id}
            onClick={() => setSelectedBook(book.id)}
            className={cn(
              "flex-shrink-0 w-32 p-4 rounded-[28px] border transition-all text-left relative overflow-hidden group",
              selectedBook === book.id 
                ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 shadow-sm"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl mb-3 inline-block",
              selectedBook === book.id ? "bg-white/20" : "bg-slate-50 dark:bg-slate-800"
            )}>
              <BookOpen size={18} className={selectedBook === book.id ? "text-white" : "text-emerald-600"} />
            </div>
            <p className="text-xs font-bold leading-tight mb-1">{book.name}</p>
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-wider",
              selectedBook === book.id ? "text-emerald-100" : "text-slate-400"
            )}>
              {convertToBanglaNumber(book.count)} হাদিস
            </p>
          </button>
        ))}
      </div>

      {/* Section Selector */}
      <div className="px-4 mt-2">
        <div className="relative">
          <select 
            className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 py-3.5 pl-4 pr-10 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-colors"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          >
            {Object.entries(sections).filter(([k, v]) => v !== '').map(([k, v]) => (
              <option key={k} value={k}>অধ্যায় {convertToBanglaNumber(parseInt(k))}: {v}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <ChevronDown size={18} />
          </div>
        </div>
      </div>

      {/* Hadith List */}
      <div className="px-4 mt-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-400 text-xs font-medium">লোড হচ্ছে...</p>
          </div>
        ) : (
          <>
            {filteredHadiths.map((hadith) => (
              <div 
                key={hadith.hadithnumber} 
                ref={el => hadithRefs.current[hadith.hadithnumber] = el}
                onClick={() => saveLastRead(hadith.hadithnumber)}
                className={cn(
                  "bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border transition-all cursor-pointer",
                  lastRead?.hadithNumber === hadith.hadithnumber && lastRead?.bookId === selectedBook ? "border-emerald-500 ring-1 ring-emerald-500/20" : "border-slate-100 dark:border-slate-800"
                )}
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-50 dark:border-slate-800">
                  <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                    হাদিস {convertToBanglaNumber(hadith.hadithnumber)}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    {hadith.reference}
                  </span>
                </div>

                {hadith.arabicText && (
                  <div className="text-right mb-8">
                    <p className="font-serif text-2xl leading-[2.4] text-slate-800 dark:text-slate-200" dir="rtl">
                      {hadith.arabicText}
                    </p>
                  </div>
                )}

                {hadith.transliteration && (
                  <div className="mb-4 px-1">
                    <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold leading-relaxed italic">
                      উচ্চারণ: {hadith.transliteration}
                    </p>
                  </div>
                )}

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 transition-colors">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[15px] font-medium">
                    {hadith.banglaText}
                  </p>
                </div>
              </div>
            ))}
            
            {filteredHadiths.length === 0 && (
              <div className="text-center py-20 text-slate-400">
                <p>কোনো হাদিস পাওয়া যায়নি।</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
