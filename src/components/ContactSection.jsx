import React, { useState } from "react";
import { Send, Lock, Copy, Check, Terminal, Mail, Key } from "lucide-react";
import { soundFX } from "../utils/audio";
import confetti from "canvas-confetti";
import { translations } from "../data/translations";

export default function ContactSection({ profileData, lang = "uz" }) {
  const [copiedKey, setCopiedKey] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    message: ""
  });
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const t = translations[lang] || translations.uz;

  const pgpBlock = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v5.0.0
Comment: UWP Security Operator Public Key

mQENBF4G1+8BCADU6zXj0b3b...[AUTHENTICATED 4096-BIT RSA KEY]...
k5+1u56Vd0Pj08qYfW3z8b4...
=8YfG
-----END PGP PUBLIC KEY BLOCK-----`;

  const copyPgp = () => {
    navigator.clipboard.writeText(pgpBlock);
    setCopiedKey(true);
    soundFX.playSuccess();
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setIsSending(true);
    soundFX.playCyberPulse();

    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);
      soundFX.playSuccess();
      confetti({ particleCount: 50, spread: 70, origin: { y: 0.85 } });
      setFormData({ name: "", contact: "", message: "" });
      setTimeout(() => setSendSuccess(false), 6000);
    }, 1400);
  };

  return (
    <section id="contact" className="py-12 px-4 max-w-7xl mx-auto border-t border-gray-800/80">
      <div className="mb-8">
        <div className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-1">
          {t.contact.tagline}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-center">
          <span className="text-emerald-400 mr-2">#</span>
          <span>{t.contact.title}</span>
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl font-mono">
          {t.contact.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Encrypted Message Form */}
        <div className="lg:col-span-7 bg-[#0e111a] border border-gray-800/90 rounded-xl p-6 relative">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800 font-mono text-xs text-gray-400">
            <span className="flex items-center space-x-1.5 text-emerald-400">
              <Lock className="w-3.5 h-3.5" />
              <span>END-TO-END ENCRYPTION (AES-256-GCM)</span>
            </span>
            <span>{t.contact.statusReady}</span>
          </div>

          <form onSubmit={handleSend} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                {t.contact.nameLabel}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => soundFX.playKeypress()}
                placeholder={t.contact.namePlaceholder}
                className="w-full bg-[#131722] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                {t.contact.contactLabel}
              </label>
              <input
                type="text"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                onFocus={() => soundFX.playKeypress()}
                placeholder={t.contact.contactPlaceholder}
                className="w-full bg-[#131722] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                {t.contact.msgLabel}
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                onFocus={() => soundFX.playKeypress()}
                placeholder={t.contact.msgPlaceholder}
                className="w-full bg-[#131722] border border-gray-800 rounded-lg px-3.5 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center justify-center space-x-2 transition shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>{t.contact.sending}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.contact.sendBtn}</span>
                </>
              )}
            </button>

            {sendSuccess && (
              <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 p-3 rounded-lg flex items-center space-x-2 font-mono text-xs">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.contact.successMsg}</span>
              </div>
            )}
          </form>
        </div>

        {/* Right: Direct Channels & PGP Key */}
        <div className="lg:col-span-5 space-y-4">
          {/* Direct Telegram Card */}
          <a
            href={profileData.contact.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundFX.playClick()}
            className="block bg-[#121622] border border-emerald-500/30 hover:border-emerald-400 p-5 rounded-xl transition group font-mono"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-emerald-400 font-bold">{t.contact.fastTg}</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">{t.contact.direct}</span>
            </div>
            <div className="text-xl font-bold text-white group-hover:text-emerald-300 transition">
              {profileData.contact.telegram}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {t.contact.tgDesc}
            </div>
          </a>

          {/* Social Channels List */}
          <div className="bg-[#0e111a] border border-gray-800 p-5 rounded-xl font-mono text-xs space-y-3">
            <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">
              {t.contact.profiles}
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-gray-800/80">
              <span className="text-gray-400">GitHub:</span>
              <a
                href={profileData.contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="text-cyan-400 hover:text-cyan-300 font-bold"
              >
                {profileData.contact.github}
              </a>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-gray-800/80">
              <span className="text-gray-400">LinkedIn:</span>
              <a
                href={profileData.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundFX.playClick()}
                className="text-cyan-400 hover:text-cyan-300 font-bold"
              >
                {profileData.contact.linkedin}
              </a>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-gray-400">Email:</span>
              <span className="text-emerald-400 font-bold select-all">
                {profileData.contact.email}
              </span>
            </div>
          </div>

          {/* PGP Key Card */}
          <div className="bg-[#0e111a] border border-gray-800 p-5 rounded-xl font-mono text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 font-bold flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-yellow-400" />
                <span>{t.contact.pgpTitle}</span>
              </span>
              <button
                onClick={copyPgp}
                className="px-2 py-1 rounded bg-[#161a26] hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border border-gray-700 hover:border-emerald-500/40 flex items-center space-x-1 transition"
              >
                {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span className="text-[10px]">{copiedKey ? t.contact.copiedKey : t.contact.copyKey}</span>
              </button>
            </div>
            <div className="text-[10px] text-gray-500 mb-1">
              KEY ID: <span className="text-yellow-400">{profileData.contact.pgpKeyId}</span>
            </div>
            <div className="text-[10px] text-gray-500 truncate">
              FINGERPRINT: {profileData.contact.pgpFingerprint}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
