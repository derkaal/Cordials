# Project Status

Last updated: 2026-08-30

## Control summary

- **CURRENT PHASE:** Research migration and consolidation
- **Repository content:** IMP-2026-001 partially validated; five exact and two benchmark-only records established
- **Active development round:** Round 1
- **Latest consequential change:** Targeted external findings promoted five exact source-version records
- **Active validation queue:** `02_sources/VALIDATION_QUEUE.md`

## Workstreams

| Workstream | Status | Current focus | Next action |
|---|---|---|---|
| Cordial taxonomy and techniques | Awaiting migration | Existing wider-project research | Ingest through import manifest and validate sources |
| Professional recipe database | Partially validated | Five exact records; two benchmark-only; remaining leads quarantined | Resolve Diageo PDF, Pandan dependency, Mango ambiguity, and remaining leads |
| Round 1 reference formulations | Partially validated | Threshold A/B results recorded; all Threshold C claims fail/remain open | Select source versions explicitly before Batch 001 planning |
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
| Yuzu | PR-0001 exact with source contradiction | Not started | None | None | Jack Schramm provenance corrected; yuzu/lemon contradiction must remain visible |
| Strawberry–Vanilla | PR-0002 exact | Not started | None | None | Between purée and syrup; seasonality remains operational constraint |
| Peach–Tea–Thyme | PR-0004/0005 exact current web version | Not started | None | None | PDF has conflicting base quantities; source version must be named |
| Lychee | PR-0007 exact; B pass | Not started | None | None | Alcoholic benchmark; Threshold C failed |
| Pandan | PR-0009 B pass; A conditional | Not started | None | None | Capture linked simple-syrup definition; alcoholic limitation |
| Mango | PR-0012 B pass; A fail | Not started | None | None | Per-litre scaling ambiguous; nominal 6 L yield; purée remains incumbent |

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

1. Obtain exact Diageo PDF quantities as a separate versioned transcription; do not harmonise with web records.
2. Capture the linked simple-syrup definition for PR-0009 Pandan.
3. Preserve PR-0012 Mango scaling ambiguity unless better source evidence resolves it.
4. Validate remaining quarantined formulation leads in queue order.
5. Begin Batch 001 planning only with explicit recipe/source version and without shelf-life safety inference.

## Blockers and risks

- Existing wider-project research has not yet been transferred into this repository.
- No empirical measurements are available locally.
- Food-safety and shelf-life conclusions must remain open until supported by appropriate evidence and testing.
