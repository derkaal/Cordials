# Professional Recipe Geographic Coverage Audit

Date: 2026-09-05

## Decision

The professional-recipe programme must actively search both Asian and European operators, not default to US sources. Geography is an evidence field and a search-control mechanism, not a claim that one region is intrinsically better or that a recipe is culturally representative.

Only recipes published by identifiable working professionals, active cafés/operators, commercial manufacturers or commercial training organisations may enter the professional recipe database. A flavour association, page language, domain suffix or delivery market does not establish geographic provenance.

## Classification rule

- `professional_base_region` and `professional_base_country` describe the professional, venue or commercial organisation responsible for the published formulation.
- Recipe tradition or cultural inspiration is separate and must not be inferred from the ingredient name.
- `GLOBAL / NOT REGION-SPECIFIC` is used for a global professional platform when the recipe itself cannot be tied to one regional operator.
- `UNKNOWN` remains mandatory where the professional base has not been validated.
- Geography never repairs missing quantities, an incomplete method, weak provenance or an unsuitable application.
- Before selecting a product formulation, search both Asian and European professional/commercial sources where relevant. If one side yields no qualifying result, record the gap; do not invent or reverse-engineer a recipe to fill it.

The canonical mapping is `03_professional_recipes/geographic_coverage.csv`.

## Current executable coverage

`EXACT SOURCED RECIPE` records now include both regions:

- **Europe:** Ireland, United Kingdom, France and Germany are represented by active brands, manufacturers or commercial operators. Examples include Jameson (`PR-0015`), Clearspring (`PR-0017`), Les Vergers Boiron (`PR-0018`–`PR-0020`, `PR-0027`), 1883 Maison Routin (`PR-0023`, `PR-0024`) and Health Bar (`PR-0026`).
- **Asia:** Japan is represented by Japanese Taste (`PR-0029`), Yunomi.life (`PR-0030`, `PR-0032`) and Kuki Sangyo (`PR-0031`).

The new Asian records preserve their published quantities and shortcomings. They are research references, not automatically authorised café batches.

## Priority-product coverage and gaps

| Product | European professional/commercial evidence | Asian professional/commercial evidence | Current conclusion |
|---|---|---|---|
| PB-001 Pumpkin | Jameson `PR-0015`; Les Vergers Boiron `PR-0027` | Yunomi Matcha Pumpkin Spice Latte `PR-0032` | Both regions covered. PR-0032 validates a real-pumpkin/matcha combination but is hot and integrated; it does not validate cold glass cling or the two-component PB-001 service system. |
| PB-004 Pistachio | 1883 Maison Routin `PR-0023` | No qualifying product-specific formula validated yet | European application covered; Asian search gap remains. Do not delay relevant source work solely to create a geographic quota. |
| PB-005 Roasted Hazelnut | 1883 Maison Routin `PR-0024` | No qualifying product-specific formula validated yet | European cocktail application covered; Asian paste/syrup search gap remains. |
| PB-006 Black Sesame | Health Bar `PR-0026` | Japanese Taste `PR-0029`; Yunomi `PR-0030`; Kuki `PR-0031` | Strong two-region coverage. The Asian sources add paste, powder and manufacturer-premix comparisons; none silently authorises a house paste formula. |
| PB-002 Lychee | Les Vergers Boiron `PR-0019` | No qualifying Asia-based operator formula validated yet | European purée preparation covered; Asian cordial/purée search gap remains. |
| PB-003 Mango | Clearspring `PR-0017`; Les Vergers Boiron `PR-0018`, `PR-0020` | No qualifying Asia-based operator formula validated yet | European matcha and purée applications covered; Asian cordial/purée search gap remains. |

## Source-specific controls

- `PR-0029` uses a named sweetened matcha powder at the source's 15 g dose and places sesame at the bottom of the glass. It is not silently converted to pure matcha or wall application.
- `PR-0030` uses sesame powder with source ranges and alternatives. It is not a sesame-paste formula.
- `PR-0031` uses a proprietary black-sesame/soy/salt powder. It is a commercial operational benchmark, not a substitute for 100% sesame paste.
- `PR-0032` is the strongest direct Asia-based real-pumpkin/matcha application found in this pass. Its cup/spoon measures, hot format and source looseness remain intact.

## Next research action

For the current high-priority programme, continue targeted Asian operator searches for pistachio and roasted-hazelnut preparations only when the formula is directly relevant and complete enough to reproduce. Secondary lychee and mango searches remain recorded but do not displace PB-001/PB-004/PB-005/PB-006 work.
