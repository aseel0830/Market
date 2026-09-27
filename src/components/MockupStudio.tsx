import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Upload,
  RotateCcw,
  Sparkles,
  Download,
  Eye,
  Sliders,
  Palette,
  Layers,
  Wand2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Move,
  Image as ImageIcon,
} from 'lucide-react';
import {
  MOCKUP_TEMPLATES,
  SAMPLE_LOGOS,
  MockupTemplate,
  SampleLogo,
} from '../data/mockupTemplates';
import {
  PlacementConfig,
  loadImage,
  processLogoImage,
  renderMockup,
} from '../utils/mockupCanvas';

interface MockupStudioProps {
  currentLogoUrl: string | null;
  setCurrentLogoUrl: (url: string) => void;
  onSendToAIEditor: (mockupDataUrl: string) => void;
  onSendToProGen: (logoDataUrl: string) => void;
}

export const MockupStudio: React.FC<MockupStudioProps> = ({
  currentLogoUrl,
  setCurrentLogoUrl,
  onSendToAIEditor,
  onSendToProGen,
}) => {
  // Active product template
  const [selectedTemplate, setSelectedTemplate] = useState<MockupTemplate>(MOCKUP_TEMPLATES[0]);
  const [activeCategory, setActiveCategory] = useState<'all' | 'mugs' | 'apparel' | 'accessories'>('all');
  const [selectedColor, setSelectedColor] = useState<string>(MOCKUP_TEMPLATES[0].defaultColor);

  // Placement parameters
  const [placement, setPlacement] = useState<PlacementConfig>({
    ...MOCKUP_TEMPLATES[0].defaultPlacement,
    colorEffect: 'original',
    removeWhiteBg: false,
  });

  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Loaded image cache
  const [productImageElem, setProductImageElem] = useState<HTMLImageElement | null>(null);
  const [logoImageElem, setLogoImageElem] = useState<HTMLImageElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Load default sample logo on first mount if none set
  useEffect(() => {
    if (!currentLogoUrl) {
      setCurrentLogoUrl(SAMPLE_LOGOS[0].svgDataUri);
    }
  }, [currentLogoUrl, setCurrentLogoUrl]);

  // Load product template image whenever template changes
  useEffect(() => {
    let isCancelled = false;
    loadImage(selectedTemplate.image)
      .then((img) => {
        if (!isCancelled) {
          setProductImageElem(img);
        }
      })
      .catch((err) => console.error('Error loading template image:', err));

    // Reset placement to template default
    setPlacement((prev) => ({
      ...prev,
      ...selectedTemplate.defaultPlacement,
    }));
    setSelectedColor(selectedTemplate.defaultColor);

    return () => {
      isCancelled = true;
    };
  }, [selectedTemplate]);

  // Load logo whenever logo URL changes
  useEffect(() => {
    if (!currentLogoUrl) {
      setLogoImageElem(null);
      return;
    }
    let isCancelled = false;
    loadImage(currentLogoUrl)
      .then((img) => {
        if (!isCancelled) {
          setLogoImageElem(img);
        }
      })
      .catch((err) => console.error('Error loading logo image:', err));

    return () => {
      isCancelled = true;
    };
  }, [currentLogoUrl]);

  // Re-render canvas whenever dependencies change
  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !productImageElem) return;

    setIsRendering(true);
    const canvas = canvasRef.current;
    
    // Set high resolution internal dimensions
    if (canvas.width !== 1200 || canvas.height !== 1200) {
      canvas.width = 1200;
      canvas.height = 1200;
    }

    let processedLogo: HTMLCanvasElement | HTMLImageElement | null = logoImageElem;
    if (logoImageElem) {
      processedLogo = processLogoImage(
        logoImageElem,
        placement.colorEffect,
        placement.removeWhiteBg
      );
    }

    renderMockup({
      canvas,
      productImg: productImageElem,
      logoCanvasOrImg: processedLogo,
      placement,
      productColorHex: selectedColor,
    });

    setIsRendering(false);
  }, [productImageElem, logoImageElem, placement, selectedColor]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Handle direct file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setCurrentLogoUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle drag and drop upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setCurrentLogoUrl(dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle canvas direct click/drag repositioning
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

    setPlacement((prev) => ({
      ...prev,
      x: Math.min(95, Math.max(5, prev.x + deltaX)),
      y: Math.min(95, Math.max(5, prev.y + deltaY)),
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  // Export full mockup image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `mockup-${selectedTemplate.id}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Preset placement buttons
  const applyPreset = (preset: 'center' | 'pocket' | 'full' | 'wrap') => {
    if (preset === 'center') {
      setPlacement((prev) => ({
        ...prev,
        x: 50,
        y: selectedTemplate.category === 'mugs' ? 52 : 44,
        scale: selectedTemplate.category === 'mugs' ? 32 : 36,
        rotation: 0,
      }));
    } else if (preset === 'pocket') {
      setPlacement((prev) => ({
        ...prev,
        x: 62,
        y: 38,
        scale: 18,
        rotation: 0,
      }));
    } else if (preset === 'full') {
      setPlacement((prev) => ({
        ...prev,
        x: 50,
        y: 48,
        scale: 48,
        rotation: 0,
      }));
    } else if (preset === 'wrap') {
      setPlacement((prev) => ({
        ...prev,
        x: 48,
        y: 52,
        scale: 35,
        curve: 24,
      }));
    }
  };

  const filteredTemplates = activeCategory === 'all'
    ? MOCKUP_TEMPLATES
    : MOCKUP_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden bg-slate-950 text-slate-100">
      {/* LEFT COLUMN: Controls & Settings */}
      <div className="w-full lg:w-[420px] xl:w-[460px] flex-shrink-0 border-r border-slate-800 flex flex-col h-full overflow-y-auto bg-slate-900/60 p-4 sm:p-6 space-y-6">
        
        {/* 1. PRODUCT SELECTION */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              1. Choose Product Mockup
            </h2>
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              {(['all', 'mugs', 'apparel', 'accessories'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2 py-0.5 rounded capitalize transition-colors ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {filteredTemplates.map((template) => {
              const isSelected = selectedTemplate.id === template.id;
              return (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`group relative rounded-xl border p-2 text-left transition-all overflow-hidden ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 ring-2 ring-indigo-500/20'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-900 mb-2 relative">
                    <img
                      src={template.image}
                      alt={template.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 bg-indigo-600 text-white p-1 rounded-full shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-200 truncate">{template.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{template.category}</p>
                </button>
              );
            })}
          </div>

          {/* Product Color Swatches */}
          {selectedTemplate.supportedColors && selectedTemplate.supportedColors.length > 0 && (
            <div className="pt-2">
              <label className="text-xs font-medium text-slate-400 flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-indigo-400" />
                  Product Base Color
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  {selectedTemplate.supportedColors.find((c) => c.hex === selectedColor)?.name || 'Custom'}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.supportedColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => setSelectedColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative shadow-sm ${
                      selectedColor === color.hex
                        ? 'border-indigo-400 ring-2 ring-indigo-500/40 scale-110'
                        : 'border-slate-700/80 hover:scale-105'
                    }`}
                    title={color.name}
                  >
                    {selectedColor === color.hex && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className={`w-2 h-2 rounded-full ${color.hex === '#FFFFFF' || color.hex === '#F9F6EE' ? 'bg-slate-900' : 'bg-white'}`} />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 2. LOGO MANAGEMENT */}
        <section className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-400" />
              2. Upload or Pick Logo
            </h2>
            {currentLogoUrl && (
              <button
                onClick={() => setCurrentLogoUrl('')}
                className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear Logo
              </button>
            )}
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-indigo-500 hover:bg-slate-800/40 rounded-xl p-4 text-center cursor-pointer transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5 text-indigo-400" />
            </div>
            <p className="text-xs font-semibold text-slate-200">
              Click to upload your logo or drag & drop
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              PNG (transparent recommended), SVG, JPG, WebP
            </p>
          </div>

          {/* Sample Vector Logos */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              Or try instant sample brand logos:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_LOGOS.map((sample) => {
                const isActive = currentLogoUrl === sample.svgDataUri;
                return (
                  <button
                    key={sample.id}
                    onClick={() => setCurrentLogoUrl(sample.svgDataUri)}
                    className={`p-1.5 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-950/50 ring-1 ring-indigo-500'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="aspect-square w-full rounded bg-slate-900/90 p-1 flex items-center justify-center overflow-hidden mb-1">
                      <img
                        src={sample.svgDataUri}
                        alt={sample.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="text-[11px] font-medium text-slate-200 truncate">{sample.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Filters & Background Removal */}
          {currentLogoUrl && (
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Logo Processing</span>
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={placement.removeWhiteBg}
                    onChange={(e) =>
                      setPlacement((prev) => ({ ...prev, removeWhiteBg: e.target.checked }))
                    }
                    className="rounded border-slate-700 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remove white bg</span>
                </label>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5">Color Tint Effect:</span>
                <div className="grid grid-cols-5 gap-1 text-[11px]">
                  {(['original', 'white', 'black', 'gold', 'invert'] as const).map((effect) => (
                    <button
                      key={effect}
                      onClick={() => setPlacement((prev) => ({ ...prev, colorEffect: effect }))}
                      className={`py-1 px-1 rounded capitalize border transition-colors ${
                        placement.colorEffect === effect
                          ? 'border-indigo-500 bg-indigo-600 text-white font-medium'
                          : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3. PLACEMENT & FITTING */}
        <section className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              3. Fit & Placement
            </h2>
            <button
              onClick={() =>
                setPlacement((prev) => ({
                  ...prev,
                  ...selectedTemplate.defaultPlacement,
                }))
              }
              className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-4 gap-1.5 text-xs">
            <button
              onClick={() => applyPreset('center')}
              className="py-1.5 px-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 font-medium"
            >
              Center
            </button>
            <button
              onClick={() => applyPreset('pocket')}
              className="py-1.5 px-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 font-medium"
            >
              Pocket
            </button>
            <button
              onClick={() => applyPreset('full')}
              className="py-1.5 px-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 font-medium"
            >
              Full
            </button>
            <button
              onClick={() => applyPreset('wrap')}
              className="py-1.5 px-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-300 font-medium"
            >
              Cylinder
            </button>
          </div>

          {/* Sliders */}
          <div className="space-y-3.5">
            {/* Scale Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Scale / Size</span>
                <span className="text-slate-200 font-mono">{placement.scale}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={placement.scale}
                onChange={(e) =>
                  setPlacement((prev) => ({ ...prev, scale: Number(e.target.value) }))
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Position X */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Horizontal Position (X)</span>
                <span className="text-slate-200 font-mono">{placement.x}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="85"
                value={placement.x}
                onChange={(e) =>
                  setPlacement((prev) => ({ ...prev, x: Number(e.target.value) }))
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Position Y */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Vertical Position (Y)</span>
                <span className="text-slate-200 font-mono">{placement.y}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="85"
                value={placement.y}
                onChange={(e) =>
                  setPlacement((prev) => ({ ...prev, y: Number(e.target.value) }))
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Rotation */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Rotation Angle</span>
                <span className="text-slate-200 font-mono">{placement.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={placement.rotation}
                onChange={(e) =>
                  setPlacement((prev) => ({ ...prev, rotation: Number(e.target.value) }))
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* 3D Cylindrical Warp */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 flex items-center gap-1">
                  3D Cylindrical Curve
                  {selectedTemplate.category === 'mugs' && (
                    <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1 rounded">
                      Mug optimized
                    </span>
                  )}
                </span>
                <span className="text-slate-200 font-mono">{placement.curve}</span>
              </div>
              <input
                type="range"
                min="-40"
                max="40"
                value={placement.curve}
                onChange={(e) =>
                  setPlacement((prev) => ({ ...prev, curve: Number(e.target.value) }))
                }
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Opacity & Blend Mode */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Opacity</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={placement.opacity}
                    onChange={(e) =>
                      setPlacement((prev) => ({ ...prev, opacity: Number(e.target.value) }))
                    }
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-300 w-8">{placement.opacity}%</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Blend Mode</label>
                <select
                  value={placement.blendMode}
                  onChange={(e) =>
                    setPlacement((prev) => ({
                      ...prev,
                      blendMode: e.target.value as PlacementConfig['blendMode'],
                    }))
                  }
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="multiply">Multiply (Realistic Fabric)</option>
                  <option value="normal">Normal (Direct Print)</option>
                  <option value="overlay">Overlay (Textured)</option>
                  <option value="screen">Screen (Light on Dark)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* AI Quick Actions */}
        <section className="pt-4 border-t border-slate-800 space-y-2">
          <p className="text-xs font-semibold text-slate-400">AI Superpowers</p>
          <button
            onClick={() => {
              if (canvasRef.current) {
                const dataUrl = canvasRef.current.toDataURL('image/png', 0.95);
                onSendToAIEditor(dataUrl);
              }
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-violet-600/30 via-indigo-600/30 to-purple-600/30 border border-violet-500/40 hover:border-violet-400 text-violet-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-violet-400" />
            <span>Edit this Mockup with AI (Flash Preview)</span>
          </button>

          {currentLogoUrl && (
            <button
              onClick={() => onSendToProGen(currentLogoUrl)}
              className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-amber-500/30 hover:border-amber-400 text-amber-200 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Generate Pro 4K Commercial Shoot (Pro Preview)</span>
            </button>
          )}
        </section>

      </div>

      {/* RIGHT COLUMN: Canvas Workspace & Interactive Preview */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
        {/* Top bar controls */}
        <div className="h-14 px-6 border-b border-slate-800/80 bg-slate-900/40 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Interactive Canvas
            </span>
            <span className="text-xs text-slate-600">|</span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-[200px] sm:max-w-none">
              {selectedTemplate.name}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-1 text-slate-400">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
                className="p-1 hover:text-slate-200 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.1))}
                className="p-1 hover:text-slate-200 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="text-[10px] font-medium px-1.5 py-0.5 ml-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
              >
                Reset
              </button>
            </div>

            {/* Export Button */}
            <button
              onClick={handleDownload}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-md shadow-emerald-950/40 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res Mockup</span>
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] relative"
        >
          {/* Subtle drag hint */}
          <div className="absolute top-4 left-6 z-10 pointer-events-none bg-slate-900/80 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[11px] text-slate-400 shadow-lg">
            <Move className="w-3 h-3 text-indigo-400" />
            <span>Drag directly on canvas to reposition logo</span>
          </div>

          {/* Interactive Canvas */}
          <div
            style={{
              transform: `scale(${zoomLevel})`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
            className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 flex items-center justify-center max-w-[85vw] max-h-[75vh] aspect-square"
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              className="w-full h-full object-contain cursor-grab active:cursor-grabbing select-none"
            />
          </div>
        </div>

        {/* Bottom Status bar */}
        <div className="h-10 px-6 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span>
              Target Area: <strong className="text-slate-300">{selectedTemplate.printAreaLabel}</strong>
            </span>
            <span>
              Blend: <strong className="text-slate-300 capitalize">{placement.blendMode}</strong>
            </span>
            {placement.curve !== 0 && (
              <span>
                3D Warp: <strong className="text-indigo-300">{placement.curve}%</strong>
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 hidden sm:block">
            Supports transparent PNG, SVG, JPG • 1200×1200 Native Render
          </div>
        </div>
      </div>
    </div>
  );
};
