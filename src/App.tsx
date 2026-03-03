import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BookText, MoreHorizontal } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Quran from './pages/Quran';
import SurahDetail from './pages/SurahDetail';
import Hadith from './pages/Hadith';
import Qibla from './pages/Qibla';
import Tasbih from './pages/Tasbih';
import NamesOfAllah from './pages/NamesOfAllah';
import ZakatCalculator from './pages/ZakatCalculator';
import Dua from './pages/Dua';
import MosqueFinder from './pages/MosqueFinder';
import Settings from './pages/Settings';
import IslamicCalendar from './pages/IslamicCalendar';
import HalalFinder from './pages/HalalFinder';
import More from './pages/More';
import AskHujur from './pages/AskHujur';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppContent() {
  const location = useLocation();
  const { theme } = useTheme();
  const isSurahDetail = location.pathname.startsWith('/surah/');

  return (
    <div className={`flex flex-col h-screen ${theme === 'dark' ? 'dark bg-[#0c0c0c]' : 'bg-[#f5f5f0]'} font-sans text-slate-900 dark:text-slate-100 max-w-md mx-auto shadow-2xl relative overflow-hidden transition-colors duration-300`}>
      <div className="flex-1 overflow-y-auto pb-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/surah/:id" element={<SurahDetail />} />
          <Route path="/hadith" element={<Hadith />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/tasbih" element={<Tasbih />} />
          <Route path="/names" element={<NamesOfAllah />} />
          <Route path="/zakat" element={<ZakatCalculator />} />
          <Route path="/dua" element={<Dua />} />
          <Route path="/mosques" element={<MosqueFinder />} />
          <Route path="/calendar" element={<IslamicCalendar />} />
          <Route path="/halal" element={<HalalFinder />} />
          <Route path="/ask-hujur" element={<AskHujur />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/more" element={<More />} />
        </Routes>
      </div>

      {!isSurahDetail && (
        <nav className="absolute bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-16 px-2 pb-safe z-50 transition-colors">
          <NavItem to="/" icon={<Home size={22} />} label="হোম" active={location.pathname === '/'} />
          <NavItem to="/quran" icon={<BookOpen size={22} />} label="কুরআন" active={location.pathname === '/quran'} />
          <NavItem to="/hadith" icon={<BookText size={22} />} label="হাদিস" active={location.pathname === '/hadith'} />
          <NavItem to="/more" icon={<MoreHorizontal size={22} />} label="আরও" active={location.pathname === '/more' || location.pathname === '/qibla' || location.pathname === '/tasbih' || location.pathname === '/names' || location.pathname === '/zakat' || location.pathname === '/dua' || location.pathname === '/mosques'} />
        </nav>
      )}
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}
