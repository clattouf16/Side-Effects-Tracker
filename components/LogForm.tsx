import React, { useState } from 'react';
import { LogEntry, LogType, MedicationLog, SymptomLog } from '../types';
import PillIcon from './icons/PillIcon';
import SymptomIcon from './icons/SymptomIcon';

interface LogFormProps {
  onAddLog: (log: Omit<LogEntry, 'id'>) => void;
}

const LogForm: React.FC<LogFormProps> = ({ onAddLog }) => {
  const [logType, setLogType] = useState<LogType>(LogType.MEDICATION);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState(3);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timestamp = new Date().toISOString();

    if (logType === LogType.MEDICATION && medicationName && dosage) {
      const newLog: Omit<MedicationLog, 'id'> = { type: LogType.MEDICATION, timestamp, medicationName, dosage, notes };
      onAddLog(newLog);
      setMedicationName('');
      setDosage('');
    } else if (logType === LogType.SYMPTOM && description) {
      const newLog: Omit<SymptomLog, 'id'> = { type: LogType.SYMPTOM, timestamp, description, severity, notes };
      onAddLog(newLog);
      setDescription('');
      setSeverity(3);
    }
    setNotes('');
  };
  
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const defaultDateTime = `${dateStr}T${timeStr}`;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Add New Log</h2>
      <div className="flex border border-slate-200 dark:border-slate-700 rounded-md mb-4">
        <button
          onClick={() => setLogType(LogType.MEDICATION)}
          className={`w-1/2 flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-l-md transition-colors ${logType === LogType.MEDICATION ? 'bg-primary-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-primary-700 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-slate-700'}`}
        >
          <PillIcon /> Medication
        </button>
        <button
          onClick={() => setLogType(LogType.SYMPTOM)}
          className={`w-1/2 flex items-center justify-center gap-2 p-3 text-sm font-semibold rounded-r-md transition-colors ${logType === LogType.SYMPTOM ? 'bg-amber-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-slate-700'}`}
        >
         <SymptomIcon /> Symptom
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">Logging for: {new Date().toLocaleString()}</p>

        {logType === LogType.MEDICATION ? (
          <>
            <div>
              <label htmlFor="medicationName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Medication Name</label>
              <input
                type="text"
                id="medicationName"
                value={medicationName}
                onChange={e => setMedicationName(e.target.value)}
                placeholder="e.g., Lisinopril"
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label htmlFor="dosage" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Dosage</label>
              <input
                type="text"
                id="dosage"
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                placeholder="e.g., 50mg"
                required
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Symptom Description</label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g., Headache, Nausea"
                required
                 className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Severity: {severity}</label>
              <input
                type="range"
                id="severity"
                min="1"
                max="5"
                value={severity}
                onChange={e => setSeverity(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
               <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Notes (Optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={3}
            placeholder="Any additional details..."
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          Add Log
        </button>
      </form>
    </div>
  );
};

export default LogForm;