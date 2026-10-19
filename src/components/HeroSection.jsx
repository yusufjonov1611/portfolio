import React, { useState, useEffect } from "react";
import { Terminal, Lock, Binary, Code2, Sparkles, ArrowRight } from "lucide-react";
import CyberCanvas3D from "./CyberCanvas3D";
import { soundFX } from "../utils/audio";
import { translations } from "../data/translations";

export default function HeroSection({ profileData, currentTheme, lang = "uz", onPageChange }) {
  const [pulseCount, setPulseCount] = useState(0);
  const [typedTitle, setTypedTitle] = useState("");

  const t = translations[lang] || translations.uz;
  const fullTitle = t.hero.role || profileData.personal.title;

  useEffect(() => {
    let i = 0;
    setTypedTitle("");
    const timer = setInterval(() => {
      if (i < fullTitle.length) {
        setTypedTitle(fullTitle.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [fullTitle]);

  const handleCorePulse = () => {
    setPulseCount((prev) => prev + 1);
  };

  return (
    <section id="hero" className="relative pt-6 pb-16 px-4 max-w-7xl mx-auto overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[580px]">
        {/* Left Column: Text & Telemetry */}
        <div className="lg:col-span-7 space-y-6 z-10">
          {/* Security Clearance Pill */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#121620] border border-emerald-500/30 text-emerald-400 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span className="font-bold tracking-wider">{t.hero.clearance}</span>
          </div>

          {/* Glitch Identity Header */}
          <div>
            <div className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-1">
              {t.hero.identity}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-mono tracking-tight flex items-baseline flex-wrap">
              <span className="text-emerald-400 mr-2">&gt;</span>
              <span className="relative inline-block hover:text-emerald-300 transition duration-300">
                {profileData.personal.handle}
              </span>
            </h1>
            <div className="text-sm font-mono text-gray-400 mt-1">
              [ {profileData.personal.realName} ]
            </div>
          </div>

          {/* Typing dynamic subtitle */}
          <div className="h-8 flex items-center font-mono text-lg sm:text-xl text-cyan-400">
            <span className="font-semibold">{typedTitle}</span>
            <span className="w-2 h-5 bg-cyan-400 ml-1 animate-pulse" />
          </div>

          {/* Bio paragraph */}
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans bg-[#0c0e14]/60 p-4 rounded-lg border border-gray-800/80 backdrop-blur-sm">
            {t.hero.bio}
          </p>

          {/* Live System Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono">
            <div className="bg-[#0e1119] border border-gray-800/80 hover:border-emerald-500/40 p-3 rounded-lg transition group">
              <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition">
                120+
              </div>
              <div className="text-[11px] text-gray-400 uppercase mt-0.5 tracking-wider truncate">
                {t.hero.stats.ctf}
              </div>
            </div>

            <div className="bg-[#0e1119] border border-gray-800/80 hover:border-emerald-500/40 p-3 rounded-lg transition group">
              <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition">
                25+
              </div>
              <div className="text-[11px] text-gray-400 uppercase mt-0.5 tracking-wider truncate">
                {t.hero.stats.scripts}
              </div>
            </div>

            <div className="bg-[#0e1119] border border-gray-800/80 hover:border-emerald-500/40 p-3 rounded-lg transition group">
              <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition">
                18+
              </div>
              <div className="text-[11px] text-gray-400 uppercase mt-0.5 tracking-wider truncate">
                {t.hero.stats.repos}
              </div>
            </div>

            <div className="bg-[#0e1119] border border-gray-800/80 hover:border-emerald-500/40 p-3 rounded-lg transition group">
              <div className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition">
                100%
              </div>
              <div className="text-[11px] text-gray-400 uppercase mt-0.5 tracking-wider truncate">
                {t.hero.stats.defended}
              </div>
            </div>
          </div>

          {/* CTA Action Buttons: Navigate to pages directly */}
          <div className="flex flex-wrap items-center gap-3 pt-2 font-mono text-xs">
            <button
              onClick={() => {
                if (onPageChange) onPageChange("terminal");
                soundFX.playClick();
              }}
              className="px-5 py-3 rounded-md bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center space-x-2 transition shadow-lg shadow-emerald-500/20"
            >
              <Terminal className="w-4 h-4" />
              <span>{t.hero.openTerminal}</span>
            </button>

            <button
              onClick={() => {
                if (onPageChange) onPageChange("projects");
                soundFX.playClick();
              }}
              className="px-5 py-3 rounded-md bg-[#161a24] hover:bg-[#1e2330] text-gray-200 border border-gray-700 hover:border-emerald-500/40 font-bold flex items-center space-x-2 transition"
            >
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>{t.hero.cyberProjects}</span>
            </button>

            <button
              onClick={() => {
                if (onPageChange) onPageChange("contact");
                soundFX.playClick();
              }}
              className="px-4 py-3 rounded-md bg-[#10131c] hover:bg-[#161922] text-gray-400 hover:text-white border border-gray-800 font-bold flex items-center space-x-2 transition"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>{t.hero.pgpContact}</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Cyber Core Canvas */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="w-full h-[440px] sm:h-[500px] rounded-2xl bg-gradient-to-b from-[#0f131c]/40 to-[#080a0f]/80 border border-emerald-500/20 relative overflow-hidden backdrop-blur-sm shadow-2xl">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* 3D Canvas */}
            <CyberCanvas3D theme={currentTheme} onCoreClick={handleCorePulse} />

            {/* Hologram Corner Labels */}
            <div className="absolute top-3 left-3 bg-black/60 px-2.5 py-1 rounded border border-gray-800 text-[10px] font-mono text-gray-400 flex items-center space-x-1.5">
              <Binary className="w-3 h-3 text-emerald-400" />
              <span>{t.hero.nodePulses}: {pulseCount}</span>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/60 px-2.5 py-1 rounded border border-gray-800 text-[10px] font-mono text-cyan-400">
              {t.hero.encryption}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
