/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AyahData,
  BookmarkItem,
  ReaderSettings,
  SurahDetail,
  TajwidRuleId,
} from './types/quran';
import {
  DEFAULT_SETTINGS,
  loadBookmarks,
  loadLastRead,
  loadSettings,
  removeBookmark,
  saveBookmark,
  saveLastRead,
  saveSettings,
} from './utils/storage';
import { fetchSurahDetail } from './utils/quranApi';
import { ALL_SURAHS } from './data/surahList';
import { LiquidBackground } from './components/LiquidBackground';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { AyahCard } from './components/AyahCard';
import { MushafModeView } from './components/MushafModeView';
import { AudioPlayer } from './components/AudioPlayer';
import { SearchModal } from './components/SearchModal';
import { TajwidGuideModal } from './components/TajwidGuideModal';
import { SurahSelectorModal } from './components/SurahSelector';
import { BookmarksModal } from './components/BookmarksModal';
import { SettingsDrawer } from './components/SettingsDrawer';
import { Loader2, AlertCircle, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // 1. Settings & Reader Preferences
  const [settings, setSettings] = useState<ReaderSettings>(() => loadSettings());

  // Save settings when changed
  const updateSettings = (updater: (prev: ReaderSettings) => ReaderSettings) => {
    setSettings((prev) => {
      const next = updater(prev);
      saveSettings(next);
      return next;
    });
  };

  // 2. Navigation & Quran Content State
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [surahDetail, setSurahDetail] = useState<SurahDetail | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // 3. Audio & Synchronization State
  const [activeAyahNumber, setActiveAyahNumber] = useState<number>(1);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // 4. Interactive Tajwid State
  const [activeTajwidFilter, setActiveTajwidFilter] = useState<TajwidRuleId | null>(null);

  // 5. Bookmarks & Last Read State
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => loadBookmarks());
  const [lastRead, setLastRead] = useState<{
    surahNumber: number;
    surahName: string;
    ayahNumber: number;
    updatedAt: number;
  } | null>(() => loadLastRead());

  // 6. Modal / Drawer Controls
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTajwidGuideOpen, setIsTajwidGuideOpen] = useState(false);
  const [isSurahListOpen, setIsSurahListOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Synchronize document theme class
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // Track window scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Surah Detail whenever currentSurahNumber or reciter changes
  const loadSurah = useCallback(async (surahNum: number, targetAyah = 1) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const detail = await fetchSurahDetail(surahNum, settings.reciter);
      setSurahDetail(detail);
      setCurrentSurahNumber(surahNum);
      setActiveAyahNumber(targetAyah);

      // Smooth scroll to top of reading area
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Failed to load surah:', err);
      const message = err instanceof Error ? err.message : 'Gagal memuat surah. Silakan periksa koneksi internet Anda.';
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  }, [settings.reciter]);

  useEffect(() => {
    loadSurah(currentSurahNumber);
  }, [currentSurahNumber, loadSurah]);

  // Keyboard navigation for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Audio Play Trigger for specific ayah
  const handlePlayAyah = (ayahNum: number) => {
    if (activeAyahNumber === ayahNum && isPlayingAudio) {
      setIsPlayingAudio(false);
    } else {
      setActiveAyahNumber(ayahNum);
      setIsPlayingAudio(true);
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = (ayah: AyahData) => {
    if (!surahDetail) return;
    const exists = bookmarks.some(
      (b) => b.surahNumber === surahDetail.number && b.ayahNumber === ayah.numberInSurah
    );

    if (exists) {
      const updated = removeBookmark(surahDetail.number, ayah.numberInSurah);
      setBookmarks(updated);
    } else {
      const newItem: BookmarkItem = {
        id: `${surahDetail.number}-${ayah.numberInSurah}-${Date.now()}`,
        surahNumber: surahDetail.number,
        surahName: surahDetail.englishName,
        ayahNumber: ayah.numberInSurah,
        textArSnippet: ayah.textAr.slice(0, 80),
        textEnSnippet: ayah.textEnOxford.slice(0, 90) + '...',
        savedAt: Date.now(),
      };
      const updated = saveBookmark(newItem);
      setBookmarks(updated);
    }
  };

  // Mark Last Read Position
  const handleMarkLastRead = () => {
    if (!surahDetail) return;
    const pos = {
      surahNumber: surahDetail.number,
      surahName: surahDetail.englishName,
      ayahNumber: activeAyahNumber,
      updatedAt: Date.now(),
    };
    saveLastRead(pos);
    setLastRead(pos);
  };

  const isCurrentPositionLastRead = Boolean(
    lastRead &&
      surahDetail &&
      lastRead.surahNumber === surahDetail.number &&
      lastRead.ayahNumber === activeAyahNumber
  );

  const currentAyahData = surahDetail?.ayahs.find(
    (a) => a.numberInSurah === activeAyahNumber
  ) || surahDetail?.ayahs[0] || null;

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans ${
      settings.isDarkMode ? 'dark text-slate-100' : 'text-slate-900'
    }`}>
      {/* 1. Liquid Glass Ambient Caustic Backdrop */}
      <LiquidBackground isDarkMode={settings.isDarkMode} />

      {/* 2. Top Bar Navigation (Strict 3-zone contract) */}
      <Navbar
        isDarkMode={settings.isDarkMode}
        onToggleDarkMode={() => updateSettings((p) => ({ ...p, isDarkMode: !p.isDarkMode }))}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTajwidGuide={() => setIsTajwidGuideOpen(true)}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSurahList={() => setIsSurahListOpen(true)}
        currentSurahName={surahDetail?.englishName}
        currentAyahNumber={activeAyahNumber}
      />

      {/* 3. Main Editorial Viewport */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-36">
        {isLoading && !surahDetail ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-sm font-medium text-slate-400 font-sans">
              Menyiapkan teks Al-Qur'an 7 Oxford Digital...
            </p>
          </div>
        ) : loadError && !surahDetail ? (
          <div className="p-8 rounded-2xl liquid-glass-dark border border-rose-500/30 text-center space-y-4 my-12">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">Gagal Memuat Surah</h3>
            <p className="text-sm text-slate-300 max-w-md mx-auto">{loadError}</p>
            <button
              onClick={() => loadSurah(currentSurahNumber)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-semibold text-xs shadow-md"
            >
              Coba Lagi
            </button>
          </div>
        ) : surahDetail ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`surah-container-${surahDetail.number}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Curatorial Hero Banner */}
              <HeroBanner
                surah={surahDetail}
                activeTajwidFilter={activeTajwidFilter}
                onSelectTajwidFilter={(ruleId) => setActiveTajwidFilter(ruleId)}
                onOpenTajwidGuide={() => setIsTajwidGuideOpen(true)}
                onOpenSurahModal={() => setIsSurahListOpen(true)}
                onPrevSurah={() => {
                  if (currentSurahNumber > 1) {
                    loadSurah(currentSurahNumber - 1);
                  }
                }}
                onNextSurah={() => {
                  if (currentSurahNumber < 114) {
                    loadSurah(currentSurahNumber + 1);
                  }
                }}
                onMarkLastRead={handleMarkLastRead}
                isLastReadHere={isCurrentPositionLastRead}
                viewMode={settings.viewMode}
                onToggleViewMode={(mode) => updateSettings((p) => ({ ...p, viewMode: mode }))}
              />

              {/* Reading Content Area: Study Mode vs Mushaf Mode Animated Crossfade */}
              <AnimatePresence mode="wait">
                {settings.viewMode === 'study' ? (
                  <motion.div
                    key={`study-mode-${surahDetail.number}`}
                    initial={{ opacity: 0, scale: 0.985, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.985, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    {surahDetail.ayahs.map((ayah) => {
                      const isAyahActive = ayah.numberInSurah === activeAyahNumber;
                      const isBookmarked = bookmarks.some(
                        (b) =>
                          b.surahNumber === surahDetail.number &&
                          b.ayahNumber === ayah.numberInSurah
                      );

                      return (
                        <AyahCard
                          key={ayah.numberInSurah}
                          ayah={ayah}
                          surahNumber={surahDetail.number}
                          surahName={surahDetail.englishName}
                          settings={settings}
                          isPlaying={isPlayingAudio}
                          isActiveAyah={isAyahActive}
                          isBookmarked={isBookmarked}
                          activeTajwidFilter={activeTajwidFilter}
                          onPlayAyah={handlePlayAyah}
                          onToggleBookmark={handleToggleBookmark}
                          onOpenFullTajwidGuide={() => setIsTajwidGuideOpen(true)}
                        />
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key={`mushaf-mode-${surahDetail.number}`}
                    initial={{ opacity: 0, scale: 0.985, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.985, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <MushafModeView
                      ayahs={surahDetail.ayahs}
                      currentAyahNumber={activeAyahNumber}
                      settings={settings}
                      activeTajwidFilter={activeTajwidFilter}
                      onPlayAyah={handlePlayAyah}
                      onOpenFullTajwidGuide={() => setIsTajwidGuideOpen(true)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom Surah Navigation Bar */}
              <div className="mt-12 p-6 rounded-2xl liquid-glass-dark border border-white/10 flex items-center justify-between text-xs text-slate-300">
                <button
                  onClick={() => {
                    if (currentSurahNumber > 1) loadSurah(currentSurahNumber - 1);
                  }}
                  disabled={currentSurahNumber <= 1}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-25 transition-colors cursor-pointer"
                >
                  ← Surah Sebelumnya
                </button>

                <button
                  onClick={() => setIsSurahListOpen(true)}
                  className="font-semibold text-amber-300 hover:text-amber-200 transition-colors"
                >
                  QS. {surahDetail.englishName} ({surahDetail.numberOfAyahs} Ayat)
                </button>

                <button
                  onClick={() => {
                    if (currentSurahNumber < 114) loadSurah(currentSurahNumber + 1);
                  }}
                  disabled={currentSurahNumber >= 114}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-25 transition-colors cursor-pointer"
                >
                  Surah Berikutnya →
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        ) : null}
      </main>

      {/* 4. Synchronized Floating Audio Murottal Dock */}
      {surahDetail && (
        <AudioPlayer
          currentAyah={currentAyahData}
          currentSurahName={surahDetail.englishName}
          currentSurahNumber={surahDetail.number}
          totalAyahsInSurah={surahDetail.numberOfAyahs}
          settings={settings}
          onUpdateSettings={updateSettings}
          onAyahChange={(newAyahNum) => setActiveAyahNumber(newAyahNum)}
          isPlaying={isPlayingAudio}
          setIsPlaying={setIsPlayingAudio}
        />
      )}

      {/* 5. Modals & Drawers */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSurah={(sNum, aNum) => {
          loadSurah(sNum, aNum || 1);
        }}
      />

      <TajwidGuideModal
        isOpen={isTajwidGuideOpen}
        onClose={() => setIsTajwidGuideOpen(false)}
        activeRuleFilter={activeTajwidFilter}
        onSelectRuleFilter={(ruleId) => setActiveTajwidFilter(ruleId)}
      />

      <SurahSelectorModal
        isOpen={isSurahListOpen}
        onClose={() => setIsSurahListOpen(false)}
        selectedSurahNumber={currentSurahNumber}
        onSelectSurah={(sNum) => loadSurah(sNum, 1)}
      />

      <BookmarksModal
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        lastRead={lastRead}
        onSelectAyah={(sNum, aNum) => loadSurah(sNum, aNum)}
        onRemoveBookmark={(sNum, aNum) => {
          const updated = removeBookmark(sNum, aNum);
          setBookmarks(updated);
        }}
      />

      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {/* Back to top smooth button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-6 z-30 p-3 rounded-full liquid-glass-dark border border-white/20 text-amber-300 shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
          title="Kembali ke atas"
          aria-label="Back to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
