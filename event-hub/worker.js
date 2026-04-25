let latestState = {
  totalSupply: 0,
  blockNumber: 0,
  updatedAt: 0,
  lastBlockTime: 0
};

const subscribers = new Set();

const CACHE = {
  state: null,
  timestamp: 0
};

function broadcast(event, data) {
  for (const fn of subscribers) {
    try {
      fn(event, data);
    } catch (e) {
      subscribers.delete(fn);
    }
  }
}

function handleSSE(request, env) {
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  function send(event, data) {
    writer.write(
      encoder.encode(
        `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`
      )
    );
  }

  // Send latest cached state immediately on connect
  send("init", {
    status: "connected",
    ts: Date.now(),
    latestState: CACHE.state
  });

  // Register subscriber
  subscribers.add(send);

  // Cleanup on disconnect
  request.signal.addEventListener("abort", () => {
    subscribers.delete(send);
    writer.close().catch(() => {});
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

async function handlePublish(request, env) {
  // Simple auth check for producers
  const authHeader = request.headers.get("Authorization");
  if (authHeader !== `Bearer ${env.PUBLISH_TOKEN}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = await request.json();

  if (body.type === "chain:update") {
    latestState = {
      ...latestState,
      ...body.data,
      updatedAt: Date.now()
    };

    CACHE.state = latestState;
    CACHE.timestamp = Date.now();

    broadcast("chain:update", latestState);
  }

  if (body.type === "chain:error") {
    broadcast("chain:error", body.data);
  }

  return new Response("ok", { status: 200 });
}

function handleWebSocket(request, env) {
  const upgradeHeader = request.headers.get("Upgrade");
  if (upgradeHeader !== "websocket") {
    return new Response("Expected websocket", { status: 400 });
  }

  const pair = new WebSocketPair();
  const [client, server] = Object.values(pair);

  server.accept();

  const subscriber = (event, data) => {
    server.send(JSON.stringify({ event, data }));
  };

  subscribers.add(subscriber);

  server.addEventListener("close", () => {
    subscribers.delete(subscriber);
  });

  // Send initial state
  server.send(JSON.stringify({
    event: "init",
    data: {
      status: "connected",
      ts: Date.now(),
      latestState: CACHE.state
    }
  }));

  return new Response(null, { status: 101, webSocket: client });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    if (url.pathname === "/events") {
      return handleSSE(request, env);
    }

    if (url.pathname === "/publish") {
      return handlePublish(request, env);
    }

    if (url.pathname === "/ws") {
      return handleWebSocket(request, env);
    }

    if (url.pathname === "/status") {
      return Response.json({
        status: "online",
        subscribers: subscribers.size,
        lastUpdate: CACHE.timestamp,
        uptime: process.uptime()
      });
    }

    return new Response("OINIO Edge Event Hub", {
      headers: { "Content-Type": "text/plain" }
    });
  }
};