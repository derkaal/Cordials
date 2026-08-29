# CORDIALS

CORDIALS is the canonical research, development, and writing repository for a professionally researched book about modern cordials across matcha and tea, coffee, zero-proof drinks, and cocktails.

The working thesis is that a well-designed cordial may compress flavour, sweetness, acidity, and aroma into a versatile preparation that simplifies service, extends usable ingredient life, and reduces waste. Each claim and formulation must be tested rather than assumed.

> **Prep once. Waste less. Make more.**

## Current status

The repository is in the research migration and consolidation phase. Existing research from the wider project is **awaiting migration and validation**. No research findings, recipes, safety claims, or measurements are asserted by the repository scaffolding.

Round 1 candidates are Yuzu, Strawberry–Vanilla, Peach–Tea–Thyme, Lychee, Pandan, and Mango. Mango development asks whether a cordial can plausibly replace mango purée in a successful Mango Matcha while improving cross-category versatility; superiority is not assumed. Strawberry development must account for seasonality and availability.

See [PROJECT_STATUS.md](PROJECT_STATUS.md) for the active control room.

## Repository map

| Path | Purpose |
|---|---|
| `00_project_control/` | Governance, conventions, decisions, and project control |
| `01_research/` | Thematic research notes and staged imports |
| `02_sources/` | Source records and bibliography |
| `03_professional_recipes/` | Provenance-controlled professional recipe database |
| `04_round_1_development/` | One development record per Round 1 cordial |
| `05_lab_notebook/` | Batch register and permanent experimental batch records |
| `06_application_testing/` | Drink tests across all four categories |
| `07_food_science_shelf_life/` | Scientific evidence and longitudinal observations |
| `08_economics_waste/` | Cost, yield, utilisation, and waste models |
| `09_equipment_procurement/` | Equipment requirements and purchasing evidence |
| `10_book_outline/` | Book architecture and chapter planning |
| `11_manuscript/` | Draft manuscript files |
| `12_figures_tables/` | Publication figures, tables, and their source notes |
| `13_archive/` | Superseded material retained for traceability |
| `templates/` | Reusable records for research and development |

Each working area contains an index explaining what belongs there. Use Markdown for narrative records and CSV for registers and calculations.

## Evidence and provenance rules

Every formulation must use exactly one classification:

1. `EXACT SOURCED RECIPE`
2. `ADAPTATION OF SOURCED RECIPE`
3. `ORIGINAL EXPERIMENTAL FORMULATION`

Never invent an existing recipe, attribution, measurement, or missing field. Record unavailable information as `UNKNOWN`. Preserve the distinction among:

- source-stated facts;
- calculated values;
- experimental measurements;
- hypotheses; and
- editorial interpretation.

Claims about shelf life, preservation, pH, food safety, or similar risks require credible scientific or professional evidence. Link every extracted claim or recipe to a source record in `02_sources/`. Record adaptations explicitly and retain the source formulation alongside the changes.

## Working conventions

- Assign stable IDs using [00_project_control/ID_CONVENTIONS.md](00_project_control/ID_CONVENTIONS.md).
- Copy the appropriate file from `templates/`; do not overwrite the template.
- Record all batches, including failures. Never delete or retrospectively sanitise failed experiments.
- Use ISO dates (`YYYY-MM-DD`) and metric units. Preserve source units when quoting, then document conversions separately.
- Keep raw imports in `01_research/imports_pending/` until reviewed, attributed, and filed.
- Register every incoming package in `01_research/imports_pending/IMPORT_MANIFEST.md` and follow `00_project_control/RESEARCH_INGESTION_WORKFLOW.md`; ChatGPT research is not copied directly into canonical files.
- Update `PROJECT_STATUS.md` after meaningful progress and `CHANGELOG.md` after consequential decisions or structural changes.
- Do not place confidential, personal, licensed, or large binary source files in Git unless permission and storage policy are clear.

## Starting workflow

1. Create a source record and bibliography entry.
2. Import or extract research with claim-level attribution.
3. Create any professional recipe record with the correct provenance class.
4. Assess the relevant cordial candidate.
5. Create a batch record before execution and append results over time.
6. Create separate application and shelf-life records linked to the batch ID.
7. Add measured cost, yield, and waste data only when available.
