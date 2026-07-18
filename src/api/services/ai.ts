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
  OnboardRequest,
  OnboardResponse,
  OnboardingProfile,
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

  /**
   * Worker conversational onboarding. Sends the latest message + slimmed
   * history + the profile gathered so far; gets back Nova's reply and the
   * merged profile (with what's still missing).
   */
  async onboard(params: {
    message: string;
    history: AiMessage[];
    profile?: OnboardingProfile;
  }): Promise<OnboardResponse> {
    const body: OnboardRequest = {
      message: params.message,
      history: slimHistory(params.history),
      profile: params.profile,
    };
    // Nova may chain several tool calls in one turn (e.g. list_services then
    // record_worker_details) — each is a separate Groq round-trip, so this can
    // legitimately take longer than the default 30s used for plain CRUD calls.
    return apiClient.post<OnboardResponse>(
      API_CONFIG.ENDPOINTS.AI_ONBOARD,
      body,
      undefined,
      60000,
    );
  },

  /** Speech-to-text: send a recorded audio clip, get the transcript back. */
  async transcribe(audio: Blob): Promise<string> {
    const form = new FormData();
    form.append('audio', audio, 'answer.webm');
    const res = await apiClient.upload<{ text: string }>(
      API_CONFIG.ENDPOINTS.AI_TRANSCRIBE,
      form,
    );
    return res.text ?? '';
  },

  /**
   * Upload one inline onboarding image (CNIC front/back, selfie, work photo)
   * to Cloudinary and get its URL back. Requires the soft-account token.
   */
  async uploadOnboardingImage(image: Blob): Promise<string> {
    const form = new FormData();
    form.append('image', image, 'photo.jpg');
    const res = await apiClient.upload<{ url: string }>(
      API_CONFIG.ENDPOINTS.AI_ONBOARD_UPLOAD_IMAGE,
      form,
    );
    return res.url ?? '';
  },

  /**
   * Finish onboarding: turn the soft worker account into a full WorkerProfile
   * (submitted for verification). Maps the gathered profile to the backend DTO.
   */
  async completeWorkerProfile(profile: OnboardingProfile): Promise<unknown> {
    const body = {
      fullName: profile.fullName,
      cnicNumber: profile.cnicNumber,
      cnicFrontUrl: profile.cnicFrontUrl,
      cnicBackUrl: profile.cnicBackUrl,
      selfieUrl: profile.selfieUrl,
      workPhotosUrls: profile.workPhotosUrls,
      homeAddress: profile.homeAddress,
      homeLat: profile.homeLat,
      homeLng: profile.homeLng,
      city: profile.city,
      experienceYears: profile.experienceYears,
      visitingCharges: profile.visitingCharges,
      bio: profile.bio,
      services: profile.services,
    };
    return apiClient.post(
      API_CONFIG.ENDPOINTS.WORKERS_COMPLETE_PROFILE,
      body,
    );
  },
};

export default aiService;
