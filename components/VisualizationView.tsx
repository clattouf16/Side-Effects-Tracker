import React, { useMemo, useState } from 'react';
import { LogEntry, LogType, MedicationLog, SymptomLog } from '../types';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label, ReferenceArea, Brush, BarChart, Bar, Cell
} from 'recharts';
import ChartIcon from './icons/ChartIcon';
import BarChartIcon from './icons/BarChartIcon';
import SparklesIcon from './icons/SparklesIcon';
import TableIcon from './icons/TableIcon';


interface VisualizationViewProps {
  logs: LogEntry[];
}

const COLORS = ['#f59e0b', '#ef4444', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
const EFFECT_WINDOW_HOURS = 8;

type ActiveChart = 'timeline' | 'breakdown' | 'postMedication' | 'medicationTable';


const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const time = new Date(label).toLocaleString();
      return (
        <div className="bg-white dark:bg-slate-700 p-3 rounded-lg border border-slate-200 dark:border-slate-600 shadow-lg">
          <p className="font-bold text-slate-800 dark:text-slate-100">{time}</p>
          {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.color }}>{`${pld.name}: ${pld.value}`}</p>
          ))}
          {payload[0].payload.notes && <p className="text-sm italic text-slate-500 dark:text-slate-300 mt-1">{`Notes: ${payload[0].payload.notes}`}</p>}
        </div>
      );
    }
    return null;
  };

// Timeline Chart Component
const SymptomTimelineChart: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    const { chartData, uniqueSymptoms, medicationLines, medicationAreas } = useMemo(() => {
        const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const symptomLogs = sortedLogs.filter((log): log is SymptomLog => log.type === LogType.SYMPTOM);
        const medicationLogs = sortedLogs.filter((log): log is MedicationLog => log.type === LogType.MEDICATION);

        const uniqueSymptoms = [...new Set(symptomLogs.map(log => log.description))];

        const dataPoints = new Map<number, any>();

        symptomLogs.forEach(log => {
            const time = new Date(log.timestamp).getTime();
            if (!dataPoints.has(time)) {
                dataPoints.set(time, { time });
            }
            const point = dataPoints.get(time);
            point[log.description] = log.severity;
            point.notes = log.notes;
        });
        
        const chartData = Array.from(dataPoints.values());

        const medicationLines = medicationLogs.map(log => ({
            time: new Date(log.timestamp).getTime(),
            label: `${log.medicationName} (${log.dosage})`
        }));

        const medicationAreas = medicationLogs.map(log => {
            const startTime = new Date(log.timestamp).getTime();
            const endTime = startTime + EFFECT_WINDOW_HOURS * 60 * 60 * 1000;
            return { x1: startTime, x2: endTime };
        });

        return { chartData, uniqueSymptoms, medicationLines, medicationAreas };
    }, [logs]);

    if (uniqueSymptoms.length === 0 || chartData.length < 2) {
        return <div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400">Not enough data for this chart. Log at least two symptoms.</p></div>;
    }

    return (
        <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                This chart plots symptom severity over time. Vertical lines show medication doses, and shaded areas highlight the {EFFECT_WINDOW_HOURS} hours after. Use the slider to zoom.
            </p>
            <div style={{ width: '100%', height: 450 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis
                            dataKey="time" type="number" domain={['dataMin', 'dataMax']}
                            tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            stroke="currentColor" className="text-xs"
                        />
                        <YAxis domain={[0, 6]} ticks={[1, 2, 3, 4, 5]} label={{ value: 'Severity', angle: -90, position: 'insideLeft' }} stroke="currentColor" className="text-xs" />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="top" height={36} />
                        {medicationAreas.map((area, i) => <ReferenceArea key={`area-${i}`} x1={area.x1} x2={area.x2} stroke="none" fill="#0ea5e9" fillOpacity={0.1} />)}
                        {uniqueSymptoms.map((symptom, index) => <Line key={symptom} type="monotone" dataKey={symptom} stroke={COLORS[index % COLORS.length]} strokeWidth={2} name={symptom} connectNulls dot={{ r: 4 }} activeDot={{ r: 8 }} />)}
                        {medicationLines.map((med, i) => <ReferenceLine key={`med-${i}`} x={med.time} stroke="#0284c7" strokeWidth={1.5} strokeDasharray="4 4"><Label value={med.label} angle={-90} position="insideTopLeft" style={{ fill: '#0369a1' }} className="dark:fill-[#7dd3fc] text-[10px]" /></ReferenceLine>)}
                        <Brush dataKey="time" height={30} stroke="#94a3b8" tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};


// Breakdown Chart Component
const SymptomBreakdownChart: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    const breakdownData = useMemo(() => {
        const symptomLogs = logs.filter((log): log is SymptomLog => log.type === LogType.SYMPTOM);
        const symptomStats: { [key: string]: { totalSeverity: number, count: number } } = {};

        symptomLogs.forEach(log => {
            if (!symptomStats[log.description]) {
                symptomStats[log.description] = { totalSeverity: 0, count: 0 };
            }
            symptomStats[log.description].totalSeverity += log.severity;
            symptomStats[log.description].count++;
        });

        return Object.entries(symptomStats).map(([name, stats]) => ({
            name,
            frequency: stats.count,
            avgSeverity: parseFloat((stats.totalSeverity / stats.count).toFixed(2)),
        })).sort((a,b) => b.frequency - a.frequency);
    }, [logs]);

    if (breakdownData.length === 0) {
        return <div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400">Log some symptoms to see a breakdown.</p></div>;
    }

    return (
        <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                This chart shows how often each symptom occurs (frequency) and its average severity. This helps identify your most common and impactful symptoms.
            </p>
            <div style={{ width: '100%', height: 450 }}>
                <ResponsiveContainer>
                    <BarChart data={breakdownData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 20 }}>
                         <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis type="number" stroke="currentColor" className="text-xs" />
                        <YAxis dataKey="name" type="category" width={80} stroke="currentColor" className="text-xs" />
                        <Tooltip wrapperClassName="dark:!bg-slate-700 dark:!border-slate-600" />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="frequency" fill="#38bdf8" name="Frequency (Count)" />
                        <Bar dataKey="avgSeverity" fill="#f59e0b" name="Average Severity" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

// Post-Medication Analysis Chart Component
const PostMedicationAnalysisChart: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    const analysisData = useMemo(() => {
        const medicationLogs = logs.filter((log): log is MedicationLog => log.type === LogType.MEDICATION);
        const symptomLogs = logs.filter((log): log is SymptomLog => log.type === LogType.SYMPTOM);

        const uniqueMeds = [...new Set(medicationLogs.map(log => `${log.medicationName} (${log.dosage})`))];
        const uniqueSymptoms = [...new Set(symptomLogs.map(log => log.description))];
        
        const data: { symptom: string; [med: string]: number | string }[] = [];

        for(const symptom of uniqueSymptoms) {
            const row: { symptom: string; [med: string]: number | string } = { symptom };
            for(const med of uniqueMeds) {
                const relevantMedLogs = medicationLogs.filter(log => `${log.medicationName} (${log.dosage})` === med);
                let totalSeverity = 0;
                let symptomCount = 0;

                for (const medLog of relevantMedLogs) {
                    const startTime = new Date(medLog.timestamp).getTime();
                    const endTime = startTime + EFFECT_WINDOW_HOURS * 60 * 60 * 1000;
                    
                    const symptomsInWindow = symptomLogs.filter(slog => {
                        const slogTime = new Date(slog.timestamp).getTime();
                        return slog.description === symptom && slogTime >= startTime && slogTime < endTime;
                    });

                    if (symptomsInWindow.length > 0) {
                        totalSeverity += symptomsInWindow.reduce((acc, curr) => acc + curr.severity, 0);
                        symptomCount += symptomsInWindow.length;
                    }
                }
                row[med] = symptomCount > 0 ? parseFloat((totalSeverity / symptomCount).toFixed(2)) : 0;
            }
            data.push(row);
        }

        return { data, uniqueMeds };
    }, [logs]);

    if (analysisData.data.length === 0 || analysisData.uniqueMeds.length === 0) {
        return <div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400">Not enough data. Log at least one medication and one symptom to see this analysis.</p></div>;
    }

    return (
        <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                This chart compares the average severity of symptoms within the {EFFECT_WINDOW_HOURS}-hour window after taking each medication. A value of 0 means the symptom was not logged in that window.
            </p>
             <div style={{ width: '100%', height: 450 }}>
                <ResponsiveContainer>
                     <BarChart data={analysisData.data} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                        <XAxis dataKey="symptom" stroke="currentColor" className="text-xs" />
                        <YAxis domain={[0, 5]} stroke="currentColor" className="text-xs" />
                        <Tooltip wrapperClassName="dark:!bg-slate-700 dark:!border-slate-600" />
                        <Legend verticalAlign="top" height={36} />
                        {analysisData.uniqueMeds.map((med, i) => (
                           <Bar key={med} dataKey={med} fill={COLORS[i % COLORS.length]} name={med} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </>
    );
};

// Medication Intake Table
const MedicationIntakeTable: React.FC<{ logs: LogEntry[] }> = ({ logs }) => {
    type SortKey = keyof MedicationLog;
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' } | null>({ key: 'timestamp', direction: 'descending' });

    const medicationLogs = useMemo(() => logs.filter((log): log is MedicationLog => log.type === LogType.MEDICATION), [logs]);

    const sortedLogs = useMemo(() => {
        let sortableLogs = [...medicationLogs];
        if (sortConfig !== null) {
            sortableLogs.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableLogs;
    }, [medicationLogs, sortConfig]);

    const requestSort = (key: SortKey) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: SortKey) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }

    if (medicationLogs.length === 0) {
        return <div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400">Log a medication dose to see it here.</p></div>;
    }

    return (
         <>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                A detailed list of all medication doses you have logged. Click on a column header to sort the table.
            </p>
            <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                    <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th scope="col" className="p-3 cursor-pointer" onClick={() => requestSort('medicationName')}>
                                Medication Name {getSortIndicator('medicationName')}
                            </th>
                            <th scope="col" className="p-3 cursor-pointer" onClick={() => requestSort('dosage')}>
                                Dosage {getSortIndicator('dosage')}
                            </th>
                            <th scope="col" className="p-3 cursor-pointer" onClick={() => requestSort('timestamp')}>
                                Timestamp {getSortIndicator('timestamp')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedLogs.map(log => (
                            <tr key={log.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">{log.medicationName}</td>
                                <td className="p-3">{log.dosage}</td>
                                <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}


const VisualizationView: React.FC<VisualizationViewProps> = ({ logs }) => {
  const [activeChart, setActiveChart] = useState<ActiveChart>('timeline');

  const renderChart = () => {
    switch (activeChart) {
      case 'timeline':
        return <SymptomTimelineChart logs={logs} />;
      case 'breakdown':
        return <SymptomBreakdownChart logs={logs} />;
      case 'postMedication':
        return <PostMedicationAnalysisChart logs={logs} />;
      case 'medicationTable':
        return <MedicationIntakeTable logs={logs} />;
      default:
        return null;
    }
  };
  
  const NavButton: React.FC<{ chart: ActiveChart; label: string; icon: React.ReactNode }> = ({ chart, label, icon }) => (
    <button
      onClick={() => setActiveChart(chart)}
      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeChart === chart
          ? 'bg-primary-600 text-white'
          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100">Data Visualization</h2>
      
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <NavButton chart="timeline" label="Symptom Timeline" icon={<ChartIcon />} />
        <NavButton chart="breakdown" label="Symptom Breakdown" icon={<BarChartIcon />} />
        <NavButton chart="postMedication" label="Post-Medication Analysis" icon={<SparklesIcon />} />
        <NavButton chart="medicationTable" label="Medication Table" icon={<TableIcon />} />
      </div>

      {renderChart()}
    </div>
  );
};

export default VisualizationView;