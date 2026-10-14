import React, { useRef, useEffect, useState } from 'react';
import { ReciterId, AyahData, ReaderSettings } from '../types/quran';
import { RECITERS_LIST } from '../data/tajwidRules';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Gauge,
  User,
  ChevronUp,
  ChevronDown,
  Repeat,
} from 'lucide-react';

interface AudioPlayerProps {
  currentAyah: AyahData | null;
  currentSurahName: string;
  currentSurahNumber: number;
  totalAyahsInSurah: number;
  settings: ReaderSettings;
  onUpdateSettings: (updater: (prev: ReaderSettings) => ReaderSettings) => void;
  onAyahChange: (ayahNumber: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentAyah,
  currentSurahName,
  currentSurahNumber,
  totalAyahsInSurah,
  settings,
  onUpdateSettings,
  onAyahChange,
  isPlaying,
  setIsPlaying,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | '1x' | '3x'>('none');
  const [repeatCounter, setRepeatCounter] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReciters, setShowReciters] = useState(false);

  // Sync audio source when current ayah or reciter changes
  useEffect(() => {
    if (!currentAyah || !audioRef.current) return;

    audioRef.current.src = currentAyah.audioUrl;
    audioRef.current.playbackRate = settings.playbackSpeed;

    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Playback error:', err);
        setIsPlaying(false);
      });
    }

    // Auto-scroll to active ayah if enabled
    if (settings.autoScroll) {
      const el = document.getElementById(`ayah-${currentAyah.numberInSurah}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentAyah, settings.reciter, currentAyah?.numberInSurah]);

  // Handle Play/Pause toggle
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch((err) => {
        console.warn('Play error:', err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Handle playback rate change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = settings.playbackSpeed;
    }
  }, [settings.playbackSpeed]);

  const handleEnded = () => {
    if (!currentAyah) return;

    if (repeatMode === '1x' && repeatCounter < 1) {
      setRepeatCounter((c) => c + 1);
      audioRef.current?.play();
      return;
    }
    if (repeatMode === '3x' && repeatCounter < 2) {
      setRepeatCounter((c) => c + 1);
      audioRef.current?.play();
      return;
    }

    // Reset repeat counter for next verse
    setRepeatCounter(0);

    // Continuous recitation: proceed to next ayah
    if (currentAyah.numberInSurah < totalAyahsInSurah) {
      onAyahChange(currentAyah.numberInSurah + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (!currentAyah) return;
    if (currentAyah.numberInSurah > 1) {
      onAyahChange(currentAyah.numberInSurah - 1);
    }
  };

  const handleNext = () => {
    if (!currentAyah) return;
    if (currentAyah.numberInSurah < totalAyahsInSurah) {
      onAyahChange(currentAyah.numberInSurah + 1);
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25];
    const nextIdx = (speeds.indexOf(settings.playbackSpeed) + 1) % speeds.length;
    onUpdateSettings((prev) => ({ ...prev, playbackSpeed: speeds[nextIdx] }));
  };

  const cycleRepeat = () => {
    const modes: Array<'none' | '1x' | '3x'> = ['none', '1x', '3x'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    setRepeatMode(modes[nextIdx]);
    setRepeatCounter(0);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const activeReciter = RECITERS_LIST.find((r) => r.id === settings.reciter) || RECITERS_LIST[0];

  if (!currentAyah) return null;

  return (
    <>
      <audio
        ref={audioRef}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={handleEnded}
      />

      <div className="fixed bottom-0 inset-x-0 z-40 p-2 sm:p-4 pointer-events-none">
        <div className="max-w-4xl mx-auto rounded-2xl liquid-glass-dark border border-white/20 shadow-2xl pointer-events-auto transition-all backdrop-blur-2xl">
          {/* Progress hairline bar */}
          <div
            className="w-full bg-white/10 h-1 rounded-t-2xl overflow-hidden cursor-pointer"
            onClick={(e) => {
              if (!audioRef.current || !duration) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const pos = (e.clientX - rect.left) / rect.width;
              audioRef.current.currentTime = pos * duration;
            }}
          >
            <div
              className="bg-amber-500 h-full transition-all"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            />
          </div>

          <div className="px-4 py-3 flex items-center justify-between gap-3 sm:gap-6">
            {/* Left: Ayah & Surah identity */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                {currentAyah.numberInSurah}
              </div>
              <div className="truncate">
                <div className="text-sm font-semibold text-white truncate flex items-center gap-2">
                  <span>QS. {currentSurahName}</span>
                  <span className="text-xs text-amber-400 font-sans">
                    : Ayat {currentAyah.numberInSurah}/{totalAyahsInSurah}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate flex items-center gap-1.5 font-sans">
                  <span>{activeReciter.name}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] text-emerald-400">{activeReciter.style.split(' ')[0]}</span>
                </div>
              </div>
            </div>

            {/* Center: Main Playback Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={handlePrev}
                disabled={currentAyah.numberInSurah <= 1}
                className="p-2 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                title="Ayat Sebelumnya"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer font-bold"
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={currentAyah.numberInSurah >= totalAyahsInSurah}
                className="p-2 rounded-lg text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
                title="Ayat Berikutnya"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Right: Audio Utility controls (Speed, Repeat, Reciter) */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Playback speed toggle */}
              <button
                onClick={cycleSpeed}
                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/15 text-xs text-amber-300 font-semibold border border-white/10 transition-colors cursor-pointer"
                title="Kecepatan Audio (0.75x ideal untuk latihan tajwid)"
              >
                {settings.playbackSpeed}x
              </button>

              {/* Repeat Mode */}
              <button
                onClick={cycleRepeat}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-md text-xs border transition-colors flex items-center gap-1 cursor-pointer ${
                  repeatMode !== 'none'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Ulangi Ayat (Latihan Tahsin/Hafalan)"
              >
                <Repeat className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {repeatMode === 'none' ? 'Normal' : repeatMode}
                </span>
              </button>

              {/* Reciter Selector Trigger */}
              <div className="relative">
                <button
                  onClick={() => setShowReciters(!showReciters)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 transition-colors cursor-pointer"
                  title="Pilih Qari / Pelafal"
                >
                  <User className="w-4 h-4" />
                </button>

                {showReciters && (
                  <div className="absolute right-0 bottom-full mb-3 w-64 p-2 rounded-xl liquid-glass-dark border border-white/20 shadow-2xl text-xs space-y-1 z-50">
                    <div className="px-2 py-1 font-semibold text-slate-400 uppercase text-[10px] tracking-wider">
                      Pilihan Qari Internasional
                    </div>
                    {RECITERS_LIST.map((reciter) => (
                      <button
                        key={reciter.id}
                        onClick={() => {
                          onUpdateSettings((prev) => ({ ...prev, reciter: reciter.id }));
                          setShowReciters(false);
                        }}
                        className={`w-full text-left p-2 rounded-lg transition-all flex flex-col ${
                          settings.reciter === reciter.id
                            ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30'
                            : 'hover:bg-white/10 text-slate-300'
                        }`}
                      >
                        <span className="font-medium text-white">{reciter.name}</span>
                        <span className="text-[10px] text-slate-400">{reciter.style}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
