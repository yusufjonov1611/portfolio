import React, { useState, useEffect } from "react";
import { initialProfileData } from "./data/profileData";
import CyberNavbar from "./components/CyberNavbar";
import HeroSection from "./components/HeroSection";
import SkillsSection from "./components/SkillsSection";
import ProjectsSection from "./components/ProjectsSection";
import AchievementsSection from "./components/AchievementsSection";
import TerminalCLI from "./components/TerminalCLI";
import ContactSection from "./components/ContactSection";
import CyberFooter from "./components/CyberFooter";
import MatrixRainCanvas from "./components/MatrixRainCanvas";
import AdminPanel from "./components/AdminPanel";
import { soundFX } from "./utils/audio";
import { translations } from "./data/translations";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";

export default function App() {
  const [profileData] = useState(() => {
    const saved = localStorage.getItem("cyber_portfolio_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialProfileData;
      }
    }
    return initialProfileData;
  });

  // Active page: 'home' | 'skills' | 'projects' | 'achievements' | 'terminal' | 'contact' | 'all'
  const [activePage, setActivePage] = useState(() => {
    const hash = window.location.hash.replace("#/", "").replace("#", "");
    if (["home", "skills", "projects", "achievements", "terminal", "contact", "all"].includes(hash)) {
      return hash;
    }
    return "home";
  });

  // Language: 'uz' | 'ru' | 'en'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("uwp_lang") || "uz";
  });

  const [currentTheme, setCurrentTheme] = useState("emerald");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [scanlinesEnabled, setScanlinesEnabled] = useState(false);
  const [matrixActive, setMatrixActive] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [achievementsReload, setAchievementsReload] = useState(0);
  const [securityWarning, setSecurityWarning] = useState("");

  const t = translations[lang] || translations.uz;

  // Language change handler
  const handleLangChange = (newLang) => {
    setLang(newLang);
    localStorage.setItem("uwp_lang", newLang);
  };

  // Page change handler with URL hash update
  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    window.location.hash = `#/${pageId}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Synchronize with URL hash changes and verify session
  useEffect(() => {
    // 1. Verify admin token with backend
    const token = localStorage.getItem("cyber_admin_token");
    if (token) {
      fetch("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.authenticated) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("cyber_admin_token");
            setIsAuthenticated(false);
          }
        })
        .catch(() => {});
    }

    // 2. Hash change listener for routing
    const onHashChange = () => {
      const hash = window.location.hash.replace("#/", "").replace("#", "");
      if (hash === "admin") {
        setIsAdminOpen(true);
      } else if (["home", "skills", "projects", "achievements", "terminal", "contact", "all"].includes(hash)) {
        setActivePage(hash);
      }
    };
    window.addEventListener("hashchange", onHashChange);

    // 3. Security listeners: Block Ctrl+U, F12, DevTools shortcuts, and right-click
    const triggerSecurityAlert = (msg) => {
      setSecurityWarning(msg);
      soundFX.playAlert();
      setTimeout(() => setSecurityWarning(""), 2800);
    };

    const handleKeyDown = (e) => {
      // Secret Admin shortcut: Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
        soundFX.playClick();
        return;
      }

      // Block Ctrl + U (View Page Source)
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) {
        e.preventDefault();
        triggerSecurityAlert("[ACCESS DENIED] SOURCE INSPECTION RESTRICTED // DEFCON-1");
        return;
      }

      // Block F12 and Ctrl + Shift + I/J/C (Developer Tools)
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key))
      ) {
        e.preventDefault();
        triggerSecurityAlert("[SECURITY ALERT] DEVTOOLS INSPECTION RESTRICTED");
        return;
      }

      // Block Ctrl + S (Save Page)
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        triggerSecurityAlert("[BLOCKED] PAGE SAVE ATTEMPT LOGGED");
        return;
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerSecurityAlert("[SECURITY PROTOCOL] CONTEXT MENU RESTRICTED // DEFCON-1");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFX.toggle(nextState);
  };

  const getThemeColor = () => {
    switch (currentTheme) {
      case "cyan":
        return "#00e5ff";
      case "crimson":
        return "#ff3366";
      case "monochrome":
        return "#94a3b8";
      case "emerald":
      default:
        return "#00ff9d";
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-slate-200 relative selection:bg-emerald-500 selection:text-black font-mono">
      {/* Matrix Falling Rain Background */}
      <MatrixRainCanvas active={matrixActive} opacity={0.16} color={getThemeColor()} />

      {/* Optional CRT Scanlines Filter Overlay */}
      {scanlinesEnabled && (
        <div className="fixed inset-0 pointer-events-none z-50 crt-scanlines opacity-75" />
      )}

      {/* Main Top Navbar with UWP Brand & 3-Language Switcher */}
      <CyberNavbar
        activePage={activePage}
        onPageChange={handlePageChange}
        lang={lang}
        onLangChange={handleLangChange}
        currentTheme={currentTheme}
        onThemeChange={(theme) => setCurrentTheme(theme)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
        isAuthenticated={isAuthenticated}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Security alert notification (Ctrl+U / F12 / ContextMenu blocked) */}
      {securityWarning && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-red-950/90 border border-red-500/80 text-red-200 px-5 py-2.5 rounded-lg shadow-2xl backdrop-blur-md font-mono text-xs flex items-center space-x-2.5 animate-pulse">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping inline-block" />
          <span className="font-bold tracking-wider">{securityWarning}</span>
        </div>
      )}

      <main className="relative z-10 min-h-[calc(100vh-200px)]">
        {/* Breadcrumb Bar when on a subpage */}
        {activePage !== "home" && activePage !== "all" && (
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between text-xs text-gray-500 font-mono">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange("home")}
                className="hover:text-emerald-400 flex items-center space-x-1 text-gray-400 transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>UWP / {t.nav.home}</span>
              </button>
              <ChevronRight className="w-3 h-3 text-gray-600" />
              <span className="text-emerald-400 font-bold uppercase tracking-wider">
                {activePage}
              </span>
            </div>

            <button
              onClick={() => handlePageChange("home")}
              className="text-gray-400 hover:text-white flex items-center space-x-1 hover:underline text-[11px]"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>{t.nav.home}</span>
            </button>
          </div>
        )}

        {/* --- PAGE 1: HOME (Hero + 3D Core + Quick Overview) --- */}
        {activePage === "home" && (
          <div>
            <HeroSection
              profileData={profileData}
              currentTheme={currentTheme}
              lang={lang}
              onPageChange={handlePageChange}
            />

            {/* Quick Navigation Cards on Home */}
            <div className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <button
                onClick={() => handlePageChange("skills")}
                className="p-4 rounded-xl bg-[#0e111a] border border-gray-800 hover:border-emerald-500/50 text-left transition group"
              >
                <div className="text-xs text-emerald-400 font-bold mb-1">// 01</div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                  {t.nav.skills}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Linux, Python, OWASP, Burp, Nmap</div>
              </button>

              <button
                onClick={() => handlePageChange("projects")}
                className="p-4 rounded-xl bg-[#0e111a] border border-gray-800 hover:border-cyan-500/50 text-left transition group"
              >
                <div className="text-xs text-cyan-400 font-bold mb-1">// 02</div>
                <div className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                  {t.nav.projects}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Recon, Scanner, CryptoVault</div>
              </button>

              <button
                onClick={() => handlePageChange("achievements")}
                className="p-4 rounded-xl bg-[#0e111a] border border-gray-800 hover:border-yellow-500/50 text-left transition group"
              >
                <div className="text-xs text-yellow-400 font-bold mb-1">// 03</div>
                <div className="text-sm font-bold text-white group-hover:text-yellow-300 transition">
                  {t.nav.achievements}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">CTF, Labs, Writeups & Proofs</div>
              </button>

              <button
                onClick={() => handlePageChange("terminal")}
                className="p-4 rounded-xl bg-[#0e111a] border border-gray-800 hover:border-emerald-500/50 text-left transition group"
              >
                <div className="text-xs text-emerald-400 font-bold mb-1">// 04</div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                  {t.nav.terminal}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Interactive Console & Audit CLI</div>
              </button>

              <button
                onClick={() => handlePageChange("contact")}
                className="p-4 rounded-xl bg-[#0e111a] border border-gray-800 hover:border-emerald-500/50 text-left transition group"
              >
                <div className="text-xs text-emerald-400 font-bold mb-1">// 05</div>
                <div className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                  {t.nav.contact}
                </div>
                <div className="text-[11px] text-gray-400 mt-1">Telegram, PGP Key & AES Form</div>
              </button>
            </div>
          </div>
        )}

        {/* --- PAGE 2: SKILLS --- */}
        {(activePage === "skills" || activePage === "all") && (
          <SkillsSection profileData={profileData} lang={lang} />
        )}

        {/* --- PAGE 3: PROJECTS --- */}
        {(activePage === "projects" || activePage === "all") && (
          <ProjectsSection profileData={profileData} lang={lang} />
        )}

        {/* --- PAGE 4: ACHIEVEMENTS (CRUD) --- */}
        {(activePage === "achievements" || activePage === "all") && (
          <AchievementsSection
            isAuthenticated={isAuthenticated}
            onOpenAdmin={() => setIsAdminOpen(true)}
            reloadTrigger={achievementsReload}
            lang={lang}
          />
        )}

        {/* --- PAGE 5: TERMINAL --- */}
        {(activePage === "terminal" || activePage === "all") && (
          <section id="terminal" className="py-12 px-4 max-w-7xl mx-auto border-t border-gray-800/80">
            <div className="mb-6">
              <div className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-1">
                {t.terminal.tagline}
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-center">
                <span className="text-emerald-400 mr-2">&gt;_</span>
                <span>{t.terminal.title}</span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-2xl font-mono">
                {t.terminal.desc}
              </p>
            </div>

            <TerminalCLI
              profileData={profileData}
              currentTheme={currentTheme}
              onThemeChange={(th) => setCurrentTheme(th)}
              onToggleMatrix={() => setMatrixActive(!matrixActive)}
              onOpenAdmin={() => setIsAdminOpen(true)}
              lang={lang}
            />
          </section>
        )}

        {/* --- PAGE 6: CONTACT --- */}
        {(activePage === "contact" || activePage === "all") && (
          <ContactSection profileData={profileData} lang={lang} />
        )}
      </main>

      {/* Cyber Footer */}
      <CyberFooter
        profileData={profileData}
        onOpenAdmin={() => setIsAdminOpen(true)}
        lang={lang}
      />

      {/* Admin Panel Modal (Full CRUD + Login/Password) */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => {
          setIsAdminOpen(false);
          if (window.location.hash.includes("admin")) {
            history.replaceState(null, "", `#/${activePage}`);
          }
        }}
        onDataUpdated={() => setAchievementsReload((prev) => prev + 1)}
        onAuthChange={(state) => setIsAuthenticated(state)}
      />
    </div>
  );
}
