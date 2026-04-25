"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateQuestion } from '../../../lib/api';

function ChallengeStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const mainTopic = searchParams.get('topic') || 'General Programming';
  const subtopic = searchParams.get('subtopic') || 'Core';
  const tip = searchParams.get('tip') || '';
  const completed = parseInt(searchParams.get('completed') || '0', 10);

  useEffect(() => {
    async function startMission() {
      try {
        // Fetch the question first to determine its type
        const data = await generateQuestion({
          main_topic: mainTopic,
          subtopic: subtopic,
          educational_tip: tip
        });

        // Determine which index to start at based on what they already completed
        let startIndex = completed;
        if (startIndex >= data.question.challenges.length) {
          // If somehow they completed 3 but it still routed here, just put them at the end or start over
          startIndex = data.question.challenges.length - 1;
        }

        const challenge = data.question.challenges[startIndex];
        const type = challenge.type;

        // Construct the base URL for redirection
        let targetPath = '/challenge/predict';
        if (type === 'drag_and_drop') targetPath = '/challenge/build';
        if (type === 'refactor') targetPath = '/challenge/refactor';

        // Redirect to the appropriate UI with the SAME parameters + the cache key and index
        const params = new URLSearchParams();
        params.set('topic', mainTopic);
        params.set('subtopic', subtopic);
        params.set('tip', tip);
        params.set('key', data.question_key);
        params.set('index', startIndex.toString());
        
        router.replace(`${targetPath}?${params.toString()}`);
      } catch (error) {
        console.error("Failed to route challenge:", error);
        router.replace('/map');
      }
    }

    startMission();
  }, [router, mainTopic, subtopic, tip, completed]);

  return (
    <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center font-space-grotesk text-black">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_black] text-center text-black">
        <h2 className="text-2xl font-black uppercase mb-4 animate-pulse text-black">Syncing Mission Protocol...</h2>
        <div className="w-16 h-16 border-4 border-black border-t-[#FF00FF] rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 font-jetbrains-mono text-sm font-bold uppercase text-black">Identifying Challenge Type</p>
      </div>
    </div>
  );
}

export default function ChallengeStart() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center text-black text-2xl font-black font-space-grotesk uppercase">Loading...</div>}>
      <ChallengeStartContent />
    </Suspense>
  );
}
