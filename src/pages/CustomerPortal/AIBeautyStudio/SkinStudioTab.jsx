import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Droplets, 
  Sun, 
  ShieldCheck, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Calendar, 
  ArrowRight,
  Terminal,
  HelpCircle,
  Clock
} from 'lucide-react';
import { analyzeSkinHealth } from './skinAnalysisEngine';
import { SKIN_TREATMENT_SERVICES, SKIN_TYPES, SKIN_CONCERNS } from './beautyStudioData';

export const SkinStudioTab = ({
  photo,
  onBookTreatment
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [skinReport, setSkinReport] = useState(null);
  const [selectedConcern, setSelectedConcern] = useState(SKIN_CONCERNS[0].id);
  const [showPythonGuide, setShowPythonGuide] = useState(false);

  // Trigger skin analysis whenever a photo is uploaded or changed
  useEffect(() => {
    if (!photo) {
      setSkinReport(null);
      return;
    }

    let isMounted = true;
    setIsScanning(true);

    analyzeSkinHealth(photo).then(report => {
      if (isMounted) {
        setSkinReport(report);
        setIsScanning(false);
      }
    }).catch(() => {
      if (isMounted) setIsScanning(false);
    });

    return () => { isMounted = false; };
  }, [photo]);

  const handleManualRescan = () => {
    if (!photo) return;
    setIsScanning(true);
    setTimeout(() => {
      analyzeSkinHealth(photo).then(report => {
        setSkinReport(report);
        setIsScanning(false);
      });
    }, 600);
  };

  return (
    <div className="space-y-8">
      
      {/* ─── SKIN ANALYSIS DASHBOARD ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Scanned Photo & Biometric Scanner */}
        <div className="lg:col-span-5 bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              <span>Visible Skin Analysis</span>
            </span>

            {photo && (
              <button
                type="button"
                onClick={handleManualRescan}
                disabled={isScanning}
                className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw size={12} className={isScanning ? 'animate-spin' : ''} />
                <span>Re-Analyze</span>
              </button>
            )}
          </div>

          {/* Photo / Viewport with Scan Reticle */}
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black border border-white/15">
            {photo ? (
              <>
                <img 
                  src={photo} 
                  alt="Skin analysis target" 
                  className="w-full h-full object-cover" 
                />

                {/* Scanning Animation Sweep */}
                {isScanning && (
                  <div className="absolute inset-0 bg-primary/10 flex flex-col justify-between pointer-events-none">
                    <div className="w-full h-1 bg-primary shadow-[0_0_15px_rgba(225,29,72,1)] animate-bounce"></div>
                    <div className="p-3 text-center bg-black/70 backdrop-blur text-xs font-bold text-white">
                      Scanning CIE-LAB Redness & HSV Sebum Levels...
                    </div>
                  </div>
                )}

                {/* Target Zones Overlay */}
                {!isScanning && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    <div className="w-40 h-40 border-2 border-dashed border-primary/50 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-zinc-500 space-y-2">
                <Droplets size={32} className="text-zinc-600" />
                <p className="text-xs">Upload your portrait above to run live cosmetic skin analysis.</p>
              </div>
            )}
          </div>

          {/* Non-Medical Cosmetic Disclaimer */}
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2.5">
            <AlertCircle size={16} className="shrink-0 text-amber-400 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Cosmetic Assessment Disclaimer:</strong> Evaluates visible image colorimetry, surface hydration, and skin tone for salon skincare recommendations only. Not a medical diagnosis or medical software.
            </p>
          </div>
        </div>

        {/* Right: Metrics & Health Breakdown */}
        <div className="lg:col-span-7 bg-zinc-950/80 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                Skin Profile Summary
              </span>
              <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                {skinReport ? skinReport.skinType : 'Awaiting Photo Scan'}
              </h3>
            </div>

            {skinReport && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Balance Rating</div>
                  <div className="text-2xl font-bold text-emerald-400 font-display">{skinReport.overallScore}/100</div>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
                  ✓
                </div>
              </div>
            )}
          </div>

          {/* Metrics Sliders / Progress */}
          {skinReport ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Hydration */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                    <Droplets size={13} className="text-sky-400" /> Hydration Level
                  </span>
                  <span className="font-bold text-white">{skinReport.metrics.hydration}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-sky-400 transition-all duration-700" style={{ width: `${skinReport.metrics.hydration}%` }} />
                </div>
              </div>

              {/* Redness / Sensitivity */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                    <Activity size={13} className="text-rose-400" /> Redness Index (LAB a*)
                  </span>
                  <span className="font-bold text-white">{skinReport.metrics.redness}/100</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-rose-400 transition-all duration-700" style={{ width: `${skinReport.metrics.redness}%` }} />
                </div>
              </div>

              {/* Surface Smoothness */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                    <Sparkles size={13} className="text-amber-400" /> Smoothness Score
                  </span>
                  <span className="font-bold text-white">{skinReport.metrics.smoothness}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div className="h-full bg-amber-400 transition-all duration-700" style={{ width: `${skinReport.metrics.smoothness}%` }} />
                </div>
              </div>

              {/* Undertone */}
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-300 font-medium flex items-center gap-1.5">
                    <Sun size={13} className="text-primary" /> Detected Undertone
                  </span>
                  <span className="font-bold text-primary">{skinReport.undertone}</span>
                </div>
                <div className="text-[11px] text-zinc-400">
                  Optimal with warm gold, bronze & terracotta salon tones.
                </div>
              </div>

            </div>
          ) : (
            <div className="py-8 text-center text-zinc-500 text-xs">
              Upload your photo to view complete skin colorimetry, hydration and texture metrics.
            </div>
          )}

          {/* Recommendations Feed */}
          {skinReport && skinReport.recommendations?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Personalized Salon Skincare Recommendations
              </h4>
              <div className="space-y-2">
                {skinReport.recommendations.map((rec, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-white">{rec.title}</div>
                      <div className="text-zinc-300 text-[11px] mt-0.5">{rec.text}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onBookTreatment({
                        name: rec.suggestedService,
                        title: rec.suggestedService,
                        price: 85,
                        duration: '60 mins'
                      })}
                      className="shrink-0 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold text-[11px] uppercase tracking-wider shadow transition"
                    >
                      Book
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* ─── SALON SKINCARE SERVICES CATALOG ─── */}
      <div className="space-y-5 pt-4 border-t border-white/10">
        <div>
          <h3 className="font-display text-2xl font-bold text-white tracking-wide">
            Professional Salon Skincare Treatments
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Certified esthetician treatments targeting visible texture, deep hydration, and bridal radiance
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SKIN_TREATMENT_SERVICES.map(service => (
            <div 
              key={service.id}
              className="group rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 bg-zinc-950/80 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/3] overflow-hidden bg-black">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-center text-xs font-bold text-white">
                    <span>₹{service.price}</span>
                    <span className="text-zinc-300 text-[11px] font-normal">{service.duration}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-white text-sm group-hover:text-primary transition">
                    {service.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {service.idealFor.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-zinc-400">
                        {t} Skin
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => onBookTreatment(service)}
                  className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Calendar size={13} /> Book Treatment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── OPEN-SOURCE SKIN-SCAN PYTHON BACKEND SETUP INFO ─── */}
      <div className="bg-zinc-950/90 border border-white/10 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-primary" />
            <h4 className="font-bold text-white text-sm">
              Advanced Research Backend: DurtyDhiana/skin-scan Integration
            </h4>
          </div>
          <button
            type="button"
            onClick={() => setShowPythonGuide(!showPythonGuide)}
            className="text-xs text-primary hover:underline font-semibold"
          >
            {showPythonGuide ? 'Hide Instructions' : 'View Python Service Guide'}
          </button>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          StyleSync incorporates the mathematical methodology of <strong>DurtyDhiana/skin-scan</strong> (CIE LAB redness, HSV specular highlight isolation, and gradient texture variance) directly into the browser. If you wish to run the standalone Python FastAPI service with full OpenCV & MediaPipe, use the included <code className="text-zinc-200 bg-zinc-900 px-1 py-0.5 rounded">skin_scan_service.py</code>.
        </p>

        {showPythonGuide && (
          <div className="p-4 rounded-xl bg-black/80 border border-white/10 font-mono text-[11px] text-zinc-300 space-y-2 overflow-x-auto">
            <div className="text-emerald-400 font-bold"># Step 1: Install Python dependencies (Python 3.11+)</div>
            <div className="text-zinc-400">pip install fastapi uvicorn opencv-python mediapipe numpy pydantic</div>
            <div className="text-emerald-400 font-bold pt-2"># Step 2: Run the StyleSync Skin-Scan microservice</div>
            <div className="text-zinc-400">python skin_scan_service.py</div>
            <div className="text-emerald-400 font-bold pt-2"># Step 3: Service runs at http://localhost:8000/scan with full 7-channel heatmaps!</div>
          </div>
        )}
      </div>

    </div>
  );
};
