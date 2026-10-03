# VandiPattiyal — வண்டி பட்டியல்

**MTC Chennai fleet explorer.** A bilingual (English / தமிழ்) dashboard over the Metropolitan Transport Corporation's bus fleet: 6,801 buses by depot, registration, make, model, fuel/emission class, service type and status.

**Live:** https://vandipattiyal.vercel.app

## What's inside

- **Dashboard** — headline counts (tracked fleet, electric fleet, Vidiyal Payanam, AC buses) and service-type distribution
- **Fleet Search** — filter the full 3,801-row list by depot, model, AC, service type
- **Depot Details** — per-depot breakdowns
- **PTSC / GCC model** tabs — split between MTC-owned and GCC-operated fleet

## Data

`public/FleetList.csv` is a snapshot of the MTC fleet last updated **4 Oct 2026** (from the ITS fleet master: 6,801 buses incl. 1,782 inactive — see the Status column; previous snapshot 26 Nov 2025 had 3,801 active only). Unofficial, community-maintained; not affiliated with MTC, TNSTC or the Government of Tamil Nadu. Corrections welcome via pull request or issue.

## Stack

React 19 · Vite 6 · Tailwind CSS 4 · Recharts. No backend — the CSV ships with the build and everything runs client-side.

## Run locally

```bash
bun install   # or npm install
bun run dev   # http://localhost:3000
bun run build # production build in dist/
```

## License

[MIT](LICENSE)
