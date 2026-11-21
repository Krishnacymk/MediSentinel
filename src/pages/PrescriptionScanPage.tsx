import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  QrCode,
  FileText,
  CheckCircle,
  Warning,
  Pill,
  ArrowRight,
  ArrowsClockwise,
  Scan,
  ShieldCheck,
  User
} from '@phosphor-icons/react';

export const PrescriptionScanPage: React.FC = () => {
  const { patients, prescriptions, addPrescription, verifyPrescription } = useApp();
  const navigate = useNavigate();

  const [scanStep, setScanStep] = useState<'upload' | 'ocr_processing' | 'review_confirm'>('upload');
  const [selectedPreset, setSelectedPreset] = useState<string>('rx-demo-01');

  // Extracted Prescription Form State for Pharmacist Verification
  const [patientId, setPatientId] = useState('PT-8942-01');
  const [patientName, setPatientName] = useState('Eleanor Vance');
  const [patientMobile, setPatientMobile] = useState('+1 (555) 382 9104');
  const [doctorName, setDoctorName] = useState('Dr. Sarah Lin, MD');
  const [doctorLicense, setDoctorLicense] = useState('MD-44912-US');
  const [clinicName, setClinicName] = useState('Metro Health Specialized Pain Center');
  const [medicineName, setMedicineName] = useState('Example Medicine A (Tramadol HCl 50mg)');
  const [genericName, setGenericName] = useState('Tramadol Hydrochloride 50mg');
  const [dosageInstruction, setDosageInstruction] = useState('Take 1 tablet daily by mouth with water');
  const [dailyDosageUnits, setDailyDosageUnits] = useState(1);
  const [totalQuantity, setTotalQuantity] = useState(15);
  const [durationDays, setDurationDays] = useState(15);
  const [issueDate, setIssueDate] = useState('2026-11-14');
  const [clinicalIndication, setClinicalIndication] = useState('Acute lumbar disc radiculopathy pain management');

  const [pharmacistAttestation, setPharmacistAttestation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Presets simulating scanning real physical paper scripts
  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    if (key === 'rx-demo-01') {
      setPatientId('PT-8942-01');
      setPatientName('Eleanor Vance');
      setPatientMobile('+1 (555) 382 9104');
      setDoctorName('Dr. Sarah Lin, MD');
      setDoctorLicense('MD-44912-US');
      setClinicName('Metro Health Specialized Pain Center');
      setMedicineName('Example Medicine A');
      setGenericName('Tramadol Hydrochloride 50mg');
      setDosageInstruction('Take 1 tablet daily by mouth with water');
      setDailyDosageUnits(1);
      setTotalQuantity(15);
      setDurationDays(15);
      setIssueDate('2026-11-14');
      setClinicalIndication('Acute lumbar disc radiculopathy pain management');
    } else if (key === 'rx-demo-02') {
      setPatientId('PT-5109-02');
      setPatientName('Marcus Chen');
      setPatientMobile('+1 (555) 724 8192');
      setDoctorName('Dr. Sarah Lin, MD');
      setDoctorLicense('MD-44912-US');
      setClinicName('Metro Health Specialized Pain Center');
      setMedicineName('Example Medicine B (Pregabalin 75mg)');
      setGenericName('Pregabalin 75mg');
      setDosageInstruction('Take 1 capsule twice daily for neuropathic discomfort');
      setDailyDosageUnits(1);
      setTotalQuantity(15);
      setDurationDays(15);
      setIssueDate('2026-11-16');
      setClinicalIndication('Peripheral neuropathic nerve support');
    }
  };

  const handleSimulateScan = () => {
    setScanStep('ocr_processing');
    setStatusMessage('Scanning prescription image and performing OCR character recognition...');
    setTimeout(() => {
      setScanStep('review_confirm');
      setStatusMessage('');
    }, 1200);
  };

  const handleConfirmAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pharmacistAttestation) {
      alert('Pharmacist confirmation is required by clinical safety protocol.');
      return;
    }

    const created = addPrescription({
      patientId,
      patientName,
      patientMobile,
      doctorName,
      doctorLicense,
      clinicName,
      issueDate,
      medicineName,
      genericName,
      dosageInstruction,
      dailyDosageUnits,
      totalQuantityPrescribed: totalQuantity,
      treatmentDurationDays: durationDays,
      status: 'active',
      clinicalIndication,
      verifiedByPharmacist: true,
      verifiedAt: new Date().toISOString()
    });

    navigate(`/dispense?prescriptionId=${created.id}&patientId=${patientId}`);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8">
        <div className="flex items-center gap-2">
          <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
            Intake Protocol
          </span>
          <span className="caption-4 text-neutral-400">Step 3 & 4 of Safety Workflow</span>
        </div>
        <h1 className="heading-4 text-white font-semibold mt-1">
          Prescription Scanning and OCR Verification
        </h1>
        <p className="body-5 text-neutral-400">
          Upload doctor physical prescription script, review extracted dosage parameters, and verify details before dispensing.
        </p>
      </div>

      {/* WORKFLOW STEP TABS */}
      <div className="flex items-center justify-between gap-4 mb-8 bg-dark-card border border-dark-border p-2 rounded-2xl">
        <button
          onClick={() => setScanStep('upload')}
          className={`flex-1 py-2 px-3 rounded-xl caption-3 font-semibold transition-hover flex items-center justify-center gap-2 ${
            scanStep === 'upload'
              ? 'bg-tealAccent-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Scan size={16} />
          <span>1. Scan / Select Prescription</span>
        </button>

        <button
          onClick={() => setScanStep('review_confirm')}
          className={`flex-1 py-2 px-3 rounded-xl caption-3 font-semibold transition-hover flex items-center justify-center gap-2 ${
            scanStep === 'review_confirm'
              ? 'bg-tealAccent-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CheckCircle size={16} />
          <span>2. Pharmacist OCR Review & Confirmation</span>
        </button>
      </div>

      {/* STEP 1: SCAN OR SELECT PRESET */}
      {scanStep === 'upload' && (
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl">
          <h2 className="title-3 text-white font-semibold mb-2">
            Select or Upload Doctor Prescription
          </h2>
          <p className="caption-2 text-neutral-400 mb-6">
            Choose a demonstration physical script or upload an official healthcare provider document.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => handleSelectPreset('rx-demo-01')}
              className={`p-4 rounded-xl border text-left transition-hover flex flex-col justify-between ${
                selectedPreset === 'rx-demo-01'
                  ? 'bg-dark-base border-tealAccent-500 shadow-md'
                  : 'bg-dark-base border-dark-border hover:border-neutral-500'
              }`}
            >
              <div>
                <span className="caption-5 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 font-mono">
                  Demo Script A • Scenario 1
                </span>
                <div className="title-4 text-white font-semibold mt-2">
                  Eleanor Vance • Example Medicine A
                </div>
                <div className="caption-4 text-neutral-300 mt-1">
                  15 tablets • 1 tablet daily for 15 days
                </div>
                <div className="caption-5 text-neutral-400 mt-0.5">
                  Dr. Sarah Lin (Metro Health Specialized Pain Center)
                </div>
              </div>
              <div className="caption-3 text-tealAccent-400 font-semibold mt-4">
                Selected for OCR extraction
              </div>
            </button>

            <button
              onClick={() => handleSelectPreset('rx-demo-02')}
              className={`p-4 rounded-xl border text-left transition-hover flex flex-col justify-between ${
                selectedPreset === 'rx-demo-02'
                  ? 'bg-dark-base border-tealAccent-500 shadow-md'
                  : 'bg-dark-base border-dark-border hover:border-neutral-500'
              }`}
            >
              <div>
                <span className="caption-5 px-2 py-0.5 rounded bg-dark-card text-neutral-300 font-mono">
                  Demo Script B • Scenario 2
                </span>
                <div className="title-4 text-white font-semibold mt-2">
                  Marcus Chen • Example Medicine B
                </div>
                <div className="caption-4 text-neutral-300 mt-1">
                  15 tablets • 1 tablet daily (Supports partial collection)
                </div>
                <div className="caption-5 text-neutral-400 mt-0.5">
                  Dr. Sarah Lin (Metro Health Specialized Pain Center)
                </div>
              </div>
              <div className="caption-3 text-tealAccent-400 font-semibold mt-4">
                Ready for OCR extraction
              </div>
            </button>
          </div>

          {/* Document Upload Area */}
          <div className="border-2 border-dashed border-dark-border rounded-xl p-8 text-center bg-dark-base mb-6">
            <FileText size={36} className="text-neutral-500 mx-auto mb-2" />
            <div className="title-4 text-white font-semibold">
              Drop prescription image or clinical PDF here
            </div>
            <p className="caption-4 text-neutral-400 mt-1">
              Supports JPEG, PNG, TIFF up to 25MB • Automated OCR extraction enabled
            </p>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleSimulateScan}
              className="button-md py-2 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-2 transition-hover"
            >
              <Scan size={18} weight="bold" />
              <span>Perform OCR and Extract Data</span>
            </button>
          </div>
        </section>
      )}

      {/* STEP: OCR PROCESSING SPINNER */}
      {scanStep === 'ocr_processing' && (
        <section className="bg-dark-card border border-dark-border rounded-2xl p-12 text-center shadow-xl">
          <ArrowsClockwise size={40} className="text-tealAccent-400 animate-spin mx-auto mb-4" />
          <h2 className="title-2 text-white font-semibold mb-2">Analyzing Prescription Document</h2>
          <p className="caption-2 text-neutral-400">{statusMessage}</p>
        </section>
      )}

      {/* STEP 2: PHARMACIST OCR VERIFICATION & CORRECTION FORM */}
      {scanStep === 'review_confirm' && (
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl">
          {/* Safety Notice: Pharmacist Verification Required */}
          <div className="mb-6 p-4 rounded-xl bg-dark-base border border-tealAccent-700/60 flex items-start gap-3">
            <ShieldCheck size={22} className="text-tealAccent-400 mt-0.5" />
            <div>
              <div className="caption-3 text-white font-semibold">
                Clinical Safety Requirement: Human Confirmation
              </div>
              <p className="caption-4 text-neutral-300">
                OCR extracts data automatically. Pharmacists must manually review, verify, and correct any field before committing this prescription to the monitoring network.
              </p>
            </div>
          </div>

          <form onSubmit={handleConfirmAndSave} className="space-y-6">
            {/* Patient Details */}
            <div className="bg-dark-base border border-dark-border rounded-xl p-4">
              <span className="caption-3 text-tealAccent-400 uppercase tracking-wider block mb-3">
                Patient Identification
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Unique Patient ID</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 font-mono focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Patient Mobile</label>
                  <input
                    type="tel"
                    value={patientMobile}
                    onChange={(e) => setPatientMobile(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
              </div>
            </div>

            {/* Prescribing Doctor Details */}
            <div className="bg-dark-base border border-dark-border rounded-xl p-4">
              <span className="caption-3 text-tealAccent-400 uppercase tracking-wider block mb-3">
                Prescribing Physician & Clinic
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Medical License</label>
                  <input
                    type="text"
                    value={doctorLicense}
                    onChange={(e) => setDoctorLicense(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 font-mono focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Clinic Facility</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
              </div>
            </div>

            {/* Medicine and Dosage Engine Inputs */}
            <div className="bg-dark-base border border-dark-border rounded-xl p-4">
              <span className="caption-3 text-tealAccent-400 uppercase tracking-wider block mb-3">
                Prescribed Medicine & Regimen
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Brand Name / Prescribed Name</label>
                  <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Generic Name & Strength</label>
                  <input
                    type="text"
                    value={genericName}
                    onChange={(e) => setGenericName(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
              </div>

              <div>
                <label className="caption-4 text-neutral-400 block mb-1">Dosage Instructions</label>
                <input
                  type="text"
                  value={dosageInstruction}
                  onChange={(e) => setDosageInstruction(e.target.value)}
                  required
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Daily Units (e.g. 1/day)</label>
                  <input
                    type="number"
                    min="1"
                    value={dailyDosageUnits}
                    onChange={(e) => setDailyDosageUnits(Number(e.target.value))}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 font-mono focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Total Quantity Units</label>
                  <input
                    type="number"
                    min="1"
                    value={totalQuantity}
                    onChange={(e) => setTotalQuantity(Number(e.target.value))}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 font-mono focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Duration (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 font-mono focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-4 text-neutral-400 block mb-1">Prescription Date</label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    required
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
              </div>
            </div>

            {/* Pharmacist Attestation */}
            <div className="bg-dark-base border border-dark-border rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pharmacistAttestation}
                  onChange={(e) => setPharmacistAttestation(e.target.checked)}
                  className="mt-1 rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                />
                <span className="caption-3 text-neutral-200">
                  I, the licensed pharmacist, have inspected the original doctor prescription, reviewed the extracted OCR parameters, and attest to the accuracy of medicine, dosage, total units, and patient identification.
                </span>
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setScanStep('upload')}
                className="button-sm py-2 px-3 rounded-xl bg-dark-base border border-dark-border text-neutral-300 hover:text-white transition-hover"
              >
                Back to Scan
              </button>

              <button
                type="submit"
                disabled={!pharmacistAttestation}
                className={`button-md py-2 px-4 rounded-xl flex items-center gap-2 font-semibold transition-hover ${
                  pharmacistAttestation
                    ? 'bg-tealAccent-600 hover:bg-tealAccent-500 text-white shadow-md'
                    : 'bg-dark-border text-neutral-500 cursor-not-allowed'
                }`}
              >
                <span>Confirm Prescription and Proceed to Dispense</span>
                <ArrowRight size={16} weight="bold" />
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};
