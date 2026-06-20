'use client';

/**
 * useAIChat — owns the Nova conversation state.
 *
 * Speed-first design:
 * - The user's bubble and a pending assistant bubble appear INSTANTLY on send
 *   (optimistic UI), before the network responds — this is what makes the chat
 *   feel fast even though the model takes ~1-2s.
 * - conversationId is threaded back to the backend so it persists server-side
 *   without us resending the full transcript.
 */

import { useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { aiService } from '@/api/services/ai';
import { AI_BOT } from '@/lib/ai-config';
import { getAuthUser } from '@/lib/auth';
import type { AiMessage } from '@/types/ai';

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const greetingMessage = (): AiMessage => ({
  id: uid(),
  role: 'assistant',
  content: AI_BOT.greeting,
});

export function useAIChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<AiMessage[]>([greetingMessage()]);
  const [loading, setLoading] = useState(false);
  const conversationIdRef = useRef<string | undefined>(undefined);

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

      // Snapshot history BEFORE optimistic placeholders (real turns only).
      const historyForRequest = [...messages, userMsg];

      // Optimistic: show user + typing bubble immediately.
      setMessages((m) => [...m, userMsg, pendingMsg]);
      setLoading(true);

      try {
        const userId = getAuthUser()?.id;
        const res = await aiService.agent({
          message: trimmed,
          history: historyForRequest,
          conversationId: conversationIdRef.current,
          userId,
        });

        if (res.conversationId) conversationIdRef.current = res.conversationId;

        // Replace the pending bubble with the real reply + workers.
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

        // Auto-navigate if the agent returned a redirect action.
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

  const reset = useCallback(() => {
    conversationIdRef.current = undefined;
    setMessages([greetingMessage()]);
  }, []);

  return { messages, loading, send, reset };
}
