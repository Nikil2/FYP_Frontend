# AI Integration — Frontend Implementation Guide

> **App:** Mehnati Marketplace — Agentic AI + Chatbot UI
> **Stack:** Next.js 16 (App Router, React 19, TypeScript) + Tailwind
> **Scope:** This document covers the **frontend** only. See `AI_INTEGRATION_BACKEND.md` in the `FYP_BACKEND` folder for the API/agent side.

---

## 1. What The Frontend Delivers

A floating **AI assistant widget** on customer pages that does two things in one interface:

1. **Chatbot** — answers platform questions (pricing, how booking works, complaints) in English/Urdu/Roman-Urdu.
2. **Agentic search + recommendation** — customer types a need ("Lahore mein electrician chahiye 2500 budget"), the AI calls the backend, and **real worker cards** render *inside the chat* with **Book Now** buttons.

The frontend never talks to Groq directly. It calls our own backend `POST /ai/agent`, which runs the agent + tools and returns text + real DB workers + an optional navigation action.

```
User types in widget
   → apiClient.post('/ai/agent', { message, history })
   → backend runs agent loop (Groq + DB tools)
   → returns { reply, toolUsed, workers[], action }
   → widget renders AI text + <WorkerResultCard/> list + optional redirect
```

---

## 2. Files To Create

```
src/
├── api/
│   └── services/
│       └── ai.ts                      # aiService.agent(), aiService.onboard()
├── hooks/
│   └── useAIChat.ts                   # conversation state + send logic
├── components/
│   └── ai/
│       ├── AIChatWidget.tsx           # floating bubble + chat panel (entry point)
│       ├── AIChatPanel.tsx            # open chat window (header, messages, input)
│       ├── ChatMessage.tsx            # one bubble (user / assistant)
│       ├── WorkerResultCard.tsx       # real worker card rendered inside chat
│       ├── TypingIndicator.tsx        # "AI is typing…" dots
│       └── QuickPrompts.tsx           # suggestion chips ("Find an electrician")
└── types/
    └── ai.ts                          # AiMessage, AgentResponse, AiWorker types
```

Optional (worker onboarding phase):
```
src/components/ai/WorkerOnboardingChat.tsx   # chat-based signup
```

---

## 3. Environment

Already present in `.env.local` — no new vars needed (the AI key lives only on the backend):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 4. Types (`src/types/ai.ts`)

```ts
export type AiRole = 'user' | 'assistant';

export interface AiMessage {
  role: AiRole;
  content: string;
  // optional rich payload attached to an assistant message:
  workers?: AiWorker[];
  action?: string | null;     // e.g. "redirect:/customer/book/2?workerId=abc"
}

export interface AiWorker {
  workerId: string;
  fullName: string;
  profilePicUrl?: string;
  averageRating: number;
  totalJobsCompleted: number;
  visitingCharges: number;
  services: { id: number; name: string }[];
  reason?: string;            // AI-written "why recommended" line
}

export interface AgentResponse {
  reply: string;
  toolUsed?: string | null;
  workers?: AiWorker[];
  action?: string | null;
}
```

---

## 5. API Service (`src/api/services/ai.ts`)

Follows the existing `apiClient` singleton pattern used by the other services.

```ts
import { apiClient } from '../client';
import type { AiMessage, AgentResponse } from '@/types/ai';

export const aiService = {
  /** Main agentic endpoint: chat + search + recommend */
  agent(message: string, history: AiMessage[], userId?: string) {
    // strip rich payloads from history before sending (only role+content)
    const slimHistory = history.slice(-10).map(({ role, content }) => ({ role, content }));
    return apiClient.post<AgentResponse>('/ai/agent', {
      message,
      history: slimHistory,
      userId,
    });
  },

  /** Worker conversational onboarding (optional phase) */
  onboard(history: AiMessage[], message: string) {
    return apiClient.post('/ai/onboard', { history, message });
  },
};
```

Add the endpoint to `src/api/config.ts` `API_CONFIG.endpoints` for consistency:
```ts
ai: {
  agent: '/ai/agent',
  onboard: '/ai/onboard',
},
```

---

## 6. The Hook (`src/hooks/useAIChat.ts`)

Owns the conversation. Components stay dumb.

```ts
'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { aiService } from '@/api/services/ai';
import type { AiMessage } from '@/types/ai';

const GREETING: AiMessage = {
  role: 'assistant',
  content: 'Assalam o Alaikum! 👋 I can help you find the best worker. Try: "Find an electrician in Lahore under 2000".',
};

export function useAIChat() {
  const router = useRouter();
  const [messages, setMessages] = useState<AiMessage[]>([GREETING]);
  const [loading, setLoading] = useState(false);

  const send = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const userMsg: AiMessage = { role: 'user', content: text };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);
    try {
      const res = await aiService.agent(text, [...messages, userMsg]);
      const data = res.data; // ApiResponse wrapper → .data
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: data.reply,
          workers: data.workers,
          action: data.action,
        },
      ]);

      // handle navigation action ("redirect:/customer/book/2?workerId=abc")
      if (data.action?.startsWith('redirect:')) {
        router.push(data.action.replace('redirect:', ''));
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [messages, router]);

  return { messages, loading, send };
}
```

> **History note:** we send `[...messages, userMsg]` so the backend has full context; the service slims it to `role`+`content` and last 10 turns to control token cost.

---

## 7. Components

### 7.1 `AIChatWidget.tsx` — entry point (floating bubble)
```tsx
'use client';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AIChatPanel } from './AIChatPanel';

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  return (
    <>
      {open && <AIChatPanel onClose={() => setOpen(false)} />}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
        aria-label="Open AI assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </>
  );
}
```

### 7.2 `AIChatPanel.tsx` — the chat window
- Header: "Mehnati Assistant" + close button.
- Scrollable messages area mapping `messages` → `<ChatMessage/>`.
- For assistant messages with `workers`, render a vertical list of `<WorkerResultCard/>` under the bubble.
- `<TypingIndicator/>` while `loading`.
- `<QuickPrompts/>` shown only on first open.
- Input row: textarea + send button → calls `send(text)`.
- Fixed size, e.g. `w-[380px] h-[600px]`, bottom-right, above the bubble.

### 7.3 `ChatMessage.tsx`
- User bubble: right-aligned, emerald background.
- Assistant bubble: left-aligned, gray background.
- Supports basic line breaks; keep it simple (no markdown lib required, optional `react-markdown`).

### 7.4 `WorkerResultCard.tsx` — **the agentic payoff**
Renders a REAL worker returned by the DB, inside the chat:
```tsx
'use client';
import { useRouter } from 'next/navigation';
import type { AiWorker } from '@/types/ai';

export function WorkerResultCard({ worker }: { worker: AiWorker }) {
  const router = useRouter();
  const serviceId = worker.services[0]?.id;
  return (
    <div className="mt-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={worker.profilePicUrl || '/avatar-placeholder.png'}
          alt={worker.fullName}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{worker.fullName}</p>
          <p className="text-xs text-gray-500">
            ⭐ {worker.averageRating.toFixed(1)} · {worker.totalJobsCompleted} jobs · PKR {worker.visitingCharges}
          </p>
        </div>
      </div>
      {worker.reason && (
        <p className="mt-2 text-xs text-emerald-700">{worker.reason}</p>
      )}
      <div className="mt-2 flex gap-2">
        <button
          onClick={() => router.push(`/worker/${worker.workerId}`)}
          className="flex-1 rounded-lg border border-gray-300 py-1.5 text-xs font-medium"
        >
          View Profile
        </button>
        <button
          onClick={() => router.push(`/customer/book/${serviceId}?workerId=${worker.workerId}`)}
          className="flex-1 rounded-lg bg-emerald-600 py-1.5 text-xs font-medium text-white"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
```

### 7.5 `QuickPrompts.tsx`
Suggestion chips that call `send()` directly:
```
"Find an electrician in Lahore"  ·  "Best plumber near me"
"How does booking work?"         ·  "I need someone to fix my geyser"
```

### 7.6 `TypingIndicator.tsx`
Three bouncing dots while `loading === true`.

---

## 8. Mounting The Widget

Add the widget to the **customer layout only** so it appears on every `/customer/*` page.

In `src/app/customer/layout.tsx`:
```tsx
import { AIChatWidget } from '@/components/ai/AIChatWidget';

export default function CustomerLayout({ children }) {
  return (
    <>
      {children}
      <AIChatWidget />
    </>
  );
}
```

> Keep it OUT of `worker/dashboard/*` and `admin/*` layouts (different audiences). The admin gets its own AI panel (see §11).

---

## 9. End-to-End Flow (Frontend View)

```
1. Customer clicks floating 💬 bubble        → AIChatPanel opens, shows greeting + QuickPrompts
2. Types "Lahore electrician 2500 budget"    → useAIChat.send()
3. User bubble appears, TypingIndicator on   → POST /ai/agent
4. Backend agent calls DB tool, returns:
     { reply, workers:[3 real electricians], action:null }
5. Assistant bubble renders reply text
   + 3 <WorkerResultCard/> with View / Book Now
6. Customer clicks "Book Now"                → router.push(/customer/book/1?workerId=abc)
   → existing booking form opens, pre-filled
```

For a booking action returned BY the AI (`action:"redirect:..."`), the hook auto-navigates — no click needed.

---

## 10. Conversation Examples (must work)

| Customer types | What renders |
|---|---|
| "mujhe DHA Lahore mein electrician chahiye 2500 budget" | reply + 3 real electrician cards |
| "Who is the best carpenter in Karachi?" | reply + ranked cards each with `reason` line |
| "Tell me more about Ahmed" | reply with bio/rating (from `get_worker_detail`) |
| "I need to fix my geyser" | reply: "That's under Plumber — want me to find plumbers?" |
| "How do I cancel a booking?" | plain text answer, no cards |
| "Book the second one" | auto `router.push` to booking form |

---

## 11. Admin AI Panel (Optional Phase)

Separate, simpler UI under `src/app/admin/(panel)/`:
- **Daily Briefing card** on the dashboard — on mount, `POST /ai/admin/briefing`, render the 2-3 sentence summary.
- **Complaint auto-label badge** on the complaints page — shows AI category (`billing_dispute`, `quality_issue`, etc.) next to each complaint.
- No chat widget here; these are one-shot AI calls rendered as cards/badges.

---

## 12. Worker Onboarding Chat (Optional Phase)

Replace/augment the long worker signup with `WorkerOnboardingChat.tsx`:
- Uses the same chat UI primitives (`ChatMessage`, input).
- Calls `aiService.onboard(history, message)` each turn.
- When backend returns `{ complete:true, draft }`, show a summary card and submit `draft` to the EXISTING `workersService.register(...)`.
- CNIC/selfie images still use the normal upload flow (`uploadsService`) — the chat collects text fields, the image steps stay as file pickers.

---

## 13. UX Polish Checklist

- [ ] Auto-scroll messages to bottom on new message.
- [ ] Disable input + show TypingIndicator while `loading`.
- [ ] Enter to send, Shift+Enter for newline.
- [ ] Persist conversation in `sessionStorage` so it survives route changes (optional).
- [ ] Mobile: panel goes full-screen below `sm` breakpoint.
- [ ] Empty/error states: friendly retry message (already in hook).
- [ ] RTL-friendly text for Urdu replies.

---

## 14. Build Order (Frontend)

1. `src/types/ai.ts` (types).
2. `src/api/services/ai.ts` (+ `config.ts` endpoint) — confirm `POST /ai/agent` works via the widget.
3. `src/hooks/useAIChat.ts`.
4. Components: `TypingIndicator` → `ChatMessage` → `WorkerResultCard` → `QuickPrompts` → `AIChatPanel` → `AIChatWidget`.
5. Mount `<AIChatWidget/>` in `customer/layout.tsx`.
6. Test the full flow against the running backend.
7. (Optional) Admin panel cards, then worker onboarding chat.

---

## 15. Reused Existing Frontend Patterns

| AI need | Existing pattern reused |
|---|---|
| HTTP calls | `apiClient` singleton (`src/api/client.ts`) |
| Response shape | `ApiResponse<T>` (`src/api/types.ts`) — read `res.data` |
| Service module style | mirror `src/api/services/workers.ts` |
| Navigation | `next/navigation` `useRouter` (same as booking flow) |
| Booking deep-link | existing `/customer/book/[serviceId]` route + `workerId` query |
| Worker profile route | existing `/worker/[id]` page |
| Styling | Tailwind + `cn()` util, emerald theme, `ui/` base components |

The AI widget is an **additive layer** — it reuses your API client, routes, and booking flow without changing them.
