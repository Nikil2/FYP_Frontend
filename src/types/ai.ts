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

// ─── Worker conversational onboarding (POST /ai/onboard) ─────────────────────

/** A service the worker chose during onboarding, with the price they set. */
export interface OnboardingService {
  serviceId: number;
  name: string;
  price: number;
}

/** The full worker profile gathered by Nova — text fields + inline captures. */
export interface OnboardingProfile {
  fullName?: string;
  services?: OnboardingService[];
  experienceYears?: number;
  visitingCharges?: number;
  homeAddress?: string;
  city?: string;
  bio?: string;
  // Captured via inline widgets (location + photos):
  cnicNumber?: string;
  cnicFrontUrl?: string;
  cnicBackUrl?: string;
  selfieUrl?: string;
  workPhotosUrls?: string[];
  homeLat?: number;
  homeLng?: number;
}

/** Which inline capture widget the client should show next ('text' = none). */
export type OnboardingAwaiting =
  | 'text'
  | 'location'
  | 'cnic'
  | 'selfie'
  | 'workPhotos';

/** Request body for POST /ai/onboard. */
export interface OnboardRequest {
  message: string;
  history: { role: AiRole; content: string }[];
  profile?: OnboardingProfile;
}

/** Response from POST /ai/onboard. */
export interface OnboardResponse {
  reply: string;
  profile: OnboardingProfile;
  /** Friendly labels of fields still needed, e.g. ["your city"]. */
  missing: string[];
  /** The inline capture step to render next, or 'text' to keep chatting. */
  awaiting: OnboardingAwaiting;
  /** True when all chat-collected fields are present. */
  complete: boolean;
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
  /** Worker cards saved with an assistant turn (rehydrated in history). */
  workers?: AiWorker[];
  action?: string | null;
}
