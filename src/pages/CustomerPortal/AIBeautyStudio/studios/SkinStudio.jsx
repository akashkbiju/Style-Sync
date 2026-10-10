import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  Check, 
  Heart, 
  ArrowRight,
  Droplets,
  Activity,
  Layers,
  Info,
  Server
} from 'lucide-react';
import { SKIN_CARE_METRICS } from '../beautyStudioData';
import { runSkinAnalysis, checkSkinScanBackendStatus } from '../services/skinAnalysisService';

export const SkinStudio = ({ 
  userPhoto, 
  onSaveFavorite, 
  onBookService 
}) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [backendActive, setBackendActive] = useState(false);
  const [isCheckingBackend, setIsCheckingBackend] = useState(true);

  // Check if Python skin-scan backend is reachable
  useEffect(() => {
    let mounted = true;
    checkSkinScanBackendStatus().then(status => {
      if (mounted) {
        setBackendActive(status);
        setIsCheckingBackend(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  // Run analysis whenever user photo is provided or refreshed
  useEffect(() => {
    if (!userPhoto) {
      setAnalysisResult(null);
      return;
    }

    let isCancelled = false;
    setIsScanning(true);

    runSkinAnalysis(userPhoto).then(res => {
      if (!isCancelled) {
        setAnalysisResult(res);
        setIsScanning(false);
      }
    });

    return () => { isCancelled = true; };
  }, [userPhoto]);

  return (
    <div className="space-y-8">
      
      {/* Backend Status & Disclaimers Banner */}
      <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <h4 className="font-display text-sm font-bold text-white tracking-wide">
              AI Cosmetic Skin Characteristics Scanner
            </h4>
          </div>
          <p className="text-[11px] text-zinc-400 leading-relaxed max-w-xl">
            Uses non-invasive optical colorimetry based on the open-source <strong>DurtyDhiana/skin-scan</strong> OpenCV pipeline. Evaluates visible skin tone, surface hydration balance, and pore refinement to suggest optimal salon facials.
          </p>
        </div>

        {/* Backend Connectivity Status Pill */}
        <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-zinc-900 text-xs font-semibold">
          <Server size={13} className={backendActive ? 'text-emerald-400' : 'text-amber-400'} />
          <span className="text-zinc-300">
            {backendActive ? 'Python OpenCV Service Active' : 'Client-Side Optical Mode'}
          </span>
          <span className={`w-2 h-2 rounded-full ${backendActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
        </div>
      </div>

      {/* Main Grid: Photo with Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Photo Portrait & Scanning Overlay */}
        <div className="lg:col-span-5 bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-display text-base font-bold text-white">
              Analyzed Skin Canvas
            </h4>
            {userPhoto && (
              <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded-full border border-white/10">
                Central Facial Region
              </span>
            )}
          </div>

          <div className="relative aspect-[3/4] max-h-[440px] bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center mx-auto shadow-inner">
            {isScanning && (
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3 text-white text-xs font-semibold">
                <RefreshCw size={24} className="animate-spin text-primary" />
                <span>Scanning skin chromatic distribution & sebum index...</span>
              </div>
            )}

            {userPhoto ? (
              <>
                <img
                  src={userPhoto}
                  alt="Skin Analysis Portrait"
                  className="w-full h-full object-cover"
                />

                {/* Grid Overlay Scanner effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(225,29,72,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(225,29,72,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                    {analysisResult?.skinType || 'Analyzing...'}
                  </span>
                  <span className="bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-zinc-400 border border-white/10">
                    LAB / HSV Colorimetry
                  </span>
                </div>
              </>
            ) : (
              <div className="p-8 text-center space-y-2 text-zinc-400">
                <Droplets size={26} className="mx-auto text-primary" />
                <p className="text-xs">
                  Upload your portrait in the photo box above to generate your customized skin analysis report.
                </p>
              </div>
            )}
          </div>

          {/* Explicit Medical Disclaimer */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-[11px] text-amber-300 leading-relaxed flex items-start gap-2">
            <Info size={14} className="shrink-0 mt-0.5 text-amber-400" />
            <span>
              <strong>Cosmetic Disclaimer:</strong> This cosmetic analysis provides general beauty guidance for salon facials and skin preparation. It is not a medical diagnostic device and does not diagnose dermatological medical conditions.
            </span>
          </div>
        </div>

        {/* Right: Metrics & Tailored Salon Treatment */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Skin Characteristic Scores */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-primary" />
                  Cosmetic Characteristic Scores
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Calculated from RGB/LAB color channel delta and specular reflectance
                </p>
              </div>

              {analysisResult && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  {analysisResult.skinType}
                </span>
              )}
            </div>

            {/* Score Progress Bars */}
            <div className="space-y-4">
              {SKIN_CARE_METRICS.map(metric => {
                const score = analysisResult?.scores?.[metric.key] || 45;
                return (
                  <div key={metric.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{metric.label}</span>
                      <span className="text-primary font-extrabold">{score}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-zinc-900 border border-white/5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-rose-400 rounded-full transition-all duration-700"
                        style={{ width: `${score}%` }}
                      />
                    </div>

                    <p className="text-[10px] text-zinc-500">
                      {metric.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {analysisResult?.summary && (
              <div className="p-3.5 bg-zinc-900 rounded-2xl border border-white/5 text-xs text-zinc-300">
                <strong className="text-primary block text-[11px] uppercase tracking-wider mb-0.5">Summary Profile:</strong>
                {analysisResult.summary}
              </div>
            )}
          </div>

          {/* Tailored Salon Skincare Recommendation */}
          {analysisResult?.salonTreatmentRecommendation && (
            <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-primary/40 rounded-3xl p-6 shadow-2xl space-y-4 ring-1 ring-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1.5">
                  <Sparkles size={12} /> Recommended Salon Facial
                </span>
                <span className="text-xs text-zinc-400">
                  Duration: {analysisResult.salonTreatmentRecommendation.expectedDuration}
                </span>
              </div>

              <h4 className="font-display text-xl font-bold text-white">
                {analysisResult.salonTreatmentRecommendation.serviceName}
              </h4>

              <div className="space-y-2 text-xs">
                <p className="text-zinc-300">
                  <strong className="text-white">Treatment Focus:</strong> {analysisResult.salonTreatmentRecommendation.focus}
                </p>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  <strong className="text-zinc-300">At-Home Regimen Advice:</strong> {analysisResult.salonTreatmentRecommendation.homeAdvice}
                </p>
              </div>

              <button
                type="button"
                onClick={() => onBookService({
                  name: analysisResult.salonTreatmentRecommendation.serviceName,
                  description: analysisResult.salonTreatmentRecommendation.focus,
                  image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
                }, 'Skin')}
                className="w-full py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(225,29,72,0.4)] transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Book This Skincare Treatment</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
