import React, { useState, useMemo } from 'react';
import { ALL_SURAHS } from '../data/surahList';
import { SurahSummary } from '../types/quran';
import { Search, X, Check, BookOpen } from 'lucide-react';

interface SurahSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSurahNumber: number;
  onSelectSurah: (surahNumber: number) => void;
}

export const SurahSelectorModal: React.FC<SurahSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedSurahNumber,
  onSelectSurah,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'juz30' | 'popular' | 'meccan' | 'medinan'>('all');

  const filteredSurahs = useMemo(() => {
    let base = ALL_SURAHS;

    if (activeTab === 'juz30') {
      base = base.filter((s) => s.number >= 78);
    } else if (activeTab === 'popular') {
      const popNumbers = [1, 2, 18, 36, 55, 56, 67, 112, 113, 114];
      base = base.filter((s) => popNumbers.includes(s.number));
    } else if (activeTab === 'meccan') {
      base = base.filter((s) => s.revelationType === 'Meccan');
    } else if (activeTab === 'medinan') {
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
  }, [activeTab, filterQuery]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl liquid-glass-dark border border-white/15 shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold font-oxford tracking-wide text-white">
              Pilih Surah (114 Surah Al-Qur'an)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Tabs */}
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

          {/* Filter Tabs Segmented Control */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Semua (114)
            </button>
            <button
              onClick={() => setActiveTab('popular')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'popular'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Pilihan Populer
            </button>
            <button
              onClick={() => setActiveTab('juz30')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'juz30'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Juz 'Amma (78-114)
            </button>
            <button
              onClick={() => setActiveTab('meccan')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'meccan'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Makkiyah
            </button>
            <button
              onClick={() => setActiveTab('medinan')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'medinan'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              Madaniyah
            </button>
          </div>
        </div>

        {/* Grid List */}
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
      </div>
    </div>
  );
};
