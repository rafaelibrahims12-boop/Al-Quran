export interface JuzInfo {
  juz: number;
  startPage: number;
  endPage: number;
  startSurah: number;
  startAyah: number;
  nameAr: string;
  nameLatin: string;
}

export const QURAN_JUZ_LIST: JuzInfo[] = [
  { juz: 1, startPage: 1, endPage: 21, startSurah: 1, startAyah: 1, nameAr: 'الم', nameLatin: 'Alif Lam Meem' },
  { juz: 2, startPage: 22, endPage: 41, startSurah: 2, startAyah: 142, nameAr: 'سيقول', nameLatin: 'Sayaqūl' },
  { juz: 3, startPage: 42, endPage: 61, startSurah: 2, startAyah: 253, nameAr: 'تلك الرسل', nameLatin: 'Tilkar-Rusul' },
  { juz: 4, startPage: 62, endPage: 81, startSurah: 3, startAyah: 93, nameAr: 'لن تنالوا', nameLatin: 'Lan Tanālū' },
  { juz: 5, startPage: 82, endPage: 101, startSurah: 4, startAyah: 24, nameAr: 'والمحصنات', nameLatin: 'Wal-Muḥṣanāt' },
  { juz: 6, startPage: 102, endPage: 121, startSurah: 4, startAyah: 148, nameAr: 'لا يحب الله', nameLatin: 'Lā Yuḥibbullāh' },
  { juz: 7, startPage: 122, endPage: 141, startSurah: 5, startAyah: 82, nameAr: 'وإذا سمعوا', nameLatin: 'Wa Iżā Sami\'ū' },
  { juz: 8, startPage: 142, endPage: 161, startSurah: 6, startAyah: 111, nameAr: 'ولو أننا', nameLatin: 'Wa Law Annanā' },
  { juz: 9, startPage: 162, endPage: 181, startSurah: 7, startAyah: 88, nameAr: 'قال الملأ', nameLatin: 'Qālal-Mala\'u' },
  { juz: 10, startPage: 182, endPage: 201, startSurah: 8, startAyah: 41, nameAr: 'واعلموا', nameLatin: 'Wa\'lamū' },
  { juz: 11, startPage: 202, endPage: 221, startSurah: 9, startAyah: 93, nameAr: 'يعتذرون', nameLatin: 'Ya\'tażirūn' },
  { juz: 12, startPage: 222, endPage: 241, startSurah: 11, startAyah: 6, nameAr: 'وما من دابة', nameLatin: 'Wa Mā Min Dābbah' },
  { juz: 13, startPage: 242, endPage: 261, startSurah: 12, startAyah: 53, nameAr: 'وما أبرئ', nameLatin: 'Wa Mā Ubarri\'u' },
  { juz: 14, startPage: 262, endPage: 281, startSurah: 15, startAyah: 1, nameAr: 'ربما', nameLatin: 'Rubamā' },
  { juz: 15, startPage: 282, endPage: 301, startSurah: 17, startAyah: 1, nameAr: 'سبحان الذي', nameLatin: 'Subḥānallażī' },
  { juz: 16, startPage: 302, endPage: 321, startSurah: 18, startAyah: 75, nameAr: 'قال ألم', nameLatin: 'Qāla Alam' },
  { juz: 17, startPage: 322, endPage: 341, startSurah: 21, startAyah: 1, nameAr: 'اقترب', nameLatin: 'Iqtaraba' },
  { juz: 18, startPage: 342, endPage: 361, startSurah: 23, startAyah: 1, nameAr: 'قد أفلح', nameLatin: 'Qad Aflaḥa' },
  { juz: 19, startPage: 362, endPage: 381, startSurah: 25, startAyah: 21, nameAr: 'وقال الذين', nameLatin: 'Wa Qālallażīna' },
  { juz: 20, startPage: 382, endPage: 401, startSurah: 27, startAyah: 56, nameAr: 'فما كان', nameLatin: 'Famā Kāna' },
  { juz: 21, startPage: 402, endPage: 421, startSurah: 29, startAyah: 46, nameAr: 'ولا تجادلوا', nameLatin: 'Wa Lā Tujādilū' },
  { juz: 22, startPage: 422, endPage: 441, startSurah: 33, startAyah: 31, nameAr: 'ومن يقنت', nameLatin: 'Wa May-Yaqnut' },
  { juz: 23, startPage: 442, endPage: 461, startSurah: 36, startAyah: 28, nameAr: 'وما أنزلنا', nameLatin: 'Wa Mā Anzalnā' },
  { juz: 24, startPage: 462, endPage: 481, startSurah: 39, startAyah: 32, nameAr: 'فمن أظلم', nameLatin: 'Faman Aẓlam' },
  { juz: 25, startPage: 482, endPage: 501, startSurah: 41, startAyah: 47, nameAr: 'إليه يرد', nameLatin: 'Ilaihi Yuraddu' },
  { juz: 26, startPage: 502, endPage: 521, startSurah: 46, startAyah: 1, nameAr: 'حم', nameLatin: 'Ḥā-Mīm' },
  { juz: 27, startPage: 522, endPage: 541, startSurah: 51, startAyah: 31, nameAr: 'قال فما خطبكم', nameLatin: 'Qāla Famā Khaṭbukum' },
  { juz: 28, startPage: 542, endPage: 561, startSurah: 58, startAyah: 1, nameAr: 'قد سمع', nameLatin: 'Qad Sami\'a' },
  { juz: 29, startPage: 562, endPage: 581, startSurah: 67, startAyah: 1, nameAr: 'تبارك', nameLatin: 'Tabārak' },
  { juz: 30, startPage: 582, endPage: 604, startSurah: 78, startAyah: 1, nameAr: 'عم', nameLatin: '\'Amma' },
];

/**
 * Returns the Juz number for a given Quran page (1 - 604)
 */
export function getJuzForPage(page: number): number {
  if (page < 1) return 1;
  if (page > 604) return 30;
  const match = QURAN_JUZ_LIST.find((j) => page >= j.startPage && page <= j.endPage);
  return match ? match.juz : 1;
}

/**
 * Key landmark starting pages of Surahs in the standard 604-page Madinah Mushaf
 */
export const SURAH_START_PAGES: Record<number, number> = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
  11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
  31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
  71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
  81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
  91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
  101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603, 110: 603,
  111: 603, 112: 604, 113: 604, 114: 604
};

/**
 * Returns estimated starting Surah for any page (1 - 604)
 */
export function getSurahForPage(page: number): number {
  if (page <= 1) return 1;
  let resultSurah = 1;
  for (let s = 1; s <= 114; s++) {
    const startP = SURAH_START_PAGES[s] || 1;
    if (startP <= page) {
      resultSurah = s;
    } else {
      break;
    }
  }
  return resultSurah;
}
