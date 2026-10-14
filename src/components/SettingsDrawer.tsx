import React from 'react';
import { ReaderSettings, ReciterId } from '../types/quran';
import { RECITERS_LIST } from '../data/tajwidRules';
import {
  X,
  Moon,
  Sun,
  Type,
  Eye,
  Sliders,
  Volume2,
  Sparkles,
  Layers,
} from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ReaderSettings;
  onUpdateSettings: (updater: (prev: ReaderSettings) => ReaderSettings) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full liquid-glass-dark border-l border-white/15 p-6 shadow-2xl flex flex-col text-slate-100 overflow-y-auto animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-semibold font-oxford tracking-wide text-white">
              Pengaturan Baca & Kenyamanan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-5 space-y-6 flex-1">
          {/* 1. Mode Baca Siang / Malam */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Tema Tampilan & Kenyamanan Mata
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings((p) => ({ ...p, isDarkMode: false }))}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  !settings.isDarkMode
                    ? 'bg-amber-100 text-slate-900 border-amber-400 shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <div className="text-left">
                  <div className="text-xs">Mode Siang</div>
                  <div className="text-[10px] opacity-70">Alabaster Cream</div>
                </div>
              </button>

              <button
                onClick={() => onUpdateSettings((p) => ({ ...p, isDarkMode: true }))}
                className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer ${
                  settings.isDarkMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm font-semibold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <Moon className="w-4 h-4 text-amber-400" />
                <div className="text-left">
                  <div className="text-xs">Mode Malam</div>
                  <div className="text-[10px] opacity-70">Deep Midnight Slate</div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Mode Layout: Studi vs Mushaf */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Gaya Pembacaan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings((p) => ({ ...p, viewMode: 'study' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.viewMode === 'study'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="text-xs">Mode Studi & Terjemahan</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Tampilan per ayat lengkap</div>
              </button>

              <button
                onClick={() => onUpdateSettings((p) => ({ ...p, viewMode: 'mushaf' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  settings.viewMode === 'mushaf'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="text-xs">Mode Mushaf Al-Qur'an</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Teks khat mengalir</div>
              </button>
            </div>
          </div>

          {/* 3. Slider Ukuran Huruf Arab */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                Ukuran Huruf Arab
              </span>
              <span className="text-amber-300 font-semibold">{settings.arabicFontSize}px</span>
            </div>
            <input
              type="range"
              min="24"
              max="50"
              step="2"
              value={settings.arabicFontSize}
              onChange={(e) =>
                onUpdateSettings((p) => ({ ...p, arabicFontSize: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
            {/* Live Preview */}
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 text-right">
              <span className="font-arabic text-amber-100" style={{ fontSize: `${settings.arabicFontSize}px` }} dir="rtl">
                بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ
              </span>
            </div>
          </div>

          {/* 4. Slider Ukuran Terjemahan */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider">
                Ukuran Font Terjemahan
              </span>
              <span className="text-amber-300 font-semibold">{settings.translationFontSize}px</span>
            </div>
            <input
              type="range"
              min="13"
              max="20"
              step="1"
              value={settings.translationFontSize}
              onChange={(e) =>
                onUpdateSettings((p) => ({ ...p, translationFontSize: parseInt(e.target.value, 10) }))
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* 5. Toggles Lapisan Teks */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Komponen Tampilan Ayat
            </div>

            {/* 7 Tajwid Oxford Colors Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-xs font-medium text-white">Warna 7 Tajwid Oxford</div>
                  <div className="text-[10px] text-slate-400">Pewarnaan kaidah tajwid interaktif</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showTajwidColors}
                onChange={(e) =>
                  onUpdateSettings((p) => ({ ...p, showTajwidColors: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            {/* Terjemahan Oxford Inggris */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs font-medium text-white">Terjemahan Bahasa Inggris</div>
                <div className="text-[10px] text-slate-400">Oxford World's Classics (Abdel Haleem)</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showEnglishTranslation}
                onChange={(e) =>
                  onUpdateSettings((p) => ({ ...p, showEnglishTranslation: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            {/* Terjemahan Kemenag RI */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs font-medium text-white">Terjemahan Bahasa Indonesia</div>
                <div className="text-[10px] text-slate-400">Standar Resmi Kementerian Agama RI</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showIndonesianTranslation}
                onChange={(e) =>
                  onUpdateSettings((p) => ({ ...p, showIndonesianTranslation: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            {/* Transliterasi Latin */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs font-medium text-white">Transliterasi Latin Fonetik</div>
                <div className="text-[10px] text-slate-400">Panduan lafal ejaan huruf latin</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showTransliteration}
                onChange={(e) =>
                  onUpdateSettings((p) => ({ ...p, showTransliteration: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            {/* Kata per Kata */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs font-medium text-white">Makna Kata-per-Kata</div>
                <div className="text-[10px] text-slate-400">Dekomposisi kosa kata ayat</div>
              </div>
              <input
                type="checkbox"
                checked={settings.showWordByWord}
                onChange={(e) =>
                  onUpdateSettings((p) => ({ ...p, showWordByWord: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>

            {/* Auto-scroll toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <div>
                <div className="text-xs font-medium text-white">Gulir Otomatis (Auto-Scroll)</div>
                <div className="text-[10px] text-slate-400">Fokuskan layar ke ayat yang sedang berbunyi</div>
              </div>
              <input
                type="checkbox"
                checked={settings.autoScroll}
                onChange={(e) =>
                  onUpdateSettings((p) => ({ ...p, autoScroll: e.target.checked }))
                }
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs shadow-md transition-all cursor-pointer"
          >
            Terapkan & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
