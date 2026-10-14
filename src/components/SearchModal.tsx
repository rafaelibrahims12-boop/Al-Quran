import React, { useState, useMemo, useEffect } from 'react';
import { ALL_SURAHS } from '../data/surahList';
import { SurahSummary } from '../types/quran';
import { Search, X, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
  onSelectPage?: (pageNumber: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSurah,
  onSelectPage,
}) => {
  const [query, setQuery] = useState('');

  // Handle hotkey Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle handled by parent or opened
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter surahs and parse potential "surah:ayah" or "halaman" pattern
  const { results, parsedJump, parsedPage } = useMemo(() => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) {
      return { results: ALL_SURAHS.slice(0, 12), parsedJump: null, parsedPage: null };
    }

    // Check for "surah:ayah" or "surah ayah" (e.g. "2:255" or "18 10")
    const matchJump = cleanQuery.match(/^(\d{1,3})[:\s](\d{1,3})$/);
    let jumpTarget: { surah: number; ayah: number } | null = null;
    if (matchJump) {
      const sNum = parseInt(matchJump[1], 10);
      const aNum = parseInt(matchJump[2], 10);
      if (sNum >= 1 && sNum <= 114) {
        jumpTarget = { surah: sNum, ayah: aNum };
      }
    }

    // Check for page jump (e.g. "hal 50", "halaman 200", "p 100", "p.45")
    const matchPage = cleanQuery.match(/^(?:hal|halaman|page|p|hlm)[\.\s]*(\d{1,3})$/i);
    let jumpPage: number | null = null;
    if (matchPage) {
      const p = parseInt(matchPage[1], 10);
      if (p >= 1 && p <= 604) {
        jumpPage = p;
      }
    }

    const filtered = ALL_SURAHS.filter((s: SurahSummary) => {
      const numMatch = s.number.toString() === cleanQuery;
      const enMatch = s.englishName.toLowerCase().includes(cleanQuery);
      const arMatch = s.name.includes(cleanQuery);
      const idTransMatch = s.indonesianNameTranslation.toLowerCase().includes(cleanQuery);
      const enTransMatch = s.englishNameTranslation.toLowerCase().includes(cleanQuery);
      return numMatch || enMatch || arMatch || idTransMatch || enTransMatch;
    });

    return { results: filtered, parsedJump: jumpTarget, parsedPage: jumpPage };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl liquid-glass-dark border border-white/20 shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama surah, nomor, terjemahan, atau lompat cepat (misal: 2:255, Al-Kahf, Cahaya)..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-400 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline text-[10px] px-2 py-0.5 rounded bg-white/10 text-slate-400 border border-white/10">
            ESC
          </kbd>
        </div>

        {/* Quick Ayah Jump Notification if recognized */}
        {parsedJump && (
          <div className="px-4 py-2.5 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-200">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Lompat langsung ke Surah #{parsedJump.surah}, Ayat {parsedJump.ayah}
            </span>
            <button
              onClick={() => {
                onSelectSurah(parsedJump.surah, parsedJump.ayah);
                onClose();
              }}
              className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors cursor-pointer"
            >
              Buka Sekarang
            </button>
          </div>
        )}

        {/* Quick Page Jump Notification if recognized */}
        {parsedPage && (
          <div className="px-4 py-2.5 bg-emerald-500/15 border-b border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Lompat langsung ke Halaman #{parsedPage} (Mushaf Madinah)
            </span>
            <button
              onClick={() => {
                if (onSelectPage) {
                  onSelectPage(parsedPage);
                }
                onClose();
              }}
              className="px-3 py-1 rounded bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-colors cursor-pointer"
            >
              Buka Halaman
            </button>
          </div>
        )}

        {/* Popular Quick Suggestions */}
        {!query && (
          <div className="px-4 py-2 border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 shrink-0">Populer:</span>
            {['Al-Fatihah', 'Al-Baqarah (Kursi)', 'Yasin', 'Al-Mulk', 'Al-Kahf', 'Ar-Rahman', 'Al-Waqi\'ah'].map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term.split(' ')[0])}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 transition-colors whitespace-nowrap cursor-pointer shrink-0"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Tidak ada surah yang cocok dengan pencarian "{query}".
            </div>
          ) : (
            results.map((surah) => (
              <button
                key={surah.number}
                onClick={() => {
                  onSelectSurah(surah.number);
                  onClose();
                }}
                className="w-full p-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-amber-500/20 group-hover:text-amber-300 text-slate-300 flex items-center justify-center text-xs font-semibold shrink-0 transition-colors">
                    {surah.number}
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-semibold text-white group-hover:text-amber-200 transition-colors truncate">
                      {surah.englishName}
                    </div>
                    <div className="text-xs text-slate-400 font-sans truncate">
                      {surah.indonesianNameTranslation} · {surah.numberOfAyahs} Ayat · {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-arabic text-xl text-amber-200 group-hover:scale-105 transition-transform" dir="rtl">
                    {surah.name}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <span>Tip: Ketik <strong>18:10</strong> untuk lompat ke Surah 18 Ayat 10</span>
          <span>114 Surah Lengkap</span>
        </div>
      </div>
    </div>
  );
};
