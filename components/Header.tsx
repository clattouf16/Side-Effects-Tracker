
import React from 'react';
import PillIcon from './icons/PillIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        <div className="text-primary-600">
           <PillIcon className="h-8 w-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          Medication & Symptom Tracker
        </h1>
      </div>
    </header>
  );
};

export default Header;
