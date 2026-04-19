import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Scan, Activity, Bell, Cpu, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const features = [
  {
    id: 'detection',
    title: 'AI Wildlife Detection',
    subtitle: 'Advanced optical recognition for species identification.',
    icon: Scan,
    color: 'text-teal-400',
    bgColor: 'bg-teal-500/10',
    previewExplanation: 'Edge-computed neural analysis identifies species and biometric states from encrypted visual streams.',
    previewOutput: [
      { label: 'Subject', value: 'Sumatran Tiger (Panthera tigris)' },
      { label: 'Condition', value: 'Healthy (Standard Vitals)' },
      { label: 'Confidence', value: '99.2%' },
      { label: 'Buffer ID', value: 'SENTINEL-TR-09' }
    ]
  },
  {
    id: 'risk',
    title: 'Risk Analysis',
    subtitle: 'Context-aware threat assessment for detected individuals.',
    icon: Activity,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    previewExplanation: 'Adaptive engine correlates environmental telemetry with subject proximity to identify emerging threats.',
    previewOutput: [
      { label: 'Habitat Degradation', value: '+12' },
      { label: 'Human Proximity', value: '+28' },
      { label: 'Risk Score', value: '84 / 100' },
      { label: 'Status', value: 'CRITICAL', highlight: 'text-rose-500 font-black' }
    ]
  },
  {
    id: 'alerts',
    title: 'Conservation Alerts',
    subtitle: 'Automated broadcast system for rapid field response.',
    icon: Bell,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    previewExplanation: 'Synchronous protocol broadcasting critical intel across mesh network nodes for rapid unit deployment.',
    previewOutput: [
      { label: 'Subject', value: 'Hawksbill Sea Turtle' },
      { label: 'Broadcast Status', value: 'ENCRYPTED_ACTIVE' },
      { label: 'Tracking Range', value: 'Sector G-7' },
      { label: 'Action Taken', value: 'Level 3 Dispatch Sent' }
    ]
  },
  {
    id: 'intelligence',
    title: 'Decision Intelligence',
    subtitle: 'Data-driven insights for long-term protection strategies.',
    icon: Cpu,
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-500/10',
    previewExplanation: 'Reasoning transparency engine provides biological and logical justification for automated conservation protocols.',
    previewOutput: [
      { label: 'Species Rank', value: 'Critically Endangered' },
      { label: 'Gait Analysis', value: 'Anomalous limping detected' },
      { label: 'External Threat', value: 'Illegal snare in proximity' },
      { label: 'AI Ruling', value: 'IMMEDIATE_INTERVENTION', highlight: 'text-indigo-400 font-black underline' }
    ]
  }
];

export default function Home() {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

  return (
    <div className="space-y-24 py-12 px-4">
      {/* Hero Section */}
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            EcoPulse Sentinel AI
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 leading-relaxed">
            Turning wildlife detection into real-time conservation action using AI and environmental intelligence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <Link
            to="/hub"
            className="group px-8 py-4 bg-teal-500 hover:bg-teal-400 text-[#050B0D] font-bold rounded-2xl transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            Start Wildlife Scan
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/logs"
            className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10"
          >
            view intel logs
          </Link>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 1) }}
              onClick={() => setSelectedFeature(feature)}
              className="group relative cursor-pointer"
            >
              <div className="h-full bg-white/[0.02] border border-white/5 rounded-3xl p-8 transition-all hover:bg-white/[0.05] hover:border-white/10 hover:shadow-2xl hover:shadow-teal-500/5">
                <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{feature.subtitle}</p>
                <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-teal-500/60 group-hover:text-teal-400 transition-colors">
                  Interactive Preview <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedFeature(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            {/* Modal Container */}
            <motion.div
              layoutId={selectedFeature.id}
              className="relative w-full max-w-xl max-h-[85vh] bg-[#081215] border border-white/10 rounded-[40px] shadow-3xl flex flex-col overflow-hidden"
            >
              {/* Fixed Close Button - Top Right */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-6 right-6 z-20 p-2 text-slate-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 sm:p-10 custom-scrollbar scroll-smooth">
                {/* Background Glow Overlay */}
                <div className={`absolute top-0 right-0 w-64 h-64 ${selectedFeature.bgColor} blur-[100px] opacity-10 pointer-events-none`} />
                
                <div className="space-y-8 relative">
                  <div className="flex items-start sm:items-center gap-4 pr-12">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 ${selectedFeature.bgColor} rounded-2xl flex items-center justify-center`}>
                      <selectedFeature.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${selectedFeature.color}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">{selectedFeature.title}</h2>
                      <div className="text-[10px] font-black uppercase tracking-widest text-teal-500 mt-1">Neural Preview Active</div>
                    </div>
                  </div>

                  <p className="text-slate-300 text-base sm:text-lg leading-relaxed border-l-2 border-teal-500/30 pl-4 py-1 italic font-medium">
                    {selectedFeature.previewExplanation}
                  </p>
                  
                  <div className="bg-black/40 rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6 relative group overflow-hidden">
                    {/* Scan effect lines */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-500/50 to-transparent animate-scan" />
                    
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Simulated AI Output</div>
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-teal-500/30" />)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {selectedFeature.previewOutput.map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 py-3 border-b border-white/5 last:border-0 group/row">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover/row:text-slate-400 transition-colors">
                            {item.label}
                          </span>
                          <span className={cn("font-mono text-sm break-all", item.highlight || "text-teal-400 font-bold")}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <Link
                      to="/hub"
                      className="block w-full bg-teal-500 hover:bg-teal-400 text-black font-black uppercase tracking-widest text-[10px] sm:text-xs px-8 py-4 rounded-2xl transition-all text-center shadow-[0_10px_30px_rgba(20,184,166,0.2)] active:scale-95"
                    >
                      Try Full Scan in Detection Hub
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <div className="text-center py-12 border-t border-white/5">
        <div className="flex justify-center gap-8 text-slate-600 font-bold uppercase tracking-widest text-xs">
          <span>Global Monitoring v4.2</span>
          <span>•</span>
          <span>Sentinel Mesh Node 087</span>
          <span>•</span>
          <span>Encrypted Feed</span>
        </div>
      </div>
    </div>
  );
}
