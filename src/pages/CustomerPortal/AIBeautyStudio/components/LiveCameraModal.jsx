import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, AlertCircle, Check, SwitchCamera } from 'lucide-react';

export const LiveCameraModal = ({ isOpen, onClose, onPhotoCaptured }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [facingMode, setFacingMode] = useState('user'); // 'user' (front) or 'environment' (back)
  const [capturedData, setCapturedData] = useState(null);
  const [isShutterFlashing, setIsShutterFlashing] = useState(false);

  const stopTracks = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const startCamera = useCallback(async (mode = 'user') => {
    setIsLoading(true);
    setCameraError(null);
    setCapturedData(null);

    // Stop current stream before switching
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Your web browser does not support live camera access. Please use modern Chrome, Safari, or Edge.');
      setIsLoading(false);
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(e => console.warn('Video play warning:', e));
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Camera capture error:', err);
      setIsLoading(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please click the lock or camera icon in your browser address bar to allow camera permissions.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera device detected on this system. You can upload a photo from your gallery instead.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is currently in use by another software or application. Please close other camera apps and retry.');
      } else {
        setCameraError(err.message || 'Unable to access live camera stream.');
      }
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopTracks();
    }

    return () => {
      stopTracks();
    };
  }, [isOpen, facingMode]);

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  const handleSnap = () => {
    if (!videoRef.current) return;

    setIsShutterFlashing(true);
    setTimeout(() => setIsShutterFlashing(false), 150);

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 960;
    const ctx = canvas.getContext('2d');

    // If front camera, mirror image for natural reflection
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedData(dataUrl);
  };

  const handleConfirmPhoto = () => {
    if (capturedData) {
      onPhotoCaptured(capturedData);
      stopTracks();
      onClose();
    }
  };

  const handleRetake = () => {
    setCapturedData(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
              <Camera size={16} />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white tracking-wide">
                Live Studio Camera
              </h3>
              <p className="text-[11px] text-zinc-400">
                Capture high-resolution portrait with good lighting
              </p>
            </div>
          </div>

          <button
            onClick={() => { stopTracks(); onClose(); }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative aspect-[4/3] bg-black overflow-hidden flex items-center justify-center">
          
          {/* Shutter flash animation */}
          {isShutterFlashing && (
            <div className="absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-150" />
          )}

          {/* Loading indicator */}
          {isLoading && !cameraError && (
            <div className="flex flex-col items-center gap-3 text-zinc-400 z-10">
              <RefreshCw size={24} className="animate-spin text-primary" />
              <span className="text-xs font-medium">Connecting to camera sensor...</span>
            </div>
          )}

          {/* Error Message */}
          {cameraError && (
            <div className="p-6 max-w-sm text-center space-y-3 z-10">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
                <AlertCircle size={22} />
              </div>
              <p className="text-xs text-rose-300 leading-relaxed font-medium">
                {cameraError}
              </p>
              <button
                type="button"
                onClick={() => startCamera(facingMode)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition inline-flex items-center gap-2"
              >
                <RefreshCw size={13} /> Retry Permission
              </button>
            </div>
          )}

          {/* Live Video Stream */}
          {!capturedData && !cameraError && (
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
          )}

          {/* Captured Preview */}
          {capturedData && (
            <img
              src={capturedData}
              alt="Live Captured Snapshot"
              className="w-full h-full object-cover"
            />
          )}

          {/* Facial Frame Overlay Guide */}
          {!capturedData && !cameraError && !isLoading && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-52 h-64 border-2 border-dashed border-white/30 rounded-[45%] shadow-[0_0_50px_rgba(0,0,0,0.5)]" />
              <div className="absolute bottom-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-zinc-300 border border-white/10">
                Center face inside oval guide
              </div>
            </div>
          )}

          {/* Flip Camera Switch Button */}
          {!capturedData && !cameraError && !isLoading && (
            <button
              type="button"
              onClick={toggleFacingMode}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 transition shadow-lg cursor-pointer active:scale-95"
              title="Switch Front/Back Camera"
            >
              <SwitchCamera size={16} />
            </button>
          )}

        </div>

        {/* Action Controls */}
        <div className="p-5 bg-zinc-900/60 border-t border-white/10 flex items-center justify-between">
          {!capturedData ? (
            <>
              <button
                type="button"
                onClick={() => { stopTracks(); onClose(); }}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isLoading || !!cameraError}
                onClick={handleSnap}
                className="px-8 py-3 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(225,29,72,0.5)] transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Camera size={16} /> Take Photo
              </button>

              <div className="w-16" />
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-5 py-2.5 rounded-xl border border-white/20 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={14} /> Retake
              </button>

              <button
                type="button"
                onClick={handleConfirmPhoto}
                className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.4)] transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Check size={16} /> Use This Photo
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
