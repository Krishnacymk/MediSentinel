import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, ArrowLeft } from '@phosphor-icons/react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-12 px-4 max-w-4xl mx-auto w-full">
      <Link to="/" className="inline-flex items-center gap-1.5 caption-3 text-tealAccent-400 hover:underline mb-6">
        <ArrowLeft size={16} />
        <span>Return to home</span>
      </Link>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={28} className="text-tealAccent-400" />
          <h1 className="heading-4 text-white font-semibold">
            Terms of Clinical Network Participation
          </h1>
        </div>
        <p className="caption-3 text-neutral-400 mb-8 font-mono">
          Clinical Guidance Standards • Effective November 2026
        </p>

        <div className="space-y-6 body-5 text-neutral-300">
          <section>
            <h2 className="title-3 text-white font-semibold mb-2">1. Clinical Decision Support Role</h2>
            <p>
              AegisRx is a healthcare software support platform designed to provide pharmacists and physicians with timely data. The software does not provide medical diagnoses, replace clinical judgment, or mandate treatment decisions. Final clinical actions remain the sole professional responsibility of licensed healthcare practitioners.
            </p>
          </section>

          <section>
            <h2 className="title-3 text-white font-semibold mb-2">2. Dispensing Versus Consumption Disclaimer</h2>
            <p>
              Participating pharmacies acknowledge that dispensing records indicate medicines handed over to patients. The system does not confirm whether a patient ingested, stored, lost, or shared the medication. Alerts reflect statistical discrepancies and require human review.
            </p>
          </section>

          <section>
            <h2 className="title-3 text-white font-semibold mb-2">3. Mandatory Pharmacist Verification</h2>
            <p>
              All automated optical character recognition (OCR) and electronic prescription extractions must be independently verified and confirmed by a licensed pharmacist prior to dispensing.
            </p>
          </section>

          <section>
            <h2 className="title-3 text-white font-semibold mb-2">4. Emergency Clinical Overrides</h2>
            <p>
              In scenarios involving acute clinical emergencies or documented doctor authorizations, pharmacists possess the authority to execute clinical overrides, provided appropriate notes and justifications are permanently recorded in the audit log.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
