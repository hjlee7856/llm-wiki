---
type: source
status: active
source_file: raw/projects/daily-publisher.md
created: 2026-04-23
rank:
  importance: 4
  confidence: 4
  freshness: 5
  usage: 1
---

# daily-publisher Source

## Source

- [[raw/projects/daily-publisher|raw/projects/daily-publisher.md]]

## Summary

The source describes `daily-publisher` as an internal static HTML/CSS page editor and deployment tool with a Next.js admin UI, SQLite metadata, file storage, ZIP upload/download, preview, template management, and external Publisher API integration.

## Key Claims

- The project supports page and template lifecycle operations.
- HTML/CSS bodies are stored as files, while SQLite stores metadata and paths.
- The external Publisher API supports product file listing, upload, replacement, delete, restore, download, and static file fetch.
- Planned migration directions include backend file management and S3 template storage.
- The latest reviewed local commit was `ae8cebd` on 2026-04-21, and the local worktree was not fully clean because `next-env.d.ts` was modified.

## Evidence

- Reviewed project files include `package.json`, `PLAN.md`, `docs/backend-structure-handoff.md`, `deploy/README.md`, `lib/db/schema.ts`, `lib/publisher/api.ts`, `app`, and `components/editor`, plus the latest local git metadata.

## Related Topics

- [[wiki/projects/daily-publisher|daily-publisher]]
- [[wiki/projects/Projects|Projects]]

## Related Entities

- [[wiki/entities/DailyFunding|DailyFunding]]

## Contradictions or Caveats

- Documentation mentions a `fonts` table/API, but the reviewed schema appears centered on `users`, `pages`, and `templates`.
- `package.json` still uses `my-project` as the package name.
