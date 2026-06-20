'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, X, Sparkles, History, PenSquare } from 'lucide-react';
import { AI_BOT } from '@/lib/ai-config';
import { useAIChat } from '@/hooks/useAIChat';
import { ChatMessage } from './ChatMessage';
import { QuickPrompts } from './QuickPrompts';
import { ConversationHistory } from './ConversationHistory';

/**
 * The open chat window for Nova. Header + scrollable messages + input.
 * Auto-scrolls on new messages; Enter sends, Shift+Enter newlines; input is
 * locked while a reply is in flight.
 */
export function AIChatPanel({ onClose }: { onClose: () => void }) {
  const { messages, loading, send, newChat, loadConversation, userId } =
    useAIChat();
  const [input, setInput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Only the greeting present → first-time state, show quick prompts.
  const showQuickPrompts = messages.length <= 1;

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    void send(text);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      className="fixed bottom-24 right-6 z-50 flex h-[600px] max-h-[calc(100vh-7rem)] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-2xl ring-1 ring-black/10"
      role="dialog"
      aria-label={`${AI_BOT.name} chat`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <p className="font-semibold leading-tight">{AI_BOT.name}</p>
          <p className="text-xs text-white/80">{AI_BOT.tagline}</p>
        </div>
        <button
          onClick={() => {
            setShowHistory(false);
            newChat();
          }}
          className="rounded-full p-1.5 transition hover:bg-white/20"
          aria-label="New chat"
          title="New chat"
        >
          <PenSquare size={18} />
        </button>
        <button
          onClick={() => setShowHistory((s) => !s)}
          className="rounded-full p-1.5 transition hover:bg-white/20"
          aria-label="Chat history"
          title="Chat history"
        >
          <History size={18} />
        </button>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 transition hover:bg-white/20"
          aria-label="Close chat"
        >
          <X size={18} />
        </button>
      </div>

      {/* History drawer (overlays the chat when open) */}
      {showHistory && (
        <ConversationHistory
          userId={userId}
          onBack={() => setShowHistory(false)}
          onSelect={(id, turns) => {
            loadConversation(id, turns);
            setShowHistory(false);
          }}
        />
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {showQuickPrompts && <QuickPrompts onPick={(t) => void send(t)} />}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder="Message Nova…"
            className="max-h-28 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          />
          <button
            onClick={submit}
            disabled={!input.trim() || loading}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-40"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
