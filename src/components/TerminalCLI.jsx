import React, { useState, useRef, useEffect } from "react";
import { Terminal, Shield, Play, RotateCcw, Volume2, Sparkles, CheckCircle2, ChevronRight, CornerDownLeft, Lock } from "lucide-react";
import { soundFX } from "../utils/audio";
import confetti from "canvas-confetti";
import { translations } from "../data/translations";

export default function TerminalCLI({ profileData, currentTheme, onThemeChange, onToggleMatrix, onOpenAdmin, lang = "uz" }) {
  const t = translations[lang] || translations.uz;

  const [history, setHistory] = useState([
    { type: "system", text: "UWP_SEC_OS v4.19.8-hardened (tty1) [DEFCON-1]" },
    { type: "system", text: "Welcome to UWP terminal. Type 'help' to see available commands." },
    { type: "banner", text: "" }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isScanning, setIsScanning] = useState(false);
  const terminalBottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = async (cmdText) => {
    const raw = cmdText.trim();
    if (!raw) return;

    soundFX.playKeypress();

    // Add to history
    setCommandHistory((prev) => [...prev, raw]);
    setHistoryIndex(-1);

    const parts = raw.split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts[1]?.toLowerCase();

    // Log user command
    const newHistory = [...history, { type: "user", text: `root@uwp-vault:~$ ${raw}` }];

    switch (cmd) {
      case "help":
        newHistory.push({
          type: "output",
          text: `Available commands / Mavjud buyruqlar:
  • whoami       - Operator profile & security clearance
  • skills       - Technical capabilities & tools
  • projects     - Security & software repositories
  • achievements - Milestones, CTF writeups & results
  • admin        - Open UWP Admin CRUD portal
  • contact      - Encrypted communications (Telegram, PGP)
  • cat resume   - Quick resume summary
  • exploit      - Interactive simulated security audit
  • matrix       - Toggle background digital rain
  • theme <name> - Change palette (emerald, cyan, crimson, monochrome)
  • clear        - Clear terminal screen`
        });
        soundFX.playClick();
        break;

      case "whoami":
        newHistory.push({
          type: "output",
          text: `[UWP OPERATOR PROFILE]
  Handle:     ${profileData.personal.handle}
  Real Name:  ${profileData.personal.realName}
  Role:       ${profileData.personal.title}
  Status:     ${profileData.personal.status}
  Clearance:  ${profileData.personal.clearanceLevel}
  Location:   ${profileData.personal.location}
  Bio:        ${profileData.personal.bio}`
        });
        soundFX.playSuccess();
        break;

      case "skills":
        let skillsTxt = "=== UWP TECHNICAL CAPABILITIES ===\n";
        profileData.skills.forEach((cat) => {
          skillsTxt += `\n[+] ${cat.category.toUpperCase()}\n`;
          cat.items.forEach((item) => {
            skillsTxt += `  - ${item.name} [${item.level}%] | Tools: ${item.tools}\n`;
          });
        });
        newHistory.push({ type: "output", text: skillsTxt.trim() });
        soundFX.playClick();
        break;

      case "projects":
        let projTxt = "=== UWP ARTIFACTS & REPOSITORIES ===\n";
        profileData.projects.forEach((p, idx) => {
          projTxt += `\n[${idx + 1}] ${p.title} (${p.status}) - ${p.category}\n    ${p.description}\n    Tags: ${p.tags.join(", ")}\n`;
        });
        newHistory.push({ type: "output", text: projTxt.trim() });
        soundFX.playClick();
        break;

      case "achievements":
      case "yutuqlar":
        try {
          const res = await fetch("/api/achievements");
          if (res.ok) {
            const achList = await res.json();
            let achTxt = "=== UWP ACHIEVEMENTS ARCHIVE ===\n";
            achList.forEach((a, i) => {
              achTxt += `\n[${i + 1}] ${a.title} (${a.category}) - ${a.date}\n    ${a.description || ""}\n`;
            });
            newHistory.push({ type: "output", text: achTxt.trim() });
          } else {
            newHistory.push({ type: "output", text: "Failed to load achievements from backend." });
          }
        } catch {
          newHistory.push({ type: "output", text: "Backend service unreachable." });
        }
        soundFX.playClick();
        break;

      case "admin":
        if (onOpenAdmin) onOpenAdmin();
        newHistory.push({ type: "success", text: "[+] Opening UWP Admin portal..." });
        soundFX.playSuccess();
        break;

      case "contact":
        newHistory.push({
          type: "output",
          text: `[UWP SECURE CONTACT CHANNELS]
  Telegram:  ${profileData.contact.telegram} (${profileData.contact.telegramUrl})
  GitHub:    ${profileData.contact.github}
  LinkedIn:  ${profileData.contact.linkedin}
  Email:     ${profileData.contact.email}
  PGP Key:   ${profileData.contact.pgpKeyId}
  Fingerprint: ${profileData.contact.pgpFingerprint}`
        });
        soundFX.playClick();
        break;

      case "cat":
        if (arg === "resume" || arg === "resume.txt") {
          newHistory.push({
            type: "output",
            text: `Resume: ${profileData.personal.handle} (${profileData.personal.realName})
Role: ${profileData.personal.title}
Domains: Linux, Python scripting, Network reconnaissance, Web security (OWASP).
Direct Contact: ${profileData.contact.telegram}`
          });
          soundFX.playClick();
        } else if (arg === "flag.txt") {
          newHistory.push({
            type: "success",
            text: `[!] CONGRATULATIONS! FLAG CAPTURED: FLAG{uwp_3th1c4l_c0d3r_2026}`
          });
          confetti({ particleCount: 70, spread: 80, origin: { y: 0.7 } });
          soundFX.playSuccess();
        } else {
          newHistory.push({ type: "error", text: `cat: ${arg || ""}: File not found. Try: 'cat resume'` });
          soundFX.playAlert();
        }
        break;

      case "exploit":
      case "scan":
        runInteractiveScan(newHistory);
        return;

      case "matrix":
        if (onToggleMatrix) onToggleMatrix();
        newHistory.push({ type: "output", text: "[*] Matrix background rain toggled." });
        soundFX.playClick();
        break;

      case "theme":
        if (["emerald", "cyan", "crimson", "monochrome"].includes(arg)) {
          if (onThemeChange) onThemeChange(arg);
          newHistory.push({ type: "success", text: `[+] Theme set to: ${arg.toUpperCase()}` });
          soundFX.playSuccess();
        } else {
          newHistory.push({ type: "error", text: "Invalid theme. Options: emerald, cyan, crimson, monochrome" });
          soundFX.playAlert();
        }
        break;

      case "clear":
        setHistory([]);
        setInputVal("");
        return;

      case "sudo":
        newHistory.push({
          type: "error",
          text: "Incident logged. Operator already possesses root clearance."
        });
        soundFX.playAlert();
        break;

      default:
        newHistory.push({
          type: "error",
          text: `Command not found: '${cmd}'. Type 'help' for full command manual.`
        });
        soundFX.playAlert();
        break;
    }

    setHistory(newHistory);
    setInputVal("");
  };

  const runInteractiveScan = (currentHistory) => {
    setIsScanning(true);
    soundFX.playCyberPulse();

    const scanSteps = [
      "[*] Initiating Nmap scan against 192.168.1.0/24 (-sV -sC -T4)...",
      "[+] Port 22/tcp OPEN (OpenSSH 8.9p1 Ubuntu)",
      "[+] Port 80/tcp OPEN (Nginx Reverse Proxy)",
      "[+] Port 443/tcp OPEN (TLSv1.3 AES-256-GCM)",
      "[*] OWASP Top 10 automated test: SQLi [NONE], XSS [FILTERED], SSRF [SAFE]",
      "[*] System defense status: 100% PROTECTED (Zero critical findings)",
      "[✓] Security audit completed successfully."
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < scanSteps.length) {
        setHistory((prev) => [...prev, { type: "system", text: scanSteps[stepIndex] }]);
        soundFX.playKeypress();
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        soundFX.playSuccess();
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
      }
    }, 400);

    setHistory([...currentHistory, { type: "system", text: "[*] Security scanner initiated..." }]);
    setInputVal("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIdx);
        setInputVal(commandHistory[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const nextIdx = historyIndex + 1;
        if (nextIdx < commandHistory.length) {
          setHistoryIndex(nextIdx);
          setInputVal(commandHistory[nextIdx]);
        } else {
          setHistoryIndex(-1);
          setInputVal("");
        }
      }
    }
  };

  const quickCommands = ["help", "whoami", "skills", "projects", "achievements", "exploit", "admin", "contact"];

  return (
    <div className="w-full bg-[#0d0f14]/95 border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md font-mono text-xs sm:text-sm">
      {/* Terminal Title Bar */}
      <div className="bg-[#141821] px-4 py-2.5 border-b border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-gray-400 font-mono text-xs ml-2 flex items-center">
            <Terminal className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            root@uwp-vault: ~ (bash / zsh)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-emerald-400/80">
          <span className="hidden sm:inline-block">MODE: DEFENSIVE_CLI</span>
          <button
            onClick={() => setHistory([])}
            className="hover:text-emerald-300 p-1 rounded hover:bg-emerald-500/10 transition"
            title="Clear"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick Command Pills */}
      <div className="bg-[#0b0c10] px-4 py-1.5 border-b border-gray-800 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <span className="text-gray-500 text-[10px] uppercase font-bold shrink-0">{t.terminal.quick}</span>
        {quickCommands.map((qc) => (
          <button
            key={qc}
            onClick={() => handleCommand(qc)}
            className="px-2 py-0.5 rounded bg-[#161a24] hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-300 border border-gray-700 hover:border-emerald-500/40 transition shrink-0"
          >
            {qc}
          </button>
        ))}
      </div>

      {/* Terminal Body */}
      <div
        className="p-4 overflow-y-auto max-h-[380px] min-h-[260px] space-y-2 select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, idx) => (
          <div key={idx} className="leading-relaxed">
            {item.type === "banner" && (
              <pre className="text-emerald-400 font-mono text-[9px] sm:text-[11px] leading-tight select-none py-1">
{`   __  ___       ______  
  / / / / |     / / __ \\ 
 / / / /| | /| / / /_/ / 
/ /_/ / | |/ |/ / ____/  
\\____/  |__/|__/_/       
   [ UWP // SECURITY OS ]`}
              </pre>
            )}
            {item.type === "user" && (
              <div className="text-emerald-300 font-bold flex items-center">
                <span>{item.text}</span>
              </div>
            )}
            {item.type === "output" && (
              <pre className="text-gray-300 whitespace-pre-wrap font-mono pl-2 border-l border-emerald-500/20">
                {item.text}
              </pre>
            )}
            {item.type === "system" && (
              <div className="text-cyan-400/90 font-mono">{item.text}</div>
            )}
            {item.type === "success" && (
              <div className="text-emerald-400 font-bold bg-emerald-950/30 p-2 rounded border border-emerald-500/30">
                {item.text}
              </div>
            )}
            {item.type === "error" && (
              <div className="text-red-400 font-mono pl-2 border-l-2 border-red-500">
                {item.text}
              </div>
            )}
          </div>
        ))}

        {isScanning && (
          <div className="flex items-center space-x-2 text-yellow-400 text-xs animate-pulse">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            <span>Scanning protocols & ports...</span>
          </div>
        )}

        {/* Input line */}
        <div className="flex items-center space-x-2 pt-2 text-emerald-400">
          <span className="shrink-0 text-emerald-400 font-bold flex items-center">
            root@uwp-vault:~$
          </span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isScanning}
            className="flex-1 bg-transparent outline-none border-none text-emerald-200 font-mono caret-emerald-400"
            autoFocus
            spellCheck={false}
          />
          <CornerDownLeft className="w-3.5 h-3.5 text-gray-600" />
        </div>
        <div ref={terminalBottomRef} />
      </div>
    </div>
  );
}
