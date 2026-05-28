import dotenv from "dotenv";

dotenv.config();

const ROUTER_URL = process.env.OG_COMPUTE_ROUTER_URL || "https://router-api.0g.ai/v1";
const API_KEY = process.env.OG_COMPUTE_API_KEY || "";
const MODEL = process.env.OG_COMPUTE_MODEL || "0GM-1.0-35B-A3B";

const prompt = process.argv.slice(2).join(" ").trim() || `
You are validating OINIO's router-less 0G Aristotle deployment architecture.

Summarize this architecture in 5 concise bullets:
- OINIO base contract is deployed on 0G Aristotle
- EVM liquidity router is optional and not configured
- 0G Compute Router is an API path, not an EVM router
- Deployment is manifest-gated
- Compute queries must not require PRIVATE_KEY
`;

async function main() {
  console.log("=== 0G Compute model query ===");
  console.log("Mode: READ ONLY — no EVM transactions will be sent\n");

  console.log(`Router URL: ${ROUTER_URL}`);
  console.log(`Model: ${MODEL}`);
  console.log(`API key present: ${API_KEY ? "YES" : "NO"}`);

  const url = `${ROUTER_URL.replace(/\/$/, "")}/chat/completions`;

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  if (API_KEY) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }

  const body = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: "You are a concise deployment verification assistant. Do not claim any blockchain write occurred."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2,
    max_tokens: 500
  };

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  console.log(`HTTP status: ${res.status}`);

  const text = await res.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    console.log(text.slice(0, 1200));
    process.exit(res.ok ? 0 : 1);
  }

  if (!res.ok) {
    console.log("Compute router responded, but query was not accepted.");
    console.log("This may require OG_COMPUTE_API_KEY or a different OG_COMPUTE_MODEL.");
    console.log(JSON.stringify(data, null, 2).slice(0, 2000));
    process.exit(0);
  }

  const answer =
    data?.choices?.[0]?.message?.content ??
    data?.choices?.[0]?.text ??
    JSON.stringify(data, null, 2);

  console.log("\n=== model response ===");
  console.log(answer);
}

main().catch((err) => {
  console.error("\n❌ 0G Compute model query failed:");
  console.error(err.message || err);
  process.exit(1);
});
