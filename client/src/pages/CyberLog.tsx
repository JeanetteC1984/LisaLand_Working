import { useState, useRef, useEffect, useCallback } from "react";
import "../cyber.css";

type Section = "journal" | "profile" | "vision" | "goals" | "settings";

type JournalFile = {
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
};

const THEMES: Theme[] = [
  { id: "rainbow-dream",   label: "Rainbow Dream",   primary: "#e040fb" },
  { id: "sunset-glow",     label: "Sunset Glow",     primary: "#ff6d00" },
  { id: "ocean-aura",      label: "Ocean Aura",      primary: "#00e5ff" },
  { id: "cosmic-berry",    label: "Cosmic Berry",    primary: "#ff4081" },
  { id: "neon-jungle",     label: "Neon Jungle",     primary: "#69f0ae" },
  { id: "stardust",        label: "Stardust",        primary: "#b388ff" },
  { id: "electric-candy",  label: "Electric Candy",  primary: "#ffd740" },
  { id: "midnight-rose",   label: "Midnight Rose",   primary: "#f48fb1" },
  { id: "aurora",          label: "Aurora",           primary: "#64ffda" },
  { id: "galaxy",          label: "Galaxy",           primary: "#7c4dff" },
];

const INITIAL_FILES: JournalFile[] = [
  {
    id: "1",
    name: "My Dream Year",
    date: "2026-02-28",
    content: `<h1 class="cy-doc-title" id="doc-title">My Dream Year</h1>
<div class="cy-case-meta" contenteditable="false">
  This is the year I become <strong>unstoppable</strong>.<br>
  Status: <span class="pulse-text" style="color:#69f0ae;">IN PROGRESS</span>
</div>
<div class="cy-quote-block">"She believed she could, so she did."</div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  I'm setting intentions for the most vibrant, joyful, purposeful year of my life.
  Every single day is a chance to grow, to sparkle, and to show up as my best self.
  No dream is too big. No goal is out of reach.
</p>`,
  },
  {
    id: "2",
    name: "Daily Gratitude",
    date: "2026-02-27",
    content: `<h1 class="cy-doc-title" id="doc-title">Daily Gratitude</h1>
<div class="cy-case-meta" contenteditable="false">
  Today I am grateful for <strong>new beginnings</strong>.<br>
  Mood: <span style="color:#e040fb;">Radiant</span>
</div>
<div class="cy-quote-block">"Gratitude turns what we have into enough."</div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Three things I'm grateful for today: the warmth of the morning sun, a kind
  word from a friend, and the courage to keep dreaming bigger than yesterday.
</p>`,
  },
  {
    id: "3",
    name: "Vision Board Notes",
    date: "2026-02-25",
    content: `<h1 class="cy-doc-title" id="doc-title">Vision Board Notes</h1>
<div class="cy-case-meta" contenteditable="false">
  Theme: <strong>Abundance & Joy</strong><br>
  Vibe: <span style="color:#ffd740;">Manifesting</span>
</div>
<div class="cy-quote-block">"The universe is conspiring in your favor."</div>
<p style="max-width:600px;margin-bottom:20px;line-height:1.8;">
  Key images for my vision board: a cozy dream home with big windows,
  a passport full of stamps, a thriving garden, and a heart full of peace.
  These aren't just wishes - they're plans.
</p>`,
  },
];

const GOALS = [
  { id: "g1", name: "Run a Half Marathon", category: "Fitness", progress: 65, deadline: "June 2026", status: "ON TRACK" },
  { id: "g2", name: "Read 30 Books", category: "Growth", progress: 40, deadline: "Dec 2026", status: "IN PROGRESS" },
  { id: "g3", name: "Launch My Side Project", category: "Career", progress: 80, deadline: "April 2026", status: "ALMOST THERE" },
  { id: "g4", name: "Save $10K Emergency Fund", category: "Finance", progress: 55, deadline: "Sept 2026", status: "ON TRACK" },
  { id: "g5", name: "Learn to Paint", category: "Creativity", progress: 25, deadline: "Ongoing", status: "JUST STARTED" },
  { id: "g6", name: "Meditate Daily for 90 Days", category: "Wellness", progress: 72, deadline: "May 2026", status: "CRUSHING IT" },
];

const VISION_FEATURES = [
  { icon: "fa-solid fa-heart", title: "SELF LOVE", desc: "Daily affirmations and self-care rituals to nurture your spirit.", status: "ACTIVE" },
  { icon: "fa-solid fa-star", title: "MANIFEST", desc: "Visualization exercises to attract your dream life.", status: "ACTIVE" },
  { icon: "fa-solid fa-seedling", title: "GROW", desc: "Track personal growth milestones and celebrate wins.", status: "ACTIVE" },
  { icon: "fa-solid fa-sun", title: "MORNING RITUAL", desc: "Design your perfect morning routine for energy and clarity.", status: "ACTIVE" },
  { icon: "fa-solid fa-moon", title: "NIGHT REFLECT", desc: "Evening journaling prompts for peace and gratitude.", status: "ACTIVE" },
  { icon: "fa-solid fa-wand-magic-sparkles", title: "DREAM BIG", desc: "Big picture goal mapping and life design tools.", status: "ACTIVE" },
];

const STICKER_CATEGORIES = {
  Vibes: [
    { type: "stamp-yougoal",    label: "YOU GOT THIS" },
    { type: "stamp-approved",   label: "GOALS MET" },
    { type: "stamp-queen",      label: "QUEEN" },
    { type: "stamp-urgent",     label: "PRIORITY" },
    { type: "stamp-void",       label: "LET IT GO" },
  ],
  Symbols: [
    { type: "icon-heart",     label: "HEART" },
    { type: "icon-star",      label: "STAR" },
    { type: "icon-sparkle",   label: "SPARKLE" },
    { type: "tape-rainbow",   label: "RAINBOW BAR" },
    { type: "icon-moon",      label: "MOON" },
  ],
  Notes: [
    { type: "note-pink",    label: "NOTE (Pink)" },
    { type: "note-lilac",   label: "NOTE (Lilac)" },
    { type: "note-mint",    label: "NOTE (Mint)" },
    { type: "note-peach",   label: "NOTE (Peach)" },
  ],
  Art: [
    { type: "svg-butterfly", label: "BUTTERFLY" },
    { type: "svg-rainbow",   label: "RAINBOW" },
    { type: "svg-star",      label: "STAR BURST" },
    { type: "svg-flower",    label: "FLOWER" },
  ],
};

const AFFIRMATION_CMDS: Record<string, { response: string; cls?: string }> = {
  help:      { response: "Try: affirm, breathe, gratitude, goals, sparkle, love, clear" },
  affirm:    { response: "I am worthy, I am capable, I am becoming everything I dream of.", cls: "cy-log-success" },
  breathe:   { response: "Inhale confidence... exhale doubt... You are exactly where you need to be.", cls: "cy-log-info" },
  gratitude: { response: "What are 3 things you're grateful for right now? Write them down.", cls: "cy-log-warn" },
  goals:     { response: "You have 6 active goals and you're crushing it! Keep going.", cls: "cy-log-success" },
  sparkle:   { response: "You literally sparkle. Never dim your light for anyone.", cls: "cy-log-info" },
  love:      { response: "Sending you all the love and positive energy. You deserve the world.", cls: "cy-log-success" },
  clear:     { response: "__CLEAR__" },
};

function getStickerContent(type: string): string {
  switch (type) {
    case "stamp-yougoal":
      return `<div class="stamp-secret">YOU GOT THIS</div>`;
    case "stamp-approved":
      return `<div class="stamp-approved">GOALS MET</div>`;
    case "stamp-queen":
      return `<div class="stamp-classified">QUEEN</div>`;
    case "stamp-urgent":
      return `<div class="stamp-urgent">PRIORITY</div>`;
    case "stamp-void":
      return `<div class="stamp-void">LET GO</div>`;
    case "tape-rainbow":
      return `<div class="tape-warning">DREAM BIG ~ SHINE BRIGHT ~ STAY MAGIC</div>`;
    case "icon-heart":
      return `<i class="fa-solid fa-heart" style="font-size:3.2rem; color:#ff4081; text-shadow: 0 0 14px rgba(255,64,129,0.5);"></i>`;
    case "icon-star":
      return `<i class="fa-solid fa-star" style="font-size:3.2rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5);"></i>`;
    case "icon-sparkle":
      return `<i class="fa-solid fa-wand-magic-sparkles" style="font-size:3rem; color:#e040fb; text-shadow: 0 0 14px rgba(224,64,251,0.5);"></i>`;
    case "icon-moon":
      return `<i class="fa-solid fa-moon" style="font-size:3rem; color:#b388ff; text-shadow: 0 0 14px rgba(179,136,255,0.5);"></i>`;
    case "note-pink":
      return `<div class="sticky-note" style="background:#d81b60;color:#ffe0f0;" contenteditable="true">My thoughts...</div>`;
    case "note-lilac":
      return `<div class="sticky-note" style="background:#7c4dff;color:#ece0ff;" contenteditable="true">My thoughts...</div>`;
    case "note-mint":
      return `<div class="sticky-note" style="background:#00897b;color:#d0fff0;" contenteditable="true">My thoughts...</div>`;
    case "note-peach":
      return `<div class="sticky-note" style="background:#e65100;color:#fff3e0;" contenteditable="true">My thoughts...</div>`;
    case "svg-butterfly":
      return `<svg width="80" height="60" viewBox="0 0 80 60"><ellipse cx="28" cy="22" rx="20" ry="16" fill="rgba(224,64,251,0.3)" stroke="#e040fb" stroke-width="2"/><ellipse cx="52" cy="22" rx="20" ry="16" fill="rgba(124,77,255,0.3)" stroke="#7c4dff" stroke-width="2"/><ellipse cx="30" cy="42" rx="16" ry="12" fill="rgba(255,64,129,0.25)" stroke="#ff4081" stroke-width="1.5"/><ellipse cx="50" cy="42" rx="16" ry="12" fill="rgba(0,229,255,0.25)" stroke="#00e5ff" stroke-width="1.5"/><line x1="40" y1="8" x2="40" y2="56" stroke="#e040fb" stroke-width="2.5"/><circle cx="36" cy="6" r="2" fill="#ffd740"/><circle cx="44" cy="6" r="2" fill="#ffd740"/></svg>`;
    case "svg-rainbow":
      return `<svg width="90" height="50" viewBox="0 0 90 50"><path d="M5 48 A40 40 0 0 1 85 48" fill="none" stroke="#ff4081" stroke-width="4"/><path d="M10 48 A35 35 0 0 1 80 48" fill="none" stroke="#ff6d00" stroke-width="4"/><path d="M15 48 A30 30 0 0 1 75 48" fill="none" stroke="#ffd740" stroke-width="4"/><path d="M20 48 A25 25 0 0 1 70 48" fill="none" stroke="#69f0ae" stroke-width="4"/><path d="M25 48 A20 20 0 0 1 65 48" fill="none" stroke="#00e5ff" stroke-width="4"/><path d="M30 48 A15 15 0 0 1 60 48" fill="none" stroke="#7c4dff" stroke-width="4"/><path d="M35 48 A10 10 0 0 1 55 48" fill="none" stroke="#e040fb" stroke-width="4"/></svg>`;
    case "svg-star":
      return `<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,2 43,26 68,26 48,42 55,66 35,52 15,66 22,42 2,26 27,26" fill="rgba(255,215,64,0.15)" stroke="#ffd740" stroke-width="2"/><polygon points="35,14 40,28 54,28 43,36 47,50 35,43 23,50 27,36 16,28 30,28" fill="rgba(255,215,64,0.2)" stroke="#ffab40" stroke-width="1"/></svg>`;
    case "svg-flower":
      return `<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="18" r="12" fill="rgba(224,64,251,0.3)" stroke="#e040fb" stroke-width="1.5"/><circle cx="50" cy="30" r="12" fill="rgba(255,64,129,0.25)" stroke="#ff4081" stroke-width="1.5"/><circle cx="45" cy="48" r="12" fill="rgba(0,229,255,0.25)" stroke="#00e5ff" stroke-width="1.5"/><circle cx="25" cy="48" r="12" fill="rgba(105,240,174,0.25)" stroke="#69f0ae" stroke-width="1.5"/><circle cx="20" cy="30" r="12" fill="rgba(255,215,64,0.25)" stroke="#ffd740" stroke-width="1.5"/><circle cx="35" cy="35" r="8" fill="rgba(179,136,255,0.4)" stroke="#b388ff" stroke-width="2"/></svg>`;
    default:
      return `<div style="color:var(--cy-primary);font-size:12px;">~</div>`;
  }
}

export default function CyberLog() {
  const [section, setSection] = useState<Section>("journal");
  const [theme, setTheme] = useState("rainbow-dream");
  const [files, setFiles] = useState<JournalFile[]>(INITIAL_FILES);
  const [activeFileId, setActiveFileId] = useState("1");
  const [paperPattern, setPaperPattern] = useState("paper-stars");
  const [canvasMode, setCanvasMode] = useState("canvas-default");
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [assetOpen, setAssetOpen] = useState(false);
  const [assetTab, setAssetTab] = useState<keyof typeof STICKER_CATEGORIES>("Vibes");
  const [terminalLines, setTerminalLines] = useState([
    { text: "Welcome to your safe space...", cls: "" },
    { text: "Today is a beautiful day to chase your dreams.", cls: "cy-log-info" },
    { text: "Type 'help' for affirmation commands.", cls: "cy-log-success" },
  ]);
  const [termCmd, setTermCmd] = useState("");
  const [glitching, setGlitching] = useState(false);
  const [addingFile, setAddingFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [fontChoice, setFontChoice] = useState("Nunito");
  const [identity, setIdentity] = useState({
    handle: "Dreamer",
    clearance: "Unlimited",
    faction: "Self-Love Club",
    location: "Wherever my heart leads",
    bio: "Living boldly, dreaming wildly, and choosing joy every single day.",
  });

  const editorRef = useRef<HTMLDivElement>(null);
  const termOutputRef = useRef<HTMLDivElement>(null);

  const activeFile = files.find(f => f.id === activeFileId) || files[0];

  const initDrag = useCallback((el: HTMLDivElement) => {
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
      el.style.left = ox + (e.clientX - sx) + "px";
      el.style.top  = oy + (e.clientY - sy) + "px";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    el.addEventListener("mousedown", onDown);
  }, []);

  const addSticker = (type: string) => {
    const id = Math.random().toString(36).slice(2);
    const rx = Math.floor(Math.random() * 200) + 60;
    const ry = Math.floor(Math.random() * 200) + 100;
    const rot = type.startsWith("note") || type.startsWith("icon") ? 0 : Math.floor(Math.random() * 24) - 12;
    setStickers(s => [...s, { id, type, x: rx, y: ry, rotation: rot }]);
  };

  const removeSticker = (id: string) => setStickers(s => s.filter(st => st.id !== id));

  useEffect(() => {
    stickers.forEach(st => {
      const el = document.getElementById(`sticker-${st.id}`) as HTMLDivElement | null;
      if (el && !el.dataset.dragging) {
        el.dataset.dragging = "1";
        initDrag(el);
      }
    });
  }, [stickers, initDrag]);

  const formatDoc = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value ?? undefined);
    editorRef.current?.focus();
  };

  const triggerGlitch = () => {
    setGlitching(true);
    setTimeout(() => setGlitching(false), 600);
  };

  const handleTerminal = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const cmd = termCmd.trim().toLowerCase();
    setTermCmd("");
    if (!cmd) return;
    setTerminalLines(lines => [...lines, { text: cmd, cls: "" }]);
    setTimeout(() => {
      const result = AFFIRMATION_CMDS[cmd];
      if (!result) {
        setTerminalLines(l => [...l, { text: `Try 'help' for available commands.`, cls: "cy-log-error" }]);
        return;
      }
      if (result.response === "__CLEAR__") { setTerminalLines([]); return; }
      setTerminalLines(l => [...l, { text: result.response, cls: result.cls || "" }]);
    }, 350);
  };

  useEffect(() => {
    if (termOutputRef.current) termOutputRef.current.scrollTop = termOutputRef.current.scrollHeight;
  }, [terminalLines]);

  const selectFile = (id: string) => {
    if (editorRef.current && activeFileId) {
      setFiles(fs => fs.map(f => f.id === activeFileId ? { ...f, content: editorRef.current!.innerHTML } : f));
    }
    setActiveFileId(id);
  };

  useEffect(() => {
    if (editorRef.current && activeFile) editorRef.current.innerHTML = activeFile.content;
  }, [activeFileId]);

  const confirmAddFile = () => {
    if (!newFileName.trim()) return;
    const id = Math.random().toString(36).slice(2);
    const today = new Date().toISOString().split("T")[0];
    const f: JournalFile = {
      id, name: newFileName.trim(), date: today,
      content: `<h1 class="cy-doc-title" id="doc-title">${newFileName.trim()}</h1>\n<p style="line-height:1.8;">Start writing your story here...</p>`,
    };
    setFiles(fs => [f, ...fs]);
    setNewFileName("");
    setAddingFile(false);
    selectFile(id);
    setSection("journal");
  };

  const ICON_NAV: { icon: string; title: string; section: Section }[] = [
    { icon: "fa-solid fa-user-astronaut", title: "Profile",  section: "profile" },
    { icon: "fa-solid fa-wand-magic-sparkles", title: "Vision", section: "vision" },
    { icon: "fa-solid fa-book-open",     title: "Journal",  section: "journal" },
    { icon: "fa-solid fa-bullseye",      title: "Goals",    section: "goals" },
  ];

  return (
    <div className="cyber-app" data-cyber-theme={theme}>
      {crtEnabled && <div className="crt-overlay" />}

      {/* ICON BAR */}
      <div className="cy-icon-bar">
        {ICON_NAV.map(n => (
          <button
            key={n.section}
            className={`cy-icon-btn${section === n.section ? " active" : ""}`}
            title={n.title}
            data-testid={`nav-${n.section}`}
            onClick={() => setSection(n.section)}
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
          <i className="fa-solid fa-palette" />
        </button>
      </div>

      {/* FILE NAV */}
      <nav className="cy-file-nav">
        <div className="cy-brand">
          <i className="fa-solid fa-sparkles" style={{ WebkitTextFillColor: "unset" }} />
          <span>Dream Log</span>
          <span className="cy-brand-version">v2</span>
        </div>

        <div className="cy-nav-scroll">
          <div className="cy-nav-group">
            <label>VIBE / THEME</label>
            <select className="cy-select" value={theme} onChange={e => setTheme(e.target.value)} data-testid="select-theme">
              {THEMES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>

          <div className="cy-nav-group">
            <div className="cy-section-title">
              <span>MY ENTRIES</span>
              <button className="cy-add-btn" title="New Entry" onClick={() => setAddingFile(v => !v)} data-testid="button-add-file">
                <i className="fa-solid fa-circle-plus" />
              </button>
            </div>
            {addingFile && (
              <div className="cy-new-file-form">
                <input
                  className="cy-new-file-input"
                  placeholder="Entry name..."
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && confirmAddFile()}
                  autoFocus
                  data-testid="input-new-file"
                />
                <button className="cy-new-file-btn" onClick={confirmAddFile} data-testid="button-confirm-file">ADD</button>
              </div>
            )}
            <ul className="cy-file-list">
              {files.map(f => (
                <li key={f.id} className={`cy-file-item${f.id === activeFileId ? " active" : ""}`}
                  onClick={() => { selectFile(f.id); setSection("journal"); }}
                  data-testid={`file-item-${f.id}`}
                >
                  {f.name}
                  <span className="cy-file-date">{f.date}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="cy-nav-group">
            <label>CANVAS</label>
            <select className="cy-select" value={canvasMode} onChange={e => setCanvasMode(e.target.value)} data-testid="select-canvas">
              <option value="canvas-default">Default</option>
              <option value="canvas-tinted">Tinted</option>
              <option value="canvas-blueprint">Gradient</option>
              <option value="canvas-void">Deep Dark</option>
              <option value="canvas-neon">Glow</option>
            </select>
          </div>

          <div className="cy-nav-group">
            <label>PAPER</label>
            <select className="cy-select" value={paperPattern} onChange={e => setPaperPattern(e.target.value)} data-testid="select-paper">
              <option value="paper-stars">Stars</option>
              <option value="paper-hearts">Hearts</option>
              <option value="paper-grid">Grid</option>
              <option value="paper-dots">Dots</option>
              <option value="paper-lines">Lined</option>
              <option value="paper-blank">Blank</option>
            </select>
          </div>
        </div>
      </nav>

      {/* MAIN STAGE */}
      <main className={`cy-main-stage ${canvasMode}`}>

        {/* JOURNAL */}
        {section === "journal" && (
          <div className="cy-section">
            <div className="cy-toolbar">
              <div className="cy-tool-group">
                {[
                  { cmd: "bold", icon: "fa-solid fa-bold", title: "Bold" },
                  { cmd: "italic", icon: "fa-solid fa-italic", title: "Italic" },
                  { cmd: "underline", icon: "fa-solid fa-underline", title: "Underline" },
                  { cmd: "strikeThrough", icon: "fa-solid fa-strikethrough", title: "Strike" },
                ].map(b => (
                  <button key={b.cmd} className="cy-tool-btn" title={b.title} onClick={() => formatDoc(b.cmd)} data-testid={`btn-format-${b.cmd}`}>
                    <i className={b.icon} />
                  </button>
                ))}
              </div>

              <select className="cy-tool-select" style={{ width: 130 }}
                onChange={e => { setFontChoice(e.target.value); formatDoc("fontName", e.target.value); }}
                value={fontChoice} data-testid="select-font"
              >
                <option value="Nunito">Nunito</option>
                <option value="Quicksand">Quicksand</option>
                <option value="Caveat">Handwritten</option>
                <option value="Comfortaa">Comfortaa</option>
              </select>

              <div className="cy-tool-group">
                {[
                  { cmd: "justifyLeft", icon: "fa-solid fa-align-left", title: "Left" },
                  { cmd: "justifyCenter", icon: "fa-solid fa-align-center", title: "Center" },
                  { cmd: "justifyRight", icon: "fa-solid fa-align-right", title: "Right" },
                ].map(b => (
                  <button key={b.cmd} className="cy-tool-btn" title={b.title} onClick={() => formatDoc(b.cmd)} data-testid={`btn-align-${b.cmd}`}>
                    <i className={b.icon} />
                  </button>
                ))}
              </div>

              <div className="cy-tool-group">
                {[
                  { cmd: "insertUnorderedList", icon: "fa-solid fa-list-ul", title: "Bullets" },
                  { cmd: "insertOrderedList", icon: "fa-solid fa-list-ol", title: "Numbers" },
                ].map(b => (
                  <button key={b.cmd} className="cy-tool-btn" title={b.title} onClick={() => formatDoc(b.cmd)} data-testid={`btn-list-${b.cmd}`}>
                    <i className={b.icon} />
                  </button>
                ))}
              </div>

              <button className="cy-glitch-btn" onClick={triggerGlitch} data-testid="btn-glitch">
                <i className="fa-solid fa-wand-magic-sparkles" style={{ marginRight: 5 }} />SPARKLE
              </button>

              <button className="cy-asset-toggle" onClick={() => setAssetOpen(v => !v)} data-testid="btn-assets">
                <i className="fa-solid fa-palette" /> STICKERS
              </button>
            </div>

            <div className="cy-editor-wrap" style={{ position: "relative" }}>
              <div className="cy-sticker-layer">
                {stickers.map(st => (
                  <div key={st.id} id={`sticker-${st.id}`} className="cy-sticker"
                    style={{ left: st.x, top: st.y, transform: `rotate(${st.rotation}deg)` }}
                    data-testid={`sticker-${st.id}`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: getStickerContent(st.type) }} />
                    <div className="cy-sticker-delete" onClick={() => removeSticker(st.id)} title="Remove">
                      <i className="fa-solid fa-xmark" />
                    </div>
                  </div>
                ))}
              </div>
              <div ref={editorRef} contentEditable suppressContentEditableWarning
                className={`cy-active-page ${paperPattern} ${glitching ? "glitch-anim" : ""}`}
                data-testid="editor-page"
              />
            </div>

            <div className="cy-terminal">
              <div className="cy-terminal-header">
                <span>AFFIRMATION BAR</span>
                <div className="cy-terminal-dots">
                  <div className="cy-terminal-dot" style={{ background: "#ff4081" }} />
                  <div className="cy-terminal-dot" style={{ background: "#ffd740" }} />
                  <div className="cy-terminal-dot" style={{ background: "#69f0ae" }} />
                </div>
              </div>
              <div className="cy-terminal-output" ref={termOutputRef}>
                {terminalLines.map((line, i) => (
                  <div key={i} className={`cy-log-line ${line.cls}`}>{line.text}</div>
                ))}
              </div>
              <div className="cy-terminal-input-row">
                <span className="cy-prompt"><i className="fa-solid fa-heart" /></span>
                <input className="cy-term-input" type="text" autoComplete="off" spellCheck={false}
                  value={termCmd} onChange={e => setTermCmd(e.target.value)} onKeyDown={handleTerminal}
                  placeholder="type a command..." data-testid="terminal-input"
                />
              </div>
            </div>
          </div>
        )}

        {/* PROFILE */}
        {section === "profile" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-title">My Profile</div>
              <div className="cy-page-subtitle">WHO I AM & WHO I'M BECOMING</div>
            </div>
            <div className="cy-page-body">
              <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                <div className="cy-identity-card" style={{ flex: "1", minWidth: 280 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                    <div className="cy-identity-avatar">
                      <i className="fa-solid fa-user-astronaut" />
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--cy-font-accent)", fontSize: 24, background: "var(--cy-gradient-rainbow)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        {identity.handle}
                      </div>
                      <div className="cy-badge cy-badge-online" style={{ marginTop: 8 }}>THRIVING</div>
                    </div>
                  </div>
                  {[
                    { label: "YOUR NAME", key: "handle" },
                    { label: "POTENTIAL", key: "clearance" },
                    { label: "TRIBE", key: "faction" },
                    { label: "HAPPY PLACE", key: "location" },
                  ].map(f => (
                    <div className="cy-identity-field" key={f.key}>
                      <div className="cy-field-label">{f.label}</div>
                      <input className="cy-field-input"
                        value={identity[f.key as keyof typeof identity]}
                        onChange={e => setIdentity(id => ({ ...id, [f.key]: e.target.value }))}
                        data-testid={`identity-${f.key}`}
                      />
                    </div>
                  ))}
                  <div className="cy-identity-field">
                    <div className="cy-field-label">ABOUT ME</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 80 }}
                      value={identity.bio}
                      onChange={e => setIdentity(id => ({ ...id, bio: e.target.value }))}
                      data-testid="identity-bio"
                    />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14, minWidth: 200 }}>
                  <div className="cy-identity-card" style={{ padding: 18 }}>
                    <div className="cy-field-label" style={{ marginBottom: 12 }}>LIFE STATS</div>
                    {[
                      { label: "Energy Level", val: "HIGH", cls: "cy-badge-online" },
                      { label: "Self-Care",    val: "PRIORITY", cls: "cy-badge-online" },
                      { label: "Confidence",   val: "GROWING", cls: "cy-badge-warn" },
                      { label: "Joy",          val: "ABUNDANT", cls: "cy-badge-online" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, fontWeight: 500, color: "var(--cy-text-muted)" }}>{row.label}</span>
                        <span className={`cy-badge ${row.cls}`}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                  <div className="cy-identity-card" style={{ padding: 18 }}>
                    <div className="cy-field-label" style={{ marginBottom: 12 }}>QUICK STATS</div>
                    {[
                      { label: "Goals Active", val: "6" },
                      { label: "Journal Entries", val: String(files.length) },
                      { label: "Days Journaling", val: "42" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, fontWeight: 500, color: "var(--cy-text-muted)" }}>{row.label}</span>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 13, fontWeight: 700, color: "var(--cy-primary)" }}>{row.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VISION */}
        {section === "vision" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div className="cy-page-title">Vision Board</div>
              <div className="cy-page-subtitle">TOOLS FOR MANIFESTING YOUR DREAM LIFE</div>
            </div>
            <div className="cy-page-body">
              <div className="cy-lab-grid">
                {VISION_FEATURES.map(lab => (
                  <div key={lab.title} className="cy-lab-card" data-testid={`vision-${lab.title.replace(/\s/g,"")}`}>
                    <div className="cy-lab-icon"><i className={lab.icon} /></div>
                    <div className="cy-lab-title">{lab.title}</div>
                    <div className="cy-lab-desc">{lab.desc}</div>
                    <div className="cy-lab-status">
                      <span className="cy-badge cy-badge-online">{lab.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GOALS */}
        {section === "goals" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="cy-page-title">My Goals</div>
                  <div className="cy-page-subtitle">TRACK YOUR PROGRESS ~ CELEBRATE YOUR WINS</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="cy-badge cy-badge-online" style={{ fontSize: 10 }}>
                    {GOALS.filter(g => g.progress >= 70).length} ALMOST THERE
                  </span>
                  <span className="cy-badge cy-badge-warn" style={{ fontSize: 10 }}>
                    {GOALS.filter(g => g.progress < 70).length} IN PROGRESS
                  </span>
                </div>
              </div>
            </div>
            <div className="cy-page-body">
              <div className="cy-target-grid">
                {GOALS.map(g => {
                  const barColor = g.progress >= 70 ? "#69f0ae" : g.progress >= 40 ? "#ffd740" : "#ff4081";
                  return (
                    <div key={g.id} className="cy-target-card" data-testid={`goal-${g.id}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div className="cy-target-name">{g.name}</div>
                        <span className={`cy-badge ${g.progress >= 70 ? "cy-badge-online" : "cy-badge-warn"}`}>{g.status}</span>
                      </div>
                      <div className="cy-target-detail">
                        <div><span style={{ color: "var(--cy-text-muted)" }}>Category: </span>{g.category}</div>
                        <div style={{ marginTop: 4 }}><span style={{ color: "var(--cy-text-muted)" }}>Deadline: </span>{g.deadline}</div>
                      </div>
                      <div className="cy-target-threat">
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 10, fontWeight: 600, color: "var(--cy-text-muted)", letterSpacing: 1 }}>
                          PROGRESS
                        </span>
                        <div className="cy-threat-bar">
                          <div className="cy-threat-fill" style={{ width: `${g.progress}%`, background: `linear-gradient(90deg, ${barColor}, var(--cy-primary))`, boxShadow: `0 0 8px ${barColor}` }} />
                        </div>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, fontWeight: 700, color: barColor, minWidth: 32, textAlign: "right" }}>
                          {g.progress}%
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
              <div className="cy-page-title">Customize</div>
              <div className="cy-page-subtitle">MAKE IT YOURS ~ MAKE IT BEAUTIFUL</div>
            </div>
            <div className="cy-page-body">
              <div className="cy-settings-grid">
                <div className="cy-settings-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="cy-settings-card-title">VIBE / THEME</div>
                  <div className="cy-theme-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                    {THEMES.map(t => (
                      <div key={t.id} className={`cy-theme-option${theme === t.id ? " selected" : ""}`}
                        onClick={() => setTheme(t.id)} data-testid={`theme-option-${t.id}`}
                      >
                        <div className="cy-theme-dot" style={{ background: t.primary, color: t.primary }} />
                        <div><div style={{ fontWeight: 600, fontSize: 11 }}>{t.label}</div></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">DISPLAY</div>
                  <div className="cy-toggle-row">
                    <div>
                      <div className="cy-toggle-label">Sparkle Overlay</div>
                      <div className="cy-toggle-sub">Dreamy floating sparkle particles</div>
                    </div>
                    <button className={`cy-toggle-switch${crtEnabled ? " on" : ""}`}
                      onClick={() => setCrtEnabled(v => !v)} data-testid="toggle-crt" />
                  </div>
                </div>

                <div className="cy-settings-card">
                  <div className="cy-settings-card-title">CANVAS</div>
                  <div className="cy-identity-field">
                    <div className="cy-field-label">CANVAS MODE</div>
                    <select className="cy-select" value={canvasMode}
                      onChange={e => setCanvasMode(e.target.value)} data-testid="settings-canvas"
                    >
                      <option value="canvas-default">Default</option>
                      <option value="canvas-tinted">Tinted</option>
                      <option value="canvas-blueprint">Gradient</option>
                      <option value="canvas-void">Deep Dark</option>
                      <option value="canvas-neon">Glow</option>
                    </select>
                  </div>
                  <div className="cy-identity-field">
                    <div className="cy-field-label">PAPER PATTERN</div>
                    <select className="cy-select" value={paperPattern}
                      onChange={e => setPaperPattern(e.target.value)} data-testid="settings-paper"
                    >
                      <option value="paper-stars">Stars</option>
                      <option value="paper-hearts">Hearts</option>
                      <option value="paper-grid">Grid</option>
                      <option value="paper-dots">Dots</option>
                      <option value="paper-lines">Lined</option>
                      <option value="paper-blank">Blank</option>
                    </select>
                  </div>
                </div>

                <div className="cy-settings-card" style={{ gridColumn: "1 / -1" }}>
                  <div className="cy-settings-card-title">TIPS</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                    {[
                      { key: "Ctrl+B", action: "Bold text" },
                      { key: "Ctrl+I", action: "Italic text" },
                      { key: "Ctrl+U", action: "Underline text" },
                      { key: "Ctrl+P", action: "Print / Export" },
                    ].map(s => (
                      <div key={s.key} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "var(--cy-border)" }}>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 12, fontWeight: 500, color: "var(--cy-text-muted)" }}>{s.action}</span>
                        <span style={{ fontFamily: "var(--cy-font-ui)", fontSize: 11, fontWeight: 600, color: "var(--cy-primary)", background: "rgba(224,64,251,0.08)", padding: "3px 10px", borderRadius: 8, border: "1px solid rgba(224,64,251,0.15)" }}>
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

      {/* ASSET PANEL */}
      <div className={`cy-asset-panel${assetOpen ? " open" : ""}`} data-testid="asset-panel">
        <div className="cy-asset-panel-header">
          <span><i className="fa-solid fa-palette" style={{ marginRight: 8 }} />STICKER LIBRARY</span>
          <button className="cy-asset-close" onClick={() => setAssetOpen(false)} data-testid="btn-close-assets">
            <i className="fa-solid fa-xmark" />
          </button>
        </div>
        <div className="cy-asset-tabs">
          {(Object.keys(STICKER_CATEGORIES) as Array<keyof typeof STICKER_CATEGORIES>).map(cat => (
            <button key={cat} className={`cy-asset-tab${assetTab === cat ? " active" : ""}`}
              onClick={() => setAssetTab(cat)} data-testid={`asset-tab-${cat}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="cy-tag-grid">
          {STICKER_CATEGORIES[assetTab].map(s => (
            <div key={s.type} className="cy-tag"
              onClick={() => { addSticker(s.type); if (section !== "journal") setSection("journal"); }}
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
