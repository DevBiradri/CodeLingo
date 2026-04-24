"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import TopBar from '../../components/TopBar';
import ErrorModal from '../../components/ErrorModal';
import SuccessScreen from '../../components/SuccessScreen';

const initialOptions = ['range(5)', 'i', 'hello', 'count'];

export default function BuildChallenge() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [slots, setSlots] = useState<{ slot1: string | null; slot2: string | null }>({ slot1: null, slot2: null });

  const handleDragStart = (e: React.DragEvent, value: string) => {
    e.dataTransfer.setData('text/plain', value);
  };

  const handleDrop = (e: React.DragEvent, slotKey: 'slot1' | 'slot2') => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data) {
      setSlots((prev) => ({ ...prev, [slotKey]: data }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSlotClick = (slotKey: 'slot1' | 'slot2') => {
    setSlots((prev) => ({ ...prev, [slotKey]: null }));
  };

  const handleCheckSolution = () => {
    if (slots.slot1 === 'range(5)' && slots.slot2 === 'i') {
      setIsSuccess(true);
      setIsError(false);
    } else {
      setIsError(true);
      setIsSuccess(false);
    }
  };

  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk overflow-x-hidden min-h-screen selection:bg-black selection:text-white">
      <TopBar title={<><span>Lesson</span> — Build Code</>} />

      {/* Main Content Area */}
      <main className="pt-[72px] pb-32 px-6 md:px-12 min-h-screen flex flex-col items-center">
        <div className="max-w-4xl mx-auto w-full py-12 flex-1 flex flex-col gap-8">
          
          {/* Instructions */}
          <div className="mb-4 border-l-8 border-[#A3E635] pl-4">
            <h2 className="font-space-grotesk text-3xl font-black uppercase text-black">Task: Python Loop</h2>
            <p className="font-jetbrains-mono text-black font-bold mt-2">
              Drag the correct blocks into the empty slots to complete the loop. Iterate five times and output the current index.
            </p>
          </div>
          
          {/* Code Editor Area */}
          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_black] relative mb-12">
            <div className="absolute top-0 right-0 bg-[#FFD700] border-l-4 border-b-4 border-black px-4 py-1 font-jetbrains-mono text-sm font-black text-black uppercase">
              main.py
            </div>
            
            <div className="pt-6 font-jetbrains-mono text-xl md:text-3xl leading-relaxed font-bold">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="text-[#FF00FF]">for</span>
                <span className="text-black">i</span>
                <span className="text-[#FF00FF]">in</span>
                
                {/* Drop Zone 1 */}
                <div 
                  onDrop={(e) => handleDrop(e, 'slot1')}
                  onDragOver={handleDragOver}
                  onClick={() => handleSlotClick('slot1')}
                  className={`min-w-[140px] h-16 border-4 flex items-center justify-center transition-all ${
                    slots.slot1 
                    ? 'border-black bg-[#00FFFF] shadow-[4px_4px_0_black] cursor-pointer' 
                    : 'border-dashed border-black bg-[#F3F4F6]'
                  }`}
                >
                  {slots.slot1 ? (
                    <span className="text-black text-xl font-black">{slots.slot1}</span>
                  ) : (
                    <span className="text-gray-400 text-sm font-space-grotesk font-black uppercase">Slot 1</span>
                  )}
                </div>
                <span className="text-black">:</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pl-8 md:pl-16">
                <span className="text-blue-600">print</span>
                <span className="text-black">(</span>
                
                {/* Drop Zone 2 */}
                <div 
                  onDrop={(e) => handleDrop(e, 'slot2')}
                  onDragOver={handleDragOver}
                  onClick={() => handleSlotClick('slot2')}
                  className={`min-w-[100px] h-16 border-4 flex items-center justify-center transition-all ${
                    slots.slot2 
                    ? 'border-black bg-[#FF90E8] shadow-[4px_4px_0_black] cursor-pointer' 
                    : 'border-dashed border-black bg-[#F3F4F6]'
                  }`}
                >
                  {slots.slot2 ? (
                    <span className="text-black text-xl font-black">{slots.slot2}</span>
                  ) : (
                    <span className="text-gray-400 text-sm font-space-grotesk font-black uppercase">Slot 2</span>
                  )}
                </div>
                <span className="text-black">)</span>
              </div>
            </div>
          </div>
          
          {/* Options Panel */}
          <div className="space-y-4">
            <div className="inline-block bg-black text-white font-jetbrains-mono font-black uppercase tracking-widest px-4 py-2 border-4 border-black">
              Available Blocks
            </div>
            <div className="flex flex-wrap gap-6 pt-4">
              {initialOptions.map((opt) => (
                <button 
                  key={opt}
                  draggable
                  onDragStart={(e) => handleDragStart(e, opt)}
                  className="px-8 py-4 bg-white border-4 border-black shadow-[6px_6px_0_black] text-black font-jetbrains-mono font-black text-xl hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[8px_8px_0_black] hover:bg-[#A3E635] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0_black] transition-all cursor-grab active:cursor-grabbing"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {!isSuccess && (
        <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-white border-t-4 border-black z-50">
          <div className="px-6 md:px-12 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
              <Link href="/map" className="text-black hover:bg-black hover:text-white border-4 border-transparent hover:border-black px-4 py-2 font-space-grotesk font-black uppercase transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">arrow_back</span>
                Back to Map
              </Link>
              <button className="text-black hover:bg-[#FFD700] border-4 border-black shadow-[4px_4px_0_black] px-4 py-2 font-space-grotesk font-black uppercase transition-all flex items-center gap-2 hover:-translate-y-1 active:translate-y-[2px] active:shadow-[0_0_0_black]">
                <span className="material-symbols-outlined">lightbulb</span>
                Hint
              </button>
            </div>
            <button 
              onClick={handleCheckSolution}
              className="w-full md:w-auto px-12 py-4 bg-[#A3E635] text-black border-4 border-black shadow-[8px_8px_0_black] hover:-translate-y-2 hover:shadow-[12px_12px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black] transition-all font-space-grotesk text-xl font-black uppercase flex items-center justify-center gap-3">
              Check Solution
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            </button>
          </div>
        </div>
      )}

      <ErrorModal 
        isOpen={isError} 
        onTryAgain={() => setIsError(false)} 
        errorMessage="Syntax error or incorrect logic detected in your loop setup."
        correctCodeHTML={
          <>
            <span className="text-[#FF00FF]">for</span> i <span className="text-[#FF00FF]">in</span> <span className="font-black">range(5)</span>:
          </>
        }
      />

      {isSuccess && (
        <SuccessScreen 
          onNextChallenge={() => window.location.href = '/map'} 
          xpEarned={45}
          accuracy={100}
        />
      )}
    </div>
  );
}
