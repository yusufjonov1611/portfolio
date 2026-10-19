import React, { useState } from "react";
import { ExternalLink, Shield, Terminal, CheckCircle2, Lock, Zap, Code2 } from "lucide-react";
import { soundFX } from "../utils/audio";
import { translations } from "../data/translations";

export default function ProjectsSection({ profileData, lang = "uz" }) {
  const [filter, setFilter] = useState("ALL");
  const t = translations[lang] || translations.uz;

  const categories = ["ALL", "Offensive Tooling", "Web Security", "Full-Stack Dev"];

  const filteredProjects =
    filter === "ALL"
      ? profileData.projects
      : profileData.projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-12 px-4 max-w-7xl mx-auto border-t border-gray-800/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <div className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-1">
            {t.projects.tagline}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-center">
            <span className="text-cyan-400 mr-2">#</span>
            <span>{t.projects.title}</span>
          </h2>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl font-mono">
            {t.projects.desc}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4 md:mt-0 font-mono text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilter(cat);
                soundFX.playClick();
              }}
              className={`px-3 py-1.5 rounded border transition ${
                filter === cat
                  ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold"
                  : "bg-[#0f121a] border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {cat === "ALL" ? t.projects.all : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="bg-[#0d1017] border border-gray-800/90 hover:border-cyan-500/40 p-6 rounded-xl transition duration-300 flex flex-col justify-between group hover:shadow-xl hover:shadow-cyan-500/5 relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

            <div>
              {/* Header with status badge */}
              <div className="flex items-center justify-between mb-3 font-mono">
                <span className="text-xs text-cyan-400 font-bold tracking-wider">
                  {project.category.toUpperCase()}
                </span>
                <span className="text-[10px] bg-[#161a24] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-bold">
                  {project.badge}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-lg font-bold text-white font-mono group-hover:text-cyan-300 transition">
                {project.title}
              </h3>
              <div className="text-xs font-mono text-gray-500 mb-3">
                // {project.subtitle}
              </div>

              {/* Description */}
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4">
                {project.description}
              </p>

              {/* Highlights Bullet List */}
              <div className="space-y-1.5 mb-5 font-mono text-xs text-gray-400 bg-[#090b10] p-3 rounded-lg border border-gray-800/60">
                {project.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5 font-mono text-[11px]">
                {project.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 rounded bg-[#131722] text-gray-300 border border-gray-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-800/70 font-mono text-xs">
                <span className="text-gray-500">{t.projects.status} {project.status}</span>
                <div className="flex items-center space-x-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundFX.playClick()}
                    className="flex items-center space-x-1 text-gray-400 hover:text-white transition"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>{t.projects.code}</span>
                  </a>
                  <a
                    href={project.demoUrl}
                    onClick={() => soundFX.playClick()}
                    className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 transition font-bold"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{t.projects.demo}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
