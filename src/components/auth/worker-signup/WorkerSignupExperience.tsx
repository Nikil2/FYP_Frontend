'use client';

import { useState } from 'react';
import { MessageSquareText, ClipboardList, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { OnboardingProfile } from '@/types/ai';
import { WorkerSignupForm } from './WorkerSignupWizard';
import { WorkerOnboardingChat } from './WorkerOnboardingChat';

type Mode = 'choose' | 'chat' | 'form';

/**
 * Entry point for worker signup. Lets the worker pick the EASY path (chat/voice
 * with Nova, who fills most of the profile) or fill the form themselves. After
 * the chat, the gathered profile pre-fills the wizard for the remaining
 * photo / CNIC / password steps.
 */
export function WorkerSignupExperience() {
  const [mode, setMode] = useState<Mode>('choose');
  const [profile, setProfile] = useState<OnboardingProfile | undefined>();

  if (mode === 'chat') {
    return (
      <WorkerOnboardingChat
        onComplete={(p) => {
          setProfile(p);
          setMode('form');
        }}
        onSkip={() => setMode('form')}
      />
    );
  }

  if (mode === 'form') {
    return <WorkerSignupForm initialProfile={profile} />;
  }

  // ── Choice screen ──
  return (
    <Card className="w-full max-w-lg p-6 md:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-heading">Mehnati</h1>
        <p className="mt-1 text-sm text-paragraph">
          Worker ban kar kaam shuru karein
        </p>
      </div>

      <button
        onClick={() => setMode('chat')}
        className="group mb-3 w-full rounded-xl border-2 border-tertiary bg-tertiary/5 p-4 text-left transition hover:bg-tertiary/10"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-tertiary text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="flex items-center gap-1.5 font-semibold text-heading">
              Nova se baat kar ke banayein
              <span className="rounded-full bg-tertiary px-2 py-0.5 text-[10px] font-bold text-white">
                ASAAN
              </span>
            </p>
            <p className="mt-0.5 text-sm text-paragraph">
              🎤 Bol kar ya likh kar batayein — Nova aap ki tamam maloomat bhar
              dega. Likhna parhna zaroori nahi.
            </p>
          </div>
        </div>
      </button>

      <button
        onClick={() => setMode('form')}
        className="w-full rounded-xl border border-border p-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
            <ClipboardList size={20} />
          </div>
          <div>
            <p className="font-semibold text-heading">Khud form bharein</p>
            <p className="mt-0.5 text-sm text-paragraph">
              Step-by-step form khud complete karein.
            </p>
          </div>
        </div>
      </button>

      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-paragraph">
        <MessageSquareText size={14} />
        Dono tareeqon mein photos aur CNIC aakhir mein lagani hain.
      </div>
    </Card>
  );
}
