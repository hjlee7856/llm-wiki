---
type: project-index
status: active
updated: 2026-04-29
rank:
  importance: 5
  confidence: 4
  freshness: 5
  usage: 0
---

# Projects

This page is the graph hub for project-level knowledge.

## Portfolio Snapshot

- `dailyfund-front`: public DailyFunding service frontend for investment, loan, company, disclosure, and support flows.
- `lawinvest-front`: internal LawInvest operations frontend centered on users, disputes, payments, and statistics.
- `daily-publisher`: internal static page editor and deployment tool with local storage and external Publisher API integration.

## Active Projects

- [[wiki/projects/dailyfund-front|dailyfund-front]]: DailyFunding user-facing web frontend.
- [[wiki/projects/lawinvest-front|lawinvest-front]]: LawInvest internal admin frontend.
- [[wiki/projects/daily-publisher|daily-publisher]]: internal static page publishing editor and deployment tool.

## Current Notes

### dailyfund-front

- Public-facing Next.js App Router product with investment, loan, disclosure, notice, news, and external module entry points.
- Uses Panda CSS, React Query, `ky`, Storybook, MSW, and multiple test-related tools.
- Current caveat: detailed product policy meaning still depends on backend or API documentation.

### lawinvest-front

- Internal admin product for legal/financial operations with clear menu-based domain grouping.
- Uses Ant Design, React Query, `ky`, domain-specific server modules, and deployment support under `docker`.
- Current caveat: detailed workflow and policy behavior still needs backend or operations documentation.

### daily-publisher

- Internal publishing tool that combines page/template lifecycle management, preview, ZIP workflows, and external Publisher API calls.
- Uses Next.js admin UI, SQLite metadata, file-based HTML/CSS storage, and documented blue-green deployment.
- Current caveat: some planning documents describe target architecture that does not fully match current schema and package metadata.

## Cross-Project Patterns

- All three projects are modern TypeScript frontend-heavy applications built on Next.js 16 and React 19.
- `dailyfund-front` is the only user-facing service; the other two are internal operations tools.
- `lawinvest-front` and `daily-publisher` both use Ant Design for admin-oriented workflows, while `dailyfund-front` uses Panda CSS for a service UI.
- Deployment and operations knowledge exists for all three projects, but business-rule confidence remains lower than UI and structure confidence.

## Source Notes

- [[wiki/sources/dailyfund-front-source|dailyfund-front source]]
- [[wiki/sources/lawinvest-front-source|lawinvest-front source]]
- [[wiki/sources/daily-publisher-source|daily-publisher source]]

## Raw Source Group

- [[raw/projects/README|raw/projects]]

## Maintenance Notes

- Keep one project page per project.
- Keep project pages in English unless the user asks otherwise.
- Record metadata mismatches and source uncertainty instead of silently correcting them.
