import React, { useState } from 'react';
import { ChevronLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_NAMES } from '../data/namesOfAllah';

export default function NamesOfAllah() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNames = ALL_NAMES.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.bangla.includes(searchQuery) ||
    item.meaning.includes(searchQuery)
  );

  const convertToBanglaNumber = (num: number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white ml-3">আল্লাহর ৯৯টি নাম</h1>
        </div>
        <p className="text-emerald-100 text-sm opacity-80 mb-6">আসমাউল হুসনা - আল্লাহর সুন্দরতম নামসমূহ</p>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-emerald-300" />
          </div>
          <input
            type="text"
            placeholder="নাম বা অর্থ খুঁজুন..."
            className="block w-full pl-10 pr-3 py-3 border-none rounded-2xl bg-white/20 text-white placeholder-emerald-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm transition-all text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="p-4 space-y-4 mt-2">
        {filteredNames.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[28px] p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group hover:border-emerald-200 dark:hover:border-emerald-800 transition-all active:scale-[0.98]">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                {convertToBanglaNumber(item.id)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">{item.bangla}</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{item.name}</p>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium text-xs mt-1">{item.meaning}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-serif text-2xl text-emerald-800 dark:text-emerald-400 font-medium">{item.arabic}</p>
            </div>
          </div>
        ))}
        
        {filteredNames.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p>দুঃখিত, কোনো নাম পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
}
