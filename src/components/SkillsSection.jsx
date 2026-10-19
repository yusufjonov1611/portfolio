import React, { useState } from "react";
import { Shield, Crosshair, Terminal, Wrench } from "lucide-react";
import { soundFX } from "../utils/audio";
import { translations } from "../data/translations";

export default function SkillsSection({ profileData, lang = "uz" }) {
  const [activeTab, setActiveTab] = useState(0);
  const t = translations[lang] || translations.uz;

  const getCategoryIcon = (index) => {
    switch (index) {
      case 0:
        return <Crosshair className="w-4 h-4 text-emerald-400" />;
      case 1:
        return <Terminal className="w-4 h-4 text-cyan-400" />;
      case 2:
      default:
        return <Shield className="w-4 h-4 text-yellow-400" />;
    }
  };

  const categoryTitles = [
    t.skills.categories.security,
    t.skills.categories.coding,
    t.skills.categories.labs
  ];

  return (
    <section id="skills" className="py-12 px-4 max-w-7xl mx-auto border-t border-gray-800/80">
      <div className="mb-8">
        <div className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-1">
          {t.skills.tagline}
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-center">
          <span className="text-emerald-400 mr-2">#</span>
          <span>{t.skills.title}</span>
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl font-mono">
          {t.skills.desc}
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 font-mono text-xs">
        {profileData.skills.map((category, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveTab(idx);
              soundFX.playClick();
            }}
            className={`px-4 py-2.5 rounded-lg border font-bold flex items-center space-x-2 transition ${
              activeTab === idx
                ? "bg-[#161c28] border-emerald-500 text-white shadow-lg shadow-emerald-500/10"
                : "bg-[#0c0e14] border-gray-800 text-gray-400 hover:text-white hover:border-gray-700"
            }`}
          >
            {getCategoryIcon(idx)}
            <span>{categoryTitles[idx] || category.category}</span>
          </button>
        ))}
      </div>

      {/* Skills Grid for Active Tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileData.skills[activeTab].items.map((skill, sIdx) => (
          <div
            key={sIdx}
            className="bg-[#0e1119] border border-gray-800 hover:border-emerald-500/40 p-5 rounded-xl transition duration-200 group relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono font-bold text-sm text-gray-200 group-hover:text-emerald-400 transition">
                {skill.name}
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {skill.level}%
              </span>
            </div>

            {/* Proficiency Meter */}
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden my-3">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${skill.level}%` }}
              />
            </div>

            {/* Tools Used */}
            <div className="flex items-start space-x-1.5 mt-3 pt-3 border-t border-gray-800/60 font-mono text-xs text-gray-400">
              <Wrench className="w-3.5 h-3.5 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-500">{t.skills.toolsLabel}</span>{" "}
                <span className="text-gray-300">{skill.tools}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
