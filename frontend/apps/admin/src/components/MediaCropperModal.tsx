import React, { useState, useRef, useEffect } from 'react';
import { Crop, RotateCw, Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (url: string) => void;
  aspectRatioPreset?: '1:1' | '16:9' | '4:5' | 'free';
  targetFolder?: string;
  authToken: string;
}

export const MediaCropperModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  aspectRatioPreset = '1:1',
  targetFolder = 'branding',
  authToken,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<'1:1' | '16:9' | '4:5' | 'free'>(aspectRatioPreset);
  const [isUploading, setIsUploading] = useState(false);

  // Drag-to-crop coordinates state
  const [isDragging, setIsDragging] = useState(false);
  const [cropRect, setCropRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAspect(aspectRatioPreset);
    setCropRect(null);
  }, [aspectRatioPreset]);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCropRect(null);
    };
    reader.readAsDataURL(file);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDragging(true);
    setDragStart({ x, y });
    setCropRect({ x, y, w: 10, h: 10 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    let w = currentX - dragStart.x;
    let h = currentY - dragStart.y;

    let x = w < 0 ? currentX : dragStart.x;
    let y = h < 0 ? currentY : dragStart.y;
    w = Math.abs(w);
    h = Math.abs(h);

    if (aspect === '1:1') {
      const side = Math.max(w, h);
      w = side;
      h = side;
    } else if (aspect === '16:9') {
      h = Math.round(w * (9 / 16));
    } else if (aspect === '4:5') {
      h = Math.round(w * (5 / 4));
    }

    setCropRect({ x, y, w, h });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleUpload = () => {
    if (!selectedImage) return;

    setIsUploading(true);
    const img = new Image();
    img.src = selectedImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx || !containerRef.current) return;

      const containerW = containerRef.current.clientWidth;
      const containerH = containerRef.current.clientHeight;

      const scaleX = img.width / containerW;
      const scaleY = img.height / containerH;

      // Extract crop dimensions or use full image if no custom crop box dragged
      let sourceX = cropRect ? cropRect.x * scaleX : 0;
      let sourceY = cropRect ? cropRect.y * scaleY : 0;
      let sourceW = cropRect ? cropRect.w * scaleX : img.width;
      let sourceH = cropRect ? cropRect.h * scaleY : img.height;

      canvas.width = sourceW;
      canvas.height = sourceH;

      ctx.save();
      if (rotation !== 0) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
      } else {
        ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, canvas.width, canvas.height);
      }
      ctx.restore();

      canvas.toBlob(async (blob) => {
        if (!blob) return;

        const formData = new FormData();
        formData.append('file', blob, `media_${Date.now()}.png`);
        formData.append('folder', targetFolder);

        try {
          const res = await fetch('/api/v1/media/upload', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${authToken}`,
            },
            body: formData,
          });

          const json = await res.json();
          if (json.success && json.data?.url) {
            onUploadSuccess(json.data.url);
            onClose();
          }
        } catch (err) {
          console.error('Upload failed:', err);
        } finally {
          setIsUploading(false);
        }
      }, 'image/png');
    };
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(4, 6, 14, 0.88)', backdropFilter: 'blur(12px)', zIndex: 9999 }} onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '660px', width: '100%', background: '#0D1120', border: '1px solid rgba(79,70,229,0.4)', borderRadius: '24px', padding: '28px', boxShadow: '0 24px 60px rgba(0,0,0,0.8)' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Crop size={20} color="#FFF" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#FFF' }}>Interactive Media Studio</h3>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '6px' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Upload File Select / Interactive Drag Crop Box */}
        {!selectedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: '260px', border: '2px dashed rgba(79,70,229,0.4)', borderRadius: '18px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', background: 'rgba(79,70,229,0.06)', transition: 'all 0.2s'
            }}
          >
            <Upload size={40} color="#A5B4FC" style={{ marginBottom: '12px' }} />
            <div style={{ fontWeight: 800, fontSize: '16px', color: '#FFF' }}>Click to Choose Image File</div>
            <div style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>PNG, JPG, WEBP up to 10MB</div>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileSelect} />
          </div>
        ) : (
          <div>
            {/* Drag Crop Canvas Window */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{
                height: '320px', background: '#07090F', borderRadius: '18px', overflow: 'hidden',
                position: 'relative', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '22px',
                cursor: 'crosshair', userSelect: 'none'
              }}
            >
              <img
                src={selectedImage}
                alt="Target Asset"
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 0.15s ease', pointerEvents: 'none'
                }}
              />

              {/* Drag Box Crop Selection Rect */}
              {cropRect && cropRect.w > 0 && cropRect.h > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    left: `${cropRect.x}px`,
                    top: `${cropRect.y}px`,
                    width: `${cropRect.w}px`,
                    height: `${cropRect.h}px`,
                    border: '2px dashed #06B6D4',
                    background: 'rgba(6, 182, 212, 0.15)',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
                    pointerEvents: 'none'
                  }}
                >
                  <div style={{ position: 'absolute', top: '-24px', left: 0, background: '#06B6D4', color: '#000', fontSize: '10px', fontWeight: 900, padding: '2px 6px', borderRadius: '4px' }}>
                    CROP SELECTION ({Math.round(cropRect.w)} x {Math.round(cropRect.h)})
                  </div>
                </div>
              )}
            </div>

            {/* Aspect Ratio Selector Controls */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
                ASPECT RATIO PRESET (CLICK & DRAG MOUSE TO CROP)
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {(['1:1', '16:9', '4:5', 'free'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    style={{
                      flex: 1, padding: '10px 4px', fontSize: '12px', fontWeight: 800,
                      cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                      background: aspect === r ? 'linear-gradient(135deg, #4F46E5, #06B6D4)' : 'rgba(255, 255, 255, 0.08)',
                      color: aspect === r ? '#FFFFFF' : '#E5E7EB',
                      border: aspect === r ? 'none' : '1px solid rgba(255, 255, 255, 0.18)',
                      borderRadius: '10px',
                      boxShadow: aspect === r ? '0 4px 14px rgba(79,70,229,0.4)' : 'none'
                    }}
                    onClick={() => {
                      setAspect(r);
                      setCropRect(null);
                    }}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-cta"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: '1px solid rgba(255,255,255,0.18)', padding: '10px 16px', fontWeight: 700, borderRadius: '12px' }}
                onClick={() => setRotation((r) => (r + 90) % 360)}
              >
                <RotateCw size={15} /> Rotate
              </button>
              <button
                type="button"
                className="btn-cta"
                style={{ background: 'rgba(255,255,255,0.08)', color: '#FFF', border: '1px solid rgba(255,255,255,0.18)', padding: '10px 16px', fontWeight: 700, borderRadius: '12px' }}
                onClick={() => { setSelectedImage(null); setCropRect(null); }}
              >
                Change Image
              </button>
              <button
                type="button"
                disabled={isUploading}
                className="btn-cta"
                style={{ flex: 1, background: 'linear-gradient(135deg,#4F46E5,#06B6D4)', color: '#FFF', justifyContent: 'center', fontWeight: 800, borderRadius: '12px', fontSize: '14px' }}
                onClick={handleUpload}
              >
                {isUploading ? 'Uploading Media...' : 'Upload Media'} <Check size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
