# dailyfund-front Project Summary

Created: 2026-04-23

## Nature

`dailyfund-front` is the DailyFunding user-facing web frontend. The repository URL is `https://github.com/DailyFunding/dailyfund-front`, and the current local `package.json` identifies the package as `dailyfunding_web` with version `0.1.34`.

Based on the code structure, it is a Next.js App Router web project that provides investment product discovery, loan information, company information, disclosures, notices and news, landing pages, and integrations with apps or external modules.

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Panda CSS
- TanStack React Query
- ky
- Zustand
- React Hook Form
- Zod
- Sentry
- Storybook
- Jest / Testing Library / Playwright / Vitest related tooling
- MSW

## Main Planning and Feature Areas

- Home: main banners, investment products, disclosure summary, Daily Insight, news, service introduction, Kakao floating button.
- Investment: new and closed products, detailed search, investment service introduction, rollover guidance, one-stop limit inquiry flow.
- Loan: loan guidance and credit loan campus/town flows.
- Company: company introduction, history, location, executives and employees, CI.
- Disclosures: management disclosures, operating disclosures, internal-control-style disclosures, cumulative loan volume, yield, delinquency rate, and related metrics.
- Customer support: notices and investor guides.
- News and insight: news list, popular news, banners.
- Modules: auth bridge, KYC, link integrations, and other screens connecting to external apps or services.

## Design Structure

- `src/app`: Next.js App Router screens, divided into `(main)`, `(module)`, and `bff` groups.
- `src/server`: domain server/API modules, including `Auth`, `Company`, `Disclosure`, `History`, `Insight`, `Invest`, `Landing`, `Loan`, `Main`, `Member`, `Menu`, `Meta`, `News`, `Notice`, `NoticeDetail`, `Popup`, `SSE`, `StaffInfo`, and `oneStopLimitTest`.
- `src/components`: common UI such as Header/Footer, Toast, modals, inputs, text, Carousel, SecureImage, and investment product cards.
- `src/hooks`: client hooks for device detection, scroll, debounce, lazy loading, and product time updates.
- `src/lib`: ky API client, error handling, Kakao address utilities, and middleware-like utilities.
- `src/constants`: product types, style tokens, URLs, countries, and news constants.
- `__mocks__/msw`: MSW handlers by domain.
- `__tests__`: tests for major App Router pages.
- `dailyfund-front-docker`: Nginx, PM2, and Docker Compose based dev/prod deployment configuration.

## Implementation Notes

- The API client is based on `ky` and unwraps successful response envelopes to return only `data`.
- The CSRF token is read from the `_csrftoken` cookie and attached as the `x-csrftoken` header.
- `src/proxy.ts` sets a pathname header and handles CSRF cookie setup.
- `next.config.ts` configures `cacheComponents: true`, a custom cache handler, Sentry, remote image patterns, and production console removal.
- The Sentry release is tied to the `package.json` version.
- Storybook uses a separate API base URL when `STORYBOOK=true`.
- The development server runs with `next dev --turbo -p 3002`.
- The latest reviewed local commit was `575dc4a` on 2026-04-24.

## Operations and Deployment

- `yarn dev`: runs the development server.
- `yarn build`: runs Panda CSS codegen, then builds Next.js with the production environment.
- `yarn storybook`: runs Storybook.
- `yarn build:storybook`: builds static Storybook output.
- `yarn start`: starts Next.js on port 3002.
- Docker, PM2, and Nginx configuration is stored in `dailyfund-front-docker`.
- The README records the development web address and Storybook address.

## Verification and Testing

- Jest and Testing Library test configuration exists.
- MSW provides API mocks.
- Storybook and the Storybook test runner are included.
- Playwright and Vitest related packages are included in devDependencies.
- `jest-result.json` exists, indicating that recent test result output has been stored before.

## Wiki Use

- Use this as the source for the "DailyFunding user web" project.
- The safest functional grouping is based on `src/app/(main)` routes and `src/server` domain names.
- Architecture notes should be organized around App Router, domain API modules, common components, MSW, Storybook, and test structure.

## Caveats and Uncertainty

- The README is short, so some detailed planning intent is inferred from code structure.
- Actual operating policies, product policies, and detailed API contract semantics require backend or API documentation.
- `styled-system` appears to be Panda CSS generated output and should be treated as build output rather than primary design source material.

## Reviewed Sources

- `C:\Projects\dailyfund-front\package.json`
- `C:\Projects\dailyfund-front\README.md`
- `C:\Projects\dailyfund-front\next.config.ts`
- `C:\Projects\dailyfund-front\src\proxy.ts`
- `C:\Projects\dailyfund-front\src\lib\Ky\Instanse.ts`
- `C:\Projects\dailyfund-front\src\app`
- `C:\Projects\dailyfund-front\src\server`
- `C:\Projects\dailyfund-front\src\components`
- `git log -1` for `C:\Projects\dailyfund-front`
