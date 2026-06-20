'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, Loader2 } from 'lucide-react';
import { aiService } from '@/api/services/ai';
import type { ConversationSummary, StoredTurn } from '@/types/ai';

/**
 * History drawer — lists the logged-in user's past Nova conversations.
 * Picking one rehydrates it into the chat panel via onSelect.
 */
export function ConversationHistory({
  userId,
  onBack,
  onSelect,
}: {
  userId?: string;
  onBack: () => void;
  onSelect: (conversationId: string, turns: StoredTurn[]) => void;
}) {
  const [items, setItems] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const list = await aiService.listConversations(userId);
        if (active) setItems(list);
      } catch {
        if (active) setItems([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  const open = async (id: string) => {
    setLoadingId(id);
    try {
      const turns = await aiService.getMessages(id);
      onSelect(id, turns);
    } catch {
      /* ignore — stay on list */
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-gray-50">
      {/* Sub-header */}
      <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-3">
        <button
          onClick={onBack}
          className="rounded-full p-1.5 text-gray-600 transition hover:bg-gray-100"
          aria-label="Back to chat"
        >
          <ArrowLeft size={18} />
        </button>
        <p className="font-semibold text-gray-800">Chat history</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            <Loader2 className="animate-spin" size={22} />
          </div>
        ) : !userId ? (
          <p className="mt-8 px-4 text-center text-sm text-gray-500">
            Log in to see your saved conversations.
          </p>
        ) : items.length === 0 ? (
          <p className="mt-8 px-4 text-center text-sm text-gray-500">
            No past conversations yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => open(c.id)}
                  disabled={loadingId === c.id}
                  className="flex w-full items-start gap-3 rounded-xl border border-gray-200 bg-white p-3 text-left transition hover:border-emerald-300 hover:bg-emerald-50/40 disabled:opacity-60"
                >
                  <span className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    {loadingId === c.id ? (
                      <Loader2 className="animate-spin" size={14} />
                    ) : (
                      <MessageSquare size={14} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-800">
                      {c.title}
                    </span>
                    <span className="text-xs text-gray-400">
                      {c.messageCount} messages ·{' '}
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
