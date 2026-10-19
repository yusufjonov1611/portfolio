import React, { useState, useEffect } from "react";
import { Terminal, Shield, Volume2, VolumeX, Eye, Radio, Globe, Wifi, Lock, Languages } from "lucide-react";
import { soundFX } from "../utils/audio";
import { translations } from "../data/translations";

export default function CyberNavbar({
  activePage,
  onPageChange,
  lang,
  onLangChange,
  currentTheme,
  onThemeChange,
  soundEnabled,
  onToggleSound,
  scanlinesEnabled,
  onToggleScanlines,
  isAuthenticated,
  onOpenAdmin
}) {
  const [time, setTime] = useState("");
  const [ping, setPing] = useState(24);

  const t = translations[lang] || translations.uz;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-GB", { hour12: false }) + " UTC+5");
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);

    const pingTimer = setInterval(() => {
      setPing(20 + Math.floor(Math.random() * 8));
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(pingTimer);
    };
  }, []);

  const navLinks = [
    { id: "home", label: `// 01. ${t.nav.home}` },
    { id: "skills", label: `// 02. ${t.nav.skills}` },
    { id: "projects", label: `// 03. ${t.nav.projects}` },
    { id: "achievements", label: `// 04. ${t.nav.achievements}` },
    { id: "terminal", label: `// 05. ${t.nav.terminal}` },
    { id: "contact", label: `// 06. ${t.nav.contact}` }
  ];

  const themes = [
    { id: "emerald", label: "EMERALD", color: "#00ff9d" },
    { id: "cyan", label: "CYAN", color: "#00e5ff" },
    { id: "crimson", label: "CRIMSON", color: "#ff3366" },
    { id: "monochrome", label: "SLATE", color: "#94a3b8" }
  ];

  const languages = [
    { code: "uz", label: "UZ", title: "O'zbekcha" },
    { code: "ru", label: "RU", title: "Русский" },
    { code: "en", label: "EN", title: "English" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#090b0e]/95 backdrop-blur-md border-b border-[#1f2430]">
      {/* Top telemetry & controls bar */}
      <div className="border-b border-[#181c26] px-4 py-1.5 flex items-center justify-between text-[11px] font-mono text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-emerald-400">
            <Radio className="w-3 h-3 animate-pulse" />
            <span className="font-bold tracking-wider">{t.nav.defcon}</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1">
            <Wifi className="w-3 h-3 text-cyan-400" />
            <span>PING: {ping}ms</span>
          </div>
          <div className="hidden md:flex items-center space-x-1 text-gray-500">
            <Globe className="w-3 h-3" />
            <span>NODE: UZ-TAS-01</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <span className="text-gray-400 hidden xs:inline">{time}</span>

          {/* 3-Language Switcher (UZ / RU / EN) */}
          <div className="flex items-center bg-[#131724] border border-gray-800 rounded p-0.5 space-x-0.5">
            <Languages className="w-3 h-3 text-emerald-400 ml-1 mr-0.5 hidden xs:inline" />
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  onLangChange(l.code);
                  soundFX.playClick();
                }}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                  lang === l.code
                    ? "bg-emerald-500 text-black shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
                title={l.title}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              soundFX.playClick();
            }}
            className={`p-1 rounded flex items-center space-x-1 transition ${
              soundEnabled ? "text-emerald-400 hover:bg-emerald-500/10" : "text-gray-600 hover:bg-gray-800"
            }`}
            title="Ovoz effektlarini yoqish/o'chirish"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[10px] hidden md:inline">{soundEnabled ? t.nav.audioOn : t.nav.audioOff}</span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              onToggleScanlines();
              soundFX.playClick();
            }}
            className={`p-1 rounded flex items-center space-x-1 transition ${
              scanlinesEnabled ? "text-cyan-400 hover:bg-cyan-500/10" : "text-gray-600 hover:bg-gray-800"
            }`}
            title="CRT Scanlines overlay filtri"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden md:inline">{t.nav.crtFx}</span>
          </button>

          {/* Discreet Admin indicator: ONLY visible when admin is ALREADY authenticated */}
          {isAuthenticated && (
            <button
              onClick={() => {
                onOpenAdmin();
                soundFX.playClick();
              }}
              className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 flex items-center space-x-1 transition text-[10px] font-bold"
              title="Admin boshqaruv panelini ochish"
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>{t.nav.adminActive}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand: UWP */}
        <button
          onClick={() => {
            if (onPageChange) onPageChange("home");
            soundFX.playClick();
          }}
          className="flex items-center space-x-2 text-white font-mono tracking-wider group text-left"
        >
          <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500/20 to-cyan-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400 transition">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-base font-extrabold flex items-center tracking-widest">
              <span className="text-white">UWP</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1.5 animate-pulse" />
            </div>
            <div className="text-[9px] text-gray-500 font-mono tracking-widest uppercase">
              {t.nav.subBrand}
            </div>
          </div>
        </button>

        {/* Dedicated Page Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-2 font-mono text-xs">
          {navLinks.map((link) => {
            const isActive = activePage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  if (onPageChange) onPageChange(link.id);
                  soundFX.playClick();
                }}
                className={`px-3 py-1.5 rounded-md transition tracking-wider duration-150 flex items-center space-x-1 ${
                  isActive
                    ? "bg-emerald-500/15 border border-emerald-500/50 text-emerald-300 font-bold shadow-sm shadow-emerald-500/10"
                    : "text-gray-400 hover:text-emerald-400 hover:bg-gray-800/40"
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Theme Picker */}
        <div className="flex items-center space-x-1 bg-[#12151e] p-1 rounded-md border border-[#232733]">
          {themes.map((th) => (
            <button
              key={th.id}
              onClick={() => {
                onThemeChange(th.id);
                soundFX.playClick();
              }}
              className={`w-5 h-5 rounded-sm transition flex items-center justify-center ${
                currentTheme === th.id
                  ? "ring-1 ring-white scale-110 shadow-sm"
                  : "opacity-60 hover:opacity-100"
              }`}
              style={{ backgroundColor: th.color }}
              title={`Theme: ${th.label}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile Page Navigation Bar */}
      <div className="lg:hidden border-t border-gray-800/80 bg-[#0b0d14] px-3 py-1.5 flex items-center space-x-1 overflow-x-auto text-[11px] font-mono">
        {navLinks.map((link) => {
          const isActive = activePage === link.id;
          return (
            <button
              key={link.id}
              onClick={() => {
                if (onPageChange) onPageChange(link.id);
                soundFX.playClick();
              }}
              className={`px-2.5 py-1 rounded whitespace-nowrap transition ${
                isActive
                  ? "bg-emerald-500 text-black font-bold"
                  : "text-gray-400 hover:text-white bg-[#141824]"
              }`}
            >
              {link.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
