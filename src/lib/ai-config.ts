/**
 * AI Assistant branding + tuning — single source of truth.
 * Change the bot name here and it updates everywhere in the UI.
 */
export const AI_BOT = {
  /** Full display name (header). */
  name: 'Mehnati Saathi',
  /** Short name (bubble, compact spots). */
  shortName: 'Saathi',
  /** Urdu rendering, used where bilingual text is shown. */
  nameUrdu: 'مہنتی ساتھی',
  /** First greeting shown when the chat opens. */
  greeting:
    'Assalam o Alaikum! 👋 Main Saathi hoon. Tell me what you need — e.g. "Find an AC technician in Karachi under 2000".',
  /** Tagline under the name in the header. */
  tagline: 'Your AI helper',
} as const;

/** Quick-suggestion chips shown on first open (also great for the demo). */
export const AI_QUICK_PROMPTS = [
  'Find an AC technician in Karachi',
  'Best electrician near me',
  'How does booking work?',
  'I need someone to fix my geyser',
] as const;
