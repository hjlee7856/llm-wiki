---
type: source
status: active
source_file: raw/projects/dailyfund-front.md
created: 2026-04-23
rank:
  importance: 4
  confidence: 4
  freshness: 5
  usage: 1
---

# dailyfund-front Source

## Source

- [[raw/projects/dailyfund-front|raw/projects/dailyfund-front.md]]

## Summary

The source describes `dailyfund-front` as DailyFunding's user-facing web frontend. The latest local review confirms package `dailyfunding_web` version `0.1.34`, App Router route groups under `src/app`, and domain API modules spanning company, investment, disclosure, notice, news, loan, and module flows.

## Key Claims

- The project covers investment, loan, company, disclosure, support, news, insight, and external-module screens.
- API calls are organized by domain under `src/server` and use `ky`.
- CSRF handling reads `_csrftoken` and sends `x-csrftoken`.
- Deployment support exists through Docker, PM2, and Nginx configuration.
- The latest reviewed local commit was `575dc4a` on 2026-04-24.

## Evidence

- Reviewed project files include `package.json`, `README.md`, `next.config.ts`, `src/proxy.ts`, `src/app`, `src/server`, and `src/components`, plus the latest local commit metadata.

## Related Topics

- [[wiki/projects/dailyfund-front|dailyfund-front]]
- [[wiki/projects/Projects|Projects]]

## Related Entities

- [[wiki/entities/DailyFunding|DailyFunding]]

## Contradictions or Caveats

- The README is short, so some intent is inferred from code structure.
- Detailed API and business policy meaning requires backend or API documentation.
