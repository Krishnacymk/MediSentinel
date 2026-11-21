import React from 'react';

export const SkipToContent: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-tealAccent-600 focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none caption-3 font-semibold transition-base"
    >
      Skip to main clinical content
    </a>
  );
};
