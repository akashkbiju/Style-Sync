import React, { useState, useEffect } from 'react';
import { 
  Key, 
  Server, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  ExternalLink, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  getAIServiceConfig, 
  saveAIServiceConfig, 
  clearAIServiceConfig 
} from './aiHairstyleService';

export const AIServiceConfigModal = ({ isOpen, onClose, onConfigSaved }) => {
  const [provider, setProvider] = useState('fal');
  const [apiKey, setApiKey] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getAIServiceConfig();
      setProvider(cfg.provider || 'fal');
      setApiKey(cfg.apiKey || '');
      setEndpoint(cfg.endpoint || '');
      setSaveSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    saveAIServiceConfig({
      provider,
      apiKey: apiKey.trim(),
      endpoint: endpoint.trim()
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onConfigSaved?.();
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    clearAIServiceConfig();
    setApiKey('');
    setEndpoint('');
    onConfigSaved?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow">
              <Key size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                AI Service Integration Settings
              </h3>
              <p className="text-xs text-zinc-400">
                Configure generative AI hairstyle try-on service credentials
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          
          {/* Status Alert */}
          <div className="p-4 bg-zinc-900/70 border border-white/10 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Transparent AI Integration Policy</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              StyleSync never simulates or fakes generative AI results. If no AI API key is configured, our interactive <strong>Canvas Hair Tint & Style Simulator</strong> operates locally in your browser. Enter a verified API key below to enable real generative portraits.
            </p>
          </div>

          {/* Provider Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Select AI Provider
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gemini', name: 'Google Gemini', desc: 'AI Studio / Imagen 3' },
                { id: 'fal', name: 'Fal.ai', desc: 'Flux Subject Portrait' },
                { id: 'replicate', name: 'Replicate API', desc: 'HairFast / SDXL' },
                { id: 'custom', name: 'Custom Backend', desc: 'Secure Serverless URL' },
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setProvider(p.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    provider === p.id
                      ? 'border-primary bg-primary/10 shadow ring-1 ring-primary'
                      : 'border-white/10 bg-zinc-900 hover:bg-zinc-800'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{p.name}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input */}
          {provider !== 'custom' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  {provider === 'gemini' 
                    ? 'Google Gemini / AI Studio Key' 
                    : provider === 'fal' 
                    ? 'Fal.ai API Key' 
                    : 'Replicate API Token'}
                </label>
                <a
                  href={
                    provider === 'gemini'
                      ? 'https://aistudio.google.com/app/apikey'
                      : provider === 'fal'
                      ? 'https://fal.ai/dashboard/keys'
                      : 'https://replicate.com/account/api-tokens'
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  Get Free API Key <ExternalLink size={10} />
                </a>
              </div>

              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={
                    provider === 'gemini'
                      ? 'AIzaSy...'
                      : provider === 'fal'
                      ? 'key_...'
                      : 'r8_...'
                  }
                  className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          )}

          {/* Custom Backend Endpoint Input */}
          {(provider === 'custom' || provider === 'replicate') && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Custom Endpoint / Proxy URL (Optional)
              </label>
              <input
                type="url"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                placeholder="https://your-domain.com/api/try-on"
                className="w-full px-4 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-primary"
              />
            </div>
          )}

          {/* Environment Variable Setup Note */}
          <div className="p-3 bg-zinc-900 rounded-xl border border-white/5 text-[11px] text-zinc-400 space-y-1 font-mono">
            <div className="text-zinc-300 font-sans font-bold text-xs mb-1">
              Alternative: Configure in your project's .env file:
            </div>
            <div>VITE_AI_HAIRSTYLE_PROVIDER={provider}</div>
            <div>VITE_AI_HAIRSTYLE_API_KEY=your_secret_token_here</div>
          </div>

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 size={16} /> Configuration updated successfully!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw size={13} /> Clear Key
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-primary hover:bg-primary/90 text-xs font-bold uppercase tracking-wider text-white shadow-[0_0_15px_rgba(225,29,72,0.4)] transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save size={14} /> Save Configuration
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
