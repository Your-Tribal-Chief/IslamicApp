import React, { useState } from 'react';
import { RotateCcw, ChevronDown, Plus, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const TASBIH_OPTIONS = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', bangla: 'সুবহানাল্লাহ', meaning: 'আল্লাহ পবিত্র', target: 33 },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', bangla: 'আলহামদুলিল্লাহ', meaning: 'সমস্ত প্রশংসা আল্লাহর', target: 33 },
  { id: 'allahuakbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', bangla: 'আল্লাহু আকবার', meaning: 'আল্লাহ সর্বশ্রেষ্ঠ', target: 34 },
  { id: 'la_ilaha', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', bangla: 'লা ইলাহা ইল্লাল্লাহ', meaning: 'আল্লাহ ছাড়া কোন উপাস্য নেই', target: 100 },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', bangla: 'আস্তাগফিরুল্লাহ', meaning: 'আমি আল্লাহর কাছে ক্ষমা চাই', target: 100 },
];

export default function Tasbih() {
  const navigate = useNavigate();
  const [selectedTasbih, setSelectedTasbih] = useState(TASBIH_OPTIONS[0]);
  const [count, setCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const handleTap = () => {
    if (count < selectedTasbih.target) {
      setCount(prev => prev + 1);
      if (navigator.vibrate) {
        navigator.vibrate(40);
      }
    } else {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const resetCount = () => {
    setCount(0);
  };

  const convertToBanglaNumber = (num: number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  const progress = (count / selectedTasbih.target) * 100;

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-12 px-4 rounded-b-[48px] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Plus size={200} className="-mt-20 -mr-20" />
        </div>
        <div className="flex items-center mb-4 relative z-10">
          <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white ml-3">ডিজিটাল তাসবিহ</h1>
        </div>
        <p className="text-emerald-100 text-sm opacity-80 relative z-10">জিকির ও দোয়া</p>
      </div>

      <div className="flex-1 flex flex-col items-center p-6 -mt-8 relative z-20">
        {/* Selector */}
        <div className="relative w-full mb-10">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="w-full bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-xl shadow-emerald-900/5 border border-slate-100 dark:border-slate-800 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="text-left">
              <p className="font-serif text-3xl text-emerald-800 dark:text-emerald-400 mb-2">{selectedTasbih.arabic}</p>
              <p className="font-bold text-slate-800 dark:text-slate-200 text-base">{selectedTasbih.bangla}</p>
              <p className="text-emerald-600 dark:text-emerald-500 text-[10px] font-bold uppercase tracking-wider mt-1">{selectedTasbih.meaning}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-xl">
              <ChevronDown className={cn("text-slate-400 transition-transform duration-300", showOptions && "rotate-180")} size={20} />
            </div>
          </button>

          {showOptions && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-30 animate-in fade-in slide-in-from-top-2 duration-300">
              {TASBIH_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedTasbih(option);
                    setCount(0);
                    setShowOptions(false);
                  }}
                  className="w-full text-left p-6 border-b border-slate-50 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors last:border-0"
                >
                  <p className="font-serif text-2xl text-emerald-800 dark:text-emerald-400 mb-1">{option.arabic}</p>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{option.bangla}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Counter Display */}
        <div className="mb-12 text-center">
          <div className="text-8xl font-bold text-emerald-800 dark:text-emerald-400 font-serif tracking-tighter drop-shadow-sm">
            {convertToBanglaNumber(count)}
          </div>
          <div className="mt-4 inline-flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/30 px-4 py-1.5 rounded-full text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-100 dark:border-emerald-900">
            <span>লক্ষ্য: {convertToBanglaNumber(selectedTasbih.target)}</span>
          </div>
        </div>

        {/* Tap Button */}
        <div className="relative mb-12">
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-72 h-72 -m-12 transform -rotate-90 pointer-events-none drop-shadow-md">
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              className="text-emerald-50 dark:text-emerald-950/20"
            />
            <circle
              cx="144"
              cy="144"
              r="130"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={130 * 2 * Math.PI}
              strokeDashoffset={130 * 2 * Math.PI - (progress / 100) * 130 * 2 * Math.PI}
              strokeLinecap="round"
              className="text-emerald-500 transition-all duration-500 ease-out"
            />
          </svg>

          <button
            onClick={handleTap}
            className={cn(
              "w-48 h-48 rounded-full shadow-2xl flex items-center justify-center transition-all active:scale-90 relative z-10",
              count >= selectedTasbih.target 
                ? "bg-emerald-600 text-white" 
                : "bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 border-8 border-emerald-50 dark:border-emerald-950/30"
            )}
          >
            <div className="text-center">
              <p className="text-2xl font-bold">
                {count >= selectedTasbih.target ? 'সম্পন্ন' : 'ট্যাপ'}
              </p>
            </div>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetCount}
          className="flex items-center space-x-3 px-8 py-4 bg-white dark:bg-slate-900 rounded-[24px] shadow-lg shadow-emerald-900/5 text-slate-600 dark:text-slate-400 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 transition-all border border-slate-100 dark:border-slate-800"
        >
          <RotateCcw size={18} className="text-emerald-600" />
          <span>রিসেট করুন</span>
        </button>
      </div>
    </div>
  );
}
