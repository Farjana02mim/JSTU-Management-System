/**
 * Medical Center AI Grounding Tools
 * 
 * Strict Read-Only Tools for the Medical Health Information Assistant.
 * CRITICAL PRIVACY & SECURITY RULES:
 * 1. getMyAppointments strictly retrieves own appointment dates, time slots, and status ONLY.
 * 2. NEVER exposes reasons, clinical notes, prescriptions, certificates, or diagnostic details.
 * 3. Identity strictly bound to sessionContext.uid; cannot query other patients.
 * 
 * // Real enforcement must move to Firestore rules / Cloud Functions.
 */

import { AuthSessionContext } from './aiTypes';
import {
  initialMedicalDoctorsData,
  initialMedicalServicesData,
  initialMedicalDutyRoster,
  initialEmergencyContacts
} from '../../data/studentLifeSeedData';
import { SharedDataStoreManager } from '../shared/sharedDataStore';
import { MedicalAppointment } from '../../types/studentLife';

export interface MedicalCenterInfoOutput {
  name: string;
  location: string;
  openingHours: string;
  emergencyDesk: string;
  ambulanceHotline: string;
  services: Array<{ title: string; fee: string; description: string }>;
}

export interface DoctorDutyShiftOutput {
  doctorId: string;
  doctorName: string;
  specialty: string;
  dayOfWeek: string;
  timeSlot: string;
  roomNumber: string;
}

export interface MyAppointmentSummaryOutput {
  totalAppointments: number;
  appointments: Array<{
    appointmentId: string;
    doctorName: string;
    date: string;
    timeSlot: string;
    status: string;
  }>;
  note: string;
}

export class MedicalAITools {
  /**
   * Retrieves campus medical center overview, services, and official contact numbers.
   * // Real enforcement must move to Firestore rules / Cloud Functions.
   */
  static getMedicalCenterInfo(): MedicalCenterInfoOutput {
    return {
      name: 'JSTU University Medical Center',
      location: 'Medical Center Building (Ground & 1st Floor), Central Campus',
      openingHours: 'Regular Hours: 8:00 AM - 8:00 PM (Saturday - Thursday), Emergency Desk: 24/7',
      emergencyDesk: initialEmergencyContacts.find(c => c.id === 'emg-02')?.number || '+880 1700-000011 [REPLACE WITH REAL CONTENT]',
      ambulanceHotline: initialEmergencyContacts.find(c => c.isAmbulance)?.number || '+880 1700-000010 [REPLACE WITH REAL CONTENT]',
      services: initialMedicalServicesData.map(s => ({
        title: s.title,
        fee: s.fee,
        description: s.description
      }))
    };
  }

  /**
   * Retrieves doctors list and weekly duty roster with chamber rooms and time slots.
   * // Real enforcement must move to Firestore rules / Cloud Functions.
   */
  static getDutyRoster(): {
    doctors: Array<{ id: string; name: string; specialty: string; dutyDays: string[]; room: string }>;
    shifts: DoctorDutyShiftOutput[];
  } {
    const doctors = initialMedicalDoctorsData.map(d => ({
      id: d.id,
      name: d.name,
      specialty: d.specialty,
      dutyDays: d.dutyDays,
      room: d.roomNumber
    }));

    const shifts = initialMedicalDutyRoster.map(s => ({
      doctorId: s.doctorId,
      doctorName: s.doctorName,
      specialty: s.doctorSpecialty,
      dayOfWeek: s.dayOfWeek,
      timeSlot: s.timeSlot,
      roomNumber: s.roomNumber
    }));

    return { doctors, shifts };
  }

  /**
   * Retrieves own appointments for the authenticated session user.
   * CRITICAL PRIVACY BOUNDARY:
   * Returns ONLY appointmentId, doctorName, date, timeSlot, and status.
   * NEVER returns reason, symptom, visit note, prescription, or clinical records.
   * // Real enforcement must move to Firestore rules / Cloud Functions.
   */
  static getMyAppointments(session: AuthSessionContext): MyAppointmentSummaryOutput {
    if (!session || !session.uid || session.uid === 'guest_visitor' || session.role === 'public') {
      return {
        totalAppointments: 0,
        appointments: [],
        note: 'Please sign in to your student or staff portal account to view your scheduled medical appointments.'
      };
    }

    try {
      const storeManager = SharedDataStoreManager.getInstance();
      const records = storeManager.getMedicalAppointmentsForPatient(session.uid);
      const safeList = records.map((a: MedicalAppointment) => ({
        appointmentId: a.id,
        doctorName: a.doctorName,
        date: a.appointmentDate,
        timeSlot: a.timeSlot,
        status: a.status
      }));

      return {
        totalAppointments: safeList.length,
        appointments: safeList,
        note: safeList.length > 0
          ? 'Here are your booked appointments. Clinical reasons and visit notes are kept strictly private in your medical portal.'
          : 'You currently have no scheduled appointments. You can book an appointment at /student/medical.'
      };
    } catch {
      return {
        totalAppointments: 0,
        appointments: [],
        note: 'Could not access appointment records in the current session.'
      };
    }
  }
}
