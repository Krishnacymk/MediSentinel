import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  User,
  Pill,
  Clock,
  ShieldCheck,
  CheckCircle,
  Warning,
  FirstAid,
  Heartbeat,
  FileText,
  LockSimple,
  MapPin,
  ArrowRight
} from '@phosphor-icons/react';

export const PatientDashboard: React.FC = () => {
  const {
    currentUser,
    patients,
    prescriptions,
    transactions,
    alerts,
    pharmacyLocations
  } = useApp();

  // Find patient record corresponding to currentUser or Eleanor Vance Demo 01
  const activePatient = patients.find(p => p.id === 'PT-8942-01') || patients[0];
  const patientPrescriptions = prescriptions.filter(p => p.patientId === activePatient.id);
  const patientTransactions = transactions.filter(t => t.patientId === activePatient.id);
  const patientAlerts = alerts.filter(a => a.patientId === activePatient.id);

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-7xl mx-auto w-full">
      {/* Top Patient Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dark-border mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Personal Medicine Safety Portal
            </span>
            <span className="caption-4 text-neutral-400 font-mono">
              Patient ID: {activePatient.id}
            </span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Welcome back, {activePatient.name}
          </h1>
          <p className="body-5 text-neutral-400">
            Mobile: {activePatient.mobile} • DOB: {activePatient.dob}
          </p>
        </div>

        {/* Quick action: Find Medical Stores */}
        <div className="flex items-center gap-3">
          <Link
            to="/find-stores"
            className="button-sm py-2 px-3 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-1.5 transition-hover shadow-md"
          >
            <MapPin size={16} weight="bold" />
            <span>Find Medical Stores Map</span>
          </Link>
        </div>
      </div>

      {/* FIND MEDICAL STORES HIGHLIGHT BANNER (MODULE 11 INTEGRATION) */}
      <section className="mb-8 p-6 rounded-2xl bg-dark-card border border-tealAccent-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-400 shrink-0">
            <MapPin size={26} weight="bold" />
          </div>
          <div>
            <div className="title-3 text-white font-semibold flex items-center gap-2">
              <span>Locate Verified Participating Pharmacies</span>
              <span className="caption-5 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800 font-mono">
                {pharmacyLocations.length} Stores Available
              </span>
            </div>
            <p className="caption-2 text-neutral-300 mt-1">
              Use GPS mapping to find the nearest accredited pharmacy to collect your medicines, verify open hours, check pharmacist contact numbers, and get instant walking or driving directions.
            </p>
          </div>
        </div>

        <Link
          to="/find-stores"
          className="button-sm py-2 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-2 transition-hover shrink-0 self-start md:self-auto"
        >
          <span>Open Interactive Map</span>
          <ArrowRight size={15} weight="bold" />
        </Link>
      </section>

      {/* EDUCATIONAL SAFETY MESSAGE (SUPPORTIVE, NON-PUNITIVE) */}
      <section className="mb-8 bg-dark-card border border-dark-border rounded-2xl p-6 shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-400 shrink-0">
            <Heartbeat size={24} weight="bold" />
          </div>
          <div className="flex-1">
            <h2 className="title-3 text-white font-semibold mb-1">
              Your Health and Medicine Safety Guide
            </h2>
            <p className="body-5 text-neutral-300 mb-3">
              Medicines are prescribed at specific daily rates to provide safe, steady therapeutic relief. If you are experiencing breakthrough pain or discomfort before your next scheduled dose, taking extra tablets can lead to dangerous side effects, reduced effectiveness, or tolerance.
            </p>
            <div className="p-3 rounded-xl bg-dark-base border border-dark-border caption-4 text-neutral-300 flex items-center justify-between gap-4 flex-wrap">
              <span>
                <strong>Experiencing uncontrolled pain?</strong> Contact Dr. Sarah Lin or discuss non medicinal pain relief options with your pharmacist.
              </span>
              <span className="caption-4 text-tealAccent-400 font-semibold">
                Clinic Line: +1 (555) 456 7890
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ACTIVE EARLY NOTICE IF ANY */}
      {patientAlerts.length > 0 && (
        <section className="mb-8 bg-alertWarn-bg border border-alertWarn-border rounded-2xl p-6 shadow-md">
          <div className="flex items-start gap-3">
            <Warning size={24} className="text-alertWarn-text mt-0.5 shrink-0" />
            <div>
              <div className="title-3 text-alertWarn-text font-bold mb-1">
                Prescription Review in Progress
              </div>
              <p className="caption-2 text-neutral-300 mb-2">
                A refill request for Example Medicine A was submitted earlier than the scheduled 15 day duration. To safeguard your health, your pharmacist and doctor are reviewing your current symptoms to determine if a dosage adjustment is appropriate.
              </p>
              <div className="caption-5 text-neutral-400 font-mono">
                Status: Under Clinical Review • Pharmacist James Thorne, RPh
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CURRENT PRESCRIPTIONS & REMAINING QUANTITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
            <div>
              <h2 className="title-3 text-white font-semibold">Current Active Prescriptions</h2>
              <p className="caption-4 text-neutral-400">Authorized by your healthcare providers</p>
            </div>
            <FileText size={20} className="text-tealAccent-400" />
          </div>

          <div className="space-y-4">
            {patientPrescriptions.map((rx) => {
              const txs = transactions.filter(t => t.prescriptionId === rx.id && t.status === 'completed');
              const totalDispensed = txs.reduce((sum, t) => sum + t.newlyDispensedQuantity, 0);
              const remainingUnits = Math.max(0, rx.totalQuantityPrescribed - totalDispensed);

              return (
                <div
                  key={rx.id}
                  className="bg-dark-base border border-dark-border rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="title-4 text-white font-semibold block">{rx.medicineName}</span>
                      <span className="caption-5 text-neutral-400 font-mono">{rx.id} • {rx.doctorName}</span>
                    </div>
                    <span className="caption-5 px-2 py-0.5 rounded bg-dark-card border border-dark-border text-tealAccent-300 font-semibold">
                      {rx.status}
                    </span>
                  </div>

                  <div className="caption-2 text-neutral-300">
                    <strong>Schedule:</strong> {rx.dosageInstruction}
                  </div>

                  {/* Quantity Breakdown Card */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-dark-border text-center">
                    <div className="p-2 bg-dark-card rounded-lg border border-dark-border">
                      <span className="caption-5 text-neutral-400 block">Prescribed</span>
                      <span className="title-4 text-white font-bold">{rx.totalQuantityPrescribed}</span>
                    </div>
                    <div className="p-2 bg-dark-card rounded-lg border border-dark-border">
                      <span className="caption-5 text-neutral-400 block">Collected</span>
                      <span className="title-4 text-tealAccent-400 font-bold">{totalDispensed}</span>
                    </div>
                    <div className="p-2 bg-dark-card rounded-lg border border-dark-border">
                      <span className="caption-5 text-neutral-400 block">Remaining</span>
                      <span className="title-4 text-white font-bold">{remainingUnits}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MEDICINE COLLECTION & DISPENSING HISTORY */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
            <div>
              <h2 className="title-3 text-white font-semibold">Medicine Collection History</h2>
              <p className="caption-4 text-neutral-400">Stores visited and units handed over</p>
            </div>
            <Clock size={20} className="text-tealAccent-400" />
          </div>

          <div className="space-y-3">
            {patientTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-dark-base border border-dark-border rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="caption-3 text-white font-semibold">{tx.medicineName}</span>
                  <span className="caption-5 font-mono text-neutral-400">{tx.timestamp.split('T')[0]}</span>
                </div>
                <div className="caption-4 text-neutral-400">
                  Collected at: <strong className="text-neutral-200">{tx.pharmacyName}</strong>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-dark-border text-neutral-300">
                  <span>Units handed over: <strong className="text-tealAccent-400">{tx.newlyDispensedQuantity}</strong></span>
                  <span>Pharmacist: {tx.pharmacistName}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* PATIENT PRIVACY AND CONSENT MANAGEMENT */}
      <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
        <h2 className="title-3 text-white font-semibold mb-2 flex items-center gap-2">
          <LockSimple size={18} className="text-tealAccent-400" />
          <span>Patient Data Privacy and Consent Controls</span>
        </h2>
        <p className="caption-2 text-neutral-400 mb-4">
          Your dispensing records are securely shared between participating pharmacies solely to verify medicine authenticity, track undispensed balances, and prevent unintended drug interactions.
        </p>

        <div className="bg-dark-base border border-dark-border rounded-xl p-4 flex items-center justify-between gap-4">
          <div>
            <div className="caption-3 text-white font-semibold">Cross Store Safety Synchronization</div>
            <div className="caption-5 text-neutral-400">Status: Active with verified consent on record</div>
          </div>
          <span className="caption-4 px-2.5 py-1 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800 font-semibold">
            Consent Enabled
          </span>
        </div>
      </section>
    </div>
  );
};
