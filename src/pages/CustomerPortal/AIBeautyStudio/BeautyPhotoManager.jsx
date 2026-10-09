import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  RefreshCw, 
  AlertCircle, 
  Check, 
  Sparkles, 
  X, 
  SwitchCamera, 
  Eye, 
  ShieldCheck 
} from 'lucide-react';

const DEMO_MODELS = [
  {
    name: 'Emma (Woman)',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'David (Man)',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Sophia (Woman)',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Alex (Man)',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'
  }
];

export const BeautyPhotoManager = ({
  photo,
  onPhotoChange,
  onReset,
  label = 'Your Photo',
  sublabel = 'Upload a clear front-facing portrait or snap with your live camera'
}) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCameraModal, setShowCameraModal] = useState(false);
  
  // Camera stream state
  const [stream, setStream] = useState(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [hasMultipleCameras, setHasMultipleCameras] = useState(false);

  // Check for multi-camera support
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(devices => {
        const videoInputs = devices.filter(d => d.kind === 'videoinput');
        setHasMultipleCameras(videoInputs.length > 1);
      }).catch(() => {});
    }
  }, []);

  // Validate and read file as base64
  const handleFileProcess = (file) => {
    setErrorMessage('');
    if (!file) return;

    // 1. MIME Validation
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setErrorMessage('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    // 2. Size limit: 8MB
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('File size exceeds 8MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onPhotoChange(e.target.result);
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read the selected file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  // Start Live Camera
  const startCamera = useCallback(async (mode = 'user') => {
    setCameraLoading(true);
    setCameraError(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser. Please use Chrome, Safari, or Edge.');
      setCameraLoading(false);
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
      setCameraLoading(false);
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraLoading(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser address bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. Please connect a webcam or upload from gallery.');
      } else if (err.name === 'NotReadableError') {
        setCameraError('Camera is being used by another application. Please close other camera apps.');
      } else {
        setCameraError(err.message || 'Unable to open camera.');
      }
    }
  }, [stream]);

  // Clean up camera stream on modal close
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }
    setShowCameraModal(false);
    setCameraError(null);
  }, [stream]);

  // Capture photo from video feed
  const capturePhoto = () => {
    if (!videoRef.current) return;
    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');

      // Flip horizontal if using front camera for natural mirror reflection
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

      onPhotoChange(dataUrl);
      stopCamera();
    } catch (e) {
      setCameraError('Failed to capture frame from video.');
    }
  };

  // Flip camera (front/back)
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  return (
    <div className="w-full space-y-4">
      
      {/* Photo Present View */}
      {photo ? (
        <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center gap-5">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-primary shadow-[0_0_15px_rgba(225,29,72,0.3)] shrink-0 bg-black">
            <img 
              src={photo} 
              alt="Uploaded user portrait" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[10px] text-emerald-400 font-bold flex items-center gap-1 border border-emerald-500/30">
              <Check size={10} /> Ready
            </div>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-[11px] font-bold uppercase tracking-wider">
                <Sparkles size={11} /> Photo Loaded
              </span>
            </div>
            <h4 className="text-white font-bold text-sm tracking-wide">
              {label} Active in Studio
            </h4>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
              Your portrait is loaded locally in memory. All beauty simulations, haircuts, skin analysis, and makeup swatches will preview on this photo.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <Upload size={13} /> Change Photo
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowCameraModal(true);
                  startCamera('user');
                }}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-white transition flex items-center gap-1.5 cursor-pointer"
              >
                <Camera size={13} /> Retake with Camera
              </button>

              <button
                type="button"
                onClick={onReset}
                className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-semibold text-rose-300 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload / Capture Box */
        <div className="space-y-4">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.[0]) handleFileProcess(e.dataTransfer.files[0]);
            }}
            className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all bg-zinc-950/60 backdrop-blur-sm ${
              isDragging 
                ? 'border-primary bg-primary/10 shadow-[0_0_25px_rgba(225,29,72,0.3)]' 
                : 'border-white/15 hover:border-white/30'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-primary shadow mx-auto">
                <Camera size={26} />
              </div>

              <div>
                <h4 className="font-display text-lg font-bold text-white tracking-wide">
                  {label}
                </h4>
                <p className="text-xs text-zinc-400 mt-1">
                  {sublabel}
                </p>
              </div>

              {/* Upload & Camera Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider transition shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Upload size={14} /> Upload From Device
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowCameraModal(true);
                    startCamera('user');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Camera size={14} /> Open Live Camera
                </button>
              </div>

              <div className="text-[11px] text-zinc-500 pt-1 flex items-center justify-center gap-1.5">
                <ShieldCheck size={12} className="text-emerald-400" />
                <span>Private & Secure: Photos remain in your local browser session and are never uploaded without consent.</span>
              </div>
            </div>
          </div>

          {/* Curated Demo Models for Instant Exploration */}
          <div className="bg-zinc-950/40 border border-white/10 rounded-xl p-3.5 space-y-2">
            <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Or try instant demo models:</span>
              <span className="text-zinc-500 text-[10px]">No upload required</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {DEMO_MODELS.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPhotoChange(m.url)}
                  className="flex items-center gap-2 p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 transition cursor-pointer text-left group"
                >
                  <img src={m.url} alt={m.name} className="w-8 h-8 rounded-full object-cover border border-white/20 shrink-0" />
                  <div className="truncate">
                    <div className="text-xs text-white group-hover:text-primary transition font-medium truncate">{m.name}</div>
                    <div className="text-[10px] text-zinc-500">{m.gender === 'girl' ? 'Woman' : 'Man'}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileProcess(e.target.files[0]);
          e.target.value = '';
        }}
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle size={15} className="shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-zinc-950 border border-white/15 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-zinc-900/60">
              <div className="flex items-center gap-2">
                <Camera size={16} className="text-primary" />
                <h4 className="font-display font-bold text-sm text-white tracking-wide">
                  Live Camera Capture
                </h4>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Preview Body */}
            <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
              {cameraLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/80 z-10 text-zinc-400 text-xs">
                  <RefreshCw size={24} className="animate-spin text-primary" />
                  <span>Requesting camera permission & initializing feed...</span>
                </div>
              )}

              {cameraError ? (
                <div className="p-6 text-center max-w-sm space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto">
                    <AlertCircle size={22} />
                  </div>
                  <h5 className="font-bold text-white text-sm">Camera Unavailable</h5>
                  <p className="text-xs text-zinc-400 leading-relaxed">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => startCamera(facingMode)}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold uppercase tracking-wider transition"
                  >
                    Retry Permission
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />

                  {/* Face Framing Oval Guide */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-64 sm:w-56 sm:h-72 border-2 border-dashed border-primary/60 rounded-[50%] shadow-[0_0_20px_rgba(225,29,72,0.3)]"></div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer Controls */}
            {!cameraError && (
              <div className="p-4 bg-zinc-900/80 border-t border-white/10 flex items-center justify-between">
                <div>
                  {hasMultipleCameras && (
                    <button
                      type="button"
                      onClick={toggleFacingMode}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 font-semibold flex items-center gap-1.5 transition"
                      title="Switch Front/Back Camera"
                    >
                      <SwitchCamera size={14} /> Flip Camera
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={capturePhoto}
                    disabled={cameraLoading}
                    className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.5)] transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Camera size={14} /> Snap Photo
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
