export type ReciterId = 'alafasy' | 'husary' | 'abdulbasit' | 'ghamdi';

export interface Reciter {
  id: ReciterId;
  name: string;
  style: string;
  description: string;
  subfolder: string;
}

export interface SurahSummary {
  number: number;
  name: string; // Arabic name
  englishName: string;
  englishNameTranslation: string;
  indonesianNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
  juz: number;
}

export type TajwidRuleId = 
  | 'ghunnah' 
  | 'ikhfa' 
  | 'idgham' 
  | 'iqlab' 
  | 'qalqalah' 
  | 'mad' 
  | 'waqaf';

export interface TajwidRule {
  id: TajwidRuleId;
  nameAr: string;
  nameId: string;
  nameEn: string;
  colorHex: string;
  textColorClass: string;
  bgBadgeClass: string;
  borderColorClass: string;
  summaryId: string;
  summaryEn: string;
  durationBeats: string;
  letters: string[];
  rulesExplanationId: string;
  rulesExplanationEn: string;
  howToPronounceId: string;
  sampleAr: string;
  sampleEn: string;
}

export interface TajwidToken {
  text: string;
  ruleId?: TajwidRuleId;
  ruleName?: string;
  note?: string;
}

export interface WordMeaning {
  ar: string;
  tr: string;
  id: string;
  en: string;
  ruleId?: TajwidRuleId;
}

export interface AyahData {
  numberInSurah: number;
  numberInQuran: number;
  textAr: string;
  textEnOxford: string;
  textIdKemenag: string;
  transliteration: string;
  audioUrl: string;
  juz: number;
  page?: number;
  tokens?: TajwidToken[];
  words?: WordMeaning[];
}

export interface SurahDetail extends SurahSummary {
  ayahs: AyahData[];
  bismillahPre?: boolean;
}

export interface BookmarkItem {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  textArSnippet: string;
  textEnSnippet: string;
  savedAt: number;
  note?: string;
}

export interface ReaderSettings {
  isDarkMode: boolean;
  arabicFontSize: number; // 24 to 52
  translationFontSize: number; // 14 to 22
  showTajwidColors: boolean;
  showEnglishTranslation: boolean;
  showIndonesianTranslation: boolean;
  showTransliteration: boolean;
  showWordByWord: boolean;
  viewMode: 'study' | 'mushaf';
  reciter: ReciterId;
  playbackSpeed: number; // 0.75, 1, 1.25
  autoScroll: boolean;
}
