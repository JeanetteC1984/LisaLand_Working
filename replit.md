# DREAM LOG v2

A dark Lisa Frank-inspired digital journal for achieving goals and living your best life. Built with React + TypeScript.

## Architecture

- **Frontend**: React + TypeScript + Vite (client-side app, no DB needed)
- **Backend**: Express (minimal, serves static files)
- **Styling**: Custom CSS (`client/src/cyber.css`) with CSS custom properties for theming

## Features

- **19 Color Themes**: 10 dark (Rainbow Dream, Sunset Glow, Ocean Aura, Cosmic Berry, Neon Jungle, Stardust, Electric Candy, Midnight Rose, Aurora, Galaxy) + 3 dark-light (Cotton Candy, Lemonade, Lavender Mist) + 3 warm/cool (Peach Sorbet, Mint Chip, Rose Quartz) + 3 truly light-mode (☁️ Cloud Nine, 🍯 Honey Glow, 🌤️ Sky Bloom — white/pastel backgrounds with dark text, full CSS override block)
- **10 Sections**: Journal, Profile, Vision Board (with subpages), Goals, Mind Map, Mood Tracker, Habit Tracker, Calendar, Music Player, Settings/Customize
- **Rich Text Editor**: Bold, italic, underline, strikethrough, 24 font choices, alignment, lists
- **Paper Patterns**: Stars, Hearts, Grid, Dots, Lined, Blank, Diamonds, Waves, Confetti, Floral — visual icon swatch selectors
- **Canvas Modes**: Default, Tinted, Gradient, Deep Dark, Glow, Dreamy, Starfield, Aurora, Soft Focus, Minimal — visual gradient swatch selectors
- **Sticker System (300+ stickers)**: 20 categories — Vibes (18), Symbols (20), Emoji (24), Notes (12), Art (12), Dividers (6), Weather (10), Nature (12), Food (12), Zodiac (12), Shapes (10), Badges (10), Animals (16), Travel (12), Celebration (12), Hearts (14), Music (10), Frames (8), Washi Tape (10). All draggable with position persistence, resizable (scale 0.3x–3x via +/- controls on hover). Available in both Journal and Mind Map sections. Tabs wrap for usability.
- **Customization Options**: Editor font size slider (12–28px), 12 accent color presets + custom color picker, 6 border styles (Default, Rounded, Sharp, Dashed, Double, Glow), cursor glow effect (mouse-tracking neon orb).
- **Calendar**: Daily/Weekly/Monthly views with navigation, time blocking (6AM–11PM hourly slots), drag-and-drop events between days and time slots, event form with title, date, start/end time, color (12 options), location, description, category (8 types), and all-day toggle. Events persist in localStorage.
- **Sparkle Button**: Triggers glitch animation + random theme change + 60-particle glitter explosion burst.
- **Journal Icon**: Clicking the Journal icon in the sidebar opens the "Name Your Entry" popup instead of just switching sections.
- **Music Player**: Audio player with IndexedDB-persisted playlist, file upload, play/pause/prev/next controls, animated reactor core visualization, color-cycling visualizer bars, playlist management with purge. Uses DreamLogMusicDB IndexedDB store.
- **Sticky Notes**: Editable text with drag handle bar at top; click note body to type, grab handle to move.
- **Affirmation Bar**: Commands: help, affirm, breathe, gratitude, goals, sparkle, love, clear
- **Daily Affirmation Popup**: Random motivational message shown once per day on app load
- **File/Entry Management**: Create (with title prompt modal), select, delete multiple journal entries
- **SMART Goal Tracker**: Add/delete goals using SMART framework. Expandable cards with progress bars.
- **Mind Map**: Interactive node-based mind mapping with draggable nodes (ref-based cleanup for drag), SVG curved connectors, add/edit/delete nodes.
- **Profile**: Editable personal info with profile picture upload (base64 in state)
- **Vision Board Subpages**: Each of 6 cards opens to a 2-column grid layout — prompts on left, compact affirmation chips on right
- **Mood Tracker**: Daily emoji check-in (5 moods) with optional notes, stats dashboard (total check-ins, day streak, average mood, most common), 7-day week trend visualization, mood distribution bar chart, deletable entries with hover X button, calendar history view
- **Habit Tracker**: 6 default habits + custom habit creation (name, icon picker, color picker). Tap to complete, streak counting, weekly bar chart. Custom habits can be deleted.
- **Vision Board Images (vboard)**: Masonry image gallery with captions per image. Data: `Record<string, {src, caption}[]>`
- **localStorage Persistence**: Theme, files, goals, identity, profilePic, moodEntries, habitDays, mindMapNodes, visionImages, customHabits, paperPattern, canvasMode, crtEnabled

## Sticker Drag System

- `initDrag(el, stickerId)` handles mousedown/mousemove/mouseup with position persistence to React state
- Notes use `.cy-note-drag-handle` for dragging (grip icon) while `.cy-note-body` stays `contenteditable`
- Sticker layer uses `overflow: visible` so stickers can be dragged beyond editor bounds

## Mind Map Drag System

- Uses `dragCleanups` ref (Map) to track and clean up event listeners per node
- `initNodeDrag` removes old listener before adding new one (prevents stacking)
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
