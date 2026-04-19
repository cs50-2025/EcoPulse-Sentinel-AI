import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Filter, MapPin, Activity, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLogs, LogEntry, RiskLevel } from '../context/LogContext';
import { cn } from '../lib/utils';

export default function ConservationLogs() {
  const { logs } = useLogs();
  const [filter, setFilter] = useState<RiskLevel | 'All'>('All');

  const filteredLogs = logs.filter(log => filter === 'All' || log.riskLevel === filter);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-8 h-8 text-teal-400" />
            Conservation Logs
          </h1>
          <p className="text-slate-400">Structured telemetry, detection history, and automated AI rulings.</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0A161A] p-1.5 rounded-xl border border-white/5">
          <Filter className="w-4 h-4 text-slate-500 ml-2" />
          <FilterButton label="All" active={filter === 'All'} onClick={() => setFilter('All')} />
          <FilterButton label="Critical" active={filter === 'Critical'} onClick={() => setFilter('Critical')} colorClass="text-rose-400" />
          <FilterButton label="Warning" active={filter === 'Warning'} onClick={() => setFilter('Warning')} colorClass="text-amber-400" />
          <FilterButton label="Safe" active={filter === 'Safe'} onClick={() => setFilter('Safe')} colorClass="text-teal-400" />
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {filteredLogs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl"
            >
              <Database className="w-12 h-12 text-slate-700 mx-auto mb-4" />
              <div className="text-slate-400 font-medium">No logs found for this criteria.</div>
            </motion.div>
          ) : (
            filteredLogs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FilterButton({ label, active, onClick, colorClass }: { label: string, active: boolean, onClick: () => void, colorClass?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
        active 
          ? "bg-white/10 text-white shadow-sm" 
          : cn("text-slate-500 hover:text-slate-300 hover:bg-white/5", colorClass)
      )}
    >
      {label}
    </button>
  );
}

function LogCard({ log }: { log: LogEntry, key?: string | number }) {
  const date = new Date(log.timestamp);
  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateString = date.toLocaleDateString();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-[#081215] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors flex flex-col md:flex-row gap-6 relative overflow-hidden"
    >
      {/* Risk Indicator Line */}
      <div className={cn(
        "absolute left-0 top-0 bottom-0 w-1",
        log.riskLevel === 'Critical' ? 'bg-rose-500' : 
        log.riskLevel === 'Warning' ? 'bg-amber-500' : 'bg-teal-500'
      )} />

      {/* Main Info */}
      <div className="flex-1 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border",
            log.riskLevel === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
            log.riskLevel === 'Warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
            'bg-teal-500/10 text-teal-400 border-teal-500/20'
          )}>
            {log.riskLevel === 'Critical' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
             log.riskLevel === 'Warning' ? <AlertTriangle className="w-3.5 h-3.5" /> : 
             <ShieldCheck className="w-3.5 h-3.5" />}
            {log.riskLevel}
            <span className="font-mono ml-1 px-1 bg-black/20 rounded">Score: {log.riskScore}</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-slate-400 border border-white/5 bg-white/[0.02] px-2 py-1 rounded-md">
            <Clock className="w-3 h-3" />
            <span className="font-mono">{dateString} {timeString}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-indigo-400 border border-indigo-500/20 bg-indigo-500/10 px-2 py-1 rounded-md">
            Status: {log.alertStatus}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-1">{log.species}</h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm text-slate-400">
            <div className="flex items-center gap-1"><Activity className="w-4 h-4 text-slate-500"/> {log.condition}</div>
            <div className="hidden sm:block text-slate-700">•</div>
            <div className="flex items-center gap-1"><MapPin className="w-4 h-4 text-slate-500"/> {log.location}</div>
          </div>
        </div>
      </div>

      {/* AI Reasoning */}
      <div className="w-full md:w-5/12 bg-black/40 rounded-xl p-4 border border-white/5 flex flex-col justify-center">
        <div className="text-xs font-semibold uppercase tracking-wider text-teal-500 mb-2 flex items-center gap-1">
          Sentinel AI Reasoning
        </div>
        <p className="text-sm text-slate-300 leading-relaxed font-mono">
          {log.aiReasoning}
        </p>
      </div>
    </motion.div>
  );
}
