# Project Status

Last updated: 2026-08-29

## Control summary

- **CURRENT PHASE:** Research migration and consolidation
- **Repository content:** Controlled-ingestion scaffolding; research exists externally and awaits migration/validation
- **Active development round:** Round 1
- **Latest consequential change:** Controlled research-ingestion workflow established

## Workstreams

| Workstream | Status | Current focus | Next action |
|---|---|---|---|
| Cordial taxonomy and techniques | Awaiting migration | Existing wider-project research | Ingest through import manifest and validate sources |
| Professional recipe database | Awaiting migration | Existing wider-project research | Validate provenance and duplicate records before assigning IDs |
| Round 1 reference formulations | Awaiting migration | Existing wider-project research | Validate formulations and map sources to candidates |
| Matcha compatibility | Awaiting migration | Existing wider-project research | Validate professional precedents and analysis |
| Food science / preservation / shelf life | Awaiting migration | Existing wider-project research | Validate every material claim against credible evidence |
| Economics and waste | Awaiting migration | Existing wider-project research | Separate sourced facts, assumptions, calculations, and measured data |
| Equipment and procurement | Awaiting migration | Existing wider-project research | Validate specifications, sources, suppliers, and price dates |
| Publishing landscape | Awaiting migration | Existing wider-project research | Validate and cite competitive research |
| Book structure | Not started | Outline placeholder | Draft after core research import |
| Manuscript | Not started | Chapter placeholders | Begin only when evidence base is ready |

## Round 1 status

| Candidate | Reference research | Candidate assessment | Experimental batches | Application tests | Key constraint/question |
|---|---|---|---|---|---|
| Yuzu | Research exists; awaiting migration/validation | Not started | None | None | Preserve and validate reference provenance |
| Strawberry–Vanilla | Research exists; awaiting migration/validation | Not started | None | None | Seasonality and ingredient availability |
| Peach–Tea–Thyme | Research exists; awaiting migration/validation | Not started | None | None | Preserve and validate reference provenance |
| Lychee | Research exists; awaiting migration/validation | Not started | None | None | Preserve and validate reference provenance |
| Pandan | Research exists; awaiting migration/validation | Not started | None | None | Preserve and validate reference provenance |
| Mango | Research exists; awaiting migration/validation | Not started | None | None | Can cordial plausibly replace purée in Mango Matcha and improve versatility? Do not assume superiority. |

## Open research questions

- Which verified professional formulations provide the most relevant reference points for each candidate?
- Which preservation and shelf-life claims are directly supported by credible evidence?
- What measurements and controls are required for responsible shelf-life evaluation?
- How should ingredient seasonality and sourcing be represented in candidate scoring?
- Which objective comparison will fairly test mango cordial against mango purée?
- What constitutes meaningful cross-category versatility and utilisation?

## Experiments awaiting execution

None scheduled. Formulations must first be created from verified source research or explicitly marked as original experimental work.

## Decisions made

| Date | Decision | Rationale | Record |
|---|---|---|---|
| 2026-08-29 | Use a human-readable Markdown/CSV repository with stable linked IDs. | Supports provenance, auditability, and long-term writing work. | `CHANGELOG.md` |
| 2026-08-29 | Preserve every experimental batch, including failures. | Prevents hindsight bias and protects the laboratory record. | `README.md` |

## Next actions

1. Receive the first research package in the requested structured format.
2. Assign an import ID and register the package in `01_research/imports_pending/IMPORT_MANIFEST.md`.
3. Validate citations, provenance, evidence types, duplicates, unsupported claims, and conflicts.
4. Record accepted, rejected, and pending items before promoting validated content.
5. Create stable source and recipe records for accepted material.
6. Continue package-by-package through all eight research streams and six Round 1 candidates.

## Blockers and risks

- Existing wider-project research has not yet been transferred into this repository.
- No empirical measurements are available locally.
- Food-safety and shelf-life conclusions must remain open until supported by appropriate evidence and testing.
