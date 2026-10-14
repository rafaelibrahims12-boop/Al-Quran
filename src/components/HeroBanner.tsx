import React from 'react';
import { SurahDetail, TajwidRuleId } from '../types/quran';
import { OXFORD_TAJWID_RULES } from '../data/tajwidRules';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  BookmarkCheck,
  BookOpen,
  Info,
} from 'lucide-react';

interface HeroBannerProps {
  surah: SurahDetail;
  activeTajwidFilter?: TajwidRuleId | null;
  onSelectTajwidFilter: (ruleId: TajwidRuleId | null) => void;
  onOpenTajwidGuide: () => void;
  onOpenSurahModal: () => void;
  onPrevSurah: () => void;
  onNextSurah: () => void;
  onMarkLastRead: () => void;
  isLastReadHere: boolean;
  viewMode: 'study' | 'mushaf';
  onToggleViewMode: (mode: 'study' | 'mushaf') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  surah,
  activeTajwidFilter,
  onSelectTajwidFilter,
  onOpenTajwidGuide,
  onOpenSurahModal,
  onPrevSurah,
  onNextSurah,
  onMarkLastRead,
  isLastReadHere,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <section className="relative overflow-hidden rounded-3xl mb-8 border border-white/15 shadow-2xl transition-all duration-300">
      {/* Background artwork image with liquid glass overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('/src/assets/images/hero_oxford_quran_1791946108094.jpg')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/85 to-slate-950/70 backdrop-blur-md" />

      {/* Content Container */}
      <div className="relative z-10 p-6 sm:p-10 text-white">
        {/* Top Operational Breadcrumb & Navigation Strip */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSurahModal}
              className="hover:text-amber-300 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Surah #{surah.number} dari 114</span>
            </button>
            <span aria-hidden="true">·</span>
            <span>Juz {surah.juz}</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400">
              {surah.revelationType === 'Meccan' ? 'Makkiyah' : 'Madaniyah'} ({surah.numberOfAyahs} Ayat)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Segmented Switcher */}
            <div className="flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
              <button
                onClick={() => onToggleViewMode('study')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'study'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Beralih ke Mode Studi (analisis per ayat)"
              >
                Mode Studi
              </button>
              <button
                onClick={() => onToggleViewMode('mushaf')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  viewMode === 'mushaf'
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Beralih ke Mode Mushaf (khat mengalir)"
              >
                Mode Mushaf
              </button>
            </div>

            {/* Mark Last Read */}
            <button
              onClick={onMarkLastRead}
              className={`px-3 py-1.5 rounded-lg border transition-all text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                isLastReadHere
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
              }`}
              title="Tandai posisi surah ini sebagai bacaan terakhir"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isLastReadHere ? 'Terakhir Dibaca' : 'Tandai Selesai / Terakhir'}</span>
            </button>

            {/* Surah Prev / Next Switchers */}
            <button
              onClick={onPrevSurah}
              disabled={surah.number <= 1}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 transition-colors"
              title="Surah Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNextSurah}
              disabled={surah.number >= 114}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 disabled:opacity-20 transition-colors"
              title="Surah Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grand Surah Calligraphy & Identity Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-sans font-semibold mb-1">
              Oxford Study Edition · Terjemahan Ganda
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold font-oxford tracking-tight text-white mb-2">
              {surah.englishName}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-serif italic max-w-xl">
              "{surah.indonesianNameTranslation}" · Oxford: "{surah.englishNameTranslation}"
            </p>
          </div>

          <div className="text-right">
            <div
              className="font-arabic text-4xl sm:text-6xl text-amber-200 drop-shadow-md select-none"
              dir="rtl"
            >
              {surah.name}
            </div>
            <span className="text-xs text-slate-400 font-sans mt-1 inline-block">
              {surah.numberOfAyahs} Ayat Diturunkan di {surah.revelationType === 'Meccan' ? 'Makkah' : 'Madinah'}
            </span>
          </div>
        </div>

        {/* 7 Tajwid Oxford Interactive Legend Ribbon */}
        <div className="pt-5 border-t border-white/10">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Panduan 7 Tajwid Oxford Interaktif</span>
              <span className="text-[10px] text-slate-500 lowercase font-normal">(klik kaidah untuk menyaring)</span>
            </div>

            <button
              onClick={onOpenTajwidGuide}
              className="text-xs text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Buka Modul Belajar</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {Object.values(OXFORD_TAJWID_RULES).map((rule) => {
              const isSelected = activeTajwidFilter === rule.id;
              return (
                <button
                  key={rule.id}
                  onClick={() =>
                    onSelectTajwidFilter(isSelected ? null : rule.id)
                  }
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-white/20 text-white border-white/40 shadow-sm scale-105'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                  title={`${rule.summaryId} - Klik untuk memfilter ayat`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                    style={{ backgroundColor: rule.colorHex }}
                  />
                  <span>{rule.nameId.split('(')[0]}</span>
                  <span className="text-[10px] opacity-70 font-sans hidden lg:inline">
                    ({rule.durationBeats.split(' ')[0]})
                  </span>
                </button>
              );
            })}

            {activeTajwidFilter && (
              <button
                onClick={() => onSelectTajwidFilter(null)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>

        {/* Bismillah Header (Except Surah At-Tawbah 9 and Surah Al-Fatihah 1 which has it as Ayah 1) */}
        {surah.number !== 9 && surah.number !== 1 && (
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <div
              className="font-arabic text-2xl sm:text-4xl text-amber-200 tracking-wide select-none drop-shadow-sm"
              dir="rtl"
            >
              بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
            </div>
            <p className="text-xs text-slate-400 font-sans mt-2">
              Dengan nama Allah Yang Maha Pengasih, Maha Penyayang · In the name of God, the Lord of Mercy, the Giver of Mercy
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
