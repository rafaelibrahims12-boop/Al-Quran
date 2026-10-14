import React, { useState, useMemo } from 'react';
import { AyahData, ReaderSettings, TajwidRuleId } from '../types/quran';
import { OXFORD_TAJWID_RULES } from '../data/tajwidRules';
import { TajwidTooltip } from './TajwidTooltip';
import { BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';

interface MushafModeViewProps {
  ayahs: AyahData[];
  currentAyahNumber: number;
  settings: ReaderSettings;
  activeTajwidFilter?: TajwidRuleId | null;
  onPlayAyah: (ayahNumber: number) => void;
  onOpenFullTajwidGuide: () => void;
  onJumpToPage?: (pageNumber: number) => void;
}

export const MushafModeView: React.FC<MushafModeViewProps> = ({
  ayahs,
  currentAyahNumber,
  settings,
  activeTajwidFilter,
  onPlayAyah,
  onOpenFullTajwidGuide,
  onJumpToPage,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<{
    ruleId: TajwidRuleId;
    tokenText: string;
    ayahNumber: number;
    tokenIndex: number;
  } | null>(null);

  const toArabicNumeral = (num: number): string => {
    return num
      .toString()
      .replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d, 10)]);
  };

  // Group ayahs by canonical Quran Page (1 - 604)
  const pagesGrouped = useMemo(() => {
    const map = new Map<number, AyahData[]>();
    for (const a of ayahs) {
      const pageNum = a.page || 1;
      if (!map.has(pageNum)) {
        map.set(pageNum, []);
      }
      map.get(pageNum)!.push(a);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [ayahs]);

  return (
    <div className="space-y-8">
      {pagesGrouped.map(([pageNumber, pageAyahs]) => {
        const pageJuz = pageAyahs[0]?.juz || 1;

        return (
          <div
            key={pageNumber}
            id={`quran-page-${pageNumber}`}
            className={`rounded-3xl p-6 sm:p-10 border transition-all duration-300 relative overflow-hidden ${
              settings.isDarkMode
                ? 'liquid-glass-dark border-white/10 shadow-2xl'
                : 'liquid-glass-light border-slate-200 shadow-xl'
            }`}
          >
            {/* Manuscript Gold Leaf Inner Frame */}
            <div className="absolute inset-3 border border-amber-500/20 rounded-2xl pointer-events-none" />
            <div className="absolute inset-4 border border-amber-500/10 rounded-xl pointer-events-none" />

            {/* Canonical Mushaf Page Header */}
            <div className="relative z-10 flex items-center justify-between pb-4 mb-6 border-b border-amber-500/20 text-xs text-slate-400 font-sans">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-amber-500 dark:text-amber-400">
                  Juz {pageJuz}
                </span>
                <span aria-hidden="true">·</span>
                <span>Halaman {pageNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                {onJumpToPage && pageNumber > 1 && (
                  <button
                    onClick={() => onJumpToPage(pageNumber - 1)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                    title={`Ke Halaman ${pageNumber - 1}`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 dark:text-amber-300 font-medium text-[11px] border border-amber-500/20">
                  Mushaf Madinah
                </span>
                {onJumpToPage && pageNumber < 604 && (
                  <button
                    onClick={() => onJumpToPage(pageNumber + 1)}
                    className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                    title={`Ke Halaman ${pageNumber + 1}`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Arabic Quran Calligraphy for this Page */}
            <div
              className="quran-arabic-text leading-[2.6] sm:leading-[3] text-justify select-text relative z-10 px-1 sm:px-4"
              style={{ fontSize: `${settings.arabicFontSize + 2}px` }}
              dir="rtl"
            >
              {pageAyahs.map((ayah) => {
                const isCurrentActive = ayah.numberInSurah === currentAyahNumber;

                return (
                  <span
                    key={ayah.numberInSurah}
                    id={`ayah-${ayah.numberInSurah}`}
                    className={`inline transition-colors rounded-sm px-1 ${
                      isCurrentActive ? 'bg-amber-500/25 text-amber-200' : ''
                    }`}
                  >
                    {ayah.tokens && settings.showTajwidColors ? (
                      ayah.tokens.map((token, tIdx) => {
                        const rule = token.ruleId ? OXFORD_TAJWID_RULES[token.ruleId] : null;
                        const isFiltered = activeTajwidFilter && token.ruleId !== activeTajwidFilter;

                        if (rule) {
                          return (
                            <span key={tIdx} className="relative inline">
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveTooltip({
                                    ruleId: token.ruleId!,
                                    tokenText: token.text,
                                    ayahNumber: ayah.numberInSurah,
                                    tokenIndex: tIdx,
                                  });
                                }}
                                className={`tajwid-token transition-all ${
                                  isFiltered ? 'opacity-35' : 'hover:scale-105 hover:bg-white/10'
                                }`}
                                style={{
                                  color: isFiltered ? 'inherit' : rule.colorHex,
                                }}
                              >
                                {token.text}
                              </span>

                              {activeTooltip &&
                                activeTooltip.ayahNumber === ayah.numberInSurah &&
                                activeTooltip.tokenIndex === tIdx && (
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

                        return <span key={tIdx}>{token.text}</span>;
                      })
                    ) : (
                      <span>{ayah.textAr}</span>
                    )}

                    {/* End of Ayah Ornamental Floral Marker */}
                    <button
                      onClick={() => onPlayAyah(ayah.numberInSurah)}
                      className="inline-flex items-center justify-center font-arabic mx-2 text-amber-500 hover:text-amber-400 select-none text-[0.85em] cursor-pointer hover:scale-110 transition-transform"
                      title={`Putar Ayat ${ayah.numberInSurah}`}
                    >
                      ۝{toArabicNumeral(ayah.numberInSurah)}
                    </button>
                  </span>
                );
              })}
            </div>

            {/* Canonical Mushaf Page Footer */}
            <div className="relative z-10 pt-6 mt-6 border-t border-amber-500/20 flex items-center justify-center text-xs text-slate-400 font-sans">
              <span className="font-serif italic tracking-widest text-slate-500 dark:text-slate-400">
                — Halaman {pageNumber} / 604 —
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
