import React from "react";
import { Award, ShieldCheck, CheckCircle, FileText, Lock } from "lucide-react";
import { soundFX } from "../utils/audio";

export default function CertificationsSection({ profileData }) {
  return (
    <section id="certs" className="py-16 px-4 max-w-7xl mx-auto border-t border-gray-800/80">
      <div className="mb-10">
        <div className="text-gray-500 font-mono text-xs tracking-widest uppercase mb-1">
          // VALIDATION & CLEARANCE
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono flex items-center">
          <span className="text-yellow-400 mr-2">#</span>
          <span>SERTIFIKATLAR VA BUG BOUNTY</span>
        </h2>
        <p className="text-gray-400 text-sm mt-2 max-w-2xl font-mono">
          Xalqaro tan olingan kiber-xavfsizlik sertifikatlari va amaliy himoya malakalari.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {profileData.certifications.map((cert, idx) => (
          <div
            key={idx}
            className="bg-[#0e111a] border border-gray-800 hover:border-yellow-500/40 p-5 rounded-xl transition duration-200 group flex items-start space-x-4"
          >
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 shrink-0 group-hover:scale-105 transition">
              <Award className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 font-mono">
                <span className="text-xs text-yellow-400 font-bold tracking-wider">
                  {cert.issuer}
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                  {cert.status}
                </span>
              </div>

              <h4 className="text-base font-bold text-white font-mono group-hover:text-yellow-300 transition">
                {cert.title}
              </h4>

              <p className="text-xs text-gray-400 mt-2 font-sans">
                {cert.highlight}
              </p>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800/70 font-mono text-[11px] text-gray-500">
                <span>CERT_ID: {cert.id}</span>
                <span>YEAR: {cert.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bug Bounty & CVE Hall of Fame Banner */}
      <div className="mt-8 bg-gradient-to-r from-[#111624] via-[#0d121c] to-[#121622] border border-emerald-500/30 rounded-xl p-6 font-mono">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-white font-bold text-sm">
                BUG BOUNTY HALL OF FAME // RESPONSIBLE DISCLOSURE
              </div>
              <div className="text-gray-400 text-xs mt-0.5">
                Fintech, SaaS va bulutli platformalarda 14+ ta muhim zaifliklar (RCE, SSRF, IDOR, SQLi) aniqlangan va axloqiy tartibda yopilgan.
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded font-bold">
              100% ETHICAL COMPLIANCE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
