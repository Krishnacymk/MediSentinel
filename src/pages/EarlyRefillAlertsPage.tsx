import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Warning,
  Pill,
  Clock,
  ShieldCheck,
  CheckCircle,
  Stethoscope,
  Buildings,
  ArrowRight,
  FirstAid,
  User,
  CaretRight
} from '@phosphor-icons/react';

export const EarlyRefillAlertsPage: React.FC = () => {
  const { alerts, transactions, prescriptions, config, activePharmacyName } = useApp();

  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high_risk' | 'moderate'>('all');

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'all') return true;
    return a.severity === filterSeverity;
  });

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-alertWarn-bg text-alertWarn-text border border-alertWarn-border font-semibold">
              Safety Monitoring Center
            </span>
            <span className="caption-4 text-neutral-400">Core Differentiating Intelligence</span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Early Refill Detection and Monitoring
          </h1>
          <p className="body-5 text-neutral-400">
            Automated mathematical analysis of prescription duration versus actual elapsed days across all participating medical stores.
          </p>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border p-1 rounded-xl">
          <button
            onClick={() => setFilterSeverity('all')}
            className={`caption-3 px-3 py-1.5 rounded-lg transition-hover ${
              filterSeverity === 'all'
                ? 'bg-dark-base text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => setFilterSeverity('high_risk')}
            className={`caption-3 px-3 py-1.5 rounded-lg transition-hover ${
              filterSeverity === 'high_risk'
                ? 'bg-alertCritical-bg text-alertCritical-text font-semibold border border-alertCritical-border'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            High Risk ({alerts.filter(a => a.severity === 'high_risk').length})
          </button>
        </div>
      </div>

      {/* CORE DIFFERENTIATING CONCEPT EXPLANATION */}
      <section className="mb-8 p-6 rounded-2xl bg-dark-card border border-dark-border shadow-md">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-alertWarn-bg border border-alertWarn-border text-alertWarn-text">
            <ShieldCheck size={28} weight="bold" />
          </div>
          <div className="flex-1">
            <h2 className="title-2 text-white font-semibold mb-1">
              How the Early Refill Engine Operates
            </h2>
            <p className="body-5 text-neutral-300 mb-3">
              When a patient presents at any participating medical store, the engine cross checks the prescribed therapy duration against the total units dispensed and elapsed days since the last collection.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 caption-4 text-neutral-300">
              <div className="bg-dark-base p-3 rounded-xl border border-dark-border">
                <strong className="text-white block mb-0.5">1. Supply Expectancy</strong>
                15 tablets at 1 tablet daily should provide 15 full days of therapeutic coverage.
              </div>
              <div className="bg-dark-base p-3 rounded-xl border border-dark-border">
                <strong className="text-white block mb-0.5">2. Early Detection</strong>
                If patient returns after only 3 days, 12 days of supply remain unaccounted for.
              </div>
              <div className="bg-dark-base p-3 rounded-xl border border-dark-border">
                <strong className="text-white block mb-0.5">3. Human Review</strong>
                Pharmacist explores reasons (breakthrough pain, lost medicine) and refers to the doctor.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ALERTS FEED */}
      <div className="space-y-6">
        {filteredAlerts.map((alert) => {
          const rx = prescriptions.find(p => p.id === alert.prescriptionId);
          const patientTx = transactions.filter(t => t.prescriptionId === alert.prescriptionId);

          return (
            <div
              key={alert.id}
              className="bg-dark-card border-2 border-alertWarn-border rounded-2xl p-6 shadow-2xl transition-base"
            >
              {/* Alert Title Bar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-dark-border mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="caption-3 px-2 py-0.5 rounded bg-alertCritical-bg text-alertCritical-text border border-alertCritical-border font-semibold">
                      EARLY REFILL WARNING
                    </span>
                    <span className="caption-5 font-mono text-neutral-400">Alert Ref: {alert.id}</span>
                    <span className="caption-5 px-2 py-0.5 rounded bg-dark-base border border-dark-border text-neutral-300">
                      Triggered {alert.triggeredAt.split('T')[0]}
                    </span>
                  </div>
                  <h3 className="title-1 text-white font-semibold">
                    {alert.patientName} • {alert.medicineName}
                  </h3>
                  <div className="caption-3 text-neutral-300 mt-1">
                    Patient ID: <span className="font-mono text-white">{alert.patientId}</span> • Prescribed by Dr. Sarah Lin (Metro Health Specialized Pain Center)
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/intervention?patientId=${alert.patientId}&alertId=${alert.id}`}
                    className="button-md py-2 px-4 rounded-xl bg-alertWarn-badge hover:bg-yellow-500 text-black font-semibold flex items-center gap-2 transition-hover shadow-md"
                  >
                    <FirstAid size={18} weight="bold" />
                    <span>Open Pharmacist Clinical Review</span>
                  </Link>
                </div>
              </div>

              {/* MATHEMATICAL DISCREPANCY COMPARISON ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-dark-base border border-dark-border rounded-xl p-4">
                  <span className="caption-5 text-neutral-400 block">Prescribed Duration</span>
                  <div className="title-2 text-white font-bold mt-1">
                    {alert.prescribedTotalDuration} Days Supply
                  </div>
                  <span className="caption-5 text-neutral-400 mt-0.5 block">
                    Prescribed Rate: {alert.prescribedDailyDose} tablet / day
                  </span>
                </div>

                <div className="bg-dark-base border border-dark-border rounded-xl p-4">
                  <span className="caption-5 text-neutral-400 block">Previous Collection</span>
                  <div className="title-2 text-white font-bold mt-1">
                    {alert.previouslyDispensedQuantity} Tablets
                  </div>
                  <span className="caption-5 text-tealAccent-400 mt-0.5 block">
                    Dispensed at {alert.previousPharmacy}
                  </span>
                </div>

                <div className="bg-dark-base border border-alertWarn-border rounded-xl p-4">
                  <span className="caption-5 text-alertWarn-text block font-semibold">Elapsed Time</span>
                  <div className="title-2 text-alertWarn-text font-bold mt-1">
                    {alert.daysSinceLastDispense} Days Only
                  </div>
                  <span className="caption-5 text-alertCritical-text font-semibold mt-0.5 block">
                    {alert.daysEarly} Days Earlier Than Expected
                  </span>
                </div>

                <div className="bg-dark-base border border-alertCritical-border rounded-xl p-4">
                  <span className="caption-5 text-alertCritical-text block font-semibold">Calculated Daily Intake</span>
                  <div className="title-2 text-alertCritical-text font-bold mt-1">
                    {alert.calculatedDailyIntake} Tablets / Day
                  </div>
                  <span className="caption-5 text-neutral-400 mt-0.5 block">
                    5x the authorized clinical rate
                  </span>
                </div>
              </div>

              {/* CROSS PHARMACY TRANSACTION CHAIN */}
              <div className="bg-dark-base border border-dark-border rounded-xl p-4 mb-6">
                <div className="caption-3 text-tealAccent-400 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                  <Buildings size={16} />
                  <span>Cross Pharmacy Transaction Audit Trail</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-dark-card border border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="caption-2 text-white font-semibold">
                        Day 1: Full 15 Tablets Dispensed
                      </div>
                      <div className="caption-4 text-neutral-300">
                        Dispensed by James Thorne, RPh at <strong className="text-white">Store A (Metro Care Pharmacy)</strong>
                      </div>
                    </div>
                    <span className="caption-5 text-tealAccent-400 font-mono">
                      Completed Transaction #TX-2026-8801
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-alertWarn-bg border border-alertWarn-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="caption-2 text-alertWarn-text font-semibold">
                        Day 4: Refill of 15 Tablets Attempted
                      </div>
                      <div className="caption-4 text-neutral-300">
                        Patient arrived at <strong className="text-white">Store B (Central Health Drugstore)</strong> after only 3 days
                      </div>
                    </div>
                    <span className="caption-5 text-alertCritical-text font-semibold">
                      Flagged by Early Refill Engine
                    </span>
                  </div>
                </div>
              </div>

              {/* NON-PUNITIVE CLINICAL PROTOCOL NOTICE */}
              <div className="caption-4 text-neutral-300 flex items-start gap-2.5">
                <span className="text-tealAccent-400 font-bold">•</span>
                <span>
                  <strong>Clinical Protocol:</strong> Do not confront or penalize the patient. Inquire empathetically regarding pain breakthrough or tablet damage. Record notes in the intervention log and coordinate with Dr. Sarah Lin.
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
