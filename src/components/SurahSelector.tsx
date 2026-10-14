import React, { useState, useMemo } from 'react';
import { ALL_SURAHS } from '../data/surahList';
import { QURAN_JUZ_LIST, getSurahForPage, getJuzForPage } from '../data/quranPages';
import { Search, X, BookOpen, Layers, FileText, ArrowRight } from 'lucide-react';

interface SurahSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSurahNumber: number;
  onSelectSurah: (surahNumber: number, targetAyah?: number) => void;
  onSelectPage?: (pageNumber: number) => void;
  initialCategory?: 'surah' | 'halaman' | 'juz';
}

export const SurahSelectorModal: React.FC<SurahSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedSurahNumber,
  onSelectSurah,
  onSelectPage,
  initialCategory = 'surah',
}) => {
  const [mainCategory, setMainCategory] = useState<'surah' | 'halaman' | 'juz'>(initialCategory);
  const [filterQuery, setFilterQuery] = useState('');
  const [surahTab, setSurahTab] = useState<'all' | 'juz30' | 'popular' | 'meccan' | 'medinan'>('all');
  const [selectedJuzForPages, setSelectedJuzForPages] = useState<number>(1);
  const [directPageInput, setDirectPageInput] = useState<string>('');

  // Handle direct page jump form submit
  const handleDirectPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(directPageInput.trim(), 10);
    if (!isNaN(p) && p >= 1 && p <= 604) {
      if (onSelectPage) {
        onSelectPage(p);
      } else {
        const sNum = getSurahForPage(p);
        onSelectSurah(sNum);
      }
      onClose();
    }
  };

  // Filter surahs
  const filteredSurahs = useMemo(() => {
    let base = ALL_SURAHS;

    if (surahTab === 'juz30') {
      base = base.filter((s) => s.number >= 78);
    } else if (surahTab === 'popular') {
      const popNumbers = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];
      base = base.filter((s) => popNumbers.includes(s.number));
    } else if (surahTab === 'meccan') {
      base = base.filter((s) => s.revelationType === 'Meccan');
    } else if (surahTab === 'medinan') {
      base = base.filter((s) => s.revelationType === 'Medinan');
    }

    if (!filterQuery.trim()) return base;
    const q = filterQuery.toLowerCase().trim();
    return base.filter(
      (s) =>
        s.number.toString() === q ||
        s.englishName.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        s.indonesianNameTranslation.toLowerCase().includes(q)
    );
  }, [surahTab, filterQuery]);

  // Pages corresponding to selected Juz
  const activeJuzData = QURAN_JUZ_LIST.find((j) => j.juz === selectedJuzForPages) || QURAN_JUZ_LIST[0];
  const pagesInActiveJuz = useMemo(() => {
    const pages: number[] = [];
    for (let p = activeJuzData.startPage; p <= activeJuzData.endPage; p++) {
      pages.push(p);
    }
    return pages;
  }, [activeJuzData]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] rounded-2xl liquid-glass-dark border border-white/15 shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold font-oxford tracking-wide text-white">
              Navigasi Al-Qur'an (Surah, Halaman, & Juz)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Category Switcher (Surah | Halaman | Juz) */}
        <div className="px-6 py-3 border-b border-white/10 bg-black/40 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-xl text-xs">
            <button
              onClick={() => setMainCategory('surah')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                mainCategory === 'surah'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Surah (114)</span>
            </button>

            <button
              onClick={() => setMainCategory('halaman')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                mainCategory === 'halaman'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Halaman (1-604)</span>
            </button>

            <button
              onClick={() => setMainCategory('juz')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                mainCategory === 'juz'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>30 Juz</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 hidden sm:block">
            {mainCategory === 'surah' && '114 Surah Makkiyah & Madaniyah'}
            {mainCategory === 'halaman' && '604 Halaman Standar Mushaf Madinah'}
            {mainCategory === 'juz' && '30 Juz Lengkap'}
          </div>
        </div>

        {/* 1. SURAH VIEW */}
        {mainCategory === 'surah' && (
          <>
            <div className="p-4 border-b border-white/10 space-y-3 bg-black/20">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Saring nama surah atau nomor..."
                  className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Sub-tabs for Surahs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
                <button
                  onClick={() => setSurahTab('all')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    surahTab === 'all'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Semua (114)
                </button>
                <button
                  onClick={() => setSurahTab('popular')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    surahTab === 'popular'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Pilihan Populer
                </button>
                <button
                  onClick={() => setSurahTab('juz30')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    surahTab === 'juz30'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Juz 'Amma (78-114)
                </button>
                <button
                  onClick={() => setSurahTab('meccan')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    surahTab === 'meccan'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Makkiyah
                </button>
                <button
                  onClick={() => setSurahTab('medinan')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    surahTab === 'medinan'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  Madaniyah
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {filteredSurahs.map((surah) => {
                const isSelected = selectedSurahNumber === surah.number;
                return (
                  <button
                    key={surah.number}
                    onClick={() => {
                      onSelectSurah(surah.number);
                      onClose();
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500/60 shadow-md ring-1 ring-amber-500/30'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-white/10 text-slate-300 group-hover:bg-amber-500/20 group-hover:text-amber-300'
                        }`}
                      >
                        {surah.number}
                      </div>
                      <div className="truncate">
                        <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-200 transition-colors truncate">
                          {surah.englishName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans truncate">
                          {surah.indonesianNameTranslation} · {surah.numberOfAyahs} Ayat
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-arabic text-lg text-amber-200 block" dir="rtl">
                        {surah.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Juz {surah.juz}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* 2. HALAMAN (PAGES 1 - 604) VIEW */}
        {mainCategory === 'halaman' && (
          <div className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 space-y-4">
            {/* Direct Page Jump Input */}
            <form
              onSubmit={handleDirectPageSubmit}
              className="p-4 rounded-xl bg-gradient-to-r from-amber-500/15 via-white/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-3"
            >
              <div>
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                  Lompat Langsung ke Halaman
                </div>
                <div className="text-xs text-slate-300">
                  Masukkan nomor halaman antara 1 hingga 604
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  min="1"
                  max="604"
                  value={directPageInput}
                  onChange={(e) => setDirectPageInput(e.target.value)}
                  placeholder="Hal. (1-604)"
                  className="w-28 px-3 py-1.5 bg-black/40 border border-white/20 rounded-lg text-xs text-white text-center focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Buka Halaman
                </button>
              </div>
            </form>

            {/* Juz Selector for Pages */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Pilih Juz untuk Menampilkan Daftar Halaman:
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
                {QURAN_JUZ_LIST.map((j) => (
                  <button
                    key={j.juz}
                    onClick={() => setSelectedJuzForPages(j.juz)}
                    className={`px-3 py-1 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      selectedJuzForPages === j.juz
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    Juz {j.juz}
                  </button>
                ))}
              </div>
            </div>

            {/* Pages Grid in selected Juz */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                <span>
                  Halaman pada <strong>Juz {activeJuzData.juz}</strong> ({activeJuzData.nameLatin}):
                </span>
                <span>
                  Hal. {activeJuzData.startPage} s/d {activeJuzData.endPage}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
                {pagesInActiveJuz.map((pageNum) => {
                  const sNum = getSurahForPage(pageNum);
                  const surah = ALL_SURAHS.find((s) => s.number === sNum);

                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        if (onSelectPage) {
                          onSelectPage(pageNum);
                        } else {
                          onSelectSurah(sNum);
                        }
                        onClose();
                      }}
                      className="p-3 rounded-xl bg-white/5 hover:bg-amber-500/20 hover:border-amber-500/40 border border-white/10 text-left transition-all group cursor-pointer"
                    >
                      <div className="text-base font-bold text-amber-300 group-hover:text-amber-200">
                        Hal. {pageNum}
                      </div>
                      <div className="text-[11px] text-slate-300 truncate font-medium mt-0.5">
                        {surah?.englishName || `Surah ${sNum}`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Juz {getJuzForPage(pageNum)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 3. JUZ (1 - 30) VIEW */}
        {mainCategory === 'juz' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {QURAN_JUZ_LIST.map((j) => {
              const surah = ALL_SURAHS.find((s) => s.number === j.startSurah);

              return (
                <button
                  key={j.juz}
                  onClick={() => {
                    onSelectSurah(j.startSurah, j.startAyah);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center justify-center">
                        {j.juz}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        Juz {j.juz}
                      </span>
                    </div>
                    <div className="text-xs text-amber-300/90 font-medium">
                      {j.nameLatin}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Mulai: {surah?.englishName} [{j.startAyah}] · Hal. {j.startPage}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-arabic text-xl text-amber-200" dir="rtl">
                      {j.nameAr}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all ml-auto mt-2" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
