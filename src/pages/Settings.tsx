import React, { useState } from 'react';
import { ChevronLeft, Bell, Globe, Moon, Shield, HelpCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

export default function Settings() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const settingsGroups = [
    {
      title: 'সাধারণ',
      items: [
        { id: 'notifications', icon: <Bell size={20} className="text-emerald-600" />, label: 'প্রার্থনার সময় নোটিফিকেশন', type: 'toggle', value: notifications, onChange: setNotifications },
        { id: 'language', icon: <Globe size={20} className="text-blue-600" />, label: 'ভাষা (Language)', type: 'select', value: 'বাংলা' },
        { id: 'theme', icon: <Moon size={20} className="text-indigo-600" />, label: 'ডার্ক মোড', type: 'toggle', value: theme === 'dark', onChange: toggleTheme },
      ]
    },
    {
      title: 'হিসাব পদ্ধতি',
      items: [
        { id: 'calculation', label: 'প্রার্থনার সময় হিসাব পদ্ধতি', type: 'select', value: 'University of Islamic Sciences, Karachi' },
        { id: 'asr', label: 'আসর নামাজের পদ্ধতি', type: 'select', value: 'Hanafi' },
      ]
    },
    {
      title: 'অন্যান্য',
      items: [
        { id: 'privacy', icon: <Shield size={20} className="text-slate-600" />, label: 'প্রাইভেসি পলিসি', type: 'link' },
        { id: 'help', icon: <HelpCircle size={20} className="text-slate-600" />, label: 'সাহায্য ও সাপোর্ট', type: 'link' },
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white ml-3">সেটিংস</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 mt-2">
        {settingsGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4">{group.title}</h3>
            <div className="bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
              {group.items.map((item, itemIdx) => (
                <div key={item.id} className={`flex items-center justify-between p-5 ${itemIdx !== group.items.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''}`}>
                  <div className="flex items-center space-x-4">
                    {item.icon && <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">{item.icon}</div>}
                    <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{item.label}</span>
                  </div>
                  
                  {item.type === 'toggle' && (
                    <button 
                      onClick={() => item.onChange && item.onChange(!item.value)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${item.value ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${item.value ? 'left-7' : 'left-1'}`} />
                    </button>
                  )}
                  
                  {item.type === 'select' && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded-lg max-w-[120px] truncate">
                      {item.value}
                    </span>
                  )}
                  
                  {item.type === 'link' && (
                    <ChevronLeft size={16} className="text-slate-300 dark:text-slate-600 rotate-180" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full flex items-center justify-center space-x-2 p-5 bg-white dark:bg-slate-900 rounded-[32px] text-red-500 font-bold border border-red-50 dark:border-red-900/30 shadow-sm active:scale-95 transition-all">
          <LogOut size={20} />
          <span>লগ আউট</span>
        </button>
      </div>
    </div>
  );
}
