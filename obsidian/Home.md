# LLM-Wiki Home

This vault is a persistent knowledge base maintained with an LLM.

Think of it as a compiled knowledge layer between raw sources and repeated questions.

## Start

- [[wiki/overview|Overview]]
- [[wiki/index|Index]]
- [[wiki/projects/Projects|Projects]]
- [[wiki/log|Log]]
- [[wiki/ranking|Ranking]]
- [[raw/README|Raw Sources]]
- [[wiki/archive/README|Archive]]
- [[wiki/sources/README|Source Notes]]
- [[wiki/topics/README|Topics]]
- [[wiki/entities/README|Entities]]
- [[wiki/queries/README|Queries]]
- [[90_Templates/README|Templates]]

## Workflows

- Ingest a new source into `raw`.
- Ask questions against `wiki`.
- Save reusable answers back into `wiki/queries`.
- Run periodic lint passes to find gaps, stale claims, and missing links.
- Prune low-ranked derived pages into `wiki/archive` when the active wiki grows too large.

## Roles

- Human: curate sources, ask questions, review outputs, steer interpretation.
- LLM: summarize, cross-link, update pages, maintain `index.md` and `log.md`.

## Operating Idea

- `raw` keeps source truth.
- `wiki` keeps compiled, linked, reviewable knowledge.
- Good outputs should be turned into reusable files instead of staying only in chat.
