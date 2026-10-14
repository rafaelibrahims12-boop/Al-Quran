import React from 'react';

interface LiquidBackgroundProps {
  isDarkMode: boolean;
}

export const LiquidBackground: React.FC<LiquidBackgroundProps> = ({ isDarkMode }) => {
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden select-none">
      {/* Base background image with subtle blend */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-25 dark:opacity-35"
        style={{
          backgroundImage: `url('/src/assets/images/liquid_glass_ambiance_1791946107943.jpg')`,
          filter: 'blur(16px)',
          transform: 'scale(1.08)',
        }}
      />

      {/* Floating fluid liquid glass orbs */}
      <div
        className={`absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full blur-[110px] animate-liquid-1 transition-colors duration-700 ${
          isDarkMode
            ? 'bg-gradient-to-br from-emerald-600/25 via-teal-700/20 to-blue-900/30'
            : 'bg-gradient-to-br from-emerald-200/40 via-amber-200/30 to-teal-100/40'
        }`}
      />

      <div
        className={`absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full blur-[130px] animate-liquid-2 transition-colors duration-700 ${
          isDarkMode
            ? 'bg-gradient-to-tr from-amber-600/20 via-rose-700/15 to-indigo-900/25'
            : 'bg-gradient-to-tr from-amber-200/45 via-rose-100/35 to-amber-100/40'
        }`}
      />

      <div
        className={`absolute -bottom-40 left-1/4 w-[650px] h-[650px] rounded-full blur-[140px] animate-liquid-3 transition-colors duration-700 ${
          isDarkMode
            ? 'bg-gradient-to-t from-teal-800/20 via-sky-800/15 to-emerald-950/40'
            : 'bg-gradient-to-t from-emerald-100/50 via-teal-50/40 to-slate-200/40'
        }`}
      />

      {/* Fine liquid caustic grain / glass noise mask */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDarkMode
            ? 'bg-slate-950/70 backdrop-brightness-95'
            : 'bg-[#FBF9F5]/75 backdrop-brightness-105'
        }`}
      />

      {/* Delicate radial spotlight centered on content */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-black/20 dark:to-black/60" />
    </div>
  );
};
