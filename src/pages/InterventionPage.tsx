import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  FirstAid,
  ShieldCheck,
  Warning,
  CheckCircle,
  Stethoscope,
  ArrowRight,
  User,
  Heartbeat
} from '@phosphor-icons/react';

export const InterventionPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    currentUser,
    patients,
    alerts,
    interventions,
    recordIntervention,
    activePharmacyName
  } = useApp();

  const patientIdParam = searchParams.get('patientId') || 'PT-8942-01';
  const alertIdParam = searchParams.get('alertId') || 'ALT-2026-001';

  const patient = patients.find(p => p.id === patientIdParam) || patients[0];
  const activeAlert = alerts.find(a => a.id === alertIdParam) || alerts[0];

  // Form State
  const [reportedReason, setReportedReason] = useState<'severe_uncontrolled_pain' | 'damaged_or_lost_tablets' | 'misunderstood_schedule' | 'travel_advance_request' | 'unexplained_excess'>('severe_uncontrolled_pain');
  const [patientSymptoms, setPatientSymptoms] = useState('Patient states her lumbar nerve radiculopathy flared severely on Saturday. 1 tablet daily was ineffective, so she took 5 tablets per day to manage agonizing breakthrough pain.');
  const [actionTaken, setActionTaken] = useState<'withhold_and_refer_doctor' | 'counsel_and_partial_dispense' | 'safety_counsel_only' | 'emergency_escalation'>('withhold_and_refer_doctor');
  const [referToDoctor, setReferToDoctor] = useState(true);
  const [doctorName, setDoctorName] = useState('Dr. Sarah Lin, MD');
  const [finalDecision, setFinalDecision] = useState('Withhold full refill. Patient scheduled for priority in person consultation with Dr. Sarah Lin. Provided non opioid topical guidance and safety warning regarding respiratory depression.');
  const [patientAgreed, setPatientAgreed] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    recordIntervention({
      alertId: activeAlert?.id || 'ALT-2026-001',
      patientId: patient.id,
      patientName: patient.name,
      pharmacistId: currentUser.id,
      pharmacistName: currentUser.name,
      pharmacyName: activePharmacyName,
      reportedPatientReason: reportedReason,
      patientSymptoms,
      actionTaken,
      referredToDoctor: referToDoctor,
      doctorName: referToDoctor ? doctorName : undefined,
      finalDecision,
      patientAgreedToSafeSchedule: patientAgreed
    });

    setSuccessMessage('Intervention record logged successfully and dispatched to clinical network.');
    setTimeout(() => {
      navigate('/pharmacist-dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-5xl mx-auto w-full">
      {/* Header */}
      <div className="pb-6 border-b border-dark-border mb-8">
        <div className="flex items-center gap-2">
          <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
            Clinical Human Intervention
          </span>
          <span className="caption-4 text-neutral-400">Step 10, 11 & 12 of Safety Workflow</span>
        </div>
        <h1 className="heading-4 text-white font-semibold mt-1">
          Pharmacist Clinical Intervention Record
        </h1>
        <p className="body-5 text-neutral-400">
          Supportive, non punitive clinical dialogue to evaluate early refill reasons, consult prescribing doctors, and protect patient safety.
        </p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-300 caption-2 flex items-center gap-2">
          <CheckCircle size={18} weight="bold" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* PATIENT SAFETY PHILOSOPHY REMINDER */}
      <section className="mb-8 p-5 rounded-2xl bg-dark-card border border-dark-border flex items-start gap-4">
        <Heartbeat size={24} className="text-tealAccent-400 mt-0.5" />
        <div className="flex-1">
          <div className="title-3 text-white font-semibold mb-1">
            Clinical Principle: Supportive Care Over Penalization
          </div>
          <p className="caption-2 text-neutral-300">
            Patients who consume medication faster than prescribed are frequently experiencing intense pain or confusion. Our goal is to identify safety risks, provide education, and coordinate with the prescribing physician to adjust treatment.
          </p>
        </div>
      </section>

      {/* ACTIVE WARNING SNAPSHOT */}
      {activeAlert && (
        <section className="mb-8 p-6 rounded-2xl bg-alertWarn-bg border border-alertWarn-border">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <span className="caption-4 px-2 py-0.5 rounded bg-alertCritical-badge text-white font-semibold">
                Early Refill Case Summary
              </span>
              <h2 className="title-2 text-alertWarn-text font-bold mt-2">
                {patient.name} ({patient.id})
              </h2>
              <div className="caption-3 text-neutral-200 mt-1">
                Medicine: <strong className="text-white">{activeAlert.medicineName}</strong>
              </div>
            </div>
            <div className="text-right">
              <span className="caption-5 text-neutral-300 block font-mono">Discrepancy</span>
              <span className="title-3 text-alertWarn-text font-bold">
                {activeAlert.daysEarly} Days Early
              </span>
            </div>
          </div>

          <div className="bg-dark-card border border-alertWarn-border/60 rounded-xl p-4 caption-3 text-neutral-200 font-mono space-y-1">
            <div>• Intended Supply Duration: {activeAlert.prescribedTotalDuration} days</div>
            <div>• Elapsed Days Since Dispense: {activeAlert.daysSinceLastDispense} days</div>
            <div>• Apparent Consumption Rate: {activeAlert.calculatedDailyIntake} units / day (Prescribed: {activeAlert.prescribedDailyDose} daily)</div>
            <div>• Initial Dispensing Location: {activeAlert.previousPharmacy}</div>
          </div>
        </section>
      )}

      {/* INTERVENTION RECORDING FORM */}
      <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="title-2 text-white font-semibold">
          Clinical Consultation Dialogue Record
        </h3>

        {/* Reported Reason Dropdown */}
        <div>
          <label className="caption-3 text-neutral-300 block mb-1.5">
            Patient Reported Circumstance or Reason for Early Refill Request
          </label>
          <select
            value={reportedReason}
            onChange={(e) => setReportedReason(e.target.value as any)}
            className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
          >
            <option value="severe_uncontrolled_pain">
              Severe uncontrolled breakthrough pain (medication ineffective at prescribed dosage)
            </option>
            <option value="damaged_or_lost_tablets">
              Accidentally damaged, dropped, or lost medication
            </option>
            <option value="misunderstood_schedule">
              Misunderstood dosing schedule (took extra tablets without realizing duration)
            </option>
            <option value="travel_advance_request">
              Upcoming travel or hospitalization advance request
            </option>
            <option value="unexplained_excess">
              Unexplained early request (patient hesitant to explain)
            </option>
          </select>
        </div>

        {/* Patient Symptoms and Dialogue Notes */}
        <div>
          <label className="caption-3 text-neutral-300 block mb-1.5">
            Pharmacist Clinical Conversation and Patient Statements
          </label>
          <textarea
            rows={3}
            value={patientSymptoms}
            onChange={(e) => setPatientSymptoms(e.target.value)}
            required
            className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
          />
        </div>

        {/* Clinical Action Decision */}
        <div>
          <label className="caption-3 text-neutral-300 block mb-1.5">
            Pharmacist Action and Disposition
          </label>
          <select
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value as any)}
            className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
          >
            <option value="withhold_and_refer_doctor">
              Withhold refill and refer case to prescribing doctor for pain re evaluation
            </option>
            <option value="counsel_and_partial_dispense">
              Provide safety counseling and dispense small emergency bridge supply (e.g. 2-3 tablets)
            </option>
            <option value="safety_counsel_only">
              Provide dosage compliance education; patient agreed to wait for scheduled date
            </option>
            <option value="emergency_escalation">
              Escalate to urgent healthcare facility (signs of acute adverse effects or crisis)
            </option>
          </select>
        </div>

        {/* Doctor Referral Details */}
        <div className="bg-dark-base border border-dark-border rounded-xl p-4 space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={referToDoctor}
              onChange={(e) => setReferToDoctor(e.target.checked)}
              className="rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
            />
            <span className="caption-3 text-white font-semibold flex items-center gap-1.5">
              <Stethoscope size={16} className="text-tealAccent-400" />
              <span>Refer Case Directly to Prescribing Physician for Review</span>
            </span>
          </label>

          {referToDoctor && (
            <div className="pt-2">
              <label className="caption-4 text-neutral-400 block mb-1">
                Prescribing Physician Contact
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-1.5 text-white body-5 focus:outline-none focus:border-tealAccent-500"
              />
              <span className="caption-5 text-neutral-400 mt-1 block">
                Notification will appear in Dr. Lin's referral dashboard.
              </span>
            </div>
          )}
        </div>

        {/* Final Decision and Instructions */}
        <div>
          <label className="caption-3 text-neutral-300 block mb-1.5">
            Final Decision Summary and Educational Guidance Given
          </label>
          <textarea
            rows={3}
            value={finalDecision}
            onChange={(e) => setFinalDecision(e.target.value)}
            required
            className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
          />
        </div>

        {/* Patient Agreement */}
        <div className="bg-dark-base border border-dark-border rounded-xl p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={patientAgreed}
              onChange={(e) => setPatientAgreed(e.target.checked)}
              className="mt-1 rounded bg-dark-card border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
            />
            <span className="caption-3 text-neutral-200">
              Patient was counseled regarding medication risks, expressed understanding, and agreed to follow up with the physician.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Link
            to="/pharmacist-dashboard"
            className="button-sm py-2 px-3 rounded-xl bg-dark-base border border-dark-border text-neutral-300 hover:text-white transition-hover"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="button-md py-2 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-2 transition-hover shadow-md"
          >
            <CheckCircle size={18} weight="bold" />
            <span>Record Clinical Intervention</span>
          </button>
        </div>
      </form>
    </div>
  );
};
