import React, { useState, useEffect } from "react";
import { Trophy, Calendar, ExternalLink, Image as ImageIcon, Maximize2, X, Plus, Edit } from "lucide-react";
import { soundFX } from "../utils/audio";
import { translations } from "../data/translations";

export default function AchievementsSection({ isAuthenticated, onOpenAdmin, reloadTrigger, lang = "uz" }) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageModal, setActiveImageModal] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const t = translations[lang] || translations.uz;

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/achievements");
      if (res.ok) {
        const data = await res.json();
        setAchievements(data);
      }
    } catch (err) {
      console.warn("Backenddan yuklab bo'lmadi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
  }, [reloadTrigger]);

  const categories = ["ALL", ...new Set(achievements.map((a) => a.category).filter(Boolean))];

  const filtered = filter === "ALL"
    ? achievements
    : achievements.filter((a) => a.category === filter);

  return (
    <section id="achievements" className="py-12 px-4 max-w-7xl mx-auto border-t border-gray-800/80">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-1">
            {t.achievements.tagline}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-center">
            <Trophy className="w-8 h-8 text-yellow-400 mr-3 shrink-0" />
            <span>{t.achievements.title}</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl font-mono">
            {t.achievements.desc}
          </p>
        </div>

        {/* If Admin is logged in, show manage button */}
        {isAuthenticated && (
          <button
            onClick={() => {
              onOpenAdmin();
              soundFX.playClick();
            }}
            className="px-4 py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center space-x-2 transition shrink-0"
          >
            <Edit className="w-4 h-4 text-emerald-400" />
            <span>{t.achievements.manageBtn}</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      {categories.length > 2 && (
        <div className="flex flex-wrap gap-1.5 mb-8 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                soundFX.playClick();
              }}
              className={`px-3 py-1.5 rounded border transition ${
                filter === cat
                  ? "bg-yellow-500/20 border-yellow-400 text-yellow-300 font-bold"
                  : "bg-[#0e111a] border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {cat === "ALL" ? t.achievements.all : cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid of Achievements */}
      {loading ? (
        <div className="text-center py-12 font-mono text-xs text-gray-500 animate-pulse">
          ...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-[#0c0e14] border border-dashed border-gray-800 rounded-xl p-8 font-mono">
          <Trophy className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <div className="text-gray-400 text-sm font-bold">{t.achievements.emptyTitle}</div>
          <div className="text-gray-600 text-xs mt-1 max-w-md mx-auto">
            {t.achievements.emptyDesc}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-[#0e111a] border border-gray-800 hover:border-yellow-500/40 rounded-xl overflow-hidden transition duration-300 flex flex-col justify-between group shadow-lg hover:shadow-yellow-500/5"
            >
              <div>
                {/* Image Section */}
                {item.imageUrl ? (
                  <div
                    className="relative h-48 bg-[#141824] overflow-hidden cursor-pointer group/img"
                    onClick={() => {
                      setActiveImageModal(item);
                      soundFX.playClick();
                    }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center text-white space-x-1 text-xs font-mono">
                      <Maximize2 className="w-4 h-4 text-yellow-400" />
                      <span>{t.achievements.maximize}</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 bg-gradient-to-br from-[#121622] to-[#0c0e14] border-b border-gray-800/80 flex items-center justify-center text-gray-700">
                    <Trophy className="w-8 h-8 opacity-30" />
                  </div>
                )}

                {/* Card Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between font-mono text-[10px] mb-2">
                    <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded font-bold uppercase">
                      {item.category || "YUTUQ"}
                    </span>
                    {item.date && (
                      <span className="text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.date}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white font-mono group-hover:text-yellow-300 transition line-clamp-2">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-gray-300 text-xs mt-2 leading-relaxed font-sans line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer link */}
              {item.link && (
                <div className="px-5 pb-5 pt-0">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFX.playClick()}
                    className="inline-flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 font-bold transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.achievements.proofLink}</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal for Full Image View */}
      {activeImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setActiveImageModal(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-[#0c0e14] border border-gray-800 rounded-xl overflow-hidden p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImageModal(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/70 hover:bg-black text-white rounded-full border border-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImageModal.imageUrl}
              alt={activeImageModal.title}
              className="max-h-[75vh] w-auto mx-auto object-contain rounded"
            />
            <div className="p-4 font-mono">
              <div className="text-yellow-400 text-xs font-bold">{activeImageModal.category} // {activeImageModal.date}</div>
              <div className="text-white text-base font-bold mt-1">{activeImageModal.title}</div>
              {activeImageModal.description && (
                <div className="text-gray-400 text-xs mt-1">{activeImageModal.description}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
