import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import LogForm from './components/LogForm';
import Timeline from './components/Timeline';
import { LogEntry } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import VisualizationView from './components/VisualizationView';
import AnalysisView from './components/AnalysisView';
import SettingsView from './components/SettingsView';
import ListIcon from './components/icons/ListIcon';
import ChartIcon from './components/icons/ChartIcon';
import AnalyzeIcon from './components/icons/AnalyzeIcon';
import SettingsIcon from './components/icons/SettingsIcon';

type View = 'timeline' | 'viz' | 'analysis' | 'settings';

const App: React.FC = () => {
  const [logs, setLogs] = useLocalStorage<LogEntry[]>('med-symptom-logs', []);
  const [currentView, setCurrentView] = useState<View>('timeline');

  const sortedLogs = useMemo(() => 
    [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), 
    [logs]
  );

  const handleAddLog = (log: Omit<LogEntry, 'id'>) => {
    const newLog = { ...log, id: uuidv4() } as LogEntry;
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const handleDeleteLog = (id: string) => {
    setLogs(prevLogs => prevLogs.filter(log => log.id !== id));
  };

  const handleImportData = (importedLogs: LogEntry[]) => {
    setLogs(importedLogs);
  };

  const renderView = () => {
    switch (currentView) {
      case 'timeline':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <LogForm onAddLog={handleAddLog} />
            </div>
            <div className="lg:col-span-2">
              <Timeline logs={sortedLogs} onDeleteLog={handleDeleteLog} />
            </div>
          </div>
        );
      case 'viz':
        return <VisualizationView logs={logs} />;
      case 'analysis':
        return <AnalysisView logs={logs} />;
      case 'settings':
        return <SettingsView logs={logs} onImportData={handleImportData} onClearData={() => setLogs([])} />;
      default:
        return null;
    }
  };
  
  const NavButton: React.FC<{ view: View; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
      onClick={() => setCurrentView(view)}
      className={`flex-1 sm:flex-none flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
        currentView === view
          ? 'bg-primary-600 text-white'
          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );


  return (
    <div className="bg-slate-100 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg mb-8">
          <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            <NavButton view="timeline" label="Timeline & Logs" icon={<ListIcon />} />
            <NavButton view="viz" label="Visualization" icon={<ChartIcon />} />
            <NavButton view="analysis" label="Gemini Analysis" icon={<AnalyzeIcon />} />
            <NavButton view="settings" label="Settings" icon={<SettingsIcon />} />
          </div>
        </div>

        {renderView()}
      </main>
    </div>
  );
};

export default App;