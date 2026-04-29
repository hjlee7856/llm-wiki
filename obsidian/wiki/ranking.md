# Ranking

Policy for keeping the active wiki focused as it grows.

## Scope

- Rank only derived wiki pages.
- Never prune, delete, or move raw source files in `raw`.
- Prefer archive over deletion.
- Keep archive decisions visible in [[wiki/log|Log]].

## Metadata

Use this frontmatter on source notes, topic pages, entity pages, and saved query notes:

```yaml
rank:
  importance: 1
  confidence: 1
  freshness: 1
  usage: 0
status: active
```

## Scores

- `importance`: 1-5. How central the page is to the knowledge base.
- `confidence`: 1-5. How well supported the page is by raw sources.
- `freshness`: 1-5. How current the page is for time-sensitive claims.
- `usage`: non-negative integer. Meaningful references in ingest or query work.

Base score:

```text
score = importance + confidence + freshness
```

Use `usage` only as a tie-breaker.

## Status

- `active`: visible in normal navigation.
- `watch`: useful but weak, stale, or under-supported.
- `archived`: removed from active navigation but preserved.
- `deprecated`: contradicted, superseded, or no longer recommended.

## Thresholds

- `11-15`: keep active.
- `8-10`: keep active or mark `watch`.
- `5-7`: archive candidate.
- `3-4`: archive unless there is a specific reason to keep.

## Pruning Workflow

1. Review `wiki/index.md`.
2. Score candidate pages.
3. Do not touch `raw`.
4. Move low-score derived pages to [[wiki/archive/README|Archive]] only when pruning is requested.
5. Remove archived pages from active index sections.
6. Add archive links only under an archive section if needed.
7. Append the decision to [[wiki/log|Log]].

## Archive Reason Format

Use a short reason when archiving:

```text
Archived because score=6, low usage, and claims are covered by another page.
```
