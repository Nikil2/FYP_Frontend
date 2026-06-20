/**
 * AI Assistant ("Saathi") types — mirror the backend AgentResponseDto and the
 * customer-safe AiWorker shape returned by POST /ai/agent.
 */

export type AiRole = 'user' | 'assistant';

/** A worker returned by the search/recommend tools, rendered as a chat card. */
export interface AiWorker {
  workerId: string;
  fullName: string;
  profilePicUrl?: string | null;
  city?: string | null;
  averageRating: number;
  totalJobsCompleted: number;
  visitingCharges: number;
  rankingScore: number;
  services: { id: number; name: string }[];
  /** AI-written "why recommended" line (recommend_workers only). */
  reason?: string;
}

/** One message in the local chat thread (may carry rich payloads on assistant). */
export interface AiMessage {
  id: string;
  role: AiRole;
  content: string;
  /** Real workers to render under an assistant reply. */
  workers?: AiWorker[];
  /** Navigation hint, e.g. "redirect:/customer/book/2?workerId=abc". */
  action?: string | null;
  /** True while this assistant message is still streaming/pending. */
  pending?: boolean;
}

/** Request body for POST /ai/agent. */
export interface AgentRequest {
  message: string;
  history: { role: AiRole; content: string }[];
  userId?: string;
  conversationId?: string;
}

/** Raw response from POST /ai/agent (returned directly by apiClient.post). */
export interface AgentResponse {
  reply: string;
  toolUsed?: string | null;
  workers?: AiWorker[];
  action?: string | null;
  conversationId?: string | null;
}

/** One row in the history list (GET /ai/conversations). */
export interface ConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  updatedAt: string;
}

/** A stored transcript turn (GET /ai/conversations/:id/messages). */
export interface StoredTurn {
  role: AiRole;
  content: string;
  createdAt: string;
}
