/**
 * AI Assistant service ("Nova").
 *
 * Wraps POST /ai/agent. The backend returns the response body directly
 * (NOT wrapped in { success, data }), so apiClient.post resolves to the
 * AgentResponse as-is.
 *
 * Speed notes:
 * - History is trimmed to the last 10 turns and stripped to {role, content}
 *   only, so each request payload stays tiny (fast upload, fewer tokens).
 * - conversationId is threaded through so the backend can persist without the
 *   client resending the whole transcript.
 */

import { apiClient } from '../client';
import API_CONFIG from '../config';
import type {
  AiMessage,
  AgentRequest,
  AgentResponse,
  ConversationSummary,
  StoredTurn,
} from '@/types/ai';

const MAX_HISTORY_TURNS = 10;

function slimHistory(messages: AiMessage[]): AgentRequest['history'] {
  return messages
    .slice(-MAX_HISTORY_TURNS)
    .map(({ role, content }) => ({ role, content }));
}

export const aiService = {
  /**
   * Send a message to the agent. Pass the FULL local thread as `history`
   * (it gets slimmed here); the latest user text goes in `message`.
   */
  async agent(params: {
    message: string;
    history: AiMessage[];
    conversationId?: string;
    userId?: string;
  }): Promise<AgentResponse> {
    const body: AgentRequest = {
      message: params.message,
      history: slimHistory(params.history),
      conversationId: params.conversationId,
      userId: params.userId,
    };
    return apiClient.post<AgentResponse>(API_CONFIG.ENDPOINTS.AI_AGENT, body);
  },

  /** List the logged-in user's past conversations (history panel). */
  async listConversations(userId: string): Promise<ConversationSummary[]> {
    return apiClient.get<ConversationSummary[]>(
      API_CONFIG.ENDPOINTS.AI_CONVERSATIONS(userId),
    );
  },

  /** Load a past conversation's full transcript. */
  async getMessages(conversationId: string): Promise<StoredTurn[]> {
    return apiClient.get<StoredTurn[]>(
      API_CONFIG.ENDPOINTS.AI_CONVERSATION_MESSAGES(conversationId),
    );
  },

  /** Worker conversational onboarding (used later in F5). */
  async onboard(history: AiMessage[], message: string): Promise<unknown> {
    return apiClient.post(API_CONFIG.ENDPOINTS.AI_ONBOARD, {
      history: slimHistory(history),
      message,
    });
  },
};

export default aiService;
