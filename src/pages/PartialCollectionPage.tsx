import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Pill,
  CheckCircle,
  Clock,
  Buildings,
  ArrowRight,
  ShieldCheck,
  User,
  Plus
} from '@phosphor-icons/react';

export const PartialCollectionPage: React.FC = () => {
  const {
    prescriptions,
    transactions,
    recordDispense,
    activePharmacyName
  } = useApp();

  // Find Marcus Chen's prescription (Demo Scenario 2)
  const partialRx = prescriptions.find(p => p.patientId === 'PT-5109-02') || prescriptions[1];

  // Get all completed transactions for this prescription
  const rxTransactions = transactions.filter(
    t => t.prescriptionId === partialRx.id && t.status === 'completed'
  );

  const totalPrescribed = partialRx.totalQuantityPrescribed; // 15
  const totalCollectedSoFar = rxTransactions.reduce((sum, t) => sum + t.newlyDispensedQuantity, 0); // 5
  const remainingQuantity = Math.max(0, totalPrescribed - totalCollectedSoFar); // 10

  const [collectAmount, setCollectAmount] = useState<number>(Math.min(5, remainingQuantity));
  const [collectionSuccess, setCollectionSuccess] = useState('');
  const [collectionError, setCollectionError] = useState('');

  const handleDispenseNextPart = (e: React.FormEvent) => {
    e.preventDefault();
    setCollectionError('');
    setCollectionSuccess('');

    if (collectAmount <= 0) {
      setCollectionError('Quantity must be greater than 0.');
      return;
    }

    if (collectAmount > remainingQuantity) {
      setCollectionError(`Cannot collect ${collectAmount} units. Maximum remaining balance is ${remainingQuantity}.`);
      return;
    }

    const res = recordDispense({
      prescriptionId: partialRx.id,
      patientId: partialRx.patientId,
      newlyDispensedQuantity: collectAmount,
      paymentAmount: collectAmount * 1.5,
      paymentMethod: 'credit_card',
      consentConfirmed: true,
      notes: `Partial collection installment fulfilled at ${activePharmacyName}.`
    });

    if (res.success) {
      setCollectionSuccess(`Successfully dispensed ${collectAmount} tablets. Remaining claim balance updated.`);
      setCollectAmount(Math.min(5, remainingQuantity - collectAmount));
    } else {
      setCollectionError(res.error || 'Dispense failed.');
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8">
        <div className="flex items-center gap-2">
          <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
            Multi Visit Staging
          </span>
          <span className="caption-4 text-neutral-400">Demonstration Scenario 2</span>
        </div>
        <h1 className="heading-4 text-white font-semibold mt-1">
          Partial Collection Management
        </h1>
        <p className="body-5 text-neutral-400">
          Enables patients to collect medicines in convenient installments while maintaining precise cross pharmacy remaining balances.
        </p>
      </div>

      {collectionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-300 caption-2 flex items-center gap-2">
          <CheckCircle size={18} weight="bold" />
          <span>{collectionSuccess}</span>
        </div>
      )}

      {collectionError && (
        <div className="mb-6 p-4 rounded-xl bg-alertCritical-bg border border-alertCritical-border text-alertCritical-text caption-2">
          {collectionError}
        </div>
      )}

      {/* DEMONSTRATION SCENARIO 2 CARD */}
      <section className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dark-border mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
                Active Staged Prescription
              </span>
              <span className="caption-5 font-mono text-neutral-400">{partialRx.id}</span>
            </div>
            <h2 className="title-1 text-white font-semibold">{partialRx.medicineName}</h2>
            <div className="caption-2 text-neutral-300 mt-1">
              Patient: <strong className="text-white">{partialRx.patientName}</strong> • Prescribed by {partialRx.doctorName}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="caption-4 text-neutral-400">Current store:</span>
            <span className="caption-3 px-2.5 py-1 rounded bg-dark-base border border-dark-border text-tealAccent-400 font-semibold">
              {activePharmacyName}
            </span>
          </div>
        </div>

        {/* MATH ENGINE CARDS FOR SCENARIO 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-base border border-dark-border rounded-xl p-5 text-center">
            <span className="caption-4 text-neutral-400 block mb-1">Total Doctor Prescribed</span>
            <span className="heading-3 text-white font-bold">{totalPrescribed}</span>
            <span className="caption-5 text-neutral-400 block mt-1">Tablets authorized for 15 days</span>
          </div>

          <div className="bg-dark-base border border-dark-border rounded-xl p-5 text-center">
            <span className="caption-4 text-neutral-400 block mb-1">Total Dispensed To Date</span>
            <span className="heading-3 text-tealAccent-400 font-bold">{totalCollectedSoFar}</span>
            <span className="caption-5 text-neutral-400 block mt-1">Tablets collected across visits</span>
          </div>

          <div className="bg-dark-base border border-tealAccent-700/60 rounded-xl p-5 text-center">
            <span className="caption-4 text-tealAccent-300 block mb-1 font-semibold">Remaining Claim Balance</span>
            <span className="heading-3 text-white font-bold">{remainingQuantity}</span>
            <span className="caption-5 text-neutral-400 block mt-1">Available for future collection</span>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-6">
          <div className="flex items-center justify-between caption-4 text-neutral-400 mb-2">
            <span>Prescription Fulfillment Progress</span>
            <span className="font-mono text-white">
              {Math.round((totalCollectedSoFar / totalPrescribed) * 100)}% Fulfilled
            </span>
          </div>
          <div className="w-full h-3 bg-dark-base rounded-full overflow-hidden border border-dark-border">
            <div
              className="h-full bg-tealAccent-500 transition-all duration-500"
              style={{ width: `${(totalCollectedSoFar / totalPrescribed) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* NEXT PARTIAL COLLECTION DISPENSER */}
        {remainingQuantity > 0 ? (
          <form onSubmit={handleDispenseNextPart} className="bg-dark-base border border-dark-border rounded-xl p-5">
            <h3 className="title-3 text-white font-semibold mb-2">
              Dispense Next Partial Installment
            </h3>
            <p className="caption-4 text-neutral-400 mb-4">
              Patient is presenting at {activePharmacyName} to collect additional tablets from the remaining {remainingQuantity} balance.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="caption-3 text-neutral-300 whitespace-nowrap">Units to Collect:</label>
                <input
                  type="number"
                  min="1"
                  max={remainingQuantity}
                  value={collectAmount}
                  onChange={(e) => setCollectAmount(Number(e.target.value))}
                  className="w-24 bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-center text-white body-4 font-mono focus:outline-none focus:border-tealAccent-500"
                />
              </div>

              <div className="caption-4 text-neutral-400">
                Remaining after this collection: <strong className="text-white">{Math.max(0, remainingQuantity - collectAmount)}</strong> units
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto sm:ml-auto button-sm py-2 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center justify-center gap-2 transition-hover shadow-md"
              >
                <Plus size={16} weight="bold" />
                <span>Dispense {collectAmount} Tablets</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-xl bg-tealAccent-950/60 border border-tealAccent-800 text-tealAccent-300 caption-2 text-center">
            All 15 units of this prescription have been fully collected. Prescription status is marked completed.
          </div>
        )}
      </section>

      {/* COLLECTION STAGE HISTORY */}
      <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h3 className="title-3 text-white font-semibold mb-1">
          Installment Collection Timeline
        </h3>
        <p className="caption-4 text-neutral-400 mb-4">
          Verified audit record of each collection visit across participating pharmacies
        </p>

        <div className="space-y-3">
          {rxTransactions.map((tx, idx) => (
            <div
              key={tx.id}
              className="bg-dark-base border border-dark-border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-tealAccent-400 mt-0.5">
                  <span className="caption-3 font-bold font-mono">#{idx + 1}</span>
                </div>
                <div>
                  <div className="caption-2 text-white font-semibold">
                    Collected {tx.newlyDispensedQuantity} Tablets
                  </div>
                  <div className="caption-4 text-neutral-300">
                    Location: <strong className="text-white">{tx.pharmacyName}</strong>
                  </div>
                  <div className="caption-5 text-neutral-400 font-mono mt-0.5">
                    Pharmacist: {tx.pharmacistName} • Transaction ID: {tx.id}
                  </div>
                </div>
              </div>

              <div className="text-right sm:self-center">
                <span className="caption-5 text-neutral-400 block font-mono">
                  {tx.timestamp.split('T')[0]}
                </span>
                <span className="caption-5 text-tealAccent-400 font-mono">
                  Remaining After: {tx.remainingQuantity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
