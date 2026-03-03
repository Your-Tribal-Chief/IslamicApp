import React, { useState, useEffect } from 'react';
import { ChevronLeft, Calculator, Info, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

export default function ZakatCalculator() {
  const navigate = useNavigate();
  const [cash, setCash] = useState<number>(0);
  const [goldVori, setGoldVori] = useState<number>(0);
  const [silverVori, setSilverVori] = useState<number>(0);
  const [goldPricePerVori, setGoldPricePerVori] = useState<number>(120000); // Default fallback
  const [silverPricePerVori, setSilverPricePerVori] = useState<number>(2000); // Default fallback
  const [investment, setInvestment] = useState<number>(0);
  const [debt, setDebt] = useState<number>(0);
  const [fetchingPrices, setFetchingPrices] = useState(false);

  useEffect(() => {
    fetchCurrentPrices();
  }, []);

  const fetchCurrentPrices = async () => {
    setFetchingPrices(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
      if (!apiKey) throw new Error("API Key missing");
      
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Find the current price of 1 vori (11.66 grams) of 22K gold and 1 vori of silver in Bangladesh Taka (BDT). Return ONLY a JSON object with keys 'gold' and 'silver' as numbers.",
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              gold: { type: Type.NUMBER },
              silver: { type: Type.NUMBER }
            },
            required: ["gold", "silver"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      if (data.gold) setGoldPricePerVori(data.gold);
      if (data.silver) setSilverPricePerVori(data.silver);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    } finally {
      setFetchingPrices(false);
    }
  };

  const goldValue = goldVori * goldPricePerVori;
  const silverValue = silverVori * silverPricePerVori;
  const totalAssets = cash + goldValue + silverValue + investment;
  const netAssets = totalAssets - debt;
  const zakatPayable = netAssets > 0 ? netAssets * 0.025 : 0;

  const convertToBanglaNumber = (num: number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toFixed(2).replace(/\d/g, (match) => banglaDigits[parseInt(match)] || match);
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-3xl shadow-md sticky top-0 z-10">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-white p-1 -ml-1">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-white ml-2">যাকাত ক্যালকুলেটর</h1>
        </div>
        <p className="text-emerald-100 text-sm opacity-90">আপনার সম্পদের বার্ষিক যাকাত হিসাব করুন</p>
      </div>

      <div className="p-4 space-y-6">
        {/* Info Card */}
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-2xl p-4 flex items-start space-x-3">
          <Info className="text-emerald-600 dark:text-emerald-400 mt-0.5" size={20} />
          <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed">
            যাকাত হলো আপনার নিট সম্পদের ২.৫%। এটি তখনই প্রযোজ্য যখন আপনার সম্পদ নিসাব পরিমাণ (৭.৫ ভরি স্বর্ণ বা ৫২.৫ ভরি রূপার সমমূল্য) অতিক্রম করে।
          </p>
        </div>

        {/* Form */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6 transition-colors">
          <InputField label="নগদ টাকা (ব্যাংক ও হাতে)" value={cash} onChange={setCash} prefix="৳" />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">স্বর্ণ ও রূপা (ভরি হিসেবে)</label>
              <button 
                onClick={fetchCurrentPrices} 
                className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1"
                disabled={fetchingPrices}
              >
                <RefreshCw size={10} className={fetchingPrices ? 'animate-spin' : ''} />
                <span>মূল্য আপডেট করুন</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="স্বর্ণ (ভরি)" value={goldVori} onChange={setGoldVori} prefix="ভরি" />
              <InputField label="রূপা (ভরি)" value={silverVori} onChange={setSilverVori} prefix="ভরি" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-400 font-medium">
              <p>বর্তমান স্বর্ণের মূল্য: ৳ {convertToBanglaNumber(goldPricePerVori)}/ভরি</p>
              <p>বর্তমান রূপার মূল্য: ৳ {convertToBanglaNumber(silverPricePerVori)}/ভরি</p>
            </div>
          </div>

          <InputField label="বিনিয়োগ ও শেয়ার" value={investment} onChange={setInvestment} prefix="৳" />
          <InputField label="ঋণ (বাদ যাবে)" value={debt} onChange={setDebt} prefix="৳" />
        </div>

        {/* Result Card */}
        <div className="bg-emerald-800 dark:bg-emerald-900 rounded-3xl p-6 shadow-lg text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <Calculator size={24} />
            </div>
            <div className="text-right">
              <p className="text-emerald-100 text-xs font-medium uppercase tracking-wider">মোট যাকাত</p>
              <h2 className="text-3xl font-bold">৳ {convertToBanglaNumber(zakatPayable)}</h2>
            </div>
          </div>
          
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex justify-between text-sm">
              <span className="text-emerald-100">মোট সম্পদ:</span>
              <span className="font-bold">৳ {convertToBanglaNumber(totalAssets)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-emerald-100">নিট সম্পদ:</span>
              <span className="font-bold">৳ {convertToBanglaNumber(netAssets)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, prefix }: { label: string, value: number, onChange: (val: number) => void, prefix: string }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block">{label}</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">{prefix}</span>
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-slate-800 dark:text-slate-200"
          placeholder="০.০০"
        />
      </div>
    </div>
  );
}
