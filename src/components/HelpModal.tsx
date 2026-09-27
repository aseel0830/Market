import React from 'react';
import { X, Coffee, Shirt, Wand2, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
            </div>
            <h2 className="text-base font-bold text-slate-100">MockupCraft Studio Guide</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs text-slate-300 max-h-[70vh] overflow-y-auto pr-1">
          {/* Section 1 */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Shirt className="w-4 h-4 text-indigo-400" />
              <span>1. Placing Logos on Products</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Upload any PNG, SVG, or JPG logo. You can also pick from sample vector brands or toggle <strong>"Remove white bg"</strong> to isolate graphics. Click and drag directly on the canvas to reposition.
            </p>
          </div>

          {/* Section 2 */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Coffee className="w-4 h-4 text-amber-400" />
              <span>2. 3D Cylindrical Warp for Mugs</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              For cylindrical objects like mugs and tumblers, the app automatically applies a 3D cylindrical projection algorithm with realistic shadow falloff. Adjust the <strong>"3D Cylindrical Curve"</strong> slider to customize the wrap depth!
            </p>
          </div>

          {/* Section 3 */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Wand2 className="w-4 h-4 text-violet-400" />
              <span>3. AI Create & Edit (gemini-3.1-flash-image-preview)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Use natural language text prompts to edit your mockup (e.g. <em>"Place this mug on a sunlit marble cafe counter with morning steam"</em>) or generate new logos from scratch.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-slate-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>4. Pro HD Commercial Shoots (gemini-3-pro-image-preview)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Switch to <strong>Pro HD Generator</strong> and select your resolution: <strong>1K</strong> (Fast HD), <strong>2K</strong> (Print Grade), or <strong>4K</strong> (Commercial Cinema Master) to generate museum-grade photoshoots.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
          >
            Got it, let's create!
          </button>
        </div>
      </div>
    </div>
  );
};
