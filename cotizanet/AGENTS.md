# AGENTS.md - Cotizanet Next App

Use this folder for the standalone Cotizanet admin app.

## Scope

- Next.js app in `cotizanet/`
- Public backend/API base URL comes from `NEXT_PUBLIC_API_URL`
- Production host: `cotizanet.siscadindustrial.cloud`
- Local dev port: `9000`

## Read first

1. `src/app/layout.tsx` for metadata and shared shell
2. `src/app/page.tsx` for the login redirect entry
3. `src/app/components/admin-shell.tsx` for authenticated navigation
4. `src/app/lib/api.ts` for backend calls and env usage

## Routes

- `/login` login screen
- `/cotizaciones` quote builder
- `/cotizaciones/historial` quote history
- `/cotizaciones/[id]` quote detail
- `/api/cotizaciones` quote creation proxy
- `/api/cotizaciones/productos` product search proxy

## Build and run

- `pnpm dev`
- `pnpm build`
- `pnpm start`
- `pnpm lint`

## Docker

- The app expects a standalone Next build.
- Set `NEXT_PUBLIC_API_URL` at build time and runtime.
