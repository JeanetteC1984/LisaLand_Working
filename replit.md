# GLOW UP v2

A dark Lisa Frank-inspired digital journal for achieving goals and living your best life. Built with React + TypeScript.

## Architecture

- **Frontend**: React + TypeScript + Vite (client-side app, no DB needed)
- **Backend**: Express (minimal, serves static files)
- **Styling**: Custom CSS (`client/src/cyber.css`) with CSS custom properties for theming

## Features

- **20 Color Themes**: 10 dark (Rainbow Dream, Sunset Glow, Ocean Aura, Cosmic Berry, Neon Jungle, Stardust, Electric Candy, Midnight Rose, Aurora, Galaxy) + 10 light with unique names (Petal Pink, Marigold, Clear Sky, Blush Rose, Meadow, Wisteria, Sunshine, Cherry Blossom, Seafoam, Lavender Field). Light themes use `lt-` prefix IDs. Theme selector in sidebar uses optgroup Dark/Light. Settings page shows themes in two labeled grids.
- **12 Sections**: Dashboard, Journal, Profile, Vision Board (with subpages), Goals, Mind Map, Mood Tracker, Habit Tracker, Calendar, Budget, Music Player, Settings/Customize
- **Dashboard**: Hero banner with time-of-day greeting (uses profile name if set), daily rotating quote, vision board thumbnail (if images exist). Stat cards for journal entries, goals, streak, mood. Grid of cards: today's schedule, habits, goals progress, mood chart, recent entries, vision board preview (with add-image prompt if empty), quick action buttons.
- **Rich Text Editor**: Bold, italic, underline, strikethrough, 25 font choices, heading formatting (Title/Heading/Subheading/Normal), 7 font sizes (8–32pt), text color picker, highlight color picker, alignment, lists, quote blocks, highlight bars
- **Paper Patterns (15)**: Stars, Hearts, Grid, Dots, Lined, Blank, Diamonds, Waves, Confetti, Floral, Crosshatch, Hexagons, Raindrops, Spirals, Moonlight — visual icon swatch selectors
- **Canvas Modes (15)**: Default, Tinted, Gradient, Deep Dark, Glow, Dreamy, Starfield, Aurora, Soft Focus, Minimal, Prism, Nebula, Ember, Frost, Twilight — visual gradient swatch selectors
- **Sticker System (300+ stickers)**: 20+ categories including Seasonal (snowman, jack-o-lantern, ghost, xmas-tree, etc.). All draggable with position persistence, resizable (scale 0.3x–3x). Stickers are saved per journal entry (not global). Available in both Journal and Mind Map sections.
- **Notes System**: Separate NOTES button (distinct from STICKERS) in both journal and mind map toolbars. Notes panel with 12 colored note types (pink, lilac, mint, peach, gold, sky, rose, neon, coral, sage, lavender, sunset). Supports image and video note uploads (base64 embedded). Note stickers use `note-image-` and `note-video-` type prefixes.
- **Per-File Stickers**: `stickersByFile` state (`Record<string, Sticker[]>`) stores stickers keyed by file ID. Each journal entry has its own stickers. Deleting a file cleans up its stickers.
- **Customization Options**: Editor font size slider (12–28px), 12 accent color presets + custom color picker, 6 border styles, cursor glow effect.
- **Calendar**: Daily/Weekly/Monthly views with navigation, time blocking (6AM–11PM hourly slots), drag-and-drop events, event form with full customization. Events persist in localStorage. **Event blocks are color-coded by start time**: dawn (<9 AM, #b388ff purple), morning (9–11 AM, #ffab40 orange), midday (12–1 PM, #ff4081 pink), afternoon (2–4 PM, #00e5ff cyan), evening (5–7 PM, #e040fb magenta), night (8+ PM, #7c4dff violet). `getTimeBlockColor(startTime)` determines color — overrides user-set event color in weekly/daily views. **Event images**: Events support optional image upload (base64); images display as background in weekly/daily event blocks with dark overlay for text readability.
- **Sparkle Button**: Triggers glitch animation + random theme change + 370+ particle glitter explosion (4 staggered bursts, 5 shapes, 22 neon colors, double flash, 20 glitter rain drops).
- **Journal Icon**: Clicking the Journal icon in the sidebar opens the "Name Your Entry" popup instead of just switching sections.
- **Music Player**: Audio player with IndexedDB-persisted playlist, file upload, play/pause/prev/next controls, animated reactor core visualization. Canvas-based visualizer with 3 switchable modes (Bars with mirror reflection, Circular radial, Wave oscilloscope) — real-time frequency analysis via Web Audio API AnalyserNode (fftSize=256) + requestAnimationFrame, 10 cycling neon colors with glow effects. Audio element persists across section navigation. Playlist management with purge.
- **Household Budget**: Monthly income/expense tracking with 16 expense categories (Housing, Utilities, Groceries, Transport, Insurance, Healthcare, Entertainment, Dining, Shopping, Subscriptions, Education, Savings, Debt, Pets, Personal, Other) and 7 income categories (Salary, Freelance, Side Hustle, Investments, Gifts, Refunds, Other). Summary cards (income/expense/balance), spending breakdown bar chart, budget ratio visualization, add/edit/delete items via form modal, recurring flag, category icons, month navigation. Persisted in localStorage.
- **Sticky Notes**: Editable text with drag handle bar at top; click note body to type, grab handle to move.
- **Affirmation Bar**: Commands: help, affirm, breathe, gratitude, goals, sparkle, love, clear
- **Daily Affirmation Popup**: Random motivational message shown once per day on app load
- **File/Entry Management**: Create (with title prompt modal), select, delete multiple journal entries
- **SMART Goal Tracker**: Expandable cards with clickable progress bar, range slider, quick-set buttons, milestone checklist system.
- **Mind Map**: Interactive node-based mind mapping with draggable nodes, SVG curved connectors, add/edit/delete nodes.
- **Profile**: Editable personal info with profile picture upload
- **Vision Board Subpages**: Each of 6 cards opens to a 2-column grid layout
- **Mood Tracker**: Daily emoji check-in, stats dashboard, 7-day trend, mood distribution, deletable entries, calendar history view
- **Habit Tracker**: 6 default + custom habits, streak counting, weekly bar chart
- **Vision Board Images (vboard)**: Masonry image gallery with captions per image
- **localStorage Persistence**: Theme, files, goals, identity, profilePic, moodEntries, habitDays, mindMapNodes, visionImages, customHabits, paperPattern, canvasMode, crtEnabled, stickersByFile, mindMapStickers

## Sticker Drag System

- `initDrag(el, stickerId, isMindMap, fileId)` handles mousedown/mousemove/mouseup with position persistence to React state
- Journal stickers use `setStickersByFile` with the file ID for per-entry scoping
- Mind map stickers use `setMindMapStickers` (global)
- Notes use `.cy-note-drag-handle` for dragging while `.cy-note-body` stays `contenteditable`

## Mind Map Drag System

- Uses `dragCleanups` ref (Map) to track and clean up event listeners per node
- `initNodeDrag` removes old listener before adding new one
- useEffect re-initializes drag on section change and node changes with 50ms delay

## Structure

```
client/src/
  pages/CyberLog.tsx   — Main app (all sections, stickers, editor, goals, mind map, mood, habits)
  cyber.css            — All theme CSS variables and component styles
  App.tsx              — Router
client/index.html      — Google Fonts (26 fonts), Font Awesome CDN
```

## Running

`npm run dev` via the Start application workflow.
