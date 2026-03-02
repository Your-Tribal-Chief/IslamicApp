import React, { useEffect, useState, useCallback } from 'react';
import { MapPin, Moon, Sun, BookOpen, Compass, CircleDot, Heart, Calculator, ChevronRight, BookText, MessageSquare, Bell, BellOff } from 'lucide-react';
import { cn } from '../lib/utils';
import { format, addMinutes, isBefore, parse } from 'date-fns';
import { bn } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

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
  const { theme, toggleTheme } = useTheme();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPrayer, setCurrentPrayer] = useState<{ name: string; id: string; time: string; endsIn: string } | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; id: string; time: string; startsIn: string } | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem('notifications') === 'true';
  });

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('notifications', 'true');
      }
    }
  };

  const toggleNotifications = () => {
    if (!notificationsEnabled) {
      requestNotificationPermission();
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('notifications', 'false');
    }
  };

  const updatePrayerStatus = useCallback((timings: PrayerTimes) => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const prayers = [
      { name: 'ফজর', id: 'Fajr', time: timings.Fajr },
      { name: 'যোহর', id: 'Dhuhr', time: timings.Dhuhr },
      { name: 'আসর', id: 'Asr', time: timings.Asr },
      { name: 'মাগরিব', id: 'Maghrib', time: timings.Maghrib },
      { name: 'এশা', id: 'Isha', time: timings.Isha },
    ];

    let currentIdx = -1;
    for (let i = 0; i < prayers.length; i++) {
      const [h, m] = prayers[i].time.split(':').map(Number);
      const prayerTime = h * 60 + m;
      if (currentMinutes >= prayerTime) {
        currentIdx = i;
      }
    }

    const convertToBanglaNumber = (numStr: string) => {
      const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      return numStr.toString().replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
    };

    const formatRemaining = (diff: number) => {
      const hours = Math.floor(diff / 60);
      const mins = diff % 60;
      return `${hours > 0 ? convertToBanglaNumber(String(hours)) + ' ঘণ্টা ' : ''}${convertToBanglaNumber(String(mins))} মিনিট`;
    };

    if (currentIdx !== -1) {
      const current = prayers[currentIdx];
      const nextIdx = (currentIdx + 1) % prayers.length;
      const next = prayers[nextIdx];
      
      // Ends in: Until next prayer starts
      const [nh, nm] = next.time.split(':').map(Number);
      let nextMinutes = nh * 60 + nm;
      if (nextIdx === 0) nextMinutes += 24 * 60; 
      
      const diffEnds = nextMinutes - currentMinutes;
      
      // Starts in: Until next prayer starts (same as Ends in for the gap)
      // But user wants "Fajr ends in 50 mins" AND "Dhuhr starts in 6 hrs"
      // Wait, if Fajr is running, it ends when Sunrise starts or when Dhuhr starts?
      // Usually "Wakt" ends at the next prayer time, except Fajr which ends at Sunrise.
      
      let currentWaktEndMinutes = nextMinutes;
      if (current.id === 'Fajr') {
        const [sh, sm] = timings.Sunrise.split(':').map(Number);
        currentWaktEndMinutes = sh * 60 + sm;
      }

      const diffWaktEnds = currentWaktEndMinutes - currentMinutes;
      
      setCurrentPrayer({
        ...current,
        endsIn: diffWaktEnds > 0 ? formatRemaining(diffWaktEnds) : 'শেষ হয়েছে'
      });

      setNextPrayer({
        ...next,
        startsIn: formatRemaining(nextMinutes - currentMinutes)
      });

      // Simple notification check
      if (notificationsEnabled && (diffWaktEnds === 30 || diffWaktEnds === 0)) {
        const title = diffWaktEnds === 0 ? `${next.name} শুরু হয়েছে` : `${current.name} শেষ হতে ৩০ মিনিট বাকি`;
        new Notification('ইসলামিক অ্যাপ', { body: title });
      }

    } else {
      // Before Fajr
      const next = prayers[0];
      const [nh, nm] = next.time.split(':').map(Number);
      const nextMinutes = nh * 60 + nm;
      const diffStarts = nextMinutes - currentMinutes;

      setCurrentPrayer({
        name: 'শেষ রাত',
        id: 'Tahajjud',
        time: timings.Imsak,
        endsIn: formatRemaining(diffStarts)
      });
      setNextPrayer({
        ...next,
        startsIn: formatRemaining(diffStarts)
      });
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Try to get location
        let url = 'https://api.aladhan.com/v1/timingsByCity?city=Dhaka&country=Bangladesh&method=1';
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=1`);
            const data = await res.json();
            const timings = data.data.timings;
            setPrayerTimes(timings);
            setHijriDate(data.data.date.hijri);
            updatePrayerStatus(timings);
          }, async () => {
            // Fallback to Dhaka
            const res = await fetch(url);
            const data = await res.json();
            const timings = data.data.timings;
            setPrayerTimes(timings);
            setHijriDate(data.data.date.hijri);
            updatePrayerStatus(timings);
          });
        } else {
          const res = await fetch(url);
          const data = await res.json();
          const timings = data.data.timings;
          setPrayerTimes(timings);
          setHijriDate(data.data.date.hijri);
          updatePrayerStatus(timings);
        }
      } catch (error) {
        console.error('Failed to fetch prayer times:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    const interval = setInterval(() => {
      if (prayerTimes) updatePrayerStatus(prayerTimes);
    }, 60000);

    return () => clearInterval(interval);
  }, [prayerTimes, updatePrayerStatus]);

  const convertToBanglaNumber = (numStr: string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return numStr.toString().replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
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
    return (
      <div className="flex flex-col items-center justify-center h-full bg-[#f5f5f0] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-80 bg-emerald-900 dark:bg-emerald-950 rounded-b-[40px] overflow-hidden shadow-xl">
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-800 dark:bg-emerald-900 rounded-full blur-3xl opacity-50" />
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-emerald-700 dark:bg-emerald-800 rounded-full blur-3xl opacity-30" />
        
        <div className="relative z-10 p-6 flex flex-col h-full justify-between text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold font-serif mb-1">আস-সালামু আলাইকুম</h1>
              <div className="flex items-center text-emerald-100/80 text-xs font-medium">
                <MapPin size={12} className="mr-1" />
                <span>ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleNotifications}
                className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-white"
              >
                {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10 text-white"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <div className="text-right">
                <div className="text-sm font-bold bg-white/10 px-3 py-1.5 rounded-2xl backdrop-blur-md border border-white/10">
                  {convertToBanglaNumber(hijriDate?.day || '')} {hijriDate?.month.en} {convertToBanglaNumber(hijriDate?.year || '')}
                </div>
                <div className="text-[10px] text-emerald-100/60 mt-2 font-bold uppercase tracking-widest">
                  {convertToBanglaNumber(format(new Date(), 'dd MMMM yyyy', { locale: bn }))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pb-4">
            <div className="mb-2">
              <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/5">
                এখন {currentPrayer?.name}-এর সময়
              </span>
            </div>
            <div className="space-y-1 mb-2">
              <p className="text-emerald-100/70 text-[10px] font-bold uppercase tracking-wider">
                {currentPrayer?.name} শেষ হতে: {currentPrayer?.endsIn}
              </p>
              <p className="text-emerald-100/70 text-[10px] font-bold uppercase tracking-wider">
                {nextPrayer?.name} শুরু হতে: {nextPrayer?.startsIn}
              </p>
            </div>
            <h2 className="text-5xl font-bold tracking-tighter">
              {formatTime(nextPrayer?.time || '')}
            </h2>
            <p className="text-emerald-100/60 text-[10px] mt-2 font-bold uppercase tracking-widest">পরবর্তী: {nextPrayer?.name}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4 -mt-8 relative z-20">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-xl shadow-emerald-900/5 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 grid grid-cols-4 gap-y-6 gap-x-4 transition-colors">
          <QuickAction to="/quran" icon={<BookOpen className="text-emerald-600" />} label="কুরআন" />
          <QuickAction to="/hadith" icon={<BookText className="text-indigo-600" />} label="হাদিস" />
          <QuickAction to="/dua" icon={<MessageSquare className="text-blue-600" />} label="দোয়া" />
          <QuickAction to="/mosques" icon={<MapPin className="text-red-600" />} label="মসজিদ" />
          <QuickAction to="/qibla" icon={<Compass className="text-orange-500" />} label="কিবলা" />
          <QuickAction to="/tasbih" icon={<CircleDot className="text-blue-500" />} label="তাসবিহ" />
          <QuickAction to="/names" icon={<Heart className="text-pink-500" />} label="নামসমূহ" />
          <QuickAction to="/zakat" icon={<Calculator className="text-emerald-500" />} label="যাকাত" />
        </div>
      </div>

      {/* Sehri & Iftar Cards */}
      <div className="px-4 mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-3 transition-colors">
          <div className="bg-indigo-50 dark:bg-indigo-950 p-3 rounded-2xl text-indigo-500">
            <Moon size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">সেহরি শেষ</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">{formatTime(prayerTimes?.Imsak || '')}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center space-x-3 transition-colors">
          <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-2xl text-orange-500">
            <Sun size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ইফতার শুরু</p>
            <p className="text-base font-bold text-slate-800 dark:text-slate-200">{formatTime(prayerTimes?.Maghrib || '')}</p>
          </div>
        </div>
      </div>

      {/* Daily Content */}
      <div className="px-4 mt-8">
        <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl p-6 border border-emerald-100 dark:border-emerald-900/50 relative overflow-hidden transition-colors">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <BookOpen size={120} />
          </div>
          <h3 className="text-emerald-800 dark:text-emerald-400 font-bold text-sm mb-3 flex items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
            আজকের আয়াত
          </h3>
          <p className="text-emerald-900 dark:text-emerald-100 font-serif text-lg leading-relaxed italic">
            "নিশ্চয় কষ্টের সাথেই স্বস্তি রয়েছে।"
          </p>
          <p className="text-emerald-600 dark:text-emerald-500 text-xs mt-3 font-medium">— সূরা আল-ইনশিরাহ, আয়াত ৫-৬</p>
        </div>
      </div>

      {/* Prayer Times List */}
      <div className="px-4 mt-8 mb-8">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">নামাজের সময়সূচি</h3>
          <button className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center">
            বিস্তারিত <ChevronRight size={14} />
          </button>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden transition-colors">
          <PrayerRow name="ফজর" time={prayerTimes?.Fajr} icon={<Moon size={18} />} isUpcoming={nextPrayer?.name === 'ফজর'} />
          <PrayerRow name="সূর্যোদয়" time={prayerTimes?.Sunrise} icon={<Sun size={18} />} isHighlight={false} />
          <PrayerRow name="যোহর" time={prayerTimes?.Dhuhr} icon={<Sun size={18} />} isUpcoming={nextPrayer?.name === 'যোহর'} />
          <PrayerRow name="আসর" time={prayerTimes?.Asr} icon={<Sun size={18} />} isUpcoming={nextPrayer?.name === 'আসর'} />
          <PrayerRow name="মাগরিব" time={prayerTimes?.Maghrib} icon={<Moon size={18} />} isUpcoming={nextPrayer?.name === 'মাগরিব'} />
          <PrayerRow name="এশা" time={prayerTimes?.Isha} icon={<Moon size={18} />} isUpcoming={nextPrayer?.name === 'এশা'} isLast />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center space-y-2 group">
      <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center group-active:scale-90 transition-all group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{label}</span>
    </Link>
  );
}

function PrayerRow({ name, time, icon, isHighlight = true, isUpcoming = false, isLast = false }: { name: string, time?: string, icon: React.ReactNode, isHighlight?: boolean, isUpcoming?: boolean, isLast?: boolean }) {
  const convertToBanglaNumber = (numStr: string) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return numStr.toString().replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
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
      "flex items-center justify-between p-4 px-6 transition-colors",
      !isLast && "border-b border-slate-50 dark:border-slate-800",
      !isHighlight && "opacity-40 bg-slate-50/30 dark:bg-slate-800/30",
      isUpcoming && "bg-emerald-50/50 dark:bg-emerald-900/20"
    )}>
      <div className="flex items-center space-x-4 text-slate-700 dark:text-slate-300">
        <div className={cn(
          "p-2 rounded-xl transition-colors", 
          isUpcoming ? "bg-emerald-600 text-white" : (isHighlight ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500")
        )}>
          {icon}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[14px]">{name}</span>
          {isUpcoming && <span className="text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">পরবর্তী</span>}
        </div>
      </div>
      <div className={cn("font-bold text-sm", isUpcoming ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-200")}>
        {formatTime(time)}
      </div>
    </div>
  );
}
