import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Image as ImageIcon,
  ArrowRight,
  RefreshCw,
  Download,
  Check,
  AlertCircle,
  Lightbulb,
  Layers,
  Sliders,
} from 'lucide-react';
import { createOrEditImage, GeminiImageResponse } from '../services/geminiService';

interface AIImageEditorProps {
  initialImage?: string | null;
  onApplyAsLogo: (imageUrl: string) => void;
  onSwitchToStudio: () => void;
}

export const AIImageEditor: React.FC<AIImageEditorProps> = ({
  initialImage,
  onApplyAsLogo,
  onSwitchToStudio,
}) => {
  const [mode, setMode] = useState<'edit' | 'create'>(initialImage ? 'edit' : 'edit');
  const [sourceImage, setSourceImage] = useState<string | null>(initialImage || null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '4:3' | '3:4' | '9:16'>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeminiImageResponse | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  // Curated prompts for editing mockups
  const editPromptPresets = [
    'Place this coffee mug on a sunlit marble cafe counter next to fresh croissants and warm bokeh lighting',
    'Add realistic aromatic coffee steam gently rising from the mug with morning sunlight rays',
    'Put this t-shirt on a modern fashion model outdoors in an urban minimalist architectural setting',
    'Make the background a warm Scandinavian living room with wooden furniture and potted plants',
    'Create an artistic lifestyle studio catalog shoot with dramatic soft shadows and neutral tones',
  ];

  // Curated prompts for creating new brand imagery/logos
  const createPromptPresets = [
    'A minimalist geometric vector logo of an origami wolf, sharp black lines on clean pure white background',
    'A luxury artisanal bakery emblem with vintage wheat stalks and elegant serif typography, vector badge',
    'A vibrant neon cyberpunk coffee shop logo with holographic steam and bold lettering',
    'A clean organic skincare logo featuring a single line-art botanical leaf inside a circle',
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a description or prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await createOrEditImage({
        prompt: prompt.trim(),
        image: mode === 'edit' && sourceImage ? sourceImage : undefined,
        aspectRatio,
      });

      setResult(response);
      if (response.imageUrl) {
        setHistory((prev) => [response.imageUrl!, ...prev]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process image. Please verify your prompt or API key.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSourceImage(dataUrl);
        setMode('edit');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.download = `gemini-flash-image-${Date.now()}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col lg:flex-row overflow-hidden">
      {/* LEFT: Controls & Input */}
      <div className="w-full lg:w-[480px] flex-shrink-0 border-r border-slate-800 flex flex-col h-full overflow-y-auto bg-slate-900/60 p-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-violet-400" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100">AI Image Studio</h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-950/70 border border-violet-800/40 text-violet-300">
                model: gemini-3.1-flash-image-preview
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Use natural language text prompts to create new brand assets or edit existing mockups and logos.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('edit')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'edit'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Edit Image / Mockup</span>
          </button>
          <button
            onClick={() => setMode('create')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'create'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create from Prompt</span>
          </button>
        </div>

        {/* Source Image (when in Edit mode) */}
        {mode === 'edit' && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Source Image to Edit</span>
              <label className="text-[11px] text-indigo-400 hover:text-indigo-300 cursor-pointer">
                Upload different image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </label>

            {sourceImage ? (
              <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-2 flex items-center gap-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                  <img
                    src={sourceImage}
                    alt="Source to edit"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-200 truncate">
                    Active Mockup / Base Image
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Gemini will modify this image based on your instructions.
                  </p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-slate-800 p-4 text-center">
                <p className="text-xs text-slate-400">No source image selected.</p>
                <label className="mt-2 inline-block px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 cursor-pointer">
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            )}
          </div>
        )}

        {/* Text Prompt Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>{mode === 'edit' ? 'Edit Instructions Prompt' : 'Creation Prompt'}</span>
            <span className="text-[11px] text-slate-500 font-normal">Natural language</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            placeholder={
              mode === 'edit'
                ? 'E.g., "Place this mug on a sunlit rustic wooden table with fresh roasted coffee beans and gentle steam rising"'
                : 'E.g., "A modern minimalist brand logo of a golden origami fox with clean geometric lines on white background"'
            }
            className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-violet-500 placeholder-slate-500"
          />

          {/* Prompt Presets */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Click idea to try:</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {(mode === 'edit' ? editPromptPresets : createPromptPresets).map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(preset)}
                  className="text-left text-[11px] text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-800/80 p-2 rounded-lg border border-slate-800/60 transition-colors line-clamp-2"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>
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
                    ? 'border-violet-500 bg-violet-950/60 text-violet-200 font-bold'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900'
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
            isLoading
              ? 'bg-violet-800/50 text-violet-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-violet-900/40 cursor-pointer'
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-violet-200" />
              <span>Generating with gemini-3.1-flash-image-preview...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              <span>{mode === 'edit' ? 'Run AI Edit' : 'Generate New Image'}</span>
            </>
          )}
        </button>
      </div>

      {/* RIGHT: Output Viewport & Gallery */}
      <div className="flex-1 flex flex-col h-full bg-slate-950 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-200">Generated Output</h2>
            <p className="text-xs text-slate-400">Real-time AI render preview</p>
          </div>
          {result?.imageUrl && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onApplyAsLogo(result.imageUrl!)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Use as Logo in Mockup Placer</span>
              </button>
              <button
                onClick={() => handleDownload(result.imageUrl!)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        {/* Display Canvas or Empty State */}
        <div className="flex-1 flex items-center justify-center border border-slate-800/80 rounded-2xl bg-slate-900/40 p-4 relative overflow-hidden min-h-[400px]">
          {isLoading ? (
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center mx-auto animate-pulse">
                <Wand2 className="w-6 h-6 text-violet-400 animate-spin" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Rendering image with Gemini 3.1 Flash...
              </p>
              <p className="text-xs text-slate-400 max-w-sm">
                Analyzing visual prompt instructions and synthesizing photorealistic pixels.
              </p>
            </div>
          ) : result?.imageUrl ? (
            <div className="max-w-2xl max-h-[70vh] flex flex-col items-center">
              <img
                src={result.imageUrl}
                alt="AI Generated"
                referrerPolicy="no-referrer"
                className="max-h-[60vh] max-w-full rounded-xl object-contain shadow-2xl border border-slate-800"
              />
              {result.text && (
                <p className="text-xs text-slate-400 mt-3 text-center italic max-w-md">
                  "{result.text}"
                </p>
              )}
            </div>
          ) : (
            <div className="text-center space-y-2 p-8 text-slate-500">
              <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center mx-auto">
                <ImageIcon className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-300">No image generated yet</p>
              <p className="text-xs text-slate-400 max-w-xs">
                Enter a prompt on the left to edit your mockup or generate new logo concepts.
              </p>
            </div>
          )}
        </div>

        {/* Recent Session History */}
        {history.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Session Creations
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {history.map((url, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-xl overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0 cursor-pointer hover:border-violet-500 transition-all relative group"
                  onClick={() => setResult({ success: true, imageUrl: url, model: 'gemini-3.1-flash-image-preview' })}
                >
                  <img src={url} alt={`History ${i}`} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
