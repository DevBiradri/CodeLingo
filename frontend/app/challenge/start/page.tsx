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

  useEffect(() => {
    async function startMission() {
      try {
        // Fetch the question first to determine its type
        const data = await generateQuestion({
          main_topic: mainTopic,
          subtopic: subtopic,
          educational_tip: tip
        });

        const challenge = data.question.challenges[0];
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
        params.set('index', '0');
        
        router.replace(`${targetPath}?${params.toString()}`);
      } catch (error) {
        console.error("Failed to route challenge:", error);
        router.replace('/map');
      }
    }

    startMission();
  }, [router, mainTopic, subtopic, tip]);

  return (
    <div className="bg-[#E5E7EB] min-h-screen flex items-center justify-center font-space-grotesk">
      <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_black] text-center">
        <h2 className="text-2xl font-black uppercase mb-4 animate-pulse">Syncing Mission Protocol...</h2>
        <div className="w-16 h-16 border-4 border-black border-t-[#FF00FF] rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 font-jetbrains-mono text-sm font-bold uppercase">Identifying Challenge Type</p>
      </div>
    </div>
  );
}

export default function ChallengeStart() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChallengeStartContent />
    </Suspense>
  );
}
