"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ErrorModal from '../../components/ErrorModal';
import SuccessScreen from '../../components/SuccessScreen';
import TopBar from '../../components/TopBar';
import { generateQuestion, verifyAnswer, GenerateQuestionResponse, VerifyQuestionResponse, PredictOutputChallenge } from '../../../lib/api';

function PredictChallengeContent() {
  const searchParams = useSearchParams();
  const mainTopic = searchParams.get('topic') || 'General Programming';
  const subtopic = searchParams.get('subtopic') || 'Logic';
  const tip = searchParams.get('tip') || 'Analyze the code flow carefully.';

  const [questionData, setQuestionData] = useState<GenerateQuestionResponse | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<VerifyQuestionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load mission.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [mainTopic, subtopic, tip]);

  const handleSubmit = async () => {
    if (!selectedOption || !questionData) return;
    setIsSubmitting(true);
    try {
      const data = await verifyAnswer({
        question_key: questionData.question_key,
        challenge_index: 0,
        answer: selectedOption
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTryAgain = () => {
    setResult(null);
    setSelectedOption(null);
  };

  const handleCloseError = () => {
    setResult(null);
  };

  if (isLoading) {
    return (
      <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center font-space-grotesk">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_black] text-center animate-pulse">
          <h2 className="text-2xl font-black uppercase mb-4">Infiltrating Database...</h2>
          <div className="w-16 h-16 border-4 border-black border-t-[#FF00FF] rounded-full animate-spin mx-auto"></div>
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

  const challenge = questionData?.question?.challenges?.[0] as PredictOutputChallenge;
  
  if (!challenge || challenge.type !== 'predict_output') {
     return (
      <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center font-space-grotesk">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_black] text-center max-w-md">
          <h2 className="text-2xl font-black uppercase mb-4 text-red-500">Invalid Mission Protocol</h2>
          <p className="font-jetbrains-mono mb-6">The database returned an incompatible challenge type for this node.</p>
          <button onClick={fetchQuestion} className="bg-[#FF00FF] text-white border-2 border-black px-6 py-2 font-bold uppercase hover:bg-black transition-colors">
            Generate Alternative
          </button>
        </div>
      </div>
     );
  }

  const options = challenge.options || [];

  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk overflow-hidden min-h-screen selection:bg-black selection:text-white">
      <TopBar title={<><span>Mission</span> — {subtopic} Protocol</>} />

      <main className="pt-[72px] px-6 md:px-12 pb-32 h-screen overflow-y-auto flex flex-col items-center">
        <div className="max-w-3xl w-full mt-12">
          
          <div className="mb-10 bg-black text-[#A3E635] p-6 border-4 border-[#A3E635] shadow-[8px_8px_0_black] font-jetbrains-mono relative">
            <div className="absolute -top-4 left-6 bg-[#A3E635] text-black px-3 py-1 font-black text-xs uppercase tracking-tighter border-2 border-black">
              Mission Briefing: {mainTopic}
            </div>
            <p className="leading-relaxed">{questionData?.question?.topic_context}</p>
          </div>

          <div className="mb-8 border-l-8 border-[#FF00FF] pl-4">
            <h2 className="font-space-grotesk text-3xl font-black uppercase text-black">{challenge.instruction}</h2>
            <p className="font-jetbrains-mono text-black font-bold uppercase tracking-widest mt-2">{tip}</p>
          </div>
          
          {challenge.code_snippet && (
            <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_black] relative group mb-12">
              <div className="absolute top-0 right-0 bg-[#00FFFF] border-l-4 border-b-4 border-black px-4 py-1 font-jetbrains-mono text-sm font-black text-black">
                source_code.py
              </div>
              <pre className="font-jetbrains-mono text-lg font-bold leading-relaxed text-black mt-4 whitespace-pre-wrap">
                {challenge.code_snippet}
              </pre>
            </div>
          )}

          <div className="mb-8">
            <h2 className="font-space-grotesk text-4xl text-black font-black uppercase tracking-tighter bg-[#FFD700] inline-block px-4 py-2 border-4 border-black shadow-[4px_4px_0_black]">
              Predict the output:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {options.map((option) => {
              const isSelected = selectedOption === option;
              let classes = "relative flex items-center justify-center min-h-24 p-4 border-4 border-black transition-all cursor-pointer ";
              
              if (isSelected) {
                classes += "bg-[#A3E635] shadow-[8px_8px_0_black] -translate-y-2 translate-x-[-2px]";
              } else {
                classes += "bg-white shadow-[4px_4px_0_black] hover:-translate-y-1 hover:translate-x-[-1px] hover:shadow-[6px_6px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0_black]";
              }

              return (
                <button 
                  key={option}
                  onClick={() => !result && setSelectedOption(option)}
                  className={classes}
                  disabled={!!result || isSubmitting}
                >
                  <span className={`font-jetbrains-mono text-xl md:text-2xl font-black text-black`}>
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

          {!result && (
            <div className="flex flex-col items-center">
              <button 
                onClick={handleSubmit}
                disabled={!selectedOption || isSubmitting}
                className={`w-full py-6 font-space-grotesk text-2xl font-black uppercase tracking-widest border-4 border-black flex items-center justify-center gap-4 transition-all ${
                  selectedOption && !isSubmitting
                    ? 'bg-[#FF00FF] text-white shadow-[8px_8px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[12px_12px_0_black] active:translate-y-[4px] active:translate-x-[4px] active:shadow-[0px_0px_0_black]' 
                    : 'bg-[#D1D5DB] text-gray-500 shadow-[none] cursor-not-allowed border-dashed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-3xl animate-spin">sync</span>
                    Verifying...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-3xl">send</span>
                    Submit Answer
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </main>

      {result && !result.correct && (
        <ErrorModal 
          isOpen={true} 
          onTryAgain={handleTryAgain} 
          onClose={handleCloseError}
          errorMessage={result.feedback || "System failure. Incorrect output detected."}
          correctAnswer={result.correct_answer as string}
          hpConsumed={result.hp_consumed}
        />
      )}

      {result && result.correct && (
        <SuccessScreen 
          onNextChallenge={() => {
            if ((result.subtopic_missions_completed || 0) >= 3) {
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
          missionsTotal={3}
        />
      )}
    </div>
  );
}

export default function PredictChallenge() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PredictChallengeContent />
    </Suspense>
  );
}
