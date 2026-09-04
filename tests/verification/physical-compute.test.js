import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { canonicalizeToBytes } from '../../src/verification/canonical.js';
import { digestSha256 } from '../../src/verification/hash.js';
import { PHYSICAL_COMPUTE_MANIFEST_SPEC, verifyPhysicalComputeManifest } from '../../src/verification/physical-compute.js';

const interval = { start: '2026-09-01T00:00:00.000Z', end: '2026-09-01T01:00:00.000Z' };
function item(id, content) { return { id, content }; }
function fixture() {
  const evidence = [
    item('energy-1', { kind: 'energy', interval, meter_id: 'synthetic-grid-meter', quantity_kwh: 10, unit: 'kWh', provenance: { synthetic: true } }),
    item('compute-1', { kind: 'compute', interval, workload_id: 'synthetic-job', resource_id: 'synthetic-gpu', quantity: null, provenance: { synthetic: true } }),
    item('thermal-1', { kind: 'thermal', interval, loop_id: 'synthetic-loop', flow_measurement: 1, supply_temperature_c: 40, return_temperature_c: 30, provenance: { synthetic: true } }),
    item('fluid-1', { kind: 'external_reference', fluid: 'synthetic-water', specific_heat_kj_per_kg_k: 4.18, provenance: { synthetic: true } }),
    item('recovery-1', { kind: 'recovery', interval, exchanger_id: 'synthetic-hx', receiving_loop_id: 'synthetic-receiver', calculation: { method: 'liquid_heat_transfer/v1', inputs: { flow_kg_per_s: 1, specific_heat_kj_per_kg_k: 4.18, supply_temperature_c: 40, return_temperature_c: 30 }, fluid_property_evidence_id: 'fluid-1', decimal_places: 2, declared_kw: 41.8 }, provenance: { synthetic: true } }),
    item('delivery-1', { kind: 'delivery', interval, receiving_system: 'synthetic-load', quantity_kwh: 5, unit: 'kWh', boundary_id: 'synthetic-boundary', provenance: { synthetic: true } }),
  ];
  return { evidence, manifest: { spec: PHYSICAL_COMPUTE_MANIFEST_SPEC, boundary: { id: 'synthetic-boundary' }, interval, commitments: { evidence: evidence.map((entry) => ({ id: entry.id, alg: 'sha256', hex: digestSha256(canonicalizeToBytes(entry.content)).hex })) } } };
}
function verdict(result) { return result.verdict; }

describe('physical-compute evidence boundary', () => {
  it('reproduces complete synthetic evidence as VALID', () => assert.equal(verdict(verifyPhysicalComputeManifest(fixture())), 'VALID'));
  it('returns INCOMPLETE for missing required evidence', () => {
    const f = fixture(); f.evidence = f.evidence.filter((entry) => entry.content.kind !== 'delivery');
    assert.equal(verdict(verifyPhysicalComputeManifest(f)), 'INCOMPLETE');
  });
  it('returns INVALID for evidence altered after commitment', () => {
    const f = fixture(); f.evidence[0].content.quantity_kwh = 11;
    assert.equal(verdict(verifyPhysicalComputeManifest(f)), 'INVALID');
  });
  it('returns INVALID for a non-reproducible calculation', () => {
    const f = fixture(); f.evidence.find((entry) => entry.id === 'recovery-1').content.calculation.declared_kw = 1;
    f.manifest.commitments.evidence.find((entry) => entry.id === 'recovery-1').hex = digestSha256(canonicalizeToBytes(f.evidence.find((entry) => entry.id === 'recovery-1').content)).hex;
    assert.equal(verdict(verifyPhysicalComputeManifest(f)), 'INVALID');
  });
  it('returns INCOMPLETE when energy and compute cannot correlate', () => {
    const f = fixture(); f.evidence[1].content.interval = { start: '2026-09-01T02:00:00.000Z', end: '2026-09-01T03:00:00.000Z' };
    f.manifest.commitments.evidence[1].hex = digestSha256(canonicalizeToBytes(f.evidence[1].content)).hex;
    assert.equal(verdict(verifyPhysicalComputeManifest(f)), 'INCOMPLETE');
  });
  it('returns INVALID for incompatible energy units', () => {
    const f = fixture(); f.evidence[0].content.unit = 'kg';
    f.manifest.commitments.evidence[0].hex = digestSha256(canonicalizeToBytes(f.evidence[0].content)).hex;
    assert.equal(verdict(verifyPhysicalComputeManifest(f)), 'INVALID');
  });
  it('returns INVALID for replayed evidence identifiers', () => {
    const f = fixture(); f.evidence.push({ ...f.evidence[0] });
    assert.equal(verdict(verifyPhysicalComputeManifest(f)), 'INVALID');
  });
  it('keeps a valid hash over an intentionally false synthetic observation distinct from physical truth', () => {
    const f = fixture(); f.evidence[0].content.provenance = { synthetic: true, intentionally_false: true };
    f.manifest.commitments.evidence[0].hex = digestSha256(canonicalizeToBytes(f.evidence[0].content)).hex;
    const result = verifyPhysicalComputeManifest(f);
    assert.equal(result.verdict, 'VALID');
    assert.match(result.limitations[0], /does not establish/);
  });
  it('returns CONFLICT for incompatible supplied assertions', () => {
    const f = fixture(); f.evidence[0].content.assertion = { key: 'meter-reading', value: 10 };
    f.evidence[1].content.assertion = { key: 'meter-reading', value: 11 };
    for (const entry of f.evidence.slice(0, 2)) f.manifest.commitments.evidence.find((c) => c.id === entry.id).hex = digestSha256(canonicalizeToBytes(entry.content)).hex;
    assert.equal(verdict(verifyPhysicalComputeManifest(f)), 'CONFLICT');
  });
});
