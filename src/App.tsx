import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BookText, Compass, CircleDot } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Quran from './pages/Quran';
import SurahDetail from './pages/SurahDetail';
import Hadith from './pages/Hadith';
import Qibla from './pages/Qibla';
import Tasbih from './pages/Tasbih';

function AppContent() {
  const location = useLocation();
  const isSurahDetail = location.pathname.startsWith('/surah/');

  return (
    <div className="flex flex-col h-screen bg-[#f5f5f0] font-sans text-slate-900 max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-16">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/surah/:id" element={<SurahDetail />} />
          <Route path="/hadith" element={<Hadith />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/tasbih" element={<Tasbih />} />
        </Routes>
      </div>

      {!isSurahDetail && (
        <nav className="absolute bottom-0 w-full bg-white border-t border-slate-200 flex justify-around items-center h-16 px-2 pb-safe z-50">
          <NavItem to="/" icon={<Home size={22} />} label="হোম" active={location.pathname === '/'} />
          <NavItem to="/quran" icon={<BookOpen size={22} />} label="কুরআন" active={location.pathname === '/quran'} />
          <NavItem to="/hadith" icon={<BookText size={22} />} label="হাদিস" active={location.pathname === '/hadith'} />
          <NavItem to="/tasbih" icon={<CircleDot size={22} />} label="তাসবিহ" active={location.pathname === '/tasbih'} />
          <NavItem to="/qibla" icon={<Compass size={22} />} label="কিবলা" active={location.pathname === '/qibla'} />
        </nav>
      )}
    </div>
  );
}

function NavItem({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link to={to} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
