# HealHub

Simple desktop web app for booking and managing doctor appointments.

Built with Next.js in 2024. The original Supabase backend was replaced with a local SQLite database, so everything runs locally without cloud services.

## Setup

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Demo login:

```text
Email: demo@healhub.local
Password: password123
```

## Features

- login with local demo user
- list of doctor appointments
- add / edit / delete appointments
- calendar with appointment dates
- basic patient profile
- demo data on first start
- local data storage with SQLite

## Database Reset

```bash
npm run db:reset
npm run dev
```

## Tech

- Next.js
- React
- SQLite
- better-sqlite3
- Tailwind CSS
