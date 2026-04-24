"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Editor from '@monaco-editor/react';
import TopBar from '../../components/TopBar';

export default function RefactorChallenge() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const handleRunCode = () => {
    setIsTerminalOpen(true);
    setTerminalOutput([
      '> Initiating secure connection...', 
      '> Compiling refactor_logic.py...', 
      '> Running test cases...', 
      '> [SUCCESS] All 15 tests passed. Logic is optimized.'
    ]);
  };

  return (
    <div className="bg-[#E5E7EB] text-black font-space-grotesk overflow-hidden min-h-screen selection:bg-black selection:text-white">
      <TopBar title={<><span>Lesson</span> — Refactor Code</>} />

      {/* Main Content Area */}
      <main className="mt-[72px] h-[calc(100vh-72px)] flex flex-col md:flex-row">
        
        {/* Editor Section */}
        <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto bg-[#E5E7EB]">
          
          <header className="mb-8 border-l-8 border-[#FFD700] pl-4">
            <h1 className="font-space-grotesk text-4xl font-black uppercase tracking-tighter text-black">Improve the Code</h1>
            <p className="font-jetbrains-mono text-black font-bold mt-2 uppercase tracking-widest">Optimize this function for readability and performance.</p>
          </header>
          
          {/* Lore Context Panel */}
          <div className="mb-8 bg-white border-4 border-black p-4 shadow-[6px_6px_0_black]">
            <div className="flex items-center gap-2 mb-2 bg-[#FF00FF] text-white w-max px-2 py-1 border-2 border-black">
              <span className="material-symbols-outlined text-sm font-black">info</span>
              <span className="font-jetbrains-mono text-xs font-black uppercase tracking-widest">Goal</span>
            </div>
            <p className="font-jetbrains-mono text-black font-bold">
              "This code is messy. Clean up the nested if-statements to make it easier to read."
            </p>
          </div>
          
          {/* Code Editor */}
          <div className="flex-1 min-h-[400px] bg-white border-4 border-black shadow-[12px_12px_0_black] flex flex-col relative overflow-hidden mb-8">
            
            {/* Editor Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-4 border-black bg-[#A3E635]">
              <div className="text-sm font-jetbrains-mono font-black text-black uppercase tracking-widest bg-white px-2 py-1 border-2 border-black">
                refactor_logic.py
              </div>
              <div className="flex gap-2">
                <div className="w-4 h-4 border-2 border-black bg-white"></div>
                <div className="w-4 h-4 border-2 border-black bg-black"></div>
              </div>
            </div>
            
            {/* Editor Content */}
            <div className="flex-1 relative overflow-hidden bg-[#F3F4F6]">
              <Editor
                height="100%"
                defaultLanguage="python"
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
                defaultValue={`def process_data(entries):\n    result = []\n    for i in entries:\n        if i != None:\n            if i > 10:\n                if i % 2 == 0:\n                    val = i * 2\n                    result.append(val)\n        # Redundant calculation here\n    return result`}
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
                    Terminal
                  </span>
                  <button onClick={() => setIsTerminalOpen(false)} className="hover:text-[#FF00FF] transition-colors">
                    <span className="material-symbols-outlined text-xl">close</span>
                  </button>
                </div>
                <div className="p-4 font-jetbrains-mono text-sm text-white overflow-y-auto space-y-2">
                  {terminalOutput.map((line, idx) => (
                    <div key={idx} className={line.includes('SUCCESS') ? 'text-[#A3E635] font-black' : line.includes('ERROR') ? 'text-[#FF0000] font-black' : 'text-white'}>
                      {line}
                    </div>
                  ))}
                  <div className="animate-pulse text-[#FF00FF] mt-2 font-black">_</div>
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-6">
            <button onClick={handleRunCode} className="bg-white border-4 border-black text-black px-8 py-4 font-space-grotesk text-xl font-black uppercase shadow-[6px_6px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[10px_10px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0_black] transition-all flex items-center gap-3">
              Run Code
              <span className="material-symbols-outlined text-2xl">play_arrow</span>
            </button>
            <button className="bg-[#FF00FF] border-4 border-black text-white px-8 py-4 font-space-grotesk text-xl font-black uppercase shadow-[6px_6px_0_black] hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[10px_10px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0_black] transition-all flex items-center gap-3">
              Submit Solution
              <span className="material-symbols-outlined text-2xl">send</span>
            </button>
          </div>
        </div>

        {/* Right Evaluation Panel */}
        <aside className="w-full md:w-96 bg-white border-t-4 md:border-t-0 md:border-l-4 border-black p-6 flex flex-col gap-8 overflow-y-auto z-10 relative">
          
          {/* Success Indicator */}
          <div className="bg-[#A3E635] border-4 border-black shadow-[6px_6px_0_black] p-6 flex flex-col items-center text-center mt-4">
            <div className="w-20 h-20 bg-white border-4 border-black flex items-center justify-center mb-4 shadow-[4px_4px_0_black]">
              <span className="material-symbols-outlined text-black text-5xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="text-5xl font-space-grotesk font-black text-black mb-2 tracking-tighter">92<span className="text-xl">/100</span></div>
            <div className="px-4 py-1 bg-black text-white font-jetbrains-mono font-black text-sm uppercase tracking-widest mb-4 border-2 border-black">PASS</div>
            <p className="text-sm text-black font-jetbrains-mono font-bold">Great Job!<br/>Your code is now much cleaner.</p>
          </div>
          
          {/* Evaluation Criteria */}
          <div>
            <h2 className="font-space-grotesk text-2xl font-black text-black mb-6 flex items-center gap-2 uppercase tracking-tighter bg-[#FFD700] border-4 border-black px-4 py-2 shadow-[4px_4px_0_black]">
              <span className="material-symbols-outlined text-black">analytics</span>
              Evaluation
            </h2>
            <div className="space-y-6">
              
              {/* Readability */}
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_black]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-jetbrains-mono font-black text-black uppercase tracking-widest">Readability</span>
                  <span className="text-lg font-black text-black bg-[#A3E635] px-2 py-1 border-2 border-black">84%</span>
                </div>
                <div className="w-full h-4 bg-[#F3F4F6] border-2 border-black overflow-hidden">
                  <div className="h-full bg-[#A3E635] border-r-2 border-black" style={{ width: '84%' }}></div>
                </div>
              </div>
              
              {/* Performance */}
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_black]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-jetbrains-mono font-black text-black uppercase tracking-widest">Performance</span>
                  <span className="text-lg font-black text-black bg-[#00FFFF] px-2 py-1 border-2 border-black">95%</span>
                </div>
                <div className="w-full h-4 bg-[#F3F4F6] border-2 border-black overflow-hidden">
                  <div className="h-full bg-[#00FFFF] border-r-2 border-black" style={{ width: '95%' }}></div>
                </div>
              </div>
              
              {/* Syntax */}
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0_black] flex justify-between items-center">
                <span className="text-sm font-jetbrains-mono font-black text-black uppercase tracking-widest">Syntax Check</span>
                <span className="material-symbols-outlined text-[#FF00FF] text-3xl font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>

            </div>
          </div>
          
          {/* Next Steps */}
          <div className="mt-auto pt-8">
            <Link href="/map" className="w-full py-4 bg-white border-4 border-black text-black font-space-grotesk font-black text-xl uppercase shadow-[6px_6px_0_black] flex items-center justify-center gap-2 hover:-translate-y-2 hover:translate-x-[-2px] hover:shadow-[8px_8px_0_black] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0_black] transition-all group">
              Claim XP
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">keyboard_double_arrow_right</span>
            </Link>
          </div>
          
        </aside>

      </main>
    </div>
  );
}
