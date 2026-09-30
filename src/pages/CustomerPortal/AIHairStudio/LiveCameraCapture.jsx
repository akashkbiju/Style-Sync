import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RefreshCw, X, AlertCircle, Sparkles, Check, SwitchCamera } from 'lucide-react';

export const LiveCameraCapture = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [facingMode, setFacingMode] = useState('user'); // 'user' (front) or 'environment' (back)
  const [isShutterActive, setIsShutterActive] = useState(false);
  const [capturedPreview, setCapturedPreview] = useState(null);

  // Initialize camera stream
  const startCamera = useCallback(async (mode = 'user') => {
    setIsLoading(true);
    setCameraError(null);

    // Stop any existing tracks
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Your browser does not support live camera access. Please use modern Chrome, Safari, or Edge.');
      setIsLoading(false);
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
        videoRef.current.play().catch(e => console.warn('Video play error:', e));
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setIsLoading(false);

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please click the lock or camera icon in your browser address bar to allow camera access.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. Please connect a webcam or upload a photo from your gallery.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setCameraError('Camera is currently in use by another application. Please close other camera apps and try again.');
      } else {
        setCameraError(err.message || 'Unable to access camera.');
      }
    }
  }, []);

  useEffect(() => {
    startCamera(facingMode);

    return () => {
      // Cleanup tracks on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [facingMode, startCamera]);

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current) return;

    // Visual shutter flash effect
    setIsShutterActive(true);
    setTimeout(() => setIsShutterActive(false), 200);

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
    setCapturedPreview(dataUrl);
  };

  const handleRetake = () => {
    setCapturedPreview(null);
  };

  const handleConfirm = () => {
    if (capturedPreview) {
      // Stop stream
      if (stream) stream.getTracks().forEach(t => t.stop());
      onCapture(capturedPreview);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Camera size={18} />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                Live Camera Capture
              </h3>
              <p className="text-xs text-zinc-400">
                Position your face inside the framing guide
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (stream) stream.getTracks().forEach(t => t.stop());
              onClose();
            }}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Camera"
          >
            <X size={20} />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div className="relative flex-1 bg-black aspect-[3/4] sm:aspect-[4/3] flex items-center justify-center overflow-hidden">
          
          {/* Shutter Flash Animation */}
          {isShutterActive && (
            <div className="absolute inset-0 bg-white z-40 animate-pulse opacity-90 pointer-events-none" />
          )}

          {/* Loading Indicator */}
          {isLoading && !cameraError && !capturedPreview && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 bg-black/60 text-white">
              <RefreshCw className="animate-spin text-primary" size={32} />
              <p className="text-sm font-medium">Starting camera...</p>
            </div>
          )}

          {/* Camera Error Display */}
          {cameraError && !capturedPreview && (
            <div className="p-6 text-center max-w-md z-30">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <AlertCircle size={28} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Camera Unavailable</h4>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                {cameraError}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => startCamera(facingMode)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition flex items-center gap-2"
                >
                  <RefreshCw size={14} /> Try Again
                </button>
                <button
                  onClick={() => {
                    if (stream) stream.getTracks().forEach(t => t.stop());
                    onClose();
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary hover:bg-primary/90 text-white transition"
                >
                  Upload File Instead
                </button>
              </div>
            </div>
          )}

          {/* Live Video Stream */}
          {!capturedPreview && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
              />

              {/* Face Guide Oval */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-72 sm:w-64 sm:h-80 border-2 border-dashed border-primary/70 rounded-[50%] shadow-[0_0_20px_rgba(225,29,72,0.3)] flex flex-col items-center justify-between p-4">
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-primary/80 bg-black/60 px-2 py-0.5 rounded-full">
                    Crown & Hair
                  </span>
                  <span className="text-[10px] tracking-widest uppercase font-semibold text-primary/80 bg-black/60 px-2 py-0.5 rounded-full">
                    Chin Position
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Captured Still Preview */}
          {capturedPreview && (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={capturedPreview}
                alt="Captured Snapshot"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-emerald-500/90 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                <Check size={13} /> Photo Captured
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-zinc-900/80 flex items-center justify-between gap-4">
          {!capturedPreview ? (
            <>
              {/* Camera Switch button (for mobile front/back) */}
              <button
                type="button"
                onClick={toggleFacingMode}
                disabled={isLoading || !!cameraError}
                className="p-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition disabled:opacity-50"
                title="Switch Camera (Front/Rear)"
              >
                <SwitchCamera size={18} />
              </button>

              {/* Shutter Capture Button */}
              <button
                type="button"
                onClick={handleSnapPhoto}
                disabled={isLoading || !!cameraError}
                className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-white shadow-[0_0_25px_rgba(225,29,72,0.6)] transition-all transform active:scale-95 disabled:opacity-50"
                title="Take Photo"
              >
                <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                  <Camera size={20} className="group-hover:scale-110 transition-transform" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (stream) stream.getTracks().forEach(t => t.stop());
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="px-5 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold tracking-wider uppercase transition flex items-center gap-2"
              >
                <RefreshCw size={14} /> Retake
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold tracking-wider uppercase shadow-[0_0_20px_rgba(225,29,72,0.4)] transition flex items-center gap-2"
              >
                <Sparkles size={14} /> Use This Photo
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
