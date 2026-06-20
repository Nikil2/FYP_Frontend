'use client';

/** Three bouncing dots shown while Nova is thinking. */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-1 py-1" aria-label="Nova is typing">
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.3s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400 [animation-delay:-0.15s]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-400" />
    </div>
  );
}
