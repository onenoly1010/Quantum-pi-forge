export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Method not allowed. Use POST.", { status: 405 });
    }

    let input;
    try {
      const body = await request.json();
      input = body.input;
      if (!input || typeof input !== "string") {
        throw new Error("Missing or invalid 'input' field");
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid JSON or missing input" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // === AI Call ===
    let output = "No output generated";
    try {
      const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: input }],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!aiRes.ok) {
        throw new Error(`AI request failed: ${aiRes.status}`);
      }

      const aiData = await aiRes.json();
      output = aiData.choices?.[0]?.message?.content?.trim() || "No output";
    } catch (aiErr) {
      console.error("AI call failed:", aiErr);
      output = `AI error: ${aiErr.message}`;
    }

    // === Store in KV ===
    const id = crypto.randomUUID();
    const record = {
      id,
      input,
      output,
      timestamp: Date.now(),
    };

    try {
      await env.MEMORY.put(id, JSON.stringify(record), {
        expirationTtl: 60 * 60 * 24 * 7,
      });
    } catch (kvErr) {
      console.error("KV write failed:", kvErr);
    }

    return new Response(JSON.stringify({ id, output, timestamp: record.timestamp }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};