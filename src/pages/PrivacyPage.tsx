import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LockSimple, CheckCircle, ArrowLeft } from '@phosphor-icons/react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-12 px-4 max-w-4xl mx-auto w-full">
      <Link to="/" className="inline-flex items-center gap-1.5 caption-3 text-tealAccent-400 hover:underline mb-6">
        <ArrowLeft size={16} />
        <span>Return to home</span>
      </Link>

      <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-xl">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck size={28} className="text-tealAccent-400" />
          <h1 className="heading-4 text-white font-semibold">
            Privacy Policy and Patient Data Governance
          </h1>
        </div>
        <p className="caption-3 text-neutral-400 mb-8 font-mono">
          Last revised: November 2026 • AegisRx Clinical Network
        </p>

        <div className="space-y-6 body-5 text-neutral-300">
          <section>
            <h2 className="title-3 text-white font-semibold mb-2">1. Patient Consent and Identification</h2>
            <p>
              AegisRx operates exclusively on explicit patient consent. Patient profiles are identified across participating medical stores using unique cryptographic tokens and verified mobile numbers. No medical records are made accessible to non participating or unauthorized parties.
            </p>
          </section>

          <section>
            <h2 className="title-3 text-white font-semibold mb-2">2. Purpose of Cross Pharmacy Data Sharing</h2>
            <p>
              The sole purpose of synchronizing dispensing records is to prevent accidental adverse drug interactions, calculate accurate remaining prescription balances, and identify unusually early refill requests before excessive consumption leads to physiological harm.
            </p>
          </section>

          <section>
            <h2 className="title-3 text-white font-semibold mb-2">3. Non Punitive Patient Protection</h2>
            <p>
              Data collected by the platform is clinical and protective. It is never used for automated punitive blocking, criminalization, or insurance denial. Dispensing indicators represent packaged units delivered and are never confused with confirmed biological consumption.
            </p>
          </section>

          <section>
            <h2 className="title-3 text-white font-semibold mb-2">4. Photographic Handover Evidence Security</h2>
            <p>
              Photographs captured by pharmacists during physical handover are encrypted using AES 256 standards. Evidence is accessible strictly to authorized clinical auditors and the prescribing physician upon legitimate regulatory review.
            </p>
          </section>

          <section>
            <h2 className="title-3 text-white font-semibold mb-2">5. Patient Access and Correction Rights</h2>
            <p>
              Patients retain the right to inspect their complete cross store dispensing ledger through the Patient Portal, request corrections to erroneous records, and withdraw consent for network synchronization at any time.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
