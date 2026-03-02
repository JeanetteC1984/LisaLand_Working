import { useState, useRef, useEffect, useCallback } from "react";
import "../cyber.css";

/* ─── TYPES ─────────────────────────────────── */
type Section = "records" | "identity" | "labs" | "targets" | "settings";

type CyberFile = {
  id: string;
  name: string;
  date: string;
  content: string;
};

type Sticker = {
  id: string;
  type: string;
  x: number;
  y: number;
  rotation: number;
};

type Theme = {
  id: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
};

/* ─── DATA ───────────────────────────────────── */
const THEMES: Theme[] = [
  { id: "netrunner", label: "Netrunner",   primary: "#00f3ff", secondary: "#ff00ff", accent: "#facc15" },
  { id: "hacker",    label: "Hacker",      primary: "#00ff41", secondary: "#00cc33", accent: "#ccff00" },
  { id: "corpo",     label: "Corpo",       primary: "#d4af37", secondary: "#c0c0c0", accent: "#ff3333" },
  { id: "synthwave", label: "Synthwave",   primary: "#ff5afd", secondary: "#00fff7", accent: "#ffe156" },
  { id: "terminal",  label: "Terminal",    primary: "#ffb300", secondary: "#ffecb3", accent: "#00ff41" },
  { id: "sakura",    label: "Sakura",      primary: "#ff69b4", secondary: "#ffb7c5", accent: "#ff1493" },
  { id: "ghost",     label: "Ghost",       primary: "#e0e0e0", secondary: "#9e9e9e", accent: "#ffffff" },
  { id: "vaporwave", label: "Vaporwave",   primary: "#00e5ff", secondary: "#ff4081", accent: "#b388ff" },
  { id: "crimson",   label: "Crimson",     primary: "#ff1744", secondary: "#ff6d00", accent: "#ff9100" },
  { id: "matrix",    label: "Matrix",      primary: "#39ff14", secondary: "#00ff41", accent: "#7fff00" },
];

const INITIAL_FILES: CyberFile[] = [
  {
    id: "1",
    name: "Operation: Nightfall",
    date: "2026-02-25",
    content: `<h1 class="cy-doc-title" id="doc-title">Operation: Nightfall</h1>
<div class="cy-case-meta" contenteditable="false">
  Target zone: <strong>Sector 12 – Underground Nexus</strong><br>
  Status: <span class="pulse-text" style="color:#00ff41;">ACTIVE</span>
</div>
<div class="cy-quote-block">"When the lights go out, the real operators step in..."</div>
<p style="max-width:600px;margin-bottom:20px;font-family:'Courier Prime',monospace;line-height:1.7;">
  Nightfall is a black-ops reconnaissance mission to infiltrate the Underground Nexus. 
  Three embedded agents have gone dark. Last known position: sub-level 4, near the data vault.
</p>`,
  },
  {
    id: "2",
    name: "Subject: 89-B",
    date: "2026-02-24",
    content: `<h1 class="cy-doc-title" id="doc-title">Subject: 89-B</h1>
<div class="cy-case-meta" contenteditable="false">
  Suspect last seen in the <strong>Neon District</strong>.<br>
  Status: <span class="pulse-text" style="color:#ff3333;">AT LARGE</span>
</div>
<div class="cy-quote-block">"The rain tasted like acid and cheap synth-gin..."</div>
<p style="max-width:600px;margin-bottom:20px;font-family:'Courier Prime',monospace;line-height:1.7;">
  Surveillance drones lost visual contact at 0400 hours. Subject appears to be using 
  military-grade optical camouflage. Recommend deployment of thermal imaging units to Sector 4.
</p>`,
  },
  {
    id: "3",
    name: "Sector 7 Map",
    date: "2026-02-20",
    content: `<h1 class="cy-doc-title" id="doc-title">Sector 7 Map</h1>
<div class="cy-case-meta" contenteditable="false">
  Classification: <strong>TOP SECRET // EYES ONLY</strong><br>
  Status: <span style="color:#ffb300;">UNDER REVIEW</span>
</div>
<div class="cy-quote-block">"The grid doesn't lie, but the people who drew it do..."</div>
<p style="max-width:600px;margin-bottom:20px;font-family:'Courier Prime',monospace;line-height:1.7;">
  Cartographic data for Sector 7 obtained from corporate archives. 
  Six access tunnels identified. Three are flagged as potentially compromised. 
  Cross-reference with thermal satellite data before use.
</p>`,
  },
];

const TARGETS = [
  { id: "t1", name: "ARIA-7", role: "Rogue A.I. Construct", threat: 92, location: "Mainframe Node 14", status: "AT LARGE" },
  { id: "t2", name: "Viktor Volkov", role: "Corpo Fixer", threat: 74, location: "Neon District HQ", status: "TRACKED" },
  { id: "t3", name: "Ghost-9", role: "Unknown Netrunner", threat: 88, location: "Cyberspace – Deep Net", status: "UNCONFIRMED" },
  { id: "t4", name: "Director Milo Chen", role: "MegaCorp Executive", threat: 60, location: "Tower 1, Floor 87", status: "MONITORED" },
  { id: "t5", name: "The Surgeon", role: "Ripperdoc / Arms Dealer", threat: 79, location: "Undercity, Sector 3", status: "AT LARGE" },
  { id: "t6", name: "Cassidy-X", role: "Street Mercenary Captain", threat: 55, location: "Bazaar District", status: "NEUTRALIZED" },
];

const LABS_FEATURES = [
  { icon: "fa-solid fa-brain-circuit", title: "NEURAL LINK", desc: "Connect your neural interface to the CYBER-LOG mainframe.", status: "BETA" },
  { icon: "fa-solid fa-eye", title: "VISION MODE", desc: "Augmented overlay for document analysis and pattern recognition.", status: "STABLE" },
  { icon: "fa-solid fa-satellite-dish", title: "UPLINK SCAN", desc: "Broadcast encrypted dossiers across secure network nodes.", status: "ALPHA" },
  { icon: "fa-solid fa-fingerprint", title: "BIO-AUTH", desc: "Biometric authentication protocol for secure document access.", status: "STABLE" },
  { icon: "fa-solid fa-shield-halved", title: "ICE BREAKER", desc: "Bypass corporate security firewalls and data vaults.", status: "TESTING" },
  { icon: "fa-solid fa-code", title: "RAW COMPILE", desc: "Inject raw machine code into live documents.", status: "DANGER" },
];

const STICKER_CATEGORIES = {
  Stamps: [
    { type: "stamp-top-secret",  label: "TOP SECRET" },
    { type: "stamp-approved",    label: "APPROVED" },
    { type: "stamp-classified",  label: "CLASSIFIED" },
    { type: "stamp-urgent",      label: "URGENT" },
    { type: "stamp-void",        label: "VOID" },
  ],
  Hazard: [
    { type: "icon-bio",     label: "BIOHAZARD" },
    { type: "icon-rad",     label: "RADIATION" },
    { type: "icon-skull",   label: "SKULL" },
    { type: "tape-warning", label: "WARN TAPE" },
    { type: "tape-redact",  label: "REDACT BAR" },
  ],
  Notes: [
    { type: "note-yellow", label: "NOTE (Yellow)" },
    { type: "note-pink",   label: "NOTE (Pink)" },
    { type: "note-blue",   label: "NOTE (Blue)" },
    { type: "note-green",  label: "NOTE (Green)" },
  ],
  Cyber: [
    { type: "svg-skull", label: "CYBER SKULL" },
    { type: "svg-chip",  label: "CYBER CHIP" },
    { type: "svg-eye",   label: "CYBER EYE" },
    { type: "svg-circuit", label: "CIRCUIT" },
  ],
};

/* ─── TERMINAL COMMANDS ─────────────────────── */
const TERMINAL_CMDS: Record<string, { response: string; cls?: string }> = {
  help:   { response: "AVAILABLE COMMANDS: scan, hack, status, whoami, ping, decrypt, clear, matrix" },
  scan:   { response: "SCANNING LOCAL NETWORK... 3 ANOMALIES DETECTED. SECTOR 4 COMPROMISED.", cls: "cy-log-error" },
  hack:   { response: "BYPASSING ICE... ACCESS GRANTED TO SECTOR 4. PROCEED WITH CAUTION.", cls: "cy-log-success" },
  status: { response: "SYSTEM OPTIMAL. UPLINK SECURE. CPU: 34% | RAM: 2.1TB | TEMP: 42°C", cls: "cy-log-success" },
  whoami: { response: "IDENTITY CLASSIFIED. CLEARANCE LEVEL: OMEGA. ACCESS UNRESTRICTED.", cls: "cy-log-info" },
  ping:   { response: "PINGING MAINFRAME... RESPONSE TIME: 2ms. CONNECTION STABLE.", cls: "cy-log-success" },
  decrypt:{ response: "DECRYPTING FILE... CIPHER BROKEN. CONTENTS EXPOSED.", cls: "cy-log-warn" },
  matrix: { response: "WAKE UP, NETRUNNER... THE GRID IS ALL AROUND YOU.", cls: "cy-log-info" },
  clear:  { response: "__CLEAR__" },
};

/* ─── STICKER CONTENT ───────────────────────── */
function getStickerContent(type: string): string {
  switch (type) {
    case "stamp-top-secret":
      return `<div class="stamp-secret">TOP SECRET</div>`;
    case "stamp-approved":
      return `<div class="stamp-approved">APPROVED</div>`;
    case "stamp-classified":
      return `<div class="stamp-classified">CLASSIFIED</div>`;
    case "stamp-urgent":
      return `<div class="stamp-urgent">URGENT</div>`;
    case "stamp-void":
      return `<div class="stamp-void">VOID</div>`;
    case "tape-warning":
      return `<div class="tape-warning">WARNING // CAUTION // HAZARD // WARNING</div>`;
    case "tape-redact":
      return `<div class="tape-redact" style="width:200px;">REDACTED REDACTED REDACTED</div>`;
    case "icon-bio":
      return `<i class="fa-solid fa-biohazard" style="font-size:3.5rem; color:#ccff00; text-shadow: 0 0 10px #ccff00;"></i>`;
    case "icon-rad":
      return `<i class="fa-solid fa-radiation" style="font-size:3.5rem; color:#ffaa00; text-shadow: 0 0 10px #ffaa00;"></i>`;
    case "icon-skull":
      return `<i class="fa-solid fa-skull-crossbones" style="font-size:3.5rem; color:#ff3333; text-shadow: 0 0 10px #ff3333;"></i>`;
    case "note-yellow":
      return `<div class="sticky-note" style="background:#ffeb3b;color:#000;" contenteditable="true">Note...</div>`;
    case "note-pink":
      return `<div class="sticky-note" style="background:#f06292;color:#fff;" contenteditable="true">Note...</div>`;
    case "note-blue":
      return `<div class="sticky-note" style="background:#42a5f5;color:#fff;" contenteditable="true">Note...</div>`;
    case "note-green":
      return `<div class="sticky-note" style="background:#66bb6a;color:#000;" contenteditable="true">Note...</div>`;
    case "svg-skull":
      return `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="35" cy="35" r="32" stroke="#ff00ff" stroke-width="3" fill="#1a0033"/><ellipse cx="35" cy="40" rx="18" ry="15" fill="#2d004d" stroke="#ff5afd" stroke-width="2"/><ellipse cx="27" cy="38" rx="3" ry="5" fill="#fff"/><ellipse cx="43" cy="38" rx="3" ry="5" fill="#fff"/><rect x="30" y="50" width="10" height="6" rx="2" fill="#ff00ff"/><rect x="32" y="56" width="6" height="4" rx="1" fill="#ff00ff"/></svg>`;
    case "svg-chip":
      return `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="15" width="40" height="40" rx="6" fill="#181200" stroke="#ffb300" stroke-width="3"/><rect x="25" y="25" width="20" height="20" rx="3" fill="#ffb300"/><rect x="32" y="32" width="6" height="6" rx="1" fill="#181200"/><line x1="35" y1="15" x2="35" y2="5" stroke="#ffb300" stroke-width="2"/><line x1="35" y1="65" x2="35" y2="55" stroke="#ffb300" stroke-width="2"/><line x1="15" y1="28" x2="5" y2="28" stroke="#ffb300" stroke-width="2"/><line x1="15" y1="42" x2="5" y2="42" stroke="#ffb300" stroke-width="2"/><line x1="65" y1="28" x2="55" y2="28" stroke="#ffb300" stroke-width="2"/><line x1="65" y1="42" x2="55" y2="42" stroke="#ffb300" stroke-width="2"/></svg>`;
    case "svg-eye":
      return `<svg width="80" height="50" viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="25" rx="36" ry="20" fill="#0a0010" stroke="#ff69b4" stroke-width="2.5"/><ellipse cx="40" cy="25" rx="14" ry="14" fill="#ff69b4"/><circle cx="40" cy="25" r="7" fill="#0a0010"/><circle cx="44" cy="21" r="3" fill="rgba(255,255,255,0.3)"/><line x1="4" y1="25" x2="15" y2="25" stroke="#ff69b4" stroke-width="1.5"/><line x1="65" y1="25" x2="76" y2="25" stroke="#ff69b4" stroke-width="1.5"/></svg>`;
    case "svg-circuit":
      return `<svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="5" width="60" height="60" fill="none" stroke="#00f3ff" stroke-width="1" opacity="0.3"/><circle cx="35" cy="35" r="8" stroke="#00f3ff" stroke-width="2" fill="rgba(0,243,255,0.1)"/><circle cx="35" cy="35" r="3" fill="#00f3ff"/><line x1="35" y1="5" x2="35" y2="27" stroke="#00f3ff" stroke-width="1.5"/><line x1="35" y1="43" x2="35" y2="65" stroke="#00f3ff" stroke-width="1.5"/><line x1="5" y1="35" x2="27" y2="35" stroke="#00f3ff" stroke-width="1.5"/><line x1="43" y1="35" x2="65" y2="35" stroke="#00f3ff" stroke-width="1.5"/><circle cx="35" cy="5" r="3" fill="#00f3ff"/><circle cx="35" cy="65" r="3" fill="#00f3ff"/><circle cx="5" cy="35" r="3" fill="#00f3ff"/><circle cx="65" cy="35" r="3" fill="#00f3ff"/></svg>`;
    default:
      return `<div style="color:var(--cy-primary);font-size:12px;">??</div>`;
  }
}

/* ─── MAIN COMPONENT ────────────────────────── */
export default function CyberLog() {
  const [section, setSection] = useState<Section>("records");
  const [theme, setTheme] = useState("netrunner");
  const [files, setFiles] = useState<CyberFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState("2");
  const [paperPattern, setPaperPattern] = useState("paper-grid");
  const [canvasMode, setCanvasMode] = useState("canvas-default");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [assetOpen, setAssetOpen] = useState(false);
  const [assetTab, setAssetTab] = useState<keyof typeof STICKER_CATEGORIES>("Stamps");
  const [terminalLines, setTerminalLines] = useState([
    { text: "CONNECTING TO MAINFRAME...", cls: "" },
    { text: "AUTHENTICATING USER...", cls: "" },
    { text: "ACCESS GRANTED. Type 'help' for commands.", cls: "cy-log-info" },
  ]);
  const [termCmd, setTermCmd] = useState("");
  const [glitching, setGlitching] = useState(false);
  const [addingFile, setAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [fontChoice, setFontChoice] = useState("Share Tech Mono");
  const [identity, setIdentity] = useState({
    handle: "GHOST_RUNNER",
    clearance: "OMEGA",
    faction: "Freelance",
    location: "Neon District, Sector 7",
    bio: "Shadow operative. No allegiances, only contracts.",
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const termOutputRef = useRef<HTMLDivElement>(null);
  const termInputRef = useRef<HTMLInputElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  /* Drag logic for stickers */
  const initDrag = useCallback((el: HTMLDivElement, stickerId: string) => {
    let ox = 0, oy = 0, sx = 0, sy = 0;

    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("cy-sticker-delete") || target.getAttribute("contenteditable") === "true") return;
      e.preventDefault();
      sx = e.clientX; sy = e.clientY;
      ox = el.offsetLeft; oy = el.offsetTop;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };

    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - sx;
      const dy = e.clientY - sy;
      el.style.left = ox + dx + "px";
      el.style.top  = oy + dy + "px";
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    el.addEventListener("mousedown", onDown);
  }, []);

  /* Place sticker */
  const addSticker = (type: string) => {
    const id = Math.random().toString(36).slice(2);
    const rx = Math.floor(Math.random() * 200) + 60;
    const ry = Math.floor(Math.random() * 200) + 100;
    const rot = type.startsWith("note") || type.startsWith("icon") ? 0 : Math.floor(Math.random() * 40) - 20;
    setStickers(s => [...s, { id, type, x: rx, y: ry, rotation: rot }]);
  };

  const removeSticker = (id: string) => {
    setStickers(s => s.filter(st => st.id !== id));
  };

  /* Attach drag listeners when stickers change */
  useEffect(() => {
    stickers.forEach(st => {
      const el = document.getElementById(`sticker-${st.id}`) as HTMLDivElement | null;
      if (el && !el.dataset.dragging) {
        el.dataset.dragging = "1";
        initDrag(el, st.id);
      }
    });
  }, [stickers, initDrag]);

  /* Format doc */
  const formatDoc = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value ?? undefined);
    editorRef.current?.focus();
  };

  /* Glitch */
  const triggerGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 850);
  };

  /* Terminal */
  const handleTerminal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const cmd = termCmd.trim().toLowerCase();
    setTermCmd("");
    if (!cmd) return;

    setTerminalLines(lines => [...lines, { text: cmd, cls: "" }]);

    setTimeout(() => {
      const result = TERMINAL_CMDS[cmd];
      if (!result) {
        setTerminalLines(l => [...l, { text: `COMMAND NOT RECOGNIZED: '${cmd}'`, cls: "cy-log-error" }]);
        return;
      }
      if (result.response === "__CLEAR__") {
        setTerminalLines([]);
        return;
      }
      setTerminalLines(l => [...l, { text: result.response, cls: result.cls || "" }]);
    }, 380);
  };

  /* Auto-scroll terminal */
  useEffect(() => {
    if (termOutputRef.current) {
      termOutputRef.current.scrollTop = termOutputRef.current.scrollHeight;
    }
  }, [terminalLines]);

  /* Select file */
  const selectFile = (id: string) => {
    if (editorRef.current && activeFileId) {
      setFiles(fs => fs.map(f => f.id === activeFileId ? { ...f, content: editorRef.current!.innerHTML } : f));
    }
    setActiveFileId(id);
  };

  /* Load file content into editor */
  useEffect(() => {
    if (editorRef.current && activeFile) {
      editorRef.current.innerHTML = activeFile.content;
    }
  }, [activeFileId]);

  /* Add new file */
  const confirmAddFile = () => {
    if (!newFileName.trim()) return;
    const id = Math.random().toString(36).slice(2);
    const today = new Date().toISOString().split("T")[0];
    const newFile: CyberFile = {
      id,
      name: newFileName.trim(),
      date: today,
      content: `<h1 class="cy-doc-title" id="doc-title">${newFileName.trim()}</h1>\n<p style="font-family:'Courier Prime',monospace;line-height:1.7;">Begin your entry here...</p>`,
    };
    setFiles(fs => [newFile, ...fs]);
    setNewFileName("");
    setAddingFile(false);
    selectFile(id);
    setSection("records");
  };

  const ICON_NAV: { icon: string; title: string; section: Section | "print" }[] = [
    { icon: "fa-solid fa-mask", title: "Identity", section: "identity" },
    { icon: "fa-solid fa-flask", title: "Labs", section: "labs" },
    { icon: "fa-solid fa-fingerprint", title: "Records", section: "records" },
    { icon: "fa-solid fa-crosshairs", title: "Targets", section: "targets" },
  ];

  /* ─── RENDER ─────────────────────────────── */
  return (
    <div className="cyber-app" data-cyber-theme={theme}>
      {crtEnabled && <div className="crt-overlay" />}

      {/* ── 1. ICON BAR ── */}
      <div className="cy-icon-bar">
        {ICON_NAV.map(n => (
          <button
            key={n.section}
            className={`cy-icon-btn${section === n.section ? " active" : ""}`}
            title={n.title}
            data-testid={`nav-${n.section}`}
            onClick={() => setSection(n.section as Section)}
          >
            <i className={n.icon} />
          </button>
        ))}
        <div className="cy-icon-spacer" />
        <button className="cy-icon-btn" title="Print / Export" onClick={() => window.print()} data-testid="nav-print">
          <i className="fa-solid fa-print" />
        </button>
        <button
          className={`cy-icon-btn${section === "settings" ? " active" : ""}`}
          title="Settings"
          onClick={() => setSection("settings")}
          data-testid="nav-settings"
        >
          <i className="fa-solid fa-gear" />
        </button>
      </div>

      {/* ── 2. FILE NAV ── */}
      <nav className="cy-file-nav">
        <div className="cy-brand">
          <i className="fa-solid fa-terminal" />
          <span>CYBERLOG</span>
          <span className="cy-brand-version">V2.0</span>
        </div>

        <div className="cy-nav-scroll">
          {/* Theme selector */}
          <div className="cy-nav-group">
            <label>SYSTEM THEME</label>
            <select
              className="cy-select"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              data-testid="select-theme"
            >
              {THEMES.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Files */}
          <div className="cy-nav-group">
            <div className="cy-section-title">
              <span>LOCAL FILES</span>
              <button
                className="cy-add-btn"
                title="New File"
                onClick={() => setAddingFile(v => !v)}
                data-testid="button-add-file"
              >
                <i className="fa-solid fa-circle-plus" />
              </button>
            </div>

            {addingFile && (
              <div className="cy-new-file-form">
                <input
                  className="cy-new-file-input"
                  placeholder="File name..."
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && confirmAddFile()}
                  autoFocus
                  data-testid="input-new-file"
                />
                <button className="cy-new-file-btn" onClick={confirmAddFile} data-testid="button-confirm-file">OK</button>
              </div>
            )}

            <ul className="cy-file-list">
              {files.map(f => (
                <li
                  key={f.id}
                  className={`cy-file-item${f.id === activeFileId ? " active" : ""}`}
                  onClick={() => { selectFile(f.id); setSection("records"); }}
                  data-testid={`file-item-${f.id}`}
                >
                  {f.name}
                  <span className="cy-file-date">{f.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Canvas */}
          <div className="cy-nav-group">
            <label>CANVAS MODE</label>
            <select
              className="cy-select"
              value={canvasMode}
              onChange={e => setCanvasMode(e.target.value)}
              data-testid="select-canvas"
            >
              <option value="canvas-default">Dark</option>
              <option value="canvas-tinted">Tinted</option>
              <option value="canvas-blueprint">Blueprint</option>
              <option value="canvas-void">Void</option>
              <option value="canvas-neon">Neon Glow</option>
            </select>
          </div>

          {/* Paper */}
          <div className="cy-nav-group">
            <label>PAPER PATTERN</label>
            <select
              className="cy-select"
              value={paperPattern}
              onChange={e => setPaperPattern(e.target.value)}
              data-testid="select-paper"
            >
              <option value="paper-grid">Grid</option>
              <option value="paper-dots">Dot Matrix</option>
              <option value="paper-lines">Lined</option>
              <option value="paper-blank">Blank</option>
            </select>
          </div>
        </div>
      </nav>

      {/* ── 3. MAIN STAGE ── */}
      <main className={`cy-main-stage ${canvasMode}`}>

        {/* RECORDS */}
        {section === "records" && (
          <div className="cy-section">
            <div className="cy-toolbar">
              <div className="cy-tool-group">
                {[
                  { cmd: "bold",          icon: "fa-solid fa-bold",             title: "Bold" },
                  { cmd: "italic",        icon: "fa-solid fa-italic",           title: "Italic" },
                  { cmd: "underline",     icon: "fa-solid fa-underline",        title: "Underline" },
                  { cmd: "strikeThrough", icon: "fa-solid fa-strikethrough",    title: "Strike" },
                ].map(b => (
                  <button
                    key={b.cmd}
                    className="cy-tool-btn"
                    title={b.title}
                    onClick={() => formatDoc(b.cmd)}
                    data-testid={`btn-format-${b.cmd}`}
                  >
                    <i className={b.icon} />
                  </button>
                ))}
              </div>

              <select
                className="cy-tool-select"
                style={{ width: 130 }}
                onChange={e => { setFontChoice(e.target.value); formatDoc("fontName", e.target.value); }}
                value={fontChoice}
                data-testid="select-font"
              >
                <option value="Share Tech Mono">System UI</option>
                <option value="Courier Prime">Typewriter</option>
                <option value="Orbitron">Header</option>
                <option value="Space Mono">Space Mono</option>
              </select>

              <div className="cy-tool-group">
                {[
                  { cmd: "justifyLeft",   icon: "fa-solid fa-align-left",   title: "Left" },
                  { cmd: "justifyCenter", icon: "fa-solid fa-align-center",  title: "Center" },
                  { cmd: "justifyRight",  icon: "fa-solid fa-align-right",   title: "Right" },
                ].map(b => (
                  <button
                    key={b.cmd}
                    className="cy-tool-btn"
                    title={b.title}
                    onClick={() => formatDoc(b.cmd)}
                    data-testid={`btn-align-${b.cmd}`}
                  >
                    <i className={b.icon} />
                  </button>
                ))}
              </div>

              <div className="cy-tool-group">
                {[
                  { cmd: "insertUnorderedList", icon: "fa-solid fa-list-ul",    title: "Bullet List" },
                  { cmd: "insertOrderedList",   icon: "fa-solid fa-list-ol",    title: "Ordered List" },
                ].map(b => (
                  <button
                    key={b.cmd}
                    className="cy-tool-btn"
                    title={b.title}
                    onClick={() => formatDoc(b.cmd)}
                    data-testid={`btn-list-${b.cmd}`}
                  >
                    <i className={b.icon} />
                  </button>
                ))}
              </div>

              <button className="cy-glitch-btn" onClick={triggerGlitch} data-testid="btn-glitch">
                GLITCH
              </button>

              <button className="cy-asset-toggle" onClick={() => setAssetOpen(v => !v)} data-testid="btn-assets">
                <i className="fa-solid fa-folder-open" /> ASSETS
              </button>
            </div>

            <div className="cy-editor-wrap" style={{ position: "relative" }}>
              {/* Sticker layer */}
              <div className="cy-sticker-layer">
                {stickers.map(st => (
                  <div
                    key={st.id}
                    id={`sticker-${st.id}`}
                    className="cy-sticker"
                    style={{ left: st.x, top: st.y, transform: `rotate(${st.rotation}deg)` }}
                    data-testid={`sticker-${st.id}`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: getStickerContent(st.type) }} />
                    <div
                      className="cy-sticker-delete"
                      onClick={() => removeSticker(st.id)}
                      title="Remove sticker"
                    >
                      <i className="fa-solid fa-xmark" />
                    </div>
                  </div>
                ))}
              </div>

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className={`cy-active-page ${paperPattern}`}
                id="active-page"
                data-testid="editor-page"
              />
            </div>

            {/* Terminal */}
            <div className="cy-terminal">
              <div className="cy-terminal-header">
                <span>SYS.LOG // TERMINAL_ACTIVE</span>
                <div className="cy-terminal-dots">
                  <div className="cy-terminal-dot" style={{ background: "#ff5f57" }} />
                  <div className="cy-terminal-dot" style={{ background: "#febc2e" }} />
                  <div className="cy-terminal-dot" style={{ background: "#28c840" }} />
                </div>
              </div>
              <div className="cy-terminal-output" ref={termOutputRef}>
                {terminalLines.map((line, i) => (
                  <div key={i} className={`cy-log-line ${line.cls}`}>{line.text}</div>
                ))}
              </div>
              <div className="cy-terminal-input-row">
                <span className="cy-prompt">▶</span>
                <input
                  ref={termInputRef}
                  className="cy-term-input"
                  type="text"
                  autoComplete="off"
                  spellCheck={false}
                  value={termCmd}
                  onChange={e => setTermCmd(e.target.value)}
                  onKeyDown={handleTerminal}
                  placeholder="enter command..."
                  data-testid="terminal-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* IDENTITY */}
        {section === "identity" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-title">Identity</div>
              <div className="cy-page-subtitle">OPERATIVE PROFILE // CLEARANCE REQUIRED</div>
            </div>
            <div className="cy-page-body">
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div className="cy-identity-card" style={{ flex: "1", minWidth: 280 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                    <div className="cy-identity-avatar">
                      <i className="fa-solid fa-user-secret" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--cy-font-header)", fontSize: 20, color: "var(--cy-primary)", textShadow: "var(--cy-glow)", letterSpacing: 2 }}>
                        {identity.handle}
                      </div>
                      <div className="cy-badge cy-badge-online" style={{ marginTop: 8 }}>ACTIVE</div>
                    </div>
                  </div>

                  {[
                    { label: "OPERATIVE HANDLE", key: "handle" },
                    { label: "CLEARANCE LEVEL", key: "clearance" },
                    { label: "FACTION", key: "faction" },
                    { label: "LOCATION", key: "location" },
                  ].map(f => (
                    <div className="cy-identity-field" key={f.key}>
                      <div className="cy-field-label">{f.label}</div>
                      <input
                        className="cy-field-input"
                        value={identity[f.key as keyof typeof identity]}
                        onChange={e => setIdentity(id => ({ ...id, [f.key]: e.target.value }))}
                        data-testid={`identity-${f.key}`}
                      />
                    </div>
                  ))}

                  <div className="cy-identity-field">
                    <div className="cy-field-label">OPERATIVE BIO</div>
                    <textarea
                      className="cy-field-input"
                      style={{ resize: "vertical", minHeight: 80 }}
                      value={identity.bio}
                      onChange={e => setIdentity(id => ({ ...id, bio: e.target.value }))}
                      data-testid="identity-bio"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 200 }}>
                  <div className="cy-identity-card" style={{ padding: 16 }}>
                    <div className="cy-field-label" style={{ marginBottom: 10 }}>SYSTEM STATUS</div>
                    {[
                      { label: "Neural Link", val: "ONLINE", cls: "cy-badge-online" },
                      { label: "ICE Shield",  val: "ACTIVE", cls: "cy-badge-online" },
                      { label: "Uplink",      val: "SECURE", cls: "cy-badge-online" },
                      { label: "Trace Alert", val: "NONE",   cls: "cy-badge-warn"   },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, color: "var(--cy-text-muted)" }}>{row.label}</span>
                        <span className={`cy-badge ${row.cls}`}>{row.val}</span>
                      </div>
                    ))}
                  </div>

                  <div className="cy-identity-card" style={{ padding: 16 }}>
                    <div className="cy-field-label" style={{ marginBottom: 10 }}>STATS</div>
                    {[
                      { label: "Missions Completed", val: "47" },
                      { label: "Contracts Active",   val: "3" },
                      { label: "Threat Level",        val: "OMEGA" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, color: "var(--cy-text-muted)" }}>{row.label}</span>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 13, color: "var(--cy-primary)" }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LABS */}
        {section === "labs" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-title">Labs</div>
              <div className="cy-page-subtitle">EXPERIMENTAL SYSTEMS // ACCESS WITH CAUTION</div>
            </div>
            <div className="cy-page-body">
              <div className="cy-lab-grid">
                {LABS_FEATURES.map(lab => (
                  <div key={lab.title} className="cy-lab-card" data-testid={`lab-${lab.title.replace(/\s/g,"")}`}>
                    <div className="cy-lab-icon"><i className={lab.icon} /></div>
                    <div className="cy-lab-title">{lab.title}</div>
                    <div className="cy-lab-desc">{lab.desc}</div>
                    <div className="cy-lab-status">
                      <span className={`cy-badge ${
                        lab.status === "STABLE"  ? "cy-badge-online" :
                        lab.status === "DANGER"  ? "cy-badge-danger"  :
                        "cy-badge-warn"
                      }`}>{lab.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Terminal in Labs */}
              <div style={{ marginTop: 30, maxWidth: 560 }}>
                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">QUICK TERMINAL ACCESS</div>
                  <div className="cy-terminal" style={{ margin: 0 }}>
                    <div className="cy-terminal-header">
                      <span>LABS.TERMINAL</span>
                      <div className="cy-terminal-dots">
                        <div className="cy-terminal-dot" style={{ background: "#ff5f57" }} />
                        <div className="cy-terminal-dot" style={{ background: "#febc2e" }} />
                        <div className="cy-terminal-dot" style={{ background: "#28c840" }} />
                      </div>
                    </div>
                    <div className="cy-terminal-output" style={{ maxHeight: 120 }}>
                      <div className="cy-log-line cy-log-info">LAB SYSTEMS ONLINE. Type 'help' for commands.</div>
                    </div>
                    <div className="cy-terminal-input-row">
                      <span className="cy-prompt">▶</span>
                      <input
                        className="cy-term-input"
                        type="text"
                        placeholder="enter command..."
                        autoComplete="off"
                        spellCheck={false}
                        data-testid="labs-terminal-input"
                        onKeyDown={e => {
                          if (e.key !== "Enter") return;
                          const v = (e.target as HTMLInputElement).value.trim().toLowerCase();
                          (e.target as HTMLInputElement).value = "";
                          if (!v) return;
                          const r = TERMINAL_CMDS[v];
                          const resp = r ? r.response : `UNKNOWN: '${v}'`;
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TARGETS */}
        {section === "targets" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="cy-page-title">Targets</div>
                  <div className="cy-page-subtitle">DOSSIER ARCHIVE // {TARGETS.length} SUBJECTS LOGGED</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="cy-badge cy-badge-danger" style={{ fontSize: 10, letterSpacing: 1 }}>
                    {TARGETS.filter(t => t.status === "AT LARGE").length} AT LARGE
                  </span>
                  <span className="cy-badge cy-badge-online" style={{ fontSize: 10, letterSpacing: 1 }}>
                    {TARGETS.filter(t => t.status === "NEUTRALIZED").length} NEUTRALIZED
                  </span>
                </div>
              </div>
            </div>
            <div className="cy-page-body">
              <div className="cy-target-grid">
                {TARGETS.map(t => {
                  const threatColor = t.threat >= 80 ? "#ff1744" : t.threat >= 60 ? "#ffb300" : "#00ff41";
                  return (
                    <div key={t.id} className="cy-target-card" data-testid={`target-${t.id}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div className="cy-target-name">{t.name}</div>
                        <span className={`cy-badge ${
                          t.status === "AT LARGE"     ? "cy-badge-danger"  :
                          t.status === "NEUTRALIZED"  ? "cy-badge-online"  :
                          "cy-badge-warn"
                        }`}>{t.status}</span>
                      </div>
                      <div className="cy-target-detail">
                        <div><span style={{ color: "var(--cy-text-muted)" }}>ROLE: </span>{t.role}</div>
                        <div style={{ marginTop: 4 }}><span style={{ color: "var(--cy-text-muted)" }}>LOCATION: </span>{t.location}</div>
                      </div>
                      <div className="cy-target-threat">
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 9, color: "var(--cy-text-muted)", letterSpacing: 1, textTransform: "uppercase" }}>
                          THREAT
                        </span>
                        <div className="cy-threat-bar">
                          <div
                            className="cy-threat-fill"
                            style={{ width: `${t.threat}%`, background: threatColor, boxShadow: `0 0 5px ${threatColor}` }}
                          />
                        </div>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 11, color: threatColor, minWidth: 28, textAlign: "right" }}>
                          {t.threat}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {section === "settings" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-title">Settings</div>
              <div className="cy-page-subtitle">SYSTEM CONFIGURATION // CUSTOMIZE YOUR INTERFACE</div>
            </div>
            <div className="cy-page-body">
              <div className="cy-settings-grid">
                {/* Theme picker */}
                <div className="cy-settings-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="cy-settings-card-title">SYSTEM THEME</div>
                  <div className="cy-theme-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                    {THEMES.map(t => (
                      <div
                        key={t.id}
                        className={`cy-theme-option${theme === t.id ? " selected" : ""}`}
                        onClick={() => setTheme(t.id)}
                        data-testid={`theme-option-${t.id}`}
                      >
                        <div className="cy-theme-dot" style={{ background: t.primary, color: t.primary }} />
                        <div>
                          <div style={{ fontWeight: "bold", fontSize: 11 }}>{t.label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Display options */}
                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">DISPLAY</div>
                  {[
                    { label: "CRT Scanlines",       sub: "Retro screen overlay effect",  key: "crt", val: crtEnabled, set: setCrtEnabled },
                  ].map(row => (
                    <div className="cy-toggle-row" key={row.key}>
                      <div>
                        <div className="cy-toggle-label">{row.label}</div>
                        <div className="cy-toggle-sub">{row.sub}</div>
                      </div>
                      <button
                        className={`cy-toggle-switch${row.val ? " on" : ""}`}
                        onClick={() => row.set((v: boolean) => !v)}
                        data-testid={`toggle-${row.key}`}
                      />
                    </div>
                  ))}
                </div>

                {/* Canvas / paper */}
                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">CANVAS</div>
                  <div className="cy-identity-field">
                    <div className="cy-field-label">CANVAS MODE</div>
                    <select
                      className="cy-select"
                      value={canvasMode}
                      onChange={e => setCanvasMode(e.target.value)}
                      data-testid="settings-canvas"
                    >
                      <option value="canvas-default">Dark</option>
                      <option value="canvas-tinted">Tinted</option>
                      <option value="canvas-blueprint">Blueprint</option>
                      <option value="canvas-void">Void</option>
                      <option value="canvas-neon">Neon Glow</option>
                    </select>
                  </div>
                  <div className="cy-identity-field">
                    <div className="cy-field-label">PAPER PATTERN</div>
                    <select
                      className="cy-select"
                      value={paperPattern}
                      onChange={e => setPaperPattern(e.target.value)}
                      data-testid="settings-paper"
                    >
                      <option value="paper-grid">Grid</option>
                      <option value="paper-dots">Dot Matrix</option>
                      <option value="paper-lines">Lined</option>
                      <option value="paper-blank">Blank</option>
                    </select>
                  </div>
                </div>

                {/* Keyboard shortcuts */}
                <div className="cy-settings-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="cy-settings-card-title">KEYBOARD SHORTCUTS</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                    {[
                      { key: "Ctrl+B", action: "Bold text" },
                      { key: "Ctrl+I", action: "Italic text" },
                      { key: "Ctrl+U", action: "Underline text" },
                      { key: "Ctrl+P", action: "Print / Export" },
                    ].map(s => (
                      <div key={s.key} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 11, color: "var(--cy-text-muted)" }}>{s.action}</span>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 11, color: "var(--cy-primary)", background: "rgba(0,243,255,0.08)", padding: "2px 8px", borderRadius: 3, border: "1px solid rgba(0,243,255,0.2)" }}>
                          {s.key}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── ASSET PANEL ── */}
      <div className={`cy-asset-panel${assetOpen ? " open" : ""}`} data-testid="asset-panel">
        <div className="cy-asset-panel-header">
          <span><i className="fa-solid fa-briefcase" /> ASSET LIBRARY</span>
          <button className="cy-asset-close" onClick={() => setAssetOpen(false)} data-testid="btn-close-assets">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <div className="cy-asset-tabs">
          {(Object.keys(STICKER_CATEGORIES) as Array<keyof typeof STICKER_CATEGORIES>).map(cat => (
            <button
              key={cat}
              className={`cy-asset-tab${assetTab === cat ? " active" : ""}`}
              onClick={() => setAssetTab(cat)}
              data-testid={`asset-tab-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="cy-tag-grid">
          {STICKER_CATEGORIES[assetTab].map(s => (
            <div
              key={s.type}
              className="cy-tag"
              onClick={() => { addSticker(s.type); if (section !== "records") setSection("records"); }}
              data-testid={`sticker-btn-${s.type}`}
            >
              {s.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
