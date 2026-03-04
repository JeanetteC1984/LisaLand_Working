# DREAM LOG v2

A dark Lisa Frank-inspired digital journal for achieving goals and living your best life. Built with React + TypeScript.

## Architecture

- **Frontend**: React + TypeScript + Vite (client-side app, no DB needed)
- **Backend**: Express (minimal, serves static files)
- **Styling**: Custom CSS (`client/src/cyber.css`) with CSS custom properties for theming

## Features

- **16 Color Themes**: 10 dark (Rainbow Dream, Sunset Glow, Ocean Aura, Cosmic Berry, Neon Jungle, Stardust, Electric Candy, Midnight Rose, Aurora, Galaxy) + 3 light (Cotton Candy, Lemonade, Lavender Mist) + 3 warm/cool (Peach Sorbet, Mint Chip, Rose Quartz)
- **8 Sections**: Journal, Profile, Vision Board (with subpages), Goals, Mind Map, Mood Tracker, Habit Tracker, Settings/Customize
- **Rich Text Editor**: Bold, italic, underline, strikethrough, 16 font choices, alignment, lists
- **Paper Patterns**: Stars, Hearts, Grid, Dots, Lined, Blank, Diamonds, Waves
- **Canvas Modes**: Default, Tinted, Gradient, Deep Dark, Glow, Dreamy, Starfield, Aurora, Soft Focus, Minimal
- **Sticker System (60+ stickers)**: 5 categories — Vibes, Symbols, Emoji, Notes, Art. All draggable with position persistence.
- **Sticky Notes**: Editable text with drag handle bar at top; click note body to type, grab handle to move.
- **Affirmation Bar**: Commands: help, affirm, breathe, gratitude, goals, sparkle, love, clear
- **Daily Affirmation Popup**: Random motivational message shown once per day on app load
- **File/Entry Management**: Create, select, delete multiple journal entries
- **SMART Goal Tracker**: Add/delete goals using SMART framework. Expandable cards with progress bars.
- **Mind Map**: Interactive node-based mind mapping with draggable nodes, SVG curved connectors, add/edit/delete nodes.
- **Profile**: Editable personal info with profile picture upload (base64 in state)
- **Vision Board Subpages**: Each of 6 cards (Self Love, Manifest, Grow, Morning Ritual, Night Reflect, Dream Big) opens to a subpage with 6 affirmations + 4 journal prompts
- **Mood Tracker**: Daily emoji check-in (5 moods) with optional notes, calendar history view
- **Habit Tracker**: 6 default habits (Meditate, Journal, Exercise, Read, Hydrate, Gratitude), tap to complete, streak counting, weekly bar chart
- **localStorage Persistence**: Theme, files, goals, identity, profile pic, mood entries, habit days, mind map nodes, paper/canvas/CRT settings saved

## Sticker Drag System

- `initDrag(el, stickerId)` handles mousedown/mousemove/mouseup with position persistence to React state
- Notes use `.cy-note-drag-handle` for dragging (grip icon) while `.cy-note-body` stays `contenteditable`
- Sticker layer uses `overflow: visible` so stickers can be dragged beyond editor bounds

## Structure

```
client/src/
  pages/CyberLog.tsx   — Main app (all sections, stickers, editor, goals, mind map, mood, habits)
  cyber.css            — All theme CSS variables and component styles
  App.tsx              — Router
client/index.html      — Google Fonts (16 fonts), Font Awesome CDN
```

## Running

`npm run dev` via the Start application workflow.
