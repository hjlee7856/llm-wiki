---
type: source
status: active
source_file: raw/projects/lawinvest-front.md
created: 2026-04-23
rank:
  importance: 4
  confidence: 4
  freshness: 5
  usage: 1
---

# lawinvest-front Source

## Source

- [[raw/projects/lawinvest-front|raw/projects/lawinvest-front.md]]

## Summary

The source describes `lawinvest-front` as an internal LawInvest admin frontend built with Next.js 16, React 19, TypeScript, Ant Design 6, TanStack React Query, and domain-specific API modules. The latest local review confirms that the repository metadata now consistently matches the LawInvest identity.

## Key Claims

- The project focuses on user management, dispute management, payment management, statistics, and AlimTalk history.
- The menu structure exposes the main business domains.
- Cookie-based token authentication is used.
- Deployment support includes Docker, Nginx, Docker Compose, and a deploy script.
- `next.config.ts` enables React Compiler and standalone output.

## Evidence

- Reviewed project files include `README.md`, `package.json`, `next.config.ts`, `src/constants/Menu.tsx`, `src/app`, `src/server`, `src/types`, and `docker`, plus the latest local commit metadata.

## Related Topics

- [[wiki/projects/lawinvest-front|lawinvest-front]]
- [[wiki/projects/Projects|Projects]]

## Related Entities

- [[wiki/entities/LawInvest|LawInvest]]

## Contradictions or Caveats

- Detailed workflow and policy behavior needs backend or operations documentation.
