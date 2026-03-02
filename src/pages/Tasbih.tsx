import React, { useState } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

const TASBIH_OPTIONS = [
  { id: 'subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', bangla: 'সুবহানাল্লাহ', meaning: 'আল্লাহ পবিত্র', target: 33 },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', bangla: 'আলহামদুলিল্লাহ', meaning: 'সমস্ত প্রশংসা আল্লাহর', target: 33 },
  { id: 'allahuakbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', bangla: 'আল্লাহু আকবার', meaning: 'আল্লাহ সর্বশ্রেষ্ঠ', target: 34 },
  { id: 'la_ilaha', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', bangla: 'লা ইলাহা ইল্লাল্লাহ', meaning: 'আল্লাহ ছাড়া কোন উপাস্য নেই', target: 100 },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', bangla: 'আস্তাগফিরুল্লাহ', meaning: 'আমি আল্লাহর কাছে ক্ষমা চাই', target: 100 },
];

export default function Tasbih() {
  const [selectedTasbih, setSelectedTasbih] = useState(TASBIH_OPTIONS[0]);
  const [count, setCount] = useState(0);
  const [showOptions, setShowOptions] = useState(false);

  const handleTap = () => {
    if (count < selectedTasbih.target) {
      setCount(prev => prev + 1);
      // Try to vibrate
      if (navigator.vibrate) {
        navigator.vibrate(50);
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
    <div className="flex flex-col min-h-full bg-[#f5f5f0] pb-8">
      <div className="bg-emerald-800 pt-12 pb-6 px-4 rounded-b-3xl shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">ডিজিটাল তাসবিহ</h1>
        <p className="text-emerald-100 text-sm text-center opacity-90">জিকির ও দোয়া</p>
      </div>

      <div className="flex-1 flex flex-col items-center p-6">
        {/* Selector */}
        <div className="relative w-full mb-8">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between"
          >
            <div className="text-left">
              <p className="font-serif text-2xl text-emerald-800 mb-1">{selectedTasbih.arabic}</p>
              <p className="font-bold text-slate-800">{selectedTasbih.bangla}</p>
            </div>
            <ChevronDown className={cn("text-slate-400 transition-transform", showOptions && "rotate-180")} />
          </button>

          {showOptions && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden z-20">
              {TASBIH_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setSelectedTasbih(option);
                    setCount(0);
                    setShowOptions(false);
                  }}
                  className="w-full text-left p-4 border-b border-slate-50 hover:bg-emerald-50 transition-colors last:border-0"
                >
                  <p className="font-serif text-xl text-emerald-800">{option.arabic}</p>
                  <p className="font-medium text-slate-700 text-sm">{option.bangla}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Counter Display */}
        <div className="mb-12 text-center">
          <div className="text-7xl font-bold text-emerald-800 font-serif tracking-tighter">
            {convertToBanglaNumber(count)}
          </div>
          <div className="text-slate-500 mt-2 font-medium">
            লক্ষ্য: {convertToBanglaNumber(selectedTasbih.target)}
          </div>
        </div>

        {/* Tap Button */}
        <div className="relative mb-12">
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-64 h-64 -m-8 transform -rotate-90 pointer-events-none">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-emerald-100"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={120 * 2 * Math.PI}
              strokeDashoffset={120 * 2 * Math.PI - (progress / 100) * 120 * 2 * Math.PI}
              className="text-emerald-500 transition-all duration-300 ease-out"
            />
          </svg>

          <button
            onClick={handleTap}
            className={cn(
              "w-48 h-48 rounded-full shadow-xl flex items-center justify-center transition-transform active:scale-95",
              count >= selectedTasbih.target 
                ? "bg-emerald-600 text-white" 
                : "bg-white text-emerald-800 border-4 border-emerald-50"
            )}
          >
            <div className="text-center">
              <p className="text-2xl font-bold mb-1">
                {count >= selectedTasbih.target ? 'সম্পন্ন' : 'ট্যাপ করুন'}
              </p>
            </div>
          </button>
        </div>

        {/* Reset Button */}
        <button
          onClick={resetCount}
          className="flex items-center space-x-2 px-6 py-3 bg-white rounded-full shadow-sm text-slate-600 font-medium hover:bg-slate-50 active:scale-95 transition-all"
        >
          <RotateCcw size={18} />
          <span>রিসেট করুন</span>
        </button>
      </div>
    </div>
  );
}
