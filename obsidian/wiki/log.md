# Log

Append-only chronological record of wiki operations.

Use this format:

```text
## [YYYY-MM-DD] type | title

- Source:
- Changed:
- Notes:
```

## [2026-04-22] setup | initial llm-wiki structure

- Source: karpathy llm-wiki pattern
- Changed: created raw/wiki/schema-oriented structure
- Notes: initialized index, log, overview, and templates

## [2026-04-22] setup | ranking and pruning policy

- Source: user request
- Changed: added ranking policy, archive area, template rank metadata, and workflow rules
- Notes: raw sources remain immutable; pruning applies only to derived wiki pages

## [2026-04-23] ingest | project source grouping

- Source: raw project summaries for dailyfund-front, lawinvest-front, and daily-publisher
- Changed: moved project summaries under raw/projects, translated project content to English, added project pages, added source notes, updated index and overview
- Notes: grouped project material without adding unrelated domains; caveats preserved for metadata mismatches and source uncertainty

## [2026-04-23] maintenance | project graph hub cleanup

- Source: project graph review
- Changed: replaced the project README hub with [[wiki/projects/Projects|Projects]] and linked it from Home, index, and project source notes
- Notes: keeps the project cluster visible in graph view with a clearer node label and fewer README-centered edges

## [2026-04-24] ingest | tteokbokki recipe note

- Source: https://www.maangchi.com/recipe/tteokbokki/comment-page-19
- Changed: added a tteokbokki source note and topic page; updated index and overview
- Notes: captured the classic spicy version centered on anchovy-kelp stock and marked common optional additions as variations rather than core requirements

## [2026-04-24] maintenance | project wiki visibility refresh

- Source: existing project pages and source notes under `wiki/projects` and `wiki/sources`
- Changed: expanded the project hub, listed individual project pages and source notes in `wiki/index.md`, and updated `wiki/overview.md` to reflect the current project-centered scope
- Notes: no raw project sources were changed; this was a navigation and synthesis update for the current project cluster

## [2026-04-24] maintenance | project repo re-review

- Source: local repositories `C:\Projects\dailyfund-front`, `C:\Projects\lawinvest-front`, and `C:\Projects\daily-publisher`
- Changed: refreshed project raw summaries, project pages, and source notes to match current local repository metadata, route structure, recent commits, and current caveats
- Notes: removed the outdated `lawinvest-front` metadata mismatch caveat; `daily-publisher` still has package/documentation drift and a dirty local worktree

## [2026-04-24] maintenance | llm-wiki operating model refinement

- Source: https://medium.com/@aristojeff/llm-wiki%EB%8A%94-%EB%AC%B4%EC%97%87%EC%9D%B4%EA%B3%A0-%EC%99%9C-%EC%A7%80%EA%B8%88-%EC%A3%BC%EB%AA%A9%EB%B0%9B%EB%8A%94%EA%B0%80-5c274bdf70ce
- Changed: refined the README, Home, overview, queries guide, and AGENTS schema to emphasize the wiki as a compiled knowledge layer, promote reusable query outputs, and clarify lint/search escalation behavior
- Notes: kept the existing raw/wiki separation and minimal structure; changes focused on operating guidance rather than adding new content domains

## [2026-04-24] query | egg fried rice note

- Source: user request for a simple cooking answer to be recorded in the wiki
- Changed: added `wiki/queries/egg-fried-rice.md` and linked it from `wiki/index.md`
- Notes: saved as a reusable query note based on general cooking knowledge without a dedicated raw source

## [2026-04-24] maintenance | mempalace work-memory integration

- Source: user request to attach MemPalace MCP for work-memory recall
- Changed: initialized `mempalace.yaml`, indexed the current vault into `.mempalace/palace`, registered a global `mempalace` MCP server for Codex, updated `.gitignore`, and documented MemPalace's role as a recall-only complement
- Notes: MemPalace is limited to recovering prior work context; durable claims still need verification against `wiki` or `raw`

## [2026-04-29] maintenance | nextjs codex cli gui scaffold

- Source: user request for an external GUI backed by Codex CLI instead of API billing
- Changed: added a `web/` Next.js scaffold with wiki file browsing APIs, a Codex execution API route, a browser UI, root ignore rules, and README usage notes
- Notes: the scaffold intentionally calls `codex exec` directly so usage stays on the CLI subscription path; no auth layer was added yet, so exposure should stay limited to trusted networks

## [2026-04-29] ingest | project entities backfill

- Source: existing raw project summaries for `dailyfund-front`, `lawinvest-front`, and `daily-publisher`
- Changed: added `wiki/entities/DailyFunding.md` and `wiki/entities/LawInvest.md`, linked entity references from project source notes, updated `wiki/index.md`, and corrected the stale `lawinvest-front` caveat in `wiki/projects/Projects.md`
- Notes: this completes missing entity-level ingest for the current project cluster without changing raw source material
