import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  RotateCw, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  UserCheck, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { LiveCameraCapture } from './LiveCameraCapture';

// Curated demo models for instant try-on without forcing upload
const DEMO_MODELS = [
  {
    name: 'Emma (Female Model)',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'David (Male Model)',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Sophia (Female Model)',
    gender: 'girl',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Alex (Male Model)',
    gender: 'boy',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'
  }
];

export const PhotoUploader = ({ 
  photo, 
  onPhotoChange, 
  onReset 
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  // File validation and conversion to Base64
  const processImageFile = (file) => {
    setErrorMessage('');

    if (!file) return;

    // 1. Validate MIME type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Unsupported file format. Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    // 2. Validate File Size (Max 10MB)
    const MAX_SIZE_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMessage('File size exceeds 10MB. Please select a smaller portrait photograph.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Normalize / resize to optimal 1200px max dimension for fast processing
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height *= MAX_DIM / width;
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width *= MAX_DIM / height;
            height = MAX_DIM;
          }
        }

        canvas.width = Math.round(width);
        canvas.height = Math.round(height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.90);
        onPhotoChange(optimizedDataUrl);
        setIsProcessing(false);
      };
      img.onerror = () => {
        setErrorMessage('Failed to decode image file. Please try another photo.');
        setIsProcessing(false);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setErrorMessage('Error reading file from disk.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  // Rotate photo 90 degrees clockwise
  const handleRotate = () => {
    if (!photo) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.height;
      canvas.height = img.width;
      const ctx = canvas.getContext('2d');

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((90 * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const rotatedUrl = canvas.toDataURL('image/jpeg', 0.92);
      onPhotoChange(rotatedUrl);
      setIsProcessing(false);
    };
    img.onerror = () => {
      setIsProcessing(false);
    };
    img.src = photo;
  };

  return (
    <div className="w-full">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
      />

      {/* Error Banner */}
      {errorMessage && (
        <div className="mb-4 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-300 text-xs">
          <AlertCircle size={18} className="shrink-0 text-rose-400" />
          <span className="flex-1">{errorMessage}</span>
          <button 
            onClick={() => setErrorMessage('')} 
            className="text-rose-400 hover:text-white font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* STATE 1: No Photo Uploaded yet */}
      {!photo ? (
        <div className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(225,29,72,0.3)]'
                : 'border-white/15 bg-zinc-950/60 hover:border-primary/50 hover:bg-zinc-900/40'
            }`}
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-2xl pointer-events-none" />

            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-primary shadow-xl group">
                <Upload size={32} className="group-hover:-translate-y-1 transition-transform" />
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2 tracking-wide">
                Upload Portrait or Take Live Photo
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mb-6 leading-relaxed">
                Take a straight-facing photo with good lighting and clear view of hair and forehead for optimal AI styling accuracy.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                >
                  <Upload size={16} /> Choose Photo
                </button>

                <button
                  type="button"
                  onClick={() => setShowCameraModal(true)}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95"
                >
                  <Camera size={16} /> Open Live Camera
                </button>
              </div>

              <div className="mt-5 text-[11px] text-zinc-500">
                Supports JPG, PNG, WEBP (Max 10MB) • Private & secure client processing
              </div>
            </div>
          </div>

          {/* Quick Demo Models */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              <Sparkles size={14} className="text-primary" />
              <span>Or Try Instantly with Salon Demo Models:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DEMO_MODELS.map((demo) => (
                <button
                  key={demo.name}
                  type="button"
                  onClick={() => onPhotoChange(demo.url)}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-primary transition-all aspect-[4/5] bg-zinc-900 cursor-pointer text-left"
                >
                  <img
                    src={demo.url}
                    alt={demo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                    <span className="text-[11px] font-bold text-white group-hover:text-primary transition-colors">
                      {demo.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-zinc-400">
                      {demo.gender === 'boy' ? 'Gentleman' : 'Lady'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: Photo Uploaded & Ready */
        <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-zinc-950 p-4 sm:p-6 shadow-2xl">
          
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* Photo Thumbnail */}
            <div className="relative w-48 sm:w-56 aspect-[3/4] rounded-xl overflow-hidden border-2 border-primary/40 shadow-xl bg-zinc-900 shrink-0">
              <img
                src={photo}
                alt="Your Portrait"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-emerald-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                <Check size={11} /> Ready
              </div>
            </div>

            {/* Photo Info & Quick Toolbar */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <span className="text-[11px] uppercase tracking-widest font-bold text-primary">
                  Customer Portrait Active
                </span>
                <h3 className="font-display text-xl font-bold text-white mt-0.5">
                  Your Photo is Ready for Virtual Styling
                </h3>
                <p className="text-xs text-zinc-400 mt-1 max-w-md">
                  Select any hairstyle from the catalog below or test vibrant salon colors. You can rotate, retake, or replace your portrait at any time.
                </p>
              </div>

              {/* Toolbar Actions */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-2">
                
                {/* Rotate */}
                <button
                  type="button"
                  onClick={handleRotate}
                  disabled={isProcessing}
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  title="Rotate 90 degrees clockwise"
                >
                  <RotateCw size={14} className={isProcessing ? 'animate-spin' : ''} />
                  <span>Rotate</span>
                </button>

                {/* Replace File */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  title="Upload a different photo"
                >
                  <Upload size={14} />
                  <span>Replace Photo</span>
                </button>

                {/* Retake with Camera */}
                <button
                  type="button"
                  onClick={() => setShowCameraModal(true)}
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  title="Open live camera"
                >
                  <Camera size={14} />
                  <span>Retake Camera</span>
                </button>

                {/* Clear / Remove */}
                <button
                  type="button"
                  onClick={onReset}
                  className="px-3.5 py-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-xs font-semibold text-rose-300 hover:text-rose-100 transition flex items-center gap-1.5 cursor-pointer"
                  title="Remove photo"
                >
                  <Trash2 size={14} />
                  <span>Remove</span>
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Live Camera Modal */}
      {showCameraModal && (
        <LiveCameraCapture
          onCapture={(capturedDataUrl) => {
            onPhotoChange(capturedDataUrl);
            setShowCameraModal(false);
          }}
          onClose={() => setShowCameraModal(false)}
        />
      )}
    </div>
  );
};
