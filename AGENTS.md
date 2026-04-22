# AGENTS.md

## Language

- Answer the user in Korean.
- Keep generated wiki pages in English unless the user explicitly asks otherwise.
- User-facing guides such as `README.md` may be Korean.

## Project Purpose

- This vault is not a wiki about LLMs.
- This vault is an LLM-maintained knowledge base.
- The user curates sources, asks questions, reviews results, and steers interpretation.
- The LLM maintains the wiki: summarizing sources, creating pages, updating links, surfacing contradictions, maintaining the index, and appending the log.

## No Git or Slack

- Do not use git in this project.
- Do not inspect git history, run git status, create commits, or rely on repository metadata.
- Do not use Slack for task reporting in this project.
- Do not search Slack channels, read Slack context, draft Slack messages, or post Slack updates.

## Encoding Safety

- Read and write files with explicit UTF-8.
- Do not use PowerShell `Get-Content`, `Set-Content`, or `-replace` for source edits.
- Prefer `apply_patch` for manual edits.
- If `apply_patch` fails with `Invalid Context`, re-read the file with explicit UTF-8 and patch smaller hunks.
- If non-ASCII content appears garbled, rewrite the whole affected file in UTF-8.

## Architecture

### `raw`

- Stores source material.
- Treat raw files as immutable unless the user explicitly asks to edit them.
- Raw files are the source of truth.
- If cleanup is needed, create a derived copy instead of modifying the original.

### `wiki`

- Stores LLM-generated and LLM-maintained Markdown pages.
- The LLM may create and update pages here.
- Important claims should link to source notes or raw sources.
- Contradictions should be marked, not silently erased.

### `AGENTS.md`

- Defines this operating schema.
- Update it only when the user asks to change wiki operating rules.

## Required Files

- `Home.md`: human and LLM entry point.
- `wiki/overview.md`: current high-level synthesis.
- `wiki/index.md`: content-oriented catalog of wiki pages.
- `wiki/log.md`: append-only chronological activity record.
- `wiki/ranking.md`: scoring and pruning policy.
- `wiki/archive/README.md`: archive rules for low-priority derived pages.
- `raw/README.md`: raw source rules.
- `90_Templates/README.md`: list of reusable templates.

## Workflows

### Ingest

When the user asks to ingest a source:

1. Read the raw source with explicit UTF-8 when it is a text file.
2. Identify key claims, entities, topics, evidence, dates, and caveats.
3. Create or update a source note in `wiki/sources`.
4. Create or update related topic pages in `wiki/topics`.
5. Create or update related entity pages in `wiki/entities`.
6. Mark contradictions or uncertainty explicitly.
7. Update `wiki/index.md`.
8. Append an entry to `wiki/log.md`.
9. Report changed files and remaining uncertainties.

### Query

When the user asks a question against the wiki:

1. Read `wiki/index.md` first.
2. Read the relevant wiki pages.
3. Read raw sources only when precision or verification requires it.
4. Answer with references to wiki pages or raw sources.
5. If the answer is reusable, ask or infer whether to save it in `wiki/queries`.
6. If saved, update `wiki/index.md` and append to `wiki/log.md`.

### Lint

When asked to lint or health-check the wiki:

1. Look for orphan pages.
2. Look for pages missing from `wiki/index.md`.
3. Look for strong claims without sources.
4. Look for contradictions across pages.
5. Look for stale claims superseded by newer sources.
6. Suggest missing topic or entity pages.
7. Append a lint entry to `wiki/log.md` if files are changed.

### Prune

When the user asks to prune, reduce, or rank the wiki:

1. Read `wiki/ranking.md`.
2. Do not delete or move files in `raw`.
3. Score derived wiki pages using `importance + confidence + freshness`.
4. Use `usage` only as a tie-breaker.
5. Keep high-score pages in active navigation.
6. Mark low-score pages as `status: archived` and move them to `wiki/archive` when pruning is requested.
7. Update links and remove archived pages from active sections of `wiki/index.md`.
8. Append a prune/archive entry to `wiki/log.md`.
9. Report archived pages and the reason for each archive decision.

## Editing Rules

- Keep changes small and directly tied to the request.
- Preserve Obsidian links where possible.
- When adding a wiki page, link it from `wiki/index.md` or a nearby index page.
- When changing the high-level synthesis, update `wiki/overview.md`.
- When processing a source, do not treat the generated summary as a replacement for the raw source.
- Prefer explicit uncertainty over polished but unsupported claims.
- Pruning applies only to derived wiki pages, never to raw source files.
- Archive before deleting. Delete archived pages only if the user explicitly asks.

## Templates

- Source note: `90_Templates/Source Summary Template.md`
- Topic page: `90_Templates/Topic Page Template.md`
- Entity page: `90_Templates/Entity Page Template.md`
- Query note: `90_Templates/Query Note Template.md`

## Ranking Metadata

Use this frontmatter block for derived wiki pages:

```yaml
rank:
  importance: 1
  confidence: 1
  freshness: 1
  usage: 0
status: active
```

- `importance`: centrality to the user's knowledge base.
- `confidence`: quality of source support.
- `freshness`: currentness for time-sensitive claims.
- `usage`: number of meaningful references in ingest/query work.
- `status`: `active`, `watch`, `archived`, or `deprecated`.

## Verification

- After edits, verify changed files were created or updated.
- Check Obsidian links when links were edited.
- Check that `wiki/index.md` and `wiki/log.md` were updated when the workflow requires it.
- State what changed, why it fits this LLM-Wiki structure, affected scope, risks, and verification status.
