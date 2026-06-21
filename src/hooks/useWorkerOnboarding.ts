'use client';

/**
 * useWorkerOnboarding — drives the conversational worker-signup chat (Nova
 * "onboarding mode"). Owns the chat thread, the profile gathered so far, and
 * voice recording (so low-literacy workers can speak their answers).
 *
 * The profile is the real payload: when `complete` is true the parent can
 * pre-fill the signup wizard from it.
 */

import { useCallback, useRef, useState } from 'react';
import { aiService } from '@/api/services/ai';
import type { AiMessage, OnboardingProfile } from '@/types/ai';

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const GREETING =
  "Assalam o Alaikum! 👋 Main Nova hoon. Main aap ka Mehnati account banane mein " +
  'madad karunga. Aap likh sakte hain ya 🎤 bol kar bata sakte hain.\n\n' +
  'Shuru karte hain — aap ka poora naam kya hai?';

export function useWorkerOnboarding() {
  const [messages, setMessages] = useState<AiMessage[]>([
    { id: uid(), role: 'assistant', content: GREETING },
  ]);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [profile, setProfile] = useState<OnboardingProfile>({});
  const [missing, setMissing] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  const profileRef = useRef<OnboardingProfile>({});
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: AiMessage = { id: uid(), role: 'user', content: trimmed };
      const pendingId = uid();
      const historyForRequest = [...messages, userMsg];

      setMessages((m) => [
        ...m,
        userMsg,
        { id: pendingId, role: 'assistant', content: '', pending: true },
      ]);
      setLoading(true);

      try {
        const res = await aiService.onboard({
          message: trimmed,
          history: historyForRequest,
          profile: profileRef.current,
        });

        profileRef.current = res.profile;
        setProfile(res.profile);
        setMissing(res.missing);
        setComplete(res.complete);

        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingId
              ? { ...msg, pending: false, content: res.reply }
              : msg,
          ),
        );
      } catch {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingId
              ? {
                  ...msg,
                  pending: false,
                  content:
                    'Maaf kijiye, kuch masla ho gaya. Dobara koshish karein.',
                }
              : msg,
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [messages, loading],
  );

  // ─── Voice: record → transcribe → send ─────────────────────────────────────

  const startRecording = useCallback(async () => {
    if (recording || loading) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        if (blob.size === 0) return;
        setLoading(true);
        try {
          const text = await aiService.transcribe(blob);
          if (text.trim()) await send(text);
        } catch {
          setMessages((m) => [
            ...m,
            {
              id: uid(),
              role: 'assistant',
              content:
                'Awaaz samajh nahi aayi. Dobara bolein ya likh kar bata dein.',
            },
          ]);
        } finally {
          setLoading(false);
        }
      };
      recorder.start();
      mediaRef.current = recorder;
      setRecording(true);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: uid(),
          role: 'assistant',
          content: 'Microphone use nahi ho saka. Aap likh kar bata sakte hain.',
        },
      ]);
    }
  }, [recording, loading, send]);

  const stopRecording = useCallback(() => {
    if (mediaRef.current && recording) {
      mediaRef.current.stop();
      setRecording(false);
    }
  }, [recording]);

  return {
    messages,
    loading,
    recording,
    profile,
    missing,
    complete,
    send,
    startRecording,
    stopRecording,
  };
}
