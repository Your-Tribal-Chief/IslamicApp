import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Bot, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AskHujur() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'আসসালামু আলাইকুম। আমি আপনার ডিজিটাল হুজুর। কুরআন ও হাদিসের আলোকে আপনার যেকোনো সমস্যার সমাধান বা পরামর্শের জন্য আমি এখানে আছি। আপনি কী জানতে চান?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Check server health first
      let serverHealthy = false;
      try {
        const healthRes = await fetch("/api/health", { signal: AbortSignal.timeout(3000) });
        if (healthRes.ok) {
          const healthData = await healthRes.json();
          serverHealthy = healthData.status === "ok";
        }
      } catch (e) {
        console.warn("Server health check failed or timed out, will try client-side fallback if needed", e);
      }

      let assistantMessage = "";

      if (serverHealthy) {
        const response = await fetch("/api/ask-hujur", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            messages: [
              ...messages.map(m => ({
                role: m.role,
                content: m.content
              })),
              { role: 'user', content: userMessage }
            ]
          })
        });

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          if (response.ok) {
            assistantMessage = data.choices[0].message.content;
          } else {
            console.error("Server API Error:", data);
            throw new Error(data.error || data.message || "AI Service Error");
          }
        } else {
          const text = await response.text();
          console.error("Non-JSON response from server:", text);
          throw new Error("Server returned non-JSON response");
        }
      } else {
        // Client-side fallback to Gemini
        console.log("Using client-side Gemini fallback...");
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) throw new Error("Server unreachable and no client-side API key found.");

        const ai = new GoogleGenAI({ apiKey });
        
        const systemInstruction = "You are a wise and compassionate Islamic scholar (Mawlana/Hujur). Your goal is to provide halal advice and solutions based on the Quran and Hadith. Always answer in Bengali. Be respectful, empathetic, and provide references where possible.";
        
        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            ...messages.map(m => ({
              role: m.role === 'user' ? 'user' : 'model',
              parts: [{ text: m.content }]
            })),
            { role: 'user', parts: [{ text: userMessage }] }
          ],
          config: {
            systemInstruction
          }
        });
        assistantMessage = result.text || "দুঃখিত, আমি কোনো উত্তর খুঁজে পাইনি।";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error: any) {
      console.error('Final Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `দুঃখিত, আমি এই মুহূর্তে উত্তর দিতে পারছি না।\n\nত্রুটি: ${error.message}\n\nঅনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করুন এবং আবার চেষ্টা করুন।` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] transition-colors duration-300">
      {/* Header */}
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="flex items-center mb-2">
          <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
            <ChevronLeft size={20} />
          </button>
          <div className="ml-3">
            <h1 className="text-xl font-bold text-white">হুজুরকে জিজ্ঞাসা করুন</h1>
            <p className="text-emerald-100 text-[10px] opacity-80 uppercase tracking-widest font-bold">Powered by Islamic AI</p>
          </div>
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
