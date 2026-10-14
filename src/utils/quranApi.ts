import { ALL_SURAHS } from '../data/surahList';
import { CURATED_SURAHS } from '../data/curatedQuran';
import { AyahData, ReciterId, SurahDetail } from '../types/quran';
import { parseQuranicTajwid } from './tajwidParser';
import { RECITERS_LIST } from '../data/tajwidRules';

const SURAH_CACHE = new Map<number, SurahDetail>();

// Pre-fill cache with curated surahs
for (const [numStr, surah] of Object.entries(CURATED_SURAHS)) {
  SURAH_CACHE.set(Number(numStr), surah);
}

export function getAudioReciterUrl(reciterId: ReciterId, surahNumber: number, ayahNumber: number): string {
  const reciter = RECITERS_LIST.find((r) => r.id === reciterId) || RECITERS_LIST[0];
  const sPad = String(surahNumber).padStart(3, '0');
  const aPad = String(ayahNumber).padStart(3, '0');
  
  // EveryAyah canonical audio paths
  const folderMap: Record<ReciterId, string> = {
    alafasy: 'Alafasy_128kbps',
    husary: 'Husary_128kbps',
    abdulbasit: 'Abdul_Basit_Murattal_192kbps',
    ghamdi: 'Ghamadi_40kbps',
  };

  const folder = folderMap[reciterId] || 'Alafasy_128kbps';
  return `https://everyayah.com/data/${folder}/${sPad}${aPad}.mp3`;
}

/**
 * Fetches a full Surah with Arabic text, Oxford English translation,
 * and Indonesian Kemenag translation, automatically parsing 7 Tajwid rules.
 */
export async function fetchSurahDetail(surahNumber: number, reciterId: ReciterId = 'alafasy'): Promise<SurahDetail> {
  const cached = SURAH_CACHE.get(surahNumber);
  if (cached) {
    // Update audio URLs if reciter changed
    const updatedAyahs = cached.ayahs.map((a) => ({
      ...a,
      audioUrl: getAudioReciterUrl(reciterId, surahNumber, a.numberInSurah),
    }));
    return { ...cached, ayahs: updatedAyahs };
  }

  const summary = ALL_SURAHS.find((s) => s.number === surahNumber);
  if (!summary) {
    throw new Error(`Surah #${surahNumber} not found.`);
  }

  try {
    // Fetch Arabic (uthmani), English (Abdel Haleem / Sahih), and Indonesian (Kemenag)
    // using api.alquran.cloud multi-edition endpoint
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.haleem,id.indonesian`
    );

    if (!response.ok) {
      throw new Error(`Failed to load Surah data (HTTP ${response.status})`);
    }

    const json = await response.json();
    if (!json.data || !Array.isArray(json.data) || json.data.length < 3) {
      throw new Error('Incomplete data response from Quran service');
    }

    const [arEdition, enEdition, idEdition] = json.data;
    const ayahsCount = arEdition.ayahs.length;
    const ayahs: AyahData[] = [];

    for (let i = 0; i < ayahsCount; i++) {
      const arItem = arEdition.ayahs[i];
      const enItem = enEdition?.ayahs?.[i];
      const idItem = idEdition?.ayahs?.[i];
      const numInSurah = arItem.numberInSurah;
      const numInQuran = arItem.number;

      const rawAr = arItem.text;
      const tokens = parseQuranicTajwid(rawAr);

      ayahs.push({
        numberInSurah: numInSurah,
        numberInQuran: numInQuran,
        textAr: rawAr,
        textEnOxford: enItem?.text || 'Oxford translation in preparation.',
        textIdKemenag: idItem?.text || 'Terjemahan Kemenag RI sedang dimuat.',
        transliteration: `Ayat ${numInSurah}`,
        audioUrl: getAudioReciterUrl(reciterId, surahNumber, numInSurah),
        juz: arItem.juz || summary.juz,
        page: arItem.page,
        tokens,
      });
    }

    const result: SurahDetail = {
      ...summary,
      ayahs,
    };

    SURAH_CACHE.set(surahNumber, result);
    return result;
  } catch (err) {
    console.warn(`Error fetching Surah ${surahNumber} from API:`, err);
    // If offline or network error, check if we have any fallback
    if (CURATED_SURAHS[surahNumber]) {
      return CURATED_SURAHS[surahNumber];
    }
    throw err;
  }
}
