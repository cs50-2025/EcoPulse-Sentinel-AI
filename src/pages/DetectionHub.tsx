import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, Activity, AlertTriangle, 
  ShieldCheck, CheckCircle2, Loader2, Scan,
  Play, RotateCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLogs, RiskLevel } from '../context/LogContext';
import { useNavigate } from 'react-router-dom';
import { analyzeWildlifeImage, DetectionEnrichment } from '../services/geminiService';

type InputMode = 'upload' | null;

interface SelectedInput {
  mode: InputMode;
  data: string | null; // Base64 image data
  previewUrl: string | null;
}

export default function DetectionHub() {
  const [selectedInput, setSelectedInput] = useState<SelectedInput | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionEnrichment | null>(null);
  const [alertSent, setAlertSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addLog } = useLogs();
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedInput({
          mode: 'upload',
          data: reader.result as string,
          previewUrl: reader.result as string
        });
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedInput) {
      setError("Please upload an image or take a photo before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setAlertSent(false);

    try {
      const data = await analyzeWildlifeImage(selectedInput.data as string);
      setResult(data);
    } catch (err) {
      console.error("Analysis failed:", err);
      setError("AI analysis failed. Please try a different image or check connectivity.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendAlert = () => {
    if (!result) return;
    
    let level: RiskLevel = 'Safe';
    if (result.riskScore > 75) level = 'Critical';
    else if (result.riskScore > 40) level = 'Warning';

    addLog({
      species: result.species,
      riskScore: result.riskScore,
      condition: result.condition,
      location: 'Sector Detected (GPS Encrypted)',
      alertStatus: 'Sent',
      aiReasoning: result.scientificReasoning,
      riskLevel: level
    });
    
    setAlertSent(true);
    setTimeout(() => navigate('/logs'), 1500);
  };

  const resetInput = () => {
    setSelectedInput(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">Detection Hub</h1>
        <p className="text-slate-400">Initialize the Sentinel AI pipeline by providing visual wildlife data for real-time analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Selection & Preview */}
        <div className="lg:col-span-9 space-y-6">
          <div className={cn(
            "relative group rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center min-h-[450px] overflow-hidden",
            selectedInput 
              ? "border-teal-500/30 bg-black/40" 
              : "border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-teal-500/50"
          )}>
            <input 
              type="file" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*"
            />

            <AnimatePresence mode="wait">
              {!selectedInput ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-12 text-center"
                >
                  <UploadCloud className="w-16 h-16 text-slate-500 mb-6 mx-auto group-hover:text-teal-400 transition-colors" />
                  <h3 className="text-xl font-bold text-white mb-2">Awaiting Intelligence Input</h3>
                  <p className="text-slate-400 mb-8 max-w-sm mx-auto">Drop imagery here or use the capture controls to begin the classification process.</p>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-2xl font-bold transition-all border border-white/5 active:scale-95"
                    >
                      Select File
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full relative flex flex-col items-center p-6"
                >
                  <div className="relative w-full max-w-3xl aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl">
                    <img src={selectedInput.previewUrl!} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    
                    <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-teal-400">
                      <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      Input Buffer Status: Locked
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <button 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className={cn(
                        "group px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all flex items-center gap-3 active:scale-95",
                        isAnalyzing 
                          ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                          : "bg-teal-500 text-black hover:bg-teal-400 shadow-[0_0_20px_rgba(20,184,166,0.5)]"
                      )}
                    >
                      {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                      {isAnalyzing ? "Processing Intelligence..." : "Analyze Wildlife Feed"}
                    </button>
                    <button 
                      onClick={resetInput}
                      className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border border-white/10 flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-400 text-sm font-medium"
            >
              <AlertTriangle className="w-5 h-5" />
              {error}
            </motion.div>
          )}
        </div>

        {/* Right Sidebar: Health & Stats */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-[#081215] border border-white/5 rounded-3xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest pb-4 border-b border-white/5">
              <Activity className="w-4 h-4 text-teal-500" /> System Health
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Gemini Nodes</span>
                  <span className="text-teal-500">Online</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[94%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Neural Buffer</span>
                  <span className="text-teal-500">98% Efficient</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 w-[98%]" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Crypto Latency</span>
                  <span className="text-teal-500">12ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal-500/5 border border-teal-500/10 rounded-3xl p-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400/50 mb-2">Notice</div>
            <p className="text-xs text-teal-400/70 leading-relaxed font-mono">
              Sentinel AI is currently enforcing strict metadata encryption. All detected coordinates are redacted in this preview mode.
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-12 border-t border-white/5"
          >
            {/* Detection Profile */}
            <div className="md:col-span-4 bg-[#081215] border border-white/5 rounded-3xl p-8 space-y-8">
              <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest">
                <Scan className="w-5 h-5" />
                Intelligence Profile
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Subject Species</div>
                  <div className="text-2xl font-black text-white">{result.species}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Habitat</div>
                    <div className="text-sm text-slate-300">{result.habitat}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Status</div>
                    <div className="text-sm text-teal-400 font-bold">{result.conservationStatus}</div>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5">
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-bold">Physical Summary</div>
                  <div className="text-sm text-slate-400 italic">"{result.condition}"</div>
                </div>
              </div>
            </div>

            {/* Risk & Reasoning */}
            <div className="md:col-span-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#081215] border border-white/5 rounded-3xl p-8">
                  <div className="flex items-center gap-2 text-rose-400 font-black text-xs uppercase tracking-widest mb-6">
                    <Activity className="w-5 h-5" />
                    Adaptive Risk Engine
                  </div>
                  <div className="flex items-end justify-between mb-4">
                    <div className="text-5xl font-black text-white font-mono">{result.riskScore}<span className="text-lg text-slate-600">/100</span></div>
                    <div className={cn(
                      "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      result.riskScore > 75 ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : 
                      result.riskScore > 40 ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                      "bg-teal-500/10 text-teal-400 border-teal-500/20"
                    )}>
                      {result.riskScore > 75 ? "Critical" : result.riskScore > 40 ? "Warning" : "Safe"}
                    </div>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden mb-8">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${result.riskScore}%` }}
                      className={cn(
                        "h-full rounded-full",
                        result.riskScore > 75 ? "bg-rose-500 shadow-[0_0_10px_#f43f5e]" : 
                        result.riskScore > 40 ? "bg-amber-500 shadow-[0_0_10px_#f59e0b]" : 
                        "bg-teal-500 shadow-[0_0_10px_#14b8a6]"
                      )} 
                    />
                  </div>
                  <div className="space-y-2">
                    {result.environmentalThreats.map((t, i) => (
                      <div key={i} className="flex justify-between items-center text-xs p-3 bg-white/[0.02] rounded-xl border border-white/5">
                        <span className="text-slate-300">{t.name}</span>
                        <span className="font-bold text-slate-500">{t.impact}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#081215] border border-white/5 rounded-3xl p-8 flex flex-col">
                  <div className="flex items-center gap-2 text-teal-400 font-black text-xs uppercase tracking-widest mb-6">
                    <ShieldCheck className="w-5 h-5" />
                    AI Action Ruling
                  </div>
                  <div className="flex-1 space-y-6">
                    <p className="text-white text-lg font-medium leading-relaxed italic">
                      "{result.scientificReasoning}"
                    </p>
                  </div>
                  <div className="pt-8 pt-8">
                    {alertSent ? (
                      <div className="flex items-center justify-center gap-2 bg-teal-500 text-black px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                        <CheckCircle2 className="w-4 h-4" />
                        Intelligence Dispatched
                      </div>
                    ) : (
                      <button 
                        onClick={handleSendAlert}
                        className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-[0_0_15px_rgba(225,29,72,0.3)] transition-all active:scale-95"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Execute Broadcast Protocol
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
