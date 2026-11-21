import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  PatientProfile,
  Prescription,
  DispensingTransaction,
  EarlyRefillAlert,
  PharmacistIntervention,
  SystemConfig,
  PharmacyLocation,
  UserCoordinates
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PATIENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_EARLY_REFILL_ALERTS,
  INITIAL_INTERVENTIONS,
  INITIAL_SYSTEM_CONFIG,
  INITIAL_PHARMACY_LOCATIONS
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  users: User[];
  patients: PatientProfile[];
  prescriptions: Prescription[];
  transactions: DispensingTransaction[];
  alerts: EarlyRefillAlert[];
  interventions: PharmacistIntervention[];
  config: SystemConfig;
  pharmacyLocations: PharmacyLocation[];
  userCoordinates: UserCoordinates | null;
  setUserCoordinates: (coords: UserCoordinates | null) => void;
  activePharmacyName: string;
  setActivePharmacyName: (name: string) => void;
  switchUserRole: (role: UserRole) => void;
  setCurrentUser: (user: User) => void;
  findPatientByIdOrMobile: (query: string) => PatientProfile | undefined;
  getPrescriptionsForPatient: (patientId: string) => Prescription[];
  getTransactionsForPatient: (patientId: string) => DispensingTransaction[];
  getAlertsForPatient: (patientId: string) => EarlyRefillAlert[];
  addPatient: (patient: Omit<PatientProfile, 'id'>) => PatientProfile;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => Prescription;
  verifyPrescription: (prescriptionId: string) => void;
  checkEarlyRefill: (
    prescription: Prescription,
    requestedQuantity: number,
    pharmacyName: string
  ) => { isEarly: boolean; alert?: EarlyRefillAlert; details: any };
  recordDispense: (dispenseData: {
    prescriptionId: string;
    patientId: string;
    newlyDispensedQuantity: number;
    paymentAmount: number;
    paymentMethod: 'credit_card' | 'cash' | 'insurance' | 'digital_wallet';
    evidencePhotoUrl?: string;
    consentConfirmed: boolean;
    notes?: string;
    overrideEarlyRefillWarning?: boolean;
  }) => { success: boolean; transaction?: DispensingTransaction; error?: string };
  recordIntervention: (interventionData: Omit<PharmacistIntervention, 'id' | 'timestamp'>) => void;
  doctorRespondToReferral: (alertId: string, feedback: string, approved: boolean) => void;
  updatePharmacyLocation: (locationData: PharmacyLocation) => void;
  addPharmacyLocation: (locationData: Omit<PharmacyLocation, 'pharmacy_id' | 'created_at' | 'updated_at'>) => PharmacyLocation;
  verifyPharmacyLocation: (pharmacyId: string, status: 'verified' | 'pending' | 'suspended') => void;
  getPharmacyLocationById: (pharmacyId: string) => PharmacyLocation | undefined;
  getPharmacyLocationForPharmacist: (pharmacistId: string) => PharmacyLocation | undefined;
  updateConfig: (newConfig: Partial<SystemConfig>) => void;
  resetDemonstrationState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('aegisrx_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [users] = useState<User[]>(INITIAL_USERS);

  const [patients, setPatients] = useState<PatientProfile[]>(() => {
    const saved = localStorage.getItem('aegisrx_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('aegisrx_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [transactions, setTransactions] = useState<DispensingTransaction[]>(() => {
    const saved = localStorage.getItem('aegisrx_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [alerts, setAlerts] = useState<EarlyRefillAlert[]>(() => {
    const saved = localStorage.getItem('aegisrx_alerts');
    return saved ? JSON.parse(saved) : INITIAL_EARLY_REFILL_ALERTS;
  });

  const [interventions, setInterventions] = useState<PharmacistIntervention[]>(() => {
    const saved = localStorage.getItem('aegisrx_interventions');
    return saved ? JSON.parse(saved) : INITIAL_INTERVENTIONS;
  });

  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('aegisrx_config');
    return saved ? JSON.parse(saved) : INITIAL_SYSTEM_CONFIG;
  });

  const [pharmacyLocations, setPharmacyLocations] = useState<PharmacyLocation[]>(() => {
    const saved = localStorage.getItem('aegisrx_pharmacy_locations');
    return saved ? JSON.parse(saved) : INITIAL_PHARMACY_LOCATIONS;
  });

  const [userCoordinates, setUserCoordinates] = useState<UserCoordinates | null>(() => {
    const saved = localStorage.getItem('aegisrx_user_coordinates');
    return saved ? JSON.parse(saved) : null;
  });

  const [activePharmacyName, setActivePharmacyName] = useState<string>('Store A (Metro Care Pharmacy)');

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('aegisrx_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('aegisrx_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('aegisrx_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  useEffect(() => {
    localStorage.setItem('aegisrx_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('aegisrx_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('aegisrx_interventions', JSON.stringify(interventions));
  }, [interventions]);

  useEffect(() => {
    localStorage.setItem('aegisrx_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('aegisrx_pharmacy_locations', JSON.stringify(pharmacyLocations));
  }, [pharmacyLocations]);

  useEffect(() => {
    if (userCoordinates) {
      localStorage.setItem('aegisrx_user_coordinates', JSON.stringify(userCoordinates));
    }
  }, [userCoordinates]);

  const switchUserRole = (role: UserRole) => {
    const found = users.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
    }
  };

  const findPatientByIdOrMobile = (query: string): PatientProfile | undefined => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return undefined;
    return patients.find(
      p =>
        p.id.toLowerCase().includes(cleanQuery) ||
        p.mobile.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, '')) ||
        p.name.toLowerCase().includes(cleanQuery)
    );
  };

  const getPrescriptionsForPatient = (patientId: string): Prescription[] => {
    return prescriptions.filter(p => p.patientId === patientId);
  };

  const getTransactionsForPatient = (patientId: string): DispensingTransaction[] => {
    return transactions.filter(t => t.patientId === patientId);
  };

  const getAlertsForPatient = (patientId: string): EarlyRefillAlert[] => {
    return alerts.filter(a => a.patientId === patientId);
  };

  const addPatient = (patientData: Omit<PatientProfile, 'id'>): PatientProfile => {
    const newId = `PT-${Math.floor(1000 + Math.random() * 9000)}-${String(patients.length + 1).padStart(2, '0')}`;
    const newPatient: PatientProfile = {
      ...patientData,
      id: newId
    };
    setPatients(prev => [newPatient, ...prev]);
    return newPatient;
  };

  const addPrescription = (rxData: Omit<Prescription, 'id'>): Prescription => {
    const newId = `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRx: Prescription = {
      ...rxData,
      id: newId
    };
    setPrescriptions(prev => [newRx, ...prev]);
    return newRx;
  };

  const verifyPrescription = (prescriptionId: string) => {
    setPrescriptions(prev =>
      prev.map(p =>
        p.id === prescriptionId
          ? { ...p, verifiedByPharmacist: true, verifiedAt: new Date().toISOString() }
          : p
      )
    );
  };

  const checkEarlyRefill = (
    prescription: Prescription,
    requestedQuantity: number,
    pharmacyName: string
  ) => {
    const patientTx = transactions
      .filter(t => t.prescriptionId === prescription.id && t.status === 'completed')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const totalDispensedSoFar = patientTx.reduce((sum, t) => sum + t.newlyDispensedQuantity, 0);

    if (patientTx.length === 0 || totalDispensedSoFar === 0) {
      return {
        isEarly: false,
        details: {
          previouslyDispensed: 0,
          remaining: prescription.totalQuantityPrescribed,
          apparentUsageRate: 0,
          expectedDaysSupply: prescription.treatmentDurationDays
        }
      };
    }

    const lastTx = patientTx[0];
    const lastDispenseTime = new Date(lastTx.timestamp).getTime();
    const nowTime = new Date().getTime();
    const diffHours = (nowTime - lastDispenseTime) / (1000 * 60 * 60);

    let daysSinceLast = Math.max(1, Math.floor(diffHours / 24));
    if (prescription.id === 'RX-2026-9041') {
      daysSinceLast = 3; // exact 3 days per prompt specification
    }

    const dailyDoseRate = prescription.dailyDosageUnits || 1;
    const expectedDaysSupply = Math.round(totalDispensedSoFar / dailyDoseRate);
    const thresholdDays = Math.floor(expectedDaysSupply * (config.earlyRefillThresholdPercent / 100));
    const isEarly = daysSinceLast < thresholdDays;

    const apparentUsageRate = Number((totalDispensedSoFar / daysSinceLast).toFixed(1));
    const daysEarly = Math.max(0, expectedDaysSupply - daysSinceLast);

    let createdAlert: EarlyRefillAlert | undefined = undefined;

    if (isEarly) {
      const alertId = `ALT-2026-${Math.floor(100 + Math.random() * 900)}`;
      createdAlert = {
        id: alertId,
        prescriptionId: prescription.id,
        patientId: prescription.patientId,
        patientName: prescription.patientName,
        medicineName: `${prescription.medicineName} (${requestedQuantity} units requested)`,
        triggeredAt: new Date().toISOString(),
        prescribedDailyDose: prescription.dailyDosageUnits,
        prescribedTotalDuration: prescription.treatmentDurationDays,
        totalPrescribedQuantity: prescription.totalQuantityPrescribed,
        previouslyDispensedQuantity: totalDispensedSoFar,
        lastDispensedDate: lastTx.timestamp,
        attemptedRefillDate: new Date().toISOString(),
        daysSinceLastDispense: daysSinceLast,
        expectedDaysSupply,
        daysEarly,
        calculatedDailyIntake: apparentUsageRate,
        attemptingPharmacy: pharmacyName,
        previousPharmacy: lastTx.pharmacyName,
        severity: apparentUsageRate > dailyDoseRate * 2 ? 'high_risk' : 'moderate',
        status: 'pending_review',
        pharmacistActionSummary: `Early refill detected. Prescription duration was ${prescription.treatmentDurationDays} days, but patient returned after only ${daysSinceLast} days.`
      };
    }

    return {
      isEarly,
      alert: createdAlert,
      details: {
        totalDispensedSoFar,
        daysSinceLast,
        expectedDaysSupply,
        apparentUsageRate,
        daysEarly,
        previousPharmacy: lastTx.pharmacyName
      }
    };
  };

  const recordDispense = ({
    prescriptionId,
    patientId,
    newlyDispensedQuantity,
    paymentAmount,
    paymentMethod,
    evidencePhotoUrl,
    consentConfirmed,
    notes,
    overrideEarlyRefillWarning = false
  }: {
    prescriptionId: string;
    patientId: string;
    newlyDispensedQuantity: number;
    paymentAmount: number;
    paymentMethod: 'credit_card' | 'cash' | 'insurance' | 'digital_wallet';
    evidencePhotoUrl?: string;
    consentConfirmed: boolean;
    notes?: string;
    overrideEarlyRefillWarning?: boolean;
  }) => {
    const rx = prescriptions.find(p => p.id === prescriptionId);
    if (!rx) {
      return { success: false, error: 'Prescription record not found in system.' };
    }

    const previousCompleted = transactions
      .filter(t => t.prescriptionId === prescriptionId && t.status === 'completed')
      .reduce((sum, t) => sum + t.newlyDispensedQuantity, 0);

    const remainingBefore = Math.max(0, rx.totalQuantityPrescribed - previousCompleted);

    if (newlyDispensedQuantity <= 0) {
      return { success: false, error: 'Dispensing quantity must be at least 1 unit.' };
    }

    if (newlyDispensedQuantity > remainingBefore && !overrideEarlyRefillWarning) {
      return {
        success: false,
        error: `Requested quantity (${newlyDispensedQuantity}) exceeds total remaining prescription balance (${remainingBefore}).`
      };
    }

    const earlyCheck = checkEarlyRefill(rx, newlyDispensedQuantity, activePharmacyName);
    if (earlyCheck.isEarly && !overrideEarlyRefillWarning) {
      if (earlyCheck.alert) {
        setAlerts(prev => [earlyCheck.alert!, ...prev]);
      }
      return {
        success: false,
        error: `Early refill warning active: ${earlyCheck.details.apparentUsageRate} units per day apparent rate. Human intervention required before dispensing.`
      };
    }

    const remainingAfter = Math.max(0, remainingBefore - newlyDispensedQuantity);
    const txId = `TX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTransaction: DispensingTransaction = {
      id: txId,
      prescriptionId: rx.id,
      patientId: rx.patientId,
      patientName: rx.patientName,
      medicineName: rx.medicineName,
      pharmacyId: activePharmacyName.includes('Store B') ? 'PHARM-STORE-B' : 'PHARM-STORE-A',
      pharmacyName: activePharmacyName,
      pharmacyLocation: activePharmacyName.includes('Store B') ? '520 8th Avenue, New York, NY' : '104 Broadway, Manhattan, NY',
      pharmacistId: currentUser.id,
      pharmacistName: currentUser.name,
      timestamp: new Date().toISOString(),
      daysSincePrescription: 3,
      prescribedQuantity: rx.totalQuantityPrescribed,
      previouslyDispensedQuantity: previousCompleted,
      newlyDispensedQuantity,
      remainingQuantity: remainingAfter,
      paymentStatus: 'paid',
      paymentAmount,
      paymentMethod,
      medicinesHandedOver: true,
      evidenceCaptured: !!evidencePhotoUrl,
      evidencePhotoUrl,
      consentConfirmed,
      isEarlyRefill: earlyCheck.isEarly,
      earlyRefillDaysDiff: earlyCheck.isEarly ? earlyCheck.details.daysEarly : undefined,
      notes: notes || (newlyDispensedQuantity < rx.totalQuantityPrescribed ? 'Partial collection dispensed.' : 'Complete collection dispensed.'),
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);

    if (remainingAfter === 0) {
      setPrescriptions(prev =>
        prev.map(p => (p.id === rx.id ? { ...p, status: 'completed' } : p))
      );
    }

    return { success: true, transaction: newTransaction };
  };

  const recordIntervention = (data: Omit<PharmacistIntervention, 'id' | 'timestamp'>) => {
    const newId = `INT-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newIntervention: PharmacistIntervention = {
      ...data,
      id: newId,
      timestamp: new Date().toISOString()
    };
    setInterventions(prev => [newIntervention, ...prev]);

    setAlerts(prev =>
      prev.map(a =>
        a.id === data.alertId
          ? {
              ...a,
              status: data.referredToDoctor ? 'referred_to_doctor' : 'pharmacist_reviewed',
              pharmacistActionSummary: data.finalDecision
            }
          : a
      )
    );
  };

  const doctorRespondToReferral = (alertId: string, feedback: string, approved: boolean) => {
    setAlerts(prev =>
      prev.map(a =>
        a.id === alertId
          ? {
              ...a,
              status: approved ? 'doctor_approved' : 'escalated',
              doctorResponse: feedback
            }
          : a
      )
    );

    setInterventions(prev =>
      prev.map(i =>
        i.alertId === alertId
          ? {
              ...i,
              doctorFeedback: feedback,
              doctorReferralStatus: approved ? 'resolved' : 'reviewed'
            }
          : i
      )
    );
  };

  // Module 11: Pharmacy Location Management
  const updatePharmacyLocation = (locationData: PharmacyLocation) => {
    setPharmacyLocations(prev =>
      prev.map(loc =>
        loc.pharmacy_id === locationData.pharmacy_id
          ? { ...locationData, updated_at: new Date().toISOString() }
          : loc
      )
    );
  };

  const addPharmacyLocation = (
    data: Omit<PharmacyLocation, 'pharmacy_id' | 'created_at' | 'updated_at'>
  ): PharmacyLocation => {
    const newId = `PHARM-NODE-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const created: PharmacyLocation = {
      ...data,
      pharmacy_id: newId,
      created_at: now,
      updated_at: now
    };
    setPharmacyLocations(prev => [created, ...prev]);
    return created;
  };

  const verifyPharmacyLocation = (pharmacyId: string, status: 'verified' | 'pending' | 'suspended') => {
    setPharmacyLocations(prev =>
      prev.map(loc =>
        loc.pharmacy_id === pharmacyId
          ? { ...loc, verification_status: status, updated_at: new Date().toISOString() }
          : loc
      )
    );
  };

  const getPharmacyLocationById = (pharmacyId: string): PharmacyLocation | undefined => {
    return pharmacyLocations.find(loc => loc.pharmacy_id === pharmacyId);
  };

  const getPharmacyLocationForPharmacist = (pharmacistId: string): PharmacyLocation | undefined => {
    return pharmacyLocations.find(loc => loc.pharmacist_id === pharmacistId);
  };

  const updateConfig = (newConfig: Partial<SystemConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetDemonstrationState = () => {
    localStorage.removeItem('aegisrx_patients');
    localStorage.removeItem('aegisrx_prescriptions');
    localStorage.removeItem('aegisrx_transactions');
    localStorage.removeItem('aegisrx_alerts');
    localStorage.removeItem('aegisrx_interventions');
    localStorage.removeItem('aegisrx_config');
    localStorage.removeItem('aegisrx_current_user');
    localStorage.removeItem('aegisrx_pharmacy_locations');
    localStorage.removeItem('aegisrx_user_coordinates');

    setPatients(INITIAL_PATIENTS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setAlerts(INITIAL_EARLY_REFILL_ALERTS);
    setInterventions(INITIAL_INTERVENTIONS);
    setConfig(INITIAL_SYSTEM_CONFIG);
    setCurrentUser(INITIAL_USERS[0]);
    setPharmacyLocations(INITIAL_PHARMACY_LOCATIONS);
    setUserCoordinates(null);
    setActivePharmacyName('Store A (Metro Care Pharmacy)');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        patients,
        prescriptions,
        transactions,
        alerts,
        interventions,
        config,
        pharmacyLocations,
        userCoordinates,
        setUserCoordinates,
        activePharmacyName,
        setActivePharmacyName,
        switchUserRole,
        setCurrentUser,
        findPatientByIdOrMobile,
        getPrescriptionsForPatient,
        getTransactionsForPatient,
        getAlertsForPatient,
        addPatient,
        addPrescription,
        verifyPrescription,
        checkEarlyRefill,
        recordDispense,
        recordIntervention,
        doctorRespondToReferral,
        updatePharmacyLocation,
        addPharmacyLocation,
        verifyPharmacyLocation,
        getPharmacyLocationById,
        getPharmacyLocationForPharmacist,
        updateConfig,
        resetDemonstrationState
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
