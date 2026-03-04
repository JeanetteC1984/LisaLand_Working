import { useState, useRef, useEffect, useCallback } from "react";
import "../cyber.css";

type Section = "journal" | "profile" | "vision" | "goals" | "mindmap" | "settings";

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

type Goal = {
  id: string;
  name: string;
  specific: string;
  measurable: string;
  achievable: string;
  relevant: string;
  timeBound: string;
  category: string;
  progress: number;
  status: string;
};

type MindMapNode = {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  parentId: string | null;
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
  { id: "cotton-candy",    label: "Cotton Candy",    primary: "#f8bbd0" },
  { id: "lemonade",        label: "Lemonade",        primary: "#fff176" },
  { id: "lavender-mist",   label: "Lavender Mist",   primary: "#ce93d8" },
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

const INITIAL_GOALS: Goal[] = [
  { id: "g1", name: "Run a Half Marathon", specific: "Complete a half marathon race", measurable: "Finish 13.1 miles under 2 hours", achievable: "Following a 16-week training plan", relevant: "Improves my health and builds discipline", timeBound: "June 2026", category: "Fitness", progress: 65, status: "ON TRACK" },
  { id: "g2", name: "Read 30 Books", specific: "Read 30 books across different genres", measurable: "Track each book completed on my reading list", achievable: "2-3 books per month is doable", relevant: "Expands my knowledge and creativity", timeBound: "Dec 2026", category: "Growth", progress: 40, status: "IN PROGRESS" },
  { id: "g3", name: "Launch My Side Project", specific: "Ship my app to production with paying users", measurable: "Get 50 signups in the first month", achievable: "MVP is 80% built already", relevant: "Steps me toward financial independence", timeBound: "April 2026", category: "Career", progress: 80, status: "ALMOST THERE" },
  { id: "g4", name: "Save $10K Emergency Fund", specific: "Build a $10,000 emergency savings cushion", measurable: "Track balance monthly toward $10K target", achievable: "Saving $800/month from budget adjustments", relevant: "Financial security gives me peace of mind", timeBound: "Sept 2026", category: "Finance", progress: 55, status: "ON TRACK" },
  { id: "g5", name: "Learn to Paint", specific: "Learn watercolor painting fundamentals", measurable: "Complete 12 paintings and 1 online course", achievable: "Practice 2 sessions per week", relevant: "Creative expression brings me joy", timeBound: "Ongoing", category: "Creativity", progress: 25, status: "JUST STARTED" },
  { id: "g6", name: "Meditate Daily for 90 Days", specific: "Meditate for at least 10 minutes every day", measurable: "90 consecutive days tracked in my habit app", achievable: "Starting with guided meditations", relevant: "Mental clarity and stress reduction", timeBound: "May 2026", category: "Wellness", progress: 72, status: "CRUSHING IT" },
];

const GOAL_CATEGORIES = ["Fitness", "Growth", "Career", "Finance", "Creativity", "Wellness", "Relationships", "Health", "Travel", "Other"];

const EMPTY_GOAL_FORM = {
  name: "",
  specific: "",
  measurable: "",
  achievable: "",
  relevant: "",
  timeBound: "",
  category: "Growth",
};

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
    { type: "stamp-slay",       label: "SLAY" },
    { type: "stamp-blessed",    label: "BLESSED" },
    { type: "stamp-manifest",   label: "MANIFEST" },
    { type: "stamp-dreamer",    label: "DREAMER" },
    { type: "stamp-iconic",     label: "ICONIC" },
    { type: "stamp-worthy",     label: "WORTHY" },
    { type: "stamp-main-char",  label: "MAIN CHARACTER" },
  ],
  Symbols: [
    { type: "icon-heart",     label: "HEART" },
    { type: "icon-star",      label: "STAR" },
    { type: "icon-sparkle",   label: "SPARKLE" },
    { type: "tape-rainbow",   label: "RAINBOW BAR" },
    { type: "icon-moon",      label: "MOON" },
    { type: "icon-sun",       label: "SUN" },
    { type: "icon-crown",     label: "CROWN" },
    { type: "icon-fire",      label: "FIRE" },
    { type: "icon-gem",       label: "GEM" },
    { type: "icon-bolt",      label: "BOLT" },
    { type: "icon-dove",      label: "DOVE" },
    { type: "icon-infinity",  label: "INFINITY" },
    { type: "icon-eye",       label: "EYE" },
    { type: "icon-feather",   label: "FEATHER" },
    { type: "icon-clover",    label: "CLOVER" },
    { type: "icon-ribbon",    label: "RIBBON" },
  ],
  Emoji: [
    { type: "emoji-sparkles",   label: "SPARKLES" },
    { type: "emoji-rainbow",    label: "RAINBOW" },
    { type: "emoji-butterfly",  label: "BUTTERFLY" },
    { type: "emoji-star-eyes",  label: "STAR EYES" },
    { type: "emoji-fire",       label: "FIRE" },
    { type: "emoji-hearts",     label: "HEARTS" },
    { type: "emoji-crystalball",label: "CRYSTAL BALL" },
    { type: "emoji-unicorn",    label: "UNICORN" },
    { type: "emoji-crown",      label: "CROWN" },
    { type: "emoji-cherries",   label: "CHERRIES" },
    { type: "emoji-blossom",    label: "BLOSSOM" },
    { type: "emoji-shooting",   label: "SHOOTING STAR" },
  ],
  Notes: [
    { type: "note-pink",    label: "NOTE (Pink)" },
    { type: "note-lilac",   label: "NOTE (Lilac)" },
    { type: "note-mint",    label: "NOTE (Mint)" },
    { type: "note-peach",   label: "NOTE (Peach)" },
    { type: "note-gold",    label: "NOTE (Gold)" },
    { type: "note-sky",     label: "NOTE (Sky)" },
    { type: "note-rose",    label: "NOTE (Rose)" },
    { type: "note-neon",    label: "NOTE (Neon)" },
  ],
  Art: [
    { type: "svg-butterfly", label: "BUTTERFLY" },
    { type: "svg-rainbow",   label: "RAINBOW" },
    { type: "svg-star",      label: "STAR BURST" },
    { type: "svg-flower",    label: "FLOWER" },
    { type: "svg-diamond",   label: "DIAMOND" },
    { type: "svg-cloud",     label: "CLOUD" },
    { type: "svg-dolphin",   label: "DOLPHIN" },
    { type: "svg-unicorn",   label: "UNICORN" },
    { type: "svg-heart-wings", label: "WINGED HEART" },
    { type: "svg-crescent",    label: "CRESCENT" },
    { type: "svg-lotus",       label: "LOTUS" },
    { type: "svg-cat",         label: "CAT" },
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
      return `<div class="sticky-note" style="background:#d81b60;color:#ffe0f0;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-lilac":
      return `<div class="sticky-note" style="background:#7c4dff;color:#ece0ff;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-mint":
      return `<div class="sticky-note" style="background:#00897b;color:#d0fff0;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-peach":
      return `<div class="sticky-note" style="background:#e65100;color:#fff3e0;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "svg-butterfly":
      return `<svg width="80" height="60" viewBox="0 0 80 60"><ellipse cx="28" cy="22" rx="20" ry="16" fill="rgba(224,64,251,0.3)" stroke="#e040fb" stroke-width="2"/><ellipse cx="52" cy="22" rx="20" ry="16" fill="rgba(124,77,255,0.3)" stroke="#7c4dff" stroke-width="2"/><ellipse cx="30" cy="42" rx="16" ry="12" fill="rgba(255,64,129,0.25)" stroke="#ff4081" stroke-width="1.5"/><ellipse cx="50" cy="42" rx="16" ry="12" fill="rgba(0,229,255,0.25)" stroke="#00e5ff" stroke-width="1.5"/><line x1="40" y1="8" x2="40" y2="56" stroke="#e040fb" stroke-width="2.5"/><circle cx="36" cy="6" r="2" fill="#ffd740"/><circle cx="44" cy="6" r="2" fill="#ffd740"/></svg>`;
    case "svg-rainbow":
      return `<svg width="90" height="50" viewBox="0 0 90 50"><path d="M5 48 A40 40 0 0 1 85 48" fill="none" stroke="#ff4081" stroke-width="4"/><path d="M10 48 A35 35 0 0 1 80 48" fill="none" stroke="#ff6d00" stroke-width="4"/><path d="M15 48 A30 30 0 0 1 75 48" fill="none" stroke="#ffd740" stroke-width="4"/><path d="M20 48 A25 25 0 0 1 70 48" fill="none" stroke="#69f0ae" stroke-width="4"/><path d="M25 48 A20 20 0 0 1 65 48" fill="none" stroke="#00e5ff" stroke-width="4"/><path d="M30 48 A15 15 0 0 1 60 48" fill="none" stroke="#7c4dff" stroke-width="4"/><path d="M35 48 A10 10 0 0 1 55 48" fill="none" stroke="#e040fb" stroke-width="4"/></svg>`;
    case "svg-star":
      return `<svg width="70" height="70" viewBox="0 0 70 70"><polygon points="35,2 43,26 68,26 48,42 55,66 35,52 15,66 22,42 2,26 27,26" fill="rgba(255,215,64,0.15)" stroke="#ffd740" stroke-width="2"/><polygon points="35,14 40,28 54,28 43,36 47,50 35,43 23,50 27,36 16,28 30,28" fill="rgba(255,215,64,0.2)" stroke="#ffab40" stroke-width="1"/></svg>`;
    case "svg-flower":
      return `<svg width="70" height="70" viewBox="0 0 70 70"><circle cx="35" cy="18" r="12" fill="rgba(224,64,251,0.3)" stroke="#e040fb" stroke-width="1.5"/><circle cx="50" cy="30" r="12" fill="rgba(255,64,129,0.25)" stroke="#ff4081" stroke-width="1.5"/><circle cx="45" cy="48" r="12" fill="rgba(0,229,255,0.25)" stroke="#00e5ff" stroke-width="1.5"/><circle cx="25" cy="48" r="12" fill="rgba(105,240,174,0.25)" stroke="#69f0ae" stroke-width="1.5"/><circle cx="20" cy="30" r="12" fill="rgba(255,215,64,0.25)" stroke="#ffd740" stroke-width="1.5"/><circle cx="35" cy="35" r="8" fill="rgba(179,136,255,0.4)" stroke="#b388ff" stroke-width="2"/></svg>`;
    case "svg-diamond":
      return `<svg width="60" height="70" viewBox="0 0 60 70"><polygon points="30,5 55,25 45,65 15,65 5,25" fill="rgba(0,229,255,0.12)" stroke="#00e5ff" stroke-width="2"/><polygon points="30,5 45,25 30,65 15,25" fill="rgba(124,77,255,0.1)" stroke="#7c4dff" stroke-width="1"/><line x1="5" y1="25" x2="55" y2="25" stroke="#e040fb" stroke-width="1.5"/><line x1="30" y1="5" x2="30" y2="65" stroke="rgba(255,215,64,0.3)" stroke-width="1"/></svg>`;
    case "svg-cloud":
      return `<svg width="90" height="55" viewBox="0 0 90 55"><ellipse cx="45" cy="35" rx="30" ry="18" fill="rgba(179,136,255,0.2)" stroke="#b388ff" stroke-width="2"/><ellipse cx="28" cy="30" rx="20" ry="16" fill="rgba(224,64,251,0.15)" stroke="#e040fb" stroke-width="1.5"/><ellipse cx="62" cy="30" rx="20" ry="16" fill="rgba(0,229,255,0.15)" stroke="#00e5ff" stroke-width="1.5"/><ellipse cx="45" cy="22" rx="16" ry="14" fill="rgba(255,64,129,0.1)" stroke="#ff4081" stroke-width="1.5"/></svg>`;
    case "svg-dolphin":
      return `<svg width="80" height="60" viewBox="0 0 80 60"><path d="M15 35 Q25 15 45 20 Q60 22 70 35 Q65 40 55 38 Q45 42 35 40 Q25 42 15 35Z" fill="rgba(0,229,255,0.2)" stroke="#00e5ff" stroke-width="2"/><circle cx="35" cy="28" r="2" fill="#00e5ff"/><path d="M65 32 Q72 25 75 30" fill="none" stroke="#00e5ff" stroke-width="1.5"/><path d="M18 33 Q10 25 8 30 Q6 35 15 35" fill="rgba(124,77,255,0.2)" stroke="#7c4dff" stroke-width="1.5"/></svg>`;
    case "svg-unicorn":
      return `<svg width="70" height="80" viewBox="0 0 70 80"><ellipse cx="35" cy="50" rx="22" ry="25" fill="rgba(224,64,251,0.15)" stroke="#e040fb" stroke-width="2"/><ellipse cx="35" cy="35" rx="14" ry="16" fill="rgba(255,64,129,0.12)" stroke="#ff4081" stroke-width="1.5"/><polygon points="35,2 31,22 39,22" fill="rgba(255,215,64,0.3)" stroke="#ffd740" stroke-width="1.5"/><circle cx="30" cy="33" r="2" fill="#7c4dff"/><path d="M22 40 Q15 50 10 45" fill="none" stroke="#e040fb" stroke-width="2"/><path d="M48 40 Q55 50 60 45" fill="none" stroke="#00e5ff" stroke-width="2"/><path d="M20 55 Q10 70 18 72 Q25 68 22 58" fill="rgba(105,240,174,0.15)" stroke="#69f0ae" stroke-width="1.5"/><path d="M50 55 Q60 70 52 72 Q45 68 48 58" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="1.5"/></svg>`;
    case "stamp-slay":
      return `<div class="stamp-secret" style="border-color:#e040fb;color:#e040fb;">SLAY</div>`;
    case "stamp-blessed":
      return `<div class="stamp-approved" style="border-color:#ffd740;color:#ffd740;">BLESSED</div>`;
    case "stamp-manifest":
      return `<div class="stamp-urgent" style="border-color:#b388ff;color:#b388ff;background:rgba(179,136,255,0.08);">MANIFEST</div>`;
    case "icon-sun":
      return `<i class="fa-solid fa-sun" style="font-size:3rem; color:#ffab40; text-shadow: 0 0 14px rgba(255,171,64,0.5);"></i>`;
    case "icon-crown":
      return `<i class="fa-solid fa-crown" style="font-size:3rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5);"></i>`;
    case "icon-fire":
      return `<i class="fa-solid fa-fire" style="font-size:3rem; color:#ff6d00; text-shadow: 0 0 14px rgba(255,109,0,0.5);"></i>`;
    case "icon-gem":
      return `<i class="fa-solid fa-gem" style="font-size:3rem; color:#00e5ff; text-shadow: 0 0 14px rgba(0,229,255,0.5);"></i>`;
    case "icon-bolt":
      return `<i class="fa-solid fa-bolt" style="font-size:3rem; color:#ffd740; text-shadow: 0 0 14px rgba(255,215,64,0.5);"></i>`;
    case "note-gold":
      return `<div class="sticky-note" style="background:#f9a825;color:#3e2723;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-sky":
      return `<div class="sticky-note" style="background:#0288d1;color:#e1f5fe;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-rose":
      return `<div class="sticky-note" style="background:#ad1457;color:#fce4ec;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "note-neon":
      return `<div class="sticky-note" style="background:#1b5e20;color:#b9f6ca;"><div class="cy-note-drag-handle"><i class="fa-solid fa-grip"></i></div><div contenteditable="true" class="cy-note-body">My thoughts...</div></div>`;
    case "stamp-dreamer":
      return `<div class="stamp-secret" style="border-color:#00e5ff;color:#00e5ff;">DREAMER</div>`;
    case "stamp-iconic":
      return `<div class="stamp-approved" style="border-color:#ff4081;color:#ff4081;">ICONIC</div>`;
    case "stamp-worthy":
      return `<div class="stamp-classified" style="border-color:#69f0ae;color:#69f0ae;">WORTHY</div>`;
    case "stamp-main-char":
      return `<div class="stamp-urgent" style="border-color:#ffab40;color:#ffab40;background:rgba(255,171,64,0.08);">MAIN CHARACTER</div>`;
    case "icon-dove":
      return `<i class="fa-solid fa-dove" style="font-size:3rem; color:#b388ff; text-shadow: 0 0 14px rgba(179,136,255,0.5);"></i>`;
    case "icon-infinity":
      return `<i class="fa-solid fa-infinity" style="font-size:3rem; color:#e040fb; text-shadow: 0 0 14px rgba(224,64,251,0.5);"></i>`;
    case "icon-eye":
      return `<i class="fa-solid fa-eye" style="font-size:3rem; color:#64ffda; text-shadow: 0 0 14px rgba(100,255,218,0.5);"></i>`;
    case "icon-feather":
      return `<i class="fa-solid fa-feather" style="font-size:3rem; color:#ff4081; text-shadow: 0 0 14px rgba(255,64,129,0.5);"></i>`;
    case "icon-clover":
      return `<i class="fa-solid fa-clover" style="font-size:3rem; color:#69f0ae; text-shadow: 0 0 14px rgba(105,240,174,0.5);"></i>`;
    case "icon-ribbon":
      return `<i class="fa-solid fa-ribbon" style="font-size:3rem; color:#f48fb1; text-shadow: 0 0 14px rgba(244,143,177,0.5);"></i>`;
    case "emoji-sparkles":
      return `<span style="font-size:3.5rem;">✨</span>`;
    case "emoji-rainbow":
      return `<span style="font-size:3.5rem;">🌈</span>`;
    case "emoji-butterfly":
      return `<span style="font-size:3.5rem;">🦋</span>`;
    case "emoji-star-eyes":
      return `<span style="font-size:3.5rem;">🤩</span>`;
    case "emoji-fire":
      return `<span style="font-size:3.5rem;">🔥</span>`;
    case "emoji-hearts":
      return `<span style="font-size:3.5rem;">💖</span>`;
    case "emoji-crystalball":
      return `<span style="font-size:3.5rem;">🔮</span>`;
    case "emoji-unicorn":
      return `<span style="font-size:3.5rem;">🦄</span>`;
    case "emoji-crown":
      return `<span style="font-size:3.5rem;">👑</span>`;
    case "emoji-cherries":
      return `<span style="font-size:3.5rem;">🍒</span>`;
    case "emoji-blossom":
      return `<span style="font-size:3.5rem;">🌸</span>`;
    case "emoji-shooting":
      return `<span style="font-size:3.5rem;">🌠</span>`;
    case "svg-heart-wings":
      return `<svg width="90" height="60" viewBox="0 0 90 60"><path d="M45 50 Q30 35 20 25 Q10 15 20 8 Q30 0 45 15 Q60 0 70 8 Q80 15 70 25 Q60 35 45 50Z" fill="rgba(255,64,129,0.2)" stroke="#ff4081" stroke-width="2"/><path d="M18 22 Q5 15 2 25 Q-1 35 15 30" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="1.5"/><path d="M12 18 Q2 10 0 20 Q-2 28 12 25" fill="rgba(224,64,251,0.1)" stroke="#e040fb" stroke-width="1"/><path d="M72 22 Q85 15 88 25 Q91 35 75 30" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="1.5"/><path d="M78 18 Q88 10 90 20 Q92 28 78 25" fill="rgba(224,64,251,0.1)" stroke="#e040fb" stroke-width="1"/></svg>`;
    case "svg-crescent":
      return `<svg width="60" height="70" viewBox="0 0 60 70"><path d="M40 5 A28 28 0 1 0 40 65 A22 22 0 1 1 40 5Z" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="2"/><circle cx="20" cy="18" r="1.5" fill="#ffd740"/><circle cx="12" cy="38" r="1" fill="#ffd740"/><circle cx="25" cy="52" r="1.2" fill="#ffd740"/><circle cx="38" cy="15" r="0.8" fill="#e040fb"/></svg>`;
    case "svg-lotus":
      return `<svg width="80" height="60" viewBox="0 0 80 60"><path d="M40 55 Q30 40 20 30 Q10 20 20 12 Q30 5 40 15" fill="rgba(244,143,177,0.2)" stroke="#f48fb1" stroke-width="1.5"/><path d="M40 55 Q50 40 60 30 Q70 20 60 12 Q50 5 40 15" fill="rgba(206,147,216,0.2)" stroke="#ce93d8" stroke-width="1.5"/><path d="M40 55 Q25 38 15 35 Q5 32 12 22 Q20 12 40 20" fill="rgba(255,64,129,0.12)" stroke="#ff4081" stroke-width="1"/><path d="M40 55 Q55 38 65 35 Q75 32 68 22 Q60 12 40 20" fill="rgba(124,77,255,0.12)" stroke="#7c4dff" stroke-width="1"/><ellipse cx="40" cy="30" rx="6" ry="4" fill="rgba(255,215,64,0.3)" stroke="#ffd740" stroke-width="1"/></svg>`;
    case "svg-cat":
      return `<svg width="60" height="70" viewBox="0 0 60 70"><ellipse cx="30" cy="45" rx="20" ry="22" fill="rgba(224,64,251,0.12)" stroke="#e040fb" stroke-width="2"/><ellipse cx="30" cy="32" rx="16" ry="14" fill="rgba(179,136,255,0.15)" stroke="#b388ff" stroke-width="1.5"/><polygon points="16,26 10,8 22,20" fill="rgba(255,64,129,0.15)" stroke="#ff4081" stroke-width="1.5"/><polygon points="44,26 50,8 38,20" fill="rgba(255,64,129,0.15)" stroke="#ff4081" stroke-width="1.5"/><circle cx="24" cy="30" r="2.5" fill="#00e5ff"/><circle cx="36" cy="30" r="2.5" fill="#00e5ff"/><ellipse cx="30" cy="36" rx="2" ry="1.5" fill="#ff4081"/><path d="M25 38 Q30 42 35 38" fill="none" stroke="#ff4081" stroke-width="1"/><path d="M8 58 Q20 65 30 68 Q40 65 52 58" fill="none" stroke="#e040fb" stroke-width="1.5" stroke-dasharray="3 3"/></svg>`;
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
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalForm, setGoalForm] = useState({ ...EMPTY_GOAL_FORM });
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const NODE_COLORS = ["#e040fb", "#7c4dff", "#00e5ff", "#69f0ae", "#ffd740", "#ff4081", "#ffab40", "#b388ff", "#64ffda", "#ff6d00"];
  const [mindMapNodes, setMindMapNodes] = useState<MindMapNode[]>([
    { id: "root", text: "My Dream Life", x: 400, y: 300, color: "#e040fb", parentId: null },
    { id: "n1", text: "Career Goals", x: 200, y: 150, color: "#7c4dff", parentId: "root" },
    { id: "n2", text: "Health & Wellness", x: 600, y: 150, color: "#69f0ae", parentId: "root" },
    { id: "n3", text: "Relationships", x: 200, y: 450, color: "#ff4081", parentId: "root" },
    { id: "n4", text: "Personal Growth", x: 600, y: 450, color: "#00e5ff", parentId: "root" },
    { id: "n5", text: "Financial Freedom", x: 100, y: 300, color: "#ffd740", parentId: "root" },
  ]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [newNodeText, setNewNodeText] = useState("");
  const mindMapRef = useRef<HTMLDivElement>(null);
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

  const initDrag = useCallback((el: HTMLDivElement, stickerId: string) => {
    let ox = 0, oy = 0, sx = 0, sy = 0;
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("cy-sticker-delete")) return;
      if (target.getAttribute("contenteditable") === "true" || target.closest("[contenteditable='true']")) {
        if (!target.classList.contains("cy-note-drag-handle") && !target.closest(".cy-note-drag-handle")) return;
      }
      e.preventDefault();
      sx = e.clientX; sy = e.clientY;
      ox = el.offsetLeft; oy = el.offsetTop;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const nx = ox + (e.clientX - sx);
      const ny = oy + (e.clientY - sy);
      el.style.left = nx + "px";
      el.style.top  = ny + "px";
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
      const nx = parseInt(el.style.left) || 0;
      const ny = parseInt(el.style.top) || 0;
      setStickers(prev => prev.map(s => s.id === stickerId ? { ...s, x: nx, y: ny } : s));
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
        initDrag(el, st.id);
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

  const addGoal = () => {
    const { name, specific, measurable, achievable, relevant, timeBound, category } = goalForm;
    if (!name.trim() || !specific.trim() || !measurable.trim() || !achievable.trim() || !relevant.trim() || !timeBound.trim()) return;
    const id = "g" + Math.random().toString(36).slice(2);
    const newGoal: Goal = {
      id,
      name: name.trim(),
      specific: specific.trim(),
      measurable: measurable.trim(),
      achievable: achievable.trim(),
      relevant: relevant.trim(),
      timeBound: timeBound.trim(),
      category,
      progress: 0,
      status: "JUST STARTED",
    };
    setGoals(g => [newGoal, ...g]);
    setGoalForm({ ...EMPTY_GOAL_FORM });
    setShowGoalForm(false);
  };

  const deleteGoal = (id: string) => {
    setGoals(g => g.filter(goal => goal.id !== id));
    if (expandedGoal === id) setExpandedGoal(null);
  };

  const addMindMapNode = (parentId: string) => {
    const parent = mindMapNodes.find(n => n.id === parentId);
    if (!parent) return;
    const id = "mm" + Math.random().toString(36).slice(2);
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 60;
    const color = NODE_COLORS[Math.floor(Math.random() * NODE_COLORS.length)];
    setMindMapNodes(ns => [...ns, {
      id, text: "New idea...", x: parent.x + Math.cos(angle) * dist, y: parent.y + Math.sin(angle) * dist, color, parentId,
    }]);
    setEditingNode(id);
    setNewNodeText("New idea...");
  };

  const deleteMindMapNode = (id: string) => {
    if (id === "root") return;
    const toRemove = new Set<string>();
    const collect = (nid: string) => {
      toRemove.add(nid);
      mindMapNodes.filter(n => n.parentId === nid).forEach(n => collect(n.id));
    };
    collect(id);
    setMindMapNodes(ns => ns.filter(n => !toRemove.has(n.id)));
    if (selectedNode && toRemove.has(selectedNode)) setSelectedNode(null);
    if (editingNode && toRemove.has(editingNode)) setEditingNode(null);
  };

  const saveNodeEdit = (id: string) => {
    if (newNodeText.trim()) {
      setMindMapNodes(ns => ns.map(n => n.id === id ? { ...n, text: newNodeText.trim() } : n));
    }
    setEditingNode(null);
    setNewNodeText("");
  };

  const initNodeDrag = useCallback((el: HTMLDivElement, nodeId: string) => {
    let sx = 0, sy = 0, ox = 0, oy = 0;
    const onDown = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement;
      if (tgt.tagName === "INPUT" || tgt.tagName === "BUTTON" || tgt.closest("button")) return;
      e.preventDefault();
      sx = e.clientX; sy = e.clientY;
      ox = el.offsetLeft; oy = el.offsetTop;
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    };
    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const nx = ox + (e.clientX - sx);
      const ny = oy + (e.clientY - sy);
      el.style.left = nx + "px";
      el.style.top = ny + "px";
      setMindMapNodes(ns => ns.map(n => n.id === nodeId ? { ...n, x: nx, y: ny } : n));
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    el.addEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    mindMapNodes.forEach(n => {
      const el = document.getElementById(`mmnode-${n.id}`) as HTMLDivElement | null;
      if (el && !el.dataset.dragging) {
        el.dataset.dragging = "1";
        initNodeDrag(el, n.id);
      }
    });
  }, [mindMapNodes, initNodeDrag]);

  const ICON_NAV: { icon: string; title: string; section: Section }[] = [
    { icon: "fa-solid fa-user-astronaut", title: "Profile",  section: "profile" },
    { icon: "fa-solid fa-wand-magic-sparkles", title: "Vision", section: "vision" },
    { icon: "fa-solid fa-book-open",     title: "Journal",  section: "journal" },
    { icon: "fa-solid fa-bullseye",      title: "Goals",    section: "goals" },
    { icon: "fa-solid fa-diagram-project", title: "Mind Map", section: "mindmap" },
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
                <option value="Comfortaa">Comfortaa</option>
                <option value="Poppins">Poppins</option>
                <option value="Fredoka">Fredoka</option>
                <option value="Caveat">Handwritten</option>
                <option value="Dancing Script">Calligraphy</option>
                <option value="Indie Flower">Doodle</option>
                <option value="Satisfy">Script</option>
                <option value="Amatic SC">Tall</option>
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
                      { label: "Goals Active", val: String(goals.length) },
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
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="cy-badge cy-badge-online" style={{ fontSize: 10 }}>
                    {goals.filter(g => g.progress >= 70).length} ALMOST THERE
                  </span>
                  <span className="cy-badge cy-badge-warn" style={{ fontSize: 10 }}>
                    {goals.filter(g => g.progress < 70).length} IN PROGRESS
                  </span>
                  <button className="cy-goal-add-btn" onClick={() => setShowGoalForm(v => !v)} data-testid="button-add-goal">
                    <i className={`fa-solid ${showGoalForm ? "fa-xmark" : "fa-plus"}`} style={{ marginRight: 6 }} />
                    {showGoalForm ? "Cancel" : "New Goal"}
                  </button>
                </div>
              </div>
            </div>
            <div className="cy-page-body">

              {showGoalForm && (
                <div className="cy-smart-form" data-testid="smart-goal-form">
                  <div className="cy-smart-form-header">
                    <i className="fa-solid fa-bullseye" style={{ marginRight: 8 }} />
                    SET A SMART GOAL
                  </div>
                  <div className="cy-smart-form-desc">
                    SMART goals are <strong>Specific</strong>, <strong>Measurable</strong>, <strong>Achievable</strong>, <strong>Relevant</strong>, and <strong>Time-bound</strong>.
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter">G</span> Goal Name
                    </div>
                    <input className="cy-field-input" placeholder="What's your goal? (e.g. Run a marathon)"
                      value={goalForm.name} onChange={e => setGoalForm(f => ({ ...f, name: e.target.value }))}
                      data-testid="goal-input-name"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #e040fb, #ff4081)" }}>S</span> Specific
                    </div>
                    <div className="cy-smart-hint">What exactly do you want to accomplish? Be clear and detailed.</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 60 }}
                      placeholder="I want to..."
                      value={goalForm.specific} onChange={e => setGoalForm(f => ({ ...f, specific: e.target.value }))}
                      data-testid="goal-input-specific"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #7c4dff, #536dfe)" }}>M</span> Measurable
                    </div>
                    <div className="cy-smart-hint">How will you track your progress and know when you've achieved it?</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 60 }}
                      placeholder="I'll measure success by..."
                      value={goalForm.measurable} onChange={e => setGoalForm(f => ({ ...f, measurable: e.target.value }))}
                      data-testid="goal-input-measurable"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #00e5ff, #18ffff)" }}>A</span> Achievable
                    </div>
                    <div className="cy-smart-hint">What steps or resources make this goal realistic for you?</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 60 }}
                      placeholder="This is achievable because..."
                      value={goalForm.achievable} onChange={e => setGoalForm(f => ({ ...f, achievable: e.target.value }))}
                      data-testid="goal-input-achievable"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #69f0ae, #00e676)" }}>R</span> Relevant
                    </div>
                    <div className="cy-smart-hint">Why does this matter to you? How does it fit your bigger picture?</div>
                    <textarea className="cy-field-input" style={{ resize: "vertical", minHeight: 60 }}
                      placeholder="This matters because..."
                      value={goalForm.relevant} onChange={e => setGoalForm(f => ({ ...f, relevant: e.target.value }))}
                      data-testid="goal-input-relevant"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #ffd740, #ffab40)" }}>T</span> Time-bound
                    </div>
                    <div className="cy-smart-hint">When is your deadline? Be specific about timing.</div>
                    <input className="cy-field-input" placeholder="By when? (e.g. June 2026)"
                      value={goalForm.timeBound} onChange={e => setGoalForm(f => ({ ...f, timeBound: e.target.value }))}
                      data-testid="goal-input-timebound"
                    />
                  </div>

                  <div className="cy-smart-field">
                    <div className="cy-smart-label">
                      <span className="cy-smart-letter" style={{ background: "linear-gradient(135deg, #ff4081, #ff80ab)" }}>
                        <i className="fa-solid fa-tag" style={{ fontSize: 10 }} />
                      </span> Category
                    </div>
                    <select className="cy-select" value={goalForm.category}
                      onChange={e => setGoalForm(f => ({ ...f, category: e.target.value }))}
                      data-testid="goal-input-category"
                    >
                      {GOAL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div className="cy-smart-actions">
                    <button className="cy-smart-cancel" onClick={() => { setShowGoalForm(false); setGoalForm({ ...EMPTY_GOAL_FORM }); }} data-testid="goal-form-cancel">
                      Cancel
                    </button>
                    <button className="cy-smart-submit" onClick={addGoal} data-testid="goal-form-submit">
                      <i className="fa-solid fa-sparkles" style={{ marginRight: 6 }} />
                      Add My Goal
                    </button>
                  </div>
                </div>
              )}

              {goals.length === 0 && !showGoalForm && (
                <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--cy-text-muted)" }}>
                  <i className="fa-solid fa-bullseye" style={{ fontSize: 48, marginBottom: 16, opacity: 0.3, display: "block" }} />
                  <div style={{ fontFamily: "var(--cy-font-header)", fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No goals yet</div>
                  <div style={{ fontSize: 13 }}>Click "New Goal" to set your first SMART goal and start crushing it!</div>
                </div>
              )}

              <div className="cy-target-grid">
                {goals.map(g => {
                  const barColor = g.progress >= 70 ? "#69f0ae" : g.progress >= 40 ? "#ffd740" : "#ff4081";
                  const isExpanded = expandedGoal === g.id;
                  return (
                    <div key={g.id} className={`cy-target-card ${isExpanded ? "cy-goal-expanded" : ""}`} data-testid={`goal-${g.id}`}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <div className="cy-target-name" style={{ cursor: "pointer", flex: 1 }}
                          onClick={() => setExpandedGoal(isExpanded ? null : g.id)}
                          data-testid={`goal-expand-${g.id}`}
                        >
                          {g.name}
                          <i className={`fa-solid fa-chevron-${isExpanded ? "up" : "down"}`} style={{ fontSize: 10, marginLeft: 8, opacity: 0.5 }} />
                        </div>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <span className={`cy-badge ${g.progress >= 70 ? "cy-badge-online" : "cy-badge-warn"}`}>{g.status}</span>
                          <button className="cy-goal-delete-btn" onClick={() => deleteGoal(g.id)}
                            title="Delete goal" data-testid={`goal-delete-${g.id}`}
                          >
                            <i className="fa-solid fa-trash-can" />
                          </button>
                        </div>
                      </div>
                      <div className="cy-target-detail">
                        <div><span style={{ color: "var(--cy-text-muted)" }}>Category: </span>{g.category}</div>
                        <div style={{ marginTop: 4 }}><span style={{ color: "var(--cy-text-muted)" }}>Deadline: </span>{g.timeBound}</div>
                      </div>

                      {isExpanded && (
                        <div className="cy-smart-details" data-testid={`goal-details-${g.id}`}>
                          {[
                            { letter: "S", label: "Specific", value: g.specific, color: "#e040fb" },
                            { letter: "M", label: "Measurable", value: g.measurable, color: "#7c4dff" },
                            { letter: "A", label: "Achievable", value: g.achievable, color: "#00e5ff" },
                            { letter: "R", label: "Relevant", value: g.relevant, color: "#69f0ae" },
                            { letter: "T", label: "Time-bound", value: g.timeBound, color: "#ffd740" },
                          ].map(s => (
                            <div className="cy-smart-detail-row" key={s.letter}>
                              <span className="cy-smart-detail-letter" style={{ background: s.color }}>{s.letter}</span>
                              <div>
                                <div className="cy-smart-detail-label">{s.label}</div>
                                <div className="cy-smart-detail-value">{s.value}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

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

        {/* MIND MAP */}
        {section === "mindmap" && (
          <div className="cy-section">
            <div className="cy-page-header">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div className="cy-page-title">Mind Map</div>
                  <div className="cy-page-subtitle">VISUALIZE YOUR IDEAS ~ CONNECT THE DOTS</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span className="cy-badge cy-badge-online" style={{ fontSize: 10 }}>
                    {mindMapNodes.length} NODES
                  </span>
                  <button className="cy-goal-add-btn" onClick={() => addMindMapNode(selectedNode || "root")} data-testid="button-add-node">
                    <i className="fa-solid fa-plus" style={{ marginRight: 6 }} />
                    Add Node
                  </button>
                </div>
              </div>
            </div>
            <div className="cy-mindmap-container" ref={mindMapRef} data-testid="mindmap-canvas"
              onClick={(e) => { if ((e.target as HTMLElement).classList.contains("cy-mindmap-container")) setSelectedNode(null); }}
            >
              <svg className="cy-mindmap-lines"
                width={Math.max(900, ...mindMapNodes.map(n => n.x + 220))}
                height={Math.max(700, ...mindMapNodes.map(n => n.y + 80))}
              >
                {mindMapNodes.filter(n => n.parentId).map(n => {
                  const parent = mindMapNodes.find(p => p.id === n.parentId);
                  if (!parent) return null;
                  const pIsRoot = parent.id === "root";
                  const nIsRoot = n.id === "root";
                  const px = parent.x + (pIsRoot ? 80 : 60);
                  const py = parent.y + (pIsRoot ? 26 : 22);
                  const nx = n.x + (nIsRoot ? 80 : 60);
                  const ny = n.y + (nIsRoot ? 26 : 22);
                  const mx = (px + nx) / 2;
                  return (
                    <path key={`line-${n.id}`}
                      d={`M ${px} ${py} C ${mx} ${py}, ${mx} ${ny}, ${nx} ${ny}`}
                      stroke={n.color} strokeWidth="2" strokeOpacity={selectedNode === n.id || selectedNode === n.parentId ? "0.6" : "0.25"}
                      fill="none"
                      strokeDasharray={selectedNode === n.id || selectedNode === n.parentId ? "0" : "6 4"}
                    />
                  );
                })}
              </svg>

              {mindMapNodes.map(n => (
                <div key={n.id} id={`mmnode-${n.id}`}
                  className={`cy-mindmap-node ${n.id === "root" ? "cy-mm-root" : ""} ${selectedNode === n.id ? "cy-mm-selected" : ""}`}
                  style={{ left: n.x, top: n.y, borderColor: n.color, boxShadow: selectedNode === n.id ? `0 0 20px ${n.color}40` : undefined }}
                  onClick={(e) => { e.stopPropagation(); setSelectedNode(n.id); }}
                  data-testid={`mmnode-${n.id}`}
                >
                  {editingNode === n.id ? (
                    <input className="cy-mm-edit-input" autoFocus
                      value={newNodeText}
                      onChange={e => setNewNodeText(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") saveNodeEdit(n.id); if (e.key === "Escape") { setEditingNode(null); setNewNodeText(""); } }}
                      onBlur={() => saveNodeEdit(n.id)}
                      data-testid={`mmnode-edit-${n.id}`}
                    />
                  ) : (
                    <span className="cy-mm-text" onDoubleClick={() => { setEditingNode(n.id); setNewNodeText(n.text); }}
                      style={{ color: n.id === "root" ? undefined : n.color }}
                      data-testid={`mmnode-text-${n.id}`}
                    >
                      {n.text}
                    </span>
                  )}
                  <div className="cy-mm-actions">
                    <button className="cy-mm-action-btn" title="Add child node"
                      onClick={(e) => { e.stopPropagation(); addMindMapNode(n.id); }}
                      style={{ color: "#69f0ae" }}
                      data-testid={`mmnode-add-${n.id}`}
                    >
                      <i className="fa-solid fa-plus" />
                    </button>
                    <button className="cy-mm-action-btn" title="Edit node"
                      onClick={(e) => { e.stopPropagation(); setEditingNode(n.id); setNewNodeText(n.text); }}
                      style={{ color: "#ffd740" }}
                      data-testid={`mmnode-editbtn-${n.id}`}
                    >
                      <i className="fa-solid fa-pen" />
                    </button>
                    {n.id !== "root" && (
                      <button className="cy-mm-action-btn" title="Delete node"
                        onClick={(e) => { e.stopPropagation(); deleteMindMapNode(n.id); }}
                        style={{ color: "#ff4081" }}
                        data-testid={`mmnode-delete-${n.id}`}
                      >
                        <i className="fa-solid fa-trash-can" />
                      </button>
                    )}
                  </div>
                  <div className="cy-mm-dot" style={{ background: n.color }} />
                </div>
              ))}

              <div className="cy-mm-help">
                <i className="fa-solid fa-circle-info" style={{ marginRight: 6 }} />
                Drag nodes to reposition. Double-click to edit text. Click + to add child nodes.
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
                  <div className="cy-theme-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
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
