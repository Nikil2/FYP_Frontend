'use client';

import { useState } from 'react';
import { Phone, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  startWorkerSignup,
  validatePhoneNumber,
  validatePassword,
} from '@/lib/auth';

type Phase = 'details' | 'otp';

/**
 * The single manual step of the AI-first worker signup: phone + password, then
 * a (dummy 000000) OTP. On success the "soft" worker account is created and the
 * worker is logged in, so `onReady` hands off to the Nova chat that completes
 * the rest of the profile.
 */
export function WorkerSignupStart({ onReady }: { onReady: () => void }) {
  const [phase, setPhase] = useState<Phase>('details');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goToOtp = () => {
    setError(null);
    if (!validatePhoneNumber(phone)) {
      setError('Sahi phone number likhein (03XX-XXXXXXX).');
      return;
    }
    const pw = validatePassword(password);
    if (!pw.valid) {
      setError(pw.message ?? 'Password kam az kam 6 characters ka ho.');
      return;
    }
    // OTP is the dummy 000000 for now — no SMS is actually sent.
    setPhase('otp');
  };

  const verify = async () => {
    setError(null);
    setLoading(true);
    const res = await startWorkerSignup(phone, password, otp.trim());
    setLoading(false);
    if (res.success) {
      onReady();
    } else {
      setError(res.message || 'OTP verify nahi hua. Dobara koshish karein.');
    }
  };

  return (
    <Card className="w-full max-w-md p-6 md:p-8">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-heading">Mehnati</h1>
        <p className="mt-1 text-sm text-paragraph">
          {phase === 'details'
            ? 'Apna number aur password dein — phir Nova baaki sab poochega'
            : 'OTP daal kar apna account banayein'}
        </p>
      </div>

      {phase === 'details' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-xl border border-border px-3">
            <Phone size={18} className="text-gray-400" />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XX-XXXXXXX"
              inputMode="tel"
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border px-3">
            <Lock size={18} className="text-gray-400" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (6+ characters)"
              type="password"
              className="w-full bg-transparent py-3 text-sm outline-none"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={goToOtp}
            className="w-full"
          >
            OTP hasil karein
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {phase === 'otp' && (
        <div className="space-y-3">
          <p className="text-center text-xs text-paragraph">
            {phone} par bheja gaya OTP daalein.
            <br />
            <span className="text-gray-400">(Testing: 000000)</span>
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-border px-3">
            <ShieldCheck size={18} className="text-gray-400" />
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
              inputMode="numeric"
              maxLength={6}
              className="w-full bg-transparent py-3 text-center text-lg tracking-[0.5em] outline-none"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <Button
            type="button"
            variant="tertiary"
            size="md"
            onClick={verify}
            disabled={loading || otp.trim().length < 6}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Account banayein aur aage barhein
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
          <button
            type="button"
            onClick={() => {
              setPhase('details');
              setOtp('');
              setError(null);
            }}
            className="w-full text-center text-xs text-paragraph underline"
          >
            Number badlein
          </button>
        </div>
      )}
    </Card>
  );
}
