import React, { useState, useRef } from 'react';
import TrashIcon from './icons/TrashIcon';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import { LogEntry } from '../types';

interface SettingsViewProps {
  logs: LogEntry[];
  onImportData: (data: LogEntry[]) => void;
  onClearData: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ logs, onImportData, onClearData }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    if (logs.length === 0) {
        alert("No data to export.");
        return;
    }
    const dataStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'medication-logs.json';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            onImportData(data as LogEntry[]);
            alert('Data imported successfully!');
          } else {
            throw new Error('Invalid file format: Data is not an array.');
          }
        }
      } catch (error) {
        console.error("Failed to import data:", error);
        alert('Failed to import data. Please ensure it is a valid JSON file exported from this app.');
      }
    };
    reader.readAsText(file);
    if(event.target) {
        event.target.value = '';
    }
  };

  const handleClear = () => {
    onClearData();
    setShowConfirm(false);
    setConfirmText('');
  };
  
  const handleCancelClear = () => {
    setShowConfirm(false);
    setConfirmText('');
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg space-y-8">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Settings</h2>
      
      <div>
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Import & Export Data</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            Save your data to a file for backup or transfer it to another device. Importing data will overwrite all current logs.
        </p>
        <div className="flex flex-wrap gap-4">
            <button
              onClick={handleExport}
              disabled={logs.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white font-semibold rounded-md shadow-sm hover:bg-primary-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              <DownloadIcon /> Export Data
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-md shadow-sm hover:bg-slate-700 transition-colors"
            >
              <UploadIcon /> Import Data
            </button>
             <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/json"
                className="hidden"
            />
        </div>
      </div>
      
      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
          Permanently delete all your log entries. This action cannot be undone.
        </p>

        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            <TrashIcon />
            Clear All Log Data
          </button>
        ) : (
          <div className="p-4 bg-red-100 dark:bg-red-900/50 rounded-md border border-red-200 dark:border-red-800">
            <p className="font-semibold text-red-800 dark:text-red-200">Are you sure?</p>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1 mb-2">
              This will permanently delete all your data. To confirm, please type <strong>delete</strong> in the box below.
            </p>
             <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="mt-2 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="delete"
                aria-label="Confirmation text to delete data"
            />
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleClear}
                disabled={confirmText.toLowerCase() !== 'delete'}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 text-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                Yes, Delete Everything
              </button>
              <button
                onClick={handleCancelClear}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100 font-semibold rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsView;