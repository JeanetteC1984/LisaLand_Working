# DREAM LOG v2

A dark Lisa Frank-inspired digital journal for achieving goals and living your best life. Built with React + TypeScript.

## Architecture

- **Frontend**: React + TypeScript + Vite (client-side app, no DB needed)
- **Backend**: Express (minimal, serves static files)
- **Styling**: Custom CSS (`client/src/cyber.css`) with CSS custom properties for theming

## Features

- **13 Color Themes**: 10 dark (Rainbow Dream, Sunset Glow, Ocean Aura, Cosmic Berry, Neon Jungle, Stardust, Electric Candy, Midnight Rose, Aurora, Galaxy) + 3 lighter (Cotton Candy, Lemonade, Lavender Mist)
- **6 Sections**: Journal (rich text editor), Profile, Vision Board, Goals, Mind Map, Settings/Customize
- **Rich Text Editor**: Bold, italic, underline, strikethrough, font choices (Nunito, Quicksand, Comfortaa, Poppins, Fredoka, Handwritten, Calligraphy, Doodle, Script, Tall), alignment, lists
- **Paper Patterns**: Stars, Hearts, Grid, Dots, Lined, Blank
- **Canvas Modes**: Default, Tinted, Gradient, Deep Dark, Glow
- **Sticker System**: Vibes (8 motivational stamps), Symbols (10 hearts/stars/sparkles), Notes (6 sticky notes), Art (8 SVG stickers including unicorn, dolphin, diamond, cloud) — all draggable
- **Affirmation Bar**: Commands: help, affirm, breathe, gratitude, goals, sparkle, love, clear
- **Sparkle Overlay**: Toggleable floating sparkle particle effect
- **File/Entry Management**: Create, select, edit multiple journal entries
- **SMART Goal Tracker**: Add/delete goals using the SMART framework (Specific, Measurable, Achievable, Relevant, Time-bound). Expandable goal cards show full SMART breakdown. Progress bars and status badges.
- **Mind Map**: Interactive node-based mind mapping with draggable nodes, SVG curved connector lines, add/edit/delete nodes, inline text editing. Root node "My Dream Life" with preset branches. Dynamic SVG sizing.
- **Profile**: Editable personal info with life stats

## Design Philosophy

Dark backgrounds (deep purples, dark teals, midnight blacks) with vibrant Lisa Frank-inspired neon accents. Rainbow gradients used for brand elements, active states, and decorative touches. Rounded corners, soft glows, and warm fonts throughout. All mind map and UI elements use CSS custom properties for full theme compatibility.

## Structure

```
client/src/
  pages/CyberLog.tsx   — Main app (all sections, stickers, editor, goals, mind map)
  cyber.css            — All theme CSS variables and component styles (13 themes + mind map styles)
  App.tsx              — Router
```

## Running

`npm run dev` via the Start application workflow.
