import React, { useState } from 'react';
import { ChevronLeft, Search, Bookmark, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DUA_CATEGORIES, DUAS } from '../data/duas';

export default function Dua() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
