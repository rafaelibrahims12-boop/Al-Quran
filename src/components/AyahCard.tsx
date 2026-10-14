import React, { useState } from 'react';
import { AyahData, ReaderSettings, TajwidRuleId } from '../types/quran';
import { OXFORD_TAJWID_RULES } from '../data/tajwidRules';
import { TajwidTooltip } from './TajwidTooltip';
import { Play, Pause, Bookmark, Check, Copy, Share2 } from 'lucide-react';

interface AyahCardProps {
  ayah: AyahData;
  surahNumber: number;
  surahName: string;
  settings: ReaderSettings;
  isPlaying: boolean;
  isActiveAyah: boolean;
  isBookmarked: boolean;
  activeTajwidFilter?: TajwidRuleId | null;
  onPlayAyah: (ayahNumber: number) => void;
  onToggleBookmark: (ayah: AyahData) => void;
  onOpenFullTajwidGuide: () => void;
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  surahNumber,
  surahName,
  settings,
  isPlaying,
  isActiveAyah,
  isBookmarked,
  activeTajwidFilter,
  onPlayAyah,
  onToggleBookmark,
  onOpenFullTajwidGuide,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    ruleId: TajwidRuleId;
    tokenText: string;
    index: number;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${ayah.textAr}\n\n[Oxford Translation]: ${ayah.textEnOxford}\n[Kemenag RI]: ${ayah.textIdKemenag}\n(QS. ${surahName} ${surahNumber}:${ayah.numberInSurah})`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toArabicNumeral = (num: number): string => {
    return num
      .toString()
      .replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
  };

  return (
    <article
      id={`ayah-${ayah.numberInSurah}`}
      className={`relative rounded-2xl transition-all duration-300 p-5 sm:p-7 border ${
        isActiveAyah
          ? 'liquid-glass-dark border-amber-500/60 shadow-xl ring-2 ring-amber-500/20'
          : settings.isDarkMode
          ? 'liquid-glass-dark border-white/10 hover:border-white/20'
          : 'liquid-glass-light border-slate-200/80 hover:border-amber-500/30'
      }`}
    >
      {/* Top Action Ribbon */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200/20 dark:border-white/10 text-xs">
        {/* Ayah Reference Badge */}
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-amber-500/15 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-center text-xs border border-amber-500/30">
            {ayah.numberInSurah}
          </span>
          <div className="text-slate-500 dark:text-slate-400 font-sans">
            <span>Ayat {ayah.numberInSurah}</span>
            {ayah.page && (
              <>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium">Hal. {ayah.page}</span>
              </>
            )}
            {ayah.juz && (
              <>
                <span className="mx-1.5" aria-hidden="true">·</span>
                <span>Juz {ayah.juz}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Play/Pause Button */}
          <button
            onClick={() => onPlayAyah(ayah.numberInSurah)}
            className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 font-medium ${
              isActiveAyah && isPlaying
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={isActiveAyah && isPlaying ? 'Jeda Audio' : 'Putar Ayat Ini'}
            aria-label="Play verse audio"
          >
            {isActiveAyah && isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(ayah)}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-amber-500 bg-amber-500/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={isBookmarked ? 'Hapus Simpanan' : 'Simpan Ayat'}
            aria-label="Bookmark verse"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            title="Salin Teks & Terjemahan"
            aria-label="Copy verse"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Arabic Text Area */}
      <div className="relative py-2 my-2">
        <div
          className="quran-arabic-text select-text"
          style={{ fontSize: `${settings.arabicFontSize}px` }}
          dir="rtl"
        >
          {ayah.tokens && settings.showTajwidColors ? (
            ayah.tokens.map((token, idx) => {
              const rule = token.ruleId ? OXFORD_TAJWID_RULES[token.ruleId] : null;
              const isFiltered = activeTajwidFilter && token.ruleId !== activeTajwidFilter;

              if (rule) {
                return (
                  <span
                    key={idx}
                    className="relative inline"
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTooltip({
                          ruleId: token.ruleId!,
                          tokenText: token.text,
                          index: idx,
                        });
                      }}
                      className={`tajwid-token transition-all duration-200 ${
                        isFiltered ? 'opacity-35' : 'hover:scale-105 hover:bg-white/10'
                      }`}
                      style={{
                        color: isFiltered ? 'inherit' : rule.colorHex,
                        textDecorationColor: rule.colorHex,
                      }}
                      title={`${rule.nameId} (${rule.durationBeats}) - Klik untuk info`}
                    >
                      {token.text}
                    </span>

                    {activeTooltip && activeTooltip.index === idx && (
                      <TajwidTooltip
                        ruleId={activeTooltip.ruleId}
                        tokenText={activeTooltip.tokenText}
                        onClose={() => setActiveTooltip(null)}
                        onOpenFullGuide={onOpenFullTajwidGuide}
                      />
                    )}
                  </span>
                );
              }

              return <span key={idx}>{token.text}</span>;
            })
          ) : (
            <span>{ayah.textAr}</span>
          )}

          {/* Arabic Ayah End Floral Numeral */}
          <span className="inline-flex items-center justify-center font-arabic mx-2 text-amber-500 dark:text-amber-400 select-none text-[0.85em]">
            ۝{toArabicNumeral(ayah.numberInSurah)}
          </span>
        </div>
      </div>

      {/* Word by word breakdown (if enabled) */}
      {settings.showWordByWord && ayah.words && ayah.words.length > 0 && (
        <div className="mt-4 pt-3 pb-2 border-t border-slate-200/20 dark:border-white/10 flex flex-wrap gap-2 justify-end" dir="rtl">
          {ayah.words.map((word, wIdx) => (
            <div
              key={wIdx}
              className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-slate-200/40 dark:border-white/10 text-center text-left"
              dir="ltr"
            >
              <div className="font-arabic text-lg text-slate-800 dark:text-slate-100" dir="rtl">
                {word.ar}
              </div>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                {word.tr}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300">
                {word.id}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transliteration */}
      {settings.showTransliteration && ayah.transliteration && (
        <div className="mt-3 pt-3 border-t border-slate-200/20 dark:border-white/10 text-xs sm:text-sm text-amber-600/90 dark:text-amber-300/90 font-serif italic leading-relaxed">
          {ayah.transliteration}
        </div>
      )}

      {/* Translations Area */}
      <div className="mt-4 space-y-3 pt-1">
        {/* Oxford English Translation (M.A.S. Abdel Haleem) */}
        {settings.showEnglishTranslation && (
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider font-sans font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <span>Oxford Translation (Abdel Haleem)</span>
            </div>
            <p
              className="font-oxford text-slate-800 dark:text-slate-200 leading-relaxed"
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              "{ayah.textEnOxford}"
            </p>
          </div>
        )}

        {/* Indonesian Kemenag Translation */}
        {settings.showIndonesianTranslation && (
          <div className="space-y-1">
            <div className="text-[11px] uppercase tracking-wider font-sans font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <span>Terjemahan Kemenag RI</span>
            </div>
            <p
              className="font-sans text-slate-700 dark:text-slate-300 leading-relaxed"
              style={{ fontSize: `${settings.translationFontSize - 1}px` }}
            >
              "{ayah.textIdKemenag}"
            </p>
          </div>
        )}
      </div>
    </article>
  );
};
