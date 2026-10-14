import React, { useState, useRef, useEffect } from 'react';
import {
  Student,
  INITIAL_STUDENTS_LIST,
  BalancedMaqra,
  getRandomBalancedMaqra,
  BALANCED_PAGES_JUZ_2_19,
} from '../data/classroomStudents';
import {
  X,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Shuffle,
  Volume2,
} from 'lucide-react';

interface ClassroomWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPageAndSurah: (surahNumber: number, targetAyahNumber?: number, targetPage?: number) => void;
}

export const ClassroomWheelModal: React.FC<ClassroomWheelModalProps> = ({
  isOpen,
  onClose,
  onOpenPageAndSurah,
}) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('al_quran_classroom_students_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_STUDENTS_LIST;
  });

  const [activeTab, setActiveTab] = useState<'wheel' | 'roster'>('wheel');
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedMaqra, setSelectedMaqra] = useState<BalancedMaqra | null>(null);
  const [rotationAngle, setRotationAngle] = useState(0);

  // Filter students who haven't read yet for the wheel
  const availableStudents = useMemoStudents(students);

  // Audio Context Synthesizer for tick and win sounds
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTickSound = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Fallback
    }
  };

  const playFanfare = () => {
    try {
      const ctx = getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.45);
      });
    } catch {
      // Fallback
    }
  };

  // Save student status
  const updateStudents = (newStudents: Student[]) => {
    setStudents(newStudents);
    try {
      localStorage.setItem('al_quran_classroom_students_v1', JSON.stringify(newStudents));
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetRoster = () => {
    if (window.confirm('Reset status tilawah semua 24 siswa untuk sesi baru?')) {
      const reset = students.map((s) => ({
        ...s,
        hasRead: false,
        assignedPage: undefined,
        assignedSurah: undefined,
        assignedAyahs: undefined,
        readAt: undefined,
      }));
      updateStudents(reset);
      setSelectedStudent(null);
      setSelectedMaqra(null);
    }
  };

  // Execute Spin
  const spinWheel = () => {
    if (isSpinning) return;

    const pool = availableStudents.length > 0 ? availableStudents : students;
    if (pool.length === 0) return;

    setIsSpinning(true);
    setSelectedStudent(null);
    setSelectedMaqra(null);

    // Pick random student and random balanced maqra
    const chosenStudentIndex = Math.floor(Math.random() * pool.length);
    const chosenStudent = pool[chosenStudentIndex];
    const chosenMaqra = getRandomBalancedMaqra();

    // Calculate rotation: 5 full turns (1800 deg) + target slice offset
    const sliceAngle = 360 / pool.length;
    const targetOffset = 360 - (chosenStudentIndex * sliceAngle + sliceAngle / 2);
    const totalExtraTurns = 360 * 6; // 6 spins
    const targetRotation = rotationAngle + totalExtraTurns + targetOffset;

    // Trigger tick sound intervals
    let tickCount = 0;
    const maxTicks = 24;
    const tickInterval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount >= maxTicks) {
        clearInterval(tickInterval);
      }
    }, 140);

    setRotationAngle(targetRotation);

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setSelectedStudent(chosenStudent);
      setSelectedMaqra(chosenMaqra);
      playFanfare();

      // Mark student as assigned/read
      const updated = students.map((s) =>
        s.id === chosenStudent.id
          ? {
              ...s,
              hasRead: true,
              assignedPage: chosenMaqra.page,
              assignedSurah: chosenMaqra.surahName,
              assignedAyahs: chosenMaqra.recommendedAyahs,
              readAt: Date.now(),
            }
          : s
      );
      updateStudents(updated);
    }, 3800);
  };

  const handleOpenSelectedVerse = () => {
    if (!selectedMaqra) return;
    onOpenPageAndSurah(selectedMaqra.surahNumber, 1, selectedMaqra.page);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl liquid-glass-dark border border-white/20 shadow-2xl overflow-hidden flex flex-col text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold shadow-md">
              <Shuffle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-oxford tracking-wide text-white flex items-center gap-2">
                <span>Roda Putar Tilawah Kelas (24 Siswa)</span>
                <span className="text-xs font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Juz 2 - 19
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-sans">
                Undian giliran siswa acak & penugasan halaman maqra' berimbang (panjang pas & tidak melelahkan)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'wheel' ? 'roster' : 'wheel')}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-slate-200 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{activeTab === 'wheel' ? 'Daftar 24 Siswa' : 'Ke Roda Putar'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 1. WHEEL TAB */}
        {activeTab === 'wheel' ? (
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto p-4 sm:p-6 gap-6 items-center">
            {/* Left: The Spinning Wheel Canvas */}
            <div className="md:col-span-7 flex flex-col items-center justify-center relative py-4">
              {/* Wheel Container with Pointer Pin */}
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
                {/* Pointer / Flapper at top */}
                <div className="absolute -top-3 z-30 left-1/2 -translate-x-1/2 w-6 h-8 flex flex-col items-center drop-shadow-md">
                  <div className="w-0 h-0 border-x-[10px] border-x-transparent border-t-[18px] border-t-amber-400" />
                </div>

                {/* Rotating SVG Wheel */}
                <div
                  className="w-full h-full rounded-full border-4 border-amber-500/40 shadow-2xl relative overflow-hidden transition-transform ease-out"
                  style={{
                    transform: `rotate(${rotationAngle}deg)`,
                    transitionDuration: isSpinning ? '3.8s' : '0s',
                    transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.32, 1)',
                  }}
                >
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {(() => {
                      const list = availableStudents.length > 0 ? availableStudents : students;
                      const count = list.length;
                      const sliceAngle = 360 / count;
                      const colors = [
                        '#d97706', '#0d9488', '#2563eb', '#8b5cf6',
                        '#e11d48', '#059669', '#ca8a04', '#0284c7',
                        '#7c3aed', '#db2777', '#16a34a', '#d97706',
                      ];

                      return list.map((student, i) => {
                        const startAngle = (i * sliceAngle * Math.PI) / 180;
                        const endAngle = ((i + 1) * sliceAngle * Math.PI) / 180;
                        const x1 = 50 + 50 * Math.cos(startAngle);
                        const y1 = 50 + 50 * Math.sin(startAngle);
                        const x2 = 50 + 50 * Math.cos(endAngle);
                        const y2 = 50 + 50 * Math.sin(endAngle);
                        const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                        // Midpoint for text
                        const midAngle = ((i + 0.5) * sliceAngle * Math.PI) / 180;
                        const tx = 50 + 32 * Math.cos(midAngle);
                        const ty = 50 + 32 * Math.sin(midAngle);
                        const rotationDeg = (i + 0.5) * sliceAngle;

                        return (
                          <g key={student.id}>
                            <path
                              d={pathData}
                              fill={colors[i % colors.length]}
                              opacity={0.88}
                              stroke="#0f172a"
                              strokeWidth="0.75"
                            />
                            <text
                              x={tx}
                              y={ty}
                              fill="#ffffff"
                              fontSize={count > 16 ? '2.8' : '3.6'}
                              fontWeight="bold"
                              textAnchor="middle"
                              dominantBaseline="central"
                              transform={`rotate(${rotationDeg + 90}, ${tx}, ${ty})`}
                            >
                              {student.name.slice(0, 8)}
                            </text>
                          </g>
                        );
                      });
                    })()}
                  </svg>

                  {/* Glass Center Hub */}
                  <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-slate-950 border-2 border-amber-400 flex items-center justify-center shadow-lg pointer-events-none">
                    <span className="font-arabic text-amber-300 text-lg font-bold">قرآن</span>
                  </div>
                </div>
              </div>

              {/* Spin Trigger Button */}
              <div className="mt-6 flex flex-col items-center gap-2">
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2.5 ${
                    isSpinning
                      ? 'bg-amber-600/40 text-amber-200 cursor-not-allowed animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 active:scale-95 shadow-amber-500/25'
                  }`}
                >
                  <Shuffle className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>{isSpinning ? 'Sedang Memutar Roda...' : 'Putar Roda Tilawah (Spin Wheel)'}</span>
                </button>

                <div className="text-[11px] text-slate-400 font-sans">
                  Sisa antrean: <strong className="text-amber-300">{availableStudents.length}</strong> dari 24 siswa
                </div>
              </div>
            </div>

            {/* Right: Outcome Result Card & Info */}
            <div className="md:col-span-5 flex flex-col justify-center space-y-4">
              {selectedStudent && selectedMaqra ? (
                <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/20 via-black/40 to-black/60 border border-amber-500/40 shadow-xl animate-in zoom-in-95 duration-300">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-amber-500/30">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400" />
                      <span className="text-xs uppercase tracking-wider font-bold text-amber-300">
                        Giliran Terpilih
                      </span>
                    </div>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                      Juz {selectedMaqra.juz}
                    </span>
                  </div>

                  {/* Student Name */}
                  <div className="mb-4">
                    <div className="text-xs text-slate-400">Nama Siswa:</div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {selectedStudent.name}
                    </div>
                  </div>

                  {/* Assigned Page & Surah */}
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Halaman Mushaf:</span>
                      <span className="text-base font-bold text-amber-300">
                        Halaman {selectedMaqra.page}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">Surah & Ayat:</span>
                      <span className="text-sm font-semibold text-white">
                        QS. {selectedMaqra.surahName} ({selectedMaqra.recommendedAyahs})
                      </span>
                    </div>

                    <div className="pt-2 border-t border-white/10 text-xs text-slate-300 leading-relaxed font-sans">
                      <span className="text-amber-400/90 font-medium">Karakter Maqra': </span>
                      {selectedMaqra.description}
                    </div>
                  </div>

                  {/* 1-Click Launch Button */}
                  <button
                    onClick={handleOpenSelectedVerse}
                    className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Buka Halaman {selectedMaqra.page} & Mulai Tilawah</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              ) : (
                <div className="p-6 rounded-2xl liquid-glass-dark border border-white/10 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-white">
                    Siap Memulai Sesi Tilawah?
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans max-w-sm mx-auto">
                    Klik tombol <strong>"Putar Roda Tilawah"</strong> untuk memilih siswa giliran berikutnya secara adil dan mendapatkan maqra' acak berimbang dari <strong>Juz 2 hingga 19</strong> (panjang pas, tidak kependekan dan tidak terlalu panjang).
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5 justify-center">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-slate-300">
                      24 Siswa Terdaftar
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-slate-300">
                      Hal. 22 - 381 (Juz 2-19)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-slate-300">
                      Maqra' Berimbang
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 2. ROSTER TAB (24 Students Checklist) */
          <div className="p-6 flex-1 overflow-y-auto space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <div className="text-sm font-bold text-white">
                  Daftar Presensi Tilawah (24 Siswa)
                </div>
                <div className="text-xs text-slate-400">
                  {students.filter((s) => s.hasRead).length} sudah membaca · {students.filter((s) => !s.hasRead).length} belum
                </div>
              </div>

              <button
                onClick={handleResetRoster}
                className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer w-fit"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sesi Baru</span>
              </button>
            </div>

            {/* Students Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    // Toggle manually
                    const updated = students.map((s) =>
                      s.id === student.id ? { ...s, hasRead: !s.hasRead } : s
                    );
                    updateStudents(updated);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    student.hasRead
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-white/10 text-xs flex items-center justify-center font-bold shrink-0">
                      {student.id}
                    </span>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white truncate">
                        {student.name}
                      </div>
                      {student.hasRead && student.assignedPage ? (
                        <div className="text-[10px] text-emerald-400 truncate">
                          Hal. {student.assignedPage} ({student.assignedSurah})
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400">
                          Belum tampil
                        </div>
                      )}
                    </div>
                  </div>

                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      student.hasRead ? 'text-emerald-400 fill-emerald-500/20' : 'text-slate-600'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between text-xs text-slate-400">
          <span>Standar Tilawah Kelas · Maqra' Pilihan Juz 2 s/d 19</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

function useMemoStudents(students: Student[]) {
  return React.useMemo(() => {
    return students.filter((s) => !s.hasRead);
  }, [students]);
}
