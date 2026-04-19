import React, { createContext, useContext, useState, ReactNode } from 'react';

export type RiskLevel = 'Critical' | 'Warning' | 'Safe';

export interface LogEntry {
  id: string;
  species: string;
  riskScore: number;
  condition: string;
  location: string;
  timestamp: string;
  alertStatus: string;
  aiReasoning: string;
  riskLevel: RiskLevel;
}

interface LogContextType {
  logs: LogEntry[];
  addLog: (log: Omit<LogEntry, 'id' | 'timestamp'>) => void;
}

const LogContext = createContext<LogContextType | undefined>(undefined);

// Initial mock data to populate the logs nicely
const initialLogs: LogEntry[] = [
  {
    id: 'msg-001',
    species: 'Amur Leopard',
    riskScore: 92,
    condition: 'Injured, Malnourished',
    location: 'Sector 7G, Primorsky Krai',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    alertStatus: 'Sent',
    aiReasoning: 'Critical endangerment status compounded by detected severe malnourishment and physical injury. Immediate intervention required to prevent fatality.',
    riskLevel: 'Critical'
  },
  {
    id: 'msg-002',
    species: 'African Forest Elephant',
    riskScore: 65,
    condition: 'Healthy, Herd Migration',
    location: 'Zone 3, Congo Basin',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    alertStatus: 'Pending',
    aiReasoning: 'Detecting normal herd movement, but within proximity (2km) of known logging activity. Elevating risk to warning to ensure monitoring.',
    riskLevel: 'Warning'
  }
];

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  const addLog = (newLog: Omit<LogEntry, 'id' | 'timestamp'>) => {
    const log: LogEntry = {
      ...newLog,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setLogs(prev => [log, ...prev]);
  };

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const context = useContext(LogContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogProvider');
  }
  return context;
}
