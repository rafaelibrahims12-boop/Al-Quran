import React from 'react';
import { BookmarkItem } from '../types/quran';
import { Bookmark, X, Trash2, ArrowRight, History } from 'lucide-react';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  lastRead: { surahNumber: number; surahName: string; ayahNumber: number; updatedAt: number } | null;
  onSelectAyah: (surahNumber: number, ayahNumber: number) => void;
  onRemoveBookmark: (surahNumber: number, ayahNumber: number) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  lastRead,
  onSelectAyah,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl liquid-glass-dark border border-white/15 shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold font-oxford tracking-wide text-white">
              Ayat Tersimpan & Terakhir Dibaca
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Last Read Marker Card */}
          {lastRead ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                    Terakhir Dibaca
                  </div>
                  <div className="text-sm font-bold text-white">
                    QS. {lastRead.surahName} ({lastRead.surahNumber} : {lastRead.ayahNumber})
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Disimpan {new Date(lastRead.updatedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectAyah(lastRead.surahNumber, lastRead.ayahNumber);
                  onClose();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <span>Lanjutkan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 text-center">
              Belum ada posisi terakhir dibaca yang ditandai. Anda dapat menandai ayat sewaktu membaca.
            </div>
          )}

          {/* Bookmarks List */}
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Daftar Ayat Tersimpan ({bookmarks.length})
            </div>

            {bookmarks.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                Belum ada ayat yang ditandai bookmark. Klik ikon bookmark pada kartu ayat untuk menyimpannya.
              </div>
            ) : (
              <div className="space-y-2">
                {bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-between gap-4 group"
                  >
                    <button
                      onClick={() => {
                        onSelectAyah(bm.surahNumber, bm.ayahNumber);
                        onClose();
                      }}
                      className="text-left flex-1 min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-amber-300">
                          QS. {bm.surahName} [{bm.surahNumber}:{bm.ayahNumber}]
                        </span>
                      </div>
                      <div className="font-arabic text-base text-slate-200 truncate" dir="rtl">
                        {bm.textArSnippet}
                      </div>
                      <div className="text-xs text-slate-400 truncate font-sans">
                        {bm.textEnSnippet}
                      </div>
                    </button>

                    <button
                      onClick={() => onRemoveBookmark(bm.surahNumber, bm.ayahNumber)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Hapus bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
