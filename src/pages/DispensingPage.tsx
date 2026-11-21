import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Pill,
  ShieldCheck,
  Warning,
  CheckCircle,
  CurrencyDollar,
  Camera,
  Buildings,
  User,
  ArrowRight,
  Clock,
  FirstAid
} from '@phosphor-icons/react';

export const DispensingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    currentUser,
    prescriptions,
    transactions,
    activePharmacyName,
    checkEarlyRefill,
    recordDispense
  } = useApp();

  const selectedRxId = searchParams.get('prescriptionId') || 'RX-2026-9041';
  const [activeRxId, setActiveRxId] = useState(selectedRxId);
  const currentRx = prescriptions.find(p => p.id === activeRxId) || prescriptions[0];

  // Calculate previously dispensed quantity for this prescription
  const previousTxList = transactions.filter(
    t => t.prescriptionId === currentRx.id && t.status === 'completed'
  );
  const previouslyDispensedQuantity = previousTxList.reduce(
    (sum, t) => sum + t.newlyDispensedQuantity,
    0
  );
  const totalPrescribed = currentRx.totalQuantityPrescribed;
  const maxAllowableRemaining = Math.max(0, totalPrescribed - previouslyDispensedQuantity);

  // Dispensing state
  const [dispenseQuantity, setDispenseQuantity] = useState<number>(
    maxAllowableRemaining > 0 ? (maxAllowableRemaining === 15 ? 15 : maxAllowableRemaining) : 5
  );
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'cash' | 'insurance' | 'digital_wallet'>('credit_card');
  const [patientConsentConfirmed, setPatientConsentConfirmed] = useState(true);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [overrideWarning, setOverrideWarning] = useState(false);

  const [dispenseError, setDispenseError] = useState('');
  const [dispenseSuccess, setDispenseSuccess] = useState<any>(null);

  // Update quantity whenever active prescription changes
  useEffect(() => {
    const rx = prescriptions.find(p => p.id === activeRxId);
    if (rx) {
      const prev = transactions
        .filter(t => t.prescriptionId === rx.id && t.status === 'completed')
        .reduce((sum, t) => sum + t.newlyDispensedQuantity, 0);
      const rem = Math.max(0, rx.totalQuantityPrescribed - prev);
      setDispenseQuantity(rem > 0 ? (rem === 15 ? 15 : rem) : 1);
    }
  }, [activeRxId, prescriptions, transactions]);

  // Check early refill status dynamically
  const earlyRefillCheck = checkEarlyRefill(currentRx, dispenseQuantity, activePharmacyName);

  // Remaining quantity after this prospective dispense
  const projectedRemaining = Math.max(0, maxAllowableRemaining - dispenseQuantity);
  const pricePerUnit = 1.60;
  const estimatedCost = (dispenseQuantity * pricePerUnit).toFixed(2);

  const handleDispenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDispenseError('');
    setDispenseSuccess(null);

    if (dispenseQuantity <= 0) {
      setDispenseError('Dispensing quantity must be at least 1 unit.');
      return;
    }

    if (!patientConsentConfirmed) {
      setDispenseError('Patient collection and privacy consent confirmation is mandatory.');
      return;
    }

    if (earlyRefillCheck.isEarly && !overrideWarning) {
      setDispenseError(
        `EARLY REFILL WARNING ACTIVE: Patient returns after only ${earlyRefillCheck.details.daysSinceLast} days of a ${currentRx.treatmentDurationDays} day supply. Review clinical records or consult prescribing doctor before overriding.`
      );
      return;
    }

    const result = recordDispense({
      prescriptionId: currentRx.id,
      patientId: currentRx.patientId,
      newlyDispensedQuantity: dispenseQuantity,
      paymentAmount: Number(estimatedCost),
      paymentMethod,
      consentConfirmed: patientConsentConfirmed,
      notes: clinicalNotes,
      overrideEarlyRefillWarning: overrideWarning
    });

    if (result.success && result.transaction) {
      setDispenseSuccess(result.transaction);
    } else {
      setDispenseError(result.error || 'Failed to complete dispensing transaction.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-6xl mx-auto w-full">
      {/* Top Header */}
      <div className="pb-6 border-b border-dark-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Core Dispensing Engine
            </span>
            <span className="caption-4 text-neutral-400">Step 6 & 7 of Safety Workflow</span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Medicine Dispensing & Collection
          </h1>
          <p className="body-5 text-neutral-400">
            Dispensing location: <strong className="text-tealAccent-400">{activePharmacyName}</strong> • Confirmed by: {currentUser.name}
          </p>
        </div>

        {/* Prescription Selector */}
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border p-2 rounded-xl">
          <span className="caption-4 text-neutral-400">Active script:</span>
          <select
            value={activeRxId}
            onChange={(e) => {
              setActiveRxId(e.target.value);
              setDispenseSuccess(null);
              setDispenseError('');
            }}
            className="bg-dark-base border border-dark-border text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-tealAccent-500 font-mono"
          >
            {prescriptions.map((rx) => (
              <option key={rx.id} value={rx.id}>
                {rx.id} • {rx.patientName.split(' ')[0]} ({rx.medicineName.substring(0, 20)}...)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* IMPORTANT REMINDER: COLLECTION VS CONSUMPTION */}
      <aside aria-label="Clinical safety reminder" className="mb-6 p-4 rounded-xl bg-dark-card border border-dark-border flex items-start gap-3">
        <ShieldCheck size={20} className="text-tealAccent-400 mt-0.5" />
        <div className="caption-3 text-neutral-300">
          <strong className="text-white">Clinical Safety Distinction:</strong> A recorded dispensing transaction confirms that tablets were handed over to the patient at the pharmacy. It does not verify that the patient actually swallowed or consumed the medicine.
        </div>
      </aside>

      {/* EARLY REFILL ALERT BANNER (IF ACTIVE) */}
      {earlyRefillCheck.isEarly && (
        <section
          aria-label="Early refill detection banner"
          className="mb-8 p-6 rounded-2xl bg-alertWarn-bg border-2 border-alertWarn-border shadow-2xl transition-base"
        >
          <div className="flex items-start gap-3 mb-4">
            <Warning size={28} className="text-alertWarn-text mt-0.5" />
            <div>
              <div className="title-2 text-alertWarn-text font-bold">
                EARLY REFILL WARNING DETECTED
              </div>
              <p className="body-4 text-neutral-200 mt-1">
                The prescription was originally intended for {currentRx.treatmentDurationDays} days, but the patient has returned after only {earlyRefillCheck.details.daysSinceLast} days.
              </p>
              <div className="caption-3 text-neutral-300 mt-2 font-mono space-y-1">
                <div>• Previously Dispensed: {earlyRefillCheck.details.totalDispensedSoFar} units at {earlyRefillCheck.details.previousPharmacy}</div>
                <div>• Apparent Consumption Rate: <strong className="text-alertWarn-text">{earlyRefillCheck.details.apparentUsageRate} tablets per day</strong> (prescribed {currentRx.dailyDosageUnits} daily)</div>
                <div>• Unaccounted Days of Supply: {earlyRefillCheck.details.daysEarly} days remaining</div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-alertWarn-border">
            <Link
              to={`/intervention?patientId=${currentRx.patientId}&alertId=ALT-2026-001`}
              className="button-sm py-2 px-3 rounded-lg bg-alertWarn-badge hover:bg-yellow-500 text-black font-semibold flex items-center gap-1.5 transition-hover"
            >
              <FirstAid size={16} weight="bold" />
              <span>Open Pharmacist Clinical Review</span>
            </Link>

            <label className="flex items-center gap-2 caption-4 text-neutral-300 cursor-pointer ml-auto">
              <input
                type="checkbox"
                checked={overrideWarning}
                onChange={(e) => setOverrideWarning(e.target.checked)}
                className="rounded bg-dark-card border-alertWarn-border text-yellow-600 focus:ring-yellow-500"
              />
              <span>Pharmacist Clinical Override (Documented emergency exception)</span>
            </label>
          </div>
        </section>
      )}

      {/* SUCCESS CONFIRMATION PANEL */}
      {dispenseSuccess && (
        <section className="mb-8 p-6 rounded-2xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-200 shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={28} className="text-tealAccent-400" />
            <div className="title-2 text-white font-bold">
              Dispensing Transaction Successfully Recorded
            </div>
          </div>
          <p className="body-5 text-tealAccent-300 mb-4">
            Receipt #{dispenseSuccess.id} created. Inventory and central patient ledger synchronized across participating pharmacies.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-dark-bg/60 p-4 rounded-xl border border-tealAccent-900 font-mono text-xs mb-4">
            <div>
              <span className="text-neutral-400 block">Dispensed Units:</span>
              <span className="text-white font-bold text-sm">{dispenseSuccess.newlyDispensedQuantity}</span>
            </div>
            <div>
              <span className="text-neutral-400 block">Remaining Claim Balance:</span>
              <span className="text-white font-bold text-sm">{dispenseSuccess.remainingQuantity}</span>
            </div>
            <div>
              <span className="text-neutral-400 block">Payment Collected:</span>
              <span className="text-white font-bold text-sm">${dispenseSuccess.paymentAmount.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-neutral-400 block">Dispensed Store:</span>
              <span className="text-white font-bold text-sm truncate">{dispenseSuccess.pharmacyName}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/collection-verification"
              className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-1.5 transition-hover"
            >
              <Camera size={16} />
              <span>Capture Photo Evidence of Handover</span>
            </Link>
            <Link
              to="/transactions"
              className="caption-3 py-2 px-3 rounded-lg bg-dark-card border border-tealAccent-800 text-neutral-200 hover:text-white transition-hover"
            >
              View ledger entry
            </Link>
          </div>
        </section>
      )}

      {/* ERROR NOTICE */}
      {dispenseError && (
        <div className="mb-6 p-4 rounded-xl bg-alertCritical-bg border border-alertCritical-border text-alertCritical-text caption-2">
          {dispenseError}
        </div>
      )}

      {/* DISPENSING FORM AND CALCULATION ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Prescription & Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Prescription Summary Card */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-dark-border mb-4">
              <div>
                <span className="caption-4 text-neutral-400 font-mono">ID: {currentRx.id}</span>
                <h2 className="title-2 text-white font-semibold mt-0.5">{currentRx.medicineName}</h2>
                <div className="caption-3 text-neutral-300 mt-1">
                  Patient: <strong className="text-white">{currentRx.patientName}</strong> ({currentRx.patientMobile})
                </div>
              </div>
              <span className="caption-4 px-2.5 py-1 rounded bg-dark-base border border-dark-border text-tealAccent-400 font-semibold font-mono">
                {currentRx.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 caption-2 text-neutral-300">
              <div>
                <span className="caption-5 text-neutral-400 block">Dosage Instructions</span>
                <span className="text-white font-medium">{currentRx.dosageInstruction}</span>
              </div>
              <div>
                <span className="caption-5 text-neutral-400 block">Prescribing Physician</span>
                <span className="text-white font-medium">{currentRx.doctorName} ({currentRx.clinicName})</span>
              </div>
            </div>

            {/* Crucial Dispensing Calculation Bar */}
            <div className="mt-6 pt-4 border-t border-dark-border grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
                <span className="caption-5 text-neutral-400 block">1. Total Prescribed</span>
                <span className="title-3 text-white font-bold">{totalPrescribed}</span>
              </div>
              <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
                <span className="caption-5 text-neutral-400 block">2. Previously Dispensed</span>
                <span className="title-3 text-tealAccent-400 font-bold">{previouslyDispensedQuantity}</span>
              </div>
              <div className="p-3 bg-dark-base rounded-xl border border-tealAccent-700">
                <span className="caption-5 text-tealAccent-300 block font-semibold">3. Newly Dispensing</span>
                <span className="title-3 text-tealAccent-300 font-bold">{dispenseQuantity}</span>
              </div>
              <div className="p-3 bg-dark-base rounded-xl border border-dark-border">
                <span className="caption-5 text-neutral-400 block">4. Remaining Balance</span>
                <span className="title-3 text-white font-bold">{projectedRemaining}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleDispenseSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-5">
            <h3 className="title-3 text-white font-semibold">
              Dispensing Transaction Parameters
            </h3>

            {/* Quantity Slider and Stepper for Partial or Complete Dispensing */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="caption-3 text-neutral-300">
                  Select Dispensing Quantity (Units to Hand Over Today)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDispenseQuantity(5)}
                    className="caption-5 px-2 py-0.5 rounded bg-dark-base border border-dark-border hover:border-tealAccent-500 text-tealAccent-300 transition-hover"
                  >
                    Partial: 5 units
                  </button>
                  <button
                    type="button"
                    onClick={() => setDispenseQuantity(maxAllowableRemaining)}
                    className="caption-5 px-2 py-0.5 rounded bg-dark-base border border-dark-border hover:border-tealAccent-500 text-tealAccent-300 transition-hover"
                  >
                    Full Balance: {maxAllowableRemaining} units
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max={Math.max(1, maxAllowableRemaining || 15)}
                  value={dispenseQuantity}
                  onChange={(e) => setDispenseQuantity(Number(e.target.value))}
                  className="flex-1 accent-tealAccent-500 cursor-pointer"
                />
                <input
                  type="number"
                  min="1"
                  max={Math.max(1, maxAllowableRemaining || 15)}
                  value={dispenseQuantity}
                  onChange={(e) => setDispenseQuantity(Number(e.target.value))}
                  className="w-20 bg-dark-base border border-dark-border rounded-lg px-3 py-1.5 text-center text-white body-4 font-mono focus:outline-none focus:border-tealAccent-500"
                />
              </div>
              <div className="caption-5 text-neutral-400 mt-1">
                {dispenseQuantity < maxAllowableRemaining ? (
                  <span className="text-tealAccent-400 font-semibold">
                    Partial collection selected. {projectedRemaining} units will remain available in patient claim balance.
                  </span>
                ) : (
                  <span>Full remaining quantity will be fulfilled.</span>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="caption-3 text-neutral-300 block mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                >
                  <option value="credit_card">Credit / Debit Card</option>
                  <option value="digital_wallet">Digital Wallet (Apple/Google Pay)</option>
                  <option value="insurance">Direct Health Insurance Billing</option>
                  <option value="cash">Verified Cash Payment</option>
                </select>
              </div>

              <div>
                <label className="caption-3 text-neutral-300 block mb-1.5">
                  Amount Due
                </label>
                <div className="bg-dark-base border border-dark-border rounded-xl px-4 py-2 text-white font-mono body-4 flex items-center justify-between">
                  <span>${estimatedCost}</span>
                  <span className="caption-5 text-neutral-400">(${pricePerUnit}/unit)</span>
                </div>
              </div>
            </div>

            {/* Pharmacist Notes */}
            <div>
              <label className="caption-3 text-neutral-300 block mb-1.5">
                Pharmacist Dispensing Notes & Patient Dialogue
              </label>
              <textarea
                rows={2}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Note patient questions, verified identification, or counseling given..."
                className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
              />
            </div>

            {/* Consent & Confirmation Checklist */}
            <div className="bg-dark-base border border-dark-border rounded-xl p-4 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={patientConsentConfirmed}
                  onChange={(e) => setPatientConsentConfirmed(e.target.checked)}
                  className="mt-1 rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-4 text-neutral-200">
                  I have confirmed the patient identity, verified active consent for central safety tracking, and packaged the exact requested unit count.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={earlyRefillCheck.isEarly && !overrideWarning}
                className={`w-full button-md py-2.5 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-hover ${
                  earlyRefillCheck.isEarly && !overrideWarning
                    ? 'bg-alertWarn-border text-alertWarn-text cursor-not-allowed'
                    : 'bg-tealAccent-600 hover:bg-tealAccent-500 text-white shadow-lg'
                }`}
              >
                <CheckCircle size={18} weight="bold" />
                <span>Authorize Dispense and Record Transaction</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Previous Dispensing History for this Rx */}
        <div className="space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h3 className="title-3 text-white font-semibold mb-1">
              Previous Dispensing History
            </h3>
            <p className="caption-4 text-neutral-400 mb-4">
              All multi store visits recorded for {currentRx.id}
            </p>

            {previousTxList.length === 0 ? (
              <div className="p-4 rounded-xl bg-dark-base border border-dark-border text-center caption-4 text-neutral-400">
                No previous collections recorded. This is visit number one.
              </div>
            ) : (
              <div className="space-y-3">
                {previousTxList.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3 rounded-xl bg-dark-base border border-dark-border space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="caption-3 font-semibold text-white">
                        {tx.newlyDispensedQuantity} Units Handed Over
                      </span>
                      <span className="caption-5 font-mono text-neutral-400">
                        {tx.timestamp.split('T')[0]}
                      </span>
                    </div>
                    <div className="caption-4 text-neutral-300">
                      Store: {tx.pharmacyName}
                    </div>
                    <div className="caption-5 text-neutral-400 font-mono">
                      Pharmacist: {tx.pharmacistName} • Remaining after: {tx.remainingQuantity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick links to partial collection and intervention */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-3">
            <div className="title-4 text-white font-semibold">Related Safety Protocols</div>
            <Link
              to="/partial-collection"
              className="w-full button-sm py-2 px-3 rounded-xl bg-dark-base hover:bg-dark-surface border border-dark-border text-neutral-200 flex items-center justify-between transition-hover"
            >
              <span>Partial Collection Manager</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/collection-verification"
              className="w-full button-sm py-2 px-3 rounded-xl bg-dark-base hover:bg-dark-surface border border-dark-border text-neutral-200 flex items-center justify-between transition-hover"
            >
              <span>Photo Evidence Verification</span>
              <Camera size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
