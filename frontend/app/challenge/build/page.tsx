"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TopBar from '../../components/TopBar';
import ErrorModal from '../../components/ErrorModal';
import SuccessScreen from '../../components/SuccessScreen';
import { generateQuestion, verifyAnswer, GenerateQuestionResponse, VerifyQuestionResponse, DragAndDropChallenge } from '../../../lib/api';

function BuildChallengeContent() {
  const searchParams = useSearchParams();
  const mainTopic = searchParams.get('topic') || 'General Programming';
  const subtopic = searchParams.get('subtopic') || 'Architecture';
  const tip = searchParams.get('tip') || 'Drag the components to build the logic.';

  const [questionData, setQuestionData] = useState<GenerateQuestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<VerifyQuestionResponse | null>(null);
  const [slots, setSlots] = useState<Record<string, string | null>>({});

  const fetchQuestion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateQuestion({ 
        main_topic: mainTopic,
        subtopic: subtopic,
        educational_tip: tip
      });
      setQuestionData(data);
      
      // Initialize slots based on blanks in code_with_blanks
      if (data.question.challenges && data.question.challenges[0] && data.question.challenges[0].type === 'drag_and_drop') {
        const challenge = data.question.challenges[0] as DragAndDropChallenge;
        const blanks = challenge.code_with_blanks?.match(/__\w+__/g) || [];
        const newSlots: Record<string, string | null> = {};
        blanks.forEach((blank) => {
          newSlots[blank] = null;
        });
        setSlots(newSlots);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load mission.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [mainTopic, subtopic, tip]);

  const handleDragStart = (e: React.DragEvent, value: string) => {
    e.dataTransfer.setData('text/plain', value);
  };

  const handleDrop = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data) {
      setSlots((prev) => ({ ...prev, [slotKey]: data }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSlotClick = (slotKey: string) => {
    setSlots((prev) => ({ ...prev, [slotKey]: null }));
  };

  const handleCheckSolution = async () => {
    if (!questionData) return;
    
    // Check if all slots are filled
    const allFilled = Object.values(slots).every(val => val !== null);
    if (!allFilled) {
      setError("Please fill all slots before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await verifyAnswer({
        question_key: questionData.question_key,
        challenge_index: 0,
        answer: slots as Record<string, string>
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseError = () => {
    setResult(null);
  };

  if (isLoading) {
    return (
      <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center font-space-grotesk">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_black] text-center animate-pulse">
          <h2 className="text-2xl font-black uppercase mb-4">Constructing Environment...</h2>
          <div className="w-16 h-16 border-4 border-black border-t-[#A3E635] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error && !questionData) {
    return (
      <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center font-space-grotesk">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_black] text-center max-w-md">
          <h2 className="text-2xl font-black uppercase mb-4 text-red-500">System Error</h2>
          <p className="font-jetbrains-mono mb-6">{error}</p>
          <button onClick={fetchQuestion} className="bg-[#FF00FF] text-white border-2 border-black px-6 py-2 font-bold uppercase hover:bg-black transition-colors">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const challenge = questionData?.question.challenges[0] as DragAndDropChallenge;

  // Function to render code with clickable/droppable slots
  const renderCodeWithSlots = () => {
    if (!challenge || challenge.type !== 'drag_and_drop' || !challenge.code_with_blanks) {
       return <div className="text-red-500 font-bold uppercase p-4 border-2 border-red-500 bg-red-50">Invalid Challenge Data Received</div>;
    }
    const parts = challenge.code_with_blanks.split(/(__\w+__)/g);
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-4 leading-relaxed">
        {parts.map((part, index) => {
          if (part.startsWith('__') && part.endsWith('__')) {
            return (
              <div 
                key={index}
                onDrop={(e) => handleDrop(e, part)}
                onDragOver={handleDragOver}
                onClick={() => handleSlotClick(part)}
                className={`min-w-[120px] h-12 border-4 flex items-center justify-center transition-all px-4 ${
                  slots[part] 
                  ? 'border-black bg-[#00FFFF] shadow-[4px_4px_0_black] cursor-pointer' 
                  : 'border-dashed border-black bg-[#F3F4F6]'
                }`}
              >
                {slots[part] ? (
                  <span className="text-black font-black font-jetbrains-mono">{slots[part]}</span>
                ) : (
                  <span className="text-gray-400 text-xs font-space-grotesk font-black uppercase">Slot</span>
                )}
              </div>
            );
          }
          return <span key={index} className="font-jetbrains-mono whitespace-pre">{part}</span>;
        })}
      </div>
    );
  };

  const getFormattedCorrectAnswer = () => {
    if (!result?.correct_answer || typeof result.correct_answer === 'string') return result?.correct_answer as string;
    return Object.entries(result.correct_answer)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk overflow-x-hidden min-h-screen selection:bg-black selection:text-white">
      <TopBar title={<><span>Mission</span> — {subtopic} Protocol</>} />

      <main className="pt-[72px] pb-32 px-6 md:px-12 min-h-screen flex flex-col items-center">
        <div className="max-w-4xl mx-auto w-full py-12 flex-1 flex flex-col gap-8">
          
          {/* Narrative */}
          <div className="mb-4 bg-black text-[#A3E635] p-6 border-4 border-[#A3E635] shadow-[8px_8px_0_black] font-jetbrains-mono relative">
            <div className="absolute -top-4 left-6 bg-[#A3E635] text-black px-3 py-1 font-black text-xs uppercase tracking-tighter border-2 border-black">
              Mission Briefing: {mainTopic}
            </div>
            <p className="leading-relaxed">{questionData?.question.topic_context}</p>
          </div>

          {/* Instructions */}
          <div className="mb-4 border-l-8 border-[#A3E635] pl-4">
            <h2 className="font-space-grotesk text-3xl font-black uppercase text-black">{challenge?.instruction}</h2>
            <p className="font-jetbrains-mono text-black font-bold mt-2">{tip}</p>
          </div>
          
          {/* Code Editor Area */}
          <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_black] relative mb-12">
            <div className="absolute top-0 right-0 bg-[#FFD700] border-l-4 border-b-4 border-black px-4 py-1 font-jetbrains-mono text-sm font-black text-black uppercase">
              workspace.py
            </div>
            <div className="pt-6 text-xl md:text-2xl">
              {renderCodeWithSlots()}
            </div>
          </div>
          
          {/* Options Panel */}
          <div className="space-y-4">
            <div className="inline-block bg-black text-white font-jetbrains-mono font-black uppercase tracking-widest px-4 py-2 border-4 border-black">
              Available Code Blocks
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              {(challenge?.options || []).map((opt) => {
                const isUsed = Object.values(slots).includes(opt);
                return (
                  <button 
                    key={opt}
                    draggable={!isUsed}
                    onDragStart={(e) => handleDragStart(e, opt)}
                    disabled={isUsed}
                    className={`px-6 py-3 border-4 border-black font-jetbrains-mono font-black text-lg transition-all ${
                      isUsed 
                      ? 'bg-gray-200 text-gray-400 border-dashed shadow-none cursor-not-allowed' 
                      : 'bg-white shadow-[4px_4px_0_black] text-black hover:-translate-y-1 hover:shadow-[6px_6px_0_black] hover:bg-[#A3E635] cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {!result?.correct && (
        <div className="fixed bottom-0 right-0 left-0 bg-white border-t-4 border-black z-50">
          <div className="px-6 md:px-12 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
              <Link href="/map" className="text-black hover:bg-black hover:text-white border-4 border-transparent hover:border-black px-4 py-2 font-space-grotesk font-black uppercase transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">arrow_back</span>
                Abort
              </Link>
              <button 
                onClick={fetchQuestion}
                className="text-black hover:bg-[#FFD700] border-4 border-black shadow-[4px_4px_0_black] px-4 py-2 font-space-grotesk font-black uppercase transition-all flex items-center gap-2 hover:-translate-y-1 active:translate-y-[2px] active:shadow-[0_0_0_black]">
                <span className="material-symbols-outlined">refresh</span>
                New Mission
              </button>
            </div>
            <button 
              onClick={handleCheckSolution}
              disabled={isSubmitting}
              className={`w-full md:w-auto px-12 py-4 border-4 border-black font-space-grotesk text-xl font-black uppercase flex items-center justify-center gap-3 transition-all ${
                isSubmitting 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-[#A3E635] text-black shadow-[8px_8px_0_black] hover:-translate-y-2 hover:shadow-[12px_12px_0_black] active:translate-y-[2px] active:shadow-[0_0_0_black]'
              }`}>
              {isSubmitting ? 'Verifying...' : 'Submit Logic'}
              <span className="material-symbols-outlined text-3xl">rocket_launch</span>
            </button>
          </div>
        </div>
      )}

      <ErrorModal 
        isOpen={!!result && !result.correct} 
        onTryAgain={() => setResult(null)} 
        onClose={handleCloseError}
        errorMessage={result?.feedback || "Logic sequence invalid."}
        correctAnswer={getFormattedCorrectAnswer()}
        hpConsumed={result?.hp_consumed}
      />

      {result?.correct && (
        <SuccessScreen 
          onNextChallenge={() => {
            if ((result.subtopic_missions_completed || 0) >= 5) {
              window.location.href = '/map';
            } else {
              window.location.reload();
            }
          }} 
          xpEarned={result.xp_earned}
          accuracy={100}
          currentXp={result.experience_points}
          level={result.level}
          levelName={result.level_name}
          xpForCurrentLevel={result.xp_for_current_level}
          xpForNextLevel={result.xp_for_next_level}
          xpToNextLevel={result.xp_to_next_level}
          missionsCompleted={result.subtopic_missions_completed}
          missionsTotal={5}
        />
      )}
    </div>
  );
}

export default function BuildChallenge() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BuildChallengeContent />
    </Suspense>
  );
}
