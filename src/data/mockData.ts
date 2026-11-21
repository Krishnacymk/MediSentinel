import {
  PatientProfile,
  Prescription,
  DispensingTransaction,
  EarlyRefillAlert,
  PharmacistIntervention,
  SystemConfig,
  User,
  PharmacyLocation
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-pharmacist-01',
    name: 'James Thorne, RPh',
    email: 'james.thorne@metrocarepharm.org',
    role: 'pharmacist',
    licenseNumber: 'RPH-88492-NY',
    facilityName: 'Metro Care Pharmacy (Store A)',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234 5678'
  },
  {
    id: 'usr-patient-01',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@mailprovider.net',
    role: 'patient',
    facilityName: 'Patient Portal',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 382 9104'
  },
  {
    id: 'usr-doctor-01',
    name: 'Dr. Sarah Lin, MD',
    email: 'dr.lin@stjudepainclinic.org',
    role: 'doctor',
    licenseNumber: 'MD-44912-US',
    facilityName: 'Metro Health Specialized Pain Center',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 456 7890'
  },
  {
    id: 'usr-admin-01',
    name: 'Helena Brooks',
    email: 'h.brooks@aegisrx-compliance.net',
    role: 'admin',
    facilityName: 'AegisRx Safety Network Administration',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '+1 (555) 998 1234'
  }
];

export const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: 'PT-8942-01',
    name: 'Eleanor Vance (Demo Patient 01)',
    mobile: '+1 (555) 382 9104',
    dob: '1984-06-14',
    nationalId: 'NAT-482-901',
    emergencyContact: 'Robert Vance (Spouse) +1 (555) 382 9109',
    address: '427 Maplewood Avenue, Suite 3B, New York, NY',
    crossPharmacyConsent: true,
    monitoringStatus: 'active_monitoring',
    notes: 'Prescribed post surgical pain management. History of moderate lumbar disc pain.'
  },
  {
    id: 'PT-5109-02',
    name: 'Marcus Chen (Demo Patient 02)',
    mobile: '+1 (555) 724 8192',
    dob: '1979-11-23',
    nationalId: 'NAT-619-338',
    emergencyContact: 'Lily Chen (Sister) +1 (555) 724 8199',
    address: '812 Riverfront Parkway, Apt 12, Jersey City, NJ',
    crossPharmacyConsent: true,
    monitoringStatus: 'normal',
    notes: 'Prefers partial collections due to travel schedule.'
  },
  {
    id: 'PT-3301-03',
    name: 'Sophia Reynolds',
    mobile: '+1 (555) 491 2284',
    dob: '1992-03-09',
    nationalId: 'NAT-772-105',
    emergencyContact: 'David Reynolds +1 (555) 491 2289',
    address: '15 West End Blvd, Brooklyn, NY',
    crossPharmacyConsent: true,
    monitoringStatus: 'normal',
    notes: 'Standard maintenance therapy.'
  }
];

// Reference date baseline: 2026-11-18
export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX-2026-9041',
    patientId: 'PT-8942-01',
    patientName: 'Eleanor Vance (Demo Patient 01)',
    patientMobile: '+1 (555) 382 9104',
    doctorName: 'Dr. Sarah Lin, MD',
    doctorLicense: 'MD-44912-US',
    clinicName: 'Metro Health Specialized Pain Center',
    issueDate: '2026-11-14', // 4 days ago (Day 1)
    medicineName: 'Example Medicine A',
    genericName: 'Tramadol Hydrochloride 50mg',
    dosageInstruction: 'Take 1 tablet daily by mouth with water',
    dailyDosageUnits: 1,
    totalQuantityPrescribed: 15,
    treatmentDurationDays: 15,
    status: 'flagged',
    clinicalIndication: 'Acute lumbar disc radiculopathy pain management',
    verifiedByPharmacist: true,
    verifiedAt: '2026-11-15T09:30:00Z',
    scannedImageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'RX-2026-8812',
    patientId: 'PT-5109-02',
    patientName: 'Marcus Chen (Demo Patient 02)',
    patientMobile: '+1 (555) 724 8192',
    doctorName: 'Dr. Sarah Lin, MD',
    doctorLicense: 'MD-44912-US',
    clinicName: 'Metro Health Specialized Pain Center',
    issueDate: '2026-11-16',
    medicineName: 'Example Medicine B',
    genericName: 'Pregabalin 75mg Capsules',
    dosageInstruction: 'Take 1 capsule twice daily for neuropathic discomfort',
    dailyDosageUnits: 1,
    totalQuantityPrescribed: 15,
    treatmentDurationDays: 15,
    status: 'active',
    clinicalIndication: 'Peripheral neuropathic nerve support',
    verifiedByPharmacist: true,
    verifiedAt: '2026-11-16T11:15:00Z',
    scannedImageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'RX-2026-7240',
    patientId: 'PT-3301-03',
    patientName: 'Sophia Reynolds',
    patientMobile: '+1 (555) 491 2284',
    doctorName: 'Dr. Arthur Campbell, MD',
    doctorLicense: 'MD-30911-NY',
    clinicName: 'Downtown Internal Medicine Associates',
    issueDate: '2026-11-10',
    medicineName: 'Amoxicillin Trihydrate 500mg',
    genericName: 'Amoxicillin 500mg',
    dosageInstruction: 'Take 1 tablet every 8 hours for 10 days',
    dailyDosageUnits: 3,
    totalQuantityPrescribed: 30,
    treatmentDurationDays: 10,
    status: 'completed',
    clinicalIndication: 'Bacterial upper respiratory infection',
    verifiedByPharmacist: true,
    verifiedAt: '2026-11-10T14:20:00Z'
  }
];

export const INITIAL_TRANSACTIONS: DispensingTransaction[] = [
  // Demo Scenario 1 - Transaction 1: Eleanor Vance collected 15 tablets on Day 1 (3 days ago) at Store A
  {
    id: 'TX-2026-8801',
    prescriptionId: 'RX-2026-9041',
    patientId: 'PT-8942-01',
    patientName: 'Eleanor Vance (Demo Patient 01)',
    medicineName: 'Example Medicine A (15 tablets)',
    pharmacyId: 'PHARM-STORE-A',
    pharmacyName: 'Store A (Metro Care Pharmacy)',
    pharmacyLocation: '104 Broadway, Manhattan, NY',
    pharmacistId: 'usr-pharmacist-01',
    pharmacistName: 'James Thorne, RPh',
    timestamp: '2026-11-15T10:14:00Z',
    daysSincePrescription: 1,
    prescribedQuantity: 15,
    previouslyDispensedQuantity: 0,
    newlyDispensedQuantity: 15,
    remainingQuantity: 0,
    paymentStatus: 'paid',
    paymentAmount: 24.50,
    paymentMethod: 'credit_card',
    medicinesHandedOver: true,
    evidenceCaptured: true,
    evidencePhotoUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=80',
    consentConfirmed: true,
    isEarlyRefill: false,
    notes: 'First complete dispensing completed. Patient counseled on 1 tablet daily regimen.',
    status: 'completed'
  },
  // Demo Scenario 2 - Partial collection: Marcus Chen prescribed 15 tablets, collected 5 tablets, 10 undispensed
  {
    id: 'TX-2026-8794',
    prescriptionId: 'RX-2026-8812',
    patientId: 'PT-5109-02',
    patientName: 'Marcus Chen (Demo Patient 02)',
    medicineName: 'Example Medicine B (Pregabalin 75mg)',
    pharmacyId: 'PHARM-STORE-A',
    pharmacyName: 'Store A (Metro Care Pharmacy)',
    pharmacyLocation: '104 Broadway, Manhattan, NY',
    pharmacistId: 'usr-pharmacist-01',
    pharmacistName: 'James Thorne, RPh',
    timestamp: '2026-11-16T14:40:00Z',
    daysSincePrescription: 0,
    prescribedQuantity: 15,
    previouslyDispensedQuantity: 0,
    newlyDispensedQuantity: 5,
    remainingQuantity: 10,
    paymentStatus: 'paid',
    paymentAmount: 12.00,
    paymentMethod: 'digital_wallet',
    medicinesHandedOver: true,
    evidenceCaptured: true,
    consentConfirmed: true,
    isEarlyRefill: false,
    notes: 'Partial collection initiated per patient request. 10 tablets remaining in claim balance.',
    status: 'completed'
  },
  {
    id: 'TX-2026-8750',
    prescriptionId: 'RX-2026-7240',
    patientId: 'PT-3301-03',
    patientName: 'Sophia Reynolds',
    medicineName: 'Amoxicillin 500mg (30 tablets)',
    pharmacyId: 'PHARM-STORE-B',
    pharmacyName: 'Store B (Central Health Drugstore)',
    pharmacyLocation: '520 8th Avenue, New York, NY',
    pharmacistId: 'usr-pharmacist-02',
    pharmacistName: 'Claire Dupont, PharmD',
    timestamp: '2026-11-10T15:05:00Z',
    daysSincePrescription: 0,
    prescribedQuantity: 30,
    previouslyDispensedQuantity: 0,
    newlyDispensedQuantity: 30,
    remainingQuantity: 0,
    paymentStatus: 'paid',
    paymentAmount: 18.00,
    paymentMethod: 'insurance',
    medicinesHandedOver: true,
    evidenceCaptured: true,
    consentConfirmed: true,
    isEarlyRefill: false,
    notes: 'Full course dispensed. Verified patient understanding of full course completion.',
    status: 'completed'
  }
];

export const INITIAL_EARLY_REFILL_ALERTS: EarlyRefillAlert[] = [
  {
    id: 'ALT-2026-001',
    prescriptionId: 'RX-2026-9041',
    patientId: 'PT-8942-01',
    patientName: 'Eleanor Vance (Demo Patient 01)',
    medicineName: 'Example Medicine A (15 tablets)',
    triggeredAt: '2026-11-18T10:30:00Z',
    prescribedDailyDose: 1,
    prescribedTotalDuration: 15,
    totalPrescribedQuantity: 15,
    previouslyDispensedQuantity: 15,
    lastDispensedDate: '2026-11-15T10:14:00Z',
    attemptedRefillDate: '2026-11-18T10:30:00Z',
    daysSinceLastDispense: 3,
    expectedDaysSupply: 15,
    daysEarly: 12,
    calculatedDailyIntake: 5.0,
    attemptingPharmacy: 'Store B (Central Health Drugstore)',
    previousPharmacy: 'Store A (Metro Care Pharmacy)',
    severity: 'high_risk',
    status: 'pending_review',
    pharmacistActionSummary: 'Active Early Refill Alert triggered. Patient presented at Store B requesting full 15 tablet refill after only 3 elapsed days of a 15 day therapy.'
  }
];

export const INITIAL_INTERVENTIONS: PharmacistIntervention[] = [
  {
    id: 'INT-2026-042',
    alertId: 'ALT-2026-001',
    patientId: 'PT-8942-01',
    patientName: 'Eleanor Vance (Demo Patient 01)',
    pharmacistId: 'usr-pharmacist-01',
    pharmacistName: 'James Thorne, RPh',
    pharmacyName: 'Store B (Central Health Drugstore)',
    timestamp: '2026-11-18T11:00:00Z',
    reportedPatientReason: 'severe_uncontrolled_pain',
    patientSymptoms: 'Patient reports severe breakthrough lumbar nerve pain on Day 2 and Day 3. Stated 1 tablet daily did not manage the discomfort so she took additional tablets.',
    actionTaken: 'withhold_and_refer_doctor',
    referredToDoctor: true,
    doctorName: 'Dr. Sarah Lin, MD',
    doctorFeedback: 'Pending doctor clinical evaluation. Pharmacist provided safe interim non pharmacological comfort guidance.',
    finalDecision: 'Refill withheld pending Dr. Sarah Lin review. Educational safety counseling delivered regarding respiratory depression and tolerance risks.',
    patientAgreedToSafeSchedule: true
  }
];

export const INITIAL_SYSTEM_CONFIG: SystemConfig = {
  defaultMonitoringWindowDays: 15,
  earlyRefillThresholdPercent: 75,
  requireEvidencePhoto: true,
  requireDoctorReferralForHighRisk: true,
  crossPharmacySyncIntervalSeconds: 30,
  allowEmergencyOverride: true
};

// Module 11: Real GPS Geocoded Medical Stores (Sample Demonstration Network)
export const INITIAL_PHARMACY_LOCATIONS: PharmacyLocation[] = [
  {
    pharmacy_id: 'PHARM-STORE-A',
    pharmacy_name: 'Store A (Metro Care Pharmacy)',
    address: '104 Broadway, Financial District',
    city: 'New York',
    state: 'NY',
    postal_code: '10006',
    latitude: 40.7075,
    longitude: -74.0113,
    phone_number: '+1 (555) 234 5678',
    opening_hours: 'Monday to Friday: 08:00 to 20:00 • Saturday: 09:00 to 18:00',
    verification_status: 'verified',
    pharmacist_id: 'usr-pharmacist-01',
    pharmacist_name: 'James Thorne, RPh',
    services: [
      'Prescription Verification',
      'Dispensing Engine',
      'Partial Collection Staging',
      'Photo Handover Evidence',
      'Emergency Bridge Supply'
    ],
    is_sample_data: true,
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-11-18T10:00:00Z'
  },
  {
    pharmacy_id: 'PHARM-STORE-B',
    pharmacy_name: 'Store B (Central Health Drugstore)',
    address: '520 8th Avenue, Midtown West',
    city: 'New York',
    state: 'NY',
    postal_code: '10018',
    latitude: 40.7533,
    longitude: -73.9928,
    phone_number: '+1 (555) 345 6789',
    opening_hours: 'Open 24 Hours • 7 Days a Week',
    verification_status: 'verified',
    pharmacist_id: 'usr-pharmacist-02',
    pharmacist_name: 'Claire Dupont, PharmD',
    services: [
      'Prescription Verification',
      'Early Refill Clinical Consultations',
      'Physician Coordination',
      '24/7 Urgent Dispensing'
    ],
    is_sample_data: true,
    created_at: '2026-02-01T09:30:00Z',
    updated_at: '2026-11-18T11:30:00Z'
  },
  {
    pharmacy_id: 'PHARM-STORE-C',
    pharmacy_name: 'Downtown Wellness Pharmacy',
    address: '72 Wall Street, Financial District',
    city: 'New York',
    state: 'NY',
    postal_code: '10005',
    latitude: 40.7061,
    longitude: -74.0076,
    phone_number: '+1 (555) 456 7891',
    opening_hours: 'Monday to Friday: 08:30 to 19:30 • Saturday: 10:00 to 16:00',
    verification_status: 'verified',
    pharmacist_id: 'usr-pharmacist-03',
    pharmacist_name: 'Michael Chang, RPh',
    services: [
      'Prescription Scanning',
      'Patient Dosage Counseling',
      'Safe Staged Collection'
    ],
    is_sample_data: true,
    created_at: '2026-03-10T10:00:00Z',
    updated_at: '2026-11-15T14:00:00Z'
  },
  {
    pharmacy_id: 'PHARM-STORE-D',
    pharmacy_name: 'Midtown Care Chemists',
    address: '350 5th Avenue, Suite 100',
    city: 'New York',
    state: 'NY',
    postal_code: '10118',
    latitude: 40.7484,
    longitude: -73.9857,
    phone_number: '+1 (555) 567 8902',
    opening_hours: 'Monday to Saturday: 08:00 to 22:00 • Sunday: 10:00 to 18:00',
    verification_status: 'verified',
    pharmacist_id: 'usr-pharmacist-04',
    pharmacist_name: 'Sarah Jenkins, RPh',
    services: [
      'Cross Store History Access',
      'OCR Script Ingestion',
      'Emergency Refill Assessment'
    ],
    is_sample_data: true,
    created_at: '2026-04-20T11:15:00Z',
    updated_at: '2026-11-10T16:20:00Z'
  },
  {
    pharmacy_id: 'PHARM-STORE-E',
    pharmacy_name: 'Hudson Yards Apothecary',
    address: '500 West 33rd Street, Pavilion 2',
    city: 'New York',
    state: 'NY',
    postal_code: '10001',
    latitude: 40.7538,
    longitude: -74.0019,
    phone_number: '+1 (555) 678 9013',
    opening_hours: 'Monday to Friday: 09:00 to 18:00',
    verification_status: 'pending',
    pharmacist_id: 'usr-pharmacist-05',
    pharmacist_name: 'David Ross, PharmD',
    services: [
      'Prescription Intake',
      'Awaiting Network Verification'
    ],
    is_sample_data: true,
    created_at: '2026-11-17T15:00:00Z',
    updated_at: '2026-11-17T15:00:00Z'
  }
];
