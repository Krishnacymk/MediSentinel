import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  User,
  List,
  X,
  MapPin,
  Buildings,
  Gear,
  ArrowRight
} from '@phosphor-icons/react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useApp();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const baseNavLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Find Stores', path: '/find-stores' },
    { label: 'Pharmacist Hub', path: '/pharmacist-dashboard' },
    { label: 'Scan Script', path: '/prescription-scan' },
    { label: 'Dispense', path: '/dispense' },
    { label: 'Early Refill Alerts', path: '/early-refill-alerts' },
    { label: 'Doctor Review', path: '/doctor-dashboard' },
    { label: 'Patient Portal', path: '/patient-dashboard' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="sticky top-3 z-40 px-4 max-w-7xl mx-auto w-full">
        {/* Floating compact navigation bar */}
        <nav
          aria-label="Main Navigation"
          className="bg-dark-base/90 backdrop-blur-md border border-dark-border rounded-2xl px-4 py-2 flex items-center justify-between shadow-2xl transition-base"
        >
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-tealAccent-400 group-hover:border-tealAccent-500 transition-hover">
              <ShieldCheck size={20} weight="bold" />
            </div>
            <div className="flex flex-col">
              <span className="title-3 font-bold tracking-tight text-white flex items-center gap-1.5">
                AegisRx
                <span className="caption-5 px-1.5 py-0.2 rounded bg-tealAccent-950 text-tealAccent-300 border border-tealAccent-800">
                  Safety Core
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {baseNavLinks.slice(0, 6).map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`title-4 px-3 py-1.5 rounded-lg transition-hover whitespace-nowrap ${
                    active
                      ? 'bg-dark-card text-tealAccent-300 font-semibold border border-dark-border'
                      : 'text-neutral-400 hover:text-white hover:bg-dark-card/50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Role specific quick action buttons */}
          <div className="hidden md:flex items-center gap-2">
            {/* Pharmacist "My Store Location" */}
            {currentUser.role === 'pharmacist' && (
              <Link
                to="/my-store-location"
                className={`caption-3 py-1.5 px-3 rounded-lg border flex items-center gap-1.5 transition-hover ${
                  isActive('/my-store-location')
                    ? 'bg-dark-card border-tealAccent-600 text-tealAccent-300 font-semibold'
                    : 'bg-dark-base border-dark-border text-neutral-300 hover:text-white'
                }`}
                title="Manage your pharmacy GPS location and business hours"
              >
                <Buildings size={15} />
                <span>My Store Location</span>
              </Link>
            )}

            {/* Patient "Find Medical Stores" */}
            {currentUser.role === 'patient' && (
              <Link
                to="/find-stores"
                className={`caption-3 py-1.5 px-3 rounded-lg border flex items-center gap-1.5 transition-hover ${
                  isActive('/find-stores')
                    ? 'bg-dark-card border-tealAccent-600 text-tealAccent-300 font-semibold'
                    : 'bg-dark-base border-dark-border text-neutral-300 hover:text-white'
                }`}
              >
                <MapPin size={15} className="text-tealAccent-400" />
                <span>Find Medical Stores</span>
              </Link>
            )}

            {/* Admin "Pharmacy Locations" */}
            {currentUser.role === 'admin' && (
              <Link
                to="/admin"
                className="caption-3 py-1.5 px-3 rounded-lg bg-dark-base border border-dark-border text-neutral-300 hover:text-white flex items-center gap-1.5 transition-hover"
                title="Manage registered participating pharmacy locations"
              >
                <MapPin size={15} className="text-tealAccent-400" />
                <span>Pharmacy Locations</span>
              </Link>
            )}

            <Link
              to="/admin"
              className="caption-3 p-2 rounded-lg bg-dark-card hover:bg-dark-surface border border-dark-border text-neutral-300 hover:text-white transition-hover"
              title="System administration and monitoring parameters"
            >
              <Gear size={16} />
            </Link>

            <Link
              to="/login"
              className="button-sm py-2 px-3 rounded-lg bg-tealAccent-600 hover:bg-tealAccent-500 active:scale-98 text-white flex items-center gap-1.5 transition-hover shadow-sm"
            >
              <User size={15} weight="bold" />
              <span>{currentUser.name.split(' ')[0]} ({currentUser.role})</span>
              <ArrowRight size={13} weight="bold" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="xl:hidden p-2 rounded-lg bg-dark-card border border-dark-border text-neutral-200 hover:text-white transition-hover"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span
                className={`absolute transition-all duration-300 ease-base-curve ${
                  mobileMenuOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                }`}
              >
                <List size={20} weight="bold" />
              </span>
              <span
                className={`absolute transition-all duration-300 ease-base-curve ${
                  mobileMenuOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                }`}
              >
                <X size={20} weight="bold" />
              </span>
            </div>
          </button>
        </nav>
      </header>

      {/* Full Height Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex flex-col bg-dark-bg/95 backdrop-blur-xl transition-base">
          <div className="p-4 flex items-center justify-between border-b border-dark-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center text-tealAccent-400">
                <ShieldCheck size={20} weight="bold" />
              </div>
              <span className="title-2 font-bold text-white">AegisRx Safety</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg bg-dark-card border border-dark-border text-neutral-200"
              aria-label="Close navigation"
            >
              <X size={20} weight="bold" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-2.5">
            <span className="caption-4 text-neutral-400 uppercase tracking-wider">Navigation</span>
            {[
              ...baseNavLinks,
              { label: 'Find Medical Stores (GPS Map)', path: '/find-stores' },
              { label: 'My Store Location (Pharmacist)', path: '/my-store-location' },
              { label: 'Patient Medicine History', path: '/patient-history' },
              { label: 'Partial Collection Management', path: '/partial-collection' },
              { label: 'Transaction Audit Log', path: '/transactions' },
              { label: 'Collection Verification', path: '/collection-verification' },
              { label: 'Pharmacist Clinical Intervention', path: '/intervention' },
              { label: 'Pharmacy Locations & System Admin', path: '/admin' },
              { label: 'Role Switcher & Sign In', path: '/login' },
            ].map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  animationDelay: `${index * 40}ms`,
                }}
                className={`title-3 py-2.5 px-3.5 rounded-xl border flex items-center justify-between transition-hover ${
                  isActive(item.path)
                    ? 'bg-dark-card border-tealAccent-600 text-tealAccent-300 font-semibold'
                    : 'border-dark-border bg-dark-base text-neutral-300 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                <ArrowRight size={16} />
              </Link>
            ))}
          </div>

          <div className="p-4 border-t border-dark-border bg-dark-base">
            <div className="caption-3 text-neutral-400">Logged in persona:</div>
            <div className="body-4 text-white font-semibold">{currentUser.name}</div>
            <div className="caption-4 text-tealAccent-400 capitalize">{currentUser.role} portal active</div>
          </div>
        </div>
      )}
    </>
  );
};
