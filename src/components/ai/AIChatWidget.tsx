'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { AIChatPanel } from './AIChatPanel';
import { AI_BOT } from '@/lib/ai-config';

/**
 * Floating entry point for Nova. Renders a bubble bottom-right that toggles the
 * chat panel. Mounted once in the customer layout, so it follows the user
 * across every /customer/* page.
 */
export function AIChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AIChatPanel onClose={() => setOpen(false)} />}

      <button
        onClick={() => setOpen((o) => !o)}
        className={`fixed bottom-20 right-6 z-50 h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 transition hover:scale-105 hover:shadow-xl md:bottom-6 ${
          open ? 'hidden sm:flex' : 'flex'
        }`}
        aria-label={open ? 'Close Nova' : `Open ${AI_BOT.name}`}
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}

        {/* Subtle pulse ring to draw attention when closed. */}
        {!open && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-500 opacity-20" />
        )}
      </button>
    </>
  );
}
