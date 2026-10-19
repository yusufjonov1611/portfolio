import React from "react";
import { Shield, ArrowUp, Lock } from "lucide-react";
import { soundFX } from "../utils/audio";
import { translations } from "../data/translations";

export default function CyberFooter({ profileData, onOpenAdmin, lang = "uz" }) {
  const t = translations[lang] || translations.uz;

  const scrollToTop = () => {
    soundFX.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[#1a1f2b] bg-[#07080b] py-12 px-4 font-mono text-xs text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <div className="text-gray-300 font-bold">
              UWP // {profileData.personal.handle}
            </div>
            {/* Discreet secret trigger for admin panel */}
            <div
              onClick={() => {
                if (onOpenAdmin) onOpenAdmin();
                soundFX.playClick();
              }}
              className="text-[10px] text-gray-600 hover:text-emerald-500/60 cursor-pointer transition select-none flex items-center space-x-1"
              title="Sys Auth"
            >
              <Lock className="w-2.5 h-2.5 opacity-40 inline" />
              <span>SHA-256 HASH VERIFIED // © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>

        {/* Ethical Compliance Disclaimer */}
        <div className="text-center md:text-left text-[11px] text-gray-500 max-w-md bg-[#0d0f15] p-3 rounded border border-gray-800/80">
          {t.footer.legal}
        </div>

        {/* Back to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center space-x-2 px-3 py-2 rounded bg-[#121622] hover:bg-emerald-500/10 border border-gray-800 hover:border-emerald-500/40 text-gray-400 hover:text-emerald-400 transition"
        >
          <span>{t.footer.up}</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
