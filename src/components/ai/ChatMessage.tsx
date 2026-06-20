'use client';

import { cn } from '@/lib/utils';
import type { AiMessage } from '@/types/ai';
import { TypingIndicator } from './TypingIndicator';
import { WorkerResultCard } from './WorkerResultCard';

/**
 * Renders one chat turn. User bubbles sit right (emerald); Nova bubbles sit
 * left (white). Worker cards render under a Nova reply; a pending Nova message
 * shows the typing indicator.
 */
export function ChatMessage({ message }: { message: AiMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
          isUser
            ? 'rounded-br-md bg-emerald-600 text-white'
            : 'rounded-bl-md bg-white text-gray-800 shadow-sm ring-1 ring-gray-100',
        )}
      >
        {message.pending ? (
          <TypingIndicator />
        ) : (
          <span className="whitespace-pre-wrap break-words">{message.content}</span>
        )}
      </div>

      {/* Worker cards (search / recommend results) under Nova's reply. */}
      {!isUser && message.workers && message.workers.length > 0 && (
        <div className="mt-1 w-[85%]">
          {message.workers.map((w) => (
            <WorkerResultCard key={w.workerId} worker={w} />
          ))}
        </div>
      )}
    </div>
  );
}
