export const metadata = {
  title: "What Quantum Pi Forge Does",
  description: "A plain-language doorway explaining Quantum Pi Forge as a public proof engine for digital launches."
};

export default function WhatItDoesPage() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,#050816,#0b1020 55%,#111827)",
      color: "#f8fafc",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
      padding: "48px 20px"
    }}>
      <section style={{
        maxWidth: "980px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <p style={{
          color: "#93c5fd",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontSize: "0.82rem"
        }}>
          Plain-English Doorway
        </p>

        <h1 style={{
          fontSize: "clamp(2.2rem, 6vw, 5rem)",
          lineHeight: 1,
          margin: "18px 0",
          letterSpacing: "-0.05em"
        }}>
          Quantum Pi Forge is a public proof engine for digital launches.
        </h1>

        <p style={{
          maxWidth: "760px",
          margin: "0 auto",
          color: "#cbd5e1",
          fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
          lineHeight: 1.55
        }}>
          It shows what was built, what was verified, what is locked, and what still requires approval before anything goes live.
        </p>

        <div style={{
          margin: "42px auto 0",
          display: "flex",
          gap: "14px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <a href="#live-proof" style={buttonPrimary}>See the simple proof flow</a>
          <a href="https://github.com/onenoly1010/Quantum-pi-forge" style={buttonSecondary}>Open the evidence repo</a>
        </div>
      </section>

      <section id="live-proof" style={{
        maxWidth: "980px",
        margin: "64px auto 0",
        background: "rgba(15,23,42,0.82)",
        border: "1px solid rgba(148,163,184,0.25)",
        borderRadius: "28px",
        padding: "28px",
        boxShadow: "0 24px 80px rgba(0,0,0,0.35)"
      }}>
        <h2 style={{
          fontSize: "clamp(1.7rem, 4vw, 2.7rem)",
          margin: "0 0 12px",
          letterSpacing: "-0.04em"
        }}>
          Think of it like a black box flight recorder for a launch.
        </h2>

        <p style={{
          color: "#cbd5e1",
          fontSize: "1.08rem",
          lineHeight: 1.6,
          marginBottom: "30px"
        }}>
          Digital projects can change files quietly, make unproven claims, or launch with hidden steps.
          Quantum Pi Forge creates a visible proof trail first, so people can inspect the state before activation.
        </p>

        <div style={flowWrap}>
          <FlowStep title="Builder" text="Creates the system and commits the work." />
          <Arrow />
          <FlowStep title="Proof Receipts" text="Records what was checked and what the result was." />
          <Arrow />
          <FlowStep title="Public Review" text="Lets outside people inspect the evidence." />
          <Arrow />
          <FlowStep title="Operator Approval" text="Requires explicit human approval for the next move." />
          <Arrow />
          <FlowStep title="Activation" text="Only happens after proofs and approval are clear." />
        </div>
      </section>

      <section style={{
        maxWidth: "980px",
        margin: "34px auto 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
        gap: "18px"
      }}>
        <InfoCard title="What problem does it solve?"
          text="It makes it harder for a project to claim it is ready when the evidence is missing, changed, or hidden." />
        <InfoCard title="What can someone check?"
          text="They can check the repo state, verification commands, receipts, locked status, and whether execution has happened." />
        <InfoCard title="Why does it matter?"
          text="Because trust should not depend only on promises. It should be backed by public, repeatable proof." />
      </section>

      <section style={{
        maxWidth: "980px",
        margin: "34px auto 0",
        padding: "26px",
        borderRadius: "24px",
        background: "rgba(30,41,59,0.72)",
        border: "1px solid rgba(148,163,184,0.22)"
      }}>
        <h2 style={{ marginTop: 0, fontSize: "1.6rem" }}>One-minute explanation</h2>
        <p style={{ color: "#cbd5e1", lineHeight: 1.65, fontSize: "1.06rem" }}>
          Quantum Pi Forge is for people who want to prove a digital system was built, checked, and held in a locked state before launch.
          Instead of saying “trust me,” it creates a public trail showing what happened, what passed, what is still blocked, and who must approve the next step.
        </p>
      </section>
    </main>
  );
}

function FlowStep({ title, text }) {
  return (
    <div style={{
      flex: "1 1 150px",
      minWidth: "150px",
      background: "rgba(2,6,23,0.85)",
      border: "1px solid rgba(96,165,250,0.35)",
      borderRadius: "20px",
      padding: "18px",
      textAlign: "center"
    }}>
      <h3 style={{ margin: "0 0 8px", color: "#bfdbfe" }}>{title}</h3>
      <p style={{ margin: 0, color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.45 }}>{text}</p>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#60a5fa",
      fontSize: "1.8rem",
      fontWeight: 800
    }}>
      →
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <article style={{
      padding: "22px",
      borderRadius: "22px",
      background: "rgba(15,23,42,0.8)",
      border: "1px solid rgba(148,163,184,0.2)"
    }}>
      <h3 style={{ marginTop: 0, color: "#e0f2fe" }}>{title}</h3>
      <p style={{ color: "#cbd5e1", lineHeight: 1.55, marginBottom: 0 }}>{text}</p>
    </article>
  );
}

const buttonPrimary = {
  display: "inline-block",
  padding: "13px 18px",
  borderRadius: "999px",
  background: "#f8fafc",
  color: "#020617",
  fontWeight: 800,
  textDecoration: "none"
};

const buttonSecondary = {
  display: "inline-block",
  padding: "13px 18px",
  borderRadius: "999px",
  background: "transparent",
  color: "#f8fafc",
  fontWeight: 800,
  textDecoration: "none",
  border: "1px solid rgba(248,250,252,0.35)"
};

const flowWrap = {
  display: "flex",
  alignItems: "stretch",
  justifyContent: "center",
  gap: "12px",
  flexWrap: "wrap"
};
