# lawinvest-front Project Summary

Created: 2026-04-23

## Nature

`lawinvest-front` is an internal LawInvest admin frontend. According to the current README and `package.json`, it is based on `Next.js 16` and `React 19`, and the application enters dashboard and work screens after login.

From the current code structure, its main work areas are user management, dispute management, payment management, statistics, and AlimTalk history lookup. The repository directory, package name, and description now consistently identify the project as `lawinvest-front` / "로인베스트 Admin".

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Ant Design 6
- TanStack React Query
- ky
- zod
- zustand
- recharts
- xlsx
- MSW

## Main Planning and Feature Areas

- Login: admin authentication entry point.
- Home and dashboard: operational statistics visualization.
- User management: user list and registration, lawyer list and registration, admin list.
- Dispute management: new dispute requests, dispute list, dispute registration, pleading calendar, dispute settlement history, detail screens.
- Payment management: payment list, payment addition, payment calendar, ledger lookup.
- Statistics: AlimTalk history lookup.
- Settings: admin settings screen.

## Design Structure

- `src/app`: App Router screens, divided into `(auth)`, `(main)`, and `api` groups.
- `src/app/(auth)/login`: login screen.
- `src/app/(main)`: post-login work screens, including `home`, `user`, `dispute`, `pay`, `stat`, `settings`, and `shared`.
- `src/components`: common UI such as tables, modals, layout, and theme provider.
- `src/server`: domain API request logic, including `accountBalance`, `alimtalk`, `apply`, `auth`, `capital`, `disputes`, `files`, `hearing`, `lawfirms`, `lawyers`, `litigants`, `managers`, `matters`, `payments`, `statistics`, and `users`.
- `src/lib`: ky API client, Ant Design theme, TanStack Query provider, MSW provider, and Excel download utilities.
- `src/types`: domain types for users, settlements, payments, cases, lawyers, documents, and disputes.
- `src/utils`: business data formatters for phone numbers, business numbers, currency, status, and time.
- `docker`: Dockerfile, Docker Compose, and Nginx configuration.

## Implementation Notes

- The UI frame is based on Ant Design.
- Sidebar menus are managed in `src/constants/Menu.tsx`.
- The sidebar exposes user management, dispute management, payment management, and statistics as top-level work groups.
- API requests are split in `src/server` by domain and by read/create/update/delete responsibilities.
- Excel download utilities exist across several domains.
- The README describes cookie-based token authentication, including token cleanup and redirect to login when authentication expires.
- `app/api/health` provides a health endpoint for deployment and status checks.
- `next.config.ts` enables the React Compiler and `output: 'standalone'`.
- The latest reviewed local commit was `aecc86d` on 2026-04-23.

## Operations and Deployment

- `yarn dev`: runs the development server on port 3000 with `.env.development`.
- `yarn build`: runs the Next.js production build with `.env.production`.
- `yarn start`: starts production mode on port 3000.
- `yarn lint`: runs ESLint fix.
- The `docker` directory contains Nginx and Docker Compose configuration.
- `scripts/deploy.sh` provides a separate deployment script.

## Verification and Testing

- MSW mock configuration exists.
- In the reviewed scope, verification appears to focus more on lint, type, and build checks than on a dedicated test script.
- Because the API layer is separated by domain with React Query and ky, screen-level checks and API mock checks should be straightforward to add.

## Wiki Use

- Use this as the source for the "LawInvest Admin" or "legal/dispute operations admin" project.
- The menu structure exposes the business domain structure clearly, so wiki project pages should organize it around users, disputes, payments, and statistics.
- The old package metadata mismatch caveat is no longer current and should be removed from derived wiki pages.

## Caveats and Uncertainty

- Detailed policies and workflows cannot be fully inferred from code names; backend documentation or operations planning documents would improve confidence.
- The README supports the basic project identity, but detailed UX behavior needs further review.

## Reviewed Sources

- `C:\Projects\lawinvest-front\README.md`
- `C:\Projects\lawinvest-front\package.json`
- `C:\Projects\lawinvest-front\src\constants\Menu.tsx`
- `C:\Projects\lawinvest-front\src\app`
- `C:\Projects\lawinvest-front\src\server`
- `C:\Projects\lawinvest-front\src\types`
- `C:\Projects\lawinvest-front\docker`
- `C:\Projects\lawinvest-front\next.config.ts`
- `git log -1` for `C:\Projects\lawinvest-front`
