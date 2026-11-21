import React, { useState, useEffect } from 'react';
import { ShieldCheck } from '@phosphor-icons/react';

export const CookieConsent: React.FC = () => {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const acknowledged = localStorage.getItem('aegisrx_cookie_consent');
    if (!acknowledged) {
      setDismissed(false);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('aegisrx_cookie_consent', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <aside
      aria-label="Privacy and cookies consent"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 bg-dark-card border border-dark-border rounded-2xl p-4 shadow-2xl transition-base"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-dark-base border border-dark-border text-tealAccent-400 mt-0.5">
          <ShieldCheck size={18} weight="bold" />
        </div>
        <div className="flex-1">
          <div className="title-4 text-white font-semibold mb-1">Session Data and Audit Logs</div>
          <p className="caption-2 text-neutral-400 mb-3">
            AegisRx uses local storage and security tokens to protect prescription records and demonstrate early refill detection.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="button-sm py-1.5 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white transition-hover"
            >
              Acknowledge and proceed
            </button>
            <button
              onClick={handleAccept}
              className="caption-3 py-1.5 px-3 rounded-lg bg-dark-base border border-dark-border text-neutral-300 hover:text-white transition-hover"
            >
              Essential only
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
