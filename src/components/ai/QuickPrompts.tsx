'use client';

import { Sparkles } from 'lucide-react';
import { AI_QUICK_PROMPTS } from '@/lib/ai-config';

/** Suggestion chips shown on first open — one tap sends the prompt. */
export function QuickPrompts({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="px-1">
      <p className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-400">
        <Sparkles size={12} /> Try asking
      </p>
      <div className="flex flex-wrap gap-2">
        {AI_QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onPick(prompt)}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
