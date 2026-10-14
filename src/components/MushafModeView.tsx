import React, { useState } from 'react';
import { AyahData, ReaderSettings, TajwidRuleId } from '../types/quran';
import { OXFORD_TAJWID_RULES } from '../data/tajwidRules';
import { TajwidTooltip } from './TajwidTooltip';

interface MushafModeViewProps {
  ayahs: AyahData[];
  currentAyahNumber: number;
  settings: ReaderSettings;
  activeTajwidFilter?: TajwidRuleId | null;
  onPlayAyah: (ayahNumber: number) => void;
  onOpenFullTajwidGuide: () => void;
}

export const MushafModeView: React.FC<MushafModeViewProps> = ({
  ayahs,
  currentAyahNumber,
  settings,
  activeTajwidFilter,
  onPlayAyah,
  onOpenFullTajwidGuide,
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

  return (
    <div
      className={`rounded-2xl p-6 sm:p-10 border transition-all duration-300 relative ${
        settings.isDarkMode
          ? 'liquid-glass-dark border-white/10 shadow-2xl'
          : 'liquid-glass-light border-slate-200 shadow-xl'
      }`}
    >
      {/* Manuscript Decorative Inner Border */}
      <div className="absolute inset-3 border border-amber-500/20 rounded-xl pointer-events-none" />

      <div
        className="quran-arabic-text leading-[2.6] sm:leading-[3] text-justify select-text relative z-10"
        style={{ fontSize: `${settings.arabicFontSize + 2}px` }}
        dir="rtl"
      >
        {ayahs.map((ayah) => {
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

              {/* End of Ayah Ornamental Marker */}
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
    </div>
  );
};
