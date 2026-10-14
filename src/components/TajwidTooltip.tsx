import React from 'react';
import { TajwidRule, TajwidRuleId } from '../types/quran';
import { OXFORD_TAJWID_RULES } from '../data/tajwidRules';
import { Volume2, X, Info } from 'lucide-react';

interface TajwidTooltipProps {
  ruleId: TajwidRuleId;
  tokenText: string;
  onClose: () => void;
  onOpenFullGuide: () => void;
}

export const TajwidTooltip: React.FC<TajwidTooltipProps> = ({
  ruleId,
  tokenText,
  onClose,
  onOpenFullGuide,
}) => {
  const rule: TajwidRule = OXFORD_TAJWID_RULES[ruleId];
  if (!rule) return null;

  const playSynthesizedTone = () => {
    // Generate soft instructional phonetic bell for duration
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext fallback
    }
  };

  return (
    <div
      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-80 p-4 rounded-xl liquid-glass-dark text-slate-100 shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-150 text-left select-text"
      role="dialog"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: rule.colorHex }}
          />
          <span className="font-arabic text-lg leading-none" dir="rtl">
            {rule.nameAr}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
          aria-label="Tutup"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title & Duration */}
      <div className="space-y-1 mb-2.5">
        <div className="font-medium text-sm text-amber-200">
          {rule.nameId}
        </div>
        <div className="text-xs text-slate-400 font-sans">
          {rule.nameEn} · <span className="text-amber-400 font-semibold">{rule.durationBeats}</span>
        </div>
      </div>

      {/* Selected Token */}
      <div className="p-2 rounded-lg bg-black/40 border border-white/5 mb-2.5 flex items-center justify-between">
        <span className="text-xs text-slate-400">Lafaz:</span>
        <span
          className="font-arabic text-xl px-2 py-0.5 rounded"
          style={{ color: rule.colorHex }}
          dir="rtl"
        >
          {tokenText}
        </span>
      </div>

      {/* How to pronounce */}
      <p className="text-xs text-slate-300 leading-relaxed mb-3">
        {rule.summaryId}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
        <button
          onClick={playSynthesizedTone}
          className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 transition-colors py-1 px-2 rounded bg-amber-500/10 hover:bg-amber-500/20"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Contoh Ketukan</span>
        </button>

        <button
          onClick={() => {
            onClose();
            onOpenFullGuide();
          }}
          className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Panduan Lengkap</span>
        </button>
      </div>
    </div>
  );
};
