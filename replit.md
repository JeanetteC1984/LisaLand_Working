# DREAM LOG v2

A dark Lisa Frank-inspired digital journal for achieving goals and living your best life. Built with React + TypeScript.

## Architecture

- **Frontend**: React + TypeScript + Vite (client-side app, no DB needed)
- **Backend**: Express (minimal, serves static files)
- **Styling**: Custom CSS (`client/src/cyber.css`) with CSS custom properties for theming

## Features

- **13 Color Themes**: 10 dark (Rainbow Dream, Sunset Glow, Ocean Aura, Cosmic Berry, Neon Jungle, Stardust, Electric Candy, Midnight Rose, Aurora, Galaxy) + 3 lighter (Cotton Candy, Lemonade, Lavender Mist)
- **6 Sections**: Journal (rich text editor), Profile, Vision Board, Goals, Mind Map, Settings/Customize
- **Rich Text Editor**: Bold, italic, underline, strikethrough, 10 font choices, alignment, lists
- **Paper Patterns**: Stars, Hearts, Grid, Dots, Lined, Blank
- **Canvas Modes**: Default, Tinted, Gradient, Deep Dark, Glow
- **Sticker System (60+ stickers)**: 5 categories — Vibes (12 motivational stamps), Symbols (16 icon stickers), Emoji (12 large emoji), Notes (8 editable sticky notes with drag handle), Art (12 SVG art stickers). All draggable with position persistence.
- **Sticky Notes**: Editable text with drag handle bar at top; click note body to type, grab handle to move. Position persists on drag.
- **Affirmation Bar**: Commands: help, affirm, breathe, gratitude, goals, sparkle, love, clear
- **Sparkle Overlay**: Toggleable floating sparkle particle effect
- **File/Entry Management**: Create, select, edit multiple journal entries
- **SMART Goal Tracker**: Add/delete goals using SMART framework. Expandable cards with progress bars.
- **Mind Map**: Interactive node-based mind mapping with draggable nodes, SVG curved connectors, add/edit/delete nodes.
- **Profile**: Editable personal info with life stats

## Sticker Drag System

- `initDrag(el, stickerId)` handles mousedown/mousemove/mouseup with position persistence to React state
- Notes use `.cy-note-drag-handle` for dragging (grip icon) while `.cy-note-body` stays `contenteditable`
- Sticker layer uses `overflow: visible` so stickers can be dragged beyond editor bounds

## Structure

```
client/src/
  pages/CyberLog.tsx   — Main app (all sections, stickers, editor, goals, mind map)
  cyber.css            — All theme CSS variables and component styles
  App.tsx              — Router
```

## Running

`npm run dev` via the Start application workflow.
