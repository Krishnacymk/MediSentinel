import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Stethoscope,
  Warning,
  CheckCircle,
  Clock,
  FileText,
  User,
  ArrowRight,
  ChatCircleDots
} from '@phosphor-icons/react';

export const DoctorDashboard: React.FC = () => {
  const {
    currentUser,
    prescriptions,
    alerts,
    interventions,
    doctorRespondToReferral
  } = useApp();

  const [activeTab, setActiveTab] = useState<'referrals' | 'prescriptions'>('referrals');
  const [responseModalAlert, setResponseModalAlert] = useState<any>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [clinicalAction, setClinicalAction] = useState<'adjust_dosage' | 'withhold_schedule_exam' | 'approve_interim'>('withhold_schedule_exam');
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const doctorPrescriptions = prescriptions;
  const referredAlerts = alerts.filter(a => a.status === 'referred_to_doctor' || a.status === 'pending_review');

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseModalAlert) return;

    let responseSummary = '';
    let isApproved = false;

    if (clinicalAction === 'adjust_dosage') {
      responseSummary = `Dr. Sarah Lin reviewed: Dosage adjusted. In clinic evaluation booked. ${doctorNotes}`;
      isApproved = true;
    } else if (clinicalAction === 'withhold_schedule_exam') {
      responseSummary = `Dr. Sarah Lin clinical decision: Withhold additional opioid units. Patient scheduled for urgent pain clinic evaluation tomorrow. Non pharmacological comfort measures ordered. ${doctorNotes}`;
      isApproved = false;
    } else {
      responseSummary = `Dr. Sarah Lin approved emergency partial bridge (3 units maximum). Patient advised on strict compliance. ${doctorNotes}`;
      isApproved = true;
    }

    doctorRespondToReferral(responseModalAlert.id, responseSummary, isApproved);
    setFeedbackSuccess(`Clinical response transmitted to pharmacist for Alert ${responseModalAlert.id}.`);
    setResponseModalAlert(null);
    setDoctorNotes('');
  };

  return (
    <div className="min-h-screen bg-dark-bg text-neutral-200 py-8 px-4 max-w-7xl mx-auto w-full">
      {/* Top Profile Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-dark-border mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="caption-3 px-2 py-0.5 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
              Physician Referral Hub
            </span>
            <span className="caption-4 text-neutral-400 font-mono">
              Lic: {currentUser.licenseNumber || 'MD-44912-US'}
            </span>
          </div>
          <h1 className="heading-4 text-white font-semibold mt-1">
            {currentUser.name}
          </h1>
          <p className="body-5 text-neutral-400">
            Metro Health Specialized Pain Center • Clinical Oversight and Safety
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-dark-card border border-dark-border p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('referrals')}
            className={`caption-3 px-3 py-1.5 rounded-lg transition-hover flex items-center gap-1.5 ${
              activeTab === 'referrals'
                ? 'bg-tealAccent-600 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Warning size={14} />
            <span>Pharmacist Referrals ({referredAlerts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`caption-3 px-3 py-1.5 rounded-lg transition-hover flex items-center gap-1.5 ${
              activeTab === 'prescriptions'
                ? 'bg-tealAccent-600 text-white font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>Issued Prescriptions ({doctorPrescriptions.length})</span>
          </button>
        </div>
      </div>

      {feedbackSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-300 caption-2 flex items-center gap-2">
          <CheckCircle size={18} weight="bold" />
          <span>{feedbackSuccess}</span>
        </div>
      )}

      {/* VIEW 1: REFERRED ALERTS FOR CLINICAL REVIEW */}
      {activeTab === 'referrals' && (
        <section className="space-y-6">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
            <h2 className="title-2 text-white font-semibold mb-1">
              Active Pharmacist Referrals Requiring Physician Review
            </h2>
            <p className="caption-2 text-neutral-400">
              When patients request early refills, pharmacists initiate a supportive clinical review. The physician evaluates pain control, tolerance, or alternative non opioid therapies.
            </p>
          </div>

          {referredAlerts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-dark-card border border-dark-border text-center text-neutral-400 caption-2">
              No pending pharmacist referrals at this time. All patient prescriptions are within normal dispensing parameters.
            </div>
          ) : (
            <div className="space-y-4">
              {referredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-dark-card border border-alertWarn-border rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-dark-border mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="title-3 text-white font-semibold">{alert.patientName}</span>
                        <span className="caption-4 font-mono text-neutral-400">ID: {alert.patientId}</span>
                        <span className="caption-5 px-2 py-0.5 rounded bg-alertCritical-bg text-alertCritical-text border border-alertCritical-border font-semibold">
                          {alert.severity === 'high_risk' ? 'High Discrepancy' : 'Moderate Notice'}
                        </span>
                      </div>
                      <div className="body-4 text-neutral-300">
                        Prescription: <strong className="text-white">{alert.medicineName}</strong>
                      </div>
                    </div>

                    <button
                      onClick={() => setResponseModalAlert(alert)}
                      className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center gap-1.5 transition-hover self-start lg:self-auto"
                    >
                      <ChatCircleDots size={16} weight="bold" />
                      <span>Respond to Pharmacist</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-dark-base border border-dark-border rounded-xl p-3">
                      <span className="caption-5 text-neutral-400 block">Prescribed Daily Units</span>
                      <span className="title-3 text-white font-bold mt-1 block">
                        {alert.prescribedDailyDose} tablet / day
                      </span>
                      <span className="caption-5 text-neutral-400">Total duration: {alert.prescribedTotalDuration} days</span>
                    </div>

                    <div className="bg-dark-base border border-dark-border rounded-xl p-3">
                      <span className="caption-5 text-neutral-400 block">Dispensed Quantity</span>
                      <span className="title-3 text-white font-bold mt-1 block">
                        {alert.previouslyDispensedQuantity} tablets
                      </span>
                      <span className="caption-5 text-neutral-400">Collected at {alert.previousPharmacy}</span>
                    </div>

                    <div className="bg-dark-base border border-alertWarn-border rounded-xl p-3">
                      <span className="caption-5 text-alertWarn-text block font-semibold">Days Elapsed</span>
                      <span className="title-3 text-alertWarn-text font-bold mt-1 block">
                        {alert.daysSinceLastDispense} of {alert.expectedDaysSupply} Days
                      </span>
                      <span className="caption-5 text-alertCritical-text font-semibold">
                        {alert.daysEarly} Days Early
                      </span>
                    </div>

                    <div className="bg-dark-base border border-alertCritical-border rounded-xl p-3">
                      <span className="caption-5 text-alertCritical-text block font-semibold">Apparent Daily Intake</span>
                      <span className="title-3 text-alertCritical-text font-bold mt-1 block">
                        {alert.calculatedDailyIntake} units / day
                      </span>
                      <span className="caption-5 text-neutral-400">5x prescribed rate</span>
                    </div>
                  </div>

                  <div className="bg-dark-base border border-dark-border rounded-xl p-4">
                    <div className="caption-4 text-tealAccent-400 font-semibold mb-1">
                      Pharmacist Clinical Observation (James Thorne, RPh):
                    </div>
                    <p className="caption-2 text-neutral-300">
                      "Patient stated her breakthrough nerve discomfort was unmanageable with 1 tablet per day, so she took additional tablets over the weekend. Refill requested at Store B after 3 days. We have not dispensed. Referred to prescribing doctor for clinical review and pain management reassessment."
                    </p>
                    {alert.doctorResponse && (
                      <div className="mt-3 pt-3 border-t border-dark-border text-tealAccent-300 caption-4">
                        <strong>Doctor Feedback Recorded:</strong> {alert.doctorResponse}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* VIEW 2: ISSUED PRESCRIPTIONS */}
      {activeTab === 'prescriptions' && (
        <section className="space-y-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-4">
            <h2 className="title-2 text-white font-semibold mb-1">Active Prescriptions Issued</h2>
            <p className="caption-2 text-neutral-400">
              Prescription records authorized by Dr. Sarah Lin with continuous cross pharmacy dispensing tracking.
            </p>
          </div>

          <div className="space-y-3">
            {doctorPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="bg-dark-card border border-dark-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="title-3 text-white font-semibold">{rx.medicineName}</span>
                    <span className="caption-5 font-mono text-neutral-400">{rx.id}</span>
                    <span className={`caption-5 px-2 py-0.2 rounded font-semibold ${
                      rx.status === 'flagged'
                        ? 'bg-alertWarn-bg text-alertWarn-text border border-alertWarn-border'
                        : 'bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800'
                    }`}>
                      {rx.status}
                    </span>
                  </div>
                  <div className="caption-2 text-neutral-300 mt-1">
                    Patient: <strong className="text-white">{rx.patientName}</strong> ({rx.patientMobile})
                  </div>
                  <div className="caption-4 text-neutral-400 mt-0.5">
                    Regimen: {rx.dosageInstruction} • Prescribed Total: {rx.totalQuantityPrescribed} units for {rx.treatmentDurationDays} days
                  </div>
                  <div className="caption-5 text-neutral-400 mt-1">
                    Clinical Indication: {rx.clinicalIndication}
                  </div>
                </div>

                <div className="caption-4 text-neutral-400 font-mono text-right">
                  Issued: {rx.issueDate}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RESPONSE MODAL */}
      {responseModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-card border border-dark-border rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="title-2 text-white font-semibold mb-2">
              Clinical Referral Response • {responseModalAlert.patientName}
            </h3>
            <p className="caption-2 text-neutral-400 mb-4">
              Provide clinical instructions to the dispensing pharmacist regarding this early refill situation.
            </p>

            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div>
                <label className="caption-3 text-neutral-300 block mb-1">
                  Clinical Action Decision
                </label>
                <select
                  value={clinicalAction}
                  onChange={(e) => setClinicalAction(e.target.value as any)}
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                >
                  <option value="withhold_schedule_exam">
                    Withhold refill and schedule urgent in clinic pain reassessment
                  </option>
                  <option value="adjust_dosage">
                    Adjust dosage regimen and authorize revised prescription
                  </option>
                  <option value="approve_interim">
                    Authorize small emergency bridge supply (3 days maximum)
                  </option>
                </select>
              </div>

              <div>
                <label className="caption-3 text-neutral-300 block mb-1">
                  Physician Clinical Notes and Instructions
                </label>
                <textarea
                  rows={4}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="Detail clinical rationale, alternative modalities, or required patient counseling..."
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setResponseModalAlert(null)}
                  className="button-sm py-2 px-3 rounded-lg bg-dark-base border border-dark-border text-neutral-300 hover:text-white transition-hover"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold transition-hover"
                >
                  Submit clinical decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
