# Research Ingestion Workflow

Incoming ChatGPT research is a research package to validate, not canonical content to copy directly into destination files. The package may combine quotations, paraphrases, links, analysis, inferred formulations, duplicates, and unresolved contradictions. Preserve it as received while promoting only reviewed material into canonical records.

## 1. Receive and freeze the package

1. Assign the next stable import ID using `IMP-YYYY-NNN`.
2. Add the package to `01_research/imports_pending/IMPORT_MANIFEST.md` with status `RECEIVED`.
3. Create its package record in `01_research/imports_pending/`.
4. Preserve the supplied text, citations, URLs, headings, and explicit unknowns. Do not silently tidy substantive wording at this stage.
5. Record the originating chat/project and original filename or message when known. Use `UNKNOWN` when it is not known.

## 2. Inventory the contents

Break the package into reviewable units: sources, recipes/formulations, factual claims, calculations, hypotheses, editorial analysis, and open questions. Record intended canonical destinations without moving content yet.

Mark the import `IN VALIDATION`. A package can cover more than one research stream, but each resulting record must retain the import ID.

## 3. Validate sources and citations

For every citation or URL:

- preserve the supplied citation and URL exactly enough to trace it;
- determine whether it identifies a primary source, a secondary source, or only a lead;
- check whether the cited source directly supports the associated claim;
- retain exact page, section, or timestamp information when supplied;
- identify broken, incomplete, ambiguous, circular, or unsupported citations;
- check `02_sources/bibliography.csv` and existing source records for duplicates; and
- assign a new stable `SRC-YYYY-NNN` only after the source has been distinguished from existing records.

Do not treat a ChatGPT statement about a source as if it were the source itself. If direct verification has not occurred, record that limitation and leave the relevant claim pending.

## 4. Separate evidence from analysis

Preserve the repository's evidence types:

- `SOURCE-STATED FACT` for information actually stated by a cited source;
- `CALCULATED VALUE` for reproducible calculations with inputs and method;
- `EXPERIMENTAL MEASUREMENT` only for documented observations or measurements;
- `HYPOTHESIS` for propositions requiring evidence or testing; and
- `EDITORIAL INTERPRETATION` for synthesis, comparison, or judgement.

Keep quotations visibly distinct from paraphrases and analysis. Do not recast ChatGPT synthesis as source-stated fact. Preserve `UNKNOWN`, `NOT MEASURED`, and `NOT APPLICABLE` according to the data dictionary; never fill gaps by inference.

## 5. Validate formulations and provenance

For every recipe or formulation:

1. Check the professional recipe index and source records for duplicates or alternate versions.
2. Compare title, attribution, venue, ingredients, quantities, method, yield, and source location.
3. Assign a stable `PR-NNNN` only after determining that a separate record is warranted.
4. Use `EXACT SOURCED RECIPE` only when the recorded formulation is reproduced from a traceable source without inferred or altered formulation details.
5. Never convert a reconstructed, completed, normalised, inferred, or ChatGPT-generated formulation into `EXACT SOURCED RECIPE`.
6. Record departures from a sourced formulation as `ADAPTATION OF SOURCED RECIPE` and show the changes.
7. Do not create a new active `ORIGINAL EXPERIMENTAL FORMULATION` without explicit written user authorisation. Under the active source-only rule, formulate through `EXACT SOURCED RECIPE` or `ADAPTATION OF SOURCED RECIPE` and preserve the professional/commercial lineage. The original classification may still describe historical or imported material.
8. Leave missing quantities, steps, yield, storage, shelf life, or attribution as `UNKNOWN`.

## 6. Detect conflicts and duplicates

Compare the package with prior imports and canonical records. Flag rather than silently merge or resolve:

- conflicting quantities, methods, yields, attributions, dates, or venue details;
- incompatible shelf-life, pH, preservation, or food-safety claims;
- duplicate recipes presented under different names;
- duplicate sources represented by different URLs or citations; and
- disagreement between source-stated information and package analysis.

Record both positions, their supporting sources, and the validation needed. A canonical record may remain `UNKNOWN` or disputed while the conflict is open.

## 7. Decide and promote

Give every reviewable item one explicit disposition:

- `ACCEPTED`: validated and written to a named canonical file or record;
- `REJECTED`: not promoted, with a recorded reason; or
- `PENDING`: retained for missing evidence, unresolved conflict, duplicate review, or another stated dependency.

Promotion means creating or updating canonical source, recipe, research, or development records with links back to the import ID. Do not paste the whole package into a canonical thematic file as a substitute for review.

Use `PARTIALLY INGESTED` when some items have been promoted but others remain pending. Use `REJECTED` for a package only when no package content is accepted and every item has a recorded reason. Use `INGESTED` only when all items have a disposition and all resulting records are listed.

## 8. Close and commit

1. Complete the validation and disposition logs in the package record.
2. Update the manifest with validation issues and all resulting files/record IDs.
3. Update `PROJECT_STATUS.md` and other registers affected by the import.
4. Commit the ingestion as a discrete, descriptive Git commit.
5. Add the commit hash to the package record and manifest in a follow-up metadata commit if necessary; do not rewrite history merely to embed a commit's own hash.

The original package and rejected or pending material remain traceable. Consolidation must not erase the evidentiary trail.
