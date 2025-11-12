import React from 'react';
import { LogEntry, LogType, MedicationLog, SymptomLog } from '../types';
import PillIcon from './icons/PillIcon';
import SymptomIcon from './icons/SymptomIcon';
import TrashIcon from './icons/TrashIcon';

interface TimelineProps {
  logs: LogEntry[];
  onDeleteLog: (id: string) => void;
}

const TimelineItem: React.FC<{ log: LogEntry; onDelete: (id: string) => void }> = ({ log, onDelete }) => {
  const isMedication = log.type === LogType.MEDICATION;
  const bgColor = isMedication ? 'bg-primary-100 dark:bg-primary-900/50' : 'bg-amber-100 dark:bg-amber-900/50';
  const iconColor = isMedication ? 'text-primary-600 dark:text-primary-400' : 'text-amber-600 dark:text-amber-400';
  const iconBg = isMedication ? 'bg-primary-200 dark:bg-primary-800' : 'bg-amber-200 dark:bg-amber-800';

  return (
    <div className={`relative flex items-start space-x-4 p-4 rounded-lg ${bgColor}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBg} ${iconColor}`}>
        {isMedication ? <PillIcon /> : <SymptomIcon />}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-semibold text-slate-800 dark:text-slate-100">
              {isMedication ? (log as MedicationLog).medicationName : 'Symptom Logged'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>
          <button onClick={() => onDelete(log.id)} className="text-slate-400 hover:text-red-500 transition-colors">
            <TrashIcon />
          </button>
        </div>
        <div className="mt-2 text-slate-700 dark:text-slate-300">
          {isMedication ? (
            <p><strong>Dosage:</strong> {(log as MedicationLog).dosage}</p>
          ) : (
            <>
              <p><strong>Symptom:</strong> {(log as SymptomLog).description}</p>
              <div className="flex items-center gap-2">
                <strong>Severity:</strong> 
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < (log as SymptomLog).severity ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </>
          )}
          {log.notes && <p className="mt-1 text-sm italic bg-slate-50 dark:bg-slate-700/50 p-2 rounded"><strong>Notes:</strong> {log.notes}</p>}
        </div>
      </div>
    </div>
  );
};

const Timeline: React.FC<TimelineProps> = ({ logs, onDeleteLog }) => {
  if (logs.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">Your Timeline</h2>
        <p className="text-slate-500 dark:text-slate-400">No logs yet. Add a medication or symptom to get started!</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Timeline</h2>
      <div className="space-y-4">
        {logs.map(log => (
          <TimelineItem key={log.id} log={log} onDelete={onDeleteLog} />
        ))}
      </div>
    </div>
  );
};

export default Timeline;