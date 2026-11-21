import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { TaglineReveal } from '../components/TaglineReveal';
import {
  ShieldCheck,
  Warning,
  Pill,
  Stethoscope,
  Buildings,
  Camera,
  CheckCircle,
  CaretDown,
  ArrowRight,
  ArrowsClockwise,
  UsersThree,
  FileText,
  Clock,
  LockSimple
} from '@phosphor-icons/react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { switchUserRole, setActivePharmacyName } = useApp();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleStartDemo = () => {
    switchUserRole('pharmacist');
    navigate('/pharmacist-dashboard');
  };

  const handleLaunchScenario1 = () => {
    switchUserRole('pharmacist');
    setActivePharmacyName('Store B (Central Health Drugstore)');
    navigate('/early-refill-alerts');
  };

  const faqs = [
    {
      q: "How does the platform detect an early medicine refill request?",
      a: "The dispensing engine compares the prescribed therapy duration and total units dispensed against the elapsed days since the last collection across all participating stores. If a patient returns significantly before their current supply is expected to finish, an early refill warning flags the record for human review."
    },
    {
      q: "Does this system treat patients who request refills as criminals?",
      a: "No. Patients frequently experience acute breakthrough pain, accidental medication loss, or confusion regarding their dosing schedule. The platform assists pharmacists in identifying when additional clinical support is required, facilitating direct communication with the prescribing doctor rather than imposing punitive restrictions."
    },
    {
      q: "How does partial medicine collection work in practice?",
      a: "When a doctor prescribes a full 15 tablet regimen, patients may elect to collect only 5 tablets today. The system logs the 5 dispensed units, updates the active claim balance to 10 remaining units, and synchronizes this remaining entitlement so it can be completed later at any participating location."
    },
    {
      q: "Can patients bypass alerts by visiting a different medical store?",
      a: "No. Participating pharmacies operate on a unified patient medicine ledger with patient consent. When a prescription is scanned or patient profile verified, the system displays cross pharmacy dispensing records regardless of which location previously dispensed the medicine."
    },
    {
      q: "Why does the platform require human review before taking action?",
      a: "Automated software must never make unsupervised clinical decisions. Pharmacists and physicians understand patient context, clinical indications, and legitimate exceptions such as travel or damaged medication. The system provides decision support, not automated denial."
    },
    {
      q: "What evidence is recorded when medicines are handed over?",
      a: "Each completed transaction records the confirming pharmacist, timestamp, payment method, precise unit count, and optional photo verification taken with patient consent to ensure legal and clinical accountability."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-neutral-200">
      {/* SECTION 1: HERO (Above the fold per SKILL.md A2 & B5) */}
      <section className="pt-16 pb-20 px-4 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        {/* Proof pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-dark-card border border-dark-border mb-6">
          <span className="w-2 h-2 rounded-full bg-tealAccent-500 animate-ping"></span>
          <span className="caption-3 text-neutral-300">
            Active safety monitoring across 38 participating healthcare pharmacies
          </span>
        </div>

        {/* Headline with required dark theme gradient on text only (#FFFFFF -> #9B9B9B) */}
        <h1 className="heading-1 hero-gradient-text max-w-[680px] mb-6 tracking-tight">
          Prevent excessive medicine consumption with verified prescription monitoring
        </h1>

        {/* Subheadline max width 680px with natural breaks */}
        <p className="body-1 text-neutral-400 max-w-[680px] mb-8">
          A collaborative safety network connecting patients, medical stores, and prescribing physicians to identify unusual purchasing patterns before repeated excess causes harm.
        </p>

        {/* Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-12">
          <button
            onClick={handleStartDemo}
            className="button-md py-2 px-4 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white flex items-center gap-2 transition-hover shadow-lg"
          >
            <span>Launch pharmacist workspace</span>
            <ArrowRight size={18} weight="bold" />
          </button>

          <button
            onClick={handleLaunchScenario1}
            className="button-md py-2 px-4 rounded-xl bg-dark-card hover:bg-dark-surface border border-alertWarn-border text-alertWarn-text flex items-center gap-2 transition-hover"
          >
            <Warning size={18} weight="bold" />
            <span>Simulate early refill alert</span>
          </button>
        </div>

        {/* Hero Interactive UI Preview Card */}
        <div className="w-full max-w-4xl bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl text-left relative overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-alertCritical-badge"></div>
              <div className="w-3 h-3 rounded-full bg-alertWarn-badge"></div>
              <div className="w-3 h-3 rounded-full bg-tealAccent-500"></div>
              <span className="title-4 text-neutral-400 ml-2">AegisRx Clinical Verification Monitor</span>
            </div>
            <div className="caption-4 px-2.5 py-1 rounded bg-alertWarn-bg border border-alertWarn-border text-alertWarn-text font-semibold flex items-center gap-1.5">
              <Warning size={14} weight="bold" />
              <span>Early Refill Warning Detected</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-dark-base border border-dark-border rounded-xl p-4">
              <span className="caption-4 text-neutral-400">Patient Profile</span>
              <div className="title-3 text-white font-semibold mt-1">Eleanor Vance</div>
              <div className="caption-5 text-neutral-400 font-mono mt-0.5">ID: PT-8942-01 • +1 (555) 382 9104</div>
              <div className="caption-3 text-tealAccent-400 mt-2 flex items-center gap-1">
                <CheckCircle size={13} weight="bold" />
                <span>Cross store consent verified</span>
              </div>
            </div>

            <div className="bg-dark-base border border-dark-border rounded-xl p-4">
              <span className="caption-4 text-neutral-400">Prescription Details</span>
              <div className="title-3 text-white font-semibold mt-1">Example Medicine A</div>
              <div className="caption-5 text-neutral-300 mt-0.5">Prescribed: 1 tablet daily (15 total)</div>
              <div className="caption-4 text-neutral-400 mt-2">Dr. Sarah Lin (Pain Center)</div>
            </div>

            <div className="bg-dark-base border border-alertWarn-border rounded-xl p-4">
              <span className="caption-4 text-alertWarn-text font-semibold">Refill Discrepancy</span>
              <div className="title-2 text-alertWarn-text font-bold mt-1">3 Days Elapsed</div>
              <div className="caption-5 text-neutral-300 mt-0.5">Originally supplied for 15 days</div>
              <div className="caption-3 text-alertCritical-text font-semibold mt-2">
                Estimated rate: 5 units per day
              </div>
            </div>
          </div>

          <div className="bg-dark-base border border-dark-border rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-tealAccent-400">
                <Stethoscope size={22} />
              </div>
              <div>
                <div className="body-4 text-white font-semibold">Clinical Action Required</div>
                <div className="caption-5 text-neutral-400">
                  Do not dispense without patient discussion and prescribing physician coordination.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/intervention"
                className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 text-white transition-hover"
              >
                Open intervention log
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM TO SOLUTION */}
      <section className="py-16 px-4 bg-dark-base border-y border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-12">
            <span className="caption-3 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-tealAccent-400 inline-block mb-3">
              Understanding The Challenge
            </span>
            <h2 className="heading-3 text-white tracking-tight mb-4">
              Excess medicine consumption rarely stems from malicious intent
            </h2>
            <p className="body-2 text-neutral-400">
              When patients suffer from severe pain or discomfort, they may increase their daily intake beyond the prescribed dose. Without cross pharmacy visibility, these patterns remain hidden until acute physical harm occurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <div className="title-4 text-alertCritical-text font-semibold mb-2 flex items-center gap-2">
                <Warning size={18} />
                <span>The Traditional Gap in Care</span>
              </div>
              <ul className="space-y-3 caption-1 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-alertCritical-text font-bold">•</span>
                  <span>Isolated pharmacy records fail to identify patients visiting multiple stores to collect the same medicine.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-alertCritical-text font-bold">•</span>
                  <span>Early refill attempts are treated either with silent dispensing or confrontational outright refusal.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-alertCritical-text font-bold">•</span>
                  <span>Prescribing doctors receive zero notifications when patients deplete a month long therapy in under a week.</span>
                </li>
              </ul>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <div className="title-4 text-tealAccent-400 font-semibold mb-2 flex items-center gap-2">
                <ShieldCheck size={18} />
                <span>The AegisRx Collaborative Solution</span>
              </div>
              <ul className="space-y-3 caption-1 text-neutral-300">
                <li className="flex items-start gap-2">
                  <span className="text-tealAccent-400 font-bold">•</span>
                  <span>A unified, privacy compliant ledger tracks units dispensed across all participating medical locations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tealAccent-400 font-bold">•</span>
                  <span>Mathematical supply calculations flag unusually early requests against actual prescribed durations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-tealAccent-400 font-bold">•</span>
                  <span>Structured human intervention workflows connect pharmacists and physicians to adjust dosage safely.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CORE BENEFITS (3 to 5 outcome driven per SKILL.md A2 & B8) */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="caption-3 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-tealAccent-400 inline-block mb-3">
            Platform Capabilities
          </span>
          <h2 className="heading-3 text-white tracking-tight mb-4">
            Engineered for patient safety and clinical continuity
          </h2>
          <p className="body-3 text-neutral-400">
            Every feature is designed to clarify medicine status without creating administrative burden or treating patients unfairly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Benefit 1 */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-dark-base border border-dark-border flex items-center justify-center text-tealAccent-400 mb-4">
                <Clock size={24} weight="bold" />
              </div>
              <h3 className="title-2 text-white font-semibold mb-2">
                Early refill detection
              </h3>
              <p className="body-6 text-neutral-400">
                Automatically calculates expected supply durations. When a 15 day prescription is requested on Day 4, the platform flags the record instantly with calculated apparent usage rates.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-dark-border caption-4 text-tealAccent-400 font-semibold">
              Prevents hidden overconsumption
            </div>
          </div>

          {/* Benefit 2 */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-dark-base border border-dark-border flex items-center justify-center text-tealAccent-400 mb-4">
                <Pill size={24} weight="bold" />
              </div>
              <h3 className="title-2 text-white font-semibold mb-2">
                Partial collection engine
              </h3>
              <p className="body-6 text-neutral-400">
                Supports flexible staging. Patients can collect 5 tablets today and return later for the remaining 10. The platform maintains exact balances and never confuses collection with consumption.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-dark-border caption-4 text-tealAccent-400 font-semibold">
              Accurate remaining claim tracking
            </div>
          </div>

          {/* Benefit 3 */}
          <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-dark-base border border-dark-border flex items-center justify-center text-tealAccent-400 mb-4">
                <UsersThree size={24} weight="bold" />
              </div>
              <h3 className="title-2 text-white font-semibold mb-2">
                Supportive clinical intervention
              </h3>
              <p className="body-6 text-neutral-400">
                Pharmacists record patient reported reasons such as uncontrolled pain or lost tablets, refer cases to the prescribing doctor, and log agreed care adjustments with zero punitive hostility.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-dark-border caption-4 text-tealAccent-400 font-semibold">
              Safe human centered resolution
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MANDATORY TAGLINE REVEAL (SKILL.md B11) */}
      <TaglineReveal text="Preventing excessive medicine purchases through verified cross pharmacy dispensing, early refill detection, and timely human intervention." />

      {/* SECTION 5: HOW IT WORKS (3 steps per SKILL.md A2) */}
      <section className="py-20 px-4 bg-dark-base border-y border-dark-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="caption-3 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-tealAccent-400 inline-block mb-3">
              Operational Workflow
            </span>
            <h2 className="heading-3 text-white tracking-tight mb-4">
              How the platform protects patients across three simple steps
            </h2>
            <p className="body-3 text-neutral-400">
              From prescription verification at intake to cross store dispensing and clinical review.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 relative">
              <div className="caption-3 text-tealAccent-400 font-mono mb-2">Step 01</div>
              <h3 className="title-2 text-white font-semibold mb-2">Verify and Scan</h3>
              <p className="body-6 text-neutral-400 mb-4">
                The pharmacist scans the doctor prescription or verifies digital records. OCR extracts dosage instructions, total units, and patient identification, requiring manual pharmacist confirmation.
              </p>
              <div className="caption-4 text-neutral-300 bg-dark-base p-2.5 rounded-lg border border-dark-border">
                Confirmed: 15 tablets • 1 tablet daily
              </div>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 relative">
              <div className="caption-3 text-tealAccent-400 font-mono mb-2">Step 02</div>
              <h3 className="title-2 text-white font-semibold mb-2">Dispense and Record</h3>
              <p className="body-6 text-neutral-400 mb-4">
                The patient collects all units or a partial amount. Payment is confirmed, handed over units are timestamped, and optional photo verification is captured with patient consent.
              </p>
              <div className="caption-4 text-neutral-300 bg-dark-base p-2.5 rounded-lg border border-dark-border">
                Recorded: Store A • Units delivered: 15
              </div>
            </div>

            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 relative">
              <div className="caption-3 text-tealAccent-400 font-mono mb-2">Step 03</div>
              <h3 className="title-2 text-white font-semibold mb-2">Monitor and Intervene</h3>
              <p className="body-6 text-neutral-400 mb-4">
                If the patient returns unusually early at any participating medical store, the engine alerts the pharmacist. The pharmacist reviews previous transactions and refers to the doctor.
              </p>
              <div className="caption-4 text-alertWarn-text bg-alertWarn-bg p-2.5 rounded-lg border border-alertWarn-border">
                Early refill alert: 3 of 15 days elapsed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: DEMONSTRATION SCENARIOS WALKTHROUGH */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mb-12">
          <span className="caption-3 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-tealAccent-400 inline-block mb-3">
            Real Scenario Walkthrough
          </span>
          <h2 className="heading-3 text-white tracking-tight mb-4">
            Test the live demonstration cases
          </h2>
          <p className="body-2 text-neutral-400">
            The platform is preloaded with realistic test patients illustrating early refill warnings and partial collection tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scenario 1 Card */}
          <div className="bg-dark-card border border-alertWarn-border rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="caption-3 px-2.5 py-1 rounded bg-alertWarn-bg border border-alertWarn-border text-alertWarn-text font-semibold flex items-center gap-1">
                  <Warning size={14} />
                  <span>Scenario 1 • Early Refill Warning</span>
                </span>
                <span className="caption-4 text-neutral-400 font-mono">Patient: Eleanor Vance</span>
              </div>
              <h3 className="title-1 text-white font-semibold mb-2">
                15 tablets prescribed for 15 days, returned on Day 4
              </h3>
              <p className="body-5 text-neutral-300 mb-4">
                Patient collected 15 tablets at Store A on Day 1. On Day 4, patient requests another 15 tablets at Store B. The system triggers an Early Refill Warning because 12 days of supply remain unaccounted for.
              </p>
              <div className="bg-dark-base border border-dark-border rounded-xl p-3 text-xs font-mono space-y-1 text-neutral-300">
                <div>• Day 1: Dispensed 15 units at Store A (Metro Care)</div>
                <div>• Day 4: Attempted refill at Store B (Central Health)</div>
                <div className="text-alertWarn-text">• Result: EARLY REFILL WARNING (5 units/day apparent rate)</div>
              </div>
            </div>
            <button
              onClick={handleLaunchScenario1}
              className="mt-6 button-md py-2 px-3 rounded-xl bg-alertWarn-badge hover:bg-yellow-500 text-black font-semibold flex items-center justify-center gap-2 transition-hover"
            >
              <span>Examine Eleanor Vance early refill alert</span>
              <ArrowRight size={16} weight="bold" />
            </button>
          </div>

          {/* Scenario 2 Card */}
          <div className="bg-dark-card border border-tealAccent-700/60 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="caption-3 px-2.5 py-1 rounded bg-tealAccent-900/50 border border-tealAccent-700 text-tealAccent-300 font-semibold flex items-center gap-1">
                  <Pill size={14} />
                  <span>Scenario 2 • Partial Collection</span>
                </span>
                <span className="caption-4 text-neutral-400 font-mono">Patient: Marcus Chen</span>
              </div>
              <h3 className="title-1 text-white font-semibold mb-2">
                Prescribed 15 units, collected 5 units, 10 units remaining
              </h3>
              <p className="body-5 text-neutral-300 mb-4">
                Patient preferred collecting only 5 units on visit one. The system precisely tracks 10 undispensed units, records the partial payment, and keeps the prescription active for completion.
              </p>
              <div className="bg-dark-base border border-dark-border rounded-xl p-3 text-xs font-mono space-y-1 text-neutral-300">
                <div>• Prescribed Total: 15 tablets</div>
                <div>• First Dispense: 5 tablets collected</div>
                <div className="text-tealAccent-400">• Remaining Balance: 10 tablets active in claim</div>
              </div>
            </div>
            <Link
              to="/partial-collection"
              className="mt-6 button-md py-2 px-3 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center justify-center gap-2 transition-hover"
            >
              <span>Manage Marcus Chen partial collection</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: FAQ (6 to 12 questions with interactive accordion per SKILL.md A2) */}
      <section className="py-20 px-4 bg-dark-base border-t border-dark-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="caption-3 px-3 py-1 rounded-full bg-dark-card border border-dark-border text-tealAccent-400 inline-block mb-3">
              Questions and Answers
            </span>
            <h2 className="heading-3 text-white tracking-tight mb-4">
              Frequently asked clinical questions
            </h2>
            <p className="body-3 text-neutral-400">
              Clear information regarding prescription safety and monitoring practices.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-dark-card border border-dark-border rounded-xl overflow-hidden transition-base"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 text-white hover:text-tealAccent-300 transition-hover"
                  >
                    <span className="title-3 font-semibold">{faq.q}</span>
                    <CaretDown
                      size={18}
                      className={`text-neutral-400 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-tealAccent-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-neutral-300 body-5 border-t border-dark-border/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CTA & RISK REVERSAL (SKILL.md A2) */}
      <section className="py-20 px-4 max-w-5xl mx-auto w-full text-center">
        <div className="bg-dark-card border border-dark-border rounded-3xl p-10 relative overflow-hidden shadow-2xl">
          <span className="caption-3 px-3 py-1 rounded-full bg-dark-base border border-dark-border text-tealAccent-400 inline-block mb-4">
            Interactive Product Evaluation
          </span>
          <h2 className="heading-2 hero-gradient-text tracking-tight mb-4 max-w-xl mx-auto">
            Experience verified prescription monitoring in action
          </h2>
          <p className="body-2 text-neutral-400 max-w-lg mx-auto mb-8">
            Access the pharmacist terminal, test the partial collection engine, and review clinical doctor referral workflows right now.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <button
              onClick={handleStartDemo}
              className="button-md py-2 px-5 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white flex items-center gap-2 transition-hover"
            >
              <span>Open pharmacist terminal</span>
              <ArrowRight size={18} weight="bold" />
            </button>
            <Link
              to="/doctor-dashboard"
              className="button-md py-2 px-4 rounded-xl bg-dark-base hover:bg-dark-surface border border-dark-border text-neutral-200 transition-hover"
            >
              View doctor referrals
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 caption-4 text-neutral-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-tealAccent-400" />
              <span>Preloaded realistic demonstration records</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle size={15} className="text-tealAccent-400" />
              <span>Full cross pharmacy simulation</span>
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
