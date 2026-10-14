import { TajwidToken, TajwidRuleId } from '../types/quran';

// Regex patterns for Arabic phonetic characters
const GHUNNAH_REGEX = /([نمّ][ّ])/g;
const MAD_PROLONGED_REGEX = /([^\s]{0,2}[ـٓ~ٰ][^\s]{0,2}|[^\s]{1,3}ۥ|[^\s]{1,3}ۦ)/g;
const QALQALAH_LETTERS = ['ق', 'ط', 'ب', 'ج', 'د'];
const IQLAB_MARK_REGEX = /(ۢ|ۭ)/g;
const WAQAF_MARK_REGEX = /([ۗۘۚۖۛ۞])/g;

/**
 * Parses an Arabic verse string into interactive tokens matching 7 Oxford Tajwid rules.
 */
export function parseQuranicTajwid(text: string): TajwidToken[] {
  if (!text) return [];

  // Split word by word while preserving spaces
  const words = text.split(/(\s+)/);
  const result: TajwidToken[] = [];

  for (const part of words) {
    if (!part || /^\s+$/.test(part)) {
      result.push({ text: part });
      continue;
    }

    // Process word characters
    let cursor = 0;
    const len = part.length;

    while (cursor < len) {
      const char = part[cursor];
      const nextChar = part[cursor + 1] || '';
      const nextNext = part[cursor + 2] || '';

      // 1. Waqaf punctuation marks
      if (/[\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED]/.test(char) || WAQAF_MARK_REGEX.test(char)) {
        result.push({
          text: char,
          ruleId: 'waqaf',
          ruleName: 'Waqaf / Tanda Berhenti',
          note: 'Tanda henti atau jeda nafas resmi mushaf.',
        });
        cursor++;
        continue;
      }

      // 2. Iqlab mark (small Meem above letter ۢ / ۭ)
      if (char === 'ۢ' || char === 'ۭ' || (char === 'ن' && nextChar === 'ْ' && nextNext === 'ب')) {
        const seg = (char === 'ۢ' || char === 'ۭ') ? char : part.slice(cursor, cursor + 3);
        result.push({
          text: seg,
          ruleId: 'iqlab',
          ruleName: 'Iqlab (Menukar ke Mim)',
          note: 'Nun sukun / Tanwin berganti bunyi Mim samar 2 harakat.',
        });
        cursor += seg.length;
        continue;
      }

      // 3. Ghunnah Musyaddadah (Nun or Mim with Shaddah)
      if ((char === 'ن' || char === 'م') && (nextChar === 'ّ' || nextNext === 'ّ')) {
        const segLen = (nextChar === 'ّ') ? 2 : 3;
        const seg = part.slice(cursor, cursor + segLen);
        result.push({
          text: seg,
          ruleId: 'ghunnah',
          ruleName: 'Ghunnah Musyaddadah',
          note: 'Dengung sempurna di rongga hidung selama 2 ketukan mantap.',
        });
        cursor += segLen;
        continue;
      }

      // 4. Extended Mad (Tanda Alis / Mad Wajib / Jaiz / Lazim)
      if (char === 'ٓ' || char === 'ٰ' || nextChar === 'ٓ' || nextChar === 'ٰ') {
        const segLen = (char === 'ٓ' || char === 'ٰ') ? 1 : 2;
        const seg = part.slice(cursor, cursor + segLen);
        result.push({
          text: seg,
          ruleId: 'mad',
          ruleName: 'Mad (Panjang Vokal)',
          note: 'Vokal dipanjangkan 2 hingga 5/6 harakat.',
        });
        cursor += segLen;
        continue;
      }

      // 5. Qalqalah (ق ط ب ج د with Sukun or at word ending)
      if (QALQALAH_LETTERS.includes(char)) {
        if (nextChar === 'ْ' || cursor === len - 1) {
          const segLen = nextChar === 'ْ' ? 2 : 1;
          const seg = part.slice(cursor, cursor + segLen);
          result.push({
            text: seg,
            ruleId: 'qalqalah',
            ruleName: cursor === len - 1 ? 'Qalqalah Kubra' : 'Qalqalah Sughra',
            note: 'Suara memantul jernih dan tegas tanpa harakat tambahan.',
          });
          cursor += segLen;
          continue;
        }
      }

      // 6. Ikhfa' / Idgham pattern recognition
      if (char === 'ن' && (nextChar === 'ْ' || nextChar === ' ')) {
        // Look at subsequent letter
        const targetChar = nextChar === 'ْ' ? nextNext : nextChar;
        const idghamLetters = ['ي', 'ر', 'م', 'ل', 'و', 'ن'];
        const ikhfaLetters = ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'];

        if (idghamLetters.includes(targetChar)) {
          const segLen = nextChar === 'ْ' ? 2 : 1;
          result.push({
            text: part.slice(cursor, cursor + segLen),
            ruleId: 'idgham',
            ruleName: 'Idgham (Melebur Masuk)',
            note: 'Bunyi nun dimasukkan ke huruf berikutnya.',
          });
          cursor += segLen;
          continue;
        }

        if (ikhfaLetters.includes(targetChar)) {
          const segLen = nextChar === 'ْ' ? 2 : 1;
          result.push({
            text: part.slice(cursor, cursor + segLen),
            ruleId: 'ikhfa',
            ruleName: 'Ikhfa\' Haqiqi (Samar)',
            note: 'Samarkan bunyi nun ke makhraj huruf berikutnya disertai dengung.',
          });
          cursor += segLen;
          continue;
        }
      }

      // Default plain character / harakat
      result.push({ text: char });
      cursor++;
    }
  }

  // Merge adjacent plain tokens
  const merged: TajwidToken[] = [];
  for (const token of result) {
    if (!token.ruleId && merged.length > 0 && !merged[merged.length - 1].ruleId) {
      merged[merged.length - 1].text += token.text;
    } else {
      merged.push({ ...token });
    }
  }

  return merged;
}
