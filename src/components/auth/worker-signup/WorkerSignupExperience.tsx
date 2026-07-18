'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquareText, ClipboardList, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { isAuthenticated, getUserRole } from '@/lib/auth';
import { WorkerSignupForm } from './WorkerSignupWizard';
import { WorkerOnboardingChat } from './WorkerOnboardingChat';
import { WorkerSignupStart } from './WorkerSignupStart';

type Mode = 'choose' | 'start' | 'chat' | 'form';

/** If the soft worker account already exists in this browser (e.g. the page was
 * refreshed mid-chat), resume the chat directly instead of re-showing
 * phone+password+OTP — re-submitting that step would hit a "phone already
 * exists" conflict since the account was already created. */
function initialMode(): Mode {
  if (isAuthenticated() && getUserRole() === 'WORKER') return 'chat';
  return 'choose';
}

/**
 * Entry point for worker signup. The EASY path is AI-first: the worker sets up a
 * soft account with phone + password + OTP (WorkerSignupStart), then Nova gathers
 * the WHOLE profile over chat — including inline location and photo captures — and
 * submits it for verification. The manual "form" path is the classic wizard.
 */
export function WorkerSignupExperience() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(initialMode);

  if (mode === 'start') {
    return <WorkerSignupStart onReady={() => setMode('chat')} />;
  }

  if (mode === 'chat') {
    return (
      <WorkerOnboardingChat
        onFinished={() => router.push('/worker/dashboard')}
      />
    );
  }

  if (mode === 'form') {
    return <WorkerSignupForm />;
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
        onClick={() => setMode('start')}
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
              🎤 Bol kar ya likh kar batayein — Nova poora account bhar dega,
              tasveerein aur location bhi. Likhna parhna zaroori nahi.
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
        Sirf phone aur password se shuru karein — baaki Nova sambhal lega.
      </div>
    </Card>
  );
}
