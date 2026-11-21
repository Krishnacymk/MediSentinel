import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Buildings,
  ShieldCheck,
  Warning,
  Pill,
  User,
  MagnifyingGlass,
  CheckCircle,
  LockSimple
} from '@phosphor-icons/react';

export const PatientHistoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { patients, transactions, prescriptions, alerts } = useApp();

  const selectedPatientId = searchParams.get('patientId') || 'PT-8942-01';
  const [activePatientId, setActivePatientId] = useState(selectedPatientId);

  const activePatient = patients.find(p => p.id === activePatientId) || patients[0];
  const patientTx = transactions.filter(t => t.patientId === activePatient.id);
  const patientRx = prescriptions.filter(p => p.patientId === activePatient.id);
  const patientAlerts = alerts.filter(a => a.patientId === activePatient.id);

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Cross Pharmacy Unified History
            </span>
            <span className="caption-4 text-neutral-400 font-mono">ID: {activePatient.id}</span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Patient Medicine & Dispensing History
          </h1>
          <p className="body-5 text-neutral-400">
            Secure, centralized record of all medicine collections across participating medical stores and health networks.
          </p>
        </div>

        {/* Patient Switcher */}
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border p-2 rounded-xl">
          <span className="caption-4 text-neutral-400">Patient:</span>
          <select
            value={activePatientId}
            onChange={(e) => setActivePatientId(e.target.value)}
            className="bg-dark-base border border-dark-border text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-tealAccent-500 font-mono"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PATIENT PROFILE CARD & CONSENT STATUS */}
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dark-border mb-4">
          <div>
            <div className="title-2 text-white font-semibold">{activePatient.name}</div>
            <div className="caption-4 text-neutral-300 mt-0.5">
              Mobile: {activePatient.mobile} • DOB: {activePatient.dob} • Emergency Contact: {activePatient.emergencyContact}
            </div>
            <div className="caption-4 text-neutral-400 mt-1">{activePatient.address}</div>
          </div>

          <div className="flex items-center gap-2">
            <span className="caption-4 px-3 py-1 rounded-full bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800 font-semibold flex items-center gap-1.5">
              <ShieldCheck size={16} />
              <span>Cross Pharmacy Consent Verified</span>
            </span>
          </div>
        </div>

        <p className="caption-3 text-neutral-300">
          <strong>Clinical Chart Note:</strong> {activePatient.notes}
        </p>
      </div>

      {/* EARLY WARNING ALERT BANNER IF ACTIVE */}
      {patientAlerts.length > 0 && (
        <section className="mb-8 p-5 rounded-2xl bg-alertWarn-bg border border-alertWarn-border">
          <div className="flex items-start gap-3">
            <Warning size={22} className="text-alertWarn-text mt-0.5" />
            <div>
              <div className="title-4 text-alertWarn-text font-bold">
                Active Early Refill Warning Flagged in Network
              </div>
              <p className="caption-3 text-neutral-200 mt-0.5">
                Patient returned on Day 4 for Example Medicine A after collecting 15 days of supply at Store A. Review required before dispensing.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* TIMELINE OF CROSS PHARMACY PURCHASES */}
      <section className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8">
        <h2 className="title-2 text-white font-semibold mb-1">
          Chronological Cross Store Dispensing Ledger
        </h2>
        <p className="caption-4 text-neutral-400 mb-6">
          Every collection transaction across all participating pharmacies is timestamped and verifiable
        </p>

        {patientTx.length === 0 ? (
          <div className="p-6 rounded-xl bg-dark-base border border-dark-border text-center caption-3 text-neutral-400">
            No dispensing transactions recorded yet for this patient profile.
          </div>
        ) : (
          <div className="space-y-4">
            {patientTx.map((tx) => (
              <div
                key={tx.id}
                className="bg-dark-base border border-dark-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-tealAccent-400 mt-0.5">
                    <Buildings size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="title-4 text-white font-semibold">{tx.medicineName}</span>
                      <span className="caption-5 font-mono text-neutral-400">{tx.id}</span>
                      <span className="caption-5 px-2 py-0.2 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
                        {tx.status}
                      </span>
                    </div>
                    <div className="caption-3 text-neutral-300 mt-1">
                      Dispensed at: <strong className="text-white">{tx.pharmacyName}</strong> ({tx.pharmacyLocation})
                    </div>
                    <div className="caption-4 text-neutral-400 mt-0.5 font-mono">
                      Pharmacist: {tx.pharmacistName} • Dispensed: <strong className="text-tealAccent-400">{tx.newlyDispensedQuantity}</strong> units • Remaining after: {tx.remainingQuantity} units
                    </div>
                    <p className="caption-5 text-neutral-400 mt-1">{tx.notes}</p>
                  </div>
                </div>

                <div className="text-right self-end md:self-center">
                  <div className="caption-4 font-mono text-white">
                    {tx.timestamp.split('T')[0]} {tx.timestamp.split('T')[1]?.substring(0, 5)}
                  </div>
                  <div className="caption-5 text-neutral-400 font-mono mt-0.5">
                    Payment: ${tx.paymentAmount.toFixed(2)} ({tx.paymentMethod})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ACTIVE PRESCRIPTIONS ON RECORD */}
      <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h2 className="title-2 text-white font-semibold mb-1">
          Registered Medical Prescriptions
        </h2>
        <p className="caption-4 text-neutral-400 mb-6">
          Issued by accredited healthcare providers in the AegisRx Network
        </p>

        <div className="space-y-4">
          {patientRx.map((rx) => (
            <div
              key={rx.id}
              className="bg-dark-base border border-dark-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="title-3 text-white font-semibold">{rx.medicineName}</span>
                  <span className="caption-5 font-mono text-neutral-400">{rx.id}</span>
                </div>
                <div className="caption-3 text-neutral-300 mt-1">
                  Regimen: {rx.dosageInstruction} ({rx.treatmentDurationDays} days duration)
                </div>
                <div className="caption-4 text-neutral-400 mt-0.5">
                  Doctor: {rx.doctorName} • Clinic: {rx.clinicName}
                </div>
                <div className="caption-5 text-neutral-400 mt-1">
                  Clinical Indication: {rx.clinicalIndication}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link
                  to={`/dispense?prescriptionId=${rx.id}&patientId=${activePatient.id}`}
                  className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold transition-hover"
                >
                  Dispense against script
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
