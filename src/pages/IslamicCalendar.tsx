import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight as ChevronRightIcon, Calendar as CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isBefore } from 'date-fns';
import { bn } from 'date-fns/locale';

export default function IslamicCalendar() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriDate, setHijriDate] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchHijri() {
      try {
        const res = await fetch(`/api/aladhan/gToH/${format(currentDate, 'dd-MM-yyyy')}`);
        const data = await res.json();
        if (data && data.data && data.data.hijri) {
          setHijriDate(data.data.hijri);
        }
      } catch (error) {
        console.error('Failed to fetch hijri date:', error);
      }
    }
    fetchHijri();
  }, [currentDate]);

  const convertToBanglaNumber = (numStr: string | number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(numStr).replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const events = [
    { name: 'শবে বরাত', date: '2026-02-04', hijri: '১৫ শাবান' },
    { name: 'রমজান শুরু', date: '2026-02-18', hijri: '১ রমজান' },
    { name: 'শবে কদর', date: '2026-03-16', hijri: '২৭ রমজান' },
    { name: 'ঈদুল ফিতর', date: '2026-03-20', hijri: '১ শাওয়াল' },
    { name: 'ঈদুল আযহা', date: '2026-05-27', hijri: '১০ জিলহজ' },
    { name: 'আশুরা', date: '2026-07-25', hijri: '১০ মহরম' },
  ];

  const monthEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate.getMonth() === currentDate.getMonth() && eventDate.getFullYear() === currentDate.getFullYear();
  });

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl font-bold text-white ml-3">ইসলামিক ক্যালেন্ডার</h1>
          </div>
          <div className="text-right text-white">
            <p className="text-xs font-bold opacity-80">বর্তমান সময়</p>
            <p className="text-lg font-bold font-mono">{convertToBanglaNumber(format(currentTime, 'hh:mm:ss a'))}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 mt-2">
        {/* Current Month Display */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-emerald-600 dark:text-emerald-400">
              <ChevronLeft size={20} />
            </button>
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                {format(currentDate, 'MMMM yyyy', { locale: bn })}
              </h2>
              {hijriDate && (
                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mt-1">
                  {hijriDate.month.en} {convertToBanglaNumber(hijriDate.year)} হিজরি
                </p>
              )}
            </div>
            <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-emerald-600 dark:text-emerald-400">
              <ChevronRightIcon size={20} />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['শনি', 'রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহ', 'শুক্র'].map(day => (
              <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for start of month */}
            {Array.from({ length: startOfMonth(currentDate).getDay() === 6 ? 0 : startOfMonth(currentDate).getDay() + 1 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10" />
            ))}
            
            {days.map(day => (
              <div 
                key={day.toString()} 
                className={cn(
                  "h-10 flex flex-col items-center justify-center rounded-xl text-sm font-bold transition-all relative",
                  isSameDay(day, new Date()) 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                    : "text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                )}
              >
                {convertToBanglaNumber(format(day, 'd'))}
                {events.some(e => isSameDay(new Date(e.date), day)) && (
                  <div className="absolute bottom-1 w-1 h-1 bg-orange-400 rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Events Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">এই মাসের ঘটনাবলী</h3>
          <div className="space-y-3">
            {monthEvents.length > 0 ? monthEvents.map((event, idx) => {
              const eventDate = new Date(event.date);
              const isPast = isBefore(eventDate, new Date()) && !isSameDay(eventDate, new Date());
              return (
                <div key={idx} className={cn(
                  "bg-white dark:bg-slate-900 rounded-[32px] p-5 shadow-sm border transition-colors flex items-center space-x-4",
                  isPast ? "opacity-60 border-slate-100 dark:border-slate-800" : "border-emerald-100 dark:border-emerald-900/50"
                )}>
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    isPast ? "bg-slate-50 dark:bg-slate-800 text-slate-400" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                  )}>
                    <CalendarIcon size={24} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">{event.name}</h4>
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        isPast ? "bg-slate-100 dark:bg-slate-800 text-slate-500" : "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400"
                      )}>
                        {isPast ? 'অতীত' : 'আসন্ন'}
                      </span>
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">
                      {convertToBanglaNumber(format(eventDate, 'dd MMMM yyyy', { locale: bn }))} • {event.hijri}
                    </p>
                  </div>
                </div>
              );
            }) : (
              <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 text-center border border-slate-100 dark:border-slate-800 transition-colors">
                <p className="text-slate-400 dark:text-slate-500 text-sm">এই মাসে কোনো বিশেষ দিবস নেই</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
