import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calculator, 
  Heart, 
  Calendar, 
  Settings, 
  Info, 
  Share2, 
  Star, 
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Compass,
  CircleDot,
  MapPin,
  MessageSquare,
  Utensils
} from 'lucide-react';

export default function More() {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'names', icon: <Heart className="text-pink-500" />, label: 'আল্লাহর ৯৯টি নাম', path: '/names' },
    { id: 'dua', icon: <MessageSquare className="text-blue-500" />, label: 'দোয়া ও জিকির', path: '/dua' },
    { id: 'mosques', icon: <MapPin className="text-red-500" />, label: 'মসজিদ খুঁজুন', path: '/mosques' },
    { id: 'halal', icon: <Utensils className="text-orange-600" />, label: 'হালাল রেস্টুরেন্ট', path: '/halal' },
    { id: 'zakat', icon: <Calculator className="text-emerald-500" />, label: 'যাকাত ক্যালকুলেটর', path: '/zakat' },
    { id: 'calendar', icon: <Calendar className="text-indigo-500" />, label: 'ইসলামিক ক্যালেন্ডার', path: '/calendar' },
    { id: 'qibla', icon: <Compass className="text-orange-500" />, label: 'কিবলা কম্পাস', path: '/qibla' },
    { id: 'tasbih', icon: <CircleDot className="text-blue-500" />, label: 'ডিজিটাল তাসবিহ', path: '/tasbih' },
    { id: 'quran', icon: <BookOpen className="text-emerald-600" />, label: 'আল-কুরআন', path: '/quran' },
  ];

  const supportItems = [
    { id: 'settings', icon: <Settings className="text-slate-500" />, label: 'সেটিংস', path: '/settings' },
    { id: 'about', icon: <Info className="text-slate-500" />, label: 'অ্যাপ সম্পর্কে', path: '#' },
    { id: 'share', icon: <Share2 className="text-slate-500" />, label: 'শেয়ার করুন', path: '#' },
    { id: 'rate', icon: <Star className="text-slate-500" />, label: 'রেটিং দিন', path: '#' },
    { id: 'privacy', icon: <ShieldCheck className="text-slate-500" />, label: 'প্রাইভেসি পলিসি', path: '#' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">আরও ফিচার</h1>
        <p className="text-emerald-100 text-sm text-center opacity-80">আপনার প্রয়োজনীয় ইসলামিক টুলস</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Main Features Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-2 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          {menuItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${index !== menuItems.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  {item.icon}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-200 text-[15px]">{item.label}</span>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600" size={18} />
            </button>
          ))}
        </div>

        {/* Support & Settings */}
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-4">সহায়তা ও সেটিংস</h3>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-2 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          {supportItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className={`w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${index !== supportItems.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''}`}
            >
              <div className="flex items-center space-x-4">
                <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  {item.icon}
                </div>
                <span className="font-medium text-slate-600 dark:text-slate-400 text-[15px]">{item.label}</span>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600" size={18} />
            </button>
          ))}
        </div>

        <div className="text-center pt-4">
          <p className="text-xs text-slate-400 font-medium tracking-widest uppercase">ভার্সন ১.০.০</p>
        </div>
      </div>
    </div>
  );
}
