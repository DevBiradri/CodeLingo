"use client";
import React, { useState } from 'react';
import ErrorModal from '../../components/ErrorModal';
import SuccessScreen from '../../components/SuccessScreen';
import TopBar from '../../components/TopBar';

export default function PredictChallenge() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const options = ['5', '10', '15', '50'];

  const handleSubmit = () => {
    if (!selectedOption) return;
    setIsSubmitted(true);
    if (selectedOption === '15') {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleTryAgain = () => {
    setIsSubmitted(false);
    setSelectedOption(null);
  };

  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk overflow-hidden min-h-screen selection:bg-black selection:text-white">
      <TopBar title={<><span>Lesson</span> — Predict Output</>} />

      {/* Main Content Canvas */}
      <main className="pt-[72px] px-6 md:px-12 pb-32 h-screen overflow-y-auto flex flex-col items-center">
        <div className="max-w-3xl w-full mt-12">
          
          {/* Instructions */}
          <div className="mb-8 border-l-8 border-[#FF00FF] pl-4">
            <h2 className="font-space-grotesk text-3xl font-black uppercase text-black">Analyze the Code</h2>
            <p className="font-jetbrains-mono text-black font-bold uppercase tracking-widest mt-2">Read the code and predict what it will print.</p>
          </div>
          
          {/* Code Display Area */}
          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_black] relative group mb-12">
            <div className="absolute top-0 right-0 bg-[#00FFFF] border-l-4 border-b-4 border-black px-4 py-1 font-jetbrains-mono text-sm font-black text-black">
              python_script.py
            </div>
            <pre className="font-jetbrains-mono text-lg font-bold leading-relaxed text-black mt-4">
              <span className="text-[#FF00FF]">x</span> = 5{'\n'}
              <span className="text-[#FF00FF]">y</span> = 10{'\n'}
              <span className="text-blue-600">if</span> x &lt; y:{'\n'}
              {'    '}<span className="text-blue-600">print</span>(x + y){'\n'}
              <span className="text-blue-600">else</span>:{'\n'}
              {'    '}<span className="text-blue-600">print</span>(y - x)
            </pre>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="font-space-grotesk text-4xl text-black font-black uppercase tracking-tighter bg-[#FFD700] inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0_black]">
              What will be the output?
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            {options.map((option) => {
              const isSelected = selectedOption === option;
              
              // Base classes
              let classes = "flex items-center justify-center h-24 border-4 border-black transition-all cursor-pointer ";
              
              if (isSelected) {
                // Selected state
                classes += "bg-[#A3E635] shadow-[8px_8px_0_black] -translate-y-2 translate-x-[-2px]";
              } else {
                // Unselected state
                classes += "bg-white shadow-[4px_4px_0_black] hover:-translate-y-1 hover:translate-x-[-1px] hover:shadow-[6px_6px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0_black]";
              }

              return (
                <button 
                  key={option}
                  onClick={() => !isSubmitted && setSelectedOption(option)}
                  className={classes}
                  disabled={isSubmitted}
                >
                  <span className={`font-space-grotesk text-4xl font-black ${isSelected ? 'text-black' : 'text-black'}`}>
                    {option}
                  </span>
                  
                  {isSelected && (
                    <div className="absolute -top-4 -right-4 bg-white border-4 border-black p-2 shadow-[4px_4px_0_black] rotate-12">
                      <span className="material-symbols-outlined text-3xl text-black font-black">check</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Submit Button */}
          {!isSubmitted && (
            <div className="flex flex-col items-center">
              <button 
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={`w-full py-6 font-space-grotesk text-2xl font-black uppercase tracking-widest border-4 border-black flex items-center justify-center gap-4 transition-all ${
                  selectedOption 
                    ? 'bg-[#FF00FF] text-white shadow-[8px_8px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[12px_12px_0_black] active:translate-y-[4px] active:translate-x-[4px] active:shadow-[0px_0px_0_black]' 
                    : 'bg-[#D1D5DB] text-gray-500 shadow-[none] cursor-not-allowed border-dashed'
                }`}
              >
                <span className="material-symbols-outlined text-3xl">send</span>
                Submit Answer
              </button>
            </div>
          )}

        </div>
      </main>

      <ErrorModal 
        isOpen={isSubmitted && !isCorrect} 
        onTryAgain={handleTryAgain} 
        errorMessage="Incorrect output. Analyze the conditional logic."
        correctCodeHTML={
          <>
            <span className="text-[#FF00FF]">x</span> + <span className="text-[#FF00FF]">y</span> evaluates to <span className="font-black">15</span>
          </>
        }
      />

      {isSubmitted && isCorrect && (
        <SuccessScreen 
          onNextChallenge={() => window.location.href = '/map'} 
          xpEarned={35}
          accuracy={100}
        />
      )}
    </div>
  );
}
