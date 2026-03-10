import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Bot, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const INITIAL_MESSAGE: Message = { 
  role: 'assistant', 
  content: 'আসসালামু আলাইকুম। আমি আপনার ডিজিটাল হুজুর। কুরআন ও হাদিসের আলোকে আপনার যেকোনো সমস্যার সমাধান বা পরামর্শের জন্য আমি এখানে আছি। আপনি কী জানতে চান?' 
};

export default function AskHujur() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('ask_hujur_messages');
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    localStorage.setItem('ask_hujur_messages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const clearHistory = () => {
    if (window.confirm('আপনি কি নিশ্চিত যে আপনি চ্যাট হিস্ট্রি মুছে ফেলতে চান?')) {
      setMessages([INITIAL_MESSAGE]);
      localStorage.removeItem('ask_hujur_messages');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const model = "gemini-3-flash-preview";
      const systemPrompt = "You are a wise and compassionate Islamic scholar (Mawlana/Hujur). Your goal is to provide halal advice and solutions based on the Quran and Hadith. Always answer in Bengali. Be respectful, empathetic, and provide references where possible.";

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          { role: "user", parts: [{ text: `System Instruction: ${systemPrompt}` }] },
          ...newMessages.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }]
          }))
        ]
      });

      const assistantMessage = response.text || "দুঃখিত, আমি কোনো উত্তর খুঁজে পাইনি।";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error: any) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না। অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করুন এবং আবার চেষ্টা করুন।` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] transition-colors duration-300">
      {/* Header */}
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
              <ChevronLeft size={20} />
            </button>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-white">হুজুরকে জিজ্ঞাসা করুন</h1>
              <p className="text-emerald-100 text-[10px] opacity-80 uppercase tracking-widest font-bold">Powered by Islamic AI</p>
            </div>
          </div>
          <button 
            onClick={clearHistory}
            className="text-white/60 hover:text-white p-2 transition-colors"
            title="Clear History"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-3xl p-4 shadow-sm ${
              m.role === 'user' 
                ? 'bg-emerald-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-800'
            }`}>
              <div className="flex items-center space-x-2 mb-1 opacity-60">
                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                <span className="text-[10px] font-bold uppercase tracking-tighter">
                  {m.role === 'user' ? 'আপনি' : 'হুজুর'}
                </span>
              </div>
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 rounded-3xl rounded-tl-none p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="আপনার সমস্যা বা প্রশ্ন লিখুন..."
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 dark:text-slate-200"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-90 disabled:opacity-50 disabled:active:scale-100 transition-all"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
