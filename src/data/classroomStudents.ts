import { getJuzForPage, getSurahForPage } from './quranPages';
import { ALL_SURAHS } from './surahList';

export interface Student {
  id: number;
  name: string;
  hasRead?: boolean;
  assignedPage?: number;
  assignedSurah?: string;
  assignedAyahs?: string;
  readAt?: number;
}

export const INITIAL_STUDENTS_LIST: Student[] = [
  { id: 1, name: 'Alaric' },
  { id: 2, name: 'Abimanyu' },
  { id: 3, name: 'Arfa' },
  { id: 4, name: 'Aria' },
  { id: 5, name: 'Ario' },
  { id: 6, name: 'Bima' },
  { id: 7, name: 'Sakha' },
  { id: 8, name: 'Dzikra' },
  { id: 9, name: 'Irzaldi' },
  { id: 10, name: 'Januar' },
  { id: 11, name: 'Kemas' },
  { id: 12, name: 'Warren' },
  { id: 13, name: 'Hamid' },
  { id: 14, name: 'Kevin' },
  { id: 15, name: 'Malik' },
  { id: 16, name: 'Abyan' },
  { id: 17, name: 'Raushan' },
  { id: 18, name: 'Radit' },
  { id: 19, name: 'Rafael' },
  { id: 20, name: 'Raffasya' },
  { id: 21, name: 'Rayyan' },
  { id: 22, name: 'Sultan' },
  { id: 23, name: 'Zaki' },
  { id: 24, name: 'Arkan' },
];

/**
 * Curated list of balanced, medium-length recitation passages (Maqra' Pilihan)
 * across Juz 2 to 19 (Pages 22 - 381) that are optimal for student reading turns:
 * not too short (avoiding 1-liner stops) and not too long (avoiding exhausting sections).
 */
export interface BalancedMaqra {
  page: number;
  juz: number;
  surahNumber: number;
  surahName: string;
  recommendedAyahs: string;
  description: string;
}

export const BALANCED_PAGES_JUZ_2_19: BalancedMaqra[] = [
  // Juz 2 (Pages 22 - 41)
  { page: 22, juz: 2, surahNumber: 2, surahName: 'Al-Baqarah', recommendedAyahs: 'Ayat 142 - 145', description: 'Perubahan kiblat & umat pertengahan (Wasathan)' },
  { page: 28, juz: 2, surahNumber: 2, surahName: 'Al-Baqarah', recommendedAyahs: 'Ayat 182 - 186', description: 'Kewajiban puasa & doa hamba yang dekat' },
  { page: 35, juz: 2, surahNumber: 2, surahName: 'Al-Baqarah', recommendedAyahs: 'Ayat 225 - 229', description: 'Keluarga sakinah & sumpah kebajikan' },
  { page: 41, juz: 2, surahNumber: 2, surahName: 'Al-Baqarah', recommendedAyahs: 'Ayat 249 - 252', description: 'Kisah Thalut, Jalut, dan Nabi Daud' },

  // Juz 3 (Pages 42 - 61)
  { page: 42, juz: 3, surahNumber: 2, surahName: 'Al-Baqarah', recommendedAyahs: 'Ayat 253 - 256', description: 'Ayatul Kursi & keagungan tauhid tiada paksaan' },
  { page: 49, juz: 3, surahNumber: 2, surahName: 'Al-Baqarah', recommendedAyahs: 'Ayat 283 - 286', description: 'Akhir Al-Baqarah (Amanar-Rasul) doa pengampunan' },
  { page: 53, juz: 3, surahNumber: 3, surahName: 'Ali \'Imran', recommendedAyahs: 'Ayat 23 - 29', description: 'Kekuasaan kerajaan Allah Yang Maha Memberi' },
  { page: 60, juz: 3, surahNumber: 3, surahName: 'Ali \'Imran', recommendedAyahs: 'Ayat 78 - 83', description: 'Amanah para Nabi dan ketundukan alam semesta' },

  // Juz 4 (Pages 62 - 81)
  { page: 63, juz: 4, surahNumber: 3, surahName: 'Ali \'Imran', recommendedAyahs: 'Ayat 102 - 108', description: 'Perintah bertakwa sebenar-benarnya & persatuan' },
  { page: 68, juz: 4, surahNumber: 3, surahName: 'Ali \'Imran', recommendedAyahs: 'Ayat 133 - 138', description: 'Bersegera meraih ampunan & sifat orang bertakwa' },
  { page: 75, juz: 4, surahNumber: 3, surahName: 'Ali \'Imran', recommendedAyahs: 'Ayat 190 - 195', description: 'Penciptaan langit dan bumi bagi Ulul Albab' },
  { page: 80, juz: 4, surahNumber: 4, surahName: 'An-Nisa', recommendedAyahs: 'Ayat 17 - 22', description: 'Keadilan pergaulan dan taubat yang diterima' },

  // Juz 5 (Pages 82 - 101)
  { page: 84, juz: 5, surahNumber: 4, surahName: 'An-Nisa', recommendedAyahs: 'Ayat 34 - 37', description: 'Keluarga saleh & adab berbuat ihsan pada sesama' },
  { page: 90, juz: 5, surahNumber: 4, surahName: 'An-Nisa', recommendedAyahs: 'Ayat 69 - 74', description: 'Kemuliaan bersama para Nabi, Shiddiqin, Syuhada' },
  { page: 97, juz: 5, surahNumber: 4, surahName: 'An-Nisa', recommendedAyahs: 'Ayat 114 - 119', description: 'Kebaikan sedekah, mendamaikan manusia, & tauhid' },

  // Juz 6 (Pages 102 - 121)
  { page: 105, juz: 6, surahNumber: 4, surahName: 'An-Nisa', recommendedAyahs: 'Ayat 163 - 170', description: 'Wahyu para Rasul & penegasan kebenaran' },
  { page: 110, juz: 6, surahNumber: 5, surahName: 'Al-Ma\'idah', recommendedAyahs: 'Ayat 14 - 19', description: 'Kebenaran cahaya Al-Qur\'an penunjuk jalan keselamatan' },
  { page: 115, juz: 6, surahNumber: 5, surahName: 'Al-Ma\'idah', recommendedAyahs: 'Ayat 41 - 45', description: 'Hukum Taurat, Injil, dan petunjuk bagi orang bertakwa' },

  // Juz 7 (Pages 122 - 141)
  { page: 124, juz: 7, surahNumber: 5, surahName: 'Al-Ma\'idah', recommendedAyahs: 'Ayat 96 - 100', description: 'Kesucian Baitullah dan nilai kebaikan yang unggul' },
  { page: 129, juz: 7, surahNumber: 6, surahName: 'Al-An\'am', recommendedAyahs: 'Ayat 11 - 18', description: 'Kekuasaan mutlak Allah atas seluruh hamba-Nya' },
  { page: 137, juz: 7, surahNumber: 6, surahName: 'Al-An\'am', recommendedAyahs: 'Ayat 74 - 82', description: 'Argumen Nabi Ibrahim mencari kebenaran tauhid' },

  // Juz 8 (Pages 142 - 161)
  { page: 148, juz: 8, surahNumber: 6, surahName: 'Al-An\'am', recommendedAyahs: 'Ayat 151 - 157', description: 'Sepuluh wasiat pokok syariat & larangan syirik' },
  { page: 154, juz: 8, surahNumber: 7, surahName: 'Al-A\'raf', recommendedAyahs: 'Ayat 31 - 37', description: 'Memakai pakaian indah saat ke masjid & batasan halal' },
  { page: 159, juz: 8, surahNumber: 7, surahName: 'Al-A\'raf', recommendedAyahs: 'Ayat 68 - 75', description: 'Dakwah Nabi Hud & Nabi Shalih dengan santun' },

  // Juz 9 (Pages 162 - 181)
  { page: 167, juz: 9, surahNumber: 7, surahName: 'Al-A\'raf', recommendedAyahs: 'Ayat 142 - 145', description: 'Miqat Nabi Musa di bukit Thur & lauh-lauh Taurat' },
  { page: 173, juz: 9, surahNumber: 7, surahName: 'Al-A\'raf', recommendedAyahs: 'Ayat 188 - 195', description: 'Ketundukan Rasulullah & adab mendengarkan Qur\'an' },
  { page: 178, juz: 9, surahNumber: 8, surahName: 'Al-Anfal', recommendedAyahs: 'Ayat 11 - 19', description: 'Bantuan para malaikat & ketenangan hati beriman' },

  // Juz 10 (Pages 182 - 201)
  { page: 185, juz: 10, surahNumber: 8, surahName: 'Al-Anfal', recommendedAyahs: 'Ayat 60 - 66', description: 'Menyiapkan kekuatan & perdamaian bila musuh condong' },
  { page: 190, juz: 10, surahNumber: 9, surahName: 'At-Tawbah', recommendedAyahs: 'Ayat 21 - 27', description: 'Kabar gembira surga & pertolongan Allah di Hunain' },
  { page: 198, juz: 10, surahNumber: 9, surahName: 'At-Tawbah', recommendedAyahs: 'Ayat 71 - 74', description: 'Karakter mukmin sejati saling menolong dalam kebaikan' },

  // Juz 11 (Pages 202 - 221)
  { page: 206, juz: 11, surahNumber: 9, surahName: 'At-Tawbah', recommendedAyahs: 'Ayat 120 - 124', description: 'Kewajiban memperdalam ilmu agama (Tafaqquh fid-din)' },
  { page: 211, juz: 11, surahNumber: 10, surahName: 'Yunus', recommendedAyahs: 'Ayat 21 - 25', description: 'Perumpamaan kehidupan dunia seperti air hujan' },
  { page: 217, juz: 11, surahNumber: 10, surahName: 'Yunus', recommendedAyahs: 'Ayat 71 - 78', description: 'Keteguhan Nabi Nuh menghadapi penentang kebenaran' },

  // Juz 12 (Pages 222 - 241)
  { page: 224, juz: 12, surahNumber: 11, surahName: 'Hud', recommendedAyahs: 'Ayat 25 - 32', description: 'Kisah bahtera Nabi Nuh & janji Allah yang pasti' },
  { page: 231, juz: 12, surahNumber: 11, surahName: 'Hud', recommendedAyahs: 'Ayat 84 - 90', description: 'Dakwah Nabi Syu\'aib menyeru kejujuran takaran' },
  { page: 236, juz: 12, surahNumber: 12, surahName: 'Yusuf', recommendedAyahs: 'Ayat 7 - 14', description: 'Mimpi indah Nabi Yusuf & kecemburuan saudara' },

  // Juz 13 (Pages 242 - 261)
  { page: 243, juz: 13, surahNumber: 12, surahName: 'Yusuf', recommendedAyahs: 'Ayat 64 - 70', description: 'Keikhlasan Nabi Ya\'qub & bekal saudara ke Mesir' },
  { page: 250, juz: 13, surahNumber: 13, surahName: 'Ar-Ra\'d', recommendedAyahs: 'Ayat 8 - 15', description: 'Guruh bertasbih & ketenangan hati mengingat Allah' },
  { page: 258, juz: 13, surahNumber: 14, surahName: 'Ibrahim', recommendedAyahs: 'Ayat 23 - 28', description: 'Perumpamaan kalimat tayyibah laksana pohon kokoh' },

  // Juz 14 (Pages 262 - 281)
  { page: 263, juz: 14, surahNumber: 15, surahName: 'Al-Hijr', recommendedAyahs: 'Ayat 16 - 25', description: 'Gugusan bintang pelindung langit & khazanah rezeki' },
  { page: 271, juz: 14, surahNumber: 16, surahName: 'An-Nahl', recommendedAyahs: 'Ayat 27 - 34', description: 'Balasan orang bertakwa yang dijemput malaikat sejahtera' },
  { page: 279, juz: 14, surahNumber: 16, surahName: 'An-Nahl', recommendedAyahs: 'Ayat 90 - 97', description: 'Keadilan, ihsan, menepati janji, & pahala amal saleh' },

  // Juz 15 (Pages 282 - 301)
  { page: 283, juz: 15, surahNumber: 17, surahName: 'Al-Isra', recommendedAyahs: 'Ayat 9 - 17', description: 'Al-Qur\'an pembawa petunjuk lurus & kitab amal manusia' },
  { page: 285, juz: 15, surahNumber: 17, surahName: 'Al-Isra', recommendedAyahs: 'Ayat 23 - 29', description: 'Berbakti kepada kedua orang tua & larangan mubazir' },
  { page: 294, juz: 15, surahNumber: 18, surahName: 'Al-Kahf', recommendedAyahs: 'Ayat 10 - 17', description: 'Doa pemuda Ashabul Kahfi & perlindungan di dalam gua' },

  // Juz 16 (Pages 302 - 321)
  { page: 304, juz: 16, surahNumber: 18, surahName: 'Al-Kahf', recommendedAyahs: 'Ayat 99 - 110', description: 'Tiupon sangkakala & keutamaan amal ikhlas di akhir Kahf' },
  { page: 307, juz: 16, surahNumber: 19, surahName: 'Maryam', recommendedAyahs: 'Ayat 16 - 26', description: 'Kelahiran Nabi Isa putra Maryam dengan mukjizat Ilahi' },
  { page: 313, juz: 16, surahNumber: 20, surahName: 'Ta-Ha', recommendedAyahs: 'Ayat 13 - 24', description: 'Panggilan suci lembah Thuwa kepada Nabi Musa' },

  // Juz 17 (Pages 322 - 341)
  { page: 324, juz: 17, surahNumber: 21, surahName: 'Al-Anbiya', recommendedAyahs: 'Ayat 30 - 36', description: 'Langit dan bumi menyatu lalu dipisahkan & air kehidupan' },
  { page: 331, juz: 17, surahNumber: 21, surahName: 'Al-Anbiya', recommendedAyahs: 'Ayat 83 - 92', description: 'Doa Nabi Ayyub, Yunus, & Zakariya yang dikabulkan' },
  { page: 335, juz: 17, surahNumber: 22, surahName: 'Al-Hajj', recommendedAyahs: 'Ayat 24 - 30', description: 'Seruan ibadah haji ke Baitullah & mengagungkan syiar' },

  // Juz 18 (Pages 342 - 361)
  { page: 342, juz: 18, surahNumber: 23, surahName: 'Al-Mu\'minun', recommendedAyahs: 'Ayat 1 - 11', description: 'Sifat-sifat orang beriman pewaris surga Firdaus' },
  { page: 351, juz: 18, surahNumber: 24, surahName: 'An-Nur', recommendedAyahs: 'Ayat 35 - 38', description: 'Ayat Cahaya (Ayatun-Nur) laksana pelita dalam kaca jernih' },
  { page: 360, juz: 18, surahNumber: 25, surahName: 'Al-Furqan', recommendedAyahs: 'Ayat 1 - 9', description: 'Maha Berkah Allah yang menurunkan Al-Furqan pembeda' },

  // Juz 19 (Pages 362 - 381)
  { page: 365, juz: 19, surahNumber: 25, surahName: 'Al-Furqan', recommendedAyahs: 'Ayat 61 - 70', description: 'Ciri-ciri luhur hamba Allah Yang Maha Pengasih (Ibadurrahman)' },
  { page: 370, juz: 19, surahNumber: 26, surahName: 'Ash-Shu\'ara', recommendedAyahs: 'Ayat 69 - 89', description: 'Doa Nabi Ibrahim mengharap hati yang bersih (Qalbun Salim)' },
  { page: 378, juz: 19, surahNumber: 27, surahName: 'An-Naml', recommendedAyahs: 'Ayat 15 - 22', description: 'Syukur Nabi Dawud & Sulaiman yang memahami bahasa burung' },
];

/**
 * Returns a randomized balanced recitation passage from Juz 2 to 19 (Pages 22 - 381)
 */
export function getRandomBalancedMaqra(): BalancedMaqra {
  const randomIndex = Math.floor(Math.random() * BALANCED_PAGES_JUZ_2_19.length);
  return BALANCED_PAGES_JUZ_2_19[randomIndex];
}

/**
 * Helper to get a random page strictly between 22 and 381
 */
export function getRandomPageJuz2to19(): number {
  const min = 22;
  const max = 381;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
