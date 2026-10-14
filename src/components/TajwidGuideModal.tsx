import React, { useState } from 'react';
import { OXFORD_TAJWID_RULES } from '../data/tajwidRules';
import { TajwidRuleId } from '../types/quran';
import { X, Sparkles, Volume2, Check } from 'lucide-react';

interface TajwidGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRuleFilter?: TajwidRuleId | null;
  onSelectRuleFilter?: (ruleId: TajwidRuleId | null) => void;
}

export const TajwidGuideModal: React.FC<TajwidGuideModalProps> = ({
  isOpen,
  onClose,
  activeRuleFilter,
  onSelectRuleFilter,
}) => {
  const [selectedRuleId, setSelectedRuleId] = useState<TajwidRuleId>(activeRuleFilter || 'ghunnah');

  if (!isOpen) return null;

  const currentRule = OXFORD_TAJWID_RULES[selectedRuleId];

  const playBeats = (beatsCount: number) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      for (let i = 0; i < beatsCount; i++) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.frequency.setValueAtTime(520, audioCtx.currentTime + i * 0.45);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + i * 0.45);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + i * 0.45 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.45);
        osc.stop(audioCtx.currentTime + i * 0.45 + 0.35);
      }
    } catch {
      // Audio fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl liquid-glass-dark border border-white/15 shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold font-oxford tracking-wide text-white">
                Sistem 7 Tajwid Oxford Digital
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Panduan interaktif pelafalan, ketukan harakat, dan hukum bacaan standar qira'at
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content with 2-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Rule Selector List */}
          <div className="md:col-span-5 p-4 border-r border-white/10 overflow-y-auto space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-2 py-1">
              7 Kategori Tajwid
            </div>
            {Object.values(OXFORD_TAJWID_RULES).map((rule) => {
              const isSelected = selectedRuleId === rule.id;
              return (
                <button
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between border cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 border-white/30 shadow-md translate-x-1'
                      : 'bg-white/5 hover:bg-white/10 border-transparent text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: rule.colorHex }}
                    />
                    <div className="truncate">
                      <div className="text-sm font-medium text-white truncate">
                        {rule.nameId.split('(')[0]}
                      </div>
                      <div className="text-xs text-slate-400 font-sans truncate">
                        {rule.nameEn}
                      </div>
                    </div>
                  </div>
                  <span className="font-arabic text-base shrink-0 mr-1" dir="rtl">
                    {rule.nameAr.split(' ')[0]}
                  </span>
                </button>
              );
            })}

            {onSelectRuleFilter && (
              <div className="pt-3 border-t border-white/10 mt-3 px-1">
                <button
                  onClick={() => {
                    const next = activeRuleFilter === selectedRuleId ? null : selectedRuleId;
                    onSelectRuleFilter(next);
                  }}
                  className="w-full py-2 px-3 text-xs rounded-lg font-medium flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/30 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>
                    {activeRuleFilter === selectedRuleId
                      ? 'Hapus Filter Tajwid'
                      : `Hanya Sorot ${currentRule.nameId.split('(')[0]}`}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Detailed Rule Masterclass */}
          <div className="md:col-span-7 p-6 overflow-y-auto space-y-5 bg-black/20">
            {/* Header of Active Rule */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentRule.colorHex }}
                  />
                  <span className="text-xs uppercase tracking-widest font-sans text-slate-400">
                    Kaidah #{Object.keys(OXFORD_TAJWID_RULES).indexOf(currentRule.id) + 1}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">
                  {currentRule.nameId}
                </h3>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  {currentRule.nameEn}
                </p>
              </div>

              <div className="text-right">
                <div className="font-arabic text-2xl text-amber-200" dir="rtl">
                  {currentRule.nameAr}
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10 inline-block mt-1">
                  {currentRule.durationBeats}
                </span>
              </div>
            </div>

            {/* Explanation card */}
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Definisi & Kaidah
                </h4>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {currentRule.summaryId}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Teknik Pelafalan (Makhraj)
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">
                  {currentRule.rulesExplanationId}
                </p>
              </div>
            </div>

            {/* Letters involved */}
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Huruf-Huruf Terkait
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentRule.letters.map((char, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 font-arabic text-lg text-amber-200 shadow-2xs"
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample & Audio Beat simulator */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-white/10 to-transparent border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Contoh Lafaz:</span>
                <span
                  className="font-arabic text-2xl block"
                  style={{ color: currentRule.colorHex }}
                  dir="rtl"
                >
                  {currentRule.sampleAr}
                </span>
                <span className="text-xs text-slate-400 font-sans">
                  {currentRule.sampleEn}
                </span>
              </div>

              <button
                onClick={() => playBeats(currentRule.id === 'mad' ? 4 : 2)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>Simulasi Ketukan</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-slate-400">
          <span>Standar Studi Oxford World's Classics & Rujukan Tajwid Ilmiah</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
