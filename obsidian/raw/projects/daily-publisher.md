# daily-publisher Project Summary

Created: 2026-04-23

## Nature

`daily-publisher` is an internal editing and deployment tool for static HTML/CSS pages or product publishing files. It includes a Next.js admin UI, local DB, file storage, ZIP upload and download, preview, template management, and external Publisher API integration.

Recent planning documents mention migration directions such as moving file lists and file management to the backend, and moving template file management to S3.

## Technology Stack

- Next.js 16
- React 19
- TypeScript
- Ant Design 6
- Tailwind CSS
- better-sqlite3
- AWS S3 SDK
- bcryptjs
- jsonwebtoken
- zod
- sonner
- lucide-react

## Main Planning and Feature Areas

- Login, logout, and admin account update.
- Page list lookup, search, creation, update, status change, soft delete, restore, and permanent delete.
- HTML/CSS/asset updates through ZIP upload.
- Page download.
- Page publish status management.
- Template list, rename, delete, and import into a page.
- Editor screen: left page/template panel, center preview iframe, right quick-edit panel, and top bar.
- Preview routes: serving saved static files by `pageId/filePath`.
- External Publisher API integration: product file list, upload, replacement, delete, restore, download, and static file fetch.

## Design Structure

- `app`: Next.js App Router screens and API routes.
- `app/editor`: main editing screen.
- `app/editor/preview`: editor preview screen.
- `app/settings`: settings screen.
- `app/api/auth`: login, logout, and admin update.
- `app/api/pages`: page CRUD, upload, trash, download, and template handling.
- `app/api/templates`: template list, update, delete, and import.
- `app/api/bff/health`: health endpoint.
- `app/preview/[pageId]/[...filePath]`: stored or external Publisher static file proxy and preview route.
- `components/editor`: editor UI split into `left-panel`, `preview-panel`, `right-panel`, and `top-bar`.
- `hooks/editor`: editor session, page API, draft, dirty snapshot, auth guard, and related editing state hooks.
- `lib/editor`: page model, settings, HTML/CSS utilities, and computed style conversion.
- `lib/db`: SQLite instance, schema, and index.
- `lib/auth`: cookie/JWT authentication and DB authentication utilities.
- `lib/storage`: client localStorage draft and server template S3 storage.
- `lib/publisher`: external Publisher API client.
- `deploy`: Docker, PM2, Nginx, and blue-green deployment documentation.

## Data and Storage Structure

The current implementation uses both SQLite DB storage and file storage.

- `users`: admin users with `id`, `username`, `password_hash`, and `created_at`.
- `pages`: page metadata with `id`, `title`, `html_path`, `css_path`, `status`, `is_deleted`, `created_at`, and `updated_at`.
- `templates`: template metadata with `id`, `title`, `html_path`, `css_path`, `status`, `is_deleted`, `created_at`, and `updated_at`.

Page HTML/CSS bodies are not stored directly in DB columns. Instead, the DB stores file paths. Based on the documents, the existing implementation updates files such as `data/pages/{pageId}/index.html` and `data/pages/{pageId}/styles.css`.

## Implementation Notes

- A successful login issues an `auth_token` cookie, and protected APIs identify the user through that cookie.
- DB initialization seeds a default `admin` user.
- Migration code handles legacy schema changes such as renaming `email` to `username` and removing legacy page columns.
- The external Publisher API obtains an access token with client credentials and calls file APIs with a Bearer token.
- Publisher API integration covers product file list lookup, ZIP upload, single-file replacement, product file delete, restore, ZIP download, and static file fetch.
- S3-related environment variables are recorded in the planning document as `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`, and `S3_REGION`.
- The latest reviewed local commit was `ae8cebd` on 2026-04-21.

## Operations and Deployment

- `yarn dev`: runs the Next.js development server.
- `yarn build`: runs the production build.
- `yarn start`: starts production mode.
- `yarn lint`: runs ESLint.
- `yarn format`: runs Prettier write.
- `yarn format:check`: runs Prettier check.
- According to `deploy/README.md`, deployment uses a Docker + PM2 + Nginx blue-green strategy.
- Deployment uploads the new version to the inactive blue/green container, runs a health check, and switches the Nginx upstream.

## Verification and Testing

- No dedicated test script was found in package scripts.
- Lint, format check, and build are the basic verification tools.
- Because the app combines API, DB, and file storage behavior, meaningful changes should be verified with at least build checks and manual checks for key APIs.

## Wiki Use

- Classify this as a "publishing file management tool" or "static page editor/deployment admin" project.
- The wiki project page should separate editor UI, page/template APIs, storage structure, external Publisher API integration, and deployment strategy.
- Because the current code and `PLAN.md` show both current implementation and migration direction, the wiki should keep "current implementation" and "future direction" separate.

## Caveats and Uncertainty

- `docs/backend-structure-handoff.md` mentions a `fonts` table/API, but the reviewed `lib/db/schema.ts` appears centered on `users`, `pages`, and `templates`. There may be a difference between documentation and code.
- `package.json` still uses `my-project` as the package name, so project metadata cleanup is needed.
- File management backend migration and template S3 migration appear to be in progress; current implementation should not be confused with the target structure.
- The local worktree was not fully clean at review time because `next-env.d.ts` was modified.

## Reviewed Sources

- `C:\Projects\daily-publisher\package.json`
- `C:\Projects\daily-publisher\PLAN.md`
- `C:\Projects\daily-publisher\docs\backend-structure-handoff.md`
- `C:\Projects\daily-publisher\deploy\README.md`
- `C:\Projects\daily-publisher\lib\db\schema.ts`
- `C:\Projects\daily-publisher\lib\publisher\api.ts`
- `C:\Projects\daily-publisher\app`
- `C:\Projects\daily-publisher\components\editor`
- `git log -1` and `git status --short` for `C:\Projects\daily-publisher`
