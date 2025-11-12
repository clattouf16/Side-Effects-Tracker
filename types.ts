export enum LogType {
  MEDICATION = 'MEDICATION',
  SYMPTOM = 'SYMPTOM',
}

export interface BaseLog {
  id: string;
  timestamp: string;
  notes?: string;
}

export interface MedicationLog extends BaseLog {
  type: LogType.MEDICATION;
  medicationName: string;
  dosage: string;
}

export interface SymptomLog extends BaseLog {
  type: LogType.SYMPTOM;
  severity: number;
  description: string;
}

export type LogEntry = MedicationLog | SymptomLog;