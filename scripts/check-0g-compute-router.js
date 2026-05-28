import dotenv from "dotenv";

dotenv.config();

const ROUTER_URL = process.env.OG_COMPUTE_ROUTER_URL || "https://router-api.0g.ai/v1";
const API_KEY = process.env.OG_COMPUTE_API_KEY || "";

async function main() {
  console.log("=== 0G Compute Router check ===");
  console.log("Mode: READ ONLY — no EVM transactions will be sent\n");

  console.log(`Router URL: ${ROUTER_URL}`);
  console.log(`API key present: ${API_KEY ? "YES" : "NO"}`);

  const url = `${ROUTER_URL.replace(/\/$/, "")}/models`;

  const headers = {
    "Accept": "application/json"
  };

  if (API_KEY) {
    headers.Authorization = `Bearer ${API_KEY}`;
  }

  const res = await fetch(url, { method: "GET", headers });

  console.log(`HTTP status: ${res.status}`);

  const text = await res.text();
  let body;

  try {
    body = JSON.parse(text);
  } catch {
    body = text.slice(0, 500);
  }

  if (!res.ok) {
    console.log("Router responded, but request was not accepted.");
    console.log("This may be expected if OG_COMPUTE_API_KEY is missing or invalid.");
    console.log(body);
    process.exit(0);
  }

  console.log("Router responded successfully.");

  if (Array.isArray(body?.data)) {
    console.log(`Models returned: ${body.data.length}`);
    for (const model of body.data.slice(0, 10)) {
      console.log(`- ${model.id || model.name || JSON.stringify(model).slice(0, 120)}`);
    }
  } else {
    console.log(body);
  }
}

main().catch((err) => {
  console.error("\n❌ Compute router check failed:");
  console.error(err.message || err);
  process.exit(1);
});
