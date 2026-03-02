# DREAM LOG v2

A dark Lisa Frank-inspired digital journal for achieving goals and living your best life. Built with React + TypeScript.

## Architecture

- **Frontend**: React + TypeScript + Vite (client-side app, no DB needed)
- **Backend**: Express (minimal, serves static files)
- **Styling**: Custom CSS (`client/src/cyber.css`) with CSS custom properties for theming

## Features

- **10 Color Themes**: Rainbow Dream, Sunset Glow, Ocean Aura, Cosmic Berry, Neon Jungle, Stardust, Electric Candy, Midnight Rose, Aurora, Galaxy
- **5 Sections**: Journal (rich text editor), Profile, Vision Board, Goals, Settings/Customize
- **Rich Text Editor**: Bold, italic, underline, strikethrough, font choices (Nunito, Quicksand, Handwritten, Comfortaa), alignment, lists
- **Paper Patterns**: Stars, Hearts, Grid, Dots, Lined, Blank
- **Canvas Modes**: Default, Tinted, Gradient, Deep Dark, Glow
- **Sticker System**: Vibes (motivational stamps), Symbols (hearts, stars, sparkles, moon), Notes (pink, lilac, mint, peach sticky notes), Art (butterfly, rainbow, star burst, flower SVGs) — all draggable
- **Affirmation Bar**: Commands: help, affirm, breathe, gratitude, goals, sparkle, love, clear
- **Sparkle Overlay**: Toggleable floating sparkle particle effect
- **File/Entry Management**: Create, select, edit multiple journal entries
- **Goal Tracker**: Progress bars and status badges for life goals
- **Profile**: Editable personal info with life stats

## Design Philosophy

Dark backgrounds (deep purples, dark teals, midnight blacks) with vibrant Lisa Frank-inspired neon accents. Rainbow gradients used for brand elements, active states, and decorative touches. Rounded corners, soft glows, and warm fonts throughout.

## Structure

```
client/src/
  pages/CyberLog.tsx   — Main app (all sections, stickers, editor, goals)
  cyber.css            — All theme CSS variables and component styles
  App.tsx              — Router
```

## Running

`npm run dev` via the Start application workflow.
