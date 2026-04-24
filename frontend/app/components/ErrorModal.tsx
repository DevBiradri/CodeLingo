import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  onTryAgain: () => void;
  errorMessage?: string;
  correctCodeHTML?: React.ReactNode;
}

export default function ErrorModal({ isOpen, onTryAgain, errorMessage, correctCodeHTML }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        
        {/* BYTE Mascot Coaching State */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-20">
          <div className="relative">
            <div className="w-24 h-24 bg-white border-4 border-black rounded-full overflow-hidden shadow-[4px_4px_0_black]">
              <img 
                alt="BYTE Mascot Alarmed State" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuChGR4ScgDear2YEnD7IylrBaCNX1gGORF9IuRJAYEAMEKdShRlUjjqolh_lOPA2Quug3PNYhoPycCOsnVTfEQv2KdELcagrengfFagUSWltgYrc3yr6V1iTKnIdpbtISOsB2SaNw8CMu4pL3tSTdCePdnals7uketxSLAj-1J31iBea9jGFLZO9SLFNtgfFa7gJgmm5Ees3xRmjhN_3pRhpr82D5QisyyxlYFbET0PtwL0WQVgJHjFfYu1Zihv5QGXRT9HlQwB0Kyo"
              />
            </div>
          </div>
        </div>

        {/* Modal Card */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0_black] mt-12 relative z-10 flex flex-col">
          
          {/* Red Alert Header */}
          <div className="bg-[#EF4444] border-b-4 border-black p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-black text-3xl font-black">close</span>
            <h2 className="font-space-grotesk tracking-tighter uppercase text-2xl font-black text-black">Syntax Error</h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Feedback Message */}
            <p className="font-jetbrains-mono font-bold text-black text-base">
              {errorMessage || (
                <>Careful! You forgot the <span className="bg-[#FFD700] border-2 border-black px-1">colon (:)</span> at the end of the loop declaration.</>
              )}
            </p>

            {/* Corrective Code Block */}
            <div className="space-y-2">
              <span className="font-jetbrains-mono font-black text-xs text-black uppercase bg-[#A3E635] px-2 py-1 border-2 border-black shadow-[2px_2px_0_black]">Required Format:</span>
              <div className="bg-black text-white p-4 border-4 border-black font-jetbrains-mono text-sm relative mt-2 shadow-[4px_4px_0_#FF00FF]">
                {correctCodeHTML || (
                  <>
                    <span className="text-[#FF00FF]">for</span> i <span className="text-[#FF00FF]">in</span> range(5):
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t-4 border-black mt-6">
              <button 
                onClick={onTryAgain}
                className="flex-1 py-4 bg-[#FFD700] text-black border-4 border-black font-space-grotesk text-xl font-black uppercase transition-all hover:-translate-y-2 hover:shadow-[6px_6px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0px_black]">
                Retry Protocol
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
