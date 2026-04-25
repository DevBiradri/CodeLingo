"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateLanguage } from '../../lib/api';
import { useAuth } from '../../lib/auth-context';

const languages = [
  { id: 'python', name: 'Python', icon: 'data_object', color: 'bg-[#FFD700]' },
  { id: 'javascript', name: 'JavaScript', icon: 'javascript', color: 'bg-[#FFD700]' },
  { id: 'java', name: 'Java', icon: 'coffee', color: 'bg-[#FFD700]' },
  { id: 'cpp', name: 'C++', icon: 'code', color: 'bg-[#FFD700]' },
  { id: 'go', name: 'Go', icon: 'speed', color: 'bg-[#FFD700]' },
  { id: 'rust', name: 'Rust', icon: 'settings', color: 'bg-[#FFD700]' },
];

export default function ChooseLanguagePage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async () => {
    if (!selectedLang) return;
    setIsSubmitting(true);
    try {
      const updatedUser = await updateLanguage(selectedLang);
      setUser(updatedUser);
      router.push('/map');
    } catch (err) {
      console.error("Failed to update language", err);
      // Fallback to map anyway for now
      router.push('/map');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#E5E7EB] text-black min-h-screen font-space-grotesk overflow-x-hidden selection:bg-black selection:text-white flex flex-col items-center justify-center p-6 relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '32px 32px' }}></div>

      <main className="w-full max-w-4xl relative z-10 flex flex-col items-center">
        
        {/* Header Branding */}
        <header className="w-full flex flex-col items-center mb-12 text-center">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0_black] mb-6">
            <h1 className="font-space-grotesk text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4">
              Select Language
            </h1>
            <p className="font-jetbrains-mono font-bold text-black uppercase tracking-widest bg-[#00FFFF] border-2 border-black inline-block px-4 py-2 shadow-[4px_4px_0_black]">
              Choose your primary programming language
            </p>
          </div>
        </header>

        {/* Grid of Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mb-12">
          {languages.map((lang) => (
            <div 
              key={lang.id} 
              onClick={() => setSelectedLang(lang.id)}
              className="cursor-pointer group relative"
            >
              <div className={`bg-white border-4 border-black p-6 flex flex-col items-center gap-4 transition-all shadow-[6px_6px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[8px_8px_0_black] ${selectedLang === lang.id ? 'bg-[#FF00FF] !text-white shadow-[12px_12px_0_black] -translate-y-2' : ''}`}>
                <div className={`w-16 h-16 border-4 border-black flex items-center justify-center shadow-[4px_4px_0_black] bg-white group-hover:bg-[#A3E635] ${selectedLang === lang.id ? 'bg-[#FFD700]' : ''}`}>
                  <span className={`material-symbols-outlined text-4xl text-black`}>
                    {lang.icon}
                  </span>
                </div>
                <h3 className={`font-space-grotesk text-2xl font-black uppercase tracking-tighter ${selectedLang === lang.id ? 'text-white' : 'text-black'}`}>
                  {lang.name}
                </h3>
              </div>
              
              {selectedLang === lang.id && (
                <div className="absolute top-4 right-4 bg-white border-4 border-black shadow-[4px_4px_0_black] rotate-12 z-20">
                  <span className="material-symbols-outlined text-black font-black p-1">check</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="w-full max-w-md flex flex-col gap-4">
          <button 
            type="button" 
            onClick={() => setSelectedLang('any')}
            className={`w-full py-4 bg-white border-4 border-black text-black font-space-grotesk text-xl font-black uppercase shadow-[6px_6px_0_black] hover:-translate-y-1 hover:translate-x-[-1px] hover:shadow-[8px_8px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0_0_0_black] transition-all ${selectedLang === 'any' ? 'bg-[#00FFFF]' : ''}`}
          >
            Select "Any Language"
          </button>
          <button 
            onClick={handleStart}
            disabled={!selectedLang || isSubmitting}
            className={`w-full flex items-center justify-center gap-4 py-6 border-4 border-black font-space-grotesk text-2xl font-black uppercase transition-all ${!selectedLang || isSubmitting ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#A3E635] text-black shadow-[8px_8px_0_black] hover:-translate-y-2 hover:shadow-[12px_12px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black]'}`}
          >
            {isSubmitting ? 'Initializing...' : 'Start Mission'}
            <span className="material-symbols-outlined text-3xl">keyboard_double_arrow_right</span>
          </button>
        </div>

      </main>
    </div>
  );
}
