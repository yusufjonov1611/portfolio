import React, { useState } from "react";
import { X, Save, Copy, Check, RotateCcw, User, Shield, Terminal } from "lucide-react";
import { soundFX } from "../utils/audio";

export default function ProfileEditModal({ isOpen, onClose, profileData, onSave }) {
  const [formData, setFormData] = useState({
    handle: profileData.personal.handle,
    realName: profileData.personal.realName,
    title: profileData.personal.title,
    bio: profileData.personal.bio,
    clearanceLevel: profileData.personal.clearanceLevel,
    telegram: profileData.contact.telegram,
    telegramUrl: profileData.contact.telegramUrl,
    github: profileData.contact.github,
    githubUrl: profileData.contact.githubUrl,
    email: profileData.contact.email
  });

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...profileData,
      personal: {
        ...profileData.personal,
        handle: formData.handle,
        realName: formData.realName,
        title: formData.title,
        bio: formData.bio,
        clearanceLevel: formData.clearanceLevel
      },
      contact: {
        ...profileData.contact,
        telegram: formData.telegram,
        telegramUrl: formData.telegramUrl,
        github: formData.github,
        githubUrl: formData.githubUrl,
        email: formData.email
      }
    };
    onSave(updated);
    soundFX.playSuccess();
    onClose();
  };

  const handleExportJson = () => {
    navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    setCopied(true);
    soundFX.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0e111a] border border-emerald-500/40 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto font-mono text-xs shadow-2xl">
        {/* Header */}
        <div className="bg-[#141822] px-5 py-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <Shield className="w-4 h-4" />
            <span>OPERATOR MA'LUMOTLARINI SOZLASH (QUICK PROFILE CONFIG)</span>
          </div>
          <button
            onClick={() => {
              onClose();
              soundFX.playClick();
            }}
            className="text-gray-400 hover:text-white p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Note */}
        <div className="p-4 bg-emerald-950/20 border-b border-emerald-500/20 text-gray-300 text-[11px] leading-relaxed">
          Bu yerda o'z ismingiz, Telegram akkauntingiz, lavozimingiz va havolalaringizni kiritib "Saqlash" tugmasini bossangiz, sayt real vaqtda sizning ma'lumotlaringiz bilan yangilanadi!
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                // TAXALLUS (NICKNAME / HANDLE):
              </label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                // TO'LIQ ISM (REAL NAME):
              </label>
              <input
                type="text"
                value={formData.realName}
                onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-bold">
              // MUTAXASSISLIK TITLE (LAVOZI M / YO'NALISH):
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-bold">
              // XAVFSIZLIK DARAJASI (CLEARANCE LEVEL):
            </label>
            <input
              type="text"
              value={formData.clearanceLevel}
              onChange={(e) => setFormData({ ...formData, clearanceLevel: e.target.value })}
              className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1 font-bold">
              // O'ZINGIZ HAQINGIZDA (BIO / TAVSIF):
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                // TELEGRAM USERNAME:
              </label>
              <input
                type="text"
                value={formData.telegram}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                // TELEGRAM URL:
              </label>
              <input
                type="text"
                value={formData.telegramUrl}
                onChange={(e) => setFormData({ ...formData, telegramUrl: e.target.value })}
                className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                // GITHUB USERNAME:
              </label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-1 font-bold">
                // EMAIL:
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#141824] border border-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center space-x-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "NUSXA OLINDI!" : "JSON EXPORT"}</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded bg-gray-800 text-gray-400 hover:text-white transition"
              >
                BEKOR QILISH
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center space-x-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAQLASH VA QO'LLASH</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
