import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heartbeat, FirstAid, LockSimple } from '@phosphor-icons/react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-base border-t border-dark-border text-neutral-400 py-12 px-4 mt-20 transition-base">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Col */}
        <div className="md:col-span-1 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-tealAccent-400">
              <ShieldCheck size={18} weight="bold" />
            </div>
            <span className="title-2 font-bold text-white tracking-tight">AegisRx</span>
          </div>
          <p className="body-6 text-neutral-400">
            A medicine safety and prescription monitoring platform connecting patients, pharmacists, and physicians to prevent overconsumption through early alerts.
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-tealAccent-500"></span>
            <span className="caption-4 text-neutral-300">Operational network active</span>
          </div>
        </div>

        {/* Roles & Portals */}
        <div className="flex flex-col gap-2.5">
          <span className="caption-3 uppercase tracking-wider text-neutral-200">Portals</span>
          <Link to="/pharmacist-dashboard" className="body-5 hover:text-white transition-hover">
            Pharmacist workspace
          </Link>
          <Link to="/doctor-dashboard" className="body-5 hover:text-white transition-hover">
            Doctor referral center
          </Link>
          <Link to="/patient-dashboard" className="body-5 hover:text-white transition-hover">
            Patient safety dashboard
          </Link>
          <Link to="/admin" className="body-5 hover:text-white transition-hover">
            System administration
          </Link>
        </div>

        {/* Clinical Workflows */}
        <div className="flex flex-col gap-2.5">
          <span className="caption-3 uppercase tracking-wider text-neutral-200">Workflows</span>
          <Link to="/prescription-scan" className="body-5 hover:text-white transition-hover">
            Prescription verification
          </Link>
          <Link to="/dispense" className="body-5 hover:text-white transition-hover">
            Dispensing engine
          </Link>
          <Link to="/partial-collection" className="body-5 hover:text-white transition-hover">
            Partial collection manager
          </Link>
          <Link to="/early-refill-alerts" className="body-5 hover:text-white transition-hover">
            Early refill detector
          </Link>
          <Link to="/intervention" className="body-5 hover:text-white transition-hover">
            Clinical intervention records
          </Link>
        </div>

        {/* Governance & Privacy */}
        <div className="flex flex-col gap-2.5">
          <span className="caption-3 uppercase tracking-wider text-neutral-200">Compliance</span>
          <div className="flex items-center gap-1.5 caption-2 text-neutral-300">
            <LockSimple size={14} className="text-tealAccent-400" />
            <span>Role based access protection</span>
          </div>
          <p className="caption-5 text-neutral-400">
            Dispensing records indicate units delivered to patients and do not verify individual ingestion rates.
          </p>
          <div className="pt-2 flex flex-col gap-1.5">
            <Link to="/privacy" className="caption-2 hover:text-white transition-hover">
              Privacy policy and data governance
            </Link>
            <Link to="/terms" className="caption-2 hover:text-white transition-hover">
              Terms of clinical participation
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="caption-5 text-neutral-400">
          © 2026 AegisRx Platform. Fictional medical demonstration prototype. Not for direct diagnosis.
        </p>
        <div className="flex items-center gap-4 caption-4">
          <Link to="/privacy" className="hover:text-white transition-hover">Privacy</Link>
          <Link to="/terms" className="hover:text-white transition-hover">Terms</Link>
          <span className="text-dark-border">•</span>
          <span className="text-neutral-400">Version 2.4.0</span>
        </div>
      </div>
    </footer>
  );
};
