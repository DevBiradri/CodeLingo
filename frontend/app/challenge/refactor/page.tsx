"use client";
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import TopBar from '../../components/TopBar';
import { generateQuestion, verifyAnswer, GenerateQuestionResponse, VerifyQuestionResponse, RefactorChallenge } from '../../../lib/api';
import SuccessScreen from '../../components/SuccessScreen';
import ErrorModal from '../../components/ErrorModal';

function RefactorChallengeContent() {
  const searchParams = useSearchParams();
  const mainTopic = searchParams.get('topic') || 'General Programming';
  const subtopic = searchParams.get('subtopic') || 'Optimization';
  const tip = searchParams.get('tip') || 'Improve the code structure.';

  const [questionData, setQuestionData] = useState<GenerateQuestionResponse | null>(null);
  const [code, setCode] = useState("");
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
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
      const challenge = data.question.challenges[0] as RefactorChallenge;
      setCode(challenge.initial_code || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load mission.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [mainTopic, subtopic, tip]);

  const handleRunCode = () => {
    setIsTerminalOpen(true);
    setTerminalOutput([
      '> Initiating local test runner...', 
      '> Syntax check: PASSED', 
      '> Running static analysis...', 
      '> [INFO] Ready for submission to AI Judge.'
    ]);
  };

  const handleSubmit = async () => {
    if (!questionData) return;
    setIsSubmitting(true);
    setIsTerminalOpen(true);
    setTerminalOutput(prev => [...prev, '> Submitting to AI Judge...', '> Waiting for evaluation...']);
    
    try {
      const data = await verifyAnswer({
        question_key: questionData.question_key,
        challenge_index: 0,
        answer: code
      });
      setResult(data);
      if (data.correct) {
        setTerminalOutput(prev => [...prev, '> [SUCCESS] Logic optimized. XP awarded.']);
      } else {
        setTerminalOutput(prev => [...prev, `> [ERROR] Evaluation failed: ${data.feedback}`]);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed.";
      setTerminalOutput(prev => [...prev, `> [CRITICAL ERROR] ${msg}`]);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center font-space-grotesk">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_black] text-center animate-pulse">
          <h2 className="text-2xl font-black uppercase mb-4">Allocating Neural Resources...</h2>
          <div className="w-16 h-16 border-4 border-black border-t-[#FFD700] rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  const challenge = questionData?.question.challenges[0] as RefactorChallenge;

  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk overflow-hidden min-h-screen selection:bg-black selection:text-white">
      <TopBar title={<><span>Mission</span> — {subtopic} Protocol</>} />

      <main className="mt-[72px] h-[calc(100vh-72px)] flex flex-col md:flex-row">
        
        {/* Editor Section */}
        <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto bg-[#E5E7EB]">
          
          <header className="mb-8 border-l-8 border-[#FFD700] pl-4">
            <h1 className="font-space-grotesk text-4xl font-black uppercase tracking-tighter text-black">{challenge?.instruction}</h1>
            <p className="font-jetbrains-mono text-black font-bold mt-2 uppercase tracking-widest">{tip}</p>
          </header>
          
          {/* Lore Context Panel */}
          <div className="mb-8 bg-white border-4 border-black p-4 shadow-[6px_6px_0_black]">
            <div className="flex items-center gap-2 mb-2 bg-[#FF00FF] text-white w-max px-2 py-1 border-2 border-black">
              <span className="material-symbols-outlined text-sm font-black">info</span>
              <span className="font-jetbrains-mono text-xs font-black uppercase tracking-widest">Mission Context</span>
            </div>
            <p className="font-jetbrains-mono text-black font-bold">
              "{questionData?.question.topic_context}"
            </p>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 min-h-[400px] bg-white border-4 border-black shadow-[12px_12px_0_black] flex flex-col relative overflow-hidden mb-8">
            
            <div className="flex items-center justify-between px-4 py-3 border-b-4 border-black bg-[#A3E635]">
              <div className="text-sm font-jetbrains-mono font-black text-black uppercase tracking-widest bg-white px-2 py-1 border-2 border-black">
                refactor_logic.py
              </div>
            </div>
            
            <div className="flex-1 relative overflow-hidden bg-[#F3F4F6]">
              <Editor
                height="100%"
                defaultLanguage="python"
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="neobrutalism"
                beforeMount={(monaco) => {
                  monaco.editor.defineTheme('neobrutalism', {
                    base: 'vs',
                    inherit: true,
                    rules: [
                      { token: 'keyword', foreground: 'FF00FF', fontStyle: 'bold' },
                      { token: 'comment', foreground: '6B7280', fontStyle: 'italic' },
                      { token: 'string', foreground: '2563EB', fontStyle: 'bold' },
                      { token: 'number', foreground: '059669', fontStyle: 'bold' },
                      { token: 'identifier', foreground: '000000', fontStyle: 'bold' },
                    ],
                    colors: {
                      'editor.background': '#F3F4F6',
                      'editor.foreground': '#000000',
                      'editorCursor.foreground': '#FF00FF',
                      'editor.lineHighlightBackground': '#E5E7EB',
                      'editorLineNumber.foreground': '#000000',
                      'editorSelection.background': '#00FFFF40',
                    }
                  });
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 16,
                  fontFamily: '"JetBrains Mono", monospace',
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "solid",
                  lineNumbersMinChars: 3,
                }}
              />
            </div>
            
            {/* Terminal Panel */}
            {isTerminalOpen && (
              <div className="h-48 border-t-4 border-black bg-black flex flex-col z-10">
                <div className="flex items-center justify-between px-4 py-2 border-b-4 border-white bg-black text-white">
                  <span className="font-jetbrains-mono text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">terminal</span>
                    Terminal Output
                  </span>
                  <button onClick={() => setIsTerminalOpen(false)} className="hover:text-[#FF00FF] transition-colors">
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
                <div className="p-4 font-jetbrains-mono text-sm text-white overflow-y-auto space-y-2">
                  {terminalOutput.map((line, idx) => (
                    <div key={idx} className={line.includes('SUCCESS') ? 'text-[#A3E635] font-black' : line.includes('ERROR') ? 'text-[#FF3B30] font-black' : 'text-white'}>
                      {line}
                    </div>
                  ))}
                  {isSubmitting && <div className="animate-pulse text-[#FF00FF] mt-2 font-black">_</div>}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-6">
            <button 
              onClick={handleRunCode} 
              className="bg-white border-4 border-black text-black px-8 py-4 font-space-grotesk text-xl font-black uppercase shadow-[6px_6px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[10px_10px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0_black] transition-all flex items-center gap-3"
            >
              Test Run
              <span className="material-symbols-outlined text-2xl">play_arrow</span>
            </button>
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-[#FF00FF] border-4 border-black text-white px-8 py-4 font-space-grotesk text-xl font-black uppercase shadow-[6px_6px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[10px_10px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0_black] transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? 'Evaluating...' : 'Submit to AI'}
              <span className="material-symbols-outlined text-2xl">send</span>
            </button>
          </div>
        </div>

        {/* Right Evaluation Panel */}
        <aside className="w-full md:w-96 bg-white border-t-4 md:border-t-0 md:border-l-4 border-black p-6 flex flex-col gap-8 overflow-y-auto z-10 relative">
          
          {result && (
            <div className={`${result.correct ? 'bg-[#A3E635]' : 'bg-[#FF3B30]'} border-4 border-black shadow-[6px_6px_0_black] p-6 flex flex-col items-center text-center mt-4`}>
              <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center mb-4 shadow-[4px_4px_0_black]">
                <span className={`material-symbols-outlined text-black text-5xl font-black ${result.correct ? '' : 'text-[#FF3B30]'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                  {result.correct ? 'check_circle' : 'error'}
                </span>
              </div>
              <div className="text-5xl font-space-grotesk font-black text-black mb-2 tracking-tighter">
                {result.correct ? `+${result.xp_earned}` : `-${result.hp_consumed}`}<span className="text-xl"> {result.correct ? 'XP' : 'HP'}</span>
              </div>
              <div className="px-4 py-1 bg-black text-white font-jetbrains-mono font-black text-sm uppercase tracking-widest mb-4 border-2 border-black">
                {result.correct ? 'PASSED' : 'FAILED'}
              </div>
              <p className="text-sm text-black font-jetbrains-mono font-bold leading-relaxed">
                {result.feedback}
              </p>
            </div>
          )}
          
          <div>
            <h2 className="font-space-grotesk text-2xl font-black text-black mb-6 flex items-center gap-2 uppercase tracking-tighter bg-[#FFD700] border-4 border-black px-4 py-2 shadow-[4px_4px_0_black]">
              <span className="material-symbols-outlined text-black">analytics</span>
              AI Metrics
            </h2>
            <div className="space-y-6">
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_black]">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-jetbrains-mono font-black text-black uppercase tracking-widest">Efficiency</span>
                  <span className="text-lg font-black text-black">{result?.score || '?'}%</span>
                </div>
                <div className="w-full h-4 bg-[#F3F4F6] border-2 border-black overflow-hidden">
                  <div className="h-full bg-[#00FFFF] border-r-2 border-black" style={{ width: result?.score ? `${result.score}%` : '0%' }}></div>
                </div>
              </div>

              {result?.rubric_breakdown && (
                <div className="space-y-4">
                  {result.rubric_breakdown.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm font-jetbrains-mono font-bold uppercase">
                      <span className={`material-symbols-outlined text-lg ${item.met ? 'text-[#A3E635]' : 'text-[#FF3B30]'}`}>
                        {item.met ? 'check_circle' : 'cancel'}
                      </span>
                      <span>{item.criterion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-auto pt-8">
            <Link href="/map" className="w-full py-4 bg-white border-4 border-black text-black font-space-grotesk font-black text-xl uppercase shadow-[6px_6px_0_black] flex items-center justify-center gap-2 hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[8px_8px_0_black] active:translate-y-[2px] active:shadow-[0px_0px_0_black] transition-all group">
              Return to Map
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">keyboard_double_arrow_right</span>
            </Link>
          </div>
          
        </aside>

      </main>

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
          accuracy={result.score || 100}
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

export default function RefactorChallenge() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RefactorChallengeContent />
    </Suspense>
  );
}
