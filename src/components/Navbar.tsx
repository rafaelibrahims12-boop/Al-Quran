import React from 'react';
import { Search, Moon, Sun, Settings2, Bookmark, BookOpen, Sparkles } from 'lucide-react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenTajwidGuide: () => void;
  onOpenBookmarks: () => void;
  onOpenSurahList: () => void;
  currentSurahName?: string;
  currentAyahNumber?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onToggleDarkMode,
  onOpenSearch,
  onOpenSettings,
  onOpenTajwidGuide,
  onOpenBookmarks,
  onOpenSurahList,
  currentSurahName,
  currentAyahNumber,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 backdrop-blur-xl border-b border-white/10 dark:border-slate-800/60 bg-white/60 dark:bg-slate-950/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={onOpenSurahList}
          className="flex items-center gap-3 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md py-1"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-xs font-serif font-bold text-base select-none">
            ق
          </div>
          <div className="flex flex-col">
            <span className="font-oxford text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-amber-100 whitespace-nowrap shrink-0 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Al-Qur'an 7 Oxford Digital
            </span>
            {currentSurahName && (
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-sans tracking-wide">
                QS. {currentSurahName} {currentAyahNumber ? `: Ayat ${currentAyahNumber}` : ''}
              </span>
            )}
          </div>
        </button>

        {/* Zone 2: 4-5 Concise Single-line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-300">
          <button
            onClick={onOpenSurahList}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Daftar Surah</span>
          </button>

          <button
            onClick={onOpenTajwidGuide}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>7 Tajwid Oxford</span>
          </button>

          <button
            onClick={onOpenBookmarks}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Bookmark className="w-4 h-4 text-blue-500" />
            <span>Tersimpan</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search Action */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-200/80 dark:hover:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs cursor-pointer"
            title="Cari surah atau terjemahan (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Cari Ayat</span>
            <kbd className="hidden lg:inline text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-500">
              ⌘K
            </kbd>
          </button>

          {/* Mode Malam / Siang Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={isDarkMode ? 'Beralih ke Mode Siang' : 'Beralih ke Mode Malam'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Settings Drawer Toggle */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Pengaturan Tampilan & Ukuran Font"
            aria-label="Settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
