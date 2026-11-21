import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoScenarioBar } from './components/DemoScenarioBar';
import { CookieConsent } from './components/CookieConsent';
import { SkipToContent } from './components/SkipToContent';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { PharmacistDashboard } from './pages/PharmacistDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { PatientDashboard } from './pages/PatientDashboard';
import { PrescriptionScanPage } from './pages/PrescriptionScanPage';
import { DispensingPage } from './pages/DispensingPage';
import { PartialCollectionPage } from './pages/PartialCollectionPage';
import { PatientHistoryPage } from './pages/PatientHistoryPage';
import { EarlyRefillAlertsPage } from './pages/EarlyRefillAlertsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CollectionVerificationPage } from './pages/CollectionVerificationPage';
import { InterventionPage } from './pages/InterventionPage';
import { AdminPage } from './pages/AdminPage';
import { FindMedicalStoresPage } from './pages/FindMedicalStoresPage';
import { MyStoreLocationPage } from './pages/MyStoreLocationPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-dark-bg text-neutral-200">
          <SkipToContent />
          <DemoScenarioBar />
          <Navbar />
          <main id="main-content" className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/pharmacist-dashboard" element={<PharmacistDashboard />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/prescription-scan" element={<PrescriptionScanPage />} />
              <Route path="/dispense" element={<DispensingPage />} />
              <Route path="/partial-collection" element={<PartialCollectionPage />} />
              <Route path="/patient-history" element={<PatientHistoryPage />} />
              <Route path="/early-refill-alerts" element={<EarlyRefillAlertsPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
              <Route path="/collection-verification" element={<CollectionVerificationPage />} />
              <Route path="/intervention" element={<InterventionPage />} />
              <Route path="/find-stores" element={<FindMedicalStoresPage />} />
              <Route path="/my-store-location" element={<MyStoreLocationPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <CookieConsent />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
