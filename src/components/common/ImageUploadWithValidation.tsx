import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle2, Link2, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface ImageUploadWithValidationProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  maxSizeMB?: number;
  allowedFormats?: string[];
  aspectRatioHint?: string;
  required?: boolean;
}

export const ImageUploadWithValidation: React.FC<ImageUploadWithValidationProps> = ({
  value,
  onChange,
  label = 'Image Upload',
  maxSizeMB = 3,
  allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  aspectRatioHint = 'Recommended: 16:9 for banners or 1:1 for portraits',
  required = false
}) => {
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{ width?: number; height?: number; sizeKb?: number; type?: string } | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleImages = [
    { label: 'Campus Panorama', url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Academic Building', url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Modern Laboratory', url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Faculty Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Central Library', url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80' }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Format validation
    if (!allowedFormats.includes(file.type)) {
      setError(`Invalid file format (${file.type || 'unknown'}). Allowed: JPG, PNG, WebP, GIF.`);
      return;
    }

    // 2. Size validation
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setError(`File size (${sizeMB} MB) exceeds maximum allowed ${maxSizeMB} MB limit.`);
      return;
    }

    // 3. Image dimensions validation via FileReader and Image object
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const resultDataUrl = uploadEvent.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth < 100 || img.naturalHeight < 100) {
          setError(`Image resolution is too low (${img.naturalWidth}x${img.naturalHeight}). Minimum is 100x100px.`);
          return;
        }

        setMetadata({
          width: img.naturalWidth,
          height: img.naturalHeight,
          sizeKb: Math.round(file.size / 1024),
          type: file.type
        });
        onChange(resultDataUrl);
      };
      img.onerror = () => {
        setError('Corrupted image file or unable to decode image dimensions.');
      };
      img.src = resultDataUrl;
    };
    reader.onerror = () => {
      setError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    setError(null);
    if (!urlInput.trim()) {
      onChange('');
      return;
    }
    const trimmed = urlInput.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setError('Image URL must start with http:// or https://');
      return;
    }

    const testImg = new Image();
    testImg.onload = () => {
      setMetadata({
        width: testImg.naturalWidth,
        height: testImg.naturalHeight
      });
      onChange(trimmed);
    };
    testImg.onerror = () => {
      setError('Could not load image from the provided URL. Please verify the link.');
    };
    testImg.src = trimmed;
  };

  const handleRemove = () => {
    onChange('');
    setMetadata(null);
    setError(null);
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              mode === 'upload' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded font-medium transition-colors ${
              mode === 'url' ? 'bg-emerald-100 text-emerald-800' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            External URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-lg p-4 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/20 transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={allowedFormats.join(',')}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-1.5 text-slate-500 group-hover:text-emerald-700">
              <Upload className="w-5 h-5 transition-transform group-hover:-translate-y-0.5" />
              <p className="text-xs font-medium text-slate-700">
                Click to browse or drag & drop image
              </p>
              <p className="text-[11px] text-slate-400">
                JPG, PNG, WebP or GIF up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link2 className="absolute left-2.5 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
            <Button size="sm" variant="outline" type="button" onClick={handleApplyUrl}>
              Apply URL
            </Button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Samples:
            </span>
            {sampleImages.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setUrlInput(s.url);
                  onChange(s.url);
                  setMetadata(null);
                  setError(null);
                }}
                className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-600 rounded border border-slate-200 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Validation Error Message */}
      {error && (
        <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-md flex items-start gap-2 text-rose-700 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold">Validation Error:</span> {error}
          </div>
        </div>
      )}

      {/* Image Preview & Details */}
      {value && !error && (
        <div className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-1.5">
            <span className="font-medium text-slate-700 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Valid Image Ready
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-rose-600 hover:text-rose-800 text-xs font-medium flex items-center gap-0.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Remove
            </button>
          </div>

          <div className="relative group rounded-md overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center max-h-48">
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-44 object-cover"
              onError={() => setError('Image failed to render preview')}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
            <span>
              {metadata?.width && metadata?.height ? `${metadata.width} × ${metadata.height} px` : 'Online URL image'}
              {metadata?.sizeKb ? ` • ${metadata.sizeKb} KB` : ''}
              {metadata?.type ? ` • ${metadata.type.replace('image/', '').toUpperCase()}` : ''}
            </span>
            <span className="text-slate-400 italic text-[10px]">{aspectRatioHint}</span>
          </div>
        </div>
      )}
    </div>
  );
};
