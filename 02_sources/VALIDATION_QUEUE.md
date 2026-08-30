# Source-Validation Queue

Status: **PRIORITY FINDINGS INGESTED; OPEN TARGETS REMAIN**  
Basis: `IMP-2026-001` at stable checkpoint `55fcfd1`  
Scope: source retrieval and direct comparison only; no broad recipe hunt

## Findings ingested 2026-08-30

| Recipe | Threshold A | Threshold B | Threshold C | Canonical result |
|---|---|---|---|---|
| PR-0002 Employees Only Strawberry | PASS | PASS | FAIL | Promoted as exact; preserve “between purée and syrup” |
| PR-0004/PR-0005 Diageo current web version | PASS | PASS | FAIL | Promoted as version-specific exact records |
| Diageo PDF alternate version | PASS as separate version | PASS | FAIL | Conflict retained; exact alternate quantities not supplied locally |
| PR-0007 Spago Salted Lychee | PASS | PASS | FAIL | Promoted as exact secondary professional reference |
| PR-0001 VinePair Yuzu | PASS WITH CAVEAT | PASS | FAIL / UNKNOWN | Corrected to Jack Schramm; internal yuzu/lemon contradiction retained |
| PR-0009 Pacific Cocktail Haven Pandan | CONDITIONAL | PASS | FAIL / UNKNOWN | Remains non-exact until linked simple-syrup definition is captured |
| PR-0012 Experimental Cocktail Club Mango | FAIL | PASS | FAIL / UNKNOWN | Benchmark supported; per-litre scaling must not be inferred |

All shelf-life statements remain source-stated operational guidance only.

## Validation thresholds

These thresholds are independent. Passing one does not imply passing another.

### A — Exact sourced recipe

Required before provenance can become `EXACT SOURCED RECIPE`:

- a traceable source page/document;
- the source directly presents or attributes the formulation;
- creator and professional affiliation recorded exactly as stated, or `UNKNOWN` if the source does not state them;
- formulation name, every ingredient, exact quantity, and original unit transcribed without normalisation;
- complete method, including times and temperatures where stated;
- yield, storage, shelf-life wording, and application captured exactly when present, otherwise `UNKNOWN`;
- quotations distinguished from transcription and paraphrase;
- repository conversions and calculations kept outside the source formulation; and
- no unresolved missing detail that prevents faithful reproduction.

### B — Professional development benchmark

Required before laboratory use as a professional benchmark:

- credible professional attribution and application context;
- enough original quantities and method to reproduce the preparation without guessing;
- all operationally material unknowns identified;
- any conversion or scaling documented separately; and
- alcohol and other category constraints disclosed.

A benchmark may pass B without passing A only if the record is not represented as an exact transcription and the remaining uncertainty does not require invented formulation details.

### C — Food-safety or shelf-life recommendation

Requires separate food-science validation. Confirming that a bartender, venue, brand, or publication states “keeps for one month” establishes only that the source made the claim. It does not establish microbiological safety, generalisable shelf life, or suitability for publication as advice.

No source in this queue currently passes C.

## Priority 1 — PR-0002 Employees Only Wild Strawberry Cordial

- **Source record:** `SRC-2026-003`
- **Page to retrieve:** https://www.epicurious.com/recipes/food/views/wild-strawberry-cordial-390786
- **Source represented as:** Secondary publication of a professionally attributed recipe
- **Book/source lead to cross-check if available:** *Speakeasy* by Jason Kosmas and Dushan Zaric; exact edition/page `UNKNOWN`

Establish from the page/document:

- page title, author/byline, publication/update date, and URL;
- exact attribution to Jason Kosmas, Dushan Zaric, Employees Only, and/or *Speakeasy*;
- source’s exact name for the preparation;
- original ingredients and units: strawberries, sugar, water, lemon zest, and vanilla bean;
- exact method and stated cooking time;
- yield, refrigeration instruction, and exact seven-day wording, or `UNKNOWN`;
- whether the source describes the result as cordial, syrup, purée, or another category;
- original drink/application context, if any; and
- whether “ripe,” “wild,” split/scraped vanilla, and other descriptors are source wording.

Keep outside the source transcription:

- approximately 1.81 kg, 200 g, and 240 ml conversions;
- the calculated quarter batch; and
- “Strawberry–Vanilla” as the repository candidate name.

Validation result: A PASS; B PASS; C FAIL. Promoted as `EXACT SOURCED RECIPE`. Seasonal strawberry availability remains an operational constraint, not a provenance issue.

## Priority 2 — PR-0004 / PR-0005 Diageo Base and Peach Cordials

- **Primary source record:** `SRC-2026-007`
- **Main page:** https://www.diageobaracademy.com/en-zz/home/bartender-skills-and-techniques/how-to-make-syrups-and-cordials-for-your-cocktails
- **Alternate regional page retained:** https://www.diageobaracademy.com/en-us/home/customer-service/how-to-make-syrups-and-cordials-for-your-cocktails
- **Supporting source record:** `SRC-2026-008`
- **PDF to retrieve:** https://assets.ctfassets.net/6zncp07wiqyq/4d8J1CDS8DpGK7VW2d6sp/e55c531a47699325aa152d662a5346e5/how-to-make-cordials-for-cocktails-on-tap.pdf

Establish from the page and PDF:

- exact document/page titles, author or institutional attribution, publication date, and version/region;
- whether the two HTML URLs are substantively identical versions of one source;
- exact Base Cordial name, ingredients, quantities, units, and method;
- exact Peach Cordial name, ingredients, quantities, units, and method;
- whether “Maldon” is source-stated and whether salt quantity/unit is correct;
- tea type, thyme wording, peach preparation, cinnamon form, vacuum requirements, temperature, and duration;
- relationship between base-cordial quantity and finished peach formulation;
- stated yield for each component or `UNKNOWN`;
- storage instructions and exact one-month wording, with its scope;
- original drink or whisky-highball application; and
- differences or conflicts between HTML versions and PDF.

Keep outside the source transcription:

- editorial descriptions of malic and tartaric acid flavour roles;
- the proposed cinnamon reduction; and
- any inference that one-month storage is scientifically safe.

Validation result: A PASS for each source version separately; B PASS; C FAIL. `PR-0004` and `PR-0005` represent the current web version. The PDF differs, especially in salt ratio, and must receive separate versioned transcriptions when its exact quantities are supplied. Do not harmonise.

## Priority 3 — PR-0007 Spago Salted Lychee Cordial

- **Source record:** `SRC-2026-010`
- **Page to retrieve:** https://www.liquor.com/lychee-rose-cocktail-recipe-8551798
- **Source represented as:** Secondary professional beverage publication

Establish from the page:

- exact title, author/byline, publication/update date, and URL;
- exact attribution to Adam Fournier and Spago Beverly Hills;
- exact preparation name;
- original quantities/units for lychee purée, Giffard product, salt, and citric acid;
- whether Perfect Purée is required, recommended, or merely mentioned;
- exact blending method and duration;
- yield, bottling, refrigeration, and exact three-week wording, or `UNKNOWN`;
- exact cordial dose and associated Lychee Rosé Martini formulation/context;
- Giffard product spelling and alcohol status; and
- any source warnings or limitations.

Keep outside the source transcription:

- the approximately 22 ml conversion from 3/4 oz;
- any metric conversions of cups, tablespoons, or teaspoons; and
- the proposed future non-alcoholic version.

Validation result: A PASS; B PASS; C FAIL. Promoted as an exact alcoholic professional benchmark from a secondary professional publication.

## Priority 4 — Yuzu leads

### PR-0001 / SRC-2026-001

- **Page to retrieve:** https://vinepair.com/articles/techniques-vaccum-distillation-miles-macquarrie-kimball-house/
- **Source represented as:** Secondary source

Validated findings:

- correct attribution is Jack Schramm / VinePair's Coconut Yuzu Martini; the earlier Miles Macquarrie / Kimball House attribution is rejected;
- whether the page directly gives a cordial recipe;
- exact formulation name, quantities, original units, peel type, and method;
- where and when citric acid is added;
- whether yield “about 1 L” is source-stated;
- original drink, exact dose, and application context; and
- whether the URL’s apparent “vaccum” spelling is the live canonical URL.

Explicitly exclude the calculated half batch and “lemon peel—or yuzu peel” substitution from source transcription.

Validation result: A PASS WITH CAVEAT; B PASS; C FAIL / UNKNOWN. The source's internal yuzu/lemon wording contradiction must remain explicit.

### SRC-2026-002 — pairing precedent only

- **Page to retrieve:** https://nioteas.com/blogs/japanese-teas/yuzu-matcha
- Establish the exact Yuzu Matcha/Yuzu Matcha Soda recipe, professional/commercial context, and whether it supports pairing precedent only rather than `PR-0001`.

## Priority 5 — Mango lead

### PR-0012 / SRC-2026-016

- **Page to retrieve:** https://www.starchefs.com/recipes/mezcal-y-soda
- **Source represented as:** Secondary professional trade publication

Establish:

- exact title, author/editor, date, and attribution to Nathalie Durrieu / Experimental Cocktail Club;
- exact Mango Cordial name and complete formulation;
- frozen mango specification;
- enzyme identity, amount, and procedure;
- fining-agent identities, amounts, order, temperatures, and times;
- filtration/clarification method;
- clarified yield from 6 kg mango;
- exact per-litre additions of sugar, tartaric acid, citric acid, salt, and glycerin;
- final yield, storage, and shelf-life wording, or `UNKNOWN`;
- exact Mezcal y Soda formulation and cordial dose; and
- whether glycerin’s purpose is stated or merely inferred.

Keep the purée comparison, “rebuilds texture,” and Mango Matcha suitability outside the source transcription as experimental design or hypothesis.

Validation result: A FAIL due unresolved “remaining ingredients for every 1 liter” scaling ambiguity; B PASS; C FAIL / UNKNOWN. Preserve nominal 6 L yield and the source-supported clarification method. Do not infer a per-litre formulation.

## Priority 6 — Pandan leads

### PR-0009 / SRC-2026-013

- **Page:** https://www.liquor.com/leeward-negroni-cocktail-recipe-5076006
- Establish exact attribution, leaf quantity/specification, Everclear proof and quantity, infusion conditions, simple-syrup ratio and quantity, yield, storage, and Leeward Negroni context.
- Validation result: A CONDITIONAL on explicitly capturing the linked simple-syrup definition; B PASS; C FAIL / UNKNOWN. Alcoholic formulation.

### PR-0010 / SRC-2026-014

- **Page:** https://www.starchefs.com/recipes/pennies-del-cielo
- Establish creator, venue, complete ingredient quantities, method, yield, storage, and drink context for Elote-Pandan Cordial.
- Current blocker: several quantities and the entire method are absent.

### PR-0011 / SRC-2026-015

- **Page:** https://www.diageobaracademy.com/en-zz/home/explore-all-recipes/temasek-tides
- Establish creator/venue, complete kaffir-lime–pandan formulation, method, yield, storage, naming, and Temasek Tides/Singaporean Gimlet context.
- Current blocker: reference only; no formulation was imported.

## Priority 7 — Remaining formulation and pairing leads

1. `PR-0003` / `SRC-2026-004` — https://www.liquor.com/recipes/aquarelle/  
   Retrieve exact strawberry/sugar quantities, method, yield, storage, attribution, Attaboy/The Eddy relationship, and exact waste/prep rationale.

2. `PR-0006` / `SRC-2026-009` — https://www.starchefs.com/recipes/homestead-americano  
   Retrieve creator, full strawberry-peach formulation, Brix procedure, acid quantities, method, yield, storage, and application.

3. `PR-0008` / `SRC-2026-011` — https://www.usbg.org/news/2025-usbg-presents-world-class-sponsored-diageo-2025-challenge-winners  
   Establish Dalton’s full identity and whether the page supplies an actual acidified lychee cordial formulation or only mentions it.

4. `SRC-2026-005` — https://tenzotea.co/blogs/matcha-handbook/strawberry-matcha-latte-barista-recipe  
   Validate professional strawberry-matcha pairing precedent; not a cordial recipe unless the source directly supplies one.

5. `SRC-2026-006` — Pluck Tea, URL `UNKNOWN`  
   Retrieve title and URL before any claim can be validated. Quarantine the reported 20 ml + 20 ml formulation until then.

6. `SRC-2026-012` — https://izumimatcha.com/drinks-recipes/  
   Validate Lychee Matcha Tea pairing precedent; not a cordial recipe unless directly stated.

7. `SRC-2026-017` — https://www.eckes-likoere.de/drinks/peach-matcha/  
   Validate peach-matcha pairing precedent and distinguish commercial recipe evidence from independent professional evidence.

## Retrieval order

Retrieve these first, in order:

1. Epicurious Wild Strawberry Cordial page (`SRC-2026-003`)
2. Diageo main cordial article plus alternate regional version (`SRC-2026-007`)
3. Diageo cordials-on-tap PDF (`SRC-2026-008`)
4. Liquor.com Lychee Rosé page (`SRC-2026-010`)
5. VinePair Kimball House page (`SRC-2026-001`)
6. StarChefs Mezcal y Soda page (`SRC-2026-016`)
7. Liquor.com Leeward Negroni page (`SRC-2026-013`)

The validation return package for each source should include the preserved page/PDF, retrieval date, complete bibliographic metadata, exact transcription with page/section location, a field-by-field comparison against the quarantined PR record, conflicts, and an A/B/C threshold decision.
