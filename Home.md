# LLM-Wiki Home

This vault is a persistent knowledge base maintained with an LLM.

## Start

- [[wiki/overview|Overview]]
- [[wiki/index|Index]]
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
- Run periodic lint passes to find gaps, stale claims, and missing links.
- Prune low-ranked derived pages into `wiki/archive` when the active wiki grows too large.

## Roles

- Human: curate sources, ask questions, review outputs, steer interpretation.
- LLM: summarize, cross-link, update pages, maintain `index.md` and `log.md`.
