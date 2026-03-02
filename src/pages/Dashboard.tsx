import React, { useEffect, useState } from 'react';
import { MapPin, Moon, Sun } from 'lucide-react';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: { en: string; ar: string };
  month: { number: number; en: string; ar: string };
  year: string;
  designation: { abbreviated: string; expanded: string };
  holidays: string[];
}

export default function Dashboard() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1');
        const data = await res.json();
        setPrayerTimes(data.data.timings);
        setHijriDate(data.data.date.hijri);
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const convertToBanglaNumber = (numStr: string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return numStr.replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return convertToBanglaNumber(`${h}:${minutes} ${ampm}`);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full">লোড হচ্ছে...</div>;
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] pb-8">
      {/* Hero Section */}
      <div className="relative h-64 bg-emerald-800 rounded-b-3xl overflow-hidden shadow-lg">
        <img 
          src="https://images.unsplash.com/photo-1565552643952-b482ba00ac37?q=80&w=1000&auto=format&fit=crop" 
          alt="Mosque" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent" />
        
        <div className="relative z-10 p-6 flex flex-col h-full justify-between text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-serif mb-1">ইসলামিক অ্যাপ</h1>
              <div className="flex items-center text-emerald-100 text-sm">
                <MapPin size={14} className="mr-1" />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {convertToBanglaNumber(hijriDate?.day || '')} {hijriDate?.month.ar} {convertToBanglaNumber(hijriDate?.year || '')}
              </div>
              <div className="text-xs text-emerald-100 mt-2">
                {convertToBanglaNumber(format(new Date(), 'dd MMMM yyyy', { locale: bn }))}
              </div>
            </div>
          </div>

          <div className="text-center pb-2">
            <p className="text-emerald-100 text-sm mb-1">পরবর্তী ওয়াক্ত</p>
            <h2 className="text-4xl font-bold tracking-tight">
              আসন্ন
            </h2>
          </div>
        </div>
      </div>

      {/* Sehri & Iftar Cards */}
      <div className="px-4 -mt-6 relative z-20 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
          <div className="bg-indigo-50 p-3 rounded-full text-indigo-500">
            <Moon size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">সেহরি শেষ</p>
            <p className="text-lg font-bold text-slate-800">{formatTime(prayerTimes?.Imsak || '')}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center space-x-3">
          <div className="bg-orange-50 p-3 rounded-full text-orange-500">
            <Sun size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">ইফতার শুরু</p>
            <p className="text-lg font-bold text-slate-800">{formatTime(prayerTimes?.Maghrib || '')}</p>
          </div>
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="px-4 mt-6 mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">নামাজের সময়সূচি</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <PrayerRow name="ফজর" time={prayerTimes?.Fajr} icon={<Moon size={18} />} />
          <PrayerRow name="সূর্যোদয়" time={prayerTimes?.Sunrise} icon={<Sun size={18} />} isHighlight={false} />
          <PrayerRow name="যোহর" time={prayerTimes?.Dhuhr} icon={<Sun size={18} />} />
          <PrayerRow name="আসর" time={prayerTimes?.Asr} icon={<Sun size={18} />} />
          <PrayerRow name="মাগরিব" time={prayerTimes?.Maghrib} icon={<Moon size={18} />} />
          <PrayerRow name="এশা" time={prayerTimes?.Isha} icon={<Moon size={18} />} isLast />
        </div>
      </div>
    </div>
  );
}

function PrayerRow({ name, time, icon, isHighlight = true, isLast = false }: { name: string, time?: string, icon: React.ReactNode, isHighlight?: boolean, isLast?: boolean }) {
  const convertToBanglaNumber = (numStr: string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return numStr.replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    let h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return convertToBanglaNumber(`${h}:${minutes} ${ampm}`);
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4",
      !isLast && "border-b border-slate-50",
      !isHighlight && "opacity-60 bg-slate-50/50"
    )}>
      <div className="flex items-center space-x-3 text-slate-700">
        <div className={cn("p-2 rounded-full", isHighlight ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500")}>
          {icon}
        </div>
        <span className="font-medium text-[15px]">{name}</span>
      </div>
      <div className="font-bold text-slate-800">
        {formatTime(time)}
      </div>
    </div>
  );
}
