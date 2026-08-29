# Project Status

Last updated: 2026-08-29

## Control summary

- **CURRENT PHASE:** Research migration and consolidation
- **Repository content:** First Round 1 package partially ingested; direct validation remains outstanding
- **Active development round:** Round 1
- **Latest consequential change:** IMP-2026-001 ingested as quarantined source and formulation leads
- **Active validation queue:** `02_sources/VALIDATION_QUEUE.md`

## Workstreams

| Workstream | Status | Current focus | Next action |
|---|---|---|---|
| Cordial taxonomy and techniques | Awaiting migration | Existing wider-project research | Ingest through import manifest and validate sources |
| Professional recipe database | Validation queued | 12 quarantined formulation leads; provenance UNKNOWN | Retrieve exact priority source pages in queue order |
| Round 1 reference formulations | Validation queued | IMP-2026-001 covers six candidates | Apply separate exact-recipe, benchmark, and safety thresholds |
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
| Yuzu | IMP-2026-001 ingested; PR-0001 quarantined | Not started | None | None | Peel/method/yield ambiguity; direct validation required |
| Strawberry–Vanilla | IMP-2026-001 ingested; PR-0002 priority validation | Not started | None | None | Seasonality plus naming/classification and source validation |
| Peach–Tea–Thyme | IMP-2026-001 ingested; PR-0004/0005 priority validation | Not started | None | None | Yield and shelf-life wording unresolved |
| Lychee | IMP-2026-001 ingested; PR-0007 priority validation | Not started | None | None | Alcoholic benchmark; units/yield/storage unresolved |
| Pandan | IMP-2026-001 ingested; three incomplete leads | Not started | None | None | No reproducible exact formulation yet; alcoholic limitation |
| Mango | IMP-2026-001 ingested; PR-0012 incomplete | Not started | None | None | Clarification specification absent; purée remains incumbent |

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

1. Retrieve `SRC-2026-003` (Epicurious Wild Strawberry Cordial).
2. Retrieve `SRC-2026-007` and compare both Diageo regional pages.
3. Retrieve `SRC-2026-008` (Diageo cordials-on-tap PDF).
4. Retrieve `SRC-2026-010` (Liquor.com Lychee Rosé).
5. Then retrieve Yuzu, Mango, and Pandan priority sources in queue order.
6. Return compact validation packages; do not alter recipe provenance until evidence is ingested.

## Blockers and risks

- Existing wider-project research has not yet been transferred into this repository.
- No empirical measurements are available locally.
- Food-safety and shelf-life conclusions must remain open until supported by appropriate evidence and testing.
