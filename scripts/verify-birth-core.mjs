#!/usr/bin/env node
import {
  issueChallenge, verifyChallenge, createIdentity, buildManifest,
  BOUNDARIES, CHAIN_ID, PROTOCOL,
} from "../qpf-core/birth.mjs";

const secret = "test-secret";
const ch = await issueChallenge(secret);
if (ch.state !== "AUTH_REQUIRED") throw new Error("challenge state");
if (!(await verifyChallenge(secret, ch))) throw new Error("mac");
if (await verifyChallenge("wrong", ch)) throw new Error("bad mac accepted");

const { identity } = await createIdentity();
if (!identity.identity_id.startsWith("qpfdc0:")) throw new Error("id");
const man = await buildManifest({
  authorization_commitment: "abc",
  identity,
  protocol_commit: "test",
});
if (!man.birth_id.startsWith("qpfb0:")) throw new Error("birth_id");
if (man.attestation.chain_id !== CHAIN_ID) throw new Error("chain");
if (man.boundaries.economic_authority !== false) throw new Error("econ");
if (man.protocol !== PROTOCOL) throw new Error("protocol");
if (BOUNDARIES.autonomous_execution !== false) throw new Error("auto");
console.log("ESTABLISHED qpf-core birth", man.birth_id);
