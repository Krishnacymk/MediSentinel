import React from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Warning,
  Pill,
  ArrowsClockwise,
  UserGear,
  CheckCircle,
  Buildings
} from '@phosphor-icons/react';
import { UserRole } from '../types';

export const DemoScenarioBar: React.FC = () => {
  const {
    currentUser,
    switchUserRole,
    activePharmacyName,
    setActivePharmacyName,
    resetDemonstrationState,
    alerts
  } = useApp();
  const navigate = useNavigate();

  const handleScenario1Click = () => {
    switchUserRole('pharmacist');
    setActivePharmacyName('Store B (Central Health Drugstore)');
    navigate('/early-refill-alerts');
  };

  const handleScenario2Click = () => {
    switchUserRole('pharmacist');
    setActivePharmacyName('Store A (Metro Care Pharmacy)');
    navigate('/partial-collection');
  };

  const unreviewedAlertsCount = alerts.filter(a => a.status === 'pending_review').length;

  return (
    <aside aria-label="Interactive demonstration controls" className="bg-dark-base border-b border-dark-border text-xs py-2 px-4 transition-base">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Scenario Quick Launch */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="caption-3 text-tealAccent-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-tealAccent-500 animate-pulse"></span>
            Demo Scenarios:
          </span>

          <button
            onClick={handleScenario1Click}
            className="button-xsm py-1 px-2.5 rounded-md bg-dark-card hover:bg-dark-surface border border-alertWarn-border text-alertWarn-text flex items-center gap-1.5 transition-hover"
            title="Load Demo Patient 01 with 15 tablets returned after 3 days"
          >
            <Warning size={14} weight="bold" />
            <span>Scenario 1: Early Refill Warning</span>
            {unreviewedAlertsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-alertWarn-badge text-black font-semibold text-[10px]">
                {unreviewedAlertsCount} active
              </span>
            )}
          </button>

          <button
            onClick={handleScenario2Click}
            className="button-xsm py-1 px-2.5 rounded-md bg-dark-card hover:bg-dark-surface border border-dark-border text-neutral-200 flex items-center gap-1.5 transition-hover"
            title="Load Demo Patient 02 with 5 of 15 tablets collected"
          >
            <Pill size={14} weight="bold" className="text-tealAccent-400" />
            <span>Scenario 2: Partial Collection (5 of 15)</span>
          </button>

          {/* Active Store Switcher */}
          <div className="hidden lg:flex items-center gap-1 text-neutral-400 pl-2 border-l border-dark-border">
            <Buildings size={13} />
            <span className="caption-4 text-neutral-400">Current store:</span>
            <select
              value={activePharmacyName}
              onChange={(e) => setActivePharmacyName(e.target.value)}
              className="bg-dark-surface border border-dark-border text-neutral-200 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-tealAccent-500"
            >
              <option value="Store A (Metro Care Pharmacy)">Store A (Metro Care Pharmacy)</option>
              <option value="Store B (Central Health Drugstore)">Store B (Central Health Drugstore)</option>
            </select>
          </div>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex items-center gap-2">
          <span className="caption-4 text-neutral-400 hidden sm:inline">Active persona:</span>
          <div className="inline-flex rounded-lg border border-dark-border bg-dark-card p-0.5">
            {(['patient', 'pharmacist', 'doctor', 'admin'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  switchUserRole(role);
                  if (role === 'patient') navigate('/patient-dashboard');
                  else if (role === 'pharmacist') navigate('/pharmacist-dashboard');
                  else if (role === 'doctor') navigate('/doctor-dashboard');
                  else if (role === 'admin') navigate('/admin');
                }}
                className={`caption-3 px-2 py-1 rounded capitalize transition-hover ${
                  currentUser.role === role
                    ? 'bg-tealAccent-600 text-white font-semibold'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (window.confirm('Reset all demonstration records to initial state?')) {
                resetDemonstrationState();
                navigate('/');
              }
            }}
            className="caption-4 text-neutral-400 hover:text-neutral-200 p-1 rounded hover:bg-dark-surface flex items-center gap-1 transition-hover"
            title="Reset demonstration state"
          >
            <ArrowsClockwise size={13} />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
