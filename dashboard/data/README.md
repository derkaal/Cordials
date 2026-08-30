# Dashboard records

This folder contains append-only records written through the local Cordials Dashboard.

- `feedback.jsonl` records product, batch, and application feedback.
- `notes.jsonl` records general Control Room notes.
- `shopping-events.jsonl` records shopping-state changes without rewriting the source shopping list.

Each line is an independent JSON record with a stable ID and ISO timestamp. The existing Markdown and CSV records remain canonical; these files add observations and workflow events without rewriting historical recipes, research, or batches.
