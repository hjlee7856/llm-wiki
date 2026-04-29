---
type: project
status: active
sources:
  - raw/projects/dailyfund-front.md
updated: 2026-04-24
rank:
  importance: 4
  confidence: 4
  freshness: 5
  usage: 0
---

# dailyfund-front

## Summary

`dailyfund-front` is the DailyFunding user-facing web frontend. The current local repository identifies it as package `dailyfunding_web` version `0.1.34`, and it remains a Next.js App Router product for investment, loan, company, disclosure, notice, news, landing, and external module flows.

## Core Areas

- Home experience with banners, products, disclosures, Daily Insight, news, service introduction, and Kakao floating access.
- Investment product discovery, product state views, detailed search, rollover guidance, and one-stop limit inquiry.
- Loan guidance and credit-loan related flows.
- Company information including history, location, executives, employees, and CI.
- Disclosure, customer support, notices, investor guides, news, and insight pages.
- External module flows such as auth bridge, KYC, and link integrations.

## Architecture Notes

- Frontend: Next.js `16.1.1`, React `19.2.1`, TypeScript, and Panda CSS.
- Data/API: `ky`, TanStack React Query, domain modules under `src/server`, and CSRF handling through `_csrftoken`.
- Quality/support: Sentry, Storybook, MSW, Jest, Testing Library, and additional Playwright/Vitest related tooling.
- Route shape: `src/app` is divided into `(main)`, `(module)`, and `bff`, with explicit flows for company, disclosure, loan, news, notice, landing, auth bridge, and one-stop limit test screens.
- Deployment: Docker/PM2/Nginx configuration under `dailyfund-front-docker`; app starts on port 3002 in production.
- Review point: latest checked local commit was `575dc4a` dated 2026-04-24.

## Caveats

- The README is short, so detailed planning intent is partly inferred from code structure.
- Product policies and API contract semantics need backend or API documentation for higher confidence.
- `styled-system` appears to be generated Panda CSS output and should not be treated as primary source material.

## Source

- [[wiki/sources/dailyfund-front-source|dailyfund-front source note]]
- [[raw/projects/dailyfund-front|raw project summary]]
