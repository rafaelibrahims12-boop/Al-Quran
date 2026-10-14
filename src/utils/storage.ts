import { BookmarkItem, ReaderSettings } from '../types/quran';

const SETTINGS_KEY = 'al_quran_oxford_settings_v1';
const BOOKMARKS_KEY = 'al_quran_oxford_bookmarks_v1';
const LAST_READ_KEY = 'al_quran_oxford_last_read_v1';

export const DEFAULT_SETTINGS: ReaderSettings = {
  isDarkMode: true,
  arabicFontSize: 34,
  translationFontSize: 15,
  showTajwidColors: true,
  showEnglishTranslation: true,
  showIndonesianTranslation: true,
  showTransliteration: true,
  showWordByWord: false,
  viewMode: 'study',
  reciter: 'alafasy',
  playbackSpeed: 1.0,
  autoScroll: true,
};

export function loadSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to parse settings from storage', e);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: ReaderSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function loadBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load bookmarks', e);
  }
  return [];
}

export function saveBookmark(item: BookmarkItem): BookmarkItem[] {
  try {
    const existing = loadBookmarks().filter((b) => !(b.surahNumber === item.surahNumber && b.ayahNumber === item.ayahNumber));
    const updated = [item, ...existing];
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save bookmark', e);
    return [];
  }
}

export function removeBookmark(surahNumber: number, ayahNumber: number): BookmarkItem[] {
  try {
    const existing = loadBookmarks().filter((b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber));
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(existing));
    return existing;
  } catch (e) {
    console.error('Failed to remove bookmark', e);
    return [];
  }
}

export interface LastReadPos {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  updatedAt: number;
}

export function loadLastRead(): LastReadPos | null {
  try {
    const raw = localStorage.getItem(LAST_READ_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load last read', e);
  }
  return null;
}

export function saveLastRead(pos: LastReadPos): void {
  try {
    localStorage.setItem(LAST_READ_KEY, JSON.stringify(pos));
  } catch (e) {
    console.error('Failed to save last read', e);
  }
}
