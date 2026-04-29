---
type: project
status: active
sources:
  - raw/projects/lawinvest-front.md
updated: 2026-04-24
rank:
  importance: 4
  confidence: 4
  freshness: 5
  usage: 0
---

# lawinvest-front

## Summary

`lawinvest-front` is an internal LawInvest admin frontend. The current local repository metadata, README, and package name consistently identify it as LawInvest admin software, centered on post-login workflows for users, disputes, payments, statistics, and AlimTalk history.

## Core Areas

- Admin login and authenticated work entry.
- Dashboard and operational statistics.
- User, lawyer, and admin management.
- Dispute request, dispute list, dispute registration, pleading calendar, settlement history, and detail screens.
- Payment list, payment addition, payment calendar, and ledger lookup.
- Admin settings and statistics lookup.

## Architecture Notes

- Frontend: Next.js `16.1.6`, React `19.2.1`, TypeScript, Ant Design 6, and React Compiler enabled in `next.config.ts`.
- Data/API: TanStack React Query, `ky`, domain modules under `src/server`, and cookie-based token authentication.
- Domain shape: menu structure is organized around user management, dispute management, payment management, and statistics, while `src/server` also includes more granular domains such as `accountBalance`, `apply`, `capital`, `hearing`, `lawfirms`, `litigants`, and `matters`.
- Deployment: Docker, Docker Compose, Nginx, and `scripts/deploy.sh`.
- Review point: latest checked local commit was `aecc86d` dated 2026-04-23.

## Caveats

- Detailed operational policies and workflow rules require backend documentation or planning documents.
- Current confidence is strong for top-level structure, but lower for detailed UX behavior.

## Source

- [[wiki/sources/lawinvest-front-source|lawinvest-front source note]]
- [[raw/projects/lawinvest-front|raw project summary]]
