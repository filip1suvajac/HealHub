# HealHub

Preprost web app za naročanje in upravljanje zdravniških terminov.

Narejeno kot prvi pravi vadni projekt v Next.js 2024. Originalni Supabase backend je zamenjan z lokalno SQLite bazo, tako da vse teče lokalno brez cloud storitev.

Je LE desktop-app.

## Setup

```bash
npm install
npm run dev
```

... in odpri [http://localhost:3000](http://localhost:3000).

Demo login:

```text
Email: demo@healhub.local
Password: password123
```

## Kaj sploh dela?

- Login z lokalnim demo uporabnikom
- Seznam zdravniških terminov
- Dodaj / uredi / izbriši termin
- Koledar z označenimi datumi terminov
- Osnovni profil pacienta
- Demo podatki ob prvem zagonu
- Podatki se shranijo lokalno v SQLite

## Database reset

```bash
npm run db:reset
npm run dev
```

## Uporabljene tehnologije

- Next.js
- React
- SQLite
- better-sqlite3
- Tailwind CSS
