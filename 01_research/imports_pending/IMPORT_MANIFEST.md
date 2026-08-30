# Research Import Manifest

This manifest is the package-level audit trail for research migrated into CORDIALS. Register every incoming package before reviewing or extracting it. One row represents one immutable received package; if revised material arrives, create a new import ID and link it in the package record rather than overwriting the earlier package.

## Status vocabulary

- **Source/provenance status:** `UNREVIEWED`, `PARTIALLY DOCUMENTED`, `DOCUMENTED`, `CONFLICTING`, or `UNKNOWN`.
- **Ingestion status:** `RECEIVED`, `IN VALIDATION`, `PARTIALLY INGESTED`, `INGESTED`, `BLOCKED`, or `REJECTED`.

`INGESTED` means every item in the package has a recorded disposition; it does not mean every item was accepted.

## Package register

| Import ID | Research stream | Date received | Intended destination | Source/provenance status | Ingestion status | Validation issues | Resulting files/records | Commit hash |
|---|---|---|---|---|---|---|---|---|
| IMP-2026-001 | Professional recipe database / Round 1 reference formulations | 2026-08-29 | Round 1 research; sources; recipe leads; candidate records | CONFLICTING — PARTIALLY VALIDATED | PARTIALLY INGESTED | Diageo source versions conflict; Yuzu wording contradiction; Pandan dependency; Mango scaling ambiguity; Threshold C failed/open | SRC-2026-001–017; PR-0001–0012; five exact records; two benchmark-only records | ingestion `75eeb16`; validation `dadb74e` |

## Package record requirements

For each manifest row, create `IMP-YYYY-NNN.md` in this directory from the record structure below. Preserve the received package separately and link it from the record when repository storage is permitted.

### `IMP-YYYY-NNN` — package title

- **Research stream:** UNKNOWN
- **Date received:** UNKNOWN
- **Received format and filename:** UNKNOWN
- **Originating ChatGPT project/chat:** UNKNOWN
- **Supplied by:** UNKNOWN
- **Intended destination:** UNKNOWN
- **Source/provenance status:** UNREVIEWED
- **Ingestion status:** RECEIVED
- **Supersedes/is superseded by:** NOT APPLICABLE

#### Validation log

| Item/check | Result | Issue or conflict | Action required |
|---|---|---|---|
| Package integrity and readable structure | PENDING | UNKNOWN | UNKNOWN |
| Citations and URLs preserved | PENDING | UNKNOWN | UNKNOWN |
| Source-stated material separated from analysis | PENDING | UNKNOWN | UNKNOWN |
| Unsupported claims identified | PENDING | UNKNOWN | UNKNOWN |
| Duplicate sources checked | PENDING | UNKNOWN | UNKNOWN |
| Duplicate recipes checked | PENDING | UNKNOWN | UNKNOWN |
| Conflicts with existing records/packages checked | PENDING | UNKNOWN | UNKNOWN |
| Stable IDs assigned where accepted | PENDING | UNKNOWN | UNKNOWN |
| Provenance classifications validated | PENDING | UNKNOWN | UNKNOWN |
| `UNKNOWN` values preserved | PENDING | UNKNOWN | UNKNOWN |

#### Disposition log

Record every substantive item, claim group, source, or recipe. Nothing should disappear during consolidation.

| Package item | Disposition (`ACCEPTED` / `REJECTED` / `PENDING`) | Reason | Canonical destination or follow-up |
|---|---|---|---|
| UNKNOWN | PENDING | UNKNOWN | UNKNOWN |

#### Resulting records and commit

- **Source IDs:** UNKNOWN
- **Professional recipe IDs:** UNKNOWN
- **Other resulting files/records:** UNKNOWN
- **Validation issues remaining:** UNKNOWN
- **Ingestion commit hash:** UNKNOWN
