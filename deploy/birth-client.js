/* Client #1 for qpf-birth. UI follows server state only. */
(function () {
  const STORE = "qpf.birth.v1";
  const viz = document.getElementById("viz");
  const milestone = document.getElementById("milestone");
  const err = document.getElementById("err");
  const retry = document.getElementById("retry");
  const meet = document.getElementById("meet");
  const proofBtn = document.getElementById("proof");
  const hello = document.getElementById("hello");
  const hellotxt = document.getElementById("hellotxt");
  const proofbox = document.getElementById("proofbox");

  const FRAMES = {
    IDLE: "◌",
    AUTH_REQUIRED: "◌\n  ◌",
    AUTHORIZED: "◌ ◌ ◌",
    CREATING: "  ◌ ◌ ◌\n◌ ◌ ◌ ◌ ◌\n  ◌ ◌ ◌",
    IDENTITY_CREATED: "    ◌\n  ◌ ◌ ◌\n◌ ◌ ◌ ◌ ◌\n  ◌ ◌ ◌\n    ◌",
    ATTESTING: "  ◌ ◌ ◌\n◌ ◌ ◌ ◌ ◌\n  ◌ ◌ ◌",
    MAINNET_PENDING: "◌ ◌ ◌ ◌ ◌",
    VERIFIED: "✓",
    READY: "✓",
    INTERACTING: "✓",
    MAINNET_FAILED: "◌",
    AUTH_FAILED: "◌",
    CREATION_FAILED: "◌",
    ATTESTATION_FAILED: "◌",
    VERIFICATION_FAILED: "◌",
  };

  const LABELS = {
    IDLE: "IDLE",
    AUTH_REQUIRED: "HUMAN AUTHORIZATION",
    AUTHORIZED: "HUMAN VERIFIED",
    CREATING: "Creating identity...",
    IDENTITY_CREATED: "YOUR AI EXISTS.",
    ATTESTING: "Preparing verification...",
    MAINNET_PENDING: "Verifying on the network…",
    VERIFIED: "✓ VERIFIED\n0G ARISTOTLE MAINNET\nChain 16661",
    READY: "✓ VERIFIED\n0G ARISTOTLE MAINNET\nChain 16661",
    INTERACTING: "MEET YOUR AI",
    MAINNET_FAILED: "VERIFICATION COULD NOT BE COMPLETED.\nYour AI identity was created,\nbut mainnet verification did not complete.",
    AUTH_FAILED: "Authorization did not complete.",
    CREATION_FAILED: "Creation did not complete.",
    ATTESTATION_FAILED: "Attestation did not complete.",
    VERIFICATION_FAILED: "Verification did not complete.",
  };

  function load() {
    try { return JSON.parse(localStorage.getItem(STORE) || "null"); } catch { return null; }
  }
  function save(rec) { localStorage.setItem(STORE, JSON.stringify(rec)); }

  function show(state, extra) {
    viz.textContent = FRAMES[state] || "◌";
    milestone.textContent = (LABELS[state] || state) + (extra ? "\n" + extra : "");
    err.hidden = true;
    retry.hidden = !(state === "MAINNET_FAILED" || state === "ATTESTATION_FAILED" || state === "VERIFICATION_FAILED");
    const exists = state === "IDENTITY_CREATED" || state === "MAINNET_FAILED" || state === "MAINNET_PENDING" || state === "VERIFIED" || state === "READY" || state === "INTERACTING";
    meet.hidden = !exists;
    proofBtn.hidden = !exists;
  }

  async function post(path, body) {
    const r = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body || {}),
    });
    const j = await r.json().catch(() => ({}));
    return { http: r.status, ...j };
  }

  function b64urlToBuf(s) {
    const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + pad);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out.buffer;
  }
  function bufToB64url(buf) {
    const b = new Uint8Array(buf);
    let bin = "";
    b.forEach((x) => { bin += String.fromCharCode(x); });
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  }

  async function authorizeAndCreate() {
    show("AUTH_REQUIRED");
    const ch = await post("/birth/authorize", {});
    if (!ch.challenge) {
      show("AUTH_FAILED");
      err.hidden = false;
      err.textContent = ch.error || "authorize failed";
      return;
    }
    let cred;
    try {
      cred = await navigator.credentials.create({
        publicKey: {
          challenge: b64urlToBuf(ch.challenge),
          rp: { name: "Quantum Pi Forge", id: location.hostname },
          user: {
            id: crypto.getRandomValues(new Uint8Array(16)),
            name: "human",
            displayName: "Human",
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -8 },
          ],
          timeout: 60000,
          attestation: "none",
          authenticatorSelection: { residentKey: "preferred", userVerification: "preferred" },
        },
      });
    } catch (e) {
      show("AUTH_FAILED");
      err.hidden = false;
      err.textContent = "Passkey authorization did not complete. " + (e.message || e);
      return;
    }
    show("AUTHORIZED");
    show("CREATING");
    const clientData = new TextDecoder().decode(cred.response.clientDataJSON);
    const created = await post("/birth/create", {
      challenge: ch.challenge,
      issued_at: ch.issued_at,
      mac: ch.mac,
      credential_id: bufToB64url(cred.rawId),
      client_data_json: clientData,
    });
    if (!created.record || created.state === "AUTH_FAILED" || created.state === "CREATION_FAILED") {
      show(created.state || "CREATION_FAILED");
      err.hidden = false;
      err.textContent = created.error || "create failed — HTTP success is not existence";
      return;
    }
    save(created.record);
    show("IDENTITY_CREATED");
    await attest();
  }

  async function attest() {
    const rec = load();
    if (!rec) return;
    show("ATTESTING");
    const out = await post("/birth/attest", { record: rec });
    if (out.record) save(out.record);
    show(out.state || rec.state);
    if (out.state === "MAINNET_PENDING" && out.record) {
      const proof = await post("/birth/proof", { record: out.record });
      if (proof.record) save(proof.record);
      show(proof.state || out.state, proof.tx_hash ? "tx " + proof.tx_hash : "");
    }
    if (out.message) {
      err.hidden = false;
      err.textContent = out.message;
    }
  }

  async function doMeet() {
    const rec = load();
    if (!rec) return;
    const s = await post("/ai/session", { record: rec });
    if (s.record) save(s.record);
    show(s.state || rec.state);
    hello.hidden = false;
    hellotxt.textContent = (s.session && s.session.text) || "";
    if (s.note) {
      err.hidden = false;
      err.textContent = s.note;
    }
  }

  async function doProof() {
    const rec = load();
    if (!rec) return;
    const p = await post("/birth/proof", { record: rec });
    if (p.record) save(p.record);
    show(p.state || rec.state, p.tx_hash ? "tx " + p.tx_hash : "no tx");
    proofbox.hidden = false;
    proofbox.textContent = JSON.stringify({
      birth_id: p.birth_id,
      state: p.state,
      identity_id: p.identity_id,
      tx_hash: p.tx_hash,
      fabricated_tx: p.fabricated_tx,
      onchain: p.onchain,
      offchain: p.offchain,
      boundaries: p.boundaries,
      mac_ok: p.mac_ok,
    }, null, 2);
  }

  document.getElementById("begin").onclick = authorizeAndCreate;
  retry.onclick = attest;
  meet.onclick = doMeet;
  proofBtn.onclick = doProof;

  // Share affordance: participant copies the birth link themselves.
  // No auto-posting, no prefilled message, no outbound contact by the system.
  // The human decides who to send it to.
  (function initShare() {
    const shareBtn = document.getElementById("share");
    const shareDone = document.getElementById("share-done");
    if (!shareBtn) return;
    const url = "https://quantumpiforge.com/birth.html";
    function reveal() {
      shareBtn.hidden = true;
      if (shareDone) shareDone.hidden = false;
    }
    async function copy() {
      try {
        await navigator.clipboard.writeText(url);
        reveal();
      } catch {
        // Clipboard API unavailable (permissions, insecure context):
        // fall back to selecting via prompt so the human still gets the link.
        try { window.prompt("Copy this link and send it to one curious person:", url); } catch {}
        reveal();
      }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      shareBtn.hidden = false;
      shareBtn.onclick = copy;
    } else {
      // No clipboard API: show the button anyway, prompt() fallback handles it.
      shareBtn.hidden = false;
      shareBtn.onclick = copy;
    }
  })();

  const existing = load();
  if (existing && existing.birth_id) {
    post("/birth/status", { record: existing }).then((s) => {
      show(s.state || existing.state);
    });
  } else {
    show("IDLE");
  }
})();
