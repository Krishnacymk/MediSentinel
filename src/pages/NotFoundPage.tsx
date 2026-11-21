import React from 'react';
import { Link } from 'react-router-dom';
import { Warning, ArrowLeft, ShieldCheck } from '@phosphor-icons/react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center text-tealAccent-400 mb-6 shadow-xl">
        <ShieldCheck size={36} weight="bold" />
      </div>

      <span className="caption-3 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-tealAccent-400 mb-4 font-mono">
        Error 404 • Medical Route Not Found
      </span>

      <h1 className="heading-3 hero-gradient-text max-w-md mb-4 tracking-tight">
        The requested clinical page does not exist
      </h1>

      <p className="body-3 text-neutral-400 max-w-md mb-8">
        The record, dashboard view, or prescription endpoint you attempted to reach could not be located in the current network index.
      </p>

      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="button-md py-2 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-2 transition-hover"
        >
          <ArrowLeft size={16} weight="bold" />
          <span>Return to platform homepage</span>
        </Link>
        <Link
          to="/pharmacist-dashboard"
          className="button-md py-2 px-4 rounded-xl bg-dark-card hover:bg-dark-surface border border-dark-border text-neutral-200 transition-hover"
        >
          Open pharmacist hub
        </Link>
      </div>
    </div>
  );
};
