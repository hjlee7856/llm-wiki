# Overview

This page summarizes the current state of the wiki.

Update it when the overall synthesis changes.

## Current Scope

- The wiki currently has a software project cluster centered on three active project pages:
  - [[wiki/projects/dailyfund-front|dailyfund-front]]
  - [[wiki/projects/lawinvest-front|lawinvest-front]]
  - [[wiki/projects/daily-publisher|daily-publisher]]
- The project cluster is supported by matching source notes under [[wiki/sources/README|Source Notes]] and a graph hub at [[wiki/projects/Projects|Projects]].
- The project cluster now also has named entity pages for [[wiki/entities/DailyFunding|DailyFunding]] and [[wiki/entities/LawInvest|LawInvest]].
- Outside the project cluster, the wiki also contains a cooking note for [[wiki/topics/tteokbokki|Tteokbokki]].

## Main Themes

- The wiki is being operated as a compiled knowledge layer rather than a chat-only memory or search-only workflow.
- A shared frontend stack pattern built around Next.js 16, React 19, and TypeScript.
- Separation between one public service frontend and two internal admin/operations tools.
- Project documentation that is strongest on screen structure, API module boundaries, and deployment shape.
- Recurring caveats around metadata mismatches and differences between current implementation and future-direction documents.
- A smaller non-project knowledge area represented by the tteokbokki topic note.

## Operating Pattern

- Raw sources are preserved as source truth under `raw`.
- The wiki is expected to accumulate compiled summaries, linked topic pages, project pages, and reusable query outputs.
- Useful answers should migrate from chat into `wiki/queries` when they are likely to be reused.
- Linting is part of normal maintenance, not a one-time cleanup step.
- Search or graph-style retrieval can be added later if the wiki grows beyond what the index and linked pages handle comfortably.

## Open Questions

- Which project should be prioritized for deeper architecture documentation?
- Should project metadata mismatches be fixed in the source repositories?
- Are backend/API documents available for business policy verification?
- Should more household knowledge topics be added, or should cooking notes stay limited to explicit user requests?
