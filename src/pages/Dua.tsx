import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Search, Bookmark, Share2, Play, Pause, RefreshCw, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DUA_CATEGORIES, DUAS } from '../data/duas';
import { SPECIAL_DUAS, SpecialDua } from '../data/specialDuas';
import { cn } from '../lib/utils';

export default function Dua() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialDua, setSpecialDua] = useState<SpecialDua>(SPECIAL_DUAS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getRandomDua = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    const currentIndex = SPECIAL_DUAS.findIndex(d => d.id === specialDua.id);
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * SPECIAL_DUAS.length);
    } while (nextIndex === currentIndex && SPECIAL_DUAS.length > 1);
    
    setSpecialDua(SPECIAL_DUAS[nextIndex]);
  };

  const toggleAudio = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(specialDua.audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => console.error("Audio play failed:", err));
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    // Reset audio when special dua changes
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = new Audio(specialDua.audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [specialDua]);

  const filteredDuas = DUAS.filter(dua => {
    const matchesCategory = selectedCategory ? dua.category === selectedCategory : true;
    const matchesSearch = dua.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         dua.bangla.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white ml-3">দোয়া ও জিকির</h1>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-emerald-300" />
          </div>
          <input
            type="text"
            placeholder="দোয়া খুঁজুন..."
            className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl bg-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Special Dua Card */}
      {!searchQuery && !selectedCategory && (
        <div className="px-4 mt-6">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-xl shadow-emerald-900/5 dark:shadow-black/20 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Sparkles size={80} className="text-emerald-600" />
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Sparkles size={16} />
              </div>
              <h3 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">বিশেষ ফজিলতপূর্ণ দোয়া</h3>
            </div>

            <div className="mb-4">
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">{specialDua.title}</h4>
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/50 mb-6">
                <p className="text-emerald-900 dark:text-emerald-100 font-serif text-2xl leading-relaxed text-right mb-4" dir="rtl">
                  {specialDua.arabic}
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 text-xs font-bold italic mb-3">
                  উচ্চারণ: {specialDua.transliteration}
                </p>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  অর্থ: {specialDua.banglaMeaning}
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl p-4 border border-amber-100 dark:border-amber-900/50 mb-6">
                <h5 className="text-amber-800 dark:text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                  ফজিলত
                </h5>
                <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed font-medium">
                  {specialDua.virtue}
                </p>
                <p className="text-[10px] text-amber-600/60 dark:text-amber-500/60 mt-2 font-bold uppercase">সূত্র: {specialDua.source}</p>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={toggleAudio}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95",
                    isPlaying 
                      ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400" 
                      : "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20"
                  )}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  <span>{isPlaying ? 'বন্ধ করুন' : 'শুনুন'}</span>
                </button>
                <button 
                  onClick={getRandomDua}
                  className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
                  title="অন্য দোয়া দেখুন"
                >
                  <RefreshCw size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 mt-6 overflow-x-auto no-scrollbar flex space-x-3 pb-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${!selectedCategory ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-900/10' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'}`}
        >
          সব দোয়া
        </button>
        {DUA_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border flex items-center space-x-2 ${selectedCategory === cat.id ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-900/10' : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800'}`}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      {/* Dua List */}
      <div className="p-4 space-y-4">
        {filteredDuas.map((dua) => (
          <div key={dua.id} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">{dua.title}</h3>
              <div className="flex space-x-2">
                <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                  <Bookmark size={18} />
                </button>
                <button className="p-2 text-slate-300 hover:text-emerald-500 transition-colors">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            
            <div className="text-right mb-6">
              <p className="font-serif text-2xl leading-[2.2] text-slate-800 dark:text-slate-200" dir="rtl">
                {dua.arabic}
              </p>
            </div>

            {dua.transliteration && (
              <div className="mb-4 px-1">
                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold leading-relaxed italic">
                  উচ্চারণ: {dua.transliteration}
                </p>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 transition-colors">
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                {dua.bangla}
              </p>
              <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">
                সূত্র: {dua.reference}
              </p>
            </div>
          </div>
        ))}
        
        {filteredDuas.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p>দুঃখিত, কোনো দোয়া পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
}
