# Data Dictionary

## Required controlled values

### Provenance classification

- `EXACT SOURCED RECIPE`
- `ADAPTATION OF SOURCED RECIPE`
- `ORIGINAL EXPERIMENTAL FORMULATION`

Current formulation-authoring rule from 2026-08-31: active recipe, batch, and application formulations are limited to `EXACT SOURCED RECIPE` and `ADAPTATION OF SOURCED RECIPE` unless the user explicitly authorises an original formulation in writing. `ORIGINAL EXPERIMENTAL FORMULATION` remains available only to classify historical/imported material. `ORIGINAL EXPERIMENTAL METHOD` may be used for test protocols because a measurement method is not a recipe formulation.

### Beverage-application relevance

- `DIRECT BEVERAGE FORMULATION`: complete professional/commercial drink or drink-component recipe intended for beverage service.
- `BEVERAGE PAIRING OR SERVICE PRECEDENT`: commercially active drink evidence that validates a pairing or service architecture but does not disclose a reproducible formulation.
- `SUPPORTING CULINARY TECHNIQUE ONLY`: food, pastry, preserve or general culinary source that may support preparation of an input but cannot authorise a finished drink or drink component by itself.
- `NOT RELEVANT TO BEVERAGE DEVELOPMENT`: source does not materially support the intended drink.

From 2026-09-20, every newly selected active drink or drink-component lineage must include a `DIRECT BEVERAGE FORMULATION`. A source classified as `SUPPORTING CULINARY TECHNIQUE ONLY` may inform an input or process, but it must be paired with a professionally published or commercially active beverage application before an active café batch is opened. Match hot/cold service, milk/acidity context, dosing method and ordinary café equipment wherever the evidence allows; disclose every unresolved mismatch rather than treating generic culinary professionalism as beverage validation.

### Evidence type

- `SOURCE-STATED FACT`
- `CALCULATED VALUE`
- `EXPERIMENTAL MEASUREMENT`
- `HYPOTHESIS`
- `EDITORIAL INTERPRETATION`

### Missing values

Use `UNKNOWN` when information should exist but is unavailable. Use `NOT MEASURED` when an experimental measurement was not taken. Use `NOT APPLICABLE` only when the field genuinely does not apply. Never use a blank to imply zero.

### Professional-recipe geography

- `professional_base_region`: `ASIA`, `EUROPE`, `NORTH AMERICA`, `LATIN AMERICA AND CARIBBEAN`, `AFRICA`, `OCEANIA`, `GLOBAL / NOT REGION-SPECIFIC`, or `UNKNOWN`.
- `professional_base_country`: country of the responsible professional, venue, operator or manufacturer when directly supported; otherwise `UNKNOWN`.
- Classify the publisher/operator, not the hosting domain, delivery market, page language, ingredient origin or presumed cultural inspiration.
- Before a professional recipe is selected for a product, search relevant Asian and European professional/commercial sources. Record an unresolved regional gap rather than manufacturing a formula or relaxing completeness/provenance controls.
- Geographic breadth is a research-control field. It does not override professional authority, exactness, reproducibility, application relevance or the source/adaptation boundary.

### Import source/provenance status

- `UNREVIEWED`
- `PARTIALLY DOCUMENTED`
- `DOCUMENTED`
- `CONFLICTING`
- `UNKNOWN`

### Import ingestion status

- `RECEIVED`
- `IN VALIDATION`
- `PARTIALLY INGESTED`
- `INGESTED`
- `BLOCKED`
- `REJECTED`

Every substantive imported item must have a disposition of `ACCEPTED`, `REJECTED`, or `PENDING` before its package can be marked `INGESTED`.

## Units and dates

- Dates: ISO 8601 (`YYYY-MM-DD`); add local time and time zone when time matters.
- Mass: grams (`g`).
- Volume: millilitres (`ml`).
- Temperature: degrees Celsius (`°C`).
- Time: minutes unless otherwise labelled.
- Yield: record measured mass and/or volume, never a nominal container size.
- pH and Brix: identify instrument, calibration, temperature, and whether the result is measured or source-stated.
- Use `apparent Brix` for fruit/pumpkin purées and `apparent refractometer reading` for opaque nut/seed/dairy emulsions unless the method validates a stronger interpretation. Brix is a dissolved-solids/process measurement, not a direct proof of sugar, sweetness, water activity, safety or shelf life.
- Product targets remain `NOT YET SET` until the closest commercial control and a source-traced house batch are measured and the batch passes flavour, texture and service function. See `BRIX_BENCHMARK_PROTOCOL.md`.
- Currency: state ISO currency code and price date.
