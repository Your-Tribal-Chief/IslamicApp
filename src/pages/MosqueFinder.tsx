import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Navigation, ExternalLink, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Mosque {
  name: string;
  address: string;
  distance?: string;
  url?: string;
}

export default function MosqueFinder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  const fetchNearbyMosques = async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const radius = 3000; // 3km radius
      const query = `[out:json];(node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng});relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${lat},${lng}););out center;`;
      
      const response = await fetch(`/api/osm?data=${encodeURIComponent(query)}`);

      if (!response.ok) throw new Error("OSM API failed");
      
      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const foundMosques: Mosque[] = data.elements.map((el: any) => {
          const latVal = el.lat || el.center?.lat;
          const lonVal = el.lon || el.center?.lon;
          return {
            name: el.tags.name || el.tags['name:en'] || el.tags['name:bn'] || 'মসজিদ',
            address: el.tags['addr:full'] || el.tags['addr:street'] || el.tags['addr:place'] || 'ঠিকানা ম্যাপে দেখুন',
            url: `https://www.google.com/maps/search/?api=1&query=${latVal},${lonVal}`
          };
        });
        setMosques(foundMosques);
      } else {
        setError("কাছাকাছি কোনো মসজিদ পাওয়া যায়নি।");
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setError("মসজিদ খুঁজতে সমস্যা হয়েছে। আপনার ইন্টারনেট সংযোগ চেক করুন।");
    } finally {
      setLoading(false);
    }
  };

  const getMyLocation = () => {
    setLoading(true);
    setError(null);
    
    if (!navigator.geolocation) {
      setError("আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।");
      setLoading(false);
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(loc);
        fetchNearbyMosques(loc.lat, loc.lng);
      },
      (err) => {
        console.error('Geolocation error:', err);
        let msg = "আপনার লোকেশন পাওয়া যায়নি।";
        if (err.code === 1) msg = "লোকেশন পারমিশন প্রয়োজন। অনুগ্রহ করে সেটিংস থেকে পারমিশন দিন।";
        else if (err.code === 3) msg = "লোকেশন পেতে অনেক সময় লাগছে। আবার চেষ্টা করুন।";
        setError(msg);
        setLoading(false);
      },
      options
    );
  };

  useEffect(() => {
    getMyLocation();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-[40px] shadow-lg sticky top-0 z-20">
        <div className="flex items-center mb-4">
          <button onClick={() => navigate(-1)} className="text-white p-2 bg-white/10 rounded-xl backdrop-blur-sm -ml-1">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-white ml-3">মসজিদ খুঁজুন</h1>
        </div>
        <p className="text-emerald-100 text-sm opacity-80">আপনার কাছাকাছি থাকা মসজিদসমূহ</p>
      </div>

      <div className="p-4 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">মসজিদ খোঁজা হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 text-center shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <div className="bg-red-50 dark:bg-red-950/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
              <MapPin size={32} />
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">{error}</p>
            <button 
              onClick={getMyLocation}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center mx-auto space-x-2 active:scale-95 transition-all"
            >
              <RefreshCw size={18} />
              <span>আবার চেষ্টা করুন</span>
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">কাছাকাছি মসজিদসমূহ</h3>
              <button onClick={getMyLocation} className="text-emerald-600 p-2">
                <RefreshCw size={16} />
              </button>
            </div>
            
            {mosques.map((mosque, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-emerald-200 dark:hover:border-emerald-800 transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-lg mb-1">{mosque.name}</h3>
                    <div className="flex items-start text-slate-500 dark:text-slate-400 text-sm">
                      <MapPin size={14} className="mr-1.5 mt-0.5 text-emerald-500 shrink-0" />
                      <span className="line-clamp-2">{mosque.address}</span>
                    </div>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl text-emerald-600 ml-4">
                    <Navigation size={20} />
                  </div>
                </div>
                
                {mosque.url && (
                  <a 
                    href={mosque.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-6 w-full py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center justify-center space-x-2 border border-slate-100 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors"
                  >
                    <span>ম্যাপে দেখুন</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
