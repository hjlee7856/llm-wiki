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
