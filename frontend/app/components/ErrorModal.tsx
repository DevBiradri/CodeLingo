import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  onTryAgain: () => void;
  onClose?: () => void;
  errorMessage?: string;
  correctAnswer?: string;
  hpConsumed?: number;
}

export default function ErrorModal({ isOpen, onTryAgain, onClose, errorMessage, correctAnswer, hpConsumed = 0 }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        
        {/* HP Deduction Badge */}
        {hpConsumed > 0 && (
          <div className="absolute -top-12 right-0 bg-black text-[#EF4444] border-4 border-[#EF4444] px-4 py-2 font-black text-2xl animate-bounce z-30 shadow-[4px_4px_0_black]">
            -{hpConsumed} HP
          </div>
        )}
        
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
          <div className="bg-[#EF4444] border-b-4 border-black p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-black text-3xl font-black">warning</span>
              <h2 className="font-space-grotesk tracking-tighter uppercase text-2xl font-black text-black">Protocol Error</h2>
            </div>
            {onClose && (
              <button 
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center bg-white border-4 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0_black] active:translate-x-1 active:translate-y-1 active:shadow-[0_0_0_black]"
              >
                <span className="material-symbols-outlined font-black">close</span>
              </button>
            )}
          </div>
          
          <div className="p-6 space-y-6">
            {/* Feedback Message */}
            <p className="font-jetbrains-mono font-bold text-black text-base leading-relaxed">
              {errorMessage || "System failure. Unexpected output detected."}
            </p>

            {/* Corrective Code Block */}
            {correctAnswer && (
              <div className="space-y-2">
                <span className="font-jetbrains-mono font-black text-xs text-black uppercase bg-[#A3E635] px-2 py-1 border-2 border-black shadow-[2px_2px_0_black]">Expected Output:</span>
                <div className="bg-black text-[#00FFFF] p-4 border-4 border-black font-jetbrains-mono text-lg font-black relative mt-2 shadow-[4px_4px_0_#FF00FF] break-all">
                  {correctAnswer}
                </div>
              </div>
            )}

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
