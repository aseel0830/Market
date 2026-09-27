import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Download,
  RefreshCw,
  AlertCircle,
  Check,
  Maximize2,
  Sliders,
  Camera,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import { generateProImage, GeminiImageResponse } from '../services/geminiService';

interface ProHDGeneratorProps {
  currentLogoUrl: string | null;
  onApplyAsLogo: (imageUrl: string) => void;
  onSwitchToStudio: () => void;
}

export const ProHDGenerator: React.FC<ProHDGeneratorProps> = ({
  currentLogoUrl,
  onApplyAsLogo,
  onSwitchToStudio,
}) => {
  // Model specification: gemini-3-pro-image-preview
  // Affordance for image size: 1K, 2K, 4K
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '3:4' | '9:16'>('1:1');
  const [prompt, setPrompt] = useState<string>('');
  const [attachLogo, setAttachLogo] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeminiImageResponse | null>(null);
  const [history, setHistory] = useState<Array<{ url: string; size: string }>>([]);

  // Curated Pro Studio Commercial Mockup Prompts
  const proMockupPresets = [
    {
      title: 'Studio Commercial Ceramic Mug',
      prompt:
        'Award-winning commercial product photography of a luxury ceramic coffee mug centered on a carved limestone pedestal, soft cinematic rim lighting, 8k crisp ceramic glaze reflections, minimalist aesthetic',
    },
    {
      title: 'Minimalist Cotton Tee Flat Lay',
      prompt:
        'High-end editorial fashion photography of a clean white organic combed cotton t-shirt flat lay on a textured beige plaster background, natural angled window shadows, pristine fabric weave details',
    },
    {
      title: 'Scandinavian Lifestyle Coffee Scene',
      prompt:
        'A warm ceramic mug placed on a rustic solid oak coffee table next to an open linen notebook and steaming espresso pot, soft morning golden hour rays streaming through sheer curtains',
    },
    {
      title: 'Urban Streetwear Heavyweight Hoodie',
      prompt:
        'Modern streetwear product shot of a premium heavyweight boxy hoodie draped cleanly on a polished concrete block in an architectural brutalist studio with soft directional spotlighting',
    },
    {
      title: 'Organic Canvas Tote Bag Shoot',
      prompt:
        'High-resolution commercial flat lay of a heavy natural cotton canvas tote bag surrounded by minimalist botanicals, warm eucalyptus branches, and soft neutral studio shadows',
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt or select a curated studio scene.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await generateProImage({
        prompt: prompt.trim(),
        imageSize,
        aspectRatio,
        referenceImage: attachLogo && currentLogoUrl ? currentLogoUrl : undefined,
      });

      setResult(response);
      if (response.imageUrl) {
        setHistory((prev) => [{ url: response.imageUrl!, size: imageSize }, ...prev]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate pro image with gemini-3-pro-image-preview.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (imageUrl: string, size: string) => {
    const link = document.createElement('a');
    link.download = `mockup-pro-${size}-${Date.now()}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT: Pro Settings & Prompt Controls */}
      <div className="w-full lg:w-[480px] flex-shrink-0 border-r border-slate-800 flex flex-col h-full overflow-y-auto bg-slate-900/60 p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100">Pro HD Generator</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/70 border border-amber-800/40 text-amber-300">
                model: gemini-3-pro-image-preview
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Generate ultra-high-definition, studio-grade product mockups with configurable master resolutions.
          </p>
        </div>

        {/* REQUIRED AFFORDANCE: IMAGE SIZE (1K, 2K, 4K) */}
        <div className="space-y-2.5 bg-slate-950 p-3.5 rounded-xl border border-amber-500/30 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              Image Resolution Size
            </label>
            <span className="text-[11px] font-mono text-slate-400">
              {imageSize === '1K' ? '1024×1024 px' : imageSize === '2K' ? '2048×2048 px' : '4096×4096 px'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['1K', '2K', '4K'] as const).map((size) => {
              const isSelected = imageSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-950/60 ring-2 ring-amber-500/30'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-sm font-extrabold text-slate-100 font-mono">{size}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {size === '1K' ? 'Standard HD' : size === '2K' ? 'Ultra HD' : '4K Cinema'}
                  </p>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400">
            Select <strong>1K</strong> for rapid generation, <strong>2K</strong> for sharp print resolution, or <strong>4K</strong> for maximum commercial fidelity.
          </p>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
          <div className="grid grid-cols-5 gap-1.5 text-xs">
            {(['1:1', '16:9', '4:3', '3:4', '9:16'] as const).map((ratio) => (
              <button
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`py-1.5 rounded-lg border font-mono transition-colors ${
                  aspectRatio === ratio
                    ? 'border-amber-500 bg-amber-950/60 text-amber-200 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Attach Active Logo as Reference */}
        {currentLogoUrl && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 p-0.5 overflow-hidden flex-shrink-0">
                <img src={currentLogoUrl} alt="Logo" referrerPolicy="no-referrer" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-200">Include Active Logo</p>
                <p className="text-[10px] text-slate-400">Model incorporates branding into scene</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={attachLogo}
              onChange={(e) => setAttachLogo(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400"
            />
          </div>
        )}

        {/* Prompt Input & Curated Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Commercial Scene Prompt</span>
            <span className="text-[11px] text-slate-500">Photorealistic</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder="Commercial studio photoshoot of a ceramic coffee mug on a sculptured marble podium..."
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-amber-500 placeholder-slate-500"
          />

          {/* Curated Presets */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] text-slate-400 block font-medium">Curated Studio Scenes:</span>
            <div className="flex flex-col gap-1.5">
              {proMockupPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(preset.prompt)}
                  className="text-left text-xs bg-slate-950/70 hover:bg-slate-800/80 p-2.5 rounded-xl border border-slate-800/80 transition-colors"
                >
                  <div className="font-semibold text-slate-300 text-[11px]">{preset.title}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{preset.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
            isLoading
              ? 'bg-amber-800/40 text-amber-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-950/40 cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
              <span>Generating Pro {imageSize} with gemini-3-pro-image-preview...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate {imageSize} High-Quality Mockup</span>
            </>
          )}
        </button>
      </div>

      {/* RIGHT: Viewport & Inspection */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200">High-Fidelity Render Output</h2>
            <p className="text-xs text-slate-400">
              {result ? `${result.imageSize || imageSize} Resolution • gemini-3-pro-image-preview` : 'Ready for generation'}
            </p>
          </div>

          {result?.imageUrl && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onApplyAsLogo(result.imageUrl!)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Use as Logo</span>
              </button>
              <button
                onClick={() => handleDownload(result.imageUrl!, result.imageSize || imageSize)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Master ({result.imageSize || imageSize})</span>
              </button>
            </div>
          )}
        </div>

        {/* Viewport Canvas */}
        <div className="flex-1 flex items-center justify-center border border-slate-800/80 rounded-2xl bg-slate-900/40 p-4 relative overflow-hidden min-h-[420px]">
          {isLoading ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-6 h-6 text-amber-400 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Rendering {imageSize} Studio Mockup with Gemini 3 Pro...
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Generating rich volumetric lighting, realistic materials, and camera depth-of-field.
              </p>
            </div>
          ) : result?.imageUrl ? (
            <div className="max-w-2xl max-h-[70vh] flex flex-col items-center">
              <div className="relative group rounded-xl overflow-hidden shadow-2xl border border-slate-800">
                <img
                  src={result.imageUrl}
                  alt="Pro HD Generated"
                  referrerPolicy="no-referrer"
                  className="max-h-[62vh] max-w-full object-contain"
                />
                <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-mono text-amber-300 font-bold">
                  {result.imageSize || imageSize} ULTRA HD
                </div>
              </div>
              {result.text && (
                <p className="text-xs text-slate-400 mt-3 text-center italic max-w-md">
                  "{result.text}"
                </p>
              )}
            </div>
          ) : (
            <div className="text-center space-y-2 p-8 text-slate-500">
              <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto">
                <Camera className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-300">No Pro HD image generated yet</p>
              <p className="text-xs text-slate-400 max-w-xs">
                Select your desired resolution (1K, 2K, or 4K) and click generate to render commercial photoshoots.
              </p>
            </div>
          )}
        </div>

        {/* Gallery */}
        {history.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Pro HD Gallery ({history.length})
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {history.map((item, i) => (
                <div
                  key={i}
                  className="w-24 h-24 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0 cursor-pointer hover:border-amber-500 transition-all relative group"
                  onClick={() =>
                    setResult({
                      success: true,
                      imageUrl: item.url,
                      model: 'gemini-3-pro-image-preview',
                      imageSize: item.size,
                    })
                  }
                >
                  <img src={item.url} alt={`History ${i}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 bg-black/80 px-1 text-[9px] font-mono text-amber-300 rounded">
                    {item.size}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
