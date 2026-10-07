# Physical-Compute State Boundary v1

**Status:** local deterministic specification and test fixture model. It has no live infrastructure integration.

## Boundary and representations

A manifest represents one bounded observation interval in this order:

`GRID INPUT → COMPUTE → THERMAL OUTPUT → HEAT RECOVERY → USEFUL DELIVERY → EVIDENCE → VERIFICATION`

`qpf.physical-compute-manifest/v1` carries a boundary identifier, ISO-8601 interval, evidence commitments, and supplied evidence objects. Each object has an identifier, a category, observation fields, and provenance. Required categories are `energy`, `compute`, `thermal`, `recovery`, and `delivery`; external references may provide fluid or emissions-factor material.

- Energy records identify the meter, system boundary, interval, quantity/unit, source, and provenance.
- Compute records identify workload, execution interval, resource/device telemetry, software identity, and evidence. A defensible compute quantity is optional and is `null` when unavailable.
- Thermal records identify loop, flow, supply/return temperatures, interval, fluid metadata, and provenance.
- Recovery records identify exchanger, input/output measurements, receiving loop, evidence, and versioned calculation.
- Delivery records identify receiving system, interval, quantity, unit, meter/evidence, and delivery boundary.

Observation answers what a system reported. Provenance identifies its origin. Integrity checks supplied bytes. Calculation derives a deterministic result. Verification evaluates rules. Claims remain limited to what those results support; these concepts are not a single `verified` field.

## Canonical evidence and calculations

Evidence content is JCS/RFC 8785 canonicalized by the existing `canonicalizeToBytes` implementation and committed using existing SHA-256. A commitment is `{id, alg:"sha256", hex}` over the canonical evidence content. The verifier reproduces every supplied commitment.

`liquid_heat_transfer/v1` derives kW as:

`flow_kg_per_s × specific_heat_kj_per_kg_k × (supply_temperature_c − return_temperature_c)`

Inputs must be finite, flow non-negative, specific heat positive, supply not below return, and include a `fluid_property_evidence_id`. The method never assumes a fluid property. Results round to the declared integer `decimal_places` (0–12) using half-away-from-zero rounding. Missing calculation inputs are **INCOMPLETE**; malformed units/values and a non-reproducing declared value are **INVALID**. A calculation version, evidence dependencies, and units are part of the recovery evidence.

Energy and delivery quantities declare `Wh`, `kWh`, or `MWh`; an undeclared unit is **INCOMPLETE** and any other unit is **INVALID**. Conversion, where requested by a future version, must first normalize these units to watt-hours and round only at the declared calculation boundary.

Carbon accounting is separate: it requires metered electricity, geography/boundary, interval, emissions-factor source/version, and provenance. Absent generation-mix or emissions-factor evidence is **INCOMPLETE**. This specification neither infers grid mix nor makes carbon, efficiency, or sustainability claims.

## Verdicts and transitions

**VALID** means required supplied evidence exists, commitments reproduce, declared calculations reproduce, and rules pass. **INVALID** means a malformed value, bad commitment, invalid calculation, or other rule violation. **INCOMPLETE** means necessary evidence, correlation, boundary material, or capability is absent. **CONFLICT** means relevant supplied assertions for the same key disagree without a defined resolution rule.

The auditable state sequence is `OBSERVED → INGESTED → CANONICALIZED → COMMITTED → CALCULATED → INDEPENDENTLY VERIFIED → PUBLISHED`. Each step requires the previous state reference, its stated inputs, and successful prerequisites. Failed or unavailable prerequisites do not advance state. Publication is a separate governance action, not an outcome of verification.

## Limits, adversarial handling, and fixtures

The verifier detects altered telemetry after commitment, duplicate/missing evidence through identifiers and required categories, malformed timestamps/units/calculations, interval correlation failure, and unresolved contradictory assertions. Provenance can be forged and timestamps or sensor values can be manipulated before commitment; a valid hash over false source data remains valid integrity evidence, not proof of physical truth. Receiving-loop gaps, fabricated grid evidence, and uncorrelated compute telemetry remain incomplete or conflicting as their rules require.

All test data is explicitly synthetic. No live utility, meter, GPU, heating system, grid API, transaction, mint, staking, liquidity, bridge, payment, or signing path is used or activated.
