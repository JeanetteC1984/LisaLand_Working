# Cyber Sticker Studio

Cyber Sticker Studio is a full-stack TypeScript app with an Express server and a Vite + React client.

## Tech Stack

- TypeScript
- React + Vite
- Express
- Drizzle ORM
- PostgreSQL
- Tailwind CSS

## Prerequisites

- Node.js 20+
- npm
- PostgreSQL database

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root with your database and app settings.

Typical values include:

- `DATABASE_URL`
- `SESSION_SECRET`
- `NODE_ENV`

## Development

Run the app in development mode:

```bash
npm run dev
```

## Database

Push schema changes with Drizzle:

```bash
npm run db:push
```

## Type Check

```bash
npm run check
```

## Production

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```
