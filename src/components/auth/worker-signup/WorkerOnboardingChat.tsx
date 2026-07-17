'use client';

import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Mic, Square, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TypingIndicator } from '@/components/ai/TypingIndicator';
import { useWorkerOnboarding } from '@/hooks/useWorkerOnboarding';
import { OnboardingCaptureWidget } from './OnboardingCaptureWidget';

/**
 * Conversational worker signup. The worker (already logged into the soft account
 * from the phone+OTP step) chats or speaks with Nova, who gathers the whole
 * profile one step at a time — including inline location and photo captures.
 * When everything is collected, the profile is submitted for verification and
 * `onFinished` fires (parent redirects to the dashboard).
 */
export function WorkerOnboardingChat({
  onFinished,
}: {
  onFinished: () => void;
}) {
  const {
    messages,
    loading,
    recording,
    complete,
    awaiting,
    finishing,
    send,
    submitCapture,
    uploadImage,
    finish,
    startRecording,
    stopRecording,
  } = useWorkerOnboarding();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, awaiting]);

  const submit = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    void send(text);
  };

  const handleFinish = async () => {
    const ok = await finish();
    if (ok) onFinished();
  };

  const showWidget = !complete && awaiting !== 'text';

  return (
    <div className="flex h-[600px] max-h-[calc(100vh-7rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-gray-50 shadow-xl ring-1 ring-black/5">
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3 text-white">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
          <Sparkles size={18} />
        </div>
        <div className="flex-1">
          <p className="font-semibold leading-tight">Nova</p>
          <p className="text-xs text-white/80">Aap ka account banane mein madad</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
                  isUser
                    ? 'rounded-br-md bg-emerald-600 text-white'
                    : 'rounded-bl-md bg-white text-gray-800 shadow-sm ring-1 ring-gray-100',
                )}
              >
                {m.pending ? (
                  <TypingIndicator />
                ) : (
                  <span className="whitespace-pre-wrap break-words">
                    {m.content}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Inline capture widget (location / CNIC / selfie / work photos) */}
        {showWidget && (
          <OnboardingCaptureWidget
            awaiting={awaiting}
            uploadImage={uploadImage}
            onCapture={submitCapture}
            disabled={loading}
          />
        )}
      </div>

      {/* Completion banner */}
      {complete && (
        <div className="border-t border-emerald-100 bg-emerald-50 px-4 py-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 size={16} />
            Sab maloomat mil gayi!
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={handleFinish}
            disabled={finishing}
            className="w-full"
          >
            {finishing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Profile submit karein'
            )}
          </Button>
        </div>
      )}

      {/* Input + mic */}
      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-end gap-2">
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={loading && !recording}
            className={cn(
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl transition disabled:opacity-40',
              recording
                ? 'animate-pulse bg-red-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
            )}
            aria-label={recording ? 'Stop recording' : 'Speak your answer'}
            title={recording ? 'Rukne ke liye dabayein' : 'Bol kar batayein'}
          >
            {recording ? <Square size={16} /> : <Mic size={18} />}
          </button>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={1}
            placeholder={recording ? 'Sun raha hoon…' : 'Yahan likhein…'}
            disabled={recording}
            className="max-h-28 flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          />
          <button
            onClick={submit}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:opacity-40"
            aria-label="Send"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-1.5 text-center text-[11px] text-gray-400">
          🎤 dabayein aur bolein, ya likh kar bhejein
        </p>
      </div>
    </div>
  );
}
