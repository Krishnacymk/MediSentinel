import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PharmacyMap } from '../components/PharmacyMap';
import { PharmacyLocation } from '../types';
import {
  Gear,
  ShieldCheck,
  Buildings,
  Sliders,
  CheckCircle,
  Warning,
  ArrowsClockwise,
  MapPin,
  MapTrifold,
  LockSimple,
  FileText,
  Clock,
  Phone,
  Eye,
  Check,
  X
} from '@phosphor-icons/react';

export const AdminPage: React.FC = () => {
  const {
    config,
    updateConfig,
    resetDemonstrationState,
    pharmacyLocations,
    verifyPharmacyLocation
  } = useApp();

  const [activeTab, setActiveTab] = useState<'parameters' | 'map_locations'>('map_locations');
  const [monitoringDays, setMonitoringDays] = useState(config.defaultMonitoringWindowDays);
  const [thresholdPercent, setThresholdPercent] = useState(config.earlyRefillThresholdPercent);
  const [requirePhoto, setRequirePhoto] = useState(config.requireEvidencePhoto);
  const [requireDoctorReferral, setRequireDoctorReferral] = useState(config.requireDoctorReferralForHighRisk);
  const [allowEmergency, setAllowEmergency] = useState(config.allowEmergencyOverride);
  const [saveSuccess, setSaveSuccess] = useState('');

  // Selected Store for Admin Review
  const [selectedAdminPharmacy, setSelectedAdminPharmacy] = useState<PharmacyLocation | null>(
    pharmacyLocations[0] || null
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      defaultMonitoringWindowDays: Number(monitoringDays),
      earlyRefillThresholdPercent: Number(thresholdPercent),
      requireEvidencePhoto: requirePhoto,
      requireDoctorReferralForHighRisk: requireDoctorReferral,
      allowEmergencyOverride: allowEmergency
    });
    setSaveSuccess('Monitoring parameters updated and applied to early refill calculation engine.');
    setTimeout(() => setSaveSuccess(''), 3000);
  };

  const handleToggleVerification = (pharmacyId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'verified' ? 'suspended' : 'verified';
    verifyPharmacyLocation(pharmacyId, nextStatus);
    if (selectedAdminPharmacy && selectedAdminPharmacy.pharmacy_id === pharmacyId) {
      setSelectedAdminPharmacy({
        ...selectedAdminPharmacy,
        verification_status: nextStatus
      });
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              System Administration
            </span>
            <span className="caption-4 text-neutral-400">Network & GIS Command</span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            Safety Monitoring & Network Settings
          </h1>
          <p className="body-5 text-neutral-400">
            Audit registered medical store GIS locations, manage verification compliance, and configure early refill thresholds.
          </p>
        </div>

        {/* Tab navigation & Reset Demo State Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-dark-border bg-dark-card p-1">
            <button
              onClick={() => setActiveTab('map_locations')}
              className={`caption-3 px-3 py-1.5 rounded-lg transition-hover flex items-center gap-1.5 ${
                activeTab === 'map_locations'
                  ? 'bg-tealAccent-600 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <MapTrifold size={14} />
              <span>Pharmacy Locations ({pharmacyLocations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('parameters')}
              className={`caption-3 px-3 py-1.5 rounded-lg transition-hover flex items-center gap-1.5 ${
                activeTab === 'parameters'
                  ? 'bg-tealAccent-600 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sliders size={14} />
              <span>Safety Parameters</span>
            </button>
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all demonstration data to default state?')) {
                resetDemonstrationState();
                window.location.reload();
              }
            }}
            className="button-sm py-2 px-3 rounded-xl bg-dark-card hover:bg-dark-surface border border-dark-border text-neutral-300 hover:text-white flex items-center gap-1.5 transition-hover"
          >
            <ArrowsClockwise size={15} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-300 caption-2 flex items-center gap-2">
          <CheckCircle size={18} weight="bold" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* VIEW 1: PHARMACY LOCATIONS MAP & VERIFICATION REVIEW (REQUIREMENT 6) */}
      {activeTab === 'map_locations' && (
        <div className="space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="title-2 text-white font-semibold flex items-center gap-2">
                  <MapPin size={22} className="text-tealAccent-400" />
                  <span>Registered Medical Store GIS Map</span>
                </h2>
                <p className="caption-2 text-neutral-400">
                  Inspect registered pharmacy coordinates, check compliance status, and approve or suspend participating network nodes.
                </p>
              </div>
              <span className="caption-4 px-3 py-1 rounded-full bg-dark-base border border-dark-border font-mono text-tealAccent-400">
                {pharmacyLocations.filter(p => p.verification_status === 'verified').length} of {pharmacyLocations.length} Verified
              </span>
            </div>

            {/* Interactive Map Component */}
            <div className="mb-6">
              <PharmacyMap
                pharmacies={pharmacyLocations}
                selectedPharmacyId={selectedAdminPharmacy?.pharmacy_id}
                onSelectPharmacy={(pharm) => setSelectedAdminPharmacy(pharm)}
                className="w-full h-[450px]"
              />
            </div>

            {/* Selected Pharmacy Details & Admin Verification Controls */}
            {selectedAdminPharmacy && (
              <div className="bg-dark-base border border-dark-border rounded-xl p-5 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-dark-border mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="title-3 text-white font-semibold">
                        {selectedAdminPharmacy.pharmacy_name}
                      </h3>
                      <span className={`caption-5 px-2 py-0.5 rounded font-semibold capitalize ${
                        selectedAdminPharmacy.verification_status === 'verified'
                          ? 'bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800'
                          : 'bg-alertWarn-bg text-alertWarn-text border border-alertWarn-border'
                      }`}>
                        {selectedAdminPharmacy.verification_status}
                      </span>
                      <span className="caption-5 font-mono text-neutral-400">{selectedAdminPharmacy.pharmacy_id}</span>
                    </div>
                    <div className="caption-3 text-neutral-300 mt-1">
                      {selectedAdminPharmacy.address}, {selectedAdminPharmacy.city}, {selectedAdminPharmacy.state} {selectedAdminPharmacy.postal_code}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVerification(selectedAdminPharmacy.pharmacy_id, selectedAdminPharmacy.verification_status)}
                      className={`button-sm py-2 px-3 rounded-lg font-semibold flex items-center gap-1.5 transition-hover ${
                        selectedAdminPharmacy.verification_status === 'verified'
                          ? 'bg-alertCritical-bg text-alertCritical-text border border-alertCritical-border hover:bg-red-950'
                          : 'bg-tealAccent-600 text-white hover:bg-tealAccent-500'
                      }`}
                    >
                      {selectedAdminPharmacy.verification_status === 'verified' ? (
                        <>
                          <X size={15} />
                          <span>Suspend Registration</span>
                        </>
                      ) : (
                        <>
                          <Check size={15} />
                          <span>Verify & Approve Store</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3">
                  <div className="p-3 bg-dark-card rounded-lg border border-dark-border">
                    <span className="caption-5 text-neutral-400 block">GPS Coordinates</span>
                    <span className="font-mono text-white text-sm font-semibold">
                      {selectedAdminPharmacy.latitude.toFixed(4)}, {selectedAdminPharmacy.longitude.toFixed(4)}
                    </span>
                  </div>

                  <div className="p-3 bg-dark-card rounded-lg border border-dark-border">
                    <span className="caption-5 text-neutral-400 block">Lead Pharmacist</span>
                    <span className="text-white text-sm font-semibold block truncate">
                      {selectedAdminPharmacy.pharmacist_name}
                    </span>
                  </div>

                  <div className="p-3 bg-dark-card rounded-lg border border-dark-border">
                    <span className="caption-5 text-neutral-400 block">Phone Contact</span>
                    <span className="font-mono text-white text-sm font-semibold">
                      {selectedAdminPharmacy.phone_number}
                    </span>
                  </div>
                </div>

                <div className="caption-4 text-neutral-400">
                  <strong className="text-neutral-300">Registered Services:</strong>{' '}
                  {selectedAdminPharmacy.services.join(' • ')}
                </div>
              </div>
            )}

            {/* List of Registered Pharmacy Nodes */}
            <div className="space-y-3">
              <span className="caption-3 uppercase tracking-wider text-neutral-400 block mb-2">
                All Registered Network Nodes
              </span>

              {pharmacyLocations.map((pharm) => (
                <div
                  key={pharm.pharmacy_id}
                  onClick={() => setSelectedAdminPharmacy(pharm)}
                  className={`bg-dark-base border p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-base ${
                    selectedAdminPharmacy?.pharmacy_id === pharm.pharmacy_id
                      ? 'border-tealAccent-500 bg-dark-surface/40'
                      : 'border-dark-border hover:border-neutral-500'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="title-4 text-white font-semibold">{pharm.pharmacy_name}</span>
                      <span className="caption-5 font-mono text-neutral-400">{pharm.pharmacy_id}</span>
                      <span className={`caption-5 px-1.5 py-0.2 rounded font-semibold capitalize ${
                        pharm.verification_status === 'verified'
                          ? 'bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800'
                          : 'bg-alertWarn-bg text-alertWarn-text border border-alertWarn-border'
                      }`}>
                        {pharm.verification_status}
                      </span>
                    </div>
                    <div className="caption-4 text-neutral-400 mt-0.5">
                      {pharm.address}, {pharm.city} • Lat {pharm.latitude.toFixed(4)}, Lon {pharm.longitude.toFixed(4)}
                    </div>
                    <div className="caption-5 text-neutral-400 mt-0.5 font-mono">
                      Lead Pharmacist: {pharm.pharmacist_name} • Phone: {pharm.phone_number}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVerification(pharm.pharmacy_id, pharm.verification_status);
                      }}
                      className="caption-4 px-2.5 py-1 rounded bg-dark-card border border-dark-border text-neutral-300 hover:text-white transition-hover"
                    >
                      {pharm.verification_status === 'verified' ? 'Suspend' : 'Verify'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: SYSTEM CONFIGURATION & THRESHOLDS */}
      {activeTab === 'parameters' && (
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sliders size={20} className="text-tealAccent-400" />
            <h2 className="title-2 text-white font-semibold">
              Early Refill Calculation Parameters
            </h2>
          </div>
          <p className="caption-2 text-neutral-400 mb-6">
            The 15 day monitoring period is a configurable parameter. The engine uses these thresholds to calculate whether a patient refill request is unusually early.
          </p>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-dark-base border border-dark-border rounded-xl p-4">
                <label className="caption-3 text-white font-semibold block mb-1">
                  Default Monitoring Period (Days)
                </label>
                <p className="caption-5 text-neutral-400 mb-3">
                  Standard observation window for acute and subacute controlled regimens.
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={monitoringDays}
                    onChange={(e) => setMonitoringDays(Number(e.target.value))}
                    className="w-32 bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-4 font-mono focus:outline-none focus:border-tealAccent-500"
                  />
                  <span className="caption-4 text-neutral-300">Days baseline</span>
                </div>
              </div>

              <div className="bg-dark-base border border-dark-border rounded-xl p-4">
                <label className="caption-3 text-white font-semibold block mb-1">
                  Early Refill Sensitivity Threshold (%)
                </label>
                <p className="caption-5 text-neutral-400 mb-3">
                  Refill requested prior to this percentage of elapsed duration triggers an alert (e.g. 75%).
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="50"
                    max="95"
                    value={thresholdPercent}
                    onChange={(e) => setThresholdPercent(Number(e.target.value))}
                    className="w-32 bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-4 font-mono focus:outline-none focus:border-tealAccent-500"
                  />
                  <span className="caption-4 text-neutral-300">% of expected duration</span>
                </div>
              </div>
            </div>

            {/* Safety Toggles */}
            <div className="bg-dark-base border border-dark-border rounded-xl p-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireDoctorReferral}
                  onChange={(e) => setRequireDoctorReferral(e.target.checked)}
                  className="rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-3 text-neutral-200">
                  Mandate physician referral for high risk early refills (e.g. rate &gt; 2x prescribed daily units).
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requirePhoto}
                  onChange={(e) => setRequirePhoto(e.target.checked)}
                  className="rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-3 text-neutral-200">
                  Prompt pharmacist for photograph collection evidence upon physical handover.
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowEmergency}
                  onChange={(e) => setAllowEmergency(e.target.checked)}
                  className="rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-3 text-neutral-200">
                  Permit documented pharmacist clinical override for acute emergency exceptions.
                </span>
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="button-md py-2 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold transition-hover shadow-md"
              >
                Save Configuration Parameters
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};
