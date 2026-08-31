# Data Dictionary

## Required controlled values

### Provenance classification

- `EXACT SOURCED RECIPE`
- `ADAPTATION OF SOURCED RECIPE`
- `ORIGINAL EXPERIMENTAL FORMULATION`

Current formulation-authoring rule from 2026-08-31: active recipe, batch, and application formulations are limited to `EXACT SOURCED RECIPE` and `ADAPTATION OF SOURCED RECIPE` unless the user explicitly authorises an original formulation in writing. `ORIGINAL EXPERIMENTAL FORMULATION` remains available only to classify historical/imported material. `ORIGINAL EXPERIMENTAL METHOD` may be used for test protocols because a measurement method is not a recipe formulation.

### Evidence type

- `SOURCE-STATED FACT`
- `CALCULATED VALUE`
- `EXPERIMENTAL MEASUREMENT`
- `HYPOTHESIS`
- `EDITORIAL INTERPRETATION`

### Missing values

Use `UNKNOWN` when information should exist but is unavailable. Use `NOT MEASURED` when an experimental measurement was not taken. Use `NOT APPLICABLE` only when the field genuinely does not apply. Never use a blank to imply zero.

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
- Currency: state ISO currency code and price date.
