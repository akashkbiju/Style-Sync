import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Trash2, 
  RefreshCw, 
  Sparkles, 
  AlertCircle, 
  Check, 
  UserCheck,
  Image as ImageIcon
} from 'lucide-react';
import { LiveCameraModal } from './LiveCameraModal';

const DEMO_MODELS = [
  {
    name: 'Emma (Female Portrait)',
    gender: 'women',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'David (Male Portrait)',
    gender: 'men',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Sophia (Female Portrait)',
    gender: 'women',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=700&q=80'
  },
  {
    name: 'Alex (Male Portrait)',
    gender: 'men',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80'
  }
];

export const StudioPhotoUploader = ({ 
  photo, 
  onPhotoChange, 
  onRemovePhoto,
  studioTitle = 'Portrait',
  studioSubtitle = 'Upload or capture a clear photo'
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // File validation and conversion to optimized Base64
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
      setErrorMessage('File size exceeds 10MB. Please select a smaller photo.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Optimize & normalize to 1200px max dimension for fast canvas rendering
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
        setErrorMessage('Failed to decode image data.');
        setIsProcessing(false);
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read image file from disk.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
        
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-white tracking-wide flex items-center gap-2">
              <Camera size={18} className="text-primary" />
              {studioTitle} Photo Source
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              {studioSubtitle}
            </p>
          </div>

          {photo && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={12} /> Replace
              </button>

              <button
                type="button"
                onClick={onRemovePhoto}
                className="p-2 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                title="Remove photo"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) processImageFile(e.target.files[0]);
          }}
        />

        {/* Active Photo Preview OR Upload Dropzone */}
        {photo ? (
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-zinc-900 aspect-[3/4] max-h-96 mx-auto group shadow-inner flex items-center justify-center">
            <img
              src={photo}
              alt="Active Studio Portrait"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="bg-black/75 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <Check size={12} strokeWidth={3} /> Photo Ready
              </span>
              <span className="bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] text-zinc-400 border border-white/10">
                Local Device Only
              </span>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer ${
              isDragging
                ? 'border-primary bg-primary/10 scale-[1.01]'
                : 'border-white/15 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-white/30'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition shadow-lg">
              {isProcessing ? (
                <RefreshCw size={26} className="animate-spin text-primary" />
              ) : (
                <Upload size={26} />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-white">
                Drag & drop your photo here, or <span className="text-primary underline">browse</span>
              </p>
              <p className="text-xs text-zinc-400">
                Supports JPG, PNG, WEBP (Maximum size: 10MB)
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(225,29,72,0.4)] transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Upload size={14} /> Upload from Gallery
              </button>

              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-5 py-2.5 rounded-xl border border-white/20 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Camera size={14} /> Open Live Camera
              </button>
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Demo Model Selection Rack */}
        {!photo && (
          <div className="space-y-2 pt-1 border-t border-white/5">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Sparkles size={13} className="text-primary" /> Quick Try with Demo Portraits
              </span>
              <span>No upload required</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {DEMO_MODELS.map((model, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onPhotoChange(model.url)}
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-primary text-left transition-all aspect-[4/3] bg-zinc-900 cursor-pointer"
                >
                  <img
                    src={model.url}
                    alt={model.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[10px] font-bold text-white line-clamp-1">
                      {model.name.split(' ')[0]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Live Camera Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onPhotoCaptured={(capturedDataUrl) => {
          onPhotoChange(capturedDataUrl);
        }}
      />
    </>
  );
};
