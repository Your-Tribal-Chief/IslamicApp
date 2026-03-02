import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

export default function Qibla() {
  const [heading, setHeading] = useState<number | null>(null);
  const [qiblaBearing, setQiblaBearing] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const MECCA_LAT = 21.422487;
  const MECCA_LNG = 39.826206;

  const calculateQibla = (lat: number, lng: number) => {
    const PI = Math.PI;
    const latK = MECCA_LAT * PI / 180.0;
    const lngK = MECCA_LNG * PI / 180.0;
    const phi = lat * PI / 180.0;
    const lambda = lng * PI / 180.0;
    
    const y = Math.sin(lngK - lambda);
    const x = Math.cos(phi) * Math.tan(latK) - Math.sin(phi) * Math.cos(lngK - lambda);
    
    let qibla = Math.atan2(y, x) * 180.0 / PI;
    return (qibla + 360) % 360;
  };

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          startCompass();
        } else {
          setError('কম্পাস ব্যবহারের অনুমতি দেওয়া হয়নি।');
        }
      } catch (err) {
        console.error(err);
        setError('কম্পাস চালু করতে সমস্যা হয়েছে।');
      }
    } else {
      setPermissionGranted(true);
      startCompass();
    }
  };

  const startCompass = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const bearing = calculateQibla(position.coords.latitude, position.coords.longitude);
          setQiblaBearing(bearing);
        },
        (err) => {
          setError('লোকেশন পাওয়া যায়নি। দয়া করে লোকেশন চালু করুন।');
        }
      );
    } else {
      setError('আপনার ডিভাইসে লোকেশন সাপোর্ট করে না।');
    }

    window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
    // Fallback for iOS
    window.addEventListener('deviceorientation', handleOrientation as any, true);
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let alpha = event.alpha;
    let webkitCompassHeading = (event as any).webkitCompassHeading;

    if (webkitCompassHeading !== undefined) {
      // iOS
      setHeading(webkitCompassHeading);
    } else if (alpha !== null) {
      // Android
      setHeading(360 - alpha);
    }
  };

  useEffect(() => {
    // Check if permission is needed (iOS 13+)
    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      setPermissionGranted(true);
      startCompass();
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
      window.removeEventListener('deviceorientation', handleOrientation as any, true);
    };
  }, []);

  const convertToBanglaNumber = (num: number) => {
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return Math.round(num).toString().replace(/\d/g, (match) => banglaDigits[parseInt(match)]);
  };

  // Calculate the rotation for the Qibla pointer
  const dialRotation = heading !== null ? -heading : 0;
  const pointerRotation = (heading !== null && qiblaBearing !== null) ? qiblaBearing - heading : 0;

  return (
    <div className="flex flex-col min-h-full bg-[#f5f5f0] dark:bg-[#0c0c0c] pb-8 transition-colors duration-300">
      <div className="bg-emerald-800 dark:bg-emerald-950 pt-12 pb-6 px-4 rounded-b-3xl shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white mb-2 text-center">কিবলা নির্দেশক</h1>
        <p className="text-emerald-100 text-sm text-center opacity-90">কাবা শরীফের দিক</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {!permissionGranted ? (
          <div className="text-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
            <Compass size={48} className="mx-auto text-emerald-600 mb-4" />
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">কম্পাস অ্যাক্সেস প্রয়োজন</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              কিবলার সঠিক দিক নির্ণয় করার জন্য আপনার ডিভাইসের কম্পাস সেন্সর এবং লোকেশন অ্যাক্সেস প্রয়োজন।
            </p>
            <button
              onClick={requestPermission}
              className="bg-emerald-600 text-white px-6 py-3 rounded-full font-medium shadow-md active:scale-95 transition-transform"
            >
              অনুমতি দিন
            </button>
          </div>
        ) : error ? (
          <div className="text-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/30 transition-colors">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full max-w-xs">
            {/* Compass Container */}
            <div className="relative w-72 h-72 mb-12">
              {/* Outer Dial */}
              <div 
                className="absolute inset-0 rounded-full border-4 border-emerald-800 dark:border-emerald-900 shadow-xl bg-white dark:bg-slate-900 transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${dialRotation}deg)` }}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-emerald-800 dark:text-emerald-400 text-lg">N</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-slate-400 dark:text-slate-600">S</div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 font-bold text-slate-400 dark:text-slate-600">E</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 font-bold text-slate-400 dark:text-slate-600">W</div>
                
                {/* Tick marks */}
                {[...Array(12)].map((_, i) => (
                  <div 
                    key={i}
                    className="absolute top-0 left-1/2 w-1 h-3 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 origin-[50%_144px]"
                    style={{ transform: `rotate(${i * 30}deg)` }}
                  />
                ))}
              </div>

              {/* Qibla Pointer */}
              {qiblaBearing !== null && (
                <div 
                  className="absolute inset-0 transition-transform duration-200 ease-out z-10"
                  style={{ transform: `rotate(${pointerRotation}deg)` }}
                >
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[40px] border-b-emerald-600"></div>
                    <div className="w-2 h-32 bg-emerald-600 rounded-b-full"></div>
                  </div>
                </div>
              )}

              {/* Center Dot */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-emerald-800 dark:bg-emerald-900 rounded-full z-20 shadow-md border-4 border-white dark:border-slate-800"></div>
            </div>

            {/* Info Cards */}
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">আপনার দিক</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                  {heading !== null ? `${convertToBanglaNumber(heading)}°` : '--'}
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 text-center transition-colors">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">কিবলার দিক</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  {qiblaBearing !== null ? `${convertToBanglaNumber(qiblaBearing)}°` : '--'}
                </p>
              </div>
            </div>

            {heading !== null && qiblaBearing !== null && Math.abs(pointerRotation % 360) < 5 && (
              <div className="mt-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 px-6 py-3 rounded-full font-medium text-sm animate-pulse">
                আপনি কিবলার দিকে আছেন
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
