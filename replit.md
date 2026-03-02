# CYBER-LOG V2.0

A cyberpunk-themed digital journal/document editor built with React + TypeScript.

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express (minimal, no DB needed — all state is client-side)
- **Styling**: Custom CSS (`client/src/cyber.css`) + Tailwind for base

## Features

- **10 Themes**: Netrunner, Hacker, Corpo, Synthwave, Terminal, Sakura, Ghost, Vaporwave, Crimson, Matrix
- **5 Sections**: Records (editor), Identity, Labs, Targets, Settings
- **Rich Text Editor**: Bold, italic, underline, strikethrough, font choice, alignment, lists
- **Paper Patterns**: Grid, Dot Matrix, Lined, Blank
- **Canvas Modes**: Dark, Tinted, Blueprint, Void, Neon Glow
- **Sticker System**: Stamps, Hazard icons, Sticky notes, Cyber SVG art — all draggable
- **Interactive Terminal**: Commands: help, scan, hack, status, whoami, ping, decrypt, matrix, clear
- **CRT Effect**: Toggleable scanline overlay
- **File Management**: Create, select, edit multiple documents
- **Target Dossiers**: Browseable target cards with threat levels
- **Identity Profile**: Editable operative identity card

## Structure

```
client/src/
  pages/
    CyberLog.tsx   — Main app (all sections, stickers, terminal, editor)
  cyber.css        — All cyber theme CSS variables and component styles
  App.tsx          — Router (single page)
```

## Running

The app runs via `npm run dev` (Start application workflow).
