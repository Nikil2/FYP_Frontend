'use client';

/**
 * useAIChat — owns the Nova conversation state.
 *
 * Persistence:
 * - The CURRENT chat (messages + conversationId) is mirrored to localStorage,
 *   keyed per user, so it survives closing the panel and page refreshes.
 * - Full history lives server-side; loadConversation() rehydrates a past chat.
 *
 * Speed:
 * - The user's bubble and a pending assistant bubble appear INSTANTLY on send
 *   (optimistic UI), before the network responds.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { aiService } from '@/api/services/ai';
import { AI_BOT } from '@/lib/ai-config';
import { getAuthUser } from '@/lib/auth';
import type { AiMessage, StoredTurn } from '@/types/ai';

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const greetingMessage = (): AiMessage => ({
  id: uid(),
  role: 'assistant',
  content: AI_BOT.greeting,
});

const storageKey = (userId: string | undefined) => `nova_chat_${userId ?? 'anon'}`;

interface StoredSession {
  conversationId?: string;
  messages: AiMessage[];
}

function loadSession(userId: string | undefined): StoredSession | null {
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.messages?.length) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useAIChat() {
  const router = useRouter();
  const userIdRef = useRef<string | undefined>(getAuthUser()?.id);

  // Lazy-init from localStorage (panel only mounts client-side, so this is safe).
  const restored = loadSession(userIdRef.current);
  const [messages, setMessages] = useState<AiMessage[]>(
    restored?.messages ?? [greetingMessage()],
  );
  const [loading, setLoading] = useState(false);
  const conversationIdRef = useRef<string | undefined>(restored?.conversationId);

  // Customer's coordinates, so the agent can search by real distance instead of
  // guessing a city. Held in a ref because it's request metadata, not UI state —
  // it should never trigger a re-render. Silently skipped if denied.
  const locationRef = useRef<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        locationRef.current = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
      },
      () => {
        /* denied or unavailable — agent falls back to asking for a city */
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }, []);

  // Mirror current session to localStorage whenever messages change.
  useEffect(() => {
    try {
      const session: StoredSession = {
        conversationId: conversationIdRef.current,
        messages,
      };
      localStorage.setItem(storageKey(userIdRef.current), JSON.stringify(session));
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      const userMsg: AiMessage = { id: uid(), role: 'user', content: trimmed };
      const pendingId = uid();
      const pendingMsg: AiMessage = {
        id: pendingId,
        role: 'assistant',
        content: '',
        pending: true,
      };

      const historyForRequest = [...messages, userMsg];

      setMessages((m) => [...m, userMsg, pendingMsg]);
      setLoading(true);

      try {
        const res = await aiService.agent({
          message: trimmed,
          history: historyForRequest,
          conversationId: conversationIdRef.current,
          userId: userIdRef.current,
          location: locationRef.current,
        });

        if (res.conversationId) conversationIdRef.current = res.conversationId;

        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingId
              ? {
                  ...msg,
                  pending: false,
                  content: res.reply,
                  workers: res.workers,
                  action: res.action,
                }
              : msg,
          ),
        );

        if (res.action?.startsWith('redirect:')) {
          router.push(res.action.replace('redirect:', ''));
        }
      } catch {
        setMessages((m) =>
          m.map((msg) =>
            msg.id === pendingId
              ? {
                  ...msg,
                  pending: false,
                  content:
                    'Sorry, I had trouble responding. Please try again in a moment.',
                }
              : msg,
          ),
        );
      } finally {
        setLoading(false);
      }
    },
    [messages, loading, router],
  );

  /** Start a fresh chat — clears the panel and the persisted session. */
  const newChat = useCallback(() => {
    conversationIdRef.current = undefined;
    setMessages([greetingMessage()]);
    try {
      localStorage.removeItem(storageKey(userIdRef.current));
    } catch {
      /* non-fatal */
    }
  }, []);

  /** Rehydrate a past conversation from the server into the panel. */
  const loadConversation = useCallback(
    (conversationId: string, turns: StoredTurn[]) => {
      conversationIdRef.current = conversationId;
      const restoredMsgs: AiMessage[] = turns.map((t) => ({
        id: uid(),
        role: t.role,
        content: t.content,
        workers: t.workers,
        action: t.action,
      }));
      setMessages(restoredMsgs.length ? restoredMsgs : [greetingMessage()]);
    },
    [],
  );

  return { messages, loading, send, newChat, loadConversation, userId: userIdRef.current };
}
