# PB-001 Glass-Cling Test Protocol — Version 0.2

## Purpose and status

Compare candidate preparations on the actual functional requirement: remaining as a visible decoration on the inside wall of a cold glass before and during a standardised build.

- **Status:** READY FOR COMPARATIVE BENCHMARK PILOT
- **Evidence class:** ORIGINAL EXPERIMENTAL METHOD
- **Applies to:** PB-001
- **Trial ID pattern:** `GC-YYYYMMDD-PB001-NN`
- **Acceptance limits:** TBD after controls and commercial benchmark are tested

This is a project comparison method, not a validated rheological standard. It adapts the useful controls in the USDA Bostwick approach—fixed temperature, fixed time, distance travelled, remixed samples, repeats, and agreement checks—but does not claim equivalence to a horizontal Bostwick measurement (`SRC-2026-022`).

## Equipment

- one straight-sided clear service glass, nominal 300–400 ml; record manufacturer, model, internal height, and internal diameter;
- refrigerator capable of 4 ± 1 °C;
- calibrated scale readable to 0.1 g or better;
- probe or infrared thermometer with method recorded;
- 5 or 10 ml syringe with blunt tip for the controlled deposit;
- intended squeeze bottle and nozzle for the service subtest;
- metric ruler fixed beside the glass;
- phone/camera on a fixed support;
- stopwatch;
- 90 ± 5 g of the actual service ice;
- 150.0 ± 1.0 g water at 4 ± 1 °C for the build challenge;
- neutral detergent, water, and lint-free drying material.

## Samples and controls

Test at minimum:

1. one selected commercial beverage-sauce control;
2. the unmodified chosen pumpkin purée/input;
3. each candidate preparation.

For the first pilot these are fixed as FONTE Gourmet Pumpkin Spice Sauce (`SRC-2026-029` to `SRC-2026-031`), unmodified KoRo Kürbispüree (`SRC-2026-026`/`027`), and the café-practical Boiron-derived `B-20260905-PUMPPURE-V02-01`. The separate Vitamix pumpkin-spice syrup is excluded because its function is pourable sweetness, not cling. See `GC-20260830-PB001-01.md`.

Optional thin negative control: maple syrup or 1:1 sugar syrup, identified exactly. Controls are comparators, not automatic pass/fail standards.

For every sample record batch/lot, age, storage condition, temperature, pH and apparent Brix if readable, and any remixing or shear applied before the test. Follow `00_project_control/BRIX_BENCHMARK_PROTOCOL.md`; Brix is a parallel consistency measurement, not a cling score.

## Glass and sample conditioning

1. Wash the glass with the same neutral detergent, rinse thoroughly, and dry the inside completely.
2. Chill the clean glass inverted for at least 30 minutes at 4 ± 1 °C so the inside remains dry. Record actual wall temperature immediately before dosing.
3. Equilibrate the sample to 4 ± 1 °C for at least 30 minutes.
4. Gently remix the sample with 10 uniform spoon strokes, avoiding air incorporation, then rest for 2 minutes. If the preparation has a required service shake, use and record that procedure instead.
5. Mark a test window on the outside of the glass: its top is 30 mm below the rim and its centreline is vertical. Fix the ruler in the photograph plane.

If the real service uses a wet or frosted inside wall, run that condition as a separately labelled series; never mix dry-wall and wet-wall results.

## Phase A — static wall retention

1. Tare the syringe and load the sample.
2. With the glass held at approximately 45°, apply a 3.0 ± 0.1 g vertical bead 60 mm long, starting at the top of the marked window. Avoid touching the glass with the tip.
3. Bring the glass upright within 3 seconds; this is `t = 0`.
4. Photograph at 0, 30, 60, 120, and 300 seconds from the fixed position.
5. At each time record:
   - leading-edge descent from its `t = 0` position, in mm;
   - visible bead length and maximum width, in mm;
   - whether any material reaches the bottom (`YES/NO` and time);
   - free-liquid weeping or a clear halo (`NONE`, or maximum mm);
   - pattern legibility on a 0–5 anchored scale, where 0 = no recognisable original mark and 5 = essentially unchanged; this score is editorial/sensory, not an instrument measurement.

## Phase B — standard build challenge

Start immediately after the 300-second Phase A photograph.

1. Place 90 ± 5 g service ice centrally with tongs over 10 seconds, avoiding deliberate contact with the decorated zone. Record any unavoidable scrape.
2. Pour 150.0 ± 1.0 g water at 4 ± 1 °C into the centre of the glass over 10 ± 1 seconds without directing the stream at the decoration.
3. Photograph immediately after the pour and at 60 and 300 seconds.
4. Record leading-edge descent, bottom pooling, visible area/pattern legibility, colour bleed, detachment, and any ice damage.

This water build isolates mechanical and dilution effects. It does not replace the later exact iced-matcha application test.

## Phase C — squeeze-bottle service repeatability

1. Fill the intended clean bottle to a recorded mass and fill level; record bottle, nozzle diameter, and sample temperature.
2. Without watching the scale display during dosing, make five attempts to reproduce the 3.0 g × 60 mm bead on separate conditioned glasses or clean test positions.
3. Weigh each dose and record mean, range, standard deviation if calculated, tailing, air gaps, clogging, splatter, and hand force on a simple `LOW/MEDIUM/HIGH` operator scale.

Bottle performance is a separate decision variable from static cling. A sample can cling well and still fail service.

## Replication and validity

- Run three complete Phase A/B replicates per sample in randomised order where practical.
- Repeat a run if dose is outside tolerance, glass or sample temperature is outside tolerance, the deposit is physically scraped before the build challenge, or camera/ruler position changes.
- Report every valid replicate and any invalidated run with reason; do not retain only the best-looking result.
- If the 300-second descent range among valid replicates exceeds 5 mm, run at least two additional replicates and investigate temperature, shear history, dose shape, and surface condition.

## Result table

| Trial ID | Sample/batch | Glass °C | Sample °C | Apparent Brix / boundary | Dose g | Descent 30 s mm | Descent 300 s mm | Bottom reached/time | Build legibility 0–5 | Weeping mm | Bottle mean/range g | Valid? | Notes |
|---|---|---:|---:|---|---:|---:|---:|---|---:|---:|---|---|---|
| UNKNOWN | UNKNOWN | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED | NOT MEASURED | UNKNOWN | NOT MEASURED | NOT MEASURED | NOT MEASURED | UNKNOWN | UNKNOWN |

## Pilot decision rule

Do not set the PB-001 pass threshold or apparent-Brix target before the commercial sauce, pumpkin input, and at least one feasibility sample have been measured. For the first pilot, compare each house sample with the commercial control on each recorded metric using `BETTER THAN CONTROL`, `NO MATERIAL DIFFERENCE OBSERVED`, `WORSE THAN CONTROL`, or `INCOMPARABLE`; record Brix readings and their arithmetic differences separately and do not treat closeness as success by itself. Do not create a weighted composite score. After the pilot, define any numerical limit from the service need and observed discriminating range and record it as a dated protocol revision. A visually appealing still photograph alone is not a pass.
