import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Camera,
  CheckCircle,
  ShieldCheck,
  Warning,
  LockSimple,
  ArrowRight,
  User,
  Pill,
  Check
} from '@phosphor-icons/react';

export const CollectionVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { transactions, currentUser } = useApp();

  const [selectedTxId, setSelectedTxId] = useState<string>(
    searchParams.get('txId') || transactions[0]?.id || 'TX-2026-8801'
  );

  const activeTx = transactions.find(t => t.id === selectedTxId) || transactions[0];

  // Evidence State
  const [patientConsentAgreed, setPatientConsentAgreed] = useState(true);
  const [sealVerified, setSealVerified] = useState(true);
  const [identityVerified, setIdentityVerified] = useState(true);
  const [tabletsCountVerified, setTabletsCountVerified] = useState(true);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(
    activeTx?.evidencePhotoUrl || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=80'
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleSimulateCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setCapturedPhoto('https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80');
      setIsCapturing(false);
    }, 800);
  };

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientConsentAgreed) {
      alert('Patient consent is required to store photographic collection evidence.');
      return;
    }
    setVerificationSuccess(true);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Handover Protocol
            </span>
            <span className="caption-4 text-neutral-400">Step 7 of Safety Workflow</span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Collection Evidence & Handover Verification
          </h1>
          <p className="body-5 text-neutral-400">
            Verify medicines handed over, record consent, and capture secure photographic collection evidence.
          </p>
        </div>

        {/* Transaction Selector */}
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border p-2 rounded-xl">
          <span className="caption-4 text-neutral-400">Transaction:</span>
          <select
            value={selectedTxId}
            onChange={(e) => {
              setSelectedTxId(e.target.value);
              setVerificationSuccess(false);
            }}
            className="bg-dark-base border border-dark-border text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-tealAccent-500 font-mono"
          >
            {transactions.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} • {t.patientName.split(' ')[0]} ({t.newlyDispensedQuantity} units)
              </option>
            ))}
          </select>
        </div>
      </div>

      {verificationSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-300 caption-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={18} weight="bold" />
            <span>Collection evidence and handover attestation successfully associated with #{activeTx.id}.</span>
          </div>
          <Link
            to="/transactions"
            className="caption-3 font-semibold text-white underline"
          >
            View transaction ledger
          </Link>
        </div>
      )}

      {/* TRANSACTION OVERVIEW CARD */}
      <section className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dark-border mb-4">
          <div>
            <span className="caption-4 font-mono text-neutral-400">Transaction #{activeTx.id}</span>
            <h2 className="title-2 text-white font-semibold mt-0.5">{activeTx.medicineName}</h2>
            <div className="caption-3 text-neutral-300 mt-1">
              Patient: <strong className="text-white">{activeTx.patientName}</strong> • Store: {activeTx.pharmacyName}
            </div>
          </div>
          <div className="text-right">
            <span className="caption-5 text-neutral-400 block font-mono">{activeTx.timestamp.split('T')[0]}</span>
            <span className="caption-4 px-2.5 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800 font-semibold">
              Payment Status: {activeTx.paymentStatus} (${activeTx.paymentAmount.toFixed(2)})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center caption-3 text-neutral-300">
          <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
            <span className="caption-5 text-neutral-400 block">Units Dispensed</span>
            <span className="title-3 text-white font-bold">{activeTx.newlyDispensedQuantity}</span>
          </div>
          <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
            <span className="caption-5 text-neutral-400 block">Remaining Claim</span>
            <span className="title-3 text-tealAccent-400 font-bold">{activeTx.remainingQuantity}</span>
          </div>
          <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
            <span className="caption-5 text-neutral-400 block">Payment Method</span>
            <span className="title-4 text-white font-bold capitalize">{activeTx.paymentMethod.replace('_', ' ')}</span>
          </div>
          <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
            <span className="caption-5 text-neutral-400 block">Pharmacist</span>
            <span className="title-4 text-white font-bold truncate">{activeTx.pharmacistName}</span>
          </div>
        </div>
      </section>

      {/* VERIFICATION FORM & PHOTO EVIDENCE CAPTURE */}
      <form onSubmit={handleSaveVerification} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Photo Evidence Capture */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="title-3 text-white font-semibold mb-1 flex items-center gap-2">
              <Camera size={20} className="text-tealAccent-400" />
              <span>Photographic Handover Evidence</span>
            </h3>
            <p className="caption-4 text-neutral-400 mb-4">
              Capture photo of medicine package and prescription label at time of physical handover with patient consent.
            </p>

            {/* Photo Preview Box */}
            <div className="w-full aspect-video rounded-xl bg-dark-base border border-dark-border overflow-hidden relative flex items-center justify-center mb-4">
              {capturedPhoto ? (
                <img
                  src={capturedPhoto}
                  alt="Medicine Handover Evidence"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-neutral-500">
                  <Camera size={36} className="mx-auto mb-1" />
                  <span className="caption-4">No photograph captured yet</span>
                </div>
              )}

              {isCapturing && (
                <div className="absolute inset-0 bg-black/75 flex items-center justify-center caption-3 text-white">
                  Acquiring secure camera image...
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSimulateCapture}
                className="button-sm py-2 px-3 rounded-xl bg-dark-base hover:bg-dark-surface border border-dark-border text-white flex items-center gap-1.5 transition-hover"
              >
                <Camera size={16} />
                <span>Simulate Camera Snapshot</span>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-dark-border flex items-start gap-2 caption-5 text-neutral-400">
            <LockSimple size={16} className="text-tealAccent-400 mt-0.5" />
            <span>
              Photographs are encrypted in transit and at rest. Accessible only for authorized regulatory and clinical audit review.
            </span>
          </div>
        </div>

        {/* Right Column: Handover Checklist */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="title-3 text-white font-semibold mb-1">
              Pharmacist Handover Checklist
            </h3>
            <p className="caption-4 text-neutral-400">
              Confirm physical delivery and mandatory patient safety points
            </p>

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 p-3 rounded-xl bg-dark-base border border-dark-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={identityVerified}
                  onChange={(e) => setIdentityVerified(e.target.checked)}
                  className="mt-1 rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-3 text-neutral-200">
                  Patient legal identity verified against national ID or mobile confirmation code.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-dark-base border border-dark-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={tabletsCountVerified}
                  onChange={(e) => setTabletsCountVerified(e.target.checked)}
                  className="mt-1 rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-3 text-neutral-200">
                  Exact quantity of {activeTx.newlyDispensedQuantity} tablets verified and sealed in child resistant safety packaging.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-dark-base border border-dark-border cursor-pointer">
                <input
                  type="checkbox"
                  checked={sealVerified}
                  onChange={(e) => setSealVerified(e.target.checked)}
                  className="mt-1 rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-3 text-neutral-200">
                  Full dosage instructions and daily intake schedule verbally reviewed with patient.
                </span>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl bg-dark-base border border-tealAccent-800/80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={patientConsentAgreed}
                  onChange={(e) => setPatientConsentAgreed(e.target.checked)}
                  className="mt-1 rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-3 text-tealAccent-200">
                  Patient explicit consent obtained to store collection verification photograph and associate it with transaction record.
                </span>
              </label>
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              className="w-full button-md py-2.5 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center justify-center gap-2 transition-hover shadow-lg"
            >
              <CheckCircle size={18} weight="bold" />
              <span>Confirm Handover & Save Evidence</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
