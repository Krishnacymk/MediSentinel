import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  ShieldCheck,
  User,
  Stethoscope,
  Pill,
  Gear,
  CheckCircle,
  ArrowRight,
  LockKey
} from '@phosphor-icons/react';

export const LoginPage: React.FC = () => {
  const { currentUser, users, setCurrentUser, addPatient } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('demoSecurePassword123');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [errorMessage, setErrorMessage] = useState('');

  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regDob, setRegDob] = useState('1990-01-01');
  const [regNationalId, setRegNationalId] = useState('');
  const [regConsent, setRegConsent] = useState(true);
  const [regSuccess, setRegSuccess] = useState('');

  const handleQuickLogin = (role: UserRole) => {
    const user = users.find(u => u.role === role);
    if (user) {
      setCurrentUser(user);
      if (role === 'pharmacist') navigate('/pharmacist-dashboard');
      else if (role === 'doctor') navigate('/doctor-dashboard');
      else if (role === 'patient') navigate('/patient-dashboard');
      else if (role === 'admin') navigate('/admin');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please provide a valid corporate or clinical email address.');
      return;
    }

    const matchedUser = users.find(u => u.role === selectedRole);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      if (selectedRole === 'pharmacist') navigate('/pharmacist-dashboard');
      else if (selectedRole === 'doctor') navigate('/doctor-dashboard');
      else if (selectedRole === 'patient') navigate('/patient-dashboard');
      else if (selectedRole === 'admin') navigate('/admin');
    }
  };

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRegSuccess('');

    if (!regName.trim()) {
      setErrorMessage('Patient full legal name is required.');
      return;
    }
    if (!regMobile.trim() || regMobile.length < 10) {
      setErrorMessage('A valid mobile contact number is required for verification.');
      return;
    }

    const created = addPatient({
      name: regName.trim(),
      mobile: regMobile.trim(),
      dob: regDob,
      nationalId: regNationalId || `NAT-${Math.floor(100 + Math.random() * 900)}`,
      emergencyContact: 'Family Member contact listed',
      address: 'Registered medical address on file',
      crossPharmacyConsent: regConsent,
      monitoringStatus: 'normal',
      notes: 'Newly registered patient via clinical registration portal.'
    });

    setRegSuccess(`Patient registered successfully. Unique ID assigned: ${created.id}`);
    setRegName('');
    setRegMobile('');
  };

  return (
    <div className="min-h-screen bg-dark-bg py-12 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-dark-card border border-dark-border mx-auto flex items-center justify-center text-tealAccent-400 mb-3 shadow-md">
            <ShieldCheck size={28} weight="bold" />
          </div>
          <h1 className="heading-4 text-white font-semibold tracking-tight">
            AegisRx Portal Authentication
          </h1>
          <p className="body-5 text-neutral-400 mt-1">
            Access secure prescription verification and monitoring
          </p>
        </div>

        {/* Quick Role Selection Cards (One Click for immediate demo evaluation) */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-4 mb-6 shadow-xl">
          <span className="caption-3 uppercase tracking-wider text-neutral-400 block mb-3">
            Instant Demo Role Switcher
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('pharmacist')}
              className="p-3 rounded-xl bg-dark-base hover:bg-dark-surface border border-tealAccent-800/60 hover:border-tealAccent-600 text-left transition-hover flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <Pill size={18} className="text-tealAccent-400" />
                <span className="caption-5 px-1.5 py-0.2 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
                  Primary
                </span>
              </div>
              <div className="title-4 text-white font-semibold">Pharmacist</div>
              <div className="caption-5 text-neutral-400 truncate">James Thorne, RPh</div>
            </button>

            <button
              onClick={() => handleQuickLogin('doctor')}
              className="p-3 rounded-xl bg-dark-base hover:bg-dark-surface border border-dark-border hover:border-neutral-500 text-left transition-hover flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <Stethoscope size={18} className="text-tealAccent-400" />
                <span className="caption-5 px-1.5 py-0.2 rounded bg-dark-card text-neutral-300">
                  Clinical
                </span>
              </div>
              <div className="title-4 text-white font-semibold">Doctor</div>
              <div className="caption-5 text-neutral-400 truncate">Dr. Sarah Lin, MD</div>
            </button>

            <button
              onClick={() => handleQuickLogin('patient')}
              className="p-3 rounded-xl bg-dark-base hover:bg-dark-surface border border-dark-border hover:border-neutral-500 text-left transition-hover flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <User size={18} className="text-tealAccent-400" />
                <span className="caption-5 px-1.5 py-0.2 rounded bg-dark-card text-neutral-300">
                  Patient
                </span>
              </div>
              <div className="title-4 text-white font-semibold">Patient 01</div>
              <div className="caption-5 text-neutral-400 truncate">Eleanor Vance</div>
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-3 rounded-xl bg-dark-base hover:bg-dark-surface border border-dark-border hover:border-neutral-500 text-left transition-hover flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <Gear size={18} className="text-tealAccent-400" />
                <span className="caption-5 px-1.5 py-0.2 rounded bg-dark-card text-neutral-300">
                  Admin
                </span>
              </div>
              <div className="title-4 text-white font-semibold">Compliance</div>
              <div className="caption-5 text-neutral-400 truncate">Helena Brooks</div>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl">
          <div className="flex border-b border-dark-border pb-4 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 pb-2 title-4 text-center font-semibold transition-hover ${
                activeTab === 'login'
                  ? 'text-tealAccent-400 border-b-2 border-tealAccent-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 pb-2 title-4 text-center font-semibold transition-hover ${
                activeTab === 'register'
                  ? 'text-tealAccent-400 border-b-2 border-tealAccent-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Patient Registration
            </button>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-alertCritical-bg border border-alertCritical-border text-alertCritical-text caption-2">
              {errorMessage}
            </div>
          )}

          {regSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-tealAccent-950 border border-tealAccent-800 text-tealAccent-300 caption-2">
              {regSuccess}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="caption-3 text-neutral-300 block mb-1.5">
                  Select System Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                >
                  <option value="pharmacist">Pharmacist (Prescription Verification and Dispensing)</option>
                  <option value="doctor">Prescribing Doctor (Review and Approvals)</option>
                  <option value="patient">Patient (Medicine History and Schedule)</option>
                  <option value="admin">System Administrator (Thresholds and Logs)</option>
                </select>
              </div>

              <div>
                <label className="caption-3 text-neutral-300 block mb-1.5">
                  Corporate or Health Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                />
              </div>

              <div>
                <label className="caption-3 text-neutral-300 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                  <LockKey size={16} className="absolute right-3 top-3 text-neutral-400" />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full button-md py-2 px-3 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center justify-center gap-2 transition-hover shadow-md"
                >
                  <span>Authenticate and open portal</span>
                  <ArrowRight size={16} weight="bold" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterPatient} className="space-y-4">
              <div>
                <label className="caption-3 text-neutral-300 block mb-1.5">
                  Patient Full Legal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Harrison"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                />
              </div>

              <div>
                <label className="caption-3 text-neutral-300 block mb-1.5">
                  Mobile Number (Cross Store Verification Key)
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000 0000"
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="caption-3 text-neutral-300 block mb-1.5">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={regDob}
                    onChange={(e) => setRegDob(e.target.value)}
                    className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
                <div>
                  <label className="caption-3 text-neutral-300 block mb-1.5">
                    National ID / SSN Last 4
                  </label>
                  <input
                    type="text"
                    placeholder="NAT-904"
                    value={regNationalId}
                    onChange={(e) => setRegNationalId(e.target.value)}
                    className="w-full bg-dark-base border border-dark-border rounded-xl px-3 py-2 text-white body-5 focus:outline-none focus:border-tealAccent-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={regConsent}
                    onChange={(e) => setRegConsent(e.target.checked)}
                    className="mt-1 rounded bg-dark-base border-dark-border text-tealAccent-500 focus:ring-tealAccent-500"
                  />
                  <span className="caption-4 text-neutral-300">
                    Patient consents to shared prescription dispensing records across participating pharmacies for safety monitoring.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full button-md py-2 px-3 rounded-xl bg-tealAccent-600 hover:bg-tealAccent-500 text-white font-semibold flex items-center justify-center gap-2 transition-hover"
                >
                  <span>Register patient into network</span>
                  <CheckCircle size={16} weight="bold" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
