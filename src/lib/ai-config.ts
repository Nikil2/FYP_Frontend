/**
 * AI Assistant branding + tuning — single source of truth.
 * Change the bot name here and it updates everywhere in the UI.
 */
export const AI_BOT = {
  /** Full display name (header). */
  name: 'Nova',
  /** Short name (bubble, compact spots). */
  shortName: 'Nova',
  /** First greeting shown when the chat opens. */
  greeting:
    'Hi, I\'m Nova 👋 Ask me to find a worker or help with a booking — e.g. "Find an AC technician in Karachi under 2000".',
  /** Tagline under the name in the header. */
  tagline: 'AI assistant',
} as const;

/** Quick-suggestion chips shown on first open (also great for the demo). */
export const AI_QUICK_PROMPTS = [
  'Find an AC technician in Karachi',
  'Best electrician near me',
  'How does booking work?',
  'I need someone to fix my geyser',
] as const;
