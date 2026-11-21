import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Warning,
  Pill,
  MagnifyingGlass,
  QrCode,
  CheckCircle,
  Buildings,
  ArrowRight,
  FirstAid,
  FileText,
  MapPin,
  CaretRight
} from '@phosphor-icons/react';

export const PharmacistDashboard: React.FC = () => {
  const {
    currentUser,
    prescriptions,
    transactions,
    alerts,
    activePharmacyName,
    findPatientByIdOrMobile,
    pharmacyLocations
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchedPatient, setSearchedPatient] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    const result = findPatientByIdOrMobile(searchQuery);
    setSearchedPatient(result || null);
  };

  const pendingAlerts = alerts.filter(a => a.status === 'pending_review');
  const todayTransactions = transactions.slice(0, 5);

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dark-border mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Pharmacist Clinical Hub
            </span>
            <span className="caption-4 text-neutral-400 font-mono">
              Lic: {currentUser.licenseNumber || 'RPH-88492-NY'}
            </span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            {currentUser.name}
          </h1>
          <p className="body-5 text-neutral-400">
            Active Dispensing Terminal: <span className="text-tealAccent-400 font-semibold">{activePharmacyName}</span>
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/my-store-location"
            className="button-sm py-2 px-3 rounded-xl bg-dark-card hover:bg-dark-surface border border-tealAccent-700/80 text-tealAccent-300 flex items-center gap-2 transition-hover"
            title="Manage GPS location and business hours"
          >
            <MapPin size={16} weight="bold" />
            <span>My Store Location</span>
          </Link>

          <Link
            to="/prescription-scan"
            className="button-sm py-2 px-3 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white flex items-center gap-2 transition-hover shadow-sm"
          >
            <QrCode size={16} weight="bold" />
            <span>Scan Doctor Prescription</span>
          </Link>

          <Link
            to="/dispense"
            className="button-sm py-2 px-3 rounded-xl bg-dark-card hover:bg-dark-surface border border-dark-border text-white flex items-center gap-2 transition-hover"
          >
            <Pill size={16} weight="bold" className="text-tealAccent-400" />
            <span>Dispensing Engine</span>
          </Link>

          <Link
            to="/intervention"
            className="button-sm py-2 px-3 rounded-xl bg-dark-card hover:bg-dark-surface border border-dark-border text-neutral-200 flex items-center gap-2 transition-hover"
          >
            <FirstAid size={16} className="text-alertWarn-text" />
            <span>Clinical Interventions</span>
          </Link>
        </div>
      </div>

      {/* PROMINENT EARLY REFILL ALERT PANEL (CORE DIFFERENTIATING FEATURE) */}
      {pendingAlerts.length > 0 && (
        <section
          aria-label="High priority safety alert"
          className="mb-8 bg-alertWarn-bg border border-alertWarn-border rounded-2xl p-6 shadow-2xl transition-base"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-alertWarn-border/50 border border-alertWarn-border flex items-center justify-center text-alertWarn-text">
                <Warning size={24} weight="bold" />
              </div>
              <div>
                <div className="title-3 text-alertWarn-text font-bold flex items-center gap-2">
                  <span>Early Refill Warning Flagged</span>
                  <span className="caption-4 px-2 py-0.5 rounded-full bg-alertCritical-badge text-white font-semibold">
                    Action Required
                  </span>
                </div>
                <p className="caption-2 text-neutral-300">
                  {pendingAlerts.length} patient record requires human review before medicine can be safely dispensed.
                </p>
              </div>
            </div>

            <Link
              to="/early-refill-alerts"
              className="button-sm py-2 px-3 rounded-xl bg-alertWarn-badge hover:bg-yellow-500 text-black font-semibold flex items-center gap-1.5 transition-hover self-start md:self-auto"
            >
              <span>Review all active alerts</span>
              <ArrowRight size={15} weight="bold" />
            </Link>
          </div>

          {/* Demonstration Scenario 1 Featured Banner */}
          <div className="space-y-3">
            {pendingAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-dark-card border border-alertWarn-border/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="caption-3 font-semibold text-white">{alert.patientName}</span>
                    <span className="caption-5 font-mono text-neutral-400">ID: {alert.patientId}</span>
                    <span className="caption-5 px-2 py-0.2 rounded bg-alertCritical-bg border border-alertCritical-border text-alertCritical-text font-semibold">
                      {alert.daysEarly} Days Early
                    </span>
                  </div>
                  <div className="body-4 text-neutral-200">
                    Medicine: <span className="font-semibold text-white">{alert.medicineName}</span>
                  </div>
                  <p className="caption-2 text-neutral-400 mt-1">
                    Originally intended for {alert.prescribedTotalDuration} days, but patient returned after only {alert.daysSinceLastDispense} days. Apparent consumption rate: <strong className="text-alertWarn-text">{alert.calculatedDailyIntake} units per day</strong> (prescribed {alert.prescribedDailyDose} daily).
                  </p>
                  <div className="caption-5 text-neutral-400 mt-1">
                    Previous dispense store: <span className="text-neutral-300">{alert.previousPharmacy}</span> • Attempting store: <span className="text-neutral-300">{alert.attemptingPharmacy}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  <Link
                    to={`/intervention?patientId=${alert.patientId}&alertId=${alert.id}`}
                    className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-1.5 transition-hover"
                  >
                    <span>Record clinical review</span>
                    <ArrowRight size={14} weight="bold" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="caption-4 text-neutral-400">Today's Transactions</span>
            <Pill size={18} className="text-tealAccent-400" />
          </div>
          <div className="heading-4 text-white font-semibold">
            {transactions.length}
          </div>
          <div className="caption-5 text-tealAccent-400 mt-1 flex items-center gap-1">
            <CheckCircle size={13} />
            <span>Verified dispensing complete</span>
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="caption-4 text-neutral-400">Active Prescriptions</span>
            <FileText size={18} className="text-neutral-300" />
          </div>
          <div className="heading-4 text-white font-semibold">
            {prescriptions.length}
          </div>
          <div className="caption-5 text-neutral-400 mt-1">
            Validated across participating stores
          </div>
        </div>

        <div className="bg-dark-card border border-alertWarn-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="caption-4 text-alertWarn-text font-semibold">Early Refill Alerts</span>
            <Warning size={18} className="text-alertWarn-text" />
          </div>
          <div className="heading-4 text-alertWarn-text font-semibold">
            {pendingAlerts.length}
          </div>
          <div className="caption-5 text-neutral-400 mt-1">
            Requires clinical dialogue
          </div>
        </div>

        <div className="bg-dark-card border border-dark-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="caption-4 text-neutral-400">Registered GPS Stores</span>
            <Buildings size={18} className="text-tealAccent-400" />
          </div>
          <div className="heading-4 text-white font-semibold">
            {pharmacyLocations.length}
          </div>
          <div className="caption-5 text-tealAccent-400 mt-1">
            Unified GIS map live
          </div>
        </div>
      </div>

      {/* PATIENT LOOKUP ENGINE */}
      <section className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-8 shadow-lg">
        <div className="mb-4">
          <h2 className="title-2 text-white font-semibold flex items-center gap-2">
            <MagnifyingGlass size={20} className="text-tealAccent-400" />
            <span>Patient Identification and Verification</span>
          </h2>
          <p className="caption-2 text-neutral-400">
            Search participating pharmacy network using Patient Unique ID (e.g. PT-8942-01) or mobile number (+1 (555) 382 9104).
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by ID (e.g. PT-8942-01), name, or phone number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-base border border-dark-border rounded-xl px-4 py-2.5 text-white body-5 focus:outline-none focus:border-tealAccent-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="button-md py-2 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center justify-center gap-2 transition-hover"
          >
            <MagnifyingGlass size={16} weight="bold" />
            <span>Lookup Patient</span>
          </button>
        </form>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="border-t border-dark-border pt-4">
            {searchedPatient ? (
              <div className="bg-dark-base border border-dark-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="title-3 text-white font-semibold">{searchedPatient.name}</span>
                    <span className="caption-4 font-mono text-neutral-400">ID: {searchedPatient.id}</span>
                    <span className="caption-5 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
                      Cross store consent active
                    </span>
                  </div>
                  <div className="caption-2 text-neutral-300 mt-1">
                    Phone: {searchedPatient.mobile} • DOB: {searchedPatient.dob}
                  </div>
                  <p className="caption-4 text-neutral-400 mt-1">{searchedPatient.notes}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/patient-history?patientId=${searchedPatient.id}`}
                    className="button-sm py-2 px-3 rounded-lg bg-dark-card hover:bg-dark-surface border border-dark-border text-white transition-hover"
                  >
                    View medicine history
                  </Link>
                  <Link
                    to={`/dispense?patientId=${searchedPatient.id}`}
                    className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold transition-hover"
                  >
                    Proceed to dispense
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-dark-base border border-dark-border text-center text-neutral-400 caption-2">
                No patient found matching "{searchQuery}". Verify the identification key or register a new patient.
              </div>
            )}
          </div>
        )}
      </section>

      {/* TWO COLUMN WORKSPACE: RECENT TRANSACTIONS & CROSS STORE ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions Table */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
            <div>
              <h2 className="title-3 text-white font-semibold">Today's Dispensing Transactions</h2>
              <p className="caption-4 text-neutral-400">Verified medicines handed over to patients</p>
            </div>
            <Link to="/transactions" className="caption-3 text-tealAccent-400 hover:underline flex items-center gap-1">
              <span>View all</span>
              <CaretRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            {todayTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-dark-base border border-dark-border rounded-xl p-3 flex items-center justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="caption-2 text-white font-semibold truncate">{tx.patientName}</span>
                    <span className="caption-5 text-neutral-400 font-mono">{tx.id}</span>
                  </div>
                  <div className="caption-4 text-neutral-300 truncate">{tx.medicineName}</div>
                  <div className="caption-5 text-neutral-400 font-mono mt-0.5">
                    Dispensed: <strong className="text-tealAccent-400">{tx.newlyDispensedQuantity}</strong> • Remaining: {tx.remainingQuantity}
                  </div>
                </div>

                <div className="text-right">
                  <div className="caption-4 font-mono text-white">${tx.paymentAmount.toFixed(2)}</div>
                  <span className="caption-5 px-1.5 py-0.2 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
                    {tx.paymentStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cross Pharmacy Monitoring Summary */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-4">
            <div>
              <h2 className="title-3 text-white font-semibold">Cross Store Network Activity</h2>
              <p className="caption-4 text-neutral-400">Shared patient safety ledger across participating pharmacies</p>
            </div>
            <Link to="/patient-history" className="caption-3 text-tealAccent-400 hover:underline flex items-center gap-1">
              <span>Audit trail</span>
              <CaretRight size={12} />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-dark-base border border-dark-border flex items-start gap-3">
              <div className="p-2 rounded-lg bg-dark-card text-tealAccent-400 border border-dark-border mt-0.5">
                <Buildings size={16} />
              </div>
              <div className="flex-1">
                <div className="caption-2 text-white font-semibold">Store A (Metro Care Pharmacy)</div>
                <p className="caption-4 text-neutral-400">
                  Dispensed 15 tablets of Example Medicine A to Eleanor Vance (Day 1). Prescription active for 15 days.
                </p>
                <div className="caption-5 text-neutral-400 mt-1 font-mono">Pharmacist: James Thorne, RPh</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-dark-base border border-alertWarn-border flex items-start gap-3">
              <div className="p-2 rounded-lg bg-alertWarn-bg text-alertWarn-text border border-alertWarn-border mt-0.5">
                <Warning size={16} />
              </div>
              <div className="flex-1">
                <div className="caption-2 text-alertWarn-text font-semibold">Store B (Central Health Drugstore)</div>
                <p className="caption-4 text-neutral-400">
                  Refill request flagged for Eleanor Vance on Day 4. 12 days remaining from previous Store A collection.
                </p>
                <div className="caption-5 text-neutral-400 mt-1 font-mono">Status: Human review in progress</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-dark-base border border-dark-border flex items-start gap-3">
              <div className="p-2 rounded-lg bg-dark-card text-tealAccent-400 border border-dark-border mt-0.5">
                <MapPin size={16} />
              </div>
              <div className="flex-1">
                <div className="caption-2 text-white font-semibold">GPS Medical Store Network</div>
                <p className="caption-4 text-neutral-400">
                  {pharmacyLocations.length} registered pharmacy locations available for patient navigation and verified dispensing.
                </p>
                <div className="caption-5 text-tealAccent-400 mt-1 font-mono">
                  <Link to="/find-stores" className="hover:underline">Explore interactive map &rarr;</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
