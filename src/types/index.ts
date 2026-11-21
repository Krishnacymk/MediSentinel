export type UserRole = 'patient' | 'pharmacist' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  licenseNumber?: string;
  facilityName?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  mobile: string;
  dob: string;
  nationalId: string;
  emergencyContact: string;
  address: string;
  crossPharmacyConsent: boolean;
  monitoringStatus: 'normal' | 'active_monitoring' | 'high_alert';
  notes: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientMobile: string;
  doctorName: string;
  doctorLicense: string;
  clinicName: string;
  issueDate: string; // ISO date
  medicineName: string;
  genericName: string;
  dosageInstruction: string;
  dailyDosageUnits: number; // e.g. 1 tablet per day
  totalQuantityPrescribed: number; // e.g. 15 tablets
  treatmentDurationDays: number; // e.g. 15 days
  status: 'active' | 'completed' | 'flagged' | 'under_review';
  clinicalIndication: string;
  scannedImageUrl?: string;
  verifiedByPharmacist: boolean;
  verifiedAt?: string;
}

export interface DispensingTransaction {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  medicineName: string;
  pharmacyId: string;
  pharmacyName: string;
  pharmacyLocation: string;
  pharmacistId: string;
  pharmacistName: string;
  timestamp: string; // ISO date
  daysSincePrescription: number;
  prescribedQuantity: number;
  previouslyDispensedQuantity: number;
  newlyDispensedQuantity: number;
  remainingQuantity: number;
  paymentStatus: 'paid' | 'partial' | 'insurance_processed' | 'cancelled';
  paymentAmount: number;
  paymentMethod: 'credit_card' | 'cash' | 'insurance' | 'digital_wallet';
  medicinesHandedOver: boolean;
  evidenceCaptured: boolean;
  evidencePhotoUrl?: string;
  consentConfirmed: boolean;
  isEarlyRefill: boolean;
  earlyRefillDaysDiff?: number;
  notes?: string;
  status: 'completed' | 'interrupted' | 'cancelled';
}

export interface EarlyRefillAlert {
  id: string;
  prescriptionId: string;
  patientId: string;
  patientName: string;
  medicineName: string;
  triggeredAt: string;
  prescribedDailyDose: number;
  prescribedTotalDuration: number;
  totalPrescribedQuantity: number;
  previouslyDispensedQuantity: number;
  lastDispensedDate: string;
  attemptedRefillDate: string;
  daysSinceLastDispense: number;
  expectedDaysSupply: number;
  daysEarly: number;
  calculatedDailyIntake: number; // e.g. 5 tablets/day instead of 1
  attemptingPharmacy: string;
  previousPharmacy: string;
  severity: 'moderate' | 'high_risk';
  status: 'pending_review' | 'pharmacist_reviewed' | 'referred_to_doctor' | 'doctor_approved' | 'escalated';
  pharmacistActionSummary?: string;
  doctorResponse?: string;
}

export interface PharmacistIntervention {
  id: string;
  alertId: string;
  patientId: string;
  patientName: string;
  pharmacistId: string;
  pharmacistName: string;
  pharmacyName: string;
  timestamp: string;
  reportedPatientReason: 'severe_uncontrolled_pain' | 'damaged_or_lost_tablets' | 'misunderstood_schedule' | 'travel_advance_request' | 'unexplained_excess';
  patientSymptoms: string;
  actionTaken: 'counsel_and_partial_dispense' | 'withhold_and_refer_doctor' | 'safety_counsel_only' | 'emergency_escalation';
  referredToDoctor: boolean;
  doctorName?: string;
  doctorFeedback?: string;
  finalDecision: string;
  patientAgreedToSafeSchedule: boolean;
}

export interface SystemConfig {
  defaultMonitoringWindowDays: number; // e.g. 15
  earlyRefillThresholdPercent: number; // e.g. 75% of duration before refill allowed
  requireEvidencePhoto: boolean;
  requireDoctorReferralForHighRisk: boolean;
  crossPharmacySyncIntervalSeconds: number;
  allowEmergencyOverride: boolean;
}

// Module 11: GPS Medical Store Location Record
export interface PharmacyLocation {
  pharmacy_id: string;
  pharmacy_name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  phone_number: string;
  opening_hours: string;
  verification_status: 'verified' | 'pending' | 'suspended';
  pharmacist_id: string;
  pharmacist_name: string;
  services: string[];
  is_sample_data: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserCoordinates {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  detectedAt?: string;
}
