---
type: project
status: active
sources:
  - raw/projects/daily-publisher.md
updated: 2026-04-24
rank:
  importance: 4
  confidence: 4
  freshness: 5
  usage: 0
---

# daily-publisher

## Summary

`daily-publisher` is an internal editor and deployment tool for static HTML/CSS pages or product publishing files. It combines a Next.js admin UI, local DB, file storage, ZIP upload/download, preview, template management, and external Publisher API integration.

## Core Areas

- Login, logout, and admin account update.
- Page list, search, creation, update, status changes, soft delete, restore, and permanent delete.
- ZIP-based HTML/CSS/asset upload and page download.
- Template list, rename, delete, and import.
- Editor UI with page/template panel, preview iframe, quick-edit panel, and top bar.
- Preview route for saved or external Publisher static files.
- Product-level Publisher API file operations.

## Architecture Notes

- Frontend/admin: Next.js 16, React 19, TypeScript, Ant Design 6, and Tailwind CSS.
- Storage: SQLite metadata plus file-based HTML/CSS storage.
- Auth: cookie/JWT based authentication with a default seeded admin user.
- Integrations: AWS S3 SDK for planned template storage and external Publisher API with client credentials.
- API surface: `app/api` covers auth, page CRUD/upload/download/trash, template CRUD/import, and health checks; preview serving uses `app/preview/[pageId]/[...filePath]/route.ts`.
- Deployment: Docker + PM2 + Nginx blue-green flow documented under `deploy`.
- Review point: latest checked local commit was `ae8cebd` dated 2026-04-21.

## Caveats

- Documentation mentions a `fonts` table/API, but the reviewed schema appears focused on `users`, `pages`, and `templates`.
- `package.json` still uses `my-project` as the package name.
- Current implementation and migration direction should be kept separate, especially for backend file management and S3 template storage.
- The local repository was not fully clean at review time because `next-env.d.ts` was modified.

## Source

- [[wiki/sources/daily-publisher-source|daily-publisher source note]]
- [[raw/projects/daily-publisher|raw project summary]]
